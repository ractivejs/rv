define( function () {

	'use strict';

	return function resolveModuleId ( base, path ) {
		var basePathParts, pathParts;

		if ( path.charAt( 0 ) !== '.' ) {
			return path;
		}

		basePathParts = base.split( '/' );
		pathParts = path.split( '/' );

		while ( pathParts[0] === '..' ) {
			pathParts.shift();
			if ( !basePathParts.pop() ) {
				throw new Error( 'Bad module path' );
			}
		}

		if ( pathParts[0] === '.' ) {
			if ( !basePathParts.pop() ) {
				throw new Error( 'Bad module path' );
			}
		}

		return basePathParts.concat( pathParts ).join( '/' );
	};

});
