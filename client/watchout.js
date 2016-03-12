// SVG attributes
var svgHeight = 502;
var svgWidth = 699;

// General program attributes
var moveFrequency = 3000;
var moveTransitionTime = 1000;
var scoreCheckInterval = 1;

// Enemy attributes
var enemies = [];
var enemyR = 10; // radius

// Player attributes
var playerColor = 'orange';
var playerR = 10;

var svg = d3.select('body').select('.game-area').append('svg').attr('height', svgHeight).attr('width', svgWidth).attr('class', 'svg');

// Create drag event listener
var drag = d3.behavior.drag().on('drag', function() {
  if (d3.event.x < svgWidth - 0.5 * player.r && d3.event.x > 0.5 * player.r) {
    player.shape.attr('cx', d3.event.x); 
  } 
  if (d3.event.y < svgHeight - 0.5 * player.r && d3.event.y > 0.5 * player.r) {
    player.shape.attr('cy', d3.event.y); 
  } 
});

var count = 0;
// Player class
var Player = function(r, x, y) {
  this.r = r;
  this.highScore = 0;
  this.currentScore = 0;
  this.shape = svg.append('circle').attr('r', this.r).attr('cx', x).attr('cy', y).attr('class', 'player').attr('fill', playerColor).call(drag);
};
Player.prototype.checkIfTouchingEnemy = function() {

  for (var i = 0; i < enemies.length; i++) {
    var enemyMaxX = Number(enemies[i].shape.attr('cx')) + (enemies[i].r);
    var enemyMinX = Number(enemies[i].shape.attr('cx')) - (enemies[i].r);
    var enemyMaxY = Number(enemies[i].shape.attr('cy')) + (enemies[i].r);
    var enemyMinY = Number(enemies[i].shape.attr('cy')) - (enemies[i].r);

    var playerMaxX = Number(this.shape.attr('cx')) + (this.r);
    var playerMinX = Number(this.shape.attr('cx')) - (this.r);
    var playerMaxY = Number(this.shape.attr('cy')) + (this.r);
    var playerMinY = Number(this.shape.attr('cy')) - (this.r);

    if (((playerMinX >= enemyMinX && playerMinX <= enemyMaxX) || (playerMaxX >= enemyMinX && playerMaxX <= enemyMaxX)) && ((playerMinY >= enemyMinY && playerMinY <= enemyMaxY) || (playerMaxY >= enemyMinY && playerMaxY <= enemyMaxY))) {
      count++;
      console.log(count);
    } else {
    }
  }
};
Player.prototype.updateScore = function(checkInterval) {
  var scoreChange = checkInterval / 100;
  if (this.checkIfTouchingEnemy()) {
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
    }
    this.currentScore = 0;
    // console.log('currentScore: ' + this.currentScore);
    // console.log('highScore: ' + this.highScore);
  } else {
    this.currentScore += scoreChange;
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
    }
    // console.log('currentScore: ' + this.currentScore);
    // console.log('highScore: ' + this.highScore);
  }
};

// Enemy class
var Enemy = function(r, x, y) {
  this.r = r; 
  this.shape = svg.append('circle').attr('r', this.r).attr('cx', x).attr('cy', y).attr('class', 'enemy').attr('fill', 'black');
};
Enemy.prototype.randomizePosition = function() {
  var newX = Math.random() * svgWidth;
  var newY = Math.random() * svgHeight;
  return { x: newX, y: newY };
};

// General functions

// Generates new x, y coordinate for a single enemy
var generateEnemies = function(numEnemies) {
  for (var i = 0; i < numEnemies; i++) {
    var newEnemy = new Enemy(enemyR, Math.random() * svgWidth + 10, Math.random() * svgHeight + 10);
    enemies.push(newEnemy);
  }
};
// Generates a new array of x, y coordinates for all enemies
var generateNewPositionsArray = function() {
  var output = [];
  for (var i = 0; i < enemies.length; i++) {
    output.push(enemies[i].randomizePosition());
  }
  return output;
};

var moveAllEnemies = function() {
  svg.selectAll('.enemy').data(generateNewPositionsArray()).transition().duration(moveTransitionTime).ease('linear').attr('cx', function(data) { return data.x; }).attr('cy', function(data) { return data.y; });
};

var player = new Player(playerR, svgWidth / 2, svgHeight / 2);

generateEnemies(20);

// Move all enemies
setInterval(moveAllEnemies, moveFrequency);

// Check for 
setInterval(function() {
  player.updateScore(scoreCheckInterval);
}, scoreCheckInterval);

