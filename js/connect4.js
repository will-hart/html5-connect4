/**
 * 
 * HTML5 ConnectFour
 * 
 * This is a quick game example of an HTML5 app built using easel.js
 * 
 * It is written to test building HTML5 games, and to act as an example
 * that others may find useful.
 * 
 * Licensed under GPL 3.0
 * 
 * See http://www.williamhart.info/ for more information
 */



/**
 * Start by defining some constants to be used in the application 
 */

/* define sprite colours */
var NONE = 0; 
var YELLOW = 1;
var RED = 2;

/* define some sprite states */
var EMPTY_CELL = 0; 		// a disc in the game board
var PLACE_CELL = 1; 		// where a disc may be placed
var FILL_CELL = 2; 			// a disc outside the game board
var WINNING_CELL = 3; 		// a disc that is part of the winning combination

/* the number of sprites in any row */
var ROW_MULTIPLIER = 3; 	// a multiplier for accessing different sprite rows

/* A blank cell where no sprite is shown */
var BLANK_CELL = -1;

/* the size of a cell (they are square) */
var CELL_SIZE = 64;

/* load the sprite sheet */
var spriteImage = new Image();
var spriteSheet;
var animFrames;

/* an 8x8 array to use to hold the game map */
var map = []; 

/* the game canvas */
var game;
var stage;


/*
 * Initialises the game canvas, loads resources and starts playing
 */
function init()
{
	// get a reference to the game canvas
	game = document.getElementById("gameCanvas");
	
	// load and build the spritesheet
	buildSpriteSheet();
}


/*
 * Helper function to load and configure the spritesheet
 */
function buildSpriteSheet() {
	// load the image
	spriteImage.onload = imgReady;
	spriteImage.onerror = imgLoadError;
	spriteImage.src = "img/spritesheet.png";
}

/*
 * Image loaded callback for the spritesheet.
 * Once the image is loaded properly we build the game
 */
function imgReady() {
	buildGame();
}


/*
 * Image load error callback for the sprite sheet
 */
function imgLoadError() {
	alert("Unable to load images!");
}


/*
 * 'Builds' the game by loading resources and setting up a timer
 */
function buildGame() {
	
	// set up the 'animation' frames
	animFrames = 
	
	// build a spritesheet up from the image we have loaded
    spriteSheet = new SpriteSheet({
	    images: [spriteImage], 
	    frames: {width: 64, height: 64, count: 12, regX: 1, regY: 1},
	    animations: {
			blank: [9],
			empty_cell: [0],
			yellow_cell: [1],
			red_cell: [2],
			place_yellow: [4],
			place_red: [5],
			fill_yellow: [7],
			fill_red: [8],
			win_yellow: [10],
			win_red: [11],
		}
    });
    
    // build a stage object to hold our game board
    stage = new Stage(game);
    stage.mouseEventsEnabled = true; // allow mouse events
    
    // set up a game ticker
    Ticker.addListener(window);
    Ticker.useRAF = true;
    Ticker.setFPS(60);
 
    // initialise the game board
    for (var i = 2; i < 11; i++) {
    	var line = [];
    	for (var j = 0; j < 11; j++) {
    		/// create a new bitmap animation
    		var bma = new BitmapAnimation(spriteSheet);
    		
    		// set up the correct bitmap
    		if (j == 0)
    		{
    			bma.gotoAndPlay("blank");
    		} else if (j == 1){
    			bma.gotoAndPlay("place_yellow");
    		} else {
    			bma.gotoAndPlay("empty_cell");
    		}
    		
    		// configure the bitmap animation position
    		bma.name="cell"+i+"-"+j;
    		bma.x = i * CELL_SIZE;
    		bma.y = j * CELL_SIZE;
    		stage.addChild(bma);
	    	line.push(bma);
    	}
    	map.push(line);
    }
}


/*
 * The tick function updates the stage based on the game state
 */
function tick() {
	// redraw the stage
	stage.update();
}


/* 
 * Gets a sprite index based on the row and column provided
 */
function getSpriteIdx(state, colour) {
	return state * ROW_MULTIPLIER + colour;
}
