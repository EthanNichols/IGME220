import {createCircleSprites, createImageSprites, createSquareSprites, createSquareSpritesWrap} from "./classes.js"

"use strict";
// these variables are in "Script scope" and will be available in this and other .js files
const ctx = document.querySelector("canvas").getContext("2d");
const screenWidth = 600;
const screenHeight = 400;
let sprites = [];


init();

function init(){
	let margin = 50;
	let rect = {left: margin, top: margin, width: screenWidth - margin*2, height: screenHeight-margin*2}
	sprites = createCircleSprites(10,rect);
    sprites = sprites.concat(createCircleSprites(3, rect, "blue", 10), createCircleSprites(5, rect, "purple", 20), createSquareSprites(4, rect, "yellow", 20, 10), createSquareSprites(3, rect, "cyan", 60, 10), createImageSprites(5, rect), createImageSprites(4, rect, 40, 50,"images/mario.png"), createSquareSpritesWrap(3, rect, "pink", 20, 20), createSquareSpritesWrap(5, rect, "white", 4, 20));
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
		
        
        if (s.wrap) {
            if (s.x <= 0){
		      s.x += screenWidth;
		      s.move();
	       }
            if (s.x >= screenWidth-s.width){
		      s.x -= screenWidth;
		      s.move();
	       }
            
            if (s.y <= 0){
		      s.y += screenHeight;
		      s.move();
	       }
            if (s.y >= screenHeight-s.height){
		      s.y -= screenHeight;
		      s.move();
	       }
            
        } else {
		  if(s.radius){
	           // a circle
	           if (s.x <= s.radius || s.x >= screenWidth-s.radius){
		          s.reflectX();
		          s.move();
	           }
	           if (s.y <= s.radius || s.y >= screenHeight-s.radius){
                    s.reflectY();
                    s.move();
	           }
            }else{ // `s` is NOT a circle
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
        }
	
	// draw sprites
		s.draw(ctx);
		
	} // end for
} // end loop()