// This plugin has two dependencies - Ractive, and the 'text' loader plugin
// (download from https://github.com/requirejs/text).

// If those modules aren't in your root/baseUrl folder, you can either use
// RequireJS's paths config, or modify this file so that to replace
// `[ 'text', 'Ractive' ]` with e.g. `[ 'loaders/text', 'lib/Ractive' ]`
//
// See http://requirejs.org/docs/api.html#config-paths for more info about
// the paths config

define([ 'text', 'Ractive' ], function ( text, Ractive ) {

	'use strict';

	var buildMap = {};

	return {
		load: function ( name, req, onload, config ) {
			var filename;

			// add .html extension
			filename = name + ( ( name.substr( -5 ) !== '.html' ) ? '.html' : '' );

			text.get( req.toUrl( filename ), function ( template ) {
				var result = Ractive.parse( template );

				if ( config.isBuild ) {
					buildMap[ name ] = result;
				}

				onload( result );
			}, onload.error );
		},

		write: function ( pluginName, name, write ) {
			if ( buildMap[ name ] === undefined ) {
				throw 'Could not parse template ' + name;
			}

			write( 'define("' + pluginName + '!' + name + '",function(){return ' + JSON.stringify( buildMap[ name ] ) + ';})' );
		}
	};

});