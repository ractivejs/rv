Ractive.js + RequireJS sample application
=========================================

This is a very simple app to demonstrate the use of RequireJS and the use of the Ractive.js loader plugin (rv.js).

Start at index.html and read the comments to understand how everything fits together.

Optimising the project
----------------------

Loader plugins come into their own when you use the [RequireJS optimizer](http://requirejs.org/docs/optimization.html) to bundle your application into a single file. In our case, the rv.js file will take a template and parse it, so that rather than including a whole load of HTML, your bundle contains the result of calling `Ractive.parse()` on that HTML. Doing this means that each user's browser doesn't have to parse the template - it can skip ahead to rendering it.

To optimize the project, you will need to have [Node.js](http://nodejs.org/) installed. Once it's installed, `cd` into the `sample` folder and run this from the command line:

```shell
node r.js -o build.js
```

This says 'run r.js, and optimise the project using the configuration in build.js'.

It will spit out a new file, `main-built.js`, containing all the JavaScript for our project. Try editing index.html:

```html
<!-- from this... -->
<script src='require.js' data-main='js/main.js'></script>

<!-- ...to this -->
<script src='require.js' data-main='main-built.js'></script>
```

Further reading
---------------

It's worth going through the [RequireJS documentation](http://requirejs.org/) - heavy reading, but it will help you understand how to tweak settings for your project.

I also recommend becoming familiar with [Grunt.js](http://gruntjs.com/), which can take a lot of the pain out of building your project - it has a [RequireJS plugin](https://github.com/gruntjs/grunt-contrib-requirejs).