define([
	'rcu.amd',
	'tosource',
	'minifycss'
], function (
	rcu,
	toSource,
	minifycss
) {

	'use strict';

	return function ( name, source, callback ) {
		var definition,
			dependencies = ['require','ractive'],
			dependencyArgs = ['require','Ractive'],
			importMap = [],
			builtModule;

		definition = rcu.parse( source );

		// Add dependencies from <link> tags, i.e. sub-components
		definition.imports.forEach( function ( toImport, i ) {
			var href, name, argumentName;

			href = toImport.href;
			name = toImport.name;

			argumentName = '_import_' + i;

			dependencies.push( 'rvc!' + href.replace( /\.html$/, '' ) );
			dependencyArgs.push( argumentName );

			importMap.push( '"' + name + '":' + argumentName );
		});

		// Add dependencies from inline require() calls
		dependencies = dependencies.concat( definition.modules );

		builtModule = '' +

		'define("rvc!' + name +'",' + JSON.stringify( dependencies ) + ',function(' + dependencyArgs.join( ',' ) + '){\n' +
		'  var __options__={\n    template:' + toSource( definition.template, null, '', '' ) + ',\n' +
		( definition.css ?
		'    css:' + JSON.stringify( minifycss( definition.css ) ) + ',\n' : '' ) +
		( definition.imports.length ?
		'    components:{' + importMap.join( ',' ) + '}\n' : '' ) +
		'  },\n' +
		'  component={};';

		if ( definition.script ) {
			builtModule += '\n' + definition.script + '\n' +
				'  if ( typeof component.exports === "object" ) {\n    ' +
					'for ( __prop__ in component.exports ) {\n      ' +
						'if ( component.exports.hasOwnProperty(__prop__) ) {\n        ' +
							'__options__[__prop__] = component.exports[__prop__];\n      ' +
						'}\n    ' +
					'}\n  ' +
				'}\n\n  ';
		}

		builtModule += 'return Ractive.extend(__options__);\n});';
		callback( builtModule );
	};

});
