import { nullable } from "./utils.js";

export const Draggable = class {
    opts = {};
    defs = {
        contain: 'page',
        clone: false,
        cursor: 'default',
        onDrag: nullable,
        onDrop: nullable,
        onGrab: nullable,
        onHover: nullable,
        showCoords: false
    };
    /**
     * 
     * @param {HTMLElement} ele - an instance of a HTMLElement
     * @param {object} [options={}] - options for the 'Draggable' element 
     * @param {['none' | 'page' | 'parent' | '#id_selector' | '.class_selector'}]} [opts.contain = 'page'] - the ancestor HTMLElement to keep the 'draggable' element contained in
     * @param {string} [cursor = 'default'] - a valid CSS cursor
     * @param {function} [onDrag = null] - a function to invoke while the element is being dragged
     * @param {function} [onDrop = null] - a function to invoke while the element is dropped 
     * @param {function} [onGrab = null] - a function to invoke when the element is first grabbed
     * @param {function} [onHover = null] - a function to invoke while the element is being hovered over by the cursor
     * @param {boolean} [showCoords = false] - if true, the `x` and `y` coordinates while be shown next to the cursor
     * 
     */
    constructor(ele, options={}) {
        
        const self = this;
        const coords = () => {
            let elm = document.createElement('p');
            elm.id = "dragCoords";
            elm.style.position = 'absolute';
            return elm;
        };
        let coordsEle = null;
        
        // set options
        for(let opt in this.defs){
            this.opts[opt] = opt in options ? options[opt] : this.defs[opt]; 
        } 

        // the element being wrapped
        this.ele = ele;

        // diff X
        this.dx = 0;
        // diff Y
        this.dy = 0;

        // total offset X (offsetParents offset's included)
        this.total_oX = 0;
        // total offset Y (offsetParents offset's included)
        this.total_oY = 0;

        // calculate the total offset values
        // append all 'offsetParent' offset's to the 'total offset' values
        // until we it the 'body' element or 'null'
        let op = this.ele.offsetParent;
        if (op.tagName !== 'BODY') {
            do {
                this.total_oX += op.offsetLeft;
                this.total_oY += op.offsetTop;
                op = op.offsetParent;
            }
            while (!['BODY', null].includes(op.tagName));
        };

        ele.addEventListener('mouseover', mouseOver);

        function mouseOver(e){
            e.preventDefault();
            ele.addEventListener('mousedown', mouseDown, {
                once: true
            });
            self.opts.onHover(e);
        };

        function mouseDown(e){
            e.preventDefault();
            self.dx = e.clientX - self.ele.getBoundingClientRect().left;
            self.dy = e.clientY - self.ele.getBoundingClientRect().top;
            if (self.opts.showCoords) {
                coordsEle = coords();
                document.body.appendChild(coordsEle);
            }
            window.addEventListener('mousemove', mouseMove);
            window.addEventListener('mouseup', mouseUp, {
                once: true
            });
            self.opts.onGrab(e);
        };

        function mouseMove(e) {
            e.preventDefault();
            let x = e.clientX - self.dx - self.total_oX;
            let y = e.clientY - self.dy - self.total_oY;
            if (self.opts.showCoords) {
                coordsEle.textContent = `X: ${x}px || Y: ${y}px`;
                coordsEle.style.left = e.clientX+10+'px';
                coordsEle.style.top = e.clientY - 10 + 'px';
            }
            if (self.opts.contain === 'page') {
                let rect = ele.getBoundingClientRect();
                let bounds = document.body.getBoundingClientRect();
                if (x <= -(rect.left) - self.total_oX) {
                    x = -(rect.left) - self.total_oX;
                } 
                if (x >= bounds.width - self.total_oX - rect.width) {
                    x = bounds.width - self.total_oX - rect.width;
                }
                if (y <= -(self.total_oY)) {
                    y = -(self.total_oY);
                }
                if (y >= bounds.height - rect.height - self.total_oY) {
                    y = bounds.height - rect.height - self.total_oY;
                }
            } else if(self.opts.contain === 'parent'){
                let rect = ele.getBoundingClientRect();
                let bounds = document.body.getBoundingClientRect();
                let rBounds = bounds.width - rect.width;
                let bBounds = bounds.height - rect.height;
                if(x <= 1){
                    x = 1;
                }
                if(x >= rBounds){
                    x = rBounds;
                }
                if (y <= 1) {
                    y = 1;
                }
                if (y >= bBounds) {
                    y = bBounds;
                }
            } else if (self.opts.contain instanceof HTMLElement){
                let rect = ele.getBoundingClientRect();
                let bounds = self.opts.contain.getBoundingClientRect();
                if (x <= -(rect.left) - self.total_oX) {
                    x = -(rect.left) - self.total_oX;
                }
                if (x >= bounds.width - self.total_oX - rect.width) {
                    x = bounds.width - self.total_oX - rect.width;
                }
                if (y <= -(self.total_oY)) {
                    y = -(self.total_oY);
                }
                if (y >= bounds.height - rect.height - self.total_oY) {
                    y = bounds.height - rect.height - self.total_oY;
                }
            };
            self.ele.style.translate = String(x) + 'px ' + String(y) + 'px';
            self.opts.onDrag(e);
        };

        function mouseUp(e){
            e.preventDefault();
            if (self.opts.showCoords) {
                coordsEle.remove();
            }
            window.removeEventListener('mousemove', mouseMove);
            self.opts.onDrop();
        };
    }
};
