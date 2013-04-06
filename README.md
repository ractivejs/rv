RequireJS Ractive plugin
==========================

RequireJS plugin to precompile [Ractive][1] templates.

Usage
-----

Put `rv.js` at your project's `baseUrl` along with the latest versions of [`Ractive.js`][1] and the RequireJS [`text.js`][2] plugin.

If you'd rather put them in a subfolder, that's fine too - just modify your config, eg:

```js
require.config({
	paths: {
		Ractive: 'lib/Ractive',
		text: 'plugins/text',
		rv: 'plugins/rv'
	}
});
```

Then, require your templates as modules using the plugin syntax: `rv!path/to/template`. It is assumed that your template files have an .html extension.


Example
-------

**baseUrl folder:**

* lib
    * Ractive.js
* plugins
    * rv.js
    * text.js
* views
    * MainView.js
* templates
    * mainview.html

**mainview.html:**

```html
<div id='mainview'>
	<h1>Welcome, {{user.name}}!</h1>
	<p>You have {{user.unread}} unread messages.</p>
</div>
```

**MainView.js**

```js
define([ 'Ractive', 'rv!templates/mainview' ], function ( Ractive, template ) {
	var MainView = Ractive.extend({
		template: template
	});

	return MainView;
});
```


Optimisation
------------

This plugin works with the [RequireJS Optimizer][3], so you can incorporate your compiled templates into your project and avoid the initial computation happening on the client. You don't need to 'do' anything, it should just work.

If you are inlining resources in this way, it is likely that you don't need the `text.js` and `rv.js` modules in your final built file. To shave off a few kilobytes, use the `stubModules` option, adding this to your `build.js` config:

```js
({
	stubModules: [ 'rv', 'text' ]
})
```


Changelog
---------

* 0.1.0 - first version
* 0.1.1 - renamed. Anglebars is now Ractive



[1]: https://github.com/Rich-Harris/Ractive
[2]: https://github.com/requirejs/text
[3]: http://requirejs.org/docs/optimization.html