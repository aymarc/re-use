
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

import { AlaanuFile, AlaanuProfile } from "./AlaanuFile.js";
import { AlaanuStar } from "./AlaanuStar.js";
import { AlaanuSwiper } from "./AlaanuSwiper.js";
import { AlaanuDropdown } from "./AlaanuDropdown.js";
// Define the custom elements
customElements.define('aln-file', AlaanuFile);
customElements.define('aln-profile', AlaanuProfile);
customElements.define('aln-star', AlaanuStar);
customElements.define('aln-swiper', AlaanuSwiper);
customElements.define('aln-dropdown', AlaanuDropdown);
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