class System {
    constructor(System_name) {
        this.name = System_name;
        this.population = [];
        this.item = [];
        this.field = [];
        this.weather = new Weather();
        this.property = new Property();
    }

    background() {
        if (this.weather.temp == null) {
            background(this.property.colour[0]);
        } else {
            background(this.property.colour[2]);
        }
    }

    environmentcontrol(weather) {
        if (weather) {
            this.updateWeather(weather);
            if (this.weather.temp > this.property.temp[1] || this.weather.temp < this.property.temp[0]) {
                this.property.setProvideRate(0.02);
            }

            let range = this.property.temp[1] - this.property.temp[0];
            let diff = abs(this.weather.temp - (this.property.temp[1] + this.property.temp[0]) / 2);
            let offset = map(diff, 0, range, 0, 1);
            this.property.colour[2] = lerpColor(this.property.colour[0], this.property.colour[1], offset);
        }
    }

    updateWeather(weather) {
        this.weather.update(weather);
        this.angleField('WIND', aquarium.weather.wdir, aquarium.weather.wdsd);
        this.randomField('WATER', aquarium.weather.wdsd / 2);
    }

    updateField(field_name, object_name) {
        if (field_name === undefined) {
            for (let field of this.field) {
                //console.log(field);
                if (object_name === undefined) {
                    for (let object_list of this.item) {
                        for (let object of object_list.list) {
                            object.edges();
                            object.follow(field);
                            if (this.weather.wdsd != null) {
                                object.update(this.weather.wdsd / 10);
                            } else {
                                object.update();
                            }
                            
                        }
                    }
                } else {
                    let index_o = null;

                    for (let i = 0; i < this.item.length; i++) {
                        if (this.item[i].name == object_name) {
                            index_o = i;
                        }
                    }

                    if (index_o != null) {
                        for (let object of this.item[index_o].list) {
                            object.edges();
                            object.follow(field);
                            if (this.weather.wdsd != null) {
                                object.update(this.weather.wdsd / 10);
                            } else {
                                object.update();
                            }
                        }
                    }
                }
            }
        } else {
            let index = null;
            
            for (let i = 0; i < this.field.length; i++) {
                if (this.field[i].name == field_name) {
                    index = i;
                }
            }
            
            if (index != null) {
                if (object_name === undefined) {
                    for (let object_list of this.item) {
                        for (let object of object_list.list) {
                            object.edges();
                            object.follow(this.field[index]);
                            if (this.weather.wdsd != null) {
                                object.update(this.weather.wdsd / 10);
                            } else {
                                object.update();
                            }
                        }
                    }
                } else {
                    let index_o = null;

                    for (let i = 0; i < this.item.length; i++) {
                        if (this.item[i].name == object_name) {
                            index_o = i;
                        }
                    }

                    if (index_o != null) {
                        for (let object of this.item[index_o].list) {
                            object.edges();
                            object.follow(this.field[index]);
                            if (this.weather.wdsd != null) {
                                object.update(this.weather.wdsd / 10);
                            } else {
                                object.update();
                            }
                        }
                    }
                }
            }
        }
    }

    angleField(field_name, angle, mag = 1) {
        let index = null;
        
        for (let i = 0; i < this.field.length; i++) {
            if (this.field[i].name == field_name) {
                index = i;
            }
        }
        
        if (index != null) {
            this.field[index].angle(angle, mag);
        }
    }

    randomField(field_name, mag = 1) {
        let index = null;
        
        for (let i = 0; i < this.field.length; i++) {
            if (this.field[i].name == field_name) {
                index = i;
            }
        }
        
        if (index != null) {
            this.field[index].random(mag);
        }
    }
    
    addField(field_name, scl) {
        this.field.push(new flow_field(field_name, scl));
    }

    getTotalAnimal() {
        let total = 0;
        for (let pop of this.population) {
            total += pop.list.length;
        }
        return total;
    }

    getList(name) {
        let index = null;
        
        for (let p of this.population) {
            if (p.name == name) {
                return p.list;
            }
        }
        
        for (let i of this.item) {
            if (i.name == name) {
                return i.list;
            }
        }
        return null;
    }
    
    getQList(name) {
        let index = null;
        
        for (let p of this.population) {
            if (p.name == name) {
                return p.qlist;
            }
        }
        
        for (let i of this.item) {
            if (i.name == name) {
                return i.qlist;
            }
        }
        return null;
    }
    
    showItem(item_name) {
        if (item_name === undefined) {
            for (let it of this.item) {
                it.show();
            }
        } else {
            let index = null;
            
            for (let i = 0; i < this.item.length; i++) {
                if (this.item[i].name == item_name) {
                    index = i;
                }
            }
            
            if (index != null) {
                this.item[index].show();
            }
        }
    }
    
