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
	bookMarks: [],
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

		if (state.bookMarks.some((bookmark) => bookmark.id === id))
			state.recipe.bookMarked = true;
		else state.recipe.bookMarked = false;
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
		// reset page to 1 to fix the result view when searching for another recipe
		state.search.page = 1;
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

// bookmark
// save bookmark in localStorage
const persistBookmark = function () {
	localStorage.setItem('bookmarks', JSON.stringify(state.bookMarks));
};
// add a bookmark
export const addBookMark = function (recipe) {
	// add bookmark
	state.bookMarks.push(recipe);

	// mark current recipe as bookMark
	if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;
	persistBookmark();
};

// delete bookmark
export const deleteBookMark = function (id) {
	// calc the index
	const index = state.bookMarks.findIndex((el) => el.id === id);
	// delete the bookmark
	state.bookMarks.splice(index, 1);
	// delete the bookmark boolean value
	if (id === state.recipe.id) state.recipe.bookMarked = false;
	persistBookmark();
};

const init = function () {
	const storage = localStorage.getItem('bookmarks');
	if (storage) state.bookMarks = JSON.parse(storage);
};
init();
