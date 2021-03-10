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
        this.canReproduce = carrer.canReproduce || false;
        this.reproduceCycle = carrer.reproduceCycle;
        this.reproduceTime = carrer.reproduceCycle / 2;
        
        //this.dna = this.setDna(dna);
        this.dna = dna || new DNA(carrer.dnaPrototype);
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
    
    reproduce(name, mutationRate, reproduction_rate) {  
        if (this.sex === 'MALE') {
            return;
        } 

        let range = new Circle(this.pos.x, this.pos.y, this.radius * 2);
        let others = aquarium.getQList(name).query(range);
        
        for (let other of others) {
            let process_data = other.data;
            if (process_data !== this) {
                let d = this.pos.dist(process_data.pos);
                if (d < this.radius + process_data.radius) {
                    if (this.canReproduceWith(process_data, reproduction_rate)) {
                        this.birthNewChild(name, process_data, mutationRate);
                    } else {
                        if (this.reproduceTime < this.reproduceCycle && process_data.sex === 'MALE') {
                            let getaway = new Vector.random2D();
                            getaway.setMag(0.05);
                            this.applyForce(getaway);
                        }
                    }
                }
            }
        }
    }
    
    birthNewChild(name, parent, mutationRate) {
        let child_quantity = (this.dna.getInformation('CHILD_QUANTITY') + parent.dna.getInformation('CHILD_QUANTITY')) / 2;

        this.child += child_quantity;
        parent.child += child_quantity;
        this.reproduceTime = 0;
        parent.reproduceTime = 0;

        for (let i = 0; i < child_quantity; i++) {
            let x = this.pos.x + random(this.vel.x, parent.vel.x);
            let y = this.pos.y + random(this.vel.y, parent.vel.y);
            let new_DNA = this.dna.crossover(parent.dna, this.age, parent.age);
            new_DNA.mutate(this.carrer.dnaPrototype, mutationRate);
            //let new_DNA = this.crossoverDNA(parent, mutationRate);
            aquarium.addAnimal(name, 1, x, y, 5, new_DNA);
        }
    }
    
    canReproduceWith(fish, reproduction_rate) {
        let isAdult = (fish.radius + this.radius > 16);
        let isSameGender = fish.sex === this.sex;
        let isHealthy = (fish.health + this.health > 0.9);
        //let isAge = (fish.age > fish.child && this.age > this.child);
        let isAge = true;
        let isCycle = (this.reproduceTime > this.reproduceCycle && fish.reproduceTime > fish.reproduceCycle);
        let isRate = (random(1) < reproduction_rate);
        
        return (isAdult && !isSameGender && isHealthy && isAge && isCycle && isRate);
    }
    
    behavior(system, qlist) {
        let steerFood = new Vector(0, 0);
        let steerPoison = new Vector(0, 0);
        
        for (let like of this.like) {
            //let steer = this.eat_food(system, like, this.Foodnutrition, this.dna[2]);
            let steer = this.eat_food(system, like, this.Foodnutrition, this.dna.getInformation('FOOD_PERCEPTION'));
            steerFood.add(steer);
        }
        if (this.like.length > 0) {
            steerFood.div(this.like.length);
        }
        
        for (let hate of this.hate) {
            //let steer = this.eat_food(system, hate, this.Foodnutrition, this.dna[3]);
            let steer = this.eat_food(system, hate, this.Foodnutrition, this.dna.getInformation('FOOD_PERCEPTION'));
            steerPoison.add(steer);
        }
        if (this.hate.length > 0) {
            steerPoison.div(this.hate.length);
        }
        
        const alwayFear = this.fear_motion(system, this.fear);
        //const steerPrey = this.eat_fish(system, this.prey, this.dna[2]);
        const steerPrey = this.eat_fish(system, this.prey, this.dna.getInformation('FOOD_PERCEPTION'));
        
        steerFood.mult(this.dna.getInformation('FOOD_WEIGHT'));
        steerPoison.mult(this.dna.getInformation('POISON_WEIGHT'));
        alwayFear.mult(this.dna.getInformation('FEAR_WEIGHT'));
        steerPrey.mult(this.dna.getInformation('FOOD_WEIGHT'));

        let steerMate = new Vector(0, 0);

        //if (this.reproduceTime > 2 * this.reproduceCycle && this.canReproduce) {
        steerMate = this.findMate(system, qlist, (this.dna.getInformation('MATE_PERCEPTION') * this.reproduceTime / this.reproduceCycle));
        //}
        steerMate.mult(this.dna.getInformation('MATE_WEIGHT') * (this.reproduceTime / this.reproduceCycle) * findMateSlider.value());
        
        this.applyForce(steerFood);
        this.applyForce(steerPoison);
        this.applyForce(alwayFear);
        this.applyForce(steerPrey);
        this.applyForce(steerMate);
    }

    findMate(system, qlist, perceptionRadius) {
        if (this.sex === 'FEMALE') {
            return new Vector(0, 0);
        }

        let record = Infinity;
        let closest = null;
        
        let searchRange = new Circle(this.pos.x, this.pos.y, perceptionRadius);
            
        let founds = null;
 //       let action_qlist = qlist;

        if (this.reproduceTime < this.reproduceCycle || this.canReproduce == false || this.health < 0.5) {
            return new Vector(0, 0);
        }
            
        founds = qlist.query(searchRange);

        //console.log(founds);
            
        for (let target of founds) {
            let d = this.pos.dist(target.data.pos);
            if (target !== this && d < record && this.sex != target.data.sex) {
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
        let searchRange = new Circle(this.pos.x, this.pos.y, this.dna.getInformation('FEAR_PERCEPTION'));
        
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
            others = action_qlist.query(range);
        } else {
            return new Vector(0, 0);
        }

        //console.log(action_qlist);
        //console.log(range);
        //console.log(others);
        
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
        
        this.applyForce(separation.mult(separationSlider.value()));
        this.applyForce(aligment.mult(alignSlider.value()));
        this.applyForce(cohesion.mult(cohesionSlider.value()));
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
        let separationRadius = this.radius * this.radius / 2;
        let steer = new Vector(0, 0);
        let total = 0;
        
        let range = new Circle(this.pos.x, this.pos.y, separationRadius);
        let others = list.query(range);
        
        for (let other of others) {
            let process_data = other.data.pos;
            let d = this.pos.dist(process_data);
            if (other !== this && d > 0) {
                let diff = Vector.sub(this.pos, process_data);
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
        this.vel.limit(this.maxSpeed + this.dna.getInformation('SPEED'));
        let vel = this.vel.mag();
        
        this.pos.add(this.vel);
        this.acc.mult(0);
        let radius = this.radius;
        let decreaseQuantity = (radius * radius * vel * vel * vel * this.healthDecrease) / 100;
        decreaseQuantity += (this.dna.getInformation('FOOD_PERCEPTION') + this.dna.getInformation('POISON_PERCEPTION') + this.dna.getInformation('MATE_PERCEPTION') + this.dna.getInformation('FEAR_PERCEPTION')) * this.healthDecrease / 5000;
        //this.health -= (radius * radius * vel * vel * vel * this.healthDecrease / 100);
        this.health -= decreaseQuantity;
        this.health = clamp(this.health, 0, 1);
        this.radius = clamp(radius, 0, this.maxRadius);
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
            line(0, 0, 0, -this.dna.getInformation('FOOD_WEIGHT') * 25);
            strokeWeight(2);
            ellipse(0, 0, this.dna.getInformation('FOOD_PERCEPTION') * 2);
            stroke(255, 0, 0);
            line(0, 0, 0, -this.dna.getInformation('POISON_WEIGHT') * 25);
            ellipse(0, 0, this.dna.getInformation('POISON_PERCEPTION') * 2);
            stroke(0);
            line(0, 0, 0, -this.dna.getInformation('FEAR_WEIGHT') * 25);
            ellipse(0, 0, this.dna.getInformation('FEAR_PERCEPTION') * 2);
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
        this.dnaPrototype = creature_dna_prototype;
    }

    setDna(dna) {
        this.dnaPrototype = dna;
        return this;
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
    .setMaxSpeed(1.8)
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
    .setCanReproduce(true)

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