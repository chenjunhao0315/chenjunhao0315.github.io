let img;
let meteor = [];
let from;
let to;
let img_width;
let img_height;

function preload() {
	img = loadImage('https://raw.githubusercontent.com/chenjunhao0315/data_structure/main/star.jpg');
}

function setup() {
   createCanvas(windowWidth, windowHeight);
   
   img.resize(0, windowHeight);
   img_height = img.height;
   img_width = img.width;
   image(img, (windowWidth - img_width) / 2, 0);
   meteor.push(new Meteor);
   from = color(255, 255, 255);
   to = color(102, 255, 230);
   colorMode(HSB);
}

function draw() {
	background('rgb(11, 11, 11)');
	image(img, (windowWidth - img_width) / 2, 0);
	if (random() < 0.05) {
		meteor.push(new Meteor);
	}
	
	for (let i = meteor.length - 1; i >= 0; --i) {
		meteor[i].update();
		meteor[i].show();
		if (meteor[i].checkDeath()) {
			meteor.splice(i, 1);
		}
	}
	//noLoop();
}

class Meteor {
	constructor() {
		this.center = createVector(img.width / 2 + (windowWidth - img_width) / 2, img.height / 2);
		this.vel = p5.Vector.random2D();
		this.pos = this.center.copy().add(this.vel.copy().mult(random(150, 300)));
		this.vel.mult(random(30, 90));
		this.size = random(1, 5);
		this.start = this.pos.copy();
		this.path = [];
		this.color = random(1);
		this.age = 0;
	}
	
	checkDeath() {
		return (abs(this.vel.x) < 10e-3 || abs(this.vel.y) < 10e-3);
	}
	
	update() {
		this.path.push(this.pos.copy());
		this.pos = this.pos.add(this.vel.mult(0.8));
		this.age += 1;
	}
	
	calculateSize() {
		return map(abs(this.age - 10), 0, 20, this.size, 0);
	}
	
	show() {
		fill(lerpColor(from, to, this.color), map(this.vel.mag(), 0, 100, 0, 255) + map(abs(this.age - 10), 0, 20, 50, 0));
		noStroke();
		ellipse(this.pos.x, this.pos.y, this.calculateSize(), this.calculateSize());
		strokeWeight(this.calculateSize());
		let prev = this.pos.copy().sub(this.vel.copy().mult(2));
		stroke(lerpColor(from, to, this.color), map(this.vel.mag(), 0, 100, 0, 255) + map(abs(this.age - 10), 0, 20, 50, 0));
		line(prev.x, prev.y, this.pos.x, this.pos.y);
	}
}

