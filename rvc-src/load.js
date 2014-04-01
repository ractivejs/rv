define([
	'rcu'
], function (
	rcu
) {

	'use strict';

	return function load ( req, source, callback ) {
		rcu.make( source, {
			loadImport: function ( name, path, callback ) {
				req([ 'rvc!' + path.replace( /\.html$/, '' ) ], callback );
			},
			loadModule: function ( name, path, callback ) {
				req([ path ], callback );
			}
		})
	};

});
