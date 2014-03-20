define([
	'utils/resolveModuleId'
], function (
	resolveModuleId
) {

	'use strict';

	return function loadImports ( req, name, definition ) {
		return new Ractive.Promise( function ( fulfil, reject ) {
			var imports = {}, pendingImports = definition.imports.length;

			if ( !pendingImports ) {
				fulfil( imports );
				return;
			}

			definition.imports.forEach( function ( toImport ) {
				var moduleId = resolveModuleId( name, toImport.href );

				req([ 'rvc!' + moduleId.replace( /\.html$/, '' ) ], function ( Component ) {
					imports[ toImport.name ] = Component;

					if ( !--pendingImports ) {
						fulfil( imports );
					}
				}, reject );
			});
		});
	};

});
