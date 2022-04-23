// Default Values:
const DEFAULT_COLOR = '#333333';
const DEFAULT_SIZE = 16;
const DEFAULT_MODE = 'color';
const DEFAULT_LINES = false;
const DEFAULT_BG_COLOR = `rgba(255, 255, 255, 1.0)`;

// Current Values:
let currentColor = DEFAULT_COLOR;
let currentSize = DEFAULT_SIZE;
let currentMode = DEFAULT_MODE;
let currentGridLines = DEFAULT_LINES;
let currentBgColor = DEFAULT_BG_COLOR;
let mouseClicked = false;
let itemInitialState;


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
const penColorSelectBtn = document.querySelector('.pen-color-select');
const bgColorSelectBtn = document.querySelector('.bg-color-select');
const clearBtn = document.querySelector('.clear');
const sizeText = document.querySelector('.size');
const sizeSlider = document.querySelector('.slider');
const eraserBtn = document.querySelector('.eraser');
const showGridBtn = document.querySelector('.show-grid');
const shadingBtn = document.querySelector('.shading');
const lightenBtn = document.querySelector('.lighten');

// Sending to the appropriate function according to which button was pressed
clearBtn.onclick = () => clearGrid();
penColorSelectBtn.oninput = (e) => setColor(e.target.value);
bgColorSelectBtn.oninput = (e) => setBgColor(e.target.value);
sizeSlider.onmousemove = (e) => {
    sizeText.innerHTML = `${e.target.value} X ${e.target.value}`;
};
sizeSlider.onchange = (e) => changeGridSize(e.target.value);
colorModeBtn.onclick = () => {currentMode = 'color'; changeModesAtr();};
rgbModeBtn.onclick = () => {currentMode = 'rgb'; changeModesAtr();};
eraserBtn.onclick = () => {currentMode = 'eraser'; changeModesAtr();};
shadingBtn.onclick = () => {currentMode = 'shading'; changeModesAtr();};
lightenBtn.onclick = () => {currentMode = 'lighten'; changeModesAtr();};

showGridBtn.onclick = () => {currentGridLines = !currentGridLines; changeGridLinesAtr();};

// Functions:
function setGrid(size){
    gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    setBgColor(currentBgColor);
    let gridSize = size * size;
    for(let i=0; i<gridSize; i++){
        const item = document.createElement('div');
        item.classList.add('grid-item');
        let colorBgArr = currentBgColor.slice(
            currentBgColor.indexOf("(") + 1, 
            currentBgColor.indexOf(")")
        ).split(", ");
        item.style.backgroundColor = `rgba(${parseInt(colorBgArr[0])}, ${parseInt(colorBgArr[1])}, ${parseInt(colorBgArr[2])}, 0.0)`;
        itemInitialState = item.style.backgroundColor;
        itemInitialState = makeRgbToArr(itemInitialState);
        //item.style.backgroundColor = currentBgColor;
        //item.style.opacity = `0.0`;
        item.addEventListener('mouseover', setItemColor);
        item.addEventListener('mousedown', setItemColor); // Giving an option to draw by a single mouse click
        gridContainer.appendChild(item);
    }
}

function changeGridLinesAtr(){
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

function setItemColor(e) {
    if(!mouseClicked && e.type == 'mouseover'){
        /* The grid color won't change if the user released the mouse button 
        and the "mouseover" event was the one who sent him to this function */
        return;
    }
    //e.target.style.opacity = `1.0`;
    switch (currentMode){
        case 'color':
            e.target.style.backgroundColor = currentColor;
            break;
        case 'rgb':
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
            let bgLightColorArr = hexToRgb(currentBgColor);
            let colorsLightMatch = checkIfRgbMatches(itemLightColorArr, itemInitialState);
            if (colorsLightMatch){
                lightenColor = currentBgColor;
                //lightenArr = shadeOrLighten(currentBgColor, currentMode);
            }
            else {
                lightenColor = e.target.style.backgroundColor;
                //lightenArr = shadeOrLighten(e.target.style.backgroundColor, currentMode);
            }
            let lightenArr = shadeOrLighten(lightenColor, currentMode);
            e.target.style.backgroundColor = `rgba(${lightenArr[0]}, ${lightenArr[1]}, ${lightenArr[2]}, 1.0)`;
            break;
        case 'shading':
            let shadingColor;
            let itemShadeColorArr = makeRgbToArr(e.target.style.backgroundColor);
            let bgShadeColorArr = hexToRgb(currentBgColor);
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

function hexToRgb(hex) {
    /*hex = parseInt(hex);
    let entireNum = parseInt(hex, 16);
    let r = (entireNum >> 16) & 255;
    let g = (entireNum >> 8) & 255;
    let b = entireNum & 255;
    let rgbArr = [r, g, b];

    return rgbArr;*/
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
    let rgbArr = rgb.slice(
        rgb.indexOf("(") + 1, 
        rgb.indexOf(")")
    ).split(", ");
    return rgbArr;
}

function shadeOrLighten(rgb, mode){
    let hexOrRgb = rgb.includes('#');
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

function setColor(newColor) {
    currentColor = newColor;
}

function setBgColor(newBgcolor){
    currentBgColor = newBgcolor;
    let colorBgArr = currentBgColor.slice(
        currentBgColor.indexOf("(") + 1, 
        currentBgColor.indexOf(")")
    ).split(", ");
    //gridContainer.style.backgroundColor = `rgba(${parseInt(colorBgArr[0])}, ${parseInt(colorBgArr[1])}, ${parseInt(colorBgArr[2])}, 1.0)`;
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