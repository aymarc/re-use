
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


class AlaanuFile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._accept = "image/*";
        this._max = 100;
        this._maxWidth = 150;
        this._maxHeight = 150;
        this._files = [];
        this.showOverlay = false;
        this.render();
    }

    static get observedAttributes() {
        return ["accept", "max", "maxwidth", "maxheight", "isround"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'accept':
                this._accept = newValue;
                break;
            case 'max':
                this._max = parseInt(newValue);
                break;
            case 'maxwidth':
                this._maxWidth = Math.min(parseInt(newValue), 200);
                break;
            case 'maxheight':
                this._maxHeight = Math.min(parseInt(newValue), 200);
                break;
        }
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = '';
        const style = document.createElement('style');
        style.textContent = `
            .file-selector {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 2px dashed #ccc;
                text-align: center;
                background-color: #f9f9f9;
                cursor: pointer;
                padding: 5px;
            }
            .multi-file {
                width: 450px;
                min-height: 300px;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
            }
            .upload-text{
                position:absolute;
                top:40%;
            }
            .thumbnail-container {
                position: relative;
                display: flex;
                overflow-x: auto;
                overflow-y: hidden;
                flex-direction: row;
                flex-wrap: nowrap;
                width: 440px;
                max-height: 160px;
                scrollbar-width: thin;
            }
       
            .thumbnail {
                position: relative;
                width: 50px;
                height: 50px;
                margin: 5px 5px 15px 5px;
                background-size: cover;
                background-position: center;
            }
             .thumbnail span {
                font-size: 8px;
                text-align: center;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                max-width: 50px;
                position: relative;
                top: 48px;
            }
            .thumbnail .close {
                position: absolute;
                top: -6px;
                right: -5px;
                background: rgb(189 188 188 / 70%);
                color: #000;
                border-radius: 50%;
                cursor: pointer;
                display: inline-block;
                width: 14px;
                height: 14px;
                font-size: 12px;
                font-weight: bold;
            }
            .thumbnail .close:hover{
                color:#ff0707;
            }

            .thumbnail.other-file{
                font-size:40px;
            }
            .thumbnail.other-file span:nth-child(2){
                position: absolute;
                top: 53px;
                left: 25%;
                font-size: 10px;
                color: #433b3b;
            }
            .preview-overlay {          
                background: rgba(151, 148, 148, 0.632);
            }
            .preview-overlay img {
                max-width: 90%;
                max-height: 90%;
            }
        `;
        this.shadowRoot.appendChild(style);

        const container = document.createElement('div');
        container.classList.add('file-selector');

        container.classList.add('multi-file');
        container.innerHTML = `
            <div class="upload-text" >Upload/Drop Files</div>
            <div class="thumbnail-container"></div>
        `;

        container.addEventListener('click', () => this.openFileDialog());
        container.addEventListener('dragover', (e) => this.onDragOver(e));
        container.addEventListener('drop', (e) => this.onDrop(e));

        this.shadowRoot.appendChild(container);

        if (this._files.length > 0) {
            this.updatePreviews();
        }
    }

    openFileDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = this._accept;
        input.multiple = this._max > 1;
        input.addEventListener('change', (e) => this.onFileSelect(e));
        input.click();
    }

    onFileSelect(event) {
        const files = event.target.files;
        if (files.length > 0) {
            this._files = this._files.concat(Array.from(files)).slice(0, this._max);
            this.render();
        }
    }

    onDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        if (!this.showOverlay) {
            this.showOverlay = true;
            const container = this.shadowRoot.querySelector(".file-selector");
            const uploadText = this.shadowRoot.querySelector(".file-selector .upload-text")
            uploadText.textContent = "Let Go!"
            uploadText.style.color = "#fff";
            uploadText.style.top = "45%";
            container.classList.add("preview-overlay");
        }

    }

    onDrop(event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        const container = this.shadowRoot.querySelector(".file-selector");
        const uploadText = this.shadowRoot.querySelector(".file-selector .upload-text")
        uploadText.textContent = "Upload/Drop Files"
        container.classList.remove("preview-overlay");
        if (files.length > 0) {
            this._files = this._files.concat(Array.from(files)).slice(0, this._max);
            this.render();
            this.showOverlay = false;
        }
    }

    updatePreviews() {
        const container = this.shadowRoot.querySelector('.thumbnail-container');
        container.innerHTML = '';
        this._files.forEach((file, index) => {
            const reader = new FileReader();
            const thumbnail = document.createElement('div');
            thumbnail.classList.add('thumbnail');

            const fileName = file.name;
            const shortName = fileName.length > 10 ? fileName.substring(0, 7) + '...' : fileName;

            if (file.type.startsWith('image/')) {
                reader.onload = (e) => {
                    thumbnail.style.backgroundImage = `url(${e.target.result})`;
                };
                reader.readAsDataURL(file);
            } else {
                thumbnail.classList.add("other-file");
                thumbnail.innerHTML = `&#128196;`;
            }

            thumbnail.innerHTML += `<span class="close" data-index="${index}">x</span>`;
            container.appendChild(thumbnail);

            if (file.type.startsWith('image/')) {
                thumbnail.addEventListener('click', () => {
                    this.openPreview(file);
                });
            }

            thumbnail.querySelector('.close').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFile(index);
            });

            const nameSpan = document.createElement('span');
            nameSpan.textContent = shortName;
            nameSpan.title = fileName;
            thumbnail.appendChild(nameSpan);
        });
    }

    removeFile(index) {
        this._files.splice(index, 1);
        this.render();
    }

    openPreview(file) {
        const overlay = document.createElement('div');
        overlay.classList.add('preview-overlay');
        const img = document.createElement('img');
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        overlay.appendChild(img);
        overlay.addEventListener('click', () => overlay.remove());
        this.shadowRoot.appendChild(overlay);
    }
}

