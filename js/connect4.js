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
	for(row = 9; row > 1; row--) {
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
		checkForWinner(row, col, 1, current_team, -1, -1);
		newTurn();
	} 
}


/*
 * Checks if there are four in a row anywhere on the board
 */
function checkForWinner(row, col, level, team, prev_row, prev_col) {
	
	// the cell we want to see for a win
	var win_cell = (current_team == YELLOW) ? "yellow_cell" : "red_cell";
	var check = false;

	// ensure int
	row = parseInt(row);
	col = parseInt(col);
	level = parseInt(level);
	prev_row = parseInt(prev_row);
	prev_col = parseInt(prev_col);
	
	// check bounds
	if( row > 9 || row < 2 || col > 7 || col < 0) {
		return false;
	}
	
	// get the map object
	var bma = map[col][row];
	
	// check if this is the right colour cell
	if( bma.currentAnimation == win_cell) {
		
		if (level == 4) { //FTW???
			declareWinner(row, col, team);
			return true; // the fourth in a row and in the correct colour
		
		} else {
			// no the fourth but still the correct colour - test again
			if (level == 1) {
				// test in every direction
				for(var r = -1; r < 2; r++) {
					for (var c =-1; c < 2; c++) {
						if (r != 0 || c != 0) { // prevent checking the same cell repeatedly
							if (checkForWinner(row + r, col + c, level + 1, team, row, col)) {
								declareWinner(row,col,team);
								return true;
							}
						}
					}
				}
			
			} else {
				// only test in the same direction we are already looking
				var del_row = row - prev_row;
				var del_col = col - prev_col;
				
				if (checkForWinner(eval(row + del_row), eval(col + del_col), level + 1, team, row, col)) {
					declareWinner(row,col,team);
					return true;
				} else {
					return false;
				}		
			}
		}

	} else {
		return false; // wrong colour, stop checking
	}
	
	return true;
}


/* 
 * 'Declares' a winner, by highlighting the winning disc
 */
function declareWinner(row, col, team) {
	var win_str = (team == YELLOW) ? "win_yellow" : "win_red";
	map[col][row].gotoAndPlay(win_str);
	current_team = NONE;
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
	    frames: {width: CELL_SIZE, height: CELL_SIZE, count: 12, regX: 1, regY: 1},
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
    Ticker.addListener(stage);
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
 * Gets a sprite index based on the row and column provided
 */
function getSpriteIdx(state, colour) {
	return state * ROW_MULTIPLIER + colour;
}
