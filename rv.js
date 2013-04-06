/*global define, XMLHttpRequest */

define( [ 'text', 'Ractive' ], function ( text, Ractive ) {

	'use strict';

	var buildMap = {};

	return {
		load: function ( name, req, onload, config ) {
			// add .html extension
			if ( name.substr( -5 ) !== '.html' ) {
				name += '.html';
			}

			text.get( req.toUrl( name ), function ( template ) {
				var result = Ractive.compile( template );

				if ( config.isBuild ) {
					buildMap[ name ] = result;
				}

				onload( result );
			}, onload.error );
		},

		write: function ( pluginName, name, write ) {
			// add .html extension
			if ( name.substr( -5 ) !== '.html' ) {
				name += '.html';
			}

			if ( buildMap[ name ] === undefined ) {
				throw 'Could not compile template ' + name;
			}

			write( 'define("' + pluginName + '!' + name + '",function(){return ' + JSON.stringify( buildMap[ name ] ) + ';})' );
		}
	};

});