customElements.define('aln-file', AlaanuFile);


class AlaanuProfile extends AlaanuFile {
    constructor() {
        super();
        this._max = 1;
        this._isRound = false;
        this._cropperWidth = 100;
        this._cropperHeight = 100;
        this._maxWidth = 150;
        this._maxHeight = 150;
        this.cropper = null;
        this.resizeEnable = true;
        this.hideSaveBtn = false;
        this.cancelBtnTxt = "Cancel";
        this.showCropper = this.showCropper.bind(this);
    }

    static get observedAttributes() {
        return ["accept", "max", "maxwidth", "maxheight", "isround", "croppersize"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'accept':
                this._accept = newValue;
                break;
            case 'max':
                console.info("Cannot set property max of this element");
                break;
            case 'maxwidth':
                if (parseInt(newValue) > 200) {
                    console.error("Error setting maxwidth: can not set max width higher than 200px")
                }
                this._maxWidth = parseInt(newValue) > 200 ? 200 : parseInt(newValue);
                break;
            case 'maxheight':
                this._maxHeight = parseInt(newValue) > 200 ? 200 : parseInt(newValue);
                break;
            case 'isround':
                this._isRound = newValue === "true";
                break;
            case 'croppersize':
                this._cropperWidth = parseInt(newValue);
                this._cropperHeight = parseInt(newValue);
                break;
        }
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = '';
        const style = document.createElement('style');
        style.textContent = `
            .file-selector {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #f9f9f9;
                cursor: pointer;
                max-width: ${this._maxWidth}px;
                min-height: 150px;
                padding: 5px;
                overflow: hidden;
                resize: ${this.resizeEnable ? "both" : "none"};
            }
            .single-file {
                width: ${this._cropperWidth}px;
                height: ${this._cropperHeight}px;
                background: #eee;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 2px dashed #ccc;
                overflow: hidden;
                position: relative;
                background: transparent;
            }
            .file-selector img {
                width: 100%;
                height: auto;
                position: relative;
                top: 0;
                left: 0;
                z-index: 9;
            }
            .cropper {
                position: absolute;
                width: ${this._cropperWidth}px;
                height: ${this._cropperHeight}px;
                border: 2px dashed #5fccf4;
                cursor: move;
                z-index: 10;
                background: rgba(156, 204, 233, 0.341);
            }
            .cropper.circle {
                border-radius: 50%;
            }
            .controls {
                display: flex;
                justify-content: flex-start;
                margin-top: 10px;
                max-width: ${this._maxWidth}px;
            }
            .controls button {
                padding: 5px 10px;
                cursor: pointer;
            }
            .resizer {
                width: 10px;
                height: 10px;
                background: red;
                position: absolute;
                right: 0;
                bottom: 0;
                cursor: se-resize;
            }
        `;
        this.shadowRoot.appendChild(style);

        const container = document.createElement('div');
        container.classList.add('file-selector');
        const singleFile = document.createElement("div");
        singleFile.classList.add('single-file');

        singleFile.innerHTML = `<span>Upload</span>`;
        container.addEventListener('click', this.openFileDialog.bind(this));
        container.addEventListener('dragover', this.onDragOver.bind(this));
        container.addEventListener('drop', this.onDrop.bind(this));
        container.appendChild(singleFile);
        this.shadowRoot.appendChild(container);

        if (this._files.length > 0) {
            this.showCropper(this._files[0]);
        }

        this.addResizeHandlers(container);

        const controls = document.createElement('div');
        controls.classList.add('controls');

        const saveButton = document.createElement('button');
        saveButton.classList.add("save-button");
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', () => this.saveCroppedImage(container.querySelector('img')));

        const cancelButton = document.createElement('button');
        cancelButton.classList.add("reset-button");
        cancelButton.textContent = this.cancelBtnTxt;
        cancelButton.addEventListener('click', () => this.cancelCropping());

        const resetButton = document.createElement("button");
        resetButton.textContent = "Reset";
        if (!this.hideSaveBtn) {
            controls.appendChild(saveButton);
        }
        controls.appendChild(cancelButton);
        this.shadowRoot.appendChild(controls);
    }

