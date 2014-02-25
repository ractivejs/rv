define( function () {

	'use strict';

	return function loadModules ( req, definition ) {
		return new Ractive.Promise( function ( fulfil, reject ) {
			var modules = {};

			if ( !definition.modules.length ) {
				fulfil( modules );
				return;
			}

			req( definition.modules, function () {
				var args = Array.prototype.slice.call( arguments );

				definition.modules.forEach( function ( name, i ) {
					modules[ name ] = args[i];
				});

				fulfil( modules );
			}, reject );
		});
	};

});