    addItem(name, colour, radius, canMove) {
        this.item.push(new stuff(name, colour, radius, canMove));
    }
    
    addStuff(item_name, num, x, y) {
        let index = null;
        
        for (let i = 0; i < this.item.length; i++) {
            if (this.item[i].name == item_name) {
                index = i;
            }
        }
        
        if (index != null) {
            this.item[index].addItem(num, x, y);
        }
    }
    
    deleteStuff(item_name, index) {
        let index_i = null;
        
        for (let i = 0; i < this.item.length; i++) {
            if (this.item[i].name == item_name) {
                index_i = i;
            }
        }
        
        if (index_i != null) {
            this.item[index_i].deleteItem(index);
        }
    }
    
    updatePopulation(population_name) {
        if (population_name === undefined) {
            for (let pop of this.population) {
                for (let i = 0; i < pop.list.length; i++) {
                    pop.list[i].boundaries();
                    pop.list[i].applyFlock(pop.qlist);
                    pop.list[i].behavior(this);
                    pop.list[i].update();
                    if (pop.list[i].isDead()) {
                        if (pop.list[i].radius > 10) {
                            this.addStuff('BODY', 1, pop.list[i].pos.x, pop.list[i].pos.y);
                        }
                        this.killAnimal(pop.name, i);
                    }
                }
            }
        } else {
            let index = null;
            
            for (let i = 0; i < this.population.length; i++) {
                if (this.population[i].name == population_name) {
                    index = i;
                }
            }
            
            if (index != null) {
                for (let i = 0; i < this.population[index].list.length; i++) {
                    this.population[index].list[i].boundaries();
                    this.population[index].list[i].applyFlock(this.population[index].qlist);
                    this.population[index].list[i].behavior(this.item[0].qlist, this.item[1].qlist);
                    this.population[index].list[i].update();
                    if (this.population[index].list[i].isDead()) {
                        this.killAnimal(population_name, i);
                    }
                }
            }
        }

        for (let pop of this.population) {
            if (pop.carrer.canReproduce) {
                for (let indiviual of pop.list) {
                    if (this.getTotalAnimal() < this.property.max_creature && random(1) < this.property.reproduction_rate) {
                        indiviual.reproduce(pop.name, this.property.mutation_rate);
                    }
                }
            }
            if (pop.carrer.canProvide) {
                for (let indiviual of pop.list) {
                    if (random(1) < this.property.provide_rate) {
                        aquarium.addStuff('FOOD', 1, indiviual.pos.x, indiviual.pos.y);
                    }
                }
            }
        }
    }
    
    showPopulation(population_name) {
        if (population_name === undefined) {
            for (let pop of this.population) {
                pop.show();
            }
        } else {
            let index = null;
            
            for (let i = 0; i < this.population.length; i++) {
                if (this.population[i].name == population_name) {
                    index = i;
                }
            }
            
            if (index != null) {
                this.population[index].show();
            }
        }
    }
    
    addPopulation(name, carrer) {
        this.population.push(new population(name, carrer));
    }
    
    addAnimal(population_name, num, x, y, r, dna) {
        let index = null;
        
        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].name == population_name) {
                index = i;
            }
        }
        
        if (index != null) {
            this.population[index].addAnimal(num, x, y, r, dna);
        }
    }
    
    killAnimal(population_name, index) {
        let index_p = null;
        
        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].name == population_name) {
                index_p = i;
            }
        }
        
        if (index_p != null) {
            this.population[index_p].killAnimal(index);
        }
    }
    
    populationcontrol() {
        if (random(1) < this.property.provide_rate) {
            this.addStuff('FOOD', 12);
        }
        if (random(1) < this.property.provide_rate) {
            this.addStuff('POISON', 1);
        }
        //console.log(creature_list.length);
        if (this.getList('CREATURE').length < 50) {
            this.addAnimal('CREATURE', 10);
        }
        //console.log(eater_list.length);
        if (this.getList('EATER').length < 1) {
            this.addAnimal('EATER', floor(random(1, 4)));
        }
        
        if (this.getList('CLEANER').length < 1) {
            this.addAnimal('CLEANER', floor(random(1, 10)));
        }
        
        if (this.getList('PROVIDER').length < 1) {
            this.addAnimal('PROVIDER', floor(random(1, 4)));
        }
    }
}

class population {
    constructor(name, carrer) {
        this.name = name;
        this.carrer = carrer;
        this.boundary = new Rectangle(width / 2, height / 2, width, height);
        this.list = [];
        this.qlist = new QuadTree(this.boundary, 4);
    }
    
    show() {
        for (let animal of this.list) {
            animal.display();
        }
    }
    
