// this will contain the recipe object and the controller will take the recipe out if here
import { async } from 'regenerator-runtime';
import { API_URL, RES_PRE_PAGE } from './config';
import { getJSON } from './helpers';

export const state = {
	recipe: {},
	search: {
		query: '',
		results: [],
		page: 1,
		resultsPerPage: RES_PRE_PAGE,
	},
};

// this is the function that is responsible of fetching data
export const loadRecipe = async function (id) {
	try {
		const data = await getJSON(`${API_URL}${id}`);
		const { recipe } = data.data;
		state.recipe = {
			id: recipe.id,
			title: recipe.title,
			publisher: recipe.publisher,
			sourceUrl: recipe.source_url,
			image: recipe.image_url,
			ingredients: recipe.ingredients,
			cookingTime: recipe.cooking_time,
			servings: recipe.servings,
		};
	} catch (err) {
		console.error(`${err}💥`);
		throw err;
	}
};
export const loadSearchResults = async function (query) {
	try {
		// store query in the stat class 👆
		state.search.query = query;
		const data = await getJSON(`${API_URL}?search=${query}`);
		state.search.results = data.data.recipes.map((rec) => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url,
			};
		});
	} catch (err) {
		throw err;
	}
};

export const getSearchResultsPage = function (page = state.search.page) {
	state.search.page = page;
	const start = (page - 1) * state.search.resultsPerPage;
	const end = page * state.search.resultsPerPage;
	return state.search.results.slice(start, end);
};

// this is responsible about updating servings
export const updateServings = function (newServings) {
	// reach into state and update the state and then change the quantity of each ingredient
	state.recipe.ingredients.forEach((ing) => {
		ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
	});

	// update serving in the state
	state.recipe.servings = newServings;
};
