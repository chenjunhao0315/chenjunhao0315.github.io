class Coral {
    constructor(x, y, r, area_radius, num, colour) {
        this.pos = new Vector(x, y);
        this.growthArea = area_radius;
        this.radius = r;
        this.colour = colour;
        this.tree = [];
        this.tree[0] = new Walker(this, r, x, y);
        this.walker = [];
        this.food = [];
        for (let i = 0; i < num; i++) {
            this.walker[i] = new Walker(this, r);
        }
    }

    update(system) {
        for (let i = this.walker.length - 1; i >= 0; i--) {
            this.walker[i].walk(this);
            if (this.walker[i].checkStuck(this.tree)) {
                this.tree.push(this.walker[i]);
                this.walker.splice(i, 1);

            }
        }
        if (this.walker.length == 0 && this.food.length == 0) {
            for (let i = 0; i < 10; i++) {
                this.food[i] = new Walker(this, 1);
            }
        }
        for (let i = this.food.length - 1; i >= 0; i--) {
            this.food[i].walk(this);
            if (this.food[i].checkStuck(this.tree)) {
                if (aquarium.item[3].length < 100) {
                    system.addStuff('CORAL_FOOD', 1, this.food[i].pos.x, this.food[i].pos.y);
                }
                this.food.splice(i, 1);
            }
        }
    }

    show() {
        for (let tree of this.tree) {
            tree.show(this.colour);
        }
        /*for (let walker of this.walker) {
            walker.show();
        }
        for (let food of this.food) {
            food.show();
        }*/
    }
}

class Walker {
    constructor(object, r, x, y) {
        if (x === undefined || y === undefined) {
            this.pos = this.randomPoint(object);
            this.stuck = false;
        } else {
            this.pos = new Vector(x, y);
            this.stuck = true;
        }
        this.r = r;
    }

    checkStuck(others) {
        for (let i = 0; i < others.length; i++) {
            let d = Vector.distSq(this.pos, others[i].pos);
            if (d < (this.r + others[i].r) * (this.r + others[i].r)) {
                this.stuck = true;
                return true;
            }
        }
        return false;
    }

    walk(object) {
        let vel = new Vector.random2D();
        this.pos.add(vel);
        this.pos.x = clamp(this.pos.x, 0, width);
        this.pos.y = clamp(this.pos.y, 0, height);
        this.pos.x = clamp(this.pos.x, object.pos.x - object.growthArea, object.pos.x + object.growthArea);
        this.pos.y = clamp(this.pos.y, object.pos.y - object.growthArea, object.pos.y + object.growthArea);
    }

    randomPoint(object) {
        let i = floor(random(4));
        let point = random(-object.growthArea, object.growthArea);

        if (i === 0) {
            return new Vector(object.pos.x + point, object.pos.y - object.growthArea);
        } else if (i === 1) {
            return new Vector(object.pos.x + point, object.pos.y + object.growthArea);
        } else if (i === 2) {
            return new Vector(object.pos.x - object.growthArea, object.pos.y + point);
        } else {
            return new Vector(object.pos.x + object.growthArea, object.pos.y + point);
        }
    }

    show(colour) {
        noStroke();
        if (this.stuck) {
            fill(colour);
        } else {
            fill(255);
        }
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }
}