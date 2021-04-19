(function(){
  let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('myCanvas'));
  let context = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let colors = [ '#FFC300', '#900C3E', '#C70039', '#FF5733'];

  function shuffle(a) {
      var j, x, i;
      for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
      }
      return a;
  }

  class MyAnimation {
    constructor(number){
      this.number = number;
      this.radius = 50;
      this.circles = [];
      this.start = null;
      this.setup();
      this.raf = null;
      this.isRafPlaying = false;
    }

    startAnimation(){
      if(!this.isRafPlaying){
        this.raf = window.requestAnimationFrame(timestamp => this.step(timestamp));
        this.isRafPlaying = true;
      } else {
        cancelAnimationFrame(this.raf);
        this.raf = window.requestAnimationFrame(timestamp => this.step(timestamp));
      }
    }

    checkCollisions(){
      for(let i = 0; i<this.circles.length; i++){
        for(let j = 0; j<this.circles.length; j++){
          if(this.circles[i].x == this.circles[j].x && this.circles[i].y == this.circles[j].y){
            continue;
          }
          let squaredDistance = Math.pow((this.circles[i].x - this.circles[j].x), 2)  + Math.pow((this.circles[i].y - this.circles[j].y), 2);
          if(squaredDistance <= Math.pow(2*this.radius, 2)){
            this.circles[j].speedX = -this.circles[j].speedX;
            this.circles[j].speedY = -this.circles[j].speedY;
            this.circles[i].speedX = -this.circles[i].speedX;
            this.circles[i].speedY = -this.circles[i].speedY;
            this.circles[j].update();
            this.circles[i].update();
            this.circles[i].color = colors[Math.floor(Math.random()*colors.length)];
            this.circles[j].color = colors[Math.floor(Math.random()*colors.length)];
          }
      }
    }
    }

    setup() {
      // let radius = this.radius;
      let spawn = {};
      let velocity = {};
      let randomVelocity = 1;
      let spawnCoordinates = [];
      let horizontal = Array.from(Array(this.number).keys());
      let vertical = Array.from(Array(this.number).keys());
      shuffle(horizontal);
      shuffle(vertical);
      for(let i = 0; i<this.number; i++){
        let cageHorizontalSize = canvas.width/this.number;
        let cageVerticalSize = canvas.height/this.number ;
        // console.log(cageHorizontalSize);
        // console.log(cageVerticalSize);
        // console.log(this.radius);
        this.radius = Math.min(cageHorizontalSize, cageVerticalSize)/2;
        let radius = this.radius;
        let lowerHorizontalBoundary = radius;
        let upperHorizontalBoundary = canvas.width - radius;
        let upperVerticalBoundary = canvas.height - radius;
        let lowerVerticalBoundary = radius;
        // debugger;

        spawn.x = Math.min(Math.max(Math.random()*this.radius + cageHorizontalSize*horizontal.pop() + radius, radius), upperHorizontalBoundary); 
        spawn.y = Math.min(Math.max(Math.random()*this.radius + cageVerticalSize*vertical.pop() + radius, radius), upperVerticalBoundary); 
        // spawn.y = Math.random()*(canvas.height-2*radius) + radius; 
        let x = Math.random()*randomVelocity - randomVelocity/2; 
        let y = Math.random()*randomVelocity - randomVelocity/2; 
        let color = colors[Math.floor(Math.random()*colors.length)];
        this.circles.push(new Circle(this.radius, spawn.x, spawn.y, x, y, color));
      }
    }

    step(timestamp){
      this.update();
      this.checkCollisions();
      this.render();
      this.raf = window.requestAnimationFrame(timestamp => this.step(timestamp));
    }

    update(){
      for(let i = 0; i<this.circles.length; i++){
        this.circles[i].update();
      }
    }

    render(){
      context.clearRect(0,0, canvas.width, canvas.height);
      for(let i = 0; i<this.circles.length; i++){
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
      if(this.x + this.radius + this.speedX>= canvas.width  || this.x - this.radius + this.speedX <= 0)
        this.speedX = -this.speedX;
      if(this.y + this.radius + this.speedY>= canvas.height || this.y - this.radius + this.speedY <= 0)
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

    checkCollision(){

    }
  }


  let animation = new MyAnimation(20);
  window.addEventListener('resize', resizeCanvas, false);
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawStuff();
  }

  document.addEventListener('click', function(event){
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    for(i = animation.circles.length-1;i>=0;i--){
      circle = animation.circles[i];
    // for (const circle of animation.circles) {
      let squaredDistance = Math.pow(circle.x - mouseX, 2)  + Math.pow(circle.y - mouseY, 2);
      if(squaredDistance <= Math.pow(animation.radius, 2)){
        console.log(squaredDistance);
        console.log(animation.radius);
        // console.log(mouseX, mouseY);
        // console.log(circle.x, circle.y);
        animation.circles.splice(i, 1);
      }
    }
  })

  function drawStuff(){
    animation.update();
    animation.startAnimation();
  }
  resizeCanvas();


})();
