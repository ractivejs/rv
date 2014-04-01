define([
	'load',
	'build'
], function (
	load,
	build
) {

	'use strict';

	return amdLoader( 'rvc', 'html', function( name, source, req, callback, errback, config ) {
		if ( config.isBuild ) {
			build( name, source, callback );
		} else {
			load( req, source, callback );
		}
	});

});
