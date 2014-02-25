/*

	rvc.js - v0.1.3 - 2014-02-25
	==========================================================

	Next-generation DOM manipulation - http://ractivejs.org
	Follow @RactiveJS for updates

	----------------------------------------------------------

	Copyright 2014 Rich Harris

	Permission is hereby granted, free of charge, to any person
	obtaining a copy of this software and associated documentation
	files (the "Software"), to deal in the Software without
	restriction, including without limitation the rights to use,
	copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following
	conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.

*/

define( [ 'amd-loader', 'Ractive' ], function( amdLoader, Ractive ) {

	'use strict';

	var getName = function getName( path ) {
		var pathParts, filename, lastIndex;
		pathParts = path.split( '/' );
		filename = pathParts.pop();
		lastIndex = filename.lastIndexOf( '.' );
		if ( lastIndex !== -1 ) {
			filename = filename.substr( 0, lastIndex );
		}
		return filename;
	};

	var extractFragment = function extractFragment( item ) {
		return item.f;
	};

	var parseComponentDefinition = function( getName, extractFragment ) {

		var requirePattern = /require\s*\(\s*(?:"([^"]+)"|'([^']+)')\s*\)/g;
		return function parseComponentDefinition( source ) {
			var template, links, imports, scripts, script, styles, match, modules, i, item;
			template = Ractive.parse( source, {
				noStringify: true,
				interpolateScripts: false,
				interpolateStyles: false
			} );
			links = [];
			scripts = [];
			styles = [];
			modules = [];
			i = template.length;
			while ( i-- ) {
				item = template[ i ];
				if ( item && item.t === 7 ) {
					if ( item.e === 'link' && ( item.a && item.a.rel[ 0 ] === 'ractive' ) ) {
						links.push( template.splice( i, 1 )[ 0 ] );
					}
					if ( item.e === 'script' && ( !item.a || !item.a.type || item.a.type[ 0 ] === 'text/javascript' ) ) {
						scripts.push( template.splice( i, 1 )[ 0 ] );
					}
					if ( item.e === 'style' && ( !item.a || !item.a.type || item.a.type[ 0 ] === 'text/css' ) ) {
						styles.push( template.splice( i, 1 )[ 0 ] );
					}
				}
			}
			imports = links.map( function( link ) {
				var href, name;
				href = link.a.href && link.a.href[ 0 ];
				name = link.a.name && link.a.name[ 0 ] || getName( href );
				if ( typeof name !== 'string' ) {
					throw new Error( 'Error parsing link tag' );
				}
				return {
					name: name,
					href: href
				};
			} );
			script = scripts.map( extractFragment ).join( ';' );
			while ( match = requirePattern.exec( script ) ) {
				modules.push( match[ 1 ] || match[ 2 ] );
			}
			return {
				template: template,
				imports: imports,
				script: script,
				css: styles.map( extractFragment ).join( ' ' ),
				modules: modules
			};
		};
	}( getName, extractFragment );

	/*global console */
	var warn = function() {

		if ( console && typeof console.warn === 'function' ) {
			return function() {
				console.warn.apply( console, arguments );
			};
		}
		return function() {};
	}();

	var loadImports = function loadImports( req, definition ) {
		return new Ractive.Promise( function( fulfil, reject ) {
			var imports = {}, pendingImports = definition.imports.length;
			if ( !pendingImports ) {
				fulfil( imports );
				return;
			}
			definition.imports.forEach( function( toImport ) {
				req( [ 'rvc!' + toImport.href.replace( /\.html$/, '' ) ], function( Component ) {
					imports[ toImport.name ] = Component;
					if ( !--pendingImports ) {
						fulfil( imports );
					}
				}, reject );
			} );
		} );
	};

	var loadModules = function loadModules( req, definition ) {
		return new Ractive.Promise( function( fulfil, reject ) {
			var modules = {};
			if ( !definition.modules.length ) {
				fulfil( modules );
				return;
			}
			req( definition.modules, function() {
				var args = Array.prototype.slice.call( arguments );
				definition.modules.forEach( function( name, i ) {
					modules[ name ] = args[ i ];
				} );
				fulfil( modules );
			}, reject );
		} );
	};

	var load = function( warn, loadImports, loadModules ) {

		var noConflict = {}, head;
		if ( typeof document !== 'undefined' ) {
			head = document.getElementsByTagName( 'head' )[ 0 ];
		}
		return function load( req, definition, callback ) {
			Ractive.Promise.all( [
				loadImports( req, definition ),
				loadModules( req, definition )
			] ).then( function( dependencies ) {
				var imports, modules, options, prop, scriptElement, exports, Component;
				imports = dependencies[ 0 ];
				modules = dependencies[ 1 ];
				options = {
					template: definition.template,
					css: definition.css,
					components: imports
				};
				if ( definition.script ) {
					scriptElement = document.createElement( 'script' );
					scriptElement.innerHTML = '(function (component, Ractive, require) {' + definition.script + '}(component, Ractive, require));';
					noConflict.component = window.component;
					noConflict.Ractive = window.Ractive;
					noConflict.require = window.require;
					window.component = options;
					window.Ractive = Ractive;
					window.require = function( name ) {
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
					head.removeChild( scriptElement );
					window.component = noConflict.component;
					window.Ractive = noConflict.Ractive;
					window.require = noConflict.require;
				} else {
					Component = Ractive.extend( {
						template: definition.template,
						css: definition.css,
						components: imports
					} );
				}
				callback( Component );
			} );
		};
	}( warn, loadImports, loadModules );

	var build = function( name, definition, callback ) {
		var dependencies = [
			'require',
			'Ractive'
		],
			dependencyArgs = [
				'require',
				'Ractive'
			],
			dependencyMap = [],
			builtModule;
		definition.imports.forEach( function( toImport, i ) {
			var href, name, argumentName;
			href = toImport.href;
			name = toImport.name;
			argumentName = '_import_' + i;
			dependencies.push( 'rvc!' + href.replace( /\.html$/, '' ) );
			dependencyArgs.push( argumentName );
			dependencyMap.push( '"' + name + '":' + argumentName );
		} );
		dependencies = dependencies.concat( definition.modules );
		builtModule = 'define("rvc!' + name + '",' + JSON.stringify( dependencies ) + ',function(' + dependencyArgs.join( ',' ) + '){' + 'var __options__={template:' + JSON.stringify( definition.template ) + ',css:' + JSON.stringify( definition.css ) + ',components:{' + dependencyMap.join( ',' ) + '}},component={};';
		if ( definition.script ) {
			builtModule += '\n' + definition.script + '\n' + 'if(typeof component.exports === "object"){' + 'for(__prop__ in component.exports){' + 'if(component.exports.hasOwnProperty(__prop__)){' + '__options__[__prop__]=component.exports[__prop__];' + '}' + '}' + '}';
		}
		builtModule += 'return Ractive.extend(__options__);' + '});';
		callback( builtModule );
	};

	var rvc = function( parseComponentDefinition, load, build ) {

		return amdLoader( 'rvc', 'html', function( name, source, req, callback, errback, config ) {
			var definition = parseComponentDefinition( source );
			if ( config.isBuild ) {
				build( name, definition, callback );
			} else {
				load( req, definition, callback );
			}
		} );
	}( parseComponentDefinition, load, build );

	return rvc;

} );
