class System {
    constructor(System_name) {
        this.name = System_name;
        this.population = [];
        this.plant = [];
        this.item = [];
        this.field = [];
        this.weather = new Weather();
        this.property = new Property();
        this.time = second();
        this.log = [];
    }

    showGene(ctx, population_name, gene_name, resolution) {
        if (gene_name == 'NONE') return;
        for (let pop of this.population) {
            if (pop.name == population_name) {
                let box_x = width / 1.5;
                let box_y = height / 2;
                let box_width = 250;

                let stage = [];
                let RawInformation = pop.carrer.dnaPrototype.getRawInformation(gene_name);
                let offset = pop.carrer.dnaPrototype.getOffset(gene_name);

                let low = round(RawInformation[0] + 3 * offset[0], 1);
                let high = round(RawInformation[1] + 3 * offset[1], 1);
                let step = (high - low) / resolution;

                let start_x = (300 - (200 / resolution) * (resolution - 1)) / 2;
                let start_y = 250;

                for (let i = 0; i < resolution; i++) {
                    stage.push(0);
                }

                for (let creature of pop.list) {
                    let information = creature.dna.getInformation(gene_name);
                    let index = floor((information - low) / step);

                    stage[index] += 1;
                }

                let max = Math.max(...stage);
                let scl = 3;
                if (max > 30) {
                    scl /= (1 + 0.03 * (max - 30));
                }

                /*ctx.fillStyle = "rgb(7, 30, 52)";
                ctx.fillRect(0, 0, 300, 300);*/

                for (let i = 0; i < resolution; i++) {
                    /*ctx.beginPath();
                    ctx.fillStyle = "rgb(166, 226, 44)";
                    ctx.strokeStyle = "rgb(166, 226, 44)";
                    ctx.arc(start_x + i * (200 / resolution), start_y, 200 / 6 / resolution, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    ctx.save();
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.lineCap = "round";
                    ctx.strokeStyle = "rgb(166, 226, 44)";
                    ctx.translate(start_x + i * (200 / resolution), start_y);
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, -stage[i] * scl);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.restore();*/
                    

                    stroke(166, 226, 44);
                    circle(box_x + i * (box_width / resolution), box_y, (box_width / 6 / resolution));
                    line(box_x + i * (box_width / resolution), box_y, box_x + i * (box_width / resolution), box_y - stage[i] * scl);
                }

                /*ctx.font = 12 + "px Georgia";
                ctx.beginPath();
                ctx.fillStyle = "rgb(166, 226, 44)";
                ctx.textAlign = 'center';
                ctx.fillText(low, start_x, 265);
                ctx.fillText((low + high) / 2, start_x + (200 / resolution) * resolution / 2, 265);
                ctx.fillText(high, start_x + (200 / resolution) * (resolution - 1), 265);
                ctx.fillText(max, start_x, start_y - max * scl);
                ctx.fill();
                ctx.closePath();*/


                noStroke();
                strokeWeight((box_width / 6 / resolution));
                fill(166, 226, 44);
                text(low, box_x, box_y + 10);
                text((low + high) / 2, box_x + (box_width / resolution) * resolution / 2, box_y + 10);
                text(high, box_x + (box_width / resolution) * (resolution - 1), box_y + 10);
                //console.log(max);
                text(max, box_x, box_y - max * scl);
                return;
            }
        }
    }

    showSystemLog(start_x, start_y, name) {
        let color2 = color(255, 255, 255);
        let color1 = color(255, 0, 0);
        let showcolor = color1;
        let step = 1;

        if (this.log.length > 1) {
            step = 1 / (this.log.length - 1);
        } 
        let stage = 0;

        if (name === undefined) {
            let label_y = start_y - 100 - 10 * this.log.length;

            for (let log of this.log) {
                showcolor = lerpColor(color2, color1, stage);
                let string_width = textWidth(log.name);

                fill(showcolor);
                circle(start_x, label_y, 3);
                text(log.name, start_x + string_width / 2 + 3, label_y);
                log.show(start_x, start_y, showcolor);
                stage += step;
                label_y += 10;
            }
        } else {
            for (let log of this.log) {
                if (name == log.name) {
                    log.show(start_x, start_y, showcolor);
                }
            }
        }
    }

