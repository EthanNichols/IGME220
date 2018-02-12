"use strict";
//Constants
const NUM_SMAPLE = 512;

//Canvas variables
let bottomCanvas, topCanvas, bottomCtx, topCtx;
let bgColor, visColor;

let analyserNode, dataCount;

///Start function to setup elements and functions
function start() {
    
    //Set the default values for colors and the data count
    dataCount = 0;
    bgColor = "#000000";
    visColor = "#FFFFFF";
    
    //Get and set element information
    SetupCanvases();
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
}

///Setup the top and bottom canvases
function SetupCanvases() {
    //Set the canvas elements
    bottomCanvas = document.querySelector("#bottomCanvas");
    topCanvas = document.querySelector("#topCanvas");

    //Get the 2d context for both canvases
    bottomCtx = bottomCanvas.getContext("2d");
    topCtx = topCanvas.getContext("2d");
    
    //Set the size of the canvas to fill the window
    bottomCanvas.width = window.innerWidth;
    bottomCanvas.height = window.innerHeight;
    topCanvas.width = bottomCanvas.width;
    topCanvas.height = bottomCanvas.height;
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
    let audioCtx, analyserNode, sourceNode;
    
    //Get the audio player
    let audioElement = document.querySelector("audio");
    
    //Get the audio context
    audioCtx = new (window.AudioContext || window.webkitAudioContext);
    
    analyserNode = audioCtx.createAnalyser();
    
    analyserNode.fftSize = NUM_SMAPLE;
    
    sourceNode = audioCtx.createMediaElementSource(audioElement);
    sourceNode.connect(analyserNode);
    
    analyserNode.connect(audioCtx.destination);
    return analyserNode;
}

///Program loop and audio draw call
function Loop() {
    requestAnimationFrame(Loop);
    
    //Clear the canvas with the background color
    bottomCtx.fillStyle = bgColor;
    bottomCtx.fillRect(0, 0, bottomCanvas.width, bottomCanvas.height)
    
    //Create a new array of intigers and set the data
    let data = new Uint8Array(NUM_SMAPLE / 2);
    analyserNode.getByteFrequencyData(data);
    
    //Filter out data that is not changing
    data = data.filter(function(e) { return e !== 0; });
    
    //Only display data that is being changed on the screen
    if (data.length > dataCount) { dataCount += Math.abs(dataCount - data.length) * .1; }
    else if (data.length == 0) {dataCount = 0;}
    else { dataCount -= Math.abs(dataCount - data.length) * .1; }
    
    //Loop through the data
    for (let i=0; i<dataCount; i++) {
        
        //Set the audio visualizer color
        bottomCtx.fillStyle = visColor;
        
        //Calculate the width and the height of the bars
        let barWidth = bottomCanvas.width / (dataCount * 1.5);
        let barHeight = bottomCanvas.height / 2 * (data[i] / (NUM_SMAPLE / 2));
        
        //Display the bars
        bottomCtx.fillRect((barWidth * 1.5) * i, bottomCanvas.height / 2 - barHeight / 2, barWidth, barHeight)
    }
}

//Start when the window is done loading
window.onload = start;