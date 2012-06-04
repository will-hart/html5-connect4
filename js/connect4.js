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
var EMPTY_CELL = 0; // a disc in the game board
var FILL_CELL = 1; // a disc outside the game board
var WINNING_CELL = 2; // a disc that is part of the winning combination

/* the number of sprites in any row */
var ROW_MULTIPLIER = 3; // a multiplier for accessing different sprite rows

/* A blank cell where no sprite is shown */
var BLANK_CELL = -1;

/* load the sprite sheet */
var spriteImage = new Image();
var spriteSheet;

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
	// build a spritesheet up from the image we have loaded
    spriteSheet = new SpriteSheet({
	    images: [spriteImage], 
	    frames: {width: 64, height: 64, count: 9, regX: 0, regY: 0}, 
    });
    
    // build a stage object to hold our game board
    stage = new Stage(game);
    
    // set up a game ticker
    Ticker.addListener(window);
    Ticker.useRAF = true;
    Ticker.setFPS(60);
    
    // initialise the game board
    var emptyId = getSpriteIdx(EMPTY_CELL, NONE);
    for (var i = 0; i < 9; i++) {
    	map.push([emptyId, emptyId, emptyId, emptyId, emptyId, emptyId, emptyId, emptyId, BLANK_CELL, BLANK_CELL]);
    }
}


/* 
 * Gets a sprite index based on the row and column provided
 */
function getSpriteIdx(state, colour) {
	return state * ROW_MULTIPLIER + colour;
}
