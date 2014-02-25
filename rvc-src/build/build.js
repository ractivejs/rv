define( function () {

	'use strict';

	return function ( name, definition, callback ) {
		var dependencies = ['require','Ractive'],
			dependencyArgs = ['require','Ractive'],
			dependencyMap = [],
			builtModule;

		// Add dependencies from <link> tags, i.e. sub-components
		definition.imports.forEach( function ( toImport, i ) {
			var href, name, argumentName;

			href = toImport.href;
			name = toImport.name;

			argumentName = '_import_' + i;

			dependencies.push( 'rvc!' + href.replace( /\.html$/, '' ) );
			dependencyArgs.push( argumentName );

			dependencyMap.push( '"' + name + '":' + argumentName );
		});

		// Add dependencies from inline require() calls
		dependencies = dependencies.concat( definition.modules );

		builtModule = 'define("rvc!' + name +'",' + JSON.stringify(dependencies) + ',function(' + dependencyArgs.join(',') + '){' +
			'var __options__={template:' + JSON.stringify(definition.template) + ',css:' + JSON.stringify(definition.css) + ',components:{' + dependencyMap.join( ',' ) + '}},component={};';

		if ( definition.script ) {
			builtModule += '\n' + definition.script + '\n' +
				'if(typeof component.exports === "object"){' +
					'for(__prop__ in component.exports){' +
						'if(component.exports.hasOwnProperty(__prop__)){' +
							'__options__[__prop__]=component.exports[__prop__];' +
						'}' +
					'}' +
				'}';
		}

		builtModule += 'return Ractive.extend(__options__);' +
			'});';

		callback( builtModule );
	};

});
