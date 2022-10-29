# DRAGGABLE

A lightweight library that adds 'draggablilty' to an HTML Element. Only one event listener remains active while the rest are invoked upon specific actions. CSS 'translate' is used to position elements which is proven to be better (in performance) than using 'absolute' positioning.

## USAGE

1) Import the 'Draggable' module...

    ```js
    import {Draggable} from "path/to/draggable.mod.jd"
    ```

    or include the 'draggable.js' or minified version ('draggable.min.js') in your HTML...

    ```html
    <script src="path/to/draggable.js">
    // or
    <script src="path/to/draggable.min.js">
    ```

2) Create a 'Draggable' instance...

    ```js
    const myEle = document.querySelector('#myEle');
    new Draggable(myele);
    
    // or

    new Draggable(myEle, opts);
    ```

See the *documentation* files for available options.
