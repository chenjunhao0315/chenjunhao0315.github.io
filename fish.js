class fish {
    constructor(x, y, radius = 5, carrer = {}, dna) {
        this.pos = new Vector(x, y);
        this.vel = new Vector.random2D();
        this.vel.setMag(2);
        this.acc = new Vector(0, 0);
        
        this.carrer = carrer;
        this.fear = carrer.fear;
        this.prey = carrer.prey;
        this.like = carrer.like || 'FOOD';
        this.hate = carrer.hate || 'POISON';
        this.health = 1;
        this.age = 0;
        this.radius = radius || 5;
        this.maxRadius = carrer.maxRadius;
        this.maxSpeed = carrer.maxSpeed || 1.5;
        this.maxForce = carrer.maxForce || 0.05;
        this.healthDecrease = carrer.healthDecrease || 0.003;
        this.Foodnutrition = carrer.Foodnutrition || 0.5;
        this.Poisonnutrition = carrer.Poisonnutrition || -0.4;
        this.colour = carrer.colour;
        this.reproduceCycle = carrer.reproduceCycle;
        this.reproduceTime = 0;
        
        this.dna = this.setDna(dna);
        this.sex = (random(1) < 0.5) ? 'MALE' : 'FEMALE';
        this.child = 0;
        
        this.shape = carrer.shape || 'FISH';
        
        if (!this.colour) {
            if (this.sex === 'MALE') {
                this.colour = [0, 170, 0];
            }
            if (this.sex === 'FEMALE') {
                this.colour = [255, 39, 201];
            }
        }
    }
    
    reproduce(name, mutationRate) {  
        if (this.sex == 'MALE') {
            return;
        } 

        let range = new Circle(this.pos.x, this.pos.y, this.radius * 2);
        let others = aquarium.getQList(name).query(range);
        
        for (let other of others) {
            if (other !== this) {
                let d = this.pos.dist(other.data.pos);
                if (d < this.radius + other.data.radius) {
                    if (this.canReproduceWith(other.data)) {
                        this.birthNewChild(name, other.data, mutationRate);
                    }
                }
            }
        }
    }
    
    birthNewChild(name, parent, mutationRate) {
        let child_quantity = (this.dna[7] + parent.dna[7]) / 2;

        this.child += child_quantity;
        parent.child += child_quantity;
        this.reproduceTime = 0;
        parent.reproduceTime = 0;

        for (let i = 0; i < child_quantity; i++) {
            let x = this.pos.x + random(this.vel.x, parent.vel.x);
            let y = this.pos.y + random(this.vel.y, parent.vel.y);
            let new_DNA = this.crossoverDNA(parent, mutationRate);
            aquarium.addAnimal(name, 1, x, y, 5, new_DNA);
        }
    }
    
    canReproduceWith(fish) {
        let isAdult = (fish.radius + this.radius > 16);
        let isSameGender = fish.sex === this.sex;
        let isHealthy = (fish.health + this.health > 0.9);
        //let isAge = (fish.age > fish.child && this.age > this.child);
        let isAge = true;
        let isCycle = (this.reproduceTime > this.reproduceCycle && fish.reproduceTime > fish.reproduceCycle);
        
        return (isAdult && !isSameGender && isHealthy && isAge && isCycle);
    }

    crossoverDNA(parent, mutationRate) {
        let score = this.age + parent.age;
        let crossoverRatio = this.age / score;
        let gene = [];
        
        for (let i = 0; i < this.dna.length; i++) {
            if (random(1) < crossoverRatio) {
                gene[i] = this.dna[i];
            } else {
                gene[i] = parent.dna[i];
            }
        }
        // food weight
        gene[0] = this.mutate(gene[0], mutationRate, [0.2, -0.2]);
        // poison weight
        gene[1] = this.mutate(gene[1], mutationRate, [-0.2, 0.2]);
        // food perception
        gene[2] = this.mutate(gene[2], mutationRate, [-10, 20]);
        // poison perception
        gene[3] = this.mutate(gene[3], mutationRate, [-10, 20]);
        // fear weight
        gene[4] = this.mutate(gene[4], mutationRate, [-0.2, 0.2]);
        // fear perception
        gene[5] = this.mutate(gene[5], mutationRate, [-10, 20]);
        // speed gene
        gene[6] = this.mutate(gene[6], mutationRate, [-0.1, 0.1]);
        // child quantity
        gene[7] = this.mutate(gene[7], mutationRate, [-3, 3]);
        // mate perception
        gene[8] = this.mutate(gene[8], mutationRate, [-10, 20]);
        // mate weight
        gene[9] = this.mutate(gene[9], mutationRate, [-0.2, 0.2]);
        return gene;
    }
    
    setDna(dna) {
        let gene = [];
        if (dna === undefined) {
            // food weight
            gene[0] = random(0.5, 1);
            // poison weight
            gene[1] = random(-0.3, -0.8);
            // food perception
            gene[2] = random(20, 100);
            // poison perception
            gene[3] = random(20, 100);
            // fear weight
            gene[4] = random(1, 3);
            // fear perception
            gene[5] = random(20, 100);
            // speed gene
            gene[6] = random(-0.5, 0.5);
            // child quantity
            gene[7] = random(10, 20);
            // mate perception
            gene[8] = random(20, 100);
            // mate weight
            gene[9] = random(3, 5);
        } else {
            gene[0] = dna[0];
            gene[1] = dna[1];
            gene[2] = dna[2];
            gene[3] = dna[3];
            gene[4] = dna[4];
            gene[5] = dna[5];
            gene[6] = dna[6];
            gene[7] = dna[7];
            gene[8] = dna[8];
            gene[9] = dna[9];
        }
        return gene;
    }
    
    mutate(gene, mutationRate, value) {
        if (random(1) < mutationRate) {
            gene += random(value[0], value[1]);
        }
        return gene;
    }
    
    behavior(system) {
        let steerFood = new Vector(0, 0);
        let steerPoison = new Vector(0, 0);
        
        for (let like of this.like) {
            let steer = this.eat_food(system, like, this.Foodnutrition, this.dna[2]);
            steerFood.add(steer);
        }
        if (this.like.length > 0) {
            steerFood.div(this.like.length);
        }
        
        for (let hate of this.hate) {
            let steer = this.eat_food(system, hate, this.Foodnutrition, this.dna[3]);
            steerPoison.add(steer);
        }
        if (this.hate.length > 0) {
            steerPoison.div(this.hate.length);
        }
        
        //console.log(this.fear);
        const alwayFear = this.fear_motion(system, this.fear);
        const steerPrey = this.eat_fish(system, this.prey, this.dna[2]);
        //console.log(alwayFear);
        
        steerFood.mult(this.dna[0]);
        steerPoison.mult(this.dna[1]);
        alwayFear.mult(this.dna[4]);
        steerPrey.mult(this.dna[0]);

        let steerMate = new Vector(0, 0);

        if (this.reproduceTime > this.reproduceCycle && this.canReproduce) {
            steerMate = this.findMate(system, this.dna[8] * (this.reproduceTime - this.reproduceCycle));
        }
        steerMate.mult(this.dna[9]);
        
        this.applyForce(steerFood);
        this.applyForce(steerPoison);
        this.applyForce(alwayFear);
        this.applyForce(steerPrey);
        this.applyForce(steerMate);
    }

    findMate(system, perceptionRadius) {
        let record = Infinity;
        let closest = null;
        
        let searchRange = new Circle(this.pos.x, this.pos.y, perceptionRadius);
        
        let action_qlist = system.getQList(this.name);
            
        let founds;
            
        if (action_qlist != null) {
            founds = action_qlist.query(searchRange);
        } else {
            return new Vector(0, 0);
        }
            
        for (let target of founds) {
            let d = this.pos.dist(target.data.pos);
            if (d < record && this.sex !== target.data.sex) {
                record = d;
                closest = target;
            }
        }
        
        if (closest != null) {
            return this.seek(closest.data.pos);
        }
        return new Vector(0, 0);
    }
    
    fear_motion(system, fear_list) {
        let fear_force = new Vector(0, 0);
        let searchRange = new Circle(this.pos.x, this.pos.y, this.dna[5]);
        
        for (let fear of fear_list) {
            //console.log(fear, fear_list);
            let action_qlist = system.getQList(fear);
            //console.log(action_qlist);
            let total = 0;
            let force = new Vector(0, 0);
            
            let founds = action_qlist.query(searchRange);
            //console.log('founds');
            //console.log(founds);
            
            for (let enemy of founds) {
                //console.log('enemy');
                //console.log(enemy);
                let d = this.pos.dist(enemy.data.pos);
                if (d > 0) {
                    let diff = Vector.sub(this.pos, enemy.data.pos);
                    diff.div(d * d);
                    force.add(diff);
                    total++;
                }
            }
            
            //console.log(total);
            
            if (total > 0) {
                force.div(total);
                force.setMag(this.maxSpeed);
                force.sub(this.vel);
                force.limit(this.maxForce);
            }
            fear_force.add(force);
        }
        if (fear_list.length > 0) {
            fear_force.div(fear_list.length);
        }
        return fear_force;
    }
    
    eat_fish(system, prey_list, perceptionRadius) {
        let record = Infinity;
        let closest = null;
        
        let searchRange = new Circle(this.pos.x, this.pos.y, perceptionRadius);
        
        for (let prey of prey_list) {
            let action_qlist = system.getQList(prey);
            
            let founds;
            
            if (action_qlist != null) {
                founds = action_qlist.query(searchRange);
            } else {
                return new Vector(0, 0);
            }
            
            for (let food of founds) {
                let d = this.pos.dist(food.data.pos);
                if (d < this.radius && this.radius > food.data.radius) {
                    system.killAnimal(prey, food.index);
                    this.health += 0.5;
                    this.radius += 0.1;
                } else {
                    if (d < record) {
                        record = d;
                        closest = food;
                    }
                }
            }
        }
        
        if (closest != null && this.health > 0.5 && this.radius > closest.data.radius) {
            return this.seek(closest.data.pos);
        }
        return new Vector(0, 0);
    }
    
    eat_food(system, name, nutrition, perceptionRadius) {
        let record = Infinity;
        let closest = null;
        
        let range = new Circle(this.pos.x, this.pos.y, maximum(this.radius, perceptionRadius));
        let others;
        let action_qlist = system.getQList(name);
        if (action_qlist != null) {
            others = system.getQList(name).query(range);
        } else {
            return new Vector(0, 0);
        }
        
        for (let other of others) {
            const target = new Vector(other.x, other.y);
            const distance = this.pos.dist(target);
            if (distance < 2 + this.radius) {
                system.deleteStuff(name, other.index);
                this.health += nutrition;
                this.radius += nutrition;
                if (this.radius > this.maxRadius) {
                    this.radius = this.maxRadius;
                }
            }
            else {
                if (distance < record) {
                    record = distance;
                    closest = target;
                }
            }
        }
        
        if (closest != null) {
            return this.seek(closest);
        }
        return new Vector(0, 0);
    }
    
    seek(target) {
        const desired = Vector.sub(target, this.pos);
        desired.setMag(this.maxSpeed);
        const steer = Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        
        return steer;
    }
    
    applyFlock(list) {
        let separation = this.separation(list);
        let aligment = this.aligment(list);
        let cohesion = this.cohesion(list);
        
        this.applyForce(separation.mult(0.8));
        this.applyForce(aligment.mult(0.8));
        this.applyForce(cohesion.mult(0.7));
    }
    
    cohesion(list) {
        let neighbor_distance = 30;
        let steer = new Vector(0, 0);
        let total = 0;
        
        let range = new Circle(this.pos.x, this.pos.y, neighbor_distance);
        let others = list.query(range);
        
        for (let other of others) {
            if (other !== this) {
                steer.add(other.data.pos);
                total++;
            }
        }
        
        if (total > 0) {
            steer.div(total);
            steer.sub(this.pos);
            steer.setMag(this.maxSpeed);
            steer.sub(this.vel);
            steer.limit(this.maxForce);
        }
        return steer;
      }
    
    aligment(list) {
        let neighbor_distance = 50;
        let steer = new Vector(0, 0);
        let total = 0;
        
        let range = new Circle(this.pos.x, this.pos.y, neighbor_distance);
        let others = list.query(range);
        
        for (let other of others) {
            if (other !== this) {
                steer.add(other.data.vel);
                total++;
            }
        }
        
        if (total > 0) {
            steer.div(total);
            steer.setMag(this.maxSpeed);
            steer.sub(this.vel);
            steer.limit(this.maxForce);
        }
        return steer;
    }
    
    separation(list) {
        let separationRadius = this.radius * 4;
        let steer = new Vector(0, 0);
        let total = 0;
        
        let range = new Circle(this.pos.x, this.pos.y, separationRadius);
        let others = list.query(range);
        
        for (let other of others) {
            let d = this.pos.dist(other.data.pos);
            if (other !== this && d > 0) {
                let diff = Vector.sub(this.pos, other.data.pos);
                diff.div(d * d);
                steer.add(diff);
                total++;
            }
        }
        
        if (total > 0) {
            steer.div(total);
            steer.setMag(this.maxSpeed);
            steer.sub(this.vel);
            steer.limit(this.maxForce);
        }
        return steer;
    }
    
    applyForce(force) {
        this.acc.add(force);
    }
    
    boundaries() {
        const d = 25;

        let desired = null;

        if (this.pos.x < d) {
            desired = new Vector(this.maxSpeed, this.vel.y);
        } else if (this.pos.x > width - d) {
            desired = new Vector(-this.maxSpeed, this.vel.y);
        }

        if (this.pos.y < d) {
            desired = new Vector(this.vel.x, this.maxSpeed);
        } else if (this.pos.y > height - d) {
            desired = new Vector(this.vel.x, -this.maxSpeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxSpeed);
            const steer = Vector.sub(desired, this.vel);
            steer.limit(this.maxForce);
            this.applyForce(steer);
        }
    }
    
    isDead() {
        return (this.health <= 0);
    }
    
    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed + this.dna[6]);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.health -= (this.radius * this.radius * this.vel.mag() * this.vel.mag() * this.vel.mag() * this.healthDecrease / 100);
        //this.health -= this.healthDecrease;
        this.health = clamp(this.health, 0, 1);
        this.radius = clamp(this.radius, 0, this.maxRadius);
        this.age += 0.025;
        this.reproduceTime += 0.001;
    }
    
    display() {
        const angle = this.vel.heading() + PI / 2;
        push();
        translate(this.pos.x, this.pos.y);
        if (debug.checked()) {
            fill(255);
            //text("age = " + floor(this.age), 0, 0);
            line(-45, -10, -45 + this.health * 100, -10);
            line(-45, -15, -45 + this.age * 5, -15);
        }
        rotate(angle);
        
        if (debug.checked()) {
            strokeWeight(3);
            stroke(0, 255, 0);
            noFill();
            line(0, 0, 0, -this.dna[0] * 25);
            strokeWeight(2);
            ellipse(0, 0, this.dna[2] * 2);
            stroke(255, 0, 0);
            line(0, 0, 0, -this.dna[1] * 25);
            ellipse(0, 0, this.dna[3] * 2);
            stroke(0);
            line(0, 0, 0, -this.dna[4] * 25);
            ellipse(0, 0, this.dna[5] * 2);
        }
        
        let alpha;
        
        if (debug.checked()) {
            alpha = 255;
        } else {
            alpha = this.health * 255;
        }
        noStroke();
        fill(this.colour[0], this.colour[1], this.colour[2], alpha);
        
        switch(this.shape) {
            case 'FISH' : 
                noStroke();
                beginShape();
                vertex(-this.radius / 15, -this.radius);
                vertex(-this.radius / 4, -this.radius * 5 / 6);
                vertex(-this.radius / 3, -this.radius * 4 / 6);
                vertex(-this.radius / 3, -this.radius * 3.5 / 6);
                vertex(-this.radius * 2 / 3, 0);
                vertex(-this.radius / 3, -this.radius * 2 / 6);
                vertex(-this.radius / 3, 0);
                vertex(-this.radius / 4, this.radius * 2 / 6);
                vertex(-this.radius / 7, this.radius * 3 / 6);

                vertex(-this.radius / 4, this.radius);
                vertex(0, this.radius * 2 / 3);
                vertex(this.radius / 4, this.radius);

                vertex(this.radius / 7, this.radius * 3 / 6);
                vertex(this.radius / 4, this.radius * 2 / 6);
                vertex(this.radius / 3, 0);
                vertex(this.radius / 3, -this.radius * 2 / 6);
                vertex(this.radius * 2 / 3, 0);

                vertex(this.radius / 3, -this.radius * 3 / 6);
                vertex(this.radius / 3, -this.radius * 4 / 6);
                vertex(this.radius / 4, -this.radius * 5 / 6);
                vertex(this.radius / 15, -this.radius);
                endShape(CLOSE);
                break;
            case 'SHRAMP' :
                beginShape();
                vertex(-this.radius / 16, -this.radius);
                vertex(this.radius / 16, -this.radius);
                vertex(this.radius / 8, -this.radius / 2);
                vertex(this.radius / 3, -this.radius);
                vertex(this.radius / 4, -this.radius * 4 / 3);
                vertex(this.radius * 4 / 10, -this.radius * 6 / 5);
                vertex(this.radius * 5 / 10, -this.radius * 4 / 3);
                vertex(this.radius / 2, -this.radius);
                vertex(this.radius / 5, -this.radius / 3);
                vertex(this.radius / 6, -this.radius / 5);
                vertex(this.radius / 3, -this.radius / 3);
                vertex(this.radius * 4 / 10, -this.radius / 3);
                vertex(this.radius / 6, -this.radius / 10);
                vertex(this.radius / 6, 0);
                vertex(this.radius / 3, -this.radius / 6);
                vertex(this.radius * 4 / 10, -this.radius / 6);
                vertex(this.radius / 6, this.radius / 7);
                vertex(this.radius / 6, this.radius / 5);
                vertex(this.radius * 4 / 10, 0);
                vertex(this.radius * 9 / 20, 0);
                vertex(this.radius / 5, this.radius * 3 / 10);
                vertex(this.radius / 6, this.radius * 4 / 10);
                vertex(this.radius * 4 / 10, this.radius / 5);
                vertex(this.radius * 9 / 20, this.radius / 5);
                vertex(this.radius / 6, this.radius * 5 / 10);
                vertex(this.radius / 7, this.radius * 6 / 10);
                vertex(this.radius / 3, this.radius);
                vertex(-this.radius / 3, this.radius);
                vertex(-this.radius / 7, this.radius * 6 / 10);
                vertex(-this.radius / 6, this.radius * 5 / 10);
                vertex(-this.radius * 9 / 20, this.radius / 5);
                vertex(-this.radius * 4 / 10, this.radius / 5);
                vertex(-this.radius / 6, this.radius * 4 / 10);
                vertex(-this.radius / 5, this.radius * 3 / 10);
                vertex(-this.radius * 9 / 20, 0);
                vertex(-this.radius * 4 / 10, 0);
                vertex(-this.radius / 6, this.radius / 5);
                vertex(-this.radius / 6, this.radius / 7);
                vertex(-this.radius * 4 / 10, -this.radius / 6);
                vertex(-this.radius / 3, -this.radius / 6);
                vertex(-this.radius / 6, 0);
                vertex(-this.radius / 6, -this.radius / 10);
                vertex(-this.radius * 4 / 10, -this.radius / 3);
                vertex(-this.radius / 3, -this.radius / 3);
                vertex(-this.radius / 6, -this.radius / 5);
                vertex(-this.radius / 5, -this.radius / 3);
                vertex(-this.radius / 2, -this.radius);
                vertex(-this.radius * 5 / 10, -this.radius * 4 / 3);
                vertex(-this.radius * 4 / 10, -this.radius * 6 / 5);
                vertex(-this.radius / 4, -this.radius * 4 / 3);
                vertex(-this.radius / 3, -this.radius);
                vertex(-this.radius / 8, -this.radius / 2);
                endShape(CLOSE);
                fill(0);
                circle(this.radius/ 11, -this.radius* 9 / 10, this.radius/ 10);
                circle(-this.radius/ 11, -this.radius* 9 / 10, this.radius/ 10);
                break;
            default :
                beginShape();
                vertex(0, -this.radius);
                vertex(-this.radius / 2, this.radius);
                vertex(this.radius / 2, this.radius);
                endShape(CLOSE);
                break;
        }
        pop();
    }
}

