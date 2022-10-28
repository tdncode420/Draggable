import { nullable } from "./utils.js";

export class Draggable {
    defs = {
        constrain: 'page',
        clone: false,
        cursor: 'default',
        onDrag: nullable,
        onDrop: nullable,
        onGrab: nullable,
        onHover: nullable,
    }
    constructor(ele, opts={}) {
        this.ele = ele;
        this.dx = 0;
        this.dy = 0;
        this.total_oX = 0;
        this.total_oY = 0;
        this.op = this.ele.offsetParent;
        if (this.op.tagName !== 'BODY') {
            do {
                this.total_oX += this.op.offsetLeft;
                this.total_oY += this.op.offsetTop;
                this.op = this.op.offsetParent;
            }
            while (!['BODY', null].includes(this.op.tagName));
        };
        ele.onmousedown = (e) => {
            e.preventDefault();
            this.dx = e.clientX - this.ele.getBoundingClientRect().left;
            this.dy = e.clientY - this.ele.getBoundingClientRect().top;
            window.addEventListener('mousemove', drag);
            window.addEventListener('mouseup', (e) => {
                e.preventDefault();
                window.removeEventListener('mousemove', drag);
            });
        };
        const drag = (e) => {
            e.preventDefault();
            let x = e.clientX - this.dx - this.total_oX;
            let y = e.clientY - this.dy - this.total_oY;
            this.ele.style.translate = String(x) + 'px ' + String(y) + 'px';
        }
    }
};