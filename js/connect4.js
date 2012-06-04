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

/* define teams - also used in spritesheet */
var NONE = 0; 
var YELLOW = 1;
var RED = 2;

/* define some sprite constants */
var IN_BOARD = 0; // a disc in the game board
var OUT_BOARD = 1; // a disc outside the game board
var WINNING_DISC = 2; // a disc that is part of the winning combination

/* load the sprite sheet */
var spriteImage = new Image();
var spriteSheet;

/* an 8x8 array to use to hold the game map */
var map = []; 

/* the game canvas */
var game;


function init()
{
	// get a reference to the game canvas
	game = document.getElementById("gameCanvas");
}
