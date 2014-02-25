module.exports = {
	main: 'rvc-src/**/*.js',
	options: {
		strict: true,
		unused: true,
		undef: true,
		smarttabs: true,
		boss: true,
		globals: {
			define: true,
			module: true,
			require: true,
			window: true,
			document: true,
			Ractive: true,
			amdLoader: true
		}
	}
};
