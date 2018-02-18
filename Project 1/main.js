/// Programmed by: Ethan Nichols
/// Audio Visualizer

/// APIs and other credits
/// Spectrum
// Programmed by: Brian Grinstead
// Files:
// Spectrum/spectrum.css
// Spectrum/spectrum.js

/// File Purpose
/// This handles all the audio and visual manipulation for the canvas

"use strict";
//Constants
const NUM_SMAPLE = 512;

//Canvas variables
let bottomCanvas, bottomCtx;
let bgColor, visColor, visShape, globalValue, randomColor;

//Audio information
let analyserNode, dataCount, audioFilter;

//Image filters
let noise, greyScale;

///Start function to setup elements and functions
function start() {
    
    //Set the default values for colors and the data count
    dataCount = 0;
    bgColor = "#000000";
    visColor = "#FFFFFF";
    globalValue = 10;
    randomColor = false;
    visShape = "rect";
    noise = false;
    greyScale = false;
    
    //Get and set element information
    SetupCanvas();
    GetElements();
    SetSpectrumInputs();
    
    //Get the audio information
    analyserNode = CreateWebAudioContent();
    
    //Start the loop
    Loop()
}

///Get and set important elements
function GetElements() {
    //Add a click event and click the button twice
    document.querySelector("#minimizeOptions").onclick = DisplayOptions;
    document.querySelector("#minimizeOptions").click();   document.querySelector("#minimizeOptions").click();

    //Add an onchange element to change the song that is playing
    document.querySelector("#trackSelect").onchange = PlaySong;
    document.querySelector("#trackSelect").value = "";
    
    //Add an event to change the background color
    document.querySelector("#bgColor").move = function(e) { bgColor = $(this).spectrum("get").toHexString(); }
    
    //Add events to both visualizer colors to change the color
    document.querySelector("#visColor").move = DisplayColorVisual;
    document.querySelector("#visColor1").move = DisplayColorVisual;
    
    //Add an event to change the global opacity value
    document.querySelector("#globalValue").oninput = function(e) {
        globalValue = this.value;
        this.parentElement.firstChild.innerHTML = "Clear Rate: " + (globalValue / 10).toFixed(1);
    }
    
    //Add an event to change the visualizer shape
    document.querySelector("#displayShape").onchange = function() {visShape = this.value;}
    
    //Add an event to change the audio filter
    document.querySelector("#audioFilter").oninput = function(e) {
        audioFilter.frequency.setTargetAtTime(this.value, 0, 1);
        this.parentElement.firstChild.innerHTML = "LowPass Filter: " + this.value;
    }
    
    //Canvas effects
    document.querySelector("#grey").onclick = function() {greyScale = !greyScale;}
    document.querySelector("#noise").onclick = function() {noise = !noise;}
    
    //Resize the canvas when the window resizes
    window.onresize = function(e) {
        SetupCanvas();
    }
}

///Setup the top and bottom canvases
function SetupCanvas() {
    //Set the canvas elements
    bottomCanvas = document.querySelector("#bottomCanvas");

    //Get the 2d context for both canvases
    bottomCtx = bottomCanvas.getContext("2d");
    
    //Set the size of the canvas to fill the window
    bottomCanvas.width = window.innerWidth;
    bottomCanvas.height = window.innerHeight;
}

///Set the startup information for the color selectors
function SetSpectrumInputs() {
    $(".colorSelector").spectrum({
        color: visColor
    });
    
    $("#bgColor").spectrum({
       color: bgColor 
    });
}

///Allow the options display to be minimized/re-opend
function DisplayOptions() {
    //The options style to easily edit
    let options = document.querySelector("#controls").style;
    
    //Test if the options menu is open or not
    if (options.width == '') {
        
        //Close the options menu
        options.padding = "0px";
        options.border = "none";
        options.width = "20px";
        options.height = "20px";
        
        //Change the information about the minimize button
        this.style.border = "1px solid black";
        this.style.backgroundColor = "#00aa00";
        this.onmouseover = function() {this.style.backgroundColor = "#008000"}
        this.onmouseout = function() {this.style.backgroundColor = "#00aa00"}
        this.innerHTML = '+';
        
    } else {
        
        //Remove the style changes
        options.padding = "";
        options.border = "";
        options.width = "";
        options.height = "";
        
        //Change the information about the minimize button
        this.style.border = "";
        this.style.backgroundColor = "";
        this.onmouseover = function() {this.style.backgroundColor = "#990000"}
        this.onmouseout = function() {this.style.backgroundColor = "#dd0000"}
        this.innerHTML = '-';
    }
}