    sort_qlist() {
        this.qlist.clear();
        for (let i = 0; i < this.list.length; i++) {
            this.qlist.addItem(this.list[i].pos.x, this.list[i].pos.y, this.list[i], i);
        }
    }
    
    addAnimal(num, xx, yy, rr, dna) {
        let x = xx;
        let y = yy;
        let r = rr;
        
        let random_pos = false;
        let random_r = false;
        
        if (x === undefined && y === undefined) {
            random_pos = true;
        }
        if (r === undefined) {
            random_r = true;
        }
        
        for (let i = 0; i < num; i++) {
            if (random_pos) {
                x = random(width);
                y = random(height);
            }
            if (random_r) {
                r = random(this.carrer.randomR[0], this.carrer.randomR[1]);
            }
            this.list.push(new fish(x, y, r, this.carrer, dna));
        }
        this.sort_qlist();
    }
    
    killAnimal(index) {
        this.list.splice(index, 1);
        this.sort_qlist();
    }
}

class Weather {
    constructor() {
        this.wdir = null;
        this.wdsd = null;
        this.temp = null;
        this.humd = null;
        this.pres = null;
    }

    update(weather) {
        if (weather) {
            this.wdir = abs(int(weather["records"]["location"][0]["weatherElement"][1]["elementValue"]));
            this.wdsd = float(weather["records"]["location"][0]["weatherElement"][2]["elementValue"]);
            this.temp = float(weather["records"]["location"][0]["weatherElement"][3]["elementValue"]);
            this.humd = float(weather["records"]["location"][0]["weatherElement"][4]["elementValue"]);
            this.pres = float(weather["records"]["location"][0]["weatherElement"][5]["elementValue"]);
            if (this.wdir == -99) {
                this.wdir = null;
            }
            if (this.wdsd == -99) {
                this.wdir = null;
            }
            if (this.temp == -99) {
                this.wdir = null;
            }
            if (this.humd == -99) {
                this.wdir = null;
            }
            if (this.pres == -99) {
                this.wdir = null;
            }
        }
    }
}

class Property {
    constructor() {
        this.max_creature = 200;
        this.provide_rate = 0.03;
        this.reproduction_rate = 0.5;
        this.mutation_rate = 0.01;
        this.temp = [20, 26];
        this.colour = [color(7, 30, 52), color(9, 40, 69), color(7, 30, 52)];
    }

    setTemp(low, high) {
        this.temp = [low, high];
    }

    setMaxcreature(val) {
        this.max_creature = val;
    }

    setProvideRate(val) {
        this.provide_rate = val;
    }

    setReproductionRate(val) {
        this.reproduction_rate = val;
    }

    setMutationRate(val) {
        this.mutation_rate = val;
    }

    setColour(colour1, colour2) {
        if (colour1) {
            this.colour[0] = colour1;
        }
        if (colour2) {
            this.colour[1] = colour2;
        }
    }
}

class stuff {
    constructor(name, colour, radius, canMove) {
        this.name = name;
        this.colour = colour;
        this.radius = radius || 2;
        this.boundary = new Rectangle(width / 2, height / 2, width, height);
        this.list = [];
        this.qlist = new QuadTree(this.boundary, 4);
        this.canMove = canMove || false;
    }
    
    show() {
        for (let s of this.list) {
            fill(this.colour);
            noStroke();
            ellipse(s.pos.x, s.pos.y, this.radius, this.radius);
        }
    }
    
    deleteItem(index) {
        this.list.splice(index, 1);
        this.sort_qlist();
    }
    
    addItem(num, xx, yy) {
        let x = xx;
        let y = yy;
        
        let random_pos = false;
        
        if (x === undefined && y === undefined) {
            random_pos = true;
        }
        
        for (let i = 0; i < num; i++) {
            if (random_pos) {
                x = random(width);
                y = random(height);
            }
            this.list.push(new Entity(x, y));
        }
        this.sort_qlist();
    }
    
    sort_qlist() {
        this.qlist.clear();
        for (let i = 0; i < this.list.length; i++) {
            this.qlist.addItem(this.list[i].pos.x, this.list[i].pos.y, this.list[i], i);
        }
    }
}

class flow_field {
    constructor (field_name, scl) {
        this.name = field_name;
        this.scl = scl;
        this.cols = floor(width / scl) + 1;
        this.rows = floor(height / scl) + 1;
        this.field = Array(this.cols * this.rows);
    }

    random(mag) {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.field[i + j * this.cols] = new Vector.random2D();
                this.field[i + j * this.cols].setMag(mag);
            }
        }
    }

    angle(angle, mag) {
        //console.log(angle);
        //print(angle);
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.field[i + j * this.cols] = new Vector.fromAngle((angle + 90) / 180 * Math.PI);
                this.field[i + j * this.cols].setMag(mag);
            }
        }
    }
}