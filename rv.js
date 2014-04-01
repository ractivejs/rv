// This plugin has two dependencies - Ractive, and the 'amd-loader' loader plugin
// (download from https://github.com/guybedford/amd-loader).

// If those modules aren't in your root (or baseUrl) folder, you can either use
// RequireJS's paths config, or modify this file by replacing
// `[ 'amd-loader', 'Ractive' ]` with e.g. `[ 'loaders/amd-loader', 'lib/Ractive' ]`
//
// See http://requirejs.org/docs/api.html#config-paths for more info about
// the paths config

define([ 'amd-loader', 'ractive' ], function( amdLoader, Ractive ) {
	return amdLoader( 'rv', 'html', function( name, source, req, callback, errback, config ) {

		var parsed = Ractive.parse( source );

		if ( !config.isBuild ) {
			callback( parsed );
		} else {
			callback( 'define("rv!' + name + '",function(){return ' + JSON.stringify( parsed ) + ';})' );
		}

	});
});