    openFileDialog() {
        if (this.cropper) {
            return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = this._accept;
        input.addEventListener('change', (e) => this.onFileSelect(e));
        input.click();
    }

    onFileSelect(event) {
        const files = event.target.files;
        if (files.length > 0) {
            this._files = [files[0]];
            this.showCropper(this._files[0]);
        }
    }

    onDrop(event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this._files = [files[0]];
            this.showCropper(this._files[0]);
        }
    }

    showCropper(file) {
        const container = this.shadowRoot.querySelector('.file-selector');
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            container.innerHTML = '';
            container.appendChild(img);
            container.style.opacity = 1;

            this.createCropper(container, img);
        };
        reader.readAsDataURL(file);
    }

    createCropper(container, img) {
        if (!this.resizeEnable) {
            return;
        }
        const singleFile = container.querySelector(".single-file")
        if (singleFile) {
            singleFile.style.display = "hidden";
        }

        this.cropper = document.createElement('div');
        this.cropper.classList.add('cropper');
        if (this._isRound) {
            this.cropper.classList.add('circle');
        }

        this.cropper.style.top = `${(this._maxHeight - this._cropperHeight) / 2}px`;
        this.cropper.style.left = `${(this._maxWidth - this._cropperWidth) / 2}px`;

        container.appendChild(this.cropper);

        const resizer = document.createElement('div');
        resizer.classList.add('resizer');
        this.cropper.appendChild(resizer);

        this.initCropperDrag(img);
        this.addCropperResizeHandler(this.cropper);
    }

    addResizeHandlers(element) {
        const resizer = document.createElement('div');
        resizer.classList.add('resizer');
        element.appendChild(resizer);

        const initResize = (e) => {
            window.addEventListener('mousemove', resize, false);
            window.addEventListener('mouseup', stopResize, false);
        };

        const resize = (e) => {
            element.style.width = (e.clientX - element.offsetLeft) + 'px';
            element.style.height = Math.max(150, (e.clientY - element.offsetTop)) + 'px'; // Ensure minimum height of 150px
        };

        const stopResize = (e) => {
            window.removeEventListener('mousemove', resize, false);
            window.removeEventListener('mouseup', stopResize, false);
        };

        resizer.addEventListener('mousedown', initResize, false);
    }

    addCropperResizeHandler(cropper) {
        const resizer = cropper.querySelector('.resizer');
        const initResize = (e) => {
            window.addEventListener('mousemove', resize, false);
            window.addEventListener('mouseup', stopResize, false);
        };

        const resize = (e) => {
            const newSize = Math.min(Math.max(90, e.clientX - cropper.offsetLeft), 120); // Ensure cropper size between 90px and 120px
            cropper.style.width = newSize + 'px';
            cropper.style.height = newSize + 'px';
            this._cropperWidth = newSize;
            this._cropperHeight = newSize;
        };

        const stopResize = (e) => {
            window.removeEventListener('mousemove', resize, false);
            window.removeEventListener('mouseup', stopResize, false);
        };

        resizer.addEventListener('mousedown', initResize, false);
    }
    initCropperDrag(img) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        const onMouseDown = (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = this.cropper.offsetLeft;
            initialY = this.cropper.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let newX = initialX + dx;
            let newY = initialY + dy;

            // Ensure the cropper doesn't move out of bounds
            newX = Math.min(Math.max(newX, 0), this.shadowRoot.querySelector('.file-selector').clientWidth - this.cropper.offsetWidth);
            newY = Math.min(Math.max(newY, 0), this.shadowRoot.querySelector('.file-selector').clientHeight - this.cropper.offsetHeight);

            this.cropper.style.left = `${newX}px`;
            this.cropper.style.top =
                this.cropper.style.top = `${newY}px`;
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        this.cropper.addEventListener('mousedown', onMouseDown);
    }


    saveCroppedImage(img) {
        const cropperRect = this.cropper.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();
        const scaleX = img.naturalWidth / imgRect.width;
        const scaleY = img.naturalHeight / imgRect.height;

        const cropX = (cropperRect.left - imgRect.left) * scaleX;
        const cropY = (cropperRect.top - imgRect.top) * scaleY;
        const cropWidth = this._cropperWidth * scaleX;
        const cropHeight = this._cropperHeight * scaleY;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this._cropperWidth;
        canvas.height = this._cropperHeight;

        ctx.beginPath();
        if (this._isRound) {
            ctx.arc(this._cropperWidth / 2, this._cropperHeight / 2, this._cropperWidth / 2, 0, Math.PI * 2);
            ctx.clip();
        }
        ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, this._cropperWidth, this._cropperHeight);

        canvas.toBlob((blob) => {
            const croppedFile = new File([blob], "cropped.png", { type: "image/png" });
            this._files = [croppedFile];
            this.render();
            this.updatePreviews();
        }, "image/png");

        this.hideSaveBtn = true;
        this.resizeEnable = false;
        this.cancelBtnTxt = "Reset";
        this.render();
    }

    cancelCropping() {
        this._files = [];
        this.hideSaveBtn = false;
        this.cancelBtnTxt = "Cancel";
        this.cropper = null;
        this.render();
    }

    updatePreviews() {
        const container = this.shadowRoot.querySelector(".file-selector");
        const file = this._files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.objectFit = 'cover';
            img.style.width = "100%";
            img.style.height = "100%";
            container.innerHTML = '';
            container.appendChild(img);
            container.style.opacity = 1;
        };
        reader.readAsDataURL(file);
    }
}

customElements.define('aln-profile', AlaanuProfile);



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