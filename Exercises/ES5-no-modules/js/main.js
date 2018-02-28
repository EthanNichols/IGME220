"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.main = (function(){
	console.log("main.js module loaded");
    
// these variables are in "Script scope" and will be available in this and other .js files
const ctx = document.querySelector("canvas").getContext("2d");
const screenWidth = 600;
const screenHeight = 400;
let sprites = [];
let classes = app.classes;

function init(){
	let margin = 50;
	let rect = {left: margin, top: margin, width: screenWidth - margin*2, height: screenHeight-margin*2}
	let rect2 = {left: margin, top: margin, width: screenWidth - margin*2, height: screenHeight-margin*3}
	sprites = sprites.concat(classes.createCircleSprites(10,rect), classes.createSquareSprites(10,rect), classes.createImageSprites(10,rect2));
	loop();
}

function loop(){
	// schedule a call to loop() in 1/60th of a second
	requestAnimationFrame(loop);
	
	// draw background
	ctx.fillRect(0,0,screenWidth,screenHeight)
	
	// loop through sprites
	for (let s of sprites){
		// move sprites
		s.move();
		
		// check sides and bounce
		if(s.radius){
		
			if (s.x <= s.radius || s.x >= screenWidth-s.radius){
				s.reflectX();
				s.move();
			}
			if (s.y <= s.radius || s.y >= screenHeight-s.radius){
				s.reflectY();
				s.move();
			}
		} else{ // `s` is not a circle
			// left and right
			if (s.x <= 0 || s.x >= screenWidth-s.width){
				s.reflectX();
				s.move();
			}
			
			if (s.y <= 0 || s.y >= screenHeight-s.height){
				s.reflectY();
				s.move();
			}
			
		} // end if s.radius
	
	// draw sprites
		s.draw(ctx);
		
	} // end for
} // end loop()
    
    	// export a public interface to this module
	return{
		init: init,
	};
	
}());
