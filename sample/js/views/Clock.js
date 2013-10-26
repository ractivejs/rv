define( function ( require ) {

	'use strict';

	var Ractive = require( 'Ractive' );

	var Clock = Ractive.extend({
		
		// This is the part where we use the Ractive loader plugin - by
		// requiring 'rv!./clock.html', we're saying 'load the clock.html
		// file, but process it with the rv loader plugin'.

		// This means that when we use the RequireJS optimiser to bundle
		// all our JavaScript into a single file, the template will be parsed
		// before bundling so it doesn't need to happen in the browser.
		//
		// See http://requirejs.org/docs/optimization.html for more info
		// about the RequireJS optimiser.
		template: require( 'rv!./clock.html' ),

		data: {
			minor: new Array( 60 ),
			major: new Array( 12 )
		},

		init: function () {
			var self = this, interval;

			this.set( 'date', new Date() );

			interval = setInterval( function () {
				self.set( 'date', new Date() );
			});

			this.on( 'teardown', function () {
				clearInterval( interval );
			});
		}
	});

	return Clock;

});