var canvas;
var canvasContext;
var canvasH;
var canvasW;

var PLAYER_W = 75;
var PLAYER_H = 10;
var playerX = 20;
var playerSpeed;
var FRAMEperSECOND = 30;
var playerScore = 0;
var playerLevel = 0;
var playerHealth = 5;

var BALL_RADIUS = 5;
var ballX = 200;
var ballY = 200;
var ballSpeedX = 10;
var ballSpeedY = 10;
var ballSpeedScore = 1;

var WINNING_LEVEL = 1;
var showWinScreen = false;

var array = new Array();
var COUNT_BAR_DEFAULT = 10;
var countBar = COUNT_BAR_DEFAULT;
var barSpeed = 1;



function draw() {
	canvas  = document.getElementById('canvas');
	canvasContext = canvas.getContext('2d');	
	canvasW = canvas.width;
	canvasH = canvas.height;
	drawRect(0, 0, canvasW, canvasH, 'skyBlue');

	createBar(countBar);

	setInterval(function () {
		drawAll();
	}, 1000/FRAMEperSECOND);

	canvas.addEventListener('mousemove', mouseMovePlayer);

	canvas.addEventListener('mousedown', handMouseClick);
}

function handMouseClick (evt) {
	if(showWinScreen){
		defaultOptions();
		showWinScreen=false;
	}
}

function mouseMovePlayer (evt) {
	//mouse position
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;	
	movePlayer(mouseX);
}

function drawAll () {
	drawRect(0, 0, canvasW, canvasH, 'skyBlue');
	if (showWinScreen){
		if (playerHealth === 0 ){
			canvasContext.fillStyle = 'red';
			canvasContext.font = '30px Arial';	
			canvasContext.fillText('You lose!', 300, 100);
		} else 
			if (playerLevel === WINNING_LEVEL ) {
				canvasContext.fillStyle = 'green';
				canvasContext.font = '30px Arial';
				canvasContext.fillText('You Win!', 300, 100);
			}
		canvasContext.fillStyle = 'gray';
		canvasContext.font = '18px Arial';	
		canvasContext.fillText('Click to continue...', 300, 450);
		return;
	}
	drawPlayer();
	drawBall();	
	moveBall();
	drawBar();
	drawScore();
	Arbiter();
	
}

function drawRect (posX, posY, W, H, color) {
	canvasContext.fillStyle = color;
	canvasContext.fillRect(posX, posY, W,H);
}
//------------------------------- BALL-------------------------

function drawBall() {
	canvasContext.fillStyle = 'black';
	canvasContext.beginPath();
	canvasContext.arc(ballX, ballY, BALL_RADIUS, 0, 2 * Math.PI, true);
	canvasContext.fill();

}
function moveBall () {	
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	//реакция на стены
	if(ballX < BALL_RADIUS){
		ballSpeedX= -ballSpeedX;
	} else
	if (ballX > canvasW - BALL_RADIUS){
		ballSpeedX= -ballSpeedX;
	} else
	if(ballY < BALL_RADIUS) {
		ballSpeedY= -ballSpeedY;
	} else 
	if (ballY >= canvasH){//провалился вниз
		ballY = BALL_RADIUS;
		playerHealth--;		
	}
	
	//реакция на планку
	if (ballY>canvasH - (PLAYER_H + BALL_RADIUS) && ballX > playerX && ballX<playerX + PLAYER_W) {
		ballSpeedY =- ballSpeedY;
		var deltaX = ballX - (playerX + PLAYER_W/2);
		ballSpeedX = deltaX * 0.35;
	}

}

//------------------------------ PLAYER --------------------

function drawPlayer() {
	drawRect(playerX, canvasH - PLAYER_H, PLAYER_W, PLAYER_H , 'white');
}
function movePlayer(posX) {
	playerX = posX;	
}


//------------------------------ BAR --------------------


var acolor = ['white', 'black', 'orange', 'darkred', 'violet', 'gray', 'azure', 'yellow', 'lightgreen','pink']

function Bar(barX, barY){
	this.W = 100;
	this.H = 30;
	this.barX = barX;
	this.barY = barY;
	this.speed = barSpeed;
	this.isDraw = true;
	var rcolor = Math.round(Math.random()*10);
	this.draw = function () {
		drawRect(this.barX, this.barY , this.W, this.H, acolor[rcolor]);
	};
	this.move=function () {
		this.barY += this.speed * 0.1;
		if (this.barY>canvasH){
			this.barY = 0;
		}
	};
	this.reflection = function () {
		if(ballY < this.barY+this.H && ballY > this.barY && ballX < this.barX+this.W && ballX > this.barX){
			ballSpeedY = -ballSpeedY;
			this.isDraw = false;
			if (!this.isDraw) {playerScore++;}//------
		}		
	};	
};

function drawBar () {
	for (var i = 0; i < countBar; i++) {
		if (array[i]!=null && array[i].isDraw) {
				array[i].move();
				array[i].draw();
				array[i].reflection();
		}
	}	
}

function createBar (count) {
	var array2 = new Array();
	for (var i = 0; i < count; i++) {
		var rand = Math.random()*(canvasW - 100);
		var randX = Math.round(rand);
		var rand = Math.random()*150;
		var randY = Math.round(rand);
		var c = new Bar(randX, randY);
		array2.push(c);
	}
	array = array2;
}

//--------------------- SCORE ---------------------
function drawScore () {
	canvasContext.fillStyle = 'darkred';
	canvasContext.font = '20px Arial';	
	canvasContext.fillText('Health: '+ playerHealth, 10, 20);
	canvasContext.fillText('Level: '+ playerLevel, 10, 40);
	canvasContext.fillText('Speed: '+ ballSpeedScore, 10, 60);	
	canvasContext.fillText('Score: '+ playerScore+'/'+countBar, 10, 80);	
	
}

function Arbiter() {
	if(playerScore === countBar){
		countBar = Math.round(countBar * 1.2);
		playerScore = 0;
		playerLevel++;
		if (playerLevel % 2 === 0 && playerLevel!=0) {
			ballSpeedY+=0.5;
			ballSpeedX+=0.5;
			ballSpeedScore++;
			barSpeed+=1/12;
		}
		createBar(countBar);
	}	
	if (playerHealth === 0 || playerLevel === WINNING_LEVEL ) {		
		showWinScreen = true;		
	}	
}
function defaultOptions() {
	ballSpeedX = 10;
	ballSpeedY = 10;
	ballSpeedScore = 1;	
	playerLevel = 0;
	playerHealth=5;
	playerScore = 0;
	countBar = COUNT_BAR_DEFAULT;
	barSpeed = 1;
	createBar(countBar);
	
}
