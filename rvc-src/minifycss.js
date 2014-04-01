define( function () {

	'use strict';

	// TODO more intelligent minification? removing comments?
	// collapsing declarations?

	return function ( css ) {
		return css.replace( /^\s+/gm, '' );
	};

});
