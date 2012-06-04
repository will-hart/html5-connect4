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

/* define some map dimensions */
var max_row = 6;
var max_col = 7;
var header_rows = 2;

/* the current team */
var current_team = YELLOW;

/* the size of a cell (they are square) */
var CELL_SIZE = 64;

/* load the sprite sheet */
var spriteImage = new Image();
var spriteSheet;
var animFrames;

/* an 8x8 array to use to hold the game map */
var map; 

/* the game canvas and stage where objects are placed*/
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
	
	// check if we have had a winner already
	if (current_team == NONE) return;
	
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
	
	// check if we have had a winner already
	if (current_team == NONE) return;
	
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
function placeDiscEvent(MouseArgs) {
	// check if we have had a winner already
	if (current_team == NONE) return;
	
	// get the placeholder that was clicked
	var t = MouseArgs.target;
	
	// work out the column of the placeholder clicked
	var addr = t.name.split(",");
	var col = addr[1];
	
	// work out the type of disc we are placing
	var bma_string = (current_team == YELLOW) ? "yellow_cell" : "red_cell";
	var placed = false;
	
	// now traverse back up the column and place a disc in the first empty block
	var row;
	var bma;
	for(row = max_row + header_rows - 1; row > 1; row--) {
		bma = map[col][row]; // get the bitmap
		
		// if it is empty, place
		if (bma.currentAnimation == "empty_cell") {
			bma.gotoAndPlay(bma_string);
			placed = true;
			break; // leave the loop
		}
	}
	
	// move to the next player's turn
	if (placed) {
		checkForWinner(row, col, current_team);
		newTurn();
	} 
}


/*
 * Checks if there are four in a row anywhere on the board
 */
function checkForWinner(row, col, team) {

	// the cell we want to see for a win
	var win_cell = (team == YELLOW) ? "yellow_cell" : "red_cell";
	var win_string = (team == YELLOW) ? "win_yellow" : "win_red";
	var winner = false;
	
	// check in the four possible directions (east-west, north-south, NE-SW and NW-SW)
	var E_W = countInDirection(row, col, 0, 1, win_cell) + countInDirection(row, col, 0, -1, win_cell);// check if we won!
	if (E_W > 4) {
		current_team = NONE;
		countInDirection(row, col, 0, 1, win_cell, win_string);
		countInDirection(row, col, 0, -1, win_cell, win_string);
		return true;
	} 
	
	
	var N_S = countInDirection(row, col, -1, 0, win_cell) + countInDirection(row, col, 1, 0, win_cell);
	if (N_S > 4) {
		current_team = NONE;
		countInDirection(row, col, -1, 0, win_cell, win_string);
		countInDirection(row, col, 1, 0, win_cell, win_string);
		return true;
	} 
	
	
	var NE_SW = countInDirection(row, col, -1, 1, win_cell) + countInDirection(row, col, 1, -1, win_cell);
	if (NE_SW > 4) {
		current_team = NONE;
		countInDirection(row, col, -1, 1, win_cell, win_string);
		countInDirection(row, col, 1, -1, win_cell, win_string);
		return true;
	} 
	
	
	var NW_SE = countInDirection(row, col, -1, -1, win_cell) + countInDirection(row, col, 1, 1, win_cell);
	if (NW_SE > 4) {
		current_team = NONE;
		countInDirection(row, col, -1, -1, win_cell, win_string);
		countInDirection(row, col, 1, 1, win_cell, win_string);
		return true;
	} 
	
	return false;
}


/*
 * Count the number of consecutive cells of the same colour 
 * in a given direction
 */ 
function countInDirection(row, col, delRow, delCol, animString, winString) {
	// get the new co-ordinates
	var newRow = row*1 + delRow*1;
	var newCol = col*1 + delCol*1;
	
	// check bounds
	if (row >= max_row + header_rows || row < header_rows+1 || col < 0 || col >= max_col) {
		return 0;
	}
	
	// check if this cell is the correct colour
	if (map[col][row].currentAnimation == animString) {
		if (winString != null) map[col][row].gotoAndPlay(winString);
		return ret = countInDirection(newRow, newCol, delRow, delCol, animString, winString) + 1;
	} else {
		return 0;
	}
}


/*
 * Changes the currently active team
 */
function newTurn() {
	
	// check if we have had a winner already
	if (current_team == NONE) return;
	
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
	for (var col = 0; col < max_col; col++) {
		var bma = map[col][1];
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
	    frames: {width: CELL_SIZE, height: CELL_SIZE, count: 12, regX: 1, regY: 1},
	    animations: {
			blank: [9],
			empty_cell: [0],
			yellow_cell: [1],
			red_cell: [2],
			place_yellow: [9],//[4],
			place_red: [9],//[5],
			fill_yellow: [4],//[7],
			fill_red: [5],//[8],
			win_yellow: [10],
			win_red: [11],
		}
    });
    
    // build a stage object to hold our game board
    stage = new Stage(game);
    stage.mouseEventsEnabled = true; // allow mouse events
    stage.enableMouseOver(); // allow mouseover events
    
    // set up a game ticker
    Ticker.addListener(stage);
    Ticker.useRAF = true;
    Ticker.setFPS(60);
 
    // initialise the game board
    map = [];
    for (var col = 0; col < max_col; col++) {
    	var line = [];
    	for (var row = 0; row < max_row + header_rows; row++) {
    		/// create a new bitmap animation
    		var bma = new BitmapAnimation(spriteSheet);
    		
    		// set up the correct bitmap
    		if (col > max_col) {
    			bma.gotoAndPlay("blank");
    		} else {
    			if (row == 0)
	    		{
	    			bma.gotoAndPlay("blank");
	    		} else if (row == 1){
	    			bma.gotoAndPlay((current_team == YELLOW) ? "place_yellow" : "place_red");
    				bma.onMouseOver = changePlaceMouseOver;
    				bma.onMouseOut = changePlaceMouseOut;
    				bma.onPress = placeDiscEvent;
	    		} else {
	    			bma.gotoAndPlay("empty_cell");
	    		}
    		}
    		
    		// configure the bitmap animation position
    		bma.name = row + "," + col;
    		bma.x = col * CELL_SIZE;
    		bma.y = row * CELL_SIZE;
    		stage.addChild(bma);
	    	line.push(bma);
    	}
    	map.push(line);
    }
}

