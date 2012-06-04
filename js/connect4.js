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

/* the current team */
var current_team = RED;

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
var map; 

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
 * An event that changes the image of the given target
 */
function changePlaceMouseOver(MouseArgs) {
	// get the target object
	var t = MouseArgs.target;

	// find the new animation based on current animation
	var newAnim = (current_team == YELLOW) ? "fill_yellow" : "fill_red";
		
	// set the new animation
	t.gotoAndPlay(newAnim);
}

/*
 * An event that changes the image of the given place row 
 */
function changePlaceMouseOut(MouseArgs) {
	// get the target object
	var t = MouseArgs.target;

	// find the new animation based on current animation
	var newAnim = (current_team == YELLOW) ? "place_yellow" : "place_red";
		
	// set the new animation
	t.gotoAndPlay(newAnim);
}

/*
 * An event that places a new disc in the map
 */
function placeDiscEvent(MouseArgs)
{
	// get the placeholder that was clicked
	var t = MouseArgs.target;
	
	// work out the column of the placeholder clicked
	var addr = t.name.split(",");
	var col = addr[1];
	
	// work out the type of disc we are placing
	var bma_string = (current_team == YELLOW) ? "yellow_cell" : "red_cell";
	var placed = false;
	
	// now traverse back up the column and place a disc in the first empty block
	for(var i = 9; i > 1; i--) {
		var bma = map[col][i]; // get the bitmap
		
		// if it is empty, place
		if (bma.currentAnimation == "empty_cell") {
			bma.gotoAndPlay(bma_string);
			placed = true;
			break; // leave the loop
		}
	}
	
	// move to the next player's turn
	if (placed) {
		checkForWinner();
		newTurn();
	} 
}


function checkForWinner() {
	return false;
}

/*
 * Changes the currently active team
 */
function newTurn() {
	var bma_string = "";
	
	// work out our new game board state
	if (current_team == YELLOW) {
		current_team = RED;
		bma_string = "place_red";
	} else {
		current_team = YELLOW;
		bma_string = "place_yellow";
	}
	
	// set the placement images at the top of the board
	for (var i = 0; i < 8; i++) {
		var bma = map[i][1];
		bma.gotoAndPlay(bma_string);
	}
}

/*
 * 'Builds' the game by loading resources and setting up a timer
 */
function buildGame() {
	
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
    stage.enableMouseOver(); // allow mouseover events
    
    // set up a game ticker
    Ticker.addListener(window);
    Ticker.useRAF = true;
    Ticker.setFPS(60);
 
    // initialise the game board
    map = [];
    for (var i = 0; i < 11; i++) {
    	var line = [];
    	for (var j = 0; j < 11; j++) {
    		/// create a new bitmap animation
    		var bma = new BitmapAnimation(spriteSheet);
    		
    		// set up the correct bitmap
    		if (i > 7) {
    			bma.gotoAndPlay("blank");
    		} else {
    			if (j == 0)
	    		{
	    			bma.gotoAndPlay("blank");
	    		} else if (j == 1){
	    			bma.gotoAndPlay((current_team == YELLOW) ? "place_yellow" : "place_red");
    				bma.onMouseOver = changePlaceMouseOver;
    				bma.onMouseOut = changePlaceMouseOut;
    				bma.onPress = placeDiscEvent;
	    		} else {
	    			bma.gotoAndPlay("empty_cell");
	    		}
    		}
    		
    		// configure the bitmap animation position
    		bma.name = j + "," + i;
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
