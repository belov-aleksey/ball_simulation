	import {Vector2} from './vectors.js';
  
  // canvas setup -------------------------------------------------------

	var canvas = document.getElementById("myCanvas");
	var c = canvas.getContext("2d");

	canvas.width = window.innerWidth - 200;
	canvas.height = window.innerHeight - 200;

	var simMinWidth = 20.0;
	var cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
	var simWidth = canvas.width / cScale;
	var simHeight = canvas.height / cScale;
  var restitution = 0.9;

	function cX(pos) {
		return pos.x * cScale;
	}

	function cY(pos) {
		return canvas.height - pos.y * cScale;
	}

	// ball -------------------------------------------------------

  class Ball {
    constructor(raduis = 0.2, mass=0.1) {
      this.mass = mass;
      this.radius = 0.5 + Math.random() * 0.3;
      this.pos = new Vector2(Math.random() * simWidth, Math.random() * simHeight);
      this.vel = new Vector2(Math.random()*10.0, Math.random()*15.0);
    }

    simulate() {
      this.vel.add(F_gravity, timeStep);
      this.pos.add(this.vel, timeStep)      
    }
  }  

  // scene -------------------------------------------------------
	
  var F_gravity = new Vector2(0.0, -10.0);
	var timeStep = 1.0 / 60.0;

	var ball = new Ball();
  var balls = [ball];

  var vec = new Vector2(1,1);
  vec.x=2;
  console.log(vec)

  document.getElementById('add_ball_button').addEventListener(
      'click',
      () => {
      balls.push(new Ball());
    }   
  )

  document.getElementById('add_balls_button').addEventListener(
      'click',
      () => {
        for (let i = 0; i < 20; i++){
          balls.push(new Ball());
        }
    }   
  )  

	document.getElementById("restitutionSlider").oninput = function() {
    restitution = this.value/10;
	}  

  // collisions

  function handleWallCollisions(ball) {
      if (ball.pos.x > simWidth){
        ball.pos.x = simWidth;
        ball.vel.x = -ball.vel.x;
      }

      if (ball.pos.y < 0){
        ball.pos.y = 0;
        ball.vel.y = -ball.vel.y;
      }

      if (ball.pos.x < 0){
        ball.pos.x = 0;
        ball.vel.x = -ball.vel.x;
      }

      if (ball.pos.y > simHeight){
        ball.pos.y = simHeight;
        ball.vel.y = -ball.vel.y;
      }    
  }

	function handleBallCollision(ball1, ball2, restitution) 
	{
		var dir = new Vector2();
		dir.subtractVectors(ball2.pos, ball1.pos);
		var d = dir.length();
		if (d == 0.0 || d > ball1.radius + ball2.radius)
			return;

		dir.scale(1.0 / d);

		var corr = (ball1.radius + ball2.radius - d) / 2.0;
		ball1.pos.add(dir, -corr);
		ball2.pos.add(dir, corr);

		var v1 = ball1.vel.dot(dir);
		var v2 = ball2.vel.dot(dir);

		var m1 = ball1.mass;
		var m2 = ball2.mass;

		var newV1 = (m1 * v1 + m2 * v2 - m2 * (v1 - v2) * restitution) / (m1 + m2);
		var newV2 = (m1 * v1 + m2 * v2 - m1 * (v2 - v1) * restitution) / (m1 + m2);

		ball1.vel.add(dir, newV1 - v1);
		ball2.vel.add(dir, newV2 - v2);
	}
    
	// drawing -------------------------------------------------------

	function draw(ball) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (let ball of balls){
      c.fillStyle = "#FF0000";

      c.beginPath();			
      c.arc(
        cX(ball.pos), cY(ball.pos), cScale * ball.radius, 0.0, 2.0 * Math.PI); 
      c.closePath();
      c.fill();	
    }
	}

	// simulation ----------------------------------------------------

  function simulate(){
    for (let i = 0; i < balls.length;  i++){
      balls[i].simulate()

      for (let j = i+1; j < balls.length; j++) {
        handleBallCollision(balls[i], balls[j], restitution)
      }
      handleWallCollisions(balls[i])
    }
  }
	// make browser to call us repeatedly -----------------------------------

	function update() {
    simulate();
    draw();
    requestAnimationFrame(update);
	}
	
	update();