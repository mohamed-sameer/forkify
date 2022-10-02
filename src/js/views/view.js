import icons from 'url:../../img/icons.svg';

export default class View {
	_data;
	// creating a public method to receive passed data from controller
	render(data) {
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderError();

		this._data = data;
		const markup = this._generateMarkup();
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	// update
	update(data) {
		// once we update the date then we want the new data become the data
		this._data = data;
		// new markup
		const newMarkup = this._generateMarkup();
		// create a new DOM (lives) in the memory
		// these methods will convert a string to a real DOM object
		const newDOM = document.createRange().createContextualFragment(newMarkup);
		const newElements = Array.from(newDOM.querySelectorAll('*'));
		const currElements = Array.from(this._parentElement.querySelectorAll('*'));
		//comparing new markup with the old markup and then update the changed value
		// the comparison is done one by one
		newElements.forEach((newEl, i) => {
			const currEl = currElements[i];
			//update changed text
			// comparing currEl with newEl by using isEqualNode()
			// to solve this you need to select the child node and apply the nodeValue() method on it
			if (
				!newEl.isEqualNode(currEl) &&
				newEl.firstChild?.nodeValue.trim() !== ''
			) {
				// the problem about this => the it will remove all the content inside the element and replace it
				// updating the text only
				currEl.textContent = newEl.textContent;
			}
			// update changed attribute
			if (!newEl.isEqualNode(currEl)) {
				Array.from(newEl.attributes).forEach((attr) =>
					currEl.setAttribute(attr.name, attr.value)
				);
			}
		});
	}
	// clearing
	_clear() {
		this._parentElement.innerHTML = '';
	}
	// all it does is to return an html string

	renderSpinner() {
		const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}
	renderError(message = this._errorMessage) {
		const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div> 
    `;
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	renderMessage(message = this._message) {
		const markup = `
    <div class="message">
					<div>
						<svg>
							<use href="${icons}#icon-smile"></use>
						</svg>
					</div>
					<p>${message}</p>
				</div>
    `;
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}
}