class DNA {
    constructor(gene) {
        this.gene = [];
        if (dan === undefined) {
            // food weight
            this.gene[0] = random(0.5, 1);
            // poison weight
            this.gene[1] = random(-0.3, -0.8);
            // food perception
            this.gene[2] = random(20, 100);
            // poison perception
            this.gene[3] = random(20, 100);
            // fear weight
            this.gene[4] = random(1, 3);
            // fear perception
            this.gene[5] = random(20, 100);
        } else {
            this.gene[0] = gene[0];
            this.gene[1] = gene[1];
            this.gene[2] = gene[2];
            this.gene[3] = gene[3];
            this.gene[4] = gene[4];
            this.gene[5] = gene[5];
        }
    }

    getRatio(mother, father) {
        let score = mother.age + father.age;
        let ratio = mother.age / score;

        return ratio;
    }

    crossover(mother, father) {
        let gene = [];
        let ratio = getRatio(mother, father);
        
        for (let i = 0; i < this.gene.length; i++) {
            if (random(1) < crossoverRatio) {
                gene[i] = this.gene[i];
            } else {
                gene[i] = parent_DNA.gene[i];
            }
        }
        // food weight
        gene[0] = this.mutate(gene[0], mutationRate, [0.2, -0.2]);
        // poison weight
        gene[1] = this.mutate(gene[1], mutationRate, [-0.2, 0.2]);
        // food perception
        gene[2] = this.mutate(gene[2], mutationRate, [-10, 20]);
        // poison perception
        gene[3] = this.mutate(gene[3], mutationRate, [-10, 20]);
        // fear weight
        gene[4] = this.mutate(gene[4], mutationRate, [-0.2, 0.2]);
        // fear perception
        gene[5] = this.mutate(gene[5], mutationRate, [-10, 20]);
        return gene;
    }
}

