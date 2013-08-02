var fs = require('fs'),
	p = require('path'),
	lib = require('node-lib'),
	isUndef = lib.is.Undef,
	isArray = lib.is.Array,
	merge = lib.util.merge,
	deepMerge = lib.util.deepMerge,
	express = require('express');

module.exports = function loadControllers(mod, opt) {
	var verbose = opt && opt.verbose,
		controllers = null,
		controllersDir = p.resolve(mod.dir, 'controllers');

	if (!fs.existsSync(controllersDir)) return null;

	controllers = [];

	fs.readdirSync(controllersDir).forEach(function (dirName) {
		var dir = p.join(controllersDir, dirName),
			app = express(),
			con = require(dir),
			name = con.name || dirName,
			prefix = con.prefix || null,
			view_engine = con.view_engine || 'jade',
			views = p.resolve(dir, con.views || 'views'),
			before = con.before ? (isArray(con.before) ? con.before: [con.before]) : null,
			after = con.after ? (isArray(con.after) ? con.after: [con.after]) : null,
			locals = deepMerge({
				page: {
					title: name
				}
			}, mod.locals),
			config = {
				views: views,
				prefix: prefix,
				view_engine: view_engine
			},
			controller = {
				dir: dir,
				config: config,
				app: app,
				name: name,
				before: before,
				after: after,
				module: mod,
				locals: locals
			},
			method,
			path;


		if (con.locals) locals = deepMerge(locals, con.locals);

		//inheritance app.locals
		merge(app.locals, locals);

		controllers.push(controller);

		// allow specifying the view engine
		app.set('view engine', view_engine);
		app.set('views', views);

		// generate routes based
		// on the exported methods
		var actions = ['show', 'list', 'edit', 'update', 'add', 'create', 'index'];
		for (var i = 0, l = actions.length; l > i; i += 1) {
			var key = actions[i];
			if (!con[key]) continue;

			// route exports
			switch (key) {
				case 'show':
					method = 'get';
					path = '/' + name + '/:' + name + '_id';
					break;
				case 'list':
					method = 'get';
					path = '/' + name + 's';
					break;
				case 'edit':
					method = 'get';
					path = '/' + name + '/:' + name + '_id/edit';
					break;
				case 'update':
					method = 'put';
					path = '/' + name + '/:' + name + '_id';
					break;
				case 'add':
					method = 'get';
					path = '/' + name + '/add';
					break;
				case 'create':
					method = 'post';
					path = '/' + name;
					break;
				case 'index':
					method = 'get';
					path = ('index' === name) ? '/': '/' + name;
					break;
				default:
					throw new Error('unrecognized route: ' + name + '.' + key);
			}

			path = (prefix || '') + path;
			app[method](path, before || [], con[key], after || []);
			verbose && console.log('     %s %s -> %s', method.toUpperCase(), path, key);
		}

		// mount the app
		mod.app.use(app);
	});

	return controllers;
}