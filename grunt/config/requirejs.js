module.exports = function ( grunt ) {

	'use strict';

	return {
		compile: {
			options: {
				out: 'rv.js',
				baseUrl: 'src/',
				name: 'rv',
				optimize: 'none',
				paths: {
					'amd-loader': '../vendor/amd-loader',
					'tosource': '../vendor/tosource'
				},
				logLevel: 2,
				onModuleBundleComplete: function ( data ) {
					var fs, amdclean, outputFile;

					fs = require( 'fs' );
					amdclean = require( 'amdclean' );

					outputFile = data.path;

					fs.writeFileSync( outputFile, amdclean.clean({
						filePath: outputFile,
						wrap: {
							start: grunt.template.process( '<%= wrapper.start %>' ),
							end: grunt.template.process( '<%= wrapper.end %>' )
						}
					}));
				}
			}
		}
	};
};