///Set the color(s) for the audio visualizer
function DisplayColorVisual() {
    
    //Test if the gradient effect is checked
    if (!document.querySelector("#visGradient").checked) {
        
        //Set the color of both color selectors to the same color
        $(document.querySelector("#visColor")).spectrum("set", $(this).spectrum("get").toHexString());
        $(document.querySelector("#visColor1")).spectrum("set", $(this).spectrum("get").toHexString());
        
        //Set the audio visualizer color
        visColor = $(this).spectrum("get").toHexString();
        return;
    }
    
    //Get the two different colors to make a gradient
    let color1 = $(document.querySelector("#visColor")).spectrum("get").toHexString();
    let color2 = $(document.querySelector("#visColor1")).spectrum("get").toHexString();
    
    //Create the gradient with the two colors
    let grd = bottomCtx.createLinearGradient(0, bottomCanvas.height / 2, bottomCanvas.width, bottomCanvas.height / 2);
    grd.addColorStop(0, color1);
    grd.addColorStop(1, color2);
    
    //Set the audio visualizer color
    visColor = grd;
}

///Change the song that's playing in the audio element
function PlaySong() {
    //Get the audio player
    let audioPlayer = document.querySelector("audio");
    
    //Set the source to the song selected, and play the song
    audioPlayer.src = this.value;
    audioPlayer.play();
    audioPlayer.volumn = .2;
}

///Create the audio analyser
function CreateWebAudioContent() {
    //Audio info
    let audioCtx, analyserNode, sourceNode;
    
    //Get the audio player
    let audioElement = document.querySelector("audio");
    
    //Get the audio context
    audioCtx = new (window.AudioContext || window.webkitAudioContext);
    
    analyserNode = audioCtx.createAnalyser();
    
    analyserNode.fftSize = NUM_SMAPLE;
    
    sourceNode = audioCtx.createMediaElementSource(audioElement);
    sourceNode.connect(analyserNode);
    
    //Create audio filters
    let distortion = audioCtx.createWaveShaper();
    let gainNode = audioCtx.createGain();
    let biquadFilter = audioCtx.createBiquadFilter();
    let convolver = audioCtx.createConvolver();
    
    //Connect the filters to the audio node
    analyserNode.connect(distortion);
    distortion.connect(biquadFilter);
    biquadFilter.connect(audioCtx.destination);
    convolver.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    //Set the default audio filter
    biquadFilter.type = "highpass";
    biquadFilter.frequency.setTargetAtTime(440, 0, 1);
    biquadFilter.gain.setTargetAtTime(25, 0, 1);
    
    //Set the global audio filter
    audioFilter = biquadFilter;
    
    //Connect the analyser to the audio and return it
    analyserNode.connect(audioCtx.destination);
    return analyserNode;
}

