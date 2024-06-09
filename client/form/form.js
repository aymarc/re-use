
/**
 * #Description: 
 *      An element that aims to ease the usage of forms in web apps.
 *      It can generate the form itself from a config. And whether generated
 *      or existing, the form will utilize the AllaanuFormHandler utility to 
 *      validate and submit the form to a specified server in the configuration.
 * 
 * #Inputs: 
 *      @genConfig : {
 *                     description: "Form configuration used to define what element to include in the form generated.", 
 *                     type: json
 *                    },
 *      @targetById : { 
 *                      description: "Reference the forms that the script will handle. Multiple forms can be referenced. E.g: ['form1', 'form2', 'form3']"
 *                      type: array
 *                     },
 *      @targetByClass :{ 
 *                       description: "Reference the forms that the script will handle.",
 *                       type: string
 *                     },
 *      @action :{
 *                 description: "Reference the url / server endpoint which the form data is submitted to.",
 *                 type: string
 *               },
 *      @method :{
 *                 description: "Define the request type used to send forms data",
 *                 type: string
 *               }
 *  
 * #Output: 
 *      1- A custom Html element
 *      2- Script only
 */

class AlaanuStar extends HTMLElement {
    /**
     * #Description: Star element is a rating element that show stars and the user can click to 
     *              select any number he/she wants
     * #Input:
     *      @max : {description: "Maximum number of stars to render. Default is five", type: "number", access: "public"},
     *      @min : {description: "Minimum number of stars to render. Default is two", type: "number", access: "public"},
     *      @color_default : {description: "Default color the stars have when they are not selected.", type: "string", access: "public"},
     *      @color_onselect : {description: "Color the stars have when they are selected", type: string},
     *      @size : {description: "The size of the stars in pixel", type: "number", access="public"} 
     * #Output: 
     *      Custom Html element
     */
    #defaultSize = 16;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._max = 5;
        this._min = 2;
        this._color_default = '#ccc';
        this._color_onselect = '#f39c12';
        this._size = 24;
        this._value = 0;
        this.render();
    }

    static get observedAttributes() {
        return ['max', 'min', 'color_default', 'color_onselect', 'size'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'max':
                this._max = parseInt(newValue);
                break;
            case 'min':
                this._min = parseInt(newValue);
                break;
            case 'color_default':
                this._color_default = newValue;
                break;
            case 'color_onselect':
                this._color_onselect = newValue;
                break;
            case 'size':
                this._size = parseInt(newValue);
                break;
        }
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = '';
        const style = document.createElement('style');
        const sizeToEm = this._size / this.#defaultSize;
        style.textContent = `
            .star-wrapper{
                display:flex;
                flex-direction: row;
                height: ${this._size + 10}px;
                width: ${this._size * this._max}px;
                padding:2px;
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            .star {
                --star-color:orange;
                display: inline-block;
                margin: 5px auto;
                font-size: ${sizeToEm}em;
                position: relative;
                display: block;
                width: 0px;
                height: 0px;
                border-right: 1em solid transparent;
                border-bottom: 0.7em solid ${this._color_default};
                border-left: 1em solid transparent;
                transform: rotate(35deg);
            }
            .star:before {
                border-bottom: 0.8em solid ${this._color_default};
                border-left: 0.3em solid transparent;
                border-right: 0.3em solid transparent;
                position: absolute;
                height: 0;
                width: 0;
                top: -0.45em;
                left: -0.65em;
                content:"";
                transform: rotate(-35deg);
            }
            .star:after {
                position: absolute;
                top: 0.03em;
                left: -1.05em;
                width: 0;
                height: 0;
                border-right: 1em solid transparent;
                border-bottom: 0.7em solid ${this._color_default};
                border-left: 1em solid transparent;
                transform: rotate(-70deg);
                content:"";
            }
            .star.selected {
                border-bottom-color: ${this._color_onselect};
            }

            .star.selected:before {
                border-bottom-color: ${this._color_onselect};
            }

            .star.selected:after {
                border-bottom-color: ${this._color_onselect};
            }
        `;
        this.shadowRoot.appendChild(style);
        const starWrapper = document.createElement("div");
        starWrapper.classList.add("star-wrapper")
        for (let i = 1; i <= this._max; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            star.dataset.value = i;
            if (i <= this._value) {
                star.classList.add('selected');
            }
            star.addEventListener('click', this.selectStar.bind(this));
            starWrapper.appendChild(star);
        }
        this.shadowRoot.appendChild(starWrapper);
    }

    selectStar(event) {
        const value = parseInt(event.target.dataset.value);
        this._value = value;

        const stars = this.shadowRoot.querySelectorAll('.star');
        stars.forEach(star => {
            if (parseInt(star.dataset.value) <= value) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });

        this.dispatchEvent(new CustomEvent('change', { detail: { value } }));
    }

    get max() {
        return this._max;
    }

    set max(value) {
        this.setAttribute('max', value);
    }

    get min() {
        return this._min;
    }

    set min(value) {
        this.setAttribute('min', value);
    }

    get color_default() {
        return this._color_default;
    }

    set color_default(value) {
        this.setAttribute('color_default', value);
    }

    get color_onselect() {
        return this._color_onselect;
    }

    set color_onselect(value) {
        this.setAttribute('color_onselect', value);
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this.setAttribute('size', value);
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        this.render();
    }
}
customElements.define('aln-star', AlaanuStar);

//progress

class AlaanuForms extends HTMLElement {

    #genConfig = null;
    #targetById = [];
    #targetByClass = "";

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.form = this.#createForm(this.#genConfig);
        shadow.appendChild(this.form);
    }

    static get observedAttributes() {
        return ["genConfig", "targetById", "targetByClass"];
    }

    attributeChangeCallback(name, oldValue, newValue) {
        switch (name) {
            case "genConfig":
                this.#genConfig = newValue;
                break;
            case "targetById":
                this.#targetById = newValue;
                break;
            case "targetByClass":
                this.#targetByClass = newValue;
                break;
            default:
                break;
        }
    }

    #createForm(config) {
        /**
         * E.g:
         * [
         *  {
         *    type: "text" | "secret" | "email" | "star" | "progress" | "time" | "datetime" | "date" | "select" | "checkbox" | "image" | "file" | "code_scanner" 
         *    property: "multi" | "number" | "search" | "tags" | "barcode" | "qr" | "max" | "min" | "width" | "height" | "color-onselect" | "color-default" | "style" | "dark-mode"
         *  }
         * ]
         */

    }
}