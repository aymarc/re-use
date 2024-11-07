export class AlaanuDropdown extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._data = [];
        this._displayKey = '';
        this._valueKey = '';
        this._icon = '&#x25BC;'; // default arrow-down icon
        this._customStyle = '';
        this._fontColor = '#000';
        this._fontSize = '16px';
        this._bgColor = '#fff';
        this._bdColor = '#ccc';
        this.render();
    }

    static get observedAttributes() {
        return ['data', 'displaykey', 'valuekey', 'icon', 'style', 'fontcolor', 'fontsize', 'bgcolor', 'bdcolor'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'data':
                this._data = JSON.parse(newValue);
                break;
            case 'displaykey':
                this._displayKey = newValue;
                break;
            case 'valuekey':
                this._valueKey = newValue;
                break;
            case 'icon':
                this._icon = newValue.includes('fa') ? `<i class="${newValue}"></i>` : newValue;
                break;
            case 'style':
                this._customStyle = newValue;
                break;
            case 'fontcolor':
                this._fontColor = newValue;
                break;
            case 'fontsize':
                this._fontSize = newValue;
                break;
            case 'bgcolor':
                this._bgColor = newValue;
                break;
            case 'bdcolor':
                this._bdColor = newValue;
                break;
        }
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .dropdown-container {
                    position: relative;
                    display: inline-block;
                    width: 200px;
                    background-color: ${this._bgColor};
                    border: 1px solid ${this._bdColor};
                }
                .dropdown-input {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 5px;
                    border: 1px solid ${this._bdColor};
                    border-radius: 4px;
                    color: ${this._fontColor};
                    font-size: ${this._fontSize};
                    background-color: ${this._bgColor};
                }
                .dropdown-list {
                    position: absolute;
                    width: 100%;
                    max-height: 150px;
                    overflow-y: auto;
                    border: 1px solid ${this._bdColor};
                    border-radius: 4px;
                    background-color: ${this._bgColor};
                    z-index: 1;
                    display: none;
                }
                .dropdown-item {
                    padding: 5px;
                    cursor: pointer;
                    color: ${this._fontColor};
                    font-size: ${this._fontSize};
                }
                .dropdown-item:hover {
                    background-color: #f1f1f1;
                }
                .icon {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: pointer;
                }
                .item-text {
                    font-size: 8px;
                    display: block;
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                ${this._customStyle}
            </style>
            <div class="dropdown-container">
                <input type="text" class="dropdown-input">
                <div class="icon">${this._icon}</div>
                <div class="dropdown-list"></div>
            </div>
        `;

        this.inputElement = this.shadowRoot.querySelector('.dropdown-input');
        this.dropdownList = this.shadowRoot.querySelector('.dropdown-list');
        this.iconElement = this.shadowRoot.querySelector('.icon');

        this.inputElement.addEventListener('focus', () => this.showDropdown());
        this.inputElement.addEventListener('blur', () => this.hideDropdown());
        this.iconElement.addEventListener('click', () => this.toggleDropdown());

        this.populateDropdown();
    }

    populateDropdown() {
        this.dropdownList.innerHTML = '';
        const items = this._data.map(item => {
            const value = typeof item === 'string' ? item : item[this._valueKey];
            const displayValue = typeof item === 'string' ? item : item[this._displayKey];
            const displayText = displayValue.length > 10 ? `${displayValue.slice(0, 10)}...` : displayValue;

            const div = document.createElement('div');
            div.classList.add('dropdown-item');
            div.dataset.value = value;
            div.innerHTML = `<span class="item-text">${displayText.toUpperCase()}</span>`;
            div.addEventListener('mousedown', (e) => this.selectItem(e));

            return div;
        });

        items.forEach(item => this.dropdownList.appendChild(item));
    }

    selectItem(event) {
        const value = event.target.closest('.dropdown-item').dataset.value;
        this.inputElement.value = value;
        this.dispatchEvent(new CustomEvent('change', { detail: { value } }));
        this.hideDropdown();
    }

    showDropdown() {
        this.dropdownList.style.display = 'block';
    }

    hideDropdown() {
        setTimeout(() => {
            this.dropdownList.style.display = 'none';
        }, 200); // delay to allow item selection
    }

    toggleDropdown() {
        if (this.dropdownList.style.display === 'block') {
            this.hideDropdown();
        } else {
            this.showDropdown();
        }
    }
}

