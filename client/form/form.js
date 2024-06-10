
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

//swiper
class AlaanuSwiperSample extends HTMLElement {
    /**
    * #Description: Swiper element is a selector which value is determine by dragging a knob (from its initial value zero)
    *               to the value the user wants. However, that value can not exceeds the maximum value specified.
    * #Input:
    *      @max : {description: "Maximum number the swiper can get to. Default is hundred", type: "number", access: "public"},
    *      @min : {description: "Minimum number  the swiper can get to. Default is 0", type: "number", access: "public"},
    *      @color_default : {description: "Default color the swiper when knob is at zero.", type: "string", access: "public"},
    *      @color_onselect : {description: "Color the swiper has when know is higher than zero", type: string},
    *      @maxunit : {description: "The unit to be associated to the values on the swiper.", type: string},
    *      @range : {description: "When selected the swiper will have two knobs. And the user will be able to select two values: the from-value and the to-value ", type: boolean},
    *      @width : {description: "The length of the swiper", type: "number", access="public"} 
    *      @height : {description: "The height of the swiper", type: "number", access="public"} 
    * #Output: 
    *      Custom Html element
    */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._max = 100;
        this._min = 0;
        this._color_default = "";
        this._color_onselect = "";
        this._maxunit = "L";
        this._range = "false";
        this.render();
    }

    static get observedAttributes() {
        return ["max", "min", "maxunit", "range"];
    }

    attributeChangeCallback(name, oldValue, newValue) {
        switch (name) {
            case "max":
                this._max = newValue;
                break;
            case "min":
                this._min = newValue;
                break;
            case "maxunit":
                this._maxunit = newValue;
                break;
            case "range":
                this._range = newValue;
                break;
            default:
                break;
        }
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = "";
        const style = ``;
        const swiperWrapper = document.createElement("div");

    }
}

