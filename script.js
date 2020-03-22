let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('myCanvas'));
let context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const width = canvas.width;
const height = canvas.height;
let colors = [ '#900C3E', '#C70039', '#FF5733', '#FFC300'];

class MyAnimation {
  constructor(number){
    this.number = number;
    this.circles = [];
    this.start = null;
    this.setup();
  }

  setup(){
    let radius = 50;
    let spawn = {};
    let velocity = {};
    let randomVelocity = 1;
    for(let i = 0; i<this.number; i++){
      let color = colors[Math.floor(Math.random()*colors.length)];
      spawn.x = Math.random()*(width-2*radius) + radius; 
      spawn.y = Math.random()*(height-2*radius) + radius; 
      let x = Math.random()*randomVelocity - randomVelocity/2; 
      let y = Math.random()*randomVelocity - randomVelocity/2; 
      this.circles.push(new Circle(radius, spawn.x, spawn.y, x, y, color));
    }
  }

  step(timestamp){
    this.update();
    this.render();
    window.requestAnimationFrame(timestamp => this.step(timestamp));
  }

  update(){
    for(let i = 0; i<this.number; i++){
      this.circles[i].update();
    }
  }

  render(){
    context.clearRect(0,0, width, height);
    for(let i = 0; i<this.number; i++){
      this.circles[i].render();
    }
  }
}


class Circle {
  constructor(radius, x, y, speedX, speedY, color){
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = color;
  }

  update(){
    if(this.x + this.radius + this.speedX>= width  || this.x - this.radius + this.speedX <= 0)
      this.speedX = -this.speedX;
    if(this.y + this.radius + this.speedY>= height || this.y - this.radius + this.speedY <= 0)
      this.speedY = -this.speedY;
    this.x = this.x + this.speedX;
    this.y = this.y + this.speedY;
  }

  render(){
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill(); 
  }
}

let animation = new MyAnimation(10);
window.requestAnimationFrame(timestamp => animation.step(timestamp));