class carrer {
    constructor(type) {
        this.type = type;
        this.fear = [];
        this.prey = [];
        this.like = [];
        this.hate = [];
        this.randomR = [5, 7];
        this.canReproduce = false;
        this.canProvide = false;
        this.reproduceCycle = 1;
    }
    
    setMaxRadius(r = 20) {
        this.maxRadius = r;
        return this;
    }
    
    setMaxSpeed(val = 1.5) {
        this.maxSpeed = val;
        return this;
    }
    
    setMaxForce(val = 0.05) {
        this.maxForce = val;
        return this;
    }
    
    setHealthDecrease(val = 0.003) {
        this.healthDecrease = val;
        return this;
    }
    
    setNutrition(nutrition) {
        this.Foodnutrition = nutrition[0];
        this.Poisonnutrition = nutrition[1];
        return this;
    }
    
    setColour(colour) {
        this.colour = colour;
        return this;
    }
    
    addFear(fear) {
        this.fear.push(fear);
        return this;
    }
    
    addPrey(prey) {
        this.prey.push(prey);
        return this;
    }
    
    addLike(name) {
        this.like.push(name);
        return this;
    }
    
    addHate(name) {
        this.hate.push(name);
        return this;
    }
    
    setCanReproduce(bool) {
        this.canReproduce = bool;
        return this;
    }
    