    systemLog(name, val) {
        if (name === undefined) {
            for (let log of this.log) {
                if (val === undefined) {
                    log.log(this.getList(log.name).length);
                } else {
                    log.log(val);
                }
            }
        } else {
            for (let log of this.log) {
                if (log.name == name) {
                    if (val === undefined) {
                        log.log(this.getList(log.name).length);
                    } else {
                        log.log(val);
                    }
                    return;
                }
            }
        }
    }

    systemAddLog(name, length) {
        if (name === undefined) {
            for (let pop of this.population) {
                this.log.push(new Log(pop.name));
            }
            for (let item of this.item) {
                this.log.push(new Log(item.name));
            }

        } else {
            this.log.push(new Log(name, length));
        }
    }

    systemInformation() {
        let box_x = width / 80;
        let box_y = width / 80;
        let box_width = (width + height) / 8;
        let box_height = box_width / 5;
        let string_width = 0;
        let string_margin = box_width / 40;
        let string_offset = box_width / 20;

        let list = ['Creature', 'Food', 'Poison', 'Body', 'FPS', 'Align', 'Cohesion', 'Separate', 'FindMate'];
        let list_data = [this.getTotalAnimal(), this.item[0].list.length + this.item[3].list.length, this.item[1].list.length, this.item[2].list.length, floor(frameRate()), alignSlider.value(), cohesionSlider.value(), separationSlider.value(), findMateSlider.value()];

        textSize((width + height) / 150);
        textFont('Georgia');
        // information box
        fill(7, 30, 52, 192);
        //rect(box_x, box_y, box_x + box_width, box_y + box_height, 15);

        fill(0, 191, 255);
        for (let i  = 0; i < list.length; i++) {
            string_width = textWidth(list[i]);
            text(list[i], box_x + string_width / 2 + string_offset, box_y + box_height / 4);
            text(list_data[i], box_x + string_width / 2 + string_offset, box_y + box_height * 2.5 / 4);
            string_offset += (string_width + string_margin);
        }

        // this.showThermometer(width - box_width / 10 * 2, height / 2, box_width / 10);
        // this.showHumidity(box_x + box_width / 10, box_y + box_height * 3.7 / 4, box_width / 25);
    }

    showHumidity(hygrometer_x, hygrometer_y, hygrometer_size) {
        let offset_x = 0;
        let offset_y = 0;
        let drop_quantity = 6;

        if (this.weather.humd != null) {
            drop_quantity = floor(this.weather.humd * 10);
        }

        fill(126, 160, 196);
        noStroke();
        for (let i = 0; i < drop_quantity; i++) {
            push();
            translate(hygrometer_x + offset_x, hygrometer_y + offset_y);
            beginShape();
            vertex(-hygrometer_size / 2, hygrometer_size);
            vertex(0, 0);
            vertex(hygrometer_size / 2, hygrometer_size);
            vertex(hygrometer_size / 3, hygrometer_size * 1.3);
            vertex(hygrometer_size / 4, hygrometer_size * 1.4);
            vertex(0, hygrometer_size * 3 / 2);
            vertex(-hygrometer_size / 4, hygrometer_size * 1.4);
            vertex(-hygrometer_size / 3, hygrometer_size * 1.3);
            vertex(-hygrometer_size / 2, hygrometer_size);
            endShape();
            pop();
            offset_x += hygrometer_size * 1.3;
        }
    }

