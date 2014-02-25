RequireJS Ractive plugin
==========================

RequireJS plugin to precompile [Ractive][1] templates. See the [sample applications][4] to get started.

Quick start
-----------

Put `rv.js` and/or `rvc.js` at your project's `baseUrl` along with the latest versions of [`Ractive.js`][1] and Guy Bedford's [`amd-loader.js`][2] plugin.

If you'd rather put them in a subfolder, that's fine too - just modify your config, eg:

```js
require.config({
	paths: {
		Ractive: 'lib/Ractive',
		'amd-loader': 'plugins/amd-loader',
		rv: 'plugins/rv',
		rvc: 'plugins/rvc'
	}
});
```

Then, require your HTML files as modules using the plugin syntax: `rv!path/to/template` or `rvc!/path/to/component`. The `.html` extension is assumed.


What is rv.js?
--------------

The **rv.js** loader loads a Ractive template from an HTML file and preparses it. This means we don't have to store templates as multiline strings in our JavaScript, or load them with AJAX, or store them inside `<script id='myTemplate' type='text/ractive'>` tags.

It also means that if we use the Require.js optimiser (see below), the template is parsed as part of that build process, rather than being parsed in the browser each time.


What is rvc.js?
---------------

The **rvc.js** loader takes this idea a step further. Instead of just storing your *template* in a separate HTML file, you can store an entire component:

**hello-world.html**

```html
<h1>Hello {{name}}!</h1>
<p>This is a self-contained Ractive component, with HTML, CSS and JavaScript.</p>
<button class='big-red-button' on-click='activate'>Activate!</button>

<style>
	/* These styles will be in the page as long as there are one
	   or more instances of this component. This block is optional */
	.big-red-button {
		background: rgb(200,0,0);
		color: white;
		font-size: 2em;
	}
</style>

<script>
	/* Inside here, we can `require()` AMD modules: */
	var foo = require( 'foo' );

	/* We need to 'export' the component. The value of `component.exports`
	   will be passed to `Ractive.extend()` along with the HTML and CSS -
	   see http://docs.ractivejs.org/latest/ractive-extend for more info */
	component.exports = {
		init: function () {
			this.on( 'activate', function () {
				alert( 'Activating!' );
			});
		},

		data: {
			name: 'world'
		}
	};
</script>
```

You'd use this component like so:

**app.js**

```js
define( function ( require ) {

	'use strict';

	var HelloWorldView = require( 'rvc!path/to/hello-world' );

	var view = new HelloWorldView({
		el: 'body'
	});

});
```


Optimisation
------------

Both `rv.js` and `rvc.js` work with the [RequireJS Optimizer][3], so you can incorporate your compiled templates into your project and avoid the initial computation happening on the client. You don't need to 'do' anything, it should just work.

If you are inlining resources in this way, it is likely that you don't need the `amd-loader.js` and `rv.js`/`rvc.js` modules in your final built file. To shave off a few kilobytes, use the `stubModules` option, adding this to your `build.js` config:

```js
({
	stubModules: [ 'rv', 'rvc', 'amd-loader' ]
})
```


Changelog
---------

* 0.1.3 - file extension bug fix
* 0.1.2 - Updated to use Ractive 0.3.0 API
* 0.1.1 - renamed. Anglebars is now Ractive
* 0.1.0 - first version


[1]: https://github.com/RactiveJS/Ractive
[2]: https://github.com/guybedford/amd-loader
[3]: http://requirejs.org/docs/optimization.html
[4]: https://github.com/RactiveJS/requirejs-ractive/tree/master/sample
