import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import * as model from './model';
import recipeView from './views/recipeVew';
import searchView from './views/searchView';
import resultView from './views/resultView';

// parcel
if (module.hot) {
	module.hot.accept();
}

const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;
		recipeView.renderSpinner();
		await model.loadRecipe(id);
		//adding data to object in view
		recipeView.render(model.state.recipe);
		// rendering recipe
	} catch (err) {
		recipeView.renderError();
	}
};
// add search result controller
const controlSearchResults = async function () {
	try {
		// load spinner
		resultView.renderSpinner();
		// get search query
		const query = searchView.getQuery();
		if (!query) return;
		// load search query
		await model.loadSearchResults(query);
		// render results
		resultView.render(model.state.search.results);
	} catch (err) {
		console.log(err);
		throw err;
	}
};
const init = function () {
	recipeView.addHandlerRender(controlRecipes);
	searchView.addHandlerSearch(controlSearchResults);
};

init();
