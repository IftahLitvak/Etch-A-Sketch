// Default Values:
const DEFAULT_COLOR = '#333333';
const DEFAULT_SIZE = 16;
const DEFAULT_MODE = 'color';
const DEFAULT_LINES = false;
const DEFAULT_BG_COLOR = `rgba(255, 255, 255, 1.0)`;
const DEFAULT_CONTROL = 'Hold Mouse Clicked';

// Current Values:
let currentColor = DEFAULT_COLOR;
let currentSize = DEFAULT_SIZE;
let currentMode = DEFAULT_MODE;
let currentGridLines = DEFAULT_LINES;
let currentBgColor = DEFAULT_BG_COLOR;
let mouseClicked = false;
let itemInitialState;
let currentControlState = DEFAULT_CONTROL;
let mouseClickedCounter = 0;


// Checking if the user pressed the mouse and if he released it
document.body.onmousedown = () => {
    mouseClicked = true;
}
document.body.onmouseup = () => {
    mouseClicked = false;
}

// Query selectors on all the buttons:
const gridContainer = document.querySelector('.grid-container');         // The entire Grid, Controls the background
const colorModeBtn = document.querySelector('.mode-color');              // Mode Color Button
const rgbModeBtn = document.querySelector('.mode-rgb');                  // Mode Multi Color Button
const penColorSelectBtn = document.querySelector('.pen-color-select');   // Pen Color Selector
const bgColorSelectBtn = document.querySelector('.bg-color-select');     // Background Color Selector
const clearBtn = document.querySelector('.clear');                       // Clear Button
const sizeText = document.querySelector('.size');                        // Size Text '16 X 16'
const sizeSlider = document.querySelector('.slider');                    // Size Slider Control
const eraserBtn = document.querySelector('.eraser');                     // Eraser Button
const showGridBtn = document.querySelector('.show-grid');                // Show Grid Lines Button
const shadingBtn = document.querySelector('.shading');                   // Shading Button
const lightenBtn = document.querySelector('.lighten');                   // Lighten Button
const drawModeBtn = document.querySelector('.draw-mode');                // Draw Mode Button

// Sending to the appropriate function according to which button was pressed
clearBtn.onclick = () => clearGrid();
penColorSelectBtn.oninput = (e) => setColor(e.target.value);
bgColorSelectBtn.oninput = (e) => setBgColor(e.target.value);
sizeSlider.onmousemove = (e) => {
    sizeText.innerHTML = `${e.target.value} X ${e.target.value}`;
}; // Size Text Changes while moving the slider
sizeSlider.onchange = (e) => changeGridSize(e.target.value);
colorModeBtn.onclick = () => {currentMode = 'color'; changeModesAtr();};
rgbModeBtn.onclick = () => {currentMode = 'rgb'; changeModesAtr();};
eraserBtn.onclick = () => {currentMode = 'eraser'; changeModesAtr();};
shadingBtn.onclick = () => {currentMode = 'shading'; changeModesAtr();};
lightenBtn.onclick = () => {currentMode = 'lighten'; changeModesAtr();};
showGridBtn.onclick = () => {currentGridLines = !currentGridLines; changeGridLinesAtr();};
drawModeBtn.onclick = () => changeDrawMode();

// Functions:
function setGrid(size){
    gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    setBgColor(currentBgColor);
    let gridSize = size * size;
    for(let i=0; i<gridSize; i++){
        const item = document.createElement('div');
        item.classList.add('grid-item');
        let colorBgArr = makeRgbToArr(currentBgColor);
        // setting each item to be with opacity 0.0 as long as the user hasn't changed it. 
        //this is done for being able to see background color changes only through the grid-items that hasn't been touched
        item.style.backgroundColor = `rgba(${parseInt(colorBgArr[0])}, ${parseInt(colorBgArr[1])}, ${parseInt(colorBgArr[2])}, 0.0)`;
        itemInitialState = item.style.backgroundColor;
        itemInitialState = makeRgbToArr(itemInitialState);
        item.addEventListener('mouseover', setItemColor);
        item.addEventListener('mousedown', setItemColor); // Giving an option to draw by a single mouse click
        gridContainer.appendChild(item);
    }
}

function setItemColor(e) {
    switch (currentControlState){
        case 'Hold Mouse Clicked':
            if (!mouseClicked && e.type == 'mouseover'){
                /* The grid color won't change if the user released the mouse button 
                and the "mouseover" event was the one who sent him to this function */
                return;
            }
            break;
        case 'Click Draw and Click':
            if ((mouseClickedCounter == 2)){
                mouseClickedCounter = 0;
                return;
            }
            if (e.type == 'mousedown' && mouseClickedCounter<2){
                mouseClickedCounter++;
            }
            if (mouseClickedCounter == 0){
                return;
            }
            break;
    }
    
    switch (currentMode){
        case 'color':
            e.target.style.backgroundColor = currentColor;
            break;
        case 'rgb':
            // Make a multi-color pen :: Three randmon numbers in the range 0-255 and assigning them to Red/Green/Blue values.
            let randomR = Math.floor(Math.random() * 256);
            let randomG = Math.floor(Math.random() * 256);
            let randomB = Math.floor(Math.random() * 256);
            e.target.style.backgroundColor = `rgba(${randomR}, ${randomG}, ${randomB}, 1.0)`;
            break;
        case 'eraser':
            e.target.style.backgroundColor =  currentBgColor;
            break;
        case 'lighten':
            let lightenColor;
            let itemLightColorArr = makeRgbToArr(e.target.style.backgroundColor);
            // Checks to see if the chosen grid-item has been changed since the page loaded
            let colorsLightMatch = checkIfRgbMatches(itemLightColorArr, itemInitialState);
            if (colorsLightMatch){
                lightenColor = currentBgColor;
            }
            else {
                lightenColor = e.target.style.backgroundColor;
            }
            let lightenArr = shadeOrLighten(lightenColor, currentMode);
            e.target.style.backgroundColor = `rgba(${lightenArr[0]}, ${lightenArr[1]}, ${lightenArr[2]}, 1.0)`;
            break;
        case 'shading':
            let shadingColor;
            let itemShadeColorArr = makeRgbToArr(e.target.style.backgroundColor);
            let colorsShadeMatch = checkIfRgbMatches(itemShadeColorArr, itemInitialState);
            if (colorsShadeMatch){
                shadingColor = currentBgColor;
            }
            else {
                shadingColor = e.target.style.backgroundColor;
            }
            let shadeArr = shadeOrLighten(shadingColor, currentMode);
            e.target.style.backgroundColor = `rgba(${shadeArr[0]}, ${shadeArr[1]}, ${shadeArr[2]}, 1.0)`;
            break;
        
    }
    
}

