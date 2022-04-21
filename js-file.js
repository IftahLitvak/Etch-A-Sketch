// Default Values:
const DEFAULT_COLOR = '#333333';
const DEFAULT_SIZE = 16;
const DEFAULT_MODE = 'color';

// Current Values:
let currentColor = DEFAULT_COLOR;
let currentSize = DEFAULT_SIZE;
let currentMode = DEFAULT_MODE;
let mouseClicked = false;

// Checking if the user pressed the mouse and if he released it
document.body.onmousedown = () => {
    mouseClicked = true;
}
document.body.onmouseup = () => {
    mouseClicked = false;
}

// Query selectors on all the buttons:
const gridContainer = document.querySelector('.grid-container');
const colorModeBtn = document.querySelector('.mode-color');
const rgbModeBtn = document.querySelector('.mode-rgb');
const colorSelectBtn = document.querySelector('.color-select');
const clearBtn = document.querySelector('.clear');
const sizeText = document.querySelector('.size');
const sizeSlider = document.querySelector('.slider');
const eraserBtn = document.querySelector('.eraser');

// Sending to the appropriate function according to which button was pressed
clearBtn.onclick = () => clearGrid();
colorSelectBtn.onchange = (e) => setColor(e.target.value);
sizeSlider.onmousemove = (e) => {
    sizeText.innerHTML = `${e.target.value} X ${e.target.value}`;
};
sizeSlider.onchange = (e) => changeGridSize(e.target.value);
colorModeBtn.onclick = () => {currentMode = 'color'; changeModesAtr();};
rgbModeBtn.onclick = () => {currentMode = 'rgb'; changeModesAtr();};
eraserBtn.onclick = () => {currentMode='eraser'; changeModesAtr();};

// Functions:
function setGrid(size){
    gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    let gridSize = size * size;
    for(let i=0; i<gridSize; i++){
        const item = document.createElement('div');
        item.classList.add('grid-item');
        item.addEventListener('mouseover', setItemColor);
        item.addEventListener('mousedown', setItemColor); // Giving an option to draw by a single mouse click
        gridContainer.appendChild(item);
    }
}

function changeGridSize(newSize){
    currentSize = newSize;
    clearGrid();
}

function setItemColor(e) {
    if(!mouseClicked && e.type == 'mouseover'){
        /* The grid color won't change if the user released the mouse button 
        and the "mouseover" event was the one who sent him to this function */
        return;
    }
    if (currentMode == 'color'){
        e.target.style.backgroundColor = currentColor;
    }
    else if (currentMode == 'rgb'){
        let randomR = Math.floor(Math.random() * 256);
        let randomG = Math.floor(Math.random() * 256);
        let randomB = Math.floor(Math.random() * 256);
        e.target.style.backgroundColor = `rgb(${randomR}, ${randomG}, ${randomB})`;
    }
    else if (currentMode == 'eraser'){
        e.target.style.backgroundColor =  `rgb(255, 255, 255)`;
    }
}

function changeModesAtr(){
    colorModeBtn.classList.remove('pressed');
    rgbModeBtn.classList.remove('pressed');
    eraserBtn.classList.remove('pressed');

    switch(currentMode){
        case 'color':
            colorModeBtn.classList.add('pressed');
            break;
        case 'rgb':
            rgbModeBtn.classList.add('pressed');
            break;
        case 'eraser':
            eraserBtn.classList.add('pressed');
            break;
    }
}

function setColor(newColor) {
    currentColor = newColor;
}

function clearGrid() {
    gridContainer.innerHTML = '';
    setGrid(currentSize);
}

window.onload = () => {
    setGrid(currentSize);
}