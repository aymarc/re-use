export class AlaanuFile extends HTMLElement {
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


export class AlaanuProfile extends AlaanuFile {
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

