# rv.js sample application

This is a very simple app to demonstrate the use of RequireJS and the use of the Ractive.js loader plugin (`rv.js`).

Start at `src/index.html` and read the comments to understand how everything fits together.

## Prerequisites

Make sure you have [node.js](http://nodejs.org/) installed, then install RequireJS:

```bash
npm install -g requirejs    # the -g makes it globally available via the command line
```

To view the sample app, you'll need to fire up a webserver. I recommend installing `http-server` for node:

```bash
npm install -g http-server
http-server src -p 8000  # this assumes you're in the sample/ folder
```

Once the server is up and running, navigate to [localhost:8000](http://localhost:8000).


## Optimising the app

Loader plugins come into their own when you use the [RequireJS optimizer](http://requirejs.org/docs/optimization.html) to bundle your application into a single file. In our case, the rv.js file will take a template and parse it, so that rather than including a whole load of HTML, your bundle contains the result of calling `Ractive.parse()` on that HTML. Doing this means that each user's browser doesn't have to parse the template - it can skip ahead to rendering it.

Run the build script:

```bash
sh ./build.sh
```

This will create an optimised version of the app - with Ractive, the template, and the app itself bundled into a single file - in the `dist` folder.

```bash
http-server dist -p 8001
```

Navigate to [localhost:8001](http://localhost:8001) to see the end product.


Further reading
---------------

It's worth going through the [RequireJS documentation](http://requirejs.org/) - heavy reading, but it will help you understand how to tweak settings for your project.

I also recommend becoming familiar with [Grunt.js](http://gruntjs.com/), which can take a lot of the pain out of building your project - it has a [RequireJS plugin](https://github.com/gruntjs/grunt-contrib-requirejs).
