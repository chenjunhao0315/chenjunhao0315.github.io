let debug;

let weather_data;
let preminute;

let aquarium;

let test_coral;

let alignSlider, cohesionSlider, separationSlider, findMateSlider;

function preload() {
    let url = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-0505FC6C-E0E7-4991-9FD4-1D01A8C4E39C&format=JSON&locationName=%E6%96%B0%E7%AB%B9";
    weather_data = loadJSON(url);
    
    //print(weather_data);
}

function setup() {
    createCanvas(windowWidth, windowHeight * 3 / 4);

    alignSlider = createSlider(0, 2, 0.8, 0.1);
    cohesionSlider = createSlider(0, 2, 0.7, 0.1);
    separationSlider = createSlider(0, 2, 0.8, 0.1);
    findMateSlider = createSlider(0, 2, 0.3, 0.1);
    
    aquarium = new System('aquarium');
    aquarium.addPopulation('CREATURE', CREATURE);
    aquarium.addPopulation('EATER', EATER);
    aquarium.addAnimal('CREATURE', 50);
    aquarium.addAnimal('EATER', floor(random(2, 4)));
    aquarium.addItem('FOOD', [0, 255, 0], 1, true);
    aquarium.addItem('POISON', [255, 0, 0], 1, true);
    aquarium.addStuff('FOOD', 100);
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
    //aquarium.plant[0].addPlant(10);

    //test_coral = new Coral(width / 2, height / 2, 2, 20, 30, color(236, 106, 85));
    
    debug = createCheckbox();
}

function draw() {
    //background(7, 30, 52);
    aquarium.background();

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

    aquarium.updateQlist();

    aquarium.systemInformation();
    
    preminute = minute();

    /*noFill();
    stroke(0, 200, 0);
    strokeWeight(1);
    circle(mouseX, mouseY, 50);*/
}

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

