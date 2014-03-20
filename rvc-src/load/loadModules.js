define([
	'utils/resolveModuleId'
], function (
	resolveModuleId
) {

	'use strict';

	return function loadModules ( req, name, definition ) {
		return new Ractive.Promise( function ( fulfil, reject ) {
			var modules = {}, mapped;

			if ( !definition.modules.length ) {
				fulfil( modules );
				return;
			}

			mapped = definition.modules.map( function ( moduleName ) {
				return resolveModuleId( name, moduleName );
			});

			req( mapped, function () {
				var args = Array.prototype.slice.call( arguments );

				definition.modules.forEach( function ( name, i ) {
					modules[ name ] = args[i];
				});

				fulfil( modules );
			}, reject );
		});
	};

});
