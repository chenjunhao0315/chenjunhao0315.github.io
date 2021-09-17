let g;
let man;
let ball_list = [];
let score = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  g = createVector(0, 0.2);
  man = new Man;
  ball_list.push(new Ball("food", getRandomPos(ball_list, man)));
  ball_list.push(new Ball("poison", getRandomPos(ball_list, man)));
  textSize(32);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0);
  fill(255);
  text(score, 32, 32);
  man.update();
  let status = man.check(ball_list);
  if (status <= 0)
    noLoop();
  else if (status == 1) {
    score++;
    ball_list.push(new Ball("food", getRandomPos(ball_list, man)));
    ball_list.push(new Ball("poison", getRandomPos(ball_list, man)));  
  }

  man.show();
  for (let ball of ball_list)
    ball.show();
}

class Man {
  constructor() {
    this.pos = createVector(windowWidth / 2, windowHeight / 2);
    this.vel = createVector(0, 0);
  }

  update() {
    this.pos = this.pos.add(this.vel.add(g));
  }

  check(ball_list) {
    if (this.pos.x < 0 || this.pos.x > windowWidth || this.pos.y < 0 || this.pos.y > windowHeight)
        return -1;
    for (let i = ball_list.length - 1; i >= 0; --i) {
      if (this.pos.dist(ball_list[i].pos) < 20) {
        if (ball_list[i].type == "food") {
          ball_list.splice(i, 1);
          return 1;
        }
        else {
          return 0;
        }
      }
    }
    for (let ball of ball_list) {
      if (this.pos.dist(ball.pos) < 20) {
        if (ball.type == "food")
          return 1;
        else {
          return 0;
        }
      }
    }
    return 2;
  }

  show() {
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y, 30, 30);
  }

}

class Ball {
  constructor(type, pos) {
    this.type = type;
    this.pos = pos;
  }

  show() {
    noStroke();
    if (this.type == "food") {
      fill(0, 255, 0);
      ellipse(this.pos.x, this.pos.y, 10, 10);
    } else if (this.type == "poison") {
      fill(255, 0, 0);
      ellipse(this.pos.x, this.pos.y, 10, 10);
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    man.vel.add(createVector(-1, 0));
  } else if (keyCode === RIGHT_ARROW) {
    man.vel.add(createVector(1, 0));
  } else if (keyCode === 32) {
    man.vel.add(createVector(0, -3));
  }
}

function getRandomPos(ball_list, man) {
  let pos = createVector(random(5, windowWidth - 5), random(5, windowHeight - 5));
  let finish = false;
  while(!finish) {
    let check = false;
    for (let ball of ball_list) {
      if (ball.pos.dist(pos) < 10)
        check = true;
    }
    if (man.pos.dist(pos) < 20) {
      check = true;
    }
    if (check == false)
      finish = true;
  }
  console.log(pos);
  return pos;
}

var keys = {};
window.addEventListener("keydown",
    function(e){
        keys[e.code] = true;
        switch(e.code){
            case "ArrowUp": case "ArrowDown": case "ArrowLeft": case "ArrowRight":
            case "Space": e.preventDefault(); break;
            default: break; // do not block other keys
        }
    },
false);
window.addEventListener('keyup',
    function(e){
        keys[e.code] = false;
    },
false);