let debug;

let width = 1440;
let height = 423;

let weather_data;
let preminute, presecond;

let aquarium;

let alignSlider, cohesionSlider, separationSlider, findMateSlider;
let resolutionSlider, geneSelector, populationSelector;

let wave = [];
let wave_food = [];

let gene_canvas = document.querySelector("#gene");
let gene_ctx = gene_canvas.getContext("2d");
let aquarium_canvas = document.querySelector("#aquarium");
let aquarium_ctx = aquarium_canvas.getContext("2d");

let devicePixelRatio = 3;

// get current size of the canvas
let rect1 = gene_canvas.getBoundingClientRect();
let rect2 = aquarium_canvas.getBoundingClientRect();

// increase the actual size of our canvas
gene_canvas.width = rect1.width * devicePixelRatio;
gene_canvas.height = rect1.height * devicePixelRatio;
aquarium_canvas.width = rect2.width * devicePixelRatio;
aquarium_canvas.height = rect2.height * devicePixelRatio;

// ensure all drawing operations are scaled
gene_ctx.scale(devicePixelRatio, devicePixelRatio);
aquarium_ctx.scale(devicePixelRatio, devicePixelRatio);

// scale everything down using CSS
gene_canvas.style.width = rect1.width + 'px';
gene_canvas.style.height = rect1.height + 'px';
aquarium_canvas.style.width = rect2.width + 'px';
aquarium_canvas.style.height = rect2.height + 'px';


function preload() {
    // let url = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-0505FC6C-E0E7-4991-9FD4-1D01A8C4E39C&format=JSON&locationName=%E6%96%B0%E7%AB%B9";
    // weather_data = loadJSON(url);
    //weather_data = loadJSON('assets/weather_data');
    //print(weather_data);
}

function init() {
    /*alignSlider = createSlider(0, 2, 0.5, 0.1);
    cohesionSlider = createSlider(0, 2, 0.4, 0.1);
    separationSlider = createSlider(0, 2, 0.8, 0.1);
    findMateSlider = createSlider(1, 2, 1, 0.1);
    resolutionSlider = createSlider(10, 50, 20, 1);
    populationSelector = createSelect();
    populationSelector.option('CREATURE');
    populationSelector.option('EATER');
    populationSelector.option('CLEANER');
    populationSelector.option('PROVIDER');
    geneSelector = createSelect();
    geneSelector.option('FOOD_WEIGHT');
    geneSelector.option('POISON_WEIGHT');
    geneSelector.option('FEAR_WEIGHT');
    geneSelector.option('MATE_WEIGHT');
    geneSelector.option('FOOD_PERCEPTION');
    geneSelector.option('POISON_PERCEPTION');
    geneSelector.option('MATE_PERCEPTION');
    geneSelector.option('FEAR_PERCEPTION');
    geneSelector.option('CHILD_QUANTITY');
    geneSelector.option('SPEED');
    geneSelector.option('NONE');*/
    
    
    aquarium = new System('aquarium');
    aquarium.addPopulation('CREATURE', CREATURE);
    aquarium.addPopulation('EATER', EATER);
    aquarium.addAnimal('CREATURE', 100);
    aquarium.addAnimal('EATER', floor(random(2, 4)));
    aquarium.addItem('FOOD', [0, 255, 0], 1, true);
    aquarium.addItem('POISON', [255, 0, 0], 1, true);
    aquarium.addStuff('FOOD', 150);
    aquarium.addStuff('POISON', 10);
    aquarium.addPopulation('CLEANER', CLEANER);
    aquarium.addAnimal('CLEANER', 4);
    aquarium.addPopulation('PROVIDER', PROVIDER);
    aquarium.addAnimal('PROVIDER', 4);
    aquarium.addItem('BODY', [255, 255, 0], 1, true);
    aquarium.addField('WIND', height);
    aquarium.addField('WATER', 20);
    aquarium.updateWeather(weather_data);

    aquarium.addItem('CORAL_FOOD', [255, 0, 255], 1, false);
    aquarium.addPlant('CORAL', 'CORAL');
    aquarium.addCoral('CORAL', 10);

    aquarium.systemAddLog('CREATURE');
    aquarium.systemAddLog('FOOD');
    
    //debug = createCheckbox();
}

init();

function animate() {
    aquarium_ctx.fillStyle = "rgb(7, 30, 52)";
    aquarium_ctx.fillRect(0, 0, 300, 300);

    //aquarium.showGene(gene_ctx, populationSelector.value(), geneSelector.value(), resolutionSlider.value());
    /*aquarium.background();

    aquarium.showGene(gene_ctx, populationSelector.value(), geneSelector.value(), resolutionSlider.value());

    aquarium.updateQlist();

    aquarium.populationcontrol();
    if (preminute != minute()) {
        aquarium.environmentcontrol(weather_data);
    }

    aquarium.updatePlant();
    aquarium.showPlant();

    aquarium.updateItem();
    aquarium.showItem();

    aquarium.updatePopulation();
    aquarium.showPopulation();

    aquarium.systemInformation();

    if (second() != presecond) {
        aquarium.systemLog('CREATURE');
        aquarium.systemLog('FOOD', aquarium.item[0].list.length + aquarium.item[3].list.length);
        wave.push(aquarium.getTotalAnimal());
        wave_food.push(aquarium.item[0].list.length + aquarium.item[3].list.length);
    }

    push();
    translate(500, 30);
    beginShape();
    noFill();
    stroke(255);
    strokeWeight(2);
    for (let i = 0; i < wave.length; i++) {
        vertex(i * 2, height / 2 - wave[i]);
    }
    endShape();
    beginShape();
    stroke(255, 0, 0);
    for (let i = 0; i < wave_food.length; i++) {
        vertex(i * 2, height / 2 - wave_food[i]);
    }
    endShape();
    pop();

    if (wave.length > 150) {
        wave.splice(0, 1);
    }
    if (wave_food.length > 150) {
        wave_food.splice(0, 1);
    }
    
    preminute = minute();
    presecond = second();
    */
    window.requestAnimationFrame(animate);
}

animate();

function clamp(value, min, max) {
  if (value >= max) {
    return max;
  } else if (value <= min) {
    return min;
  }
  return value;
}

function maximum(value1, value2) {
    if (value2 > value1) {
        return value2;
    }
    return value1;
}

function mousePressed() {
    for (let i = 0; i < 10; i++) {
        let x = mouseX + random(-25, 25);
        let y = mouseY + random(-25, 25);
        aquarium.addStuff('FOOD', 1, x, y);
    }
}

