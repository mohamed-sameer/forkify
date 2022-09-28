import * as model from './model';
import recipeView from './views/recipeVew';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
const recipeContainer = document.querySelector('.recipe');

// console.log('test again');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;
		recipeView.renderSpinner();
		await model.loadRecipe(id);
		//padding data to object in view
		recipeView.render(model.state.recipe);
		// rendering recipe
	} catch (err) {
		recipeView.renderError();
	}
};

const init = function () {
	recipeView.addHandlerRender(controlRecipes);
};

init();
