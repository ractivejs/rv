// First we have to configure RequireJS
require.config({
	// This tells RequireJS where to find Ractive and rv
	paths: {
		ractive: 'lib/ractive-legacy',
		rv: 'loaders/rv'
	},

	// These aren't used during development, but the optimiser will
	// read this config when we run the build script
	name: 'main',
	out: '../../dist/js/main.js',
	stubModules: [ 'rv' ]
});

// Now we've configured RequireJS, we can load our dependencies and start
require([ 'ractive', 'rv!templates/clock' ], function ( Ractive, clockTemplate ) {

	'use strict';

	var Clock = Ractive.extend({
		template: clockTemplate,

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

	var clock = new Clock({
		el: 'main'
	});

});
