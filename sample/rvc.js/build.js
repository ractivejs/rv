// This is our build configuration - the file we point the RequireJS
// optimiser at. As it stands, it will produce a file called main-built.js
// - to use it you would have to edit the index.html file so that
// data-main='main-built.js' instead of data-main='js/main.js'.
//
// For more sophisticated build process I recommend you investigate
// http://gruntjs.com/ and the RequireJS Grunt plugin.

({
	baseUrl: 'js/',
	paths: {
		// It's important that the paths are setup like this, because the
		// rv module has 'amd-loader' and 'Ractive' as dependencies
		'amd-loader': '../../../amd-loader',
		rvc: '../../../rvc',
		ractive: '../../lib/ractive-legacy'
	},
	name: 'main',
	out: 'main-built.js'
})