///Randomly change the value of a color
function SemiRandomColorChange(maxChange, originalColor) {
    
    //Remove information from the color string that isn't needed
    originalColor = originalColor.replace("rgb(", "");
    originalColor = originalColor.replace(")", "");
    
    //Set the RGB values for the color relative to the previous value
    let r = (Math.floor(Math.random() * maxChange - (maxChange / 11 * 5)) + parseInt(originalColor.split(',')[0]));
    let g = (Math.floor(Math.random() * maxChange - (maxChange / 11 * 5)) + parseInt(originalColor.split(',')[1]));
    let b = (Math.floor(Math.random() * maxChange - (maxChange / 11 * 5)) + parseInt(originalColor.split(',')[2]));
    
    //Make sure the RGB value is within actual range
    if (r > 255) {r=255;} else if (r < 0) {r=0;}
    if (g > 255) {g=255;} else if (g < 0) {g=0;}
    if (b > 255) {b=255;} else if (b < 0) {b=0;}
    
    //Return the color string
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

///Set the color of the color selectors
function SetRandomColor() {

    //Get two sem-random colors relative to the color selectors
    let color = SemiRandomColorChange(30, $(document.querySelector("#visColor")).spectrum("get").toRgbString());
    let color1 = SemiRandomColorChange(30, $(document.querySelector("#visColor1")).spectrum("get").toRgbString());
    
    //Test if there isn't a color gradiant
    if (!document.querySelector("#visGradient").checked) {
        
        //Set the color of both color selectors to the same color
        $(document.querySelector("#visColor")).spectrum("set", color);
        $(document.querySelector("#visColor1")).spectrum("set", color);
        
        //Set the audio visualizer color
        visColor = color;
        return;
    }

    //Set the color for both color selectors
    $(document.querySelector("#visColor")).spectrum("set", color);
    $(document.querySelector("#visColor1")).spectrum("set", color1);
    
    //Create the gradient with the two colors
    let grd = bottomCtx.createLinearGradient(0, bottomCanvas.height / 2, bottomCanvas.width, bottomCanvas.height / 2);
    grd.addColorStop(0, color);
    grd.addColorStop(1, color1);
    
    //Set the audio visualizer color
    visColor = grd;
}

///Program loop and audio draw call
function Loop() {
    requestAnimationFrame(Loop);
    
    //Clear the canvas with the background color
    bottomCtx.fillStyle = bgColor;
    bottomCtx.globalAlpha = globalValue / 10.0;
    bottomCtx.fillRect(0, 0, bottomCanvas.width, bottomCanvas.height)
    bottomCtx.globalAlpha = 1;
    
    //Create a new array of intigers and set the data
    let data = new Uint8Array(NUM_SMAPLE / 2);
    if (document.querySelector("#visualDisplay").value == "frequency") {analyserNode.getByteFrequencyData(data);}
    else {analyserNode.getByteTimeDomainData(data);}
    
    //Filter out data that is not changing
    data = data.filter(function(e) { return e !== 0; });
    let prevCount = dataCount;
    
    //Only display data that is being changed on the screen
    if (data.length > dataCount) { dataCount += Math.abs(dataCount - data.length) * .1; }
    else if (data.length == 0) {dataCount = 0;}
    else { dataCount -= Math.abs(dataCount - data.length) * .1; }    
    
    //Set the audio visualizer color
    bottomCtx.fillStyle = visColor;
    bottomCtx.strokeStyle = visColor;
    bottomCtx.lineWidth = 5;
    bottomCtx.lineJoin = "round";
    
    //Create a line in the center of the canvas horizontally
    bottomCtx.beginPath();
    bottomCtx.moveTo(0, bottomCanvas.height / 2);
    bottomCtx.lineTo(bottomCanvas.width, bottomCanvas.height / 2);
    bottomCtx.closePath();
    bottomCtx.stroke();
    
    if (document.querySelector("#randomColors").checked) {
        SetRandomColor();
    }
    
    //Test if the visualizer shaped should have a border
    let border = document.querySelector("#shapeBorder").checked;

    let heightPercentage = (document.querySelector("audio").duration > 0) ? document.querySelector("audio").duration : 1;
    heightPercentage = document.querySelector("audio").currentTime / heightPercentage
    
    //Loop through the data
    for (let i=0; i<dataCount; i++) {        
        //Calculate the width and the height of the bars
        let barWidth = bottomCanvas.width / (dataCount * 1.5);
        let barHeight = (bottomCanvas.height * (1 - heightPercentage)) * data[i] / (NUM_SMAPLE / 2);
        
        let fillShape = true;
        
        //Display the audio info
        switch(visShape) {
                
            //Display rectangles
            case "rect":
                bottomCtx.beginPath();
                bottomCtx.rect((barWidth * 1.5) * (i + .15), bottomCanvas.height / 2 - barHeight / 2, barWidth, barHeight)
                bottomCtx.closePath();
                break;
            
            //Display cirles
            case "circle":
                bottomCtx.beginPath();
                bottomCtx.arc((barWidth * 1.5) * (i + .5), bottomCanvas.height / 2 - barHeight / 2, barWidth, Math.PI * 2, false)
                
                bottomCtx.moveTo((barWidth * 1.5) * (i + .5), bottomCanvas.height / 2 + barHeight / 2);
                bottomCtx.arc((barWidth * 1.5) * (i + .5), bottomCanvas.height / 2 + barHeight / 2, barWidth, Math.PI * 2, false)
                bottomCtx.closePath();
                break;
                
            //Display bezier curves
            case "curve":
                bottomCtx.lineWidth = 2;
                
                bottomCtx.beginPath();
                bottomCtx.moveTo((barWidth * 1.5) * (i), bottomCanvas.height / 2 - barHeight / 2.2);
                bottomCtx.bezierCurveTo((barWidth * 1.5) * (i), bottomCanvas.height / 2 - barHeight / 2, (barWidth * 1.5) * (i + 1), bottomCanvas.height / 2 - barHeight / 2, (barWidth * 1.5) * (i + 1), bottomCanvas.height / 2 - barHeight / 2.2)
                bottomCtx.stroke();
                
                bottomCtx.moveTo((barWidth * 1.5) * (i), bottomCanvas.height / 2 + barHeight / 2.2);
                bottomCtx.bezierCurveTo((barWidth * 1.5) * (i), bottomCanvas.height / 2 + barHeight / 2, (barWidth * 1.5) * (i + 1), bottomCanvas.height / 2 + barHeight / 2, (barWidth * 1.5) * (i + 1), bottomCanvas.height / 2 + barHeight / 2.2)
                bottomCtx.stroke();
                
                bottomCtx.closePath();
                
                fillShape = false;
                break;
                
            //Display connected lines that form a rectangular outline
            case "line":
                bottomCtx.lineWidth = 2;
                
                bottomCtx.beginPath();
                bottomCtx.moveTo((barWidth * 1.5) * (i), bottomCanvas.height / 2 - barHeight / 2);
                bottomCtx.lineTo((barWidth * 1.5) * (i+1), bottomCanvas.height / 2 - barHeight / 2);
                bottomCtx.lineTo((barWidth * 1.5) * (i+1), bottomCanvas.height / 2 - ((bottomCanvas.height * (1 - heightPercentage)) * data[i+1] / (NUM_SMAPLE / 2)) / 2);
                bottomCtx.stroke();
                
                bottomCtx.moveTo((barWidth * 1.5) * (i), bottomCanvas.height / 2 + barHeight / 2);
                bottomCtx.lineTo((barWidth * 1.5) * (i+1), bottomCanvas.height / 2 + barHeight / 2);
                bottomCtx.lineTo((barWidth * 1.5) * (i+1), bottomCanvas.height / 2 + ((bottomCanvas.height * (1 - heightPercentage)) * data[i+1] / (NUM_SMAPLE / 2)) / 2);
                bottomCtx.stroke();
                bottomCtx.closePath();
                
                fillShape = false;
                break;
                
            //Display connected lines
            case "outsideLines":
                bottomCtx.lineWidth = 2;
                
                let offset = (i > dataCount - 1) ? 0 : 1;
                
                bottomCtx.beginPath();
                bottomCtx.moveTo((barWidth * 1.5) * (i), bottomCanvas.height / 2 - barHeight / 2);
                bottomCtx.lineTo((barWidth * 1.5) * (i + 1), bottomCanvas.height / 2 - ((bottomCanvas.height * (1 - heightPercentage)) * data[i+offset] / (NUM_SMAPLE / 2)) / 2);
                bottomCtx.stroke();
                
                bottomCtx.moveTo((barWidth * 1.5) * (i), bottomCanvas.height / 2 + barHeight / 2);
                bottomCtx.lineTo((barWidth * 1.5) * (i + 1), bottomCanvas.height / 2 + ((bottomCanvas.height * (1 - heightPercentage)) * data[i+offset] / (NUM_SMAPLE / 2)) / 2);
                bottomCtx.stroke();
                bottomCtx.closePath();
                
                fillShape = false;
                break;
                
            //Display horizontral lines
            case "horizontalLines":
                bottomCtx.lineWidth = 2;
                
                bottomCtx.beginPath();
                bottomCtx.moveTo((barWidth * 1.5) * (i), bottomCanvas.height / 2 - barHeight / 2);
                bottomCtx.lineTo((barWidth * 1.5) * (i+1), bottomCanvas.height / 2 - barHeight / 2);
                bottomCtx.stroke();
                
                bottomCtx.moveTo((barWidth * 1.5) * (i), bottomCanvas.height / 2 + barHeight / 2);
                bottomCtx.lineTo((barWidth * 1.5) * (i+1), bottomCanvas.height / 2 + barHeight / 2);
                bottomCtx.stroke();
                bottomCtx.closePath();
                
                fillShape = false;
                break;
        }
        
        //Add a border to the shape
        if (border) {
            bottomCtx.strokeStyle = bgColor + "40";
            bottomCtx.lineWidth = 1;
            bottomCtx.stroke();
        }
        
        //Fill the shape
        if (fillShape) {
            bottomCtx.fill();
        }
    }
    
    ManipulatePixels();
}

//Add an effect to the canvas
function ManipulatePixels() {
    
    //If there are no canvas effects return
    if (!greyScale && !noise) {return;}
    
    //Get the image data
    let imageDate = bottomCtx.getImageData(0, 0, bottomCanvas.width, bottomCanvas.height);
    
    //Get information about the image data
    var data = imageDate.data;
    var length = data.length;
    var width = imageDate.width;
        
    //Loop through the pixels
    for (var i=0; i<length; i+= 4) {
        
        //If the RGB colors are the same set the pixel to be black
        if (data[i] == data[i+1] &&
           data[i] == data[i + 2]) {
            data[i] = data[i+1] = data[i+2] = 0;
            continue;
        }
        
        //Create noise on the canvas
        if (noise && Math.random()<.10) {
            data[i] = data[i + 1] = data[i+2] = 128;
        }
            
        //Make all the pixels grey scale
        if (greyScale) {       
            let grey = (data[i] + data[i+1] + data[i+2]) / 8;
            data[i] = grey;
            data[i+1] = grey;
            data[i+2] = grey;
        }
    }
            
    bottomCtx.putImageData(imageDate, 0, 0);
}

//Start when the window is done loading
window.onload = start;