// this will contain the recipe object and the controller will take the recipe out if here
import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { getJSON } from './helpers';

export const state = {
	recipe: {},
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
