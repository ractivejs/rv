// This is where we 'define' our application. There are a few different syntaxes
// for defining modules - see http://requirejs.org/docs/commonjs.html#altsyntax
// for more details
define( function ( require ) {

	'use strict';

	// RequireJS will scan the module definition for calls to `require` and ensure
	// that those dependencies are loaded before this module is declared ready
	var Clock = require( 'views/Clock' );

	var clock = new Clock({
		el: 'clock'
	});
	
});