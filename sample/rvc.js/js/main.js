// Here, we configure RequireJS so that it knows where to look
// for things when we do e.g. `require('Ractive')`
require.config({
	paths: {
		// It's important that the paths are setup like this, because the
		// rv module has 'amd-loader' and 'Ractive' as dependencies
		'amd-loader': 'loaders/amd-loader',
		rvc: 'loaders/rvc',
		Ractive: 'lib/Ractive'
	}
});

// Once we're all set up, we tell RequireJS where to start. When
// we say `require([ 'app' ])` we mean 'load the app.js file, and
// all its dependencies, then execute it'
require([ 'app' ]);
