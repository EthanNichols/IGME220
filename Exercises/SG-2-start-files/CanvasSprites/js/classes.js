"use strict";
function createSprites(num=20, radius=20, color="red"){
    
    let sprites = []; // NEW
	for(let i=0;i<num;i++){ // NEW
    
	// create Object literal
	let s = { };
	
	// add properties
	s.radius = radius;
	s.color = color;
	s.x = Math.random() * (screenWidth - 100) + 50;
	s.y = Math.random() * (screenHeight - 100) + 50;
	s.fwd = getRandomUnitVector();
	s.speed = 2;
	
	//add methods
	s.draw = function(ctx){
			ctx.save();
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
			ctx.closePath();
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.restore();
	};
    
    // move
    s.move = function(){
        this.x += this.fwd.x * this.speed;
        this.y += this.fwd.y * this.speed;
    };

    // bounce on left/right
    s.reflectX = function(){
        this.fwd.x *= -1;
    }

    // bounce on top/bottom
    s.reflectY = function(){
        this.fwd.y *= -1;
    }
    
    // add to array
    sprites.push(s); // NEW
    }
    
    return sprites; // return our sole sprite in an array
}