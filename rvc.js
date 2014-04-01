/*

	rvc.js - v0.1.5 - 2014-04-01
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

define( [ 'amd-loader', 'ractive' ], function( amdLoader, Ractive ) {

	'use strict';

	/*

	rcu (Ractive component utils) - 0.1.0 - 2014-04-01
	==============================================================

	Copyright 2014 Rich Harris and contributors

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
	var rcuamd = function() {

		var Ractive;
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
		var parse = function( getName ) {
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

			function extractFragment( item ) {
				return item.f;
			}
		}( getName );
		var resolve = function resolvePath( relativePath, base ) {
			var pathParts, relativePathParts, part;
			if ( relativePath.charAt( 0 ) !== '.' ) {
				return relativePath;
			}
			pathParts = ( base || '' ).split( '/' );
			relativePathParts = relativePath.split( '/' );
			pathParts.pop();
			while ( part = relativePathParts.shift() ) {
				if ( part === '..' ) {
					pathParts.pop();
				} else if ( part !== '.' ) {
					pathParts.push( part );
				}
			}
			return pathParts.join( '/' );
		};
		var make = function( resolve, parse ) {
			return function makeComponent( source, config, callback ) {
				var definition, baseUrl, make, loadImport, imports, loadModule, modules, remainingDependencies, onloaded, onerror, errorMessage, ready;
				config = config || {};
				baseUrl = config.baseUrl || '';
				loadImport = config.loadImport;
				loadModule = config.loadModule;
				onerror = config.onerror;
				definition = parse( source );
				make = function() {
					var options, fn, component, exports, Component, prop;
					options = {
						template: definition.template,
						css: definition.css,
						components: imports
					};
					if ( definition.script ) {
						try {
							fn = new Function( 'component', 'require', 'Ractive', definition.script );
						} catch ( err ) {
							errorMessage = 'Error creating function from component script: ' + err.message || err;
							if ( onerror ) {
								onerror( errorMessage );
							} else {
								throw new Error( errorMessage );
							}
						}
						try {
							fn( component = {}, config.require, Ractive );
						} catch ( err ) {
							errorMessage = 'Error executing component script: ' + err.message || err;
							if ( onerror ) {
								onerror( errorMessage );
							} else {
								throw new Error( errorMessage );
							}
						}
						exports = component.exports;
						if ( typeof exports === 'object' ) {
							for ( prop in exports ) {
								if ( exports.hasOwnProperty( prop ) ) {
									options[ prop ] = exports[ prop ];
								}
							}
						}
					}
					Component = Ractive.extend( options );
					callback( Component );
				};
				remainingDependencies = definition.imports.length + definition.modules.length;
				if ( remainingDependencies ) {
					onloaded = function() {
						if ( !--remainingDependencies ) {
							if ( ready ) {
								make();
							} else {
								setTimeout( make, 0 );
							}
						}
					};
					if ( definition.imports.length ) {
						if ( !loadImport ) {
							throw new Error( 'Component definition includes imports (e.g. `<link rel="ractive" href="' + definition.imports[ 0 ].href + '">`) but no loadImport method was passed to rcu.make()' );
						}
						imports = {};
						definition.imports.forEach( function( toImport ) {
							var name, path;
							name = toImport.name;
							path = resolve( baseUrl, toImport.href );
							loadImport( name, path, function( Component ) {
								imports[ name ] = Component;
								onloaded();
							} );
						} );
					}
					if ( definition.modules.length ) {
						if ( !loadModule ) {
							throw new Error( 'Component definition includes modules (e.g. `require("' + definition.imports[ 0 ].href + '")`) but no loadModule method was passed to rcu.make()' );
						}
						modules = {};
						definition.modules.forEach( function( name ) {
							var path = resolve( name, baseUrl );
							loadModule( name, path, function( Component ) {
								modules[ name ] = Component;
								onloaded();
							} );
						} );
					}
				} else {
					setTimeout( make, 0 );
				}
				ready = true;
			};
		}( resolve, parse );
		var rcu = function( parse, make, resolve, getName ) {
			return {
				init: function( copy ) {
					Ractive = copy;
				},
				parse: parse,
				make: make,
				resolve: resolve,
				getName: getName
			};
		}( parse, make, resolve, getName );
		return rcu;
	}();

	var load = function( rcu ) {

		rcu.init( Ractive );
		return function load( req, source, callback ) {
			rcu.make( source, {
				loadImport: function( name, path, callback ) {
					req( [ 'rvc!' + path.replace( /\.html$/, '' ) ], callback );
				},
				loadModule: function( name, path, callback ) {
					req( [ path ], callback );
				},
				require: function( name ) {
					return req( name );
				}
			}, callback );
		};
	}( rcuamd );

	/* toSource by Marcello Bastea-Forte - zlib license */
	/* altered to export as AMD module */
	var tosource = function() {

		var KEYWORD_REGEXP = /^(abstract|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|undefined|var|void|volatile|while|with)$/;
		return function( object, filter, indent, startingIndent ) {
			var seen = [];
			return walk( object, filter, indent === undefined ? '  ' : indent || '', startingIndent || '' );

			function walk( object, filter, indent, currentIndent ) {
				var nextIndent = currentIndent + indent;
				object = filter ? filter( object ) : object;
				switch ( typeof object ) {
					case 'string':
						return JSON.stringify( object );
					case 'boolean':
					case 'number':
					case 'function':
					case 'undefined':
						return '' + object;
				}
				if ( object === null )
					return 'null';
				if ( object instanceof RegExp )
					return object.toString();
				if ( object instanceof Date )
					return 'new Date(' + object.getTime() + ')';
				if ( seen.indexOf( object ) >= 0 )
					return '{$circularReference:1}';
				seen.push( object );

				function join( elements ) {
					return indent.slice( 1 ) + elements.join( ',' + ( indent && '\n' ) + nextIndent ) + ( indent ? ' ' : '' );
				}
				if ( Array.isArray( object ) ) {
					return '[' + join( object.map( function( element ) {
						return walk( element, filter, indent, nextIndent );
					} ) ) + ']';
				}
				var keys = Object.keys( object );
				return keys.length ? '{' + join( keys.map( function( key ) {
					return ( legalKey( key ) ? key : JSON.stringify( key ) ) + ':' + walk( object[ key ], filter, indent, nextIndent );
				} ) ) + '}' : '{}';
			}
		};

		function legalKey( string ) {
			return /^[a-z_$][0-9a-z_$]*$/gi.test( string ) && !KEYWORD_REGEXP.test( string );
		}
	}();

	var minifycss = function( css ) {
		return css.replace( /^\s+/gm, '' );
	};

	var build = function( rcu, toSource, minifycss ) {

		return function( name, source, callback ) {
			var definition, dependencies = [
					'require',
					'ractive'
				],
				dependencyArgs = [
					'require',
					'Ractive'
				],
				importMap = [],
				builtModule;
			definition = rcu.parse( source );
			definition.imports.forEach( function( toImport, i ) {
				var href, name, argumentName;
				href = toImport.href;
				name = toImport.name;
				argumentName = '_import_' + i;
				dependencies.push( 'rvc!' + href.replace( /\.html$/, '' ) );
				dependencyArgs.push( argumentName );
				importMap.push( '"' + name + '":' + argumentName );
			} );
			dependencies = dependencies.concat( definition.modules );
			builtModule = '' + 'define("rvc!' + name + '",' + JSON.stringify( dependencies ) + ',function(' + dependencyArgs.join( ',' ) + '){\n' + '  var __options__={\n    template:' + toSource( definition.template, null, '', '' ) + ',\n' + ( definition.css ? '    css:' + JSON.stringify( minifycss( definition.css ) ) + ',\n' : '' ) + ( definition.imports.length ? '    components:{' + importMap.join( ',' ) + '}\n' : '' ) + '  },\n' + '  component={};';
			if ( definition.script ) {
				builtModule += '\n' + definition.script + '\n' + '  if ( typeof component.exports === "object" ) {\n    ' + 'for ( __prop__ in component.exports ) {\n      ' + 'if ( component.exports.hasOwnProperty(__prop__) ) {\n        ' + '__options__[__prop__] = component.exports[__prop__];\n      ' + '}\n    ' + '}\n  ' + '}\n\n  ';
			}
			builtModule += 'return Ractive.extend(__options__);\n});';
			callback( builtModule );
		};
	}( rcuamd, tosource, minifycss );

	var rvc = function( rcu, load, build ) {

		rcu.init( Ractive );
		return amdLoader( 'rvc', 'html', function( name, source, req, callback, errback, config ) {
			if ( config.isBuild ) {
				build( name, source, callback );
			} else {
				load( req, source, callback );
			}
		} );
	}( rcuamd, load, build );

	return rvc;

} );
