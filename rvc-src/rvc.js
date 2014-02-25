define([
	'utils/parseComponentDefinition',
	'load/load',
	'build/build'
], function (
	parseComponentDefinition,
	load,
	build
) {

	'use strict';

	return amdLoader( 'rvc', 'html', function( name, source, req, callback, errback, config ) {

		var definition = parseComponentDefinition( source );

		if ( config.isBuild ) {
			build( name, definition, callback );
		} else {
			load( req, definition, callback );
		}
	});

});
