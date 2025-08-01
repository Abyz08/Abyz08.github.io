let particlesystems = [];
let colors = [
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
];
let explodecolors = [
      '#f44336', '#e91e63', '#FFEB3B', '#FFC107', '#FF9800',
      '#FF5722'
];
let normalcolors = [
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
];

class particleSystem {
  constructor(Text, Flow, TopSpeed, LifeSpan, FlowOffset, ShouldDisplay){
    this.system = {
      shouldDisplay: ShouldDisplay,
      text: Text,
      flow: Flow,
      topSpeed: TopSpeed,
      lifeSpan: LifeSpan,
      flowOffset: FlowOffset,
    };
    this.particles = [];
    this.field = [];
    this.fieldStep = [];
    this.init();
  }

  explode() {
    
    this.particles.forEach((particle, i) => {
        // search this.field
        this.particles[i].color = random(explodecolors);
        this.particles[i].addForce(new p5.Vector.fromAngle(radians(random(0, 360)),500));
      });
      particlesystems[0].system.flow = 100;
  }
  
  init() {
      clear();
      fill(0);
      textSize(12);
      textStyle(BOLD);
      let text_box_width = min(width, 1200) * 0.8;
      let minSizeW = 12 / textWidth(this.system.text) * text_box_width;
      textSize(minSizeW);
      text(this.system.text, width / 2 - text_box_width / 2, (height / 2) + 50);
      // Scan the canvas searching for black pixels
      // particles will spawn from there :)
      noFill();
      
      let step = floor(max(width,height)/min(900,min(width,height)));
      let i = 0;
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {

          let target_x = x + step / 2,
            target_y = y + step / 2;
          let alpha = get(target_x, target_y)[3];
          if (alpha > 0.5) {
            this.particles.push(new Particle(target_x, target_y, step * 3, i, this.system.flow, this.system.topSpeed, this.system.lifeSpan, this.system.flowOffset));
            i++;
          }
        }
      }
      this.field = {};
      clear();
      step = this.fieldStep = floor(max(width,height)/min(20,min(width,height)));
      i = 0;
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          i++;
          let a = noise(i)*TWO_PI;
          this.field[`${x}-${y}`] = a;
          translate(x,y);
          rotate(a);
          rect(-step/4,-step/2,step/2,step)
          resetMatrix();
        }
      }

      clear();
    }

    restart() {
      clear();
      fill(0);
      textSize(12);
      textStyle(BOLD);
      let text_box_width = min(width, 1200) * 0.8;
      let minSizeW = 12 / textWidth(this.system.text) * text_box_width;
      textSize(minSizeW);
      text(this.system.text, width / 2 - text_box_width / 2, (height / 2) + 50);
      // Scan the canvas searching for black pixels
      // particles will spawn from there :)
      noFill();
      
      let step = floor(max(width,height)/min(160,min(width,height)));
      let i = 0;
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {

          let target_x = x + step / 2,
            target_y = y + step / 2;
          let alpha = get(target_x, target_y)[3];
          if (alpha > 0.5) {
            this.particles[i].restart(target_x, target_y);
            i++;
          }
        }
      }
      this.particles.splice(i);
      this.field = {};
      clear();
      step = this.fieldStep = floor(max(width,height)/min(20,min(width,height)));
      i = 0;
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          i++;
          let a = noise(i)*TWO_PI;
          this.field[`${x}-${y}`] = a;
          translate(x,y);
          rotate(a);
          rect(-step/4,-step/2,step/2,step)
          resetMatrix();
        }
      }

      clear();
    }

    draw() {
      
      this.particles.forEach((particle, i) => {
        // search this.field
        particle.addForce(new p5.Vector.fromAngle(radians(180),1));
        particle.addForce(
          new p5.Vector.fromAngle(
            this.field[`${particle.position.x - (particle.position.x%this.fieldStep)}-${particle.position.y - (particle.position.y%this.fieldStep)}`] + this.system.flowOffset,
            this.system.flow
          )
        );
        particle.update();
        particle.display();
        
      });
    }
}


    




    
    class Particle {
      constructor(x, y, size, index, flow, topSpeed, lifeSpan, flowOffset) {
        this.flow = flow
        this.shouldremove = false;
        this.topSpeed = topSpeed
        this.flowOffset = flowOffset
        this.totalLifeSpan = lifeSpan
        this.shouldDisplay = true;
        this.base_size = size;
        this.index = index || 0;
        this.spawn = createVector(x, y);
        this.init();
      }

      restart(x, y)
      {
        this.spawn = createVector(x, y);
      }
      init() {
        this.size = this.base_size * random(0.5, 1.5);

        this.start = millis();
        this.position = this.spawn.copy();
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.duration = this.totalLifeSpan * random(0.2,1.2);
        this.drag = random(0.9, 1);
        this.addForce(
          new p5.Vector.fromAngle(random(TWO_PI), random(10))
        );
        this.color = random(colors);

      }
      display() {
        let s = 1;
        if (millis() - this.start < this.duration * 0.1) {
          s = map(millis() - this.start, 0, this.duration * 0.1, 0, 1);
        } else if (millis() - this.start > this.duration * 0.5) {
          s = map(millis() - this.start, this.duration * 0.5, this.duration, 1, 0);
        }
        if(this.shouldDisplay == true) {
          fill(this.color);
          circle(this.position.x, this.position.y, this.size * s * map(this.velocity.mag(),0,this.topSpeed,0.5,1.2));
        }
      }
      update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.topSpeed);
        this.velocity.mult(this.drag);
        this.position.add(this.velocity.copy().mult(1 / _targetFrameRate));
        this.acceleration.mult(0);
        if (this.position.x < 1 || millis() - this.start > this.duration) {
          this.init();
        }
      }
      addForce(vector) {
        this.acceleration.add(vector);
      }
    }
    function setup() {
      let canvas = createCanvas(windowWidth, windowHeight / 2);
      frameRate(60);
      noStroke();
      colorMode(HSL);
      canvas.mouseOver(onHover);
      canvas.mouseOut(onLeave);
      canvas.parent('title');
      particlesystems.push(new particleSystem("DOHG", 0, 1000, 1000, 0, true));
      
    }
    function windowResized() {
      resizeCanvas(windowWidth, windowHeight);
      init();
    }

    function draw() {
      
      background("black");
      for (let i = 0; i < particlesystems.length; i++) {
        if(particlesystems[i].system.shouldDisplay == true) {
          particlesystems[i].draw();
        }

      }
       
    }

    function onHover() {
      colors = explodecolors
      particlesystems[0].explode();
      setTimeout(resetExplode, 100)
    }
    function resetExplode() {
      particlesystems[0].system.flow = 0;
    }
    function onLeave() {
      colors = normalcolors
      setTimeout(resetExplode, 100)

      
    }

    

