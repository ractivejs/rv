module.exports = {
	compile: {
		options: {
			out: 'tmp/rvc.js',
			baseUrl: 'rvc-src/',
			name: 'rvc',
			optimize: 'none',
			logLevel: 2,
			onBuildWrite: function( name, path, contents ) {
				return require( 'amdclean' ).clean({
					code: contents,
					prefixTransform: function ( moduleName ) {
						return moduleName.substring( moduleName.lastIndexOf( '_' ) + 1 );
					}
				}) + '\n';
			}
		}
	}
};
