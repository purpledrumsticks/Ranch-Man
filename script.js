
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

//Update Game Objects
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
};

//Draw Everything
var render = function() {
	if (imgReady) {
		context.clearRect(0, 0, 1024, 650);
		context.drawImage(imgDood, dood.x, dood.y);
	}

	if(ranchReady) {
		context.drawImage(imgRanch, ranch.x, ranch.y);
	}
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