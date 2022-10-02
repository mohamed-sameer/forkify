import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import * as model from './model';
import recipeView from './views/recipeVew';
import searchView from './views/searchView';
import resultView from './views/resultView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';

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
		//update bookmark list
		bookmarksView.update(model.state.bookMarks);
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

// adding bookMark controller
const controlAddBookMark = function () {
	// add/remove bookmarks
	if (!model.state.recipe.bookMarked) model.addBookMark(model.state.recipe);
	else model.deleteBookMark(model.state.recipe.id);
	// update recipe view
	recipeView.update(model.state.recipe);

	// render bookmarks
	bookmarksView.render(model.state.bookMarks);
};

const controlBookmarks = function () {
	bookmarksView.render(model.state.bookMarks);
};

// add recipe controller
const controlAddRecipe = async function (newRecipe) {
	// console.log(newRecipe);
	try {
		// add spinner
		addRecipeView.renderSpinner();
		// upload recipe
		await model.uploadRecipe(newRecipe);
		// render recipe
		recipeView.render(model.state.recipe);

		// success message
		addRecipeView.renderMessage();
		//render bookmark view
		bookmarksView.render(model.state.bookmarks);
		//change id in URL
		window.history.pushState(null, '', `#${model.state.recipe.id}`);
		// close form window
		setTimeout(function () {
			addRecipeView.toggleWindow();
		}, MODAL_CLOSE_SEC * 1000);
	} catch (err) {
		console.log(err);
		addRecipeView.renderError(err.message);
	}
};
const init = function () {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookMark(controlAddBookMark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
