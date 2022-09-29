// this will contain the recipe object and the controller will take the recipe out if here
import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { getJSON } from './helpers';

export const state = {
	recipe: {},
	search: {
		query: '',
		results: [],
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
		console.error(`${err}💥`);
		throw err;
	}
};
