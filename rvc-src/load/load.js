define([
	'utils/warn',
	'load/loadImports',
	'load/loadModules'
], function (
	warn,
	loadImports,
	loadModules
) {

	'use strict';

	var noConflict = {}, head;

	if ( typeof document !== 'undefined' ) {
		head = document.getElementsByTagName( 'head' )[0];
	}

	return function load ( req, definition, callback ) {
		Ractive.Promise.all([ loadImports( req, definition ), loadModules( req, definition ) ]).then( function ( dependencies ) {
			var imports, modules, options, prop, scriptElement, exports, Component;

			imports = dependencies[0];
			modules = dependencies[1];

			options = {
				template: definition.template,
				css: definition.css,
				components: imports
			};

			if ( definition.script ) {
				scriptElement = document.createElement( 'script' );
				scriptElement.innerHTML = '(function (component, Ractive, require) {' + definition.script + '}(component, Ractive, require));';

				noConflict.component = window.component;
				noConflict.Ractive   = window.Ractive;
				noConflict.require   = window.require;

				window.component = options;

				window.Ractive = Ractive;
				window.require = function ( name ) {
					if ( !( name in modules ) ) {
						throw new Error( 'Module "' + name + '" is not available' );
					}
					return modules[ name ];
				};

				head.appendChild( scriptElement );

				exports = window.component.exports;

				if ( typeof exports === 'function' ) {
					warn( 'The function form has been deprecated. Use `component.exports = {...}` instead. You can access the `Ractive` variable if you need to.' );

					Component = exports( Ractive );
					Component.css = definition.css;
				} else if ( typeof exports === 'object' ) {
					for ( prop in exports ) {
						if ( exports.hasOwnProperty( prop ) ) {
							options[ prop ] = exports[ prop ];
						}
					}

					Component = Ractive.extend( options );
				}

				// tidy up after ourselves
				head.removeChild( scriptElement );

				window.component = noConflict.component;
				window.Ractive   = noConflict.Ractive;
				window.require   = noConflict.require;
			}

			else {
				Component = Ractive.extend({
					template: definition.template,
					css: definition.css,
					components: imports
				});
			}

			// return the component
			callback( Component );
		});
	};

});
