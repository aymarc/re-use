export class AlaanuSwiper extends HTMLElement {
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


