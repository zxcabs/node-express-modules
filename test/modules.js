/**
 * User: Evgeny Reznichenko
 * Date: 24.06.13
 * Project: node-express-modules
 *
 */

var express = require('express'),
	should = require('should'),
	modules = require('../lib'),
	path = require('path'),
	common = require('./common');

/**
 * Test for modules
 */
describe('modules', function () {
	/**
	 * Test for load module
	 */
	describe('load module', function () {
		/**
		 * Test for module with default config
		 */
		describe('with default config', function () {
			var mdir = __dirname + '/simple/mod1',
				modul = modules(mdir);

			common.haveProp(modul, 'name', 'mod1');
			common.haveProp(modul, 'dir', mdir);
			common.haveProp(modul, 'app');
			common.haveProp(modul, 'before', null);
			common.haveProp(modul, 'after', null);
			common.haveProp(modul, 'root', modul);
			common.haveProp(modul, 'isRoot', true);
			common.haveProp(modul, 'parent', null);
			common.haveProp(modul, 'controllers', null);
			common.haveProp(modul, 'submodules', null);
			common.haveProp(modul, 'config');

			/**
			 * Test for module.config
			 */
			describe('module.config', function () {
				var config = modul.config;
				common.haveProp(config, 'jsonp_callback_name', 'callback');
				common.haveProp(config, 'view_engine', 'jade');
				common.haveProp(config, 'views', path.resolve(__dirname + '/simple/mod1/views'));
				common.notExist(config, ['trust_proxy', 'json_spaces', 'json_replacer', 'view_cache',
											'strict_routing', 'case_sensitive_routing'])
			});

			/**
			 * Test for module.app.get()
			 */
			describe('module.app.get()', function () {
				var app = modul.app;
				common.appConfigNotExist(app, ['trust proxy', 'json spaces', 'json replacer', 'view cache',
					'strict routing', 'case sensitive routing']);
			});
		});

		/**
		 * Test for with config
		 */
		describe('with config', function () {
			var mdir = __dirname + '/simple/mod2',
				modul = modules(mdir),
				c = require(mdir + '/config');

			common.haveProp(modul, 'name', c.name);
			common.haveProp(modul, 'dir', mdir);
			common.haveProp(modul, 'app');
			common.havePropEql(modul, 'before', [c.before]);
			common.haveProp(modul, 'after', c.after);
			common.haveProp(modul, 'root', modul);
			common.haveProp(modul, 'isRoot', true);
			common.haveProp(modul, 'parent', null);
			common.haveProp(modul, 'controllers', null);
			common.haveProp(modul, 'submodules', null);
			common.haveProp(modul, 'config');

			/**
			 * Test for module.config
			 */
			describe('module.config', function () {
				var config = modul.config;
				common.notExist(config, 'json_replacer');

				common.haveProp(config, 'views', path.resolve(modul.dir, c.views));
				common.haveProp(config, 'jsonp_callback_name', c.jsonp_callback_name);
				common.haveProp(config, 'view_engine', c.view_engine);
				common.haveProp(config, 'trust_proxy', c.trust_proxy);
				common.haveProp(config, 'json_spaces', c.json_spaces);
				common.haveProp(config, 'view_cache', c.view_cache);
				common.haveProp(config, 'strict_routing', c.strict_routing);
				common.haveProp(config, 'case_sensitive_routing', c.case_sensitive_routing);
			});

			/**
			 * Test for module.app.get()
			 */
			describe('module.app.get()', function () {
				var app = modul.app;

				common.appConfigNotExist(app, 'json replacer');
				common.appConfigProp(app, 'views', path.resolve(modul.dir, c.views));
				common.appConfigProp(app, 'jsonp callback name', c.jsonp_callback_name);
				common.appConfigProp(app, 'view engine', c.view_engine);
                common.appConfigProp(app, 'trust proxy', c.trust_proxy);
				common.appConfigProp(app, 'json spaces', c.json_spaces);
				common.appConfigProp(app, 'view cache', c.view_cache);
				common.appConfigProp(app, 'strict routing', c.strict_routing);
				common.appConfigProp(app, 'case sensitive routing', c.case_sensitive_routing);
			});
		});

		/**
		 * Test for load controller
		 */
		describe('load controller', function () {
			var mdir = __dirname + '/simple/mod3',
				modul = modules(mdir);

			common.haveProp(modul, 'controllers');
			modul.controllers.should.lengthOf(2);
		});

		/**
		 * Test for verbose true
		 */
		describe('verbose true', function () {
			it('should be ok', function () {
				modules(__dirname + '/simple/mod3', { verbose: true });
			});
		});
	});
});