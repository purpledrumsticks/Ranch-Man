//Draw Canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 650;

//Image Loading
var imgReady = false;
var imgDood = new Image();
imgDood.onload = function() {
	imgReady = true;
};

imgDood.src = "./images/dood.jpg";

var ranchReady = false;
var imgRanch = new Image();
imgRanch.onload = function() {
	ranchReady = true;
};

imgRanch.src = "./images/ranch.png";


//Var declarations for future implementations
var bulletReady = false;
var imgBullet = new Image();
imgBullet.onload = function() {
	bulletReady = true;
};

imgBullet.src = "./images/bullet.png";

//Game Objects
var dood = {
	speed: 256,
	x: 0,
	y: 0
};

var ranch = {
	x: 0,
	y: 0
};

var ranchCaught = 0;

var playerBullets = [];

//constructor function for bullet instances
//Has yet to be committed to GitHub
function Bullet(b) {
	b.active = true;

	b.xVelocity = 0;
	b.yVelocity = -b.speed;
	b.width = 3;
	b.height = 3;
	b.color = "#000";

	b.inBounds = function() {
		return b.x >= 0 && b.x <= canvas.width &&
			b.y >= 0 && b.y <= canvas.height;
	};

	b.draw = function() {
		canvas.fillStyle = this.color;
		canvas.fillRect(this.x, this.y, this.width, this.height);
	};

	b.update = function() {
		b.x += b.xVelocity;
		b.y += b.yVelocity;

		b.active = b.active && b.inBounds();
	};

  return b;
}

//Handle Keyboard Controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

//Put Game Reset Function Here
var reset = function() {
	dood.x = canvas.width / 2;
	dood.y = canvas.height / 2;

//Random Ranch Generation nested in reset function
ranch.x = 32 + (Math.random() *  (canvas.width - 64));
ranch.y = 32 + (Math.random() *  (canvas.height - 64));
};

//Update Game Objects Movement
var update = function(modifier) {
	if(38 in keysDown) {
		dood.y -= dood.speed * modifier;
		if(dood.y <= 0) {
			dood.y = 1050;
		}
	}

	if(40 in keysDown) {
		dood.y += dood.speed * modifier;
		if(dood.y >= 1050) {
			dood.y = 0;
		}
	}

	if(37 in keysDown) {
		dood.x -= dood.speed * modifier;
		if(dood.x <= 0) {
			dood.x = 1050;
		}
	}

	if(39 in keysDown) {
		dood.x += dood.speed * modifier;
		if(dood.x >= 1050) {
			dood.x = 0;
		}
	}

	if (32 in keysDown) {
		dood.shoot();
	}

	//Is dood touching ranch?
	if(
		dood.x <= (ranch.x + 32)
    && ranch.x <= (dood.x + 32)
		&& dood.y <= (ranch.y + 32)
		&& ranch.y <= (dood.y + 32)
	) {
		++ranchCaught;
		reset();
	}

	//Function allows player to shoot
	//Has not been fully implemented into current version
  	dood.midpoint = function() {
		return {
			x: this.x + this.width/2,
			y: this.y + this.height/2
		};
	};
  
	dood.shoot = function() {
		console.log("PEW PEW");
    	var bulletPosition = this.midpoint();

		playerBullets.push(Bullet({
			speed: 5,
			x: bulletPosition.x,
			y: bulletPosition.y
     }));
	};

	playerBullets.forEach(function(Bullet) {
		Bullet.update();
	});

	playerBullets = playerBullets.filter(function(Bullet) {
		return Bullet.active;
	});
};

//Draw Dood + Ranch + Score 
var render = function() {
	if (imgReady) {
		context.clearRect(0, 0, 1024, 650);
		context.drawImage(imgDood, dood.x, dood.y);
	}

	if(ranchReady) {
		context.drawImage(imgRanch, ranch.x, ranch.y);
	}
  
  //Draws bullets for future version
  var drawBullets = function() {
  		playerBullets.forEach(Bullet);
			context.drawImage(imgBullet, 0, 0);
  };

	if(bulletReady) {
			drawBullets();
	}

	//Draws area that keeps score
	context.fillStyle = "rgb(0, 0, 0)";
	context.font = "24px Helvetica";
	context.textAlign = "left";
	context.textBaseline = "top";
	context.fillText("Ranch Consumed: " + ranchCaught, 400, 32);
};



//The Main Game Loop
var main = function() {
	var now = Date.now();
	var delta = now - then;

	update(delta/1000);
	render();

	then = now;

	requestAnimationFrame(main);
};

var then = Date.now();
reset();
main();
