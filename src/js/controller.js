import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import * as model from './model';
import recipeView from './views/recipeVew';
import searchView from './views/searchView';
import resultView from './views/resultView';
import paginationView from './views/paginationView';

// parcel
if (module.hot) {
	module.hot.accept();
}

const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;
		recipeView.renderSpinner();
		// update results view to mark selected element
		resultView.update(model.getSearchResultsPage());
		// load recipe
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
		resultView.render(model.getSearchResultsPage());
		// render the initial pagination buttons
		paginationView.render(model.state.search);
	} catch (err) {
		throw err;
	}
};

const controlPagination = function (goToPage) {
	// render new results
	resultView.render(model.getSearchResultsPage(goToPage));
	// render new pagination buttons
	paginationView.render(model.state.search);
};

// adding handler to servings buttons
const controlServings = function (newServings) {
	// update the recipe servings in the sate
	model.updateServings(newServings);

	// update the view again
	// recipeView.render(model.state.recipe);
	// not rerender the view
	recipeView.update(model.state.recipe);
};
const init = function () {
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
};

init();
