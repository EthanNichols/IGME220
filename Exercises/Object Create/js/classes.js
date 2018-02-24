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

class newSprite{
    constructor(x, y, fwd, speed, color, wrap) {
        this.x = x;
        this.y = y;
        this.fwd = fwd;
        this.speed = speed;
        this.color = color;
        this.wrap = wrap;
    }
    move(){
        this.x += this.fwd.x;
        this.y += this.fwd.y;
    }
    reflectX(){this.fwd.x *= -1;}
    reflectY(){this.fwd.y *= -1;}
}

class circle extends newSprite {
    constructor(x, y, radius, fwd, speed, color, wrap) {
        super(x, y, fwd, speed, color, wrap);
        this.radius = radius;
    }
    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

class spriteImage extends newSprite {
    constructor(x, y, width, height, url, fwd, speed, color, wrap) {
        super(x, y, fwd, speed, color, wrap);
        this.image = new Image();
        this.image.src = url;
        this.width = width;
        this.height = height;
    }
    draw(ctx) {
        ctx.save();
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
		ctx.restore();
    }
}

class rectangle extends newSprite {
    constructor(x, y, width, height, fwd, speed, color, wrap) {
        super(x, y, fwd, speed, color, wrap);
        this.width = width;
        this.height = height;
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

function createCircleSprites(num=20,rect={left:0,top:0,width:300,height:300}, color="red",radius=10){
	let sprites = [];
	for(let i=0;i<num;i++){
        
        sprites.push(new circle(Math.random() * rect.width + rect.left, Math.random() * rect.height + rect.top, radius, getRandomUnitVector(), 2, color, false));
	}
    
	return sprites; 
}

function createSquareSprites(num=20,rect={left:0,top:0,width:300,height:300}, color="red", width=10, height=10){
	let sprites = [];
	for(let i=0;i<num;i++){
        
        sprites.push(new rectangle(Math.random() * rect.width + rect.left, Math.random() * rect.height + rect.top, width, height, getRandomUnitVector(), 2, color, false));
	}
	
	return sprites; 
}

function createImageSprites(num=20,rect={left:0,top:0,width:300,height:300}, width=50, height=93, url="images/Sean.png"){
	let sprites = [];
	for(let i=0;i<num;i++){
        
        sprites.push(new spriteImage(Math.random() * rect.width + rect.left, Math.random() * rect.height + rect.top, width, height, url, getRandomUnitVector(), 2, "white", false));

	}
	return sprites; 
}

function createSquareSpritesWrap(num=20,rect={left:0,top:0,width:300,height:300}, color="red", width=10, height=10){
	let sprites = [];
	for(let i=0;i<num;i++){
		
        sprites.push(new rectangle(Math.random() * rect.width + rect.left, Math.random() * rect.height + rect.top, width, height, getRandomUnitVector(), 2, color, true));
	}
	
	return sprites; 
}