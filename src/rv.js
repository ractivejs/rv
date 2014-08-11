define([
	'amd-loader',
	'tosource'
], function (
	amdLoader,
	toSource
) {

	'use strict';

	return amdLoader( 'rv', 'html', function( name, source, req, callback, errback, config ) {

		var parsed = Ractive.parse( source );

		if ( !config.isBuild ) {
			callback( parsed );
		} else {
			callback( 'define("rv!' + name + '",function(){return ' + toSource( parsed ) + ';})' );
		}

	});

});
