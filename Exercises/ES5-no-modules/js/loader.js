/*
loader.js
variable 'app' is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};


window.onload = function(){
	console.log("window.onload called");
	// This is the "sandbox" where we hook our modules up
	// so that we don't have any hard-coded dependencies in
	// the modules themselves
	// more full blown sandbox solutions are discussed here:
	// http://addyosmani.com/writing-modular-js/

	app.main.init();
}