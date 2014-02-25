rvc.js sample application
=========================

This is a clone of the `rv.js` sample application, but using the `rvc.js` plugin instead.

What's different?
-----------------

Instead of creating a `views/Clock.js` file that loads the template from `views/clock.html`, we have a single `views/Clock.html` file containing all the HTML, CSS and JavaScript for the clock component.

Because of that, we don't need to include the `css/clock.css` link in `index.html` any more. In other words, we've gone from three separate files - spread about our app - to just one.


Optimising the project
----------------------

As with `rv.js`, this plugin is compatible with the [RequireJS optimizer](http://requirejs.org/docs/optimization.html). That means that single-file components will be optimized and inlined when we build our project. Run the following command:

```shell
node r.js -o build.js
```

This says 'run r.js, and optimise the project using the configuration in build.js'.

It will spit out a new file, `main-built.js`, containing all the JavaScript for our project. Try editing `index.html`:

```html
<!-- from this... -->
<script src='require.js' data-main='js/main.js'></script>

<!-- ...to this -->
<script src='require.js' data-main='main-built.js'></script>
```
