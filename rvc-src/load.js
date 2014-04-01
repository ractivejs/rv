define([
	'rcu.amd'
], function (
	rcu
) {

	'use strict';

	rcu.init( Ractive );

	return function load ( req, source, callback ) {
		rcu.make( source, {
			loadImport: function ( name, path, callback ) {
				req([ 'rvc!' + path.replace( /\.html$/, '' ) ], callback );
			},
			loadModule: function ( name, path, callback ) {
				req([ path ], callback );
			},
			require: function ( name ) {
				return req( name );
			}
		}, callback );
	};

});
