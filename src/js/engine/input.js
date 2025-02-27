// This file manages user input, exporting functions to handle keyboard and mouse events.

const InputHandler = {
    keys: {},
    mouse: {
        x: 0,
        y: 0,
        isPressed: false,
    },

    init() {
        window.addEventListener('keydown', this.keyDownHandler.bind(this));
        window.addEventListener('keyup', this.keyUpHandler.bind(this));
        window.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
        window.addEventListener('mousedown', this.mouseDownHandler.bind(this));
        window.addEventListener('mouseup', this.mouseUpHandler.bind(this));
    },

    keyDownHandler(event) {
        this.keys[event.code] = true;
    },

    keyUpHandler(event) {
        this.keys[event.code] = false;
    },

    mouseMoveHandler(event) {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
    },

    mouseDownHandler() {
        this.mouse.isPressed = true;
    },

    mouseUpHandler() {
        this.mouse.isPressed = false;
    },

    isKeyPressed(key) {
        return this.keys[key] || false;
    },

    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    },

    isMousePressed() {
        return this.mouse.isPressed;
    },
};

export default InputHandler;