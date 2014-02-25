define( function () {

	'use strict';

	return function loadImports ( req, definition ) {
		return new Ractive.Promise( function ( fulfil, reject ) {
			var imports = {}, pendingImports = definition.imports.length;

			if ( !pendingImports ) {
				fulfil( imports );
				return;
			}

			definition.imports.forEach( function ( toImport ) {
				req([ 'rvc!' + toImport.href.replace( /\.html$/, '' ) ], function ( Component ) {
					imports[ toImport.name ] = Component;

					if ( !--pendingImports ) {
						fulfil( imports );
					}
				}, reject );
			});
		});
	};

});