class AlaanuSwiper extends HTMLElement {
    /**
     * #Description: Swiper element is a selector whose value is determined by dragging a knob (from its initial value zero)
     *               to the value the user wants. However, that value cannot exceed the maximum value specified.
     * #Input:
     *      @max : {description: "Maximum number the swiper can get to. Default is hundred", type: "number", access: "public"},
     *      @min : {description: "Minimum number the swiper can get to. Default is 0", type: "number", access: "public"},
     *      @color_default : {description: "Default color the swiper when the knob is at zero.", type: "string", access: "public"},
     *      @color_onselect : {description: "Color the swiper has when the knob is higher than zero", type: string},
     *      @maxunit : {description: "The unit to be associated with the values on the swiper.", type: string},
     *      @range : {description: "When selected the swiper will have two knobs. And the user will be able to select two values: the from-value and the to-value ", type: boolean},
     *      @width : {description: "The length of the swiper", type: "number", access="public"} 
     *      @height : {description: "The height of the swiper", type: "number", access="public"} 
     * #Output: 
     *      Custom Html element
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._max = 100;
        this._min = 0;
        this._color_default = "#ddd";
        this._color_onselect = "#2196F3";
        this._maxunit = "";
        this._range = false;
        this._width = 100;
        this._height = 10;
        this._value = this._min;
        this._value2 = this._max;

        this.render();
    }

    static get observedAttributes() {
        return ["max", "min", "color_default", "color_onselect", "maxunit", "range", "width", "height"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "max":
                this._max = parseInt(newValue);
                break;
            case "min":
                this._min = parseInt(newValue);
                break;
            case "color_default":
                this._color_default = newValue;
                break;
            case "color_onselect":
                this._color_onselect = newValue;
                break;
            case "maxunit":
                this._maxunit = newValue;
                break;
            case "range":
                this._range = newValue === "true";
                break;
            case "width":
                this._width = parseInt(newValue);
                break;
            case "height":
                let newHeight = parseInt(newValue);
                if (newHeight > 40) {
                    newHeight = 40;
                    console.error("Error in size: The maximum height 'aln-swiper can have is 40px.")
                }
                this._height = newHeight;
                break;
            default:
                break;
        }
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = "";

        const style = document.createElement('style');
        //const gradientColor = `linear-gradient(to left,  ${this._color_onselect}, #F0F0F0)`;
        const gradientColor = `linear-gradient(to left,  ${this._color_onselect} 2%, #F0F0F0 97%)`;
        const swiperColor = this._range ? this._color_onselect : this._color_onselect;
        let knobPos = 0
        if (this._height <= 10) {
            knobPos = 0;
        } else if (this._height > 10 && this._height <= 20) {
            knobPos = 4;
        } else if (this._height > 20 && this._height <= 30) {
            knobPos = 6;
        } else if (this._height > 30) {
            knobPos = 8;
        }
        style.textContent = `
            .swiper-wrapper {
                position: relative;
                display:flex;
                flex-direction: row;  
                width: ${this._width + 63}px;
                height: ${this._height + 15}px;  
                align-items: flex-end; 
                margin: 7px 0px 0px 0px;    
            }
            .swiper-area{
                position: relative;
                width: ${this._width}px;
                height: ${this._height}px;
                background-color: ${this._color_default};
                z-index: 2;
            }
            .swiper-progress {
                position: absolute;
                height: 100%;
                background-color:  ${swiperColor};
                background-image:  ${swiperColor};
                box-shadow: 1px 0px 1px 0px ${this._color_onselect}, -1px 0px 1px 0px ${this._color_onselect};
                display: flex;
                z-index:0;
                cursor: pointer;
            }
            .knob {
                position: absolute;
                top: ${knobPos}px;
                width: 6px;
                height: ${this._height + 4}px;
                background-color: #fff;
                border: 1px solid ${this._color_onselect};
                cursor: pointer;
                transform: translate(-50%, -25%);
            }
            .knob:hover{
                 border: 2px solid ${this._color_onselect};
                 cursor: pointer;
            }
            .label {
                display: flex;
                justify-content: space-between;
                width: ${this._width + 60}px;
                height: ${this._height}px;
                position: relative;
                left: -5px;
                top: 3px;
                opacity:0;
                z-index:-1;
                font-size:14px;
            }
            .value-label {
                position: absolute;
                top: -2px;
                left: -2px;
                min-width: ${this._width / 2}px;
                font-size:12px;
                font-weight:bold;
                opacity: 0.6;
            }
        `;

        const swiperWrapper = document.createElement("div");
        swiperWrapper.classList.add("swiper-wrapper");
        const swiperArea = document.createElement("div");
        swiperArea.classList.add("swiper-area");
        const progressBar = document.createElement("div");
        progressBar.classList.add("swiper-progress");

        const knob = document.createElement("div");
        knob.classList.add("knob");
        knob.style.left = '0%';

        swiperArea.appendChild(progressBar);
        swiperArea.appendChild(knob);

        if (this._range) {
            const knob2 = document.createElement("div");
            knob2.classList.add("knob");
            knob2.style.left = '100%';
            swiperArea.appendChild(knob2);
            knob2.addEventListener("mousedown", this.startDrag.bind(this, knob2, true));
        }

        knob.addEventListener("mousedown", this.startDrag.bind(this, knob, false));

        const labelWrapper = document.createElement("div");
        labelWrapper.classList.add("label");

        const minLabel = document.createElement("span");
        minLabel.textContent = this._min;

        const maxLabel = document.createElement("span");
        maxLabel.textContent = `${this._max} ${this._maxunit}`;

        labelWrapper.appendChild(minLabel);
        labelWrapper.appendChild(maxLabel);


        const valueLabel = document.createElement("div");
        valueLabel.classList.add("value-label");
        valueLabel.textContent = `${this._value} ${this._maxunit}`;
        swiperWrapper.append(swiperArea);
        swiperWrapper.append(valueLabel);
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(swiperWrapper);
    }



    startDrag(knob, isSecondKnob, event) {
        event.preventDefault();
        const onMouseMove = (e) => {
            const rect = this.shadowRoot.querySelector(".swiper-area").getBoundingClientRect();
            let value = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width * (this._max - this._min) + this._min;
            if (isSecondKnob) {
                this._value2 = Math.round(value);
                this.updateKnob(knob, this._value2);
            } else {
                this._value = Math.round(value);
                this.updateKnob(knob, this._value);
            }
            this.updateProgress();
            this.updateValueLabel();
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    updateKnob(knob, value) {
        const percentage = ((value - this._min) / (this._max - this._min)) * 100;
        knob.style.left = `${percentage}%`;
    }

    updateProgress() {
        const progress = this.shadowRoot.querySelector(".swiper-progress");
        if (this._range) {
            const minPercentage = ((this._value - this._min) / (this._max - this._min)) * 100;
            const maxPercentage = ((this._value2 - this._min) / (this._max - this._min)) * 100;
            progress.style.left = `${minPercentage}%`;
            progress.style.width = `${maxPercentage - minPercentage}%`;
        } else {
            const percentage = ((this._value - this._min) / (this._max - this._min)) * 100;
            progress.style.width = `${percentage}%`;
        }
    }

    updateValueLabel() {
        const valueLabel = this.shadowRoot.querySelector(".value-label");
        if (this._range) {
            valueLabel.textContent = `${this._value} - ${this._value2} ${this._maxunit}`;
        } else {
            valueLabel.textContent = `${this._value} ${this._maxunit}`;
        }
    }
}

customElements.define('aln-swiper', AlaanuSwiper);

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
         *    type: "text" | "secret" | "email" | "star" | "swiper" | "time" | "datetime" | "date" | "select" | "checkbox" | "image" | "file" | "code_scanner" 
         *    property: "multi" | "number" | "search" | "tags" | "barcode" | "qr" | "max" | "min" | "width" | "height" | "color-onselect" | "color-default" | "style" | "dark-mode"
         *  }
         * ]
         */

    }
}