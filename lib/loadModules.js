/**
 * User: jo
 * Date: 14.06.13
 * Time: 17:27
 *
 */

var fs = require('fs'),
	p = require('path'),
	u = require('url'),
	lib = require('node-lib'),
	isUndef = lib.is.Undef,
	isArray = lib.is.Array,
	express = require('express'),
	merge = require('./util').merge,
	loadControllers = require('./loadControllers');

function getParentsName(mod, name) {
	var names = [];

	while (mod && !mod.isRoot) {
		names.push(mod.name);
		mod = mod.parent;
	}

	names.push(name);

	return names;
}

function strictSubmoduleMiddleware (module, subname) {
	var absolute = '/' + getParentsName(module, subname).join('/') + '/';

	return function strictSubmoduleMiddleware(req, res, next) {
		req._parsedUrl.pathname = absolute;
		res.redirect(301, u.format(req._parsedUrl));
	};
}

function getVal(name) {
	for (var i = 1, l = arguments.length; l > i; i += 1) {
	    if (arguments[i] && !isUndef(arguments[i][name])) return arguments[i][name];
	}
}

module.exports = function loadModule(modpath, opt, parent) {

	var verbose = opt.verbose,
		config = {},
		pconfig = parent && parent.config,
		mod = { config: config },
		app = express(),
		conf;

	verbose && console.log('\n load module: %s', modpath);

	//default options
	mod.dir = p.resolve(modpath);
	conf = require(p.join(mod.dir, 'config'));
	mod.app = app;
	mod.parent = parent;
	mod.name = conf.name || p.basename(mod.dir);
    mod.isRoot = !parent;
	mod.root = mod.isRoot ? mod: parent.root;
	mod.parent = parent || null;
	mod.controllers = null;
	mod.submodules = null;
	mod.before = conf.before ? (isArray(conf.before) ? conf.before: [conf.before]) : null;
	mod.after = conf.after ? (isArray(conf.after) ? conf.after: [conf.after]) : null;

	config.trust_proxy = getVal('trust_proxy', conf, pconfig) || app.get('trust proxy');
	config.jsonp_callback_name = getVal('jsonp_callback_name', conf, pconfig) || app.get('jsonp callback name');
	config.json_replacer = getVal('json_replacer', conf, pconfig) || app.get('json replacer');
	config.json_spaces = getVal('json_spaces', conf, pconfig) || app.get('json spaces');
	config.case_sensitive_routing = getVal('case_sensitive_routing', conf, pconfig) || app.get('case sensitive routing');
	config.strict_routing = getVal('strict_routing', conf, pconfig) || app.get('strict routing');
	config.view_cache = getVal('view_cache', conf, pconfig) || app.get('view cache');
	config.view_engine = getVal('view_engine', conf, pconfig) || 'jade';
	config.views = p.resolve(mod.dir, conf.views || 'views');

	app.set('trust proxy', config.trust_proxy);
	app.set('jsonp callback name', config.jsonp_callback_name);
	app.set('json replacer', config.json_replacer);
	app.set('json spaces', config.json_spaces);
	app.set('case sensitive routing', config.case_sensitive_routing);
	app.set('strict routing', config.strict_routing);
	app.set('view cache', config.view_cache);
	app.set('view engine', config.view_engine);
	app.set('views', config.views);

	if (mod.before) mod.before.forEach(function (fn) {
		app.use(fn);
	});

	//loadControllers
	mod.controllers = loadControllers(mod, opt);


	submoddir = p.join(mod.dir, 'modules');
	//load submodule
	if (fs.existsSync(submoddir)) {
		fs.readdirSync(submoddir).forEach(function (subname) {
			//redirect
			if (strictRouting) app.all('/' + subname, strictSubmoduleMiddleware(mod, subname));
			if (!mod.submodules)  mod.submodules = [];

			var sm = loadModule(subname, opt, mod);
			mod.submodules.push(sm);
			app.use('/' + subname + '/', sm.app);
		});
	}

	if (mod.after) mod.after.forEach(function (fn) {
		app.use(fn);
	});

	return mod;
}