    setShape(shape) {
        this.shape = shape;
        return this;
    }

    setRandomR(val) {
    	this.randomR = val;
    	return this;
    }

    setCanProvide(bool) {
    	this.canProvide = bool;
    	return this;
    }

    setReproduceCycle(val) {
        this.reproduceCycle = val;
        return this;
    }
}

// CREATURE
let CREATURE = new carrer('CREATURE')
    .setMaxRadius(12)
    .addFear('EATER')
    .setCanReproduce(true)
    .addLike('FOOD')
    .addHate('POISON')
    .setShape('FISH')
    .addLike('CORAL_FOOD')
    .setReproduceCycle(0.5)

// EATER
let EATER = new carrer('EATER')
    .setMaxRadius(20)
    .setMaxSpeed(1.7)
    .setMaxForce(0.05)
    .setHealthDecrease(0.001)
    .setColour([0, 191, 255])
    .setNutrition([0.1, 0])
    .addPrey('CREATURE')
    .addPrey('CLEANER')
    .addLike('FOOD')
    .addHate('POISON')
    .setShape('FISH')
    .setRandomR([3, 8])

// CLEANER
let CLEANER = new carrer('CLEANER')
    .setMaxRadius(15)
    .setMaxSpeed(2)
    .setMaxForce(0.2)
    .setHealthDecrease(0.001)
    .setColour([231, 82, 40])
    .setNutrition([0.3, 0])
    .addFear('EATER')
    .addFear('CREATURE')
    .addLike('POISON')
    .addLike('BODY')
    .addHate('FOOD')
    .setShape('SHRAMP')
    .setRandomR([3, 5])

// PROVIDER
let PROVIDER = new carrer('PROVIDER')
    .setMaxRadius(10)
    .setMaxSpeed(1)
    .setColour([244, 243, 87])
    .setNutrition([0.5, 0])
    .setHealthDecrease(0.0001)
    .addLike('POISON')
    .setShape('FISH')
    .addFear('CREATURE')
    .addFear('CLEANER')
    .setRandomR([5, 8])
    .setCanProvide(true)
    .addLike('CORAL_FOOD')