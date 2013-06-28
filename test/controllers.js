/**
 * User: Evgeny Reznichenko
 * Date: 24.06.13
 * Project: node-express-modules
 *
 */

var p = require('path'),
	should = require('should'),
	modules = require('../lib'),
	common = require('./common');

/**
 * Test for controllers
 */
describe('controllers', function () {
	/**
	 * Test for load controller
	 */
	describe('load controller', function () {
		var mdir = __dirname +  '/simple/mod3',
			mod = modules(mdir);

		/**
		 * Test for with default config
		 */
		describe('with default config', function () {
		 	var index = mod.controllers[0];

			common.haveProp(index, 'name', 'index');
			common.haveProp(index, 'dir', p.join(mod.dir, 'controllers', 'index'));
			common.haveProp(index, 'app');
			common.haveProp(index, 'before', null);
			common.haveProp(index, 'module', mod);
			common.haveProp(index, 'config');

			/**
			 * Test for controller.config
			 */
			describe('controller.config', function () {
				var config = index.config;

				common.haveProp(config, 'views', p.resolve(index.dir, 'views'));
				common.haveProp(config, 'prefix', null);
				common.haveProp(config, 'view_engine', 'jade');
			});

			/**
			 * Test for controller.app.get()
			 */
			describe('controller.app.get()', function () {
				var app = index.app;

				common.appConfigProp(app, 'views', p.resolve(index.dir, 'views'));
				common.appConfigProp(app, 'view engine', 'jade');
			});
		});

		/**
		 * Test for with default config
		 */
		describe('with default config', function () {
			var news = mod.controllers[1],
				c = require(news.dir);

			common.haveProp(news, 'name', c.name);
			common.haveProp(news, 'dir', p.join(mod.dir, 'controllers', 'news'));
			common.haveProp(news, 'app');
			common.havePropEql(news, 'before', [c.before]);
			common.haveProp(news, 'module', mod);
			common.haveProp(news, 'config');

			/**
			 * Test for controller.config
			 */
			describe('controller.config', function () {
				var config = news.config;

				common.haveProp(config, 'views', p.resolve(news.dir, c.views));
				common.haveProp(config, 'prefix', null);
				common.haveProp(config, 'view_engine', 'jade');
			});

			/**
			 * Test for controller.app.get()
			 */
			describe('controller.app.get()', function () {
				var app = news.app;

				common.appConfigProp(app, 'views', p.resolve(news.dir, c.views));
				common.appConfigProp(app, 'view engine', 'jade');
			});
		});

		/**
		 * Test for inheritance value module.app.locals
		 */
		describe('inheritance value module.app.locals', function () {
			var con = mod.controllers[0],
				modLocals = mod.app.locals,
				conLocals = con.app.locals;

			for (var name in modLocals) {
				common.haveProp(conLocals, name, modLocals[name]);
			}
		});
	});
});