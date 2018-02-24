"use strict";
let sprite = {
		// properties
		x: 0,
		y: 0,
		fwd:{x:0,y:1},
		speed:0,
        wrap:false,
		//  methods
		move(){
				this.x += this.fwd.x * this.speed;
				this.y += this.fwd.y * this.speed;
		},
		reflectX(){
			this.fwd.x *= -1;
		},
		reflectY(){
			this.fwd.y *= -1;
		}
}

function createCircleSprites(num=20,rect={left:0,top:0,width:300,height:300}, color="red",radius=10){
	let sprites = [];
	for(let i=0;i<num;i++){
		// create Object literal with a prototype object of `sprite`
		let s = Object.create(sprite);
		
		// add properties to `s`
		s = Object.assign(s,{
			radius: radius,
			color: color,
			x: Math.random() * rect.width + rect.left,
			y: Math.random() * rect.height + rect.top,
			fwd: getRandomUnitVector(),
			speed: 2,
			draw(ctx){
				ctx.save();
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
				ctx.closePath();
				ctx.fillStyle = this.color;
				ctx.fill();
				ctx.restore();
			}
		});
	
		sprites.push(s);
	}
	
	return sprites; 
}

function createSquareSprites(num=20,rect={left:0,top:0,width:300,height:300}, color="red", width=10, height=10){
	let sprites = [];
	for(let i=0;i<num;i++){
		// create Object literal with a prototype object of `sprite`
		let s = Object.create(sprite);
		
		// add properties to `s`
		s = Object.assign(s,{
			width: width, // NEW and unique to "Square Sprite"
			height: height, // NEW and unique to "Square Sprite"
			color: color,
			x: Math.random() * rect.width + rect.left,
			y: Math.random() * rect.height + rect.top,
			fwd: getRandomUnitVector(),
			speed: 2,
			draw(ctx){ // NEW implementation for "Square Sprite"
				ctx.save();
				ctx.fillStyle = this.color;
				ctx.fillRect(this.x, this.y, this.width, this.height);
				ctx.restore();
			}
		});
	
		sprites.push(s);
	}
	
	return sprites; 
}

function createImageSprites(num=20,rect={left:0,top:0,width:300,height:300}, width=50, height=93, url="images/Sean.png"){
	let sprites = [];
	for(let i=0;i<num;i++){
		// create Object literal with a prototype object of `sprite`
		let s = Object.create(sprite);
		
		let image = new Image();
		image.src = url; // making an image 20 times here when we only to once!
		
		// add properties to `s`
		s = Object.assign(s,{
			width: width,
			height: height,
			x: Math.random() * rect.width + rect.left,
			y: Math.random() * rect.height + rect.top,
			fwd: getRandomUnitVector(),
			speed: 2,
			image: image,
			draw(ctx){
				ctx.save();
				ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
				ctx.restore();
			}
		});
	
		sprites.push(s);
	}
	
	return sprites; 
}

function createSquareSpritesWrap(num=20,rect={left:0,top:0,width:300,height:300}, color="red", width=10, height=10){
	let sprites = [];
	for(let i=0;i<num;i++){
		// create Object literal with a prototype object of `sprite`
		let s = Object.create(sprite);
		
		// add properties to `s`
		s = Object.assign(s,{
			width: width, // NEW and unique to "Square Sprite"
			height: height, // NEW and unique to "Square Sprite"
			color: color,
			x: Math.random() * rect.width + rect.left,
			y: Math.random() * rect.height + rect.top,
            wrap: true,
			fwd: getRandomUnitVector(),
			speed: 2,
			draw(ctx){ // NEW implementation for "Square Sprite"
				ctx.save();
				ctx.fillStyle = this.color;
				ctx.fillRect(this.x, this.y, this.width, this.height);
				ctx.restore();
			}
		});
	
		sprites.push(s);
	}
	
	return sprites; 
}