class Entity {
	constructor (x, y) {
		this.pos = new Vector(x, y);
		this.vel = new Vector(0, 0);
		this.acc = new Vector(0, 0);
		this.maxforce = 0.001;
	}

	follow(vector) {
	    let index = this.index(vector);
	    let force = vector.field[index];
	    if (force === undefined) {
	    	print(vector);
	    	print(index);
	    }
	    this.applyForce(force);
	}

	index(vector) {
		let x = floor(this.pos.x / vector.scl);
	    let y = floor(this.pos.y / vector.scl);
		return x + y * vector.cols;
	}

	edges() {
	    if (this.pos.x > width) {
	      	this.pos.x = 0;
	    }
	    if (this.pos.x < 0) {
	      	this.pos.x = width;
	    }
	    if (this.pos.y > height) {
	      	this.pos.y = 0;
	    }
	    if (this.pos.y < 0) {
	      	this.pos.y = height;
	    }

	}

	applyForce(force) {
	    this.acc.add(force);
	    this.acc.limit(this.maxforce);
	}

	update(maxSpeed = 0.1) {
	    this.vel.add(this.acc);
	    this.vel.limit(maxSpeed);
	    this.pos.add(this.vel);
	    this.acc.mult(0);
	}
}