    showThermometer(thermometer_x, thermometer_y, thermometer_size) {
        let thermometer_colour = color(237, 106, 44);
        let cold = color(96, 164, 230);
        let hot = color(197, 63, 61);
        let length = thermometer_size * 2;

        if (this.weather.temp != null) {
            colorMode(HSB);
            thermometer_colour = lerpColor(cold, hot, (this.weather.temp - 5) / 40);
            length = (thermometer_size * 4) * (this.weather.temp - 5) / 40;
        }

        stroke('gray');
        strokeWeight(thermometer_size / 6);
        noFill();
        angleMode(DEGREES);
        arc(thermometer_x, thermometer_y, thermometer_size * 1.5, thermometer_size * 1.5, -55, -125);

        line(thermometer_x - (thermometer_size * 0.75 * sin(30)), thermometer_y - (thermometer_size * 0.75 * cos(30)), thermometer_x - (thermometer_size * 0.75 * sin(30)), thermometer_y - thermometer_size * 4.5);
        line(thermometer_x + (thermometer_size * 0.75 * sin(30)), thermometer_y - (thermometer_size * 0.75 * cos(30)), thermometer_x + (thermometer_size * 0.75 * sin(30)), thermometer_y - thermometer_size * 4.5);

        arc(thermometer_x, thermometer_y - thermometer_size * 4.5, thermometer_size * 1.5 * sin(30), thermometer_size * 1.5 * sin(30), -180, 0);

        noStroke();
        fill(thermometer_colour);
        ellipse(thermometer_x, thermometer_y, thermometer_size, thermometer_size);
        stroke(thermometer_colour);
        strokeWeight(thermometer_size / 5);
        
        line(thermometer_x, thermometer_y - thermometer_size / 2, thermometer_x, thermometer_y - (thermometer_size / 2 + length));

        textAlign(CENTER, CENTER);
        textSize(thermometer_size / 2 - 1);
        colorMode(RGB);
        fill(255);
        stroke(lerpColor(thermometer_colour, color(0), 0.5));
        strokeWeight(thermometer_size / 10);
        text(this.weather.temp, thermometer_x, thermometer_y);

        colorMode(RGB);
        angleMode(RADIANS);
    }

    updatePlant(plant_name) {
        if (plant_name === undefined) {
            for (let plant of this.plant) {
                plant.update(this);
            }
        } else {
            let index = null;
            
            for (let i = 0; i < this.plant.length; i++) {
                if (this.plant[i].name == plant_name) {
                    plant = i;
                }
            }
            
            if (index != null) {
                this.plant[index].update(this);
            }
        }
    }

    showPlant(plant_name) {
        if (plant_name === undefined) {
            for (let plant of this.plant) {
                plant.show();
            }
        } else {
            let index = null;
            
            for (let i = 0; i < this.plant.length; i++) {
                if (this.plant[i].name == plant_name) {
                    plant = i;
                }
            }
            
            if (index != null) {
                this.plant[index].show();
            }
        }
    }

    addCoral(plant_name, num, x, y, r, area_radius, grow_length, colour) {
        let index = null;
        
        for (let i = 0; i < this.plant.length; i++) {
            if (this.plant[i].name == plant_name) {
                index = i;
            }
        }
        
        if (index != null) {
            this.plant[index].addPlant(num, x, y, r, area_radius, grow_length, colour);
        }
    }

    addPlant(plant_name, species) {
        this.plant.push(new Plant(plant_name, species));
    }

