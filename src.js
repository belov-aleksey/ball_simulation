	// canvas setup -------------------------------------------------------

	var canvas = document.getElementById("myCanvas");
	var c = canvas.getContext("2d");

	canvas.width = window.innerWidth - 20;
	canvas.height = window.innerHeight - 100;

	var simMinWidth = 20.0;
	var cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
	var simWidth = canvas.width / cScale;
	var simHeight = canvas.height / cScale;

	function cX(pos) {
		return pos.x * cScale;
	}

	function cY(pos) {
		return canvas.height - pos.y * cScale;
	}

	// scene -------------------------------------------------------

	var F_gravity = { x: 0.0, y: -10.0};
	var timeStep = 1.0 / 60.0;

	var ball = generate_ball();
  var balls = [ball];

  function generate_ball(){
    return {
      radius : 0.2,
      pos : {x : Math.random() * simWidth, y : Math.random() * simHeight},
      vel : {x : Math.random()*10.0, y : Math.random()*15.0}      
    }
  }

  add_ball = () => {
      balls.push(generate_ball());
  }   

	// drawing -------------------------------------------------------

	function draw(ball) {
      c.fillStyle = "#FF0000";

      c.beginPath();			
      c.arc(
        cX(ball.pos), cY(ball.pos), cScale * ball.radius, 0.0, 2.0 * Math.PI); 
      c.closePath();
      c.fill();	
	}

	// simulation ----------------------------------------------------

  function simulate(ball){
    ball.vel.x = ball.vel.x + F_gravity.x * timeStep;
    ball.vel.y = ball.vel.y + F_gravity.y * timeStep;

    ball.pos.x = ball.pos.x + ball.vel.x * timeStep;
    ball.pos.y = ball.pos.y + ball.vel.y * timeStep;

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
	// make browser to call us repeatedly -----------------------------------

	function update() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (let ball of balls){
      simulate(ball);
      draw(ball);
    }
		requestAnimationFrame(update);
	}
	
	update(balls);