function changeGridLinesAtr(){
    // Show Grid Lines
    const gridItem = document.querySelectorAll('.grid-item');
    
    if (currentGridLines){
        showGridBtn.classList.add('pressed');
        gridItem.forEach(item => item.classList.add('include-border'));
        showGridBtn.textContent = 'Delete Grid Lines';
    }
    else {
        
        showGridBtn.classList.remove('pressed');
        gridItem.forEach(item => item.classList.remove('include-border'));
        showGridBtn.textContent = 'Show Grid Lines';
    }
    
}

function changeGridSize(newSize){
    currentSize = newSize;
    clearGrid();
}

function hexToRgb(hex) {
    // Example --- Input: '#0033ff'
    //             Output: [0, 51, 255]
   return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16));
}

function checkIfRgbMatches(firstColor, secondColor){
    let match = true;
    if ((firstColor[0] != secondColor[0]) || (firstColor[1] != secondColor[1]) || (firstColor[2] != secondColor[2])){
        match = false;
    }
    return match;

}

function makeRgbToArr(rgb){
    // Example --- Input: 'rgb(243, 34, 2)'
    //             Output: [243, 34, 2]
    let rgbArr = rgb.slice(
        rgb.indexOf("(") + 1, 
        rgb.indexOf(")")
    ).split(", ");
    return rgbArr;
}

function shadeOrLighten(rgb, mode){
    let hexOrRgb = rgb.includes('#'); // Hex color representation starts with '#'
    let colorArr = [];
    if (hexOrRgb){
        colorArr = hexToRgb(rgb);
    }
    else {
        colorArr = makeRgbToArr(rgb);
    }
    
    switch (mode){
        case 'shading':
            colorArr[0] = parseInt(colorArr[0]) - 15;
            colorArr[1] = parseInt(colorArr[1]) - 15;
            colorArr[2] = parseInt(colorArr[2]) - 15;
            break;
        case 'lighten':
            colorArr[0] = parseInt(colorArr[0]) + 15;
            colorArr[1] = parseInt(colorArr[1]) + 15;
            colorArr[2] = parseInt(colorArr[2]) + 15;
            break;
    }
    // Checks that none of the RGB values didn't cross it's borders and resets it if it did
    colorArr = rgbMaxMin(colorArr);
    return colorArr;

}

function rgbMaxMin(rgbColor){
    for (let i=0; i<3; i++){    
        if (rgbColor[i] > 255){
            rgbColor[i] = 255;
        }
        else if (rgbColor[i] < 0){
            rgbColor[i] = 0;
        }
    }
    return rgbColor;
}

function changeModesAtr(){
    colorModeBtn.classList.remove('pressed');
    rgbModeBtn.classList.remove('pressed');
    eraserBtn.classList.remove('pressed');
    shadingBtn.classList.remove('pressed');
    lightenBtn.classList.remove('pressed');
    switch (currentMode){
        case 'color':
            colorModeBtn.classList.add('pressed');
            break;
        case 'rgb':
            rgbModeBtn.classList.add('pressed');
            break;
        case 'eraser':
            eraserBtn.classList.add('pressed');
            break;
        case 'shading':
            shadingBtn.classList.add('pressed');
            break;
        case 'lighten':
            lightenBtn.classList.add('pressed');
            break;
    }
}

function changeDrawMode(){
    let previousMode = drawModeBtn.textContent;
    if (previousMode == 'Hold Mouse Clicked'){
        drawModeBtn.textContent = 'Click Draw and Click';
        drawModeBtn.classList.add('pressed');
    }
    else if (previousMode == 'Click Draw and Click'){
        drawModeBtn.textContent = 'Hold Mouse Clicked';
        drawModeBtn.classList.remove('pressed');
    }
    currentControlState = drawModeBtn.textContent;
}

function setColor(newColor) {
    currentColor = newColor;
}

function setBgColor(newBgcolor){
    currentBgColor = newBgcolor;
    gridContainer.style.backgroundColor = currentBgColor;
}

function clearGrid() {
    gridContainer.innerHTML = '';
    setGrid(currentSize);
    changeGridLinesAtr();
}

window.onload = () => {
    setGrid(currentSize);
    changeModesAtr();
}