    updateQlist() {
        for (let pop of this.population) {
            pop.sort_qlist();
        }

        for (let it of this.item) {
            it.sort_qlist();
        }
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

            if (this.weather.uvi != null) {
                if (this.weather.uvi < 2) {
                    this.property.setMutationRate(0.01);
                } else if (this.weather.uvi < 4) {
                    this.property.setMutationRate(0.02);
                } else if (this.weather.uvi < 6) {
                    this.property.setMutationRate(0.03);
                } else if (this.weather.uvi < 10) {
                    this.property.setMutationRate(0.04);
                } else {
                    this.property.setMutationRate(0.05);
                }
            } 
        }
    }

    updateWeather(weather) {
        this.weather.update(weather);
        this.angleField('WIND', aquarium.weather.wdir, aquarium.weather.wdsd);
        this.randomField('WATER', aquarium.weather.wdsd / 2);
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

        for (let p of this.plant) {
            if (p.name == name) {
                return p.list;
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

    updateItem(field_name, object_name) {
        if (field_name === undefined) {
            for (let field of this.field) {
                //console.log(field);
                if (object_name === undefined) {
                    for (let object_list of this.item) {
                        object_list.update(this, field);
                    }
                } else {
                    let index_o = null;

                    for (let i = 0; i < this.item.length; i++) {
                        if (this.item[i].name == object_name) {
                            index_o = i;
                        }
                    }

                    if (index_o != null) {
                        this.item[index_o].update(this, field);
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
                        object_list.update(this, this.field[index]);
                    }
                } else {
                    let index_o = null;

                    for (let i = 0; i < this.item.length; i++) {
                        if (this.item[i].name == object_name) {
                            index_o = i;
                        }
                    }

                    if (index_o != null) {
                        this.item[index_o].update(this, this.field[index]);
                    }
                }
            }
        }
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
                pop.update(this);
            }
        } else {
            let index = null;
            
            for (let i = 0; i < this.population.length; i++) {
                if (this.population[i].name == population_name) {
                    index = i;
                }
            }
            
            if (index != null) {
                this.population[index].update(this);
            }
        }

        for (let pop of this.population) {
            if (pop.carrer.canReproduce) {
                for (let indiviual of pop.list) {
                    if (this.getTotalAnimal() < this.property.max_creature) {
                        indiviual.reproduce(pop.name, pop.carrer.dnaPrototype, this.property.mutation_rate, this.property.reproduction_rate);
                    } 
                }
            }
            if (pop.carrer.canProvide) {
                for (let indiviual of pop.list) {
                    if (random(1) < this.property.provide_rate) {
                        //aquarium.addStuff('FOOD', 1, indiviual.pos.x, indiviual.pos.y);
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
        if (second() != this.time && this.item[0].list.length < 150) {
            this.addStuff('FOOD', 4);
        }
        this.time = second();
        if (random(1) < this.property.provide_rate) {
            this.addStuff('POISON', 1);
        }
        //console.log(creature_list.length);
        /*if (this.getList('CREATURE').length < 50) {
            this.addAnimal('CREATURE', 10);
        }*/
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

class Log {
    constructor(name, length) {
        this.name = name;
        this.length = length || 250;
        this.information = [];
    }

    show(start_x, start_y, color) {
        push();
        translate(start_x, start_y);
        beginShape();
        noFill();
        stroke(color);
        let line_width = clamp(500 / this.length, 1, 2);
        strokeWeight(line_width);

        let max = Math.max(...this.information);
        let scl = 1;
        if (max > 100) {
            scl = 1 / (1 + 0.01 * (max - 100));
        } else if (max < 30) {
            scl = 3.33 / (1 + 0.03 * (30 - max));
        }

        let step = 250 / (this.information.length + 1);

        for (let i = 0; i < this.information.length; i++) {
            vertex(i * step, - this.information[i] * scl);
        }
        endShape();
        pop();
    }

    log(val) {
        this.information.push(val);
        if (this.information.length > this.length) {
            this.information.splice(0, 1);
        }
    }
}

class population {
    constructor(name, carrer, flock) {
        this.name = name;
        this.carrer = carrer;
        this.flock = flock || [0.5, 0.4, 0.8];
        this.boundary = new Rectangle(width / 2, height / 2, width, height);
        this.list = [];
        this.qlist = new QuadTree(this.boundary, 4);
        this.deletelist = [];
    }

    update(system) {
        for (let i = 0; i < this.list.length; i++) {
            this.list[i].boundaries();
            //this.list[i].applyFlock(this.qlist);
            this.list[i].behavior(system, this.qlist, this.flock);
            this.list[i].update();
            if (this.list[i].isDead()) {
                if (this.list[i].radius > 10) {
                    system.addStuff('BODY', 1, this.list[i].pos.x, this.list[i].pos.y);
                }
                system.killAnimal(this.name, i);
            }
        }
    }
    
    show() {
        for (let animal of this.list) {
            animal.display();
        }
    }
    
    sort_qlist() {
        let list = sort(this.deletelist, this.deletelist.length);

        for (let i = this.deletelist.length - 1; i >= 0; i--) {
            this.list.splice(list[i], 1);
        }
        this.deletelist = [];
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
        //this.sort_qlist();
    }
    
    killAnimal(index) {
        this.deletelist.push(index);
        //this.list.splice(index, 1);
        //this.sort_qlist();
    }
}

class Weather {
    constructor() {
        this.wdir = null;
        this.wdsd = null;
        this.temp = null;
        this.humd = null;
        this.pres = null;
        this.uvi = null;
    }

    update(weather) {
        if (weather) {
            this.wdir = abs(int(weather["records"]["location"][0]["weatherElement"][1]["elementValue"]));
            this.wdsd = float(weather["records"]["location"][0]["weatherElement"][2]["elementValue"]);
            this.temp = float(weather["records"]["location"][0]["weatherElement"][3]["elementValue"]);
            this.humd = float(weather["records"]["location"][0]["weatherElement"][4]["elementValue"]);
            this.pres = float(weather["records"]["location"][0]["weatherElement"][5]["elementValue"]);
            this.uvi = float(weather["records"]["location"][0]["weatherElement"][13]["elementValue"]);
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
            if (this.uvi == -99) {
                this.uvi = null;
            }
        }
    }
}

class Property {
    constructor() {
        this.max_creature = 150;
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
        this.radius = radius || 1;
        this.boundary = new Rectangle(width / 2, height / 2, width, height);
        this.list = [];
        this.qlist = new QuadTree(this.boundary, 4);
        this.canMove = canMove || false;
        this.deletelist = [];
    }

    update(system, field) {
        for (let object of this.list) {
            object.edges();
            if (this.canMove) {
                object.follow(field);
            }
            if (system.weather.wdsd != null) {
                object.update(system.weather.wdsd / 10);
            } else {
                object.update();
            }
                            
        }
    }
    
    show() {
        for (let s of this.list) {
            fill(this.colour);
            noStroke();
            ellipse(s.pos.x, s.pos.y, this.radius * 2, this.radius * 2);
        }
    }
    
    deleteItem(index) {
        this.deletelist.push(index);
        //this.list.splice(index, 1);
        //this.sort_qlist();
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
        //this.sort_qlist();
    }
    
    sort_qlist() {
        let list = sort(this.deletelist, this.deletelist.length);

        for (let i = this.deletelist.length - 1; i >= 0; i--) {
            this.list.splice(list[i], 1);
        }
        this.deletelist = [];
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
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.field[i + j * this.cols] = new Vector.fromAngle((angle + 90) / 180 * Math.PI);
                this.field[i + j * this.cols].setMag(mag);
            }
        }
    }
}

class Plant {
    constructor (plant_name, species) {
        this.name = plant_name;
        this.species = species;
        this.list = [];
    }

    update(system) {
        for (let list of this.list) {
            list.update(system);
        }
    }

    show() {
        for (let list of this.list) {
            list.show();
        }
    }

    addPlant(num, xx, yy, rr, area_radiuss, grow_lengthh, colourr) {
        let x = xx;
        let y = yy;
        let r = rr;
        let area_radius = area_radiuss;
        let grow_length = grow_lengthh;
        let colour = colourr;

        let random_pos = false;
        let random_radius = false;
        let random_area_radius = false;
        let random_grow_length = false;
        let random_colour = false;

        if (x === undefined && y === undefined) {
            random_pos = true;
        }
        if (r === undefined) {
            random_radius = true;
        }
        if (area_radius === undefined) {
            random_area_radius = true;
        }
        if (grow_length === undefined) {
            random_grow_length = true;
        }
        if (colour === undefined) {
            random_colour = true;
        }

        for (let i = 0; i < num; i++) {
            if (random_pos) {
                x = random(width);
                y = random(height);
            }
            if (random_radius) {
                r = random(1, 2);
            }
            if (random_area_radius) {
                area_radius = random(20, 30);
            }
            if (random_grow_length) {
                grow_length = random(30, 50);
            }
            if (random_colour) {
                let colour1 = color(234, 61, 37);
                let colour2 = color(236, 106, 85);
                colour = lerpColor(colour1, colour2, random(1));
            }
            this.list.push(new Coral(x, y, r, area_radius, grow_length, colour));
        }
    }
}