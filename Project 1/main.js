"use strict";
//Constants
const NUM_SMAPLE = 256;

//Canvas variables
let bottomCanvas, topCanvas, bottomCtx, topCtx;

let analyserNode;

///Start function to setup elements and functions
function start() {
    
    //Get and set element information
    SetupCanvases();
    GetElements();
    
    //TEMP
    bottomCtx.globalAlpha = .5;
    bottomCtx.fillStyle = "black";
    bottomCtx.fillRect(0, 0, bottomCanvas.width, bottomCanvas.height);
    topCtx.globalAlpha = .5;
    topCtx.fillStyle = "white";
    topCtx.fillRect(0, 0, topCanvas.width, topCanvas.height);
    
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

///Loop 
function Loop() {
    requestAnimationFrame(Loop);
    
    let barwidth = 5;
    let barSpacing = 2;
    let barHeight = 100;
    let topSpacing = 50;
    
    bottomCtx.clearRect(0, 0, bottomCanvas.width, bottomCanvas.height)
    
    //Create a new array of intigers and set the data
    let data = new Uint8Array(NUM_SMAPLE / 2);
    analyserNode.getByteFrequencyData(data);
    
    for (let i=0; i<data.length; i++) {
        bottomCtx.fillStyle = "red";
        
        bottomCtx.fillRect((topCanvas.width / 128) * (i + .25), topCanvas.height / 2 - (window.innerHeight * (data[i] / 256)) / 2, topCanvas.width / 256,  window.innerHeight * (data[i] / 256));
    }
}

//Start when the window is done loading
window.onload = start;