/**
 * User: Evgeny Reznichenko
 * Date: 25.06.13
 * Project: node-express-modules
 *
 */

var should = require('should'),
	lib = require('node-lib'),
	isUndef = lib.is.Undef,
	isArray = lib.is.Array;

exports.undef = function undef(props, mod) {
	var config = mod.config,
		app = mod.app;

	for (var i = 0, l = props.length; l > i; i += 1) {
		should.not.exist(config[props[i]]);
	}
};

exports.truly = function truly(obj, names) {
	if (!isArray(names)) names = [names];

	names.forEach(function(name) {
		it('should not exist "' + name + '"', function () {
			obj[name].should.equal(true);
		});
	});
};

exports.configEql = function configEql(mod, name, val) {
	it('should have module.config["' + name + '"] = "' + val + '"', function () {
		mod.config.should.have.property(name).obj.should.eql(val);
	});

	name = name.replace(/_/g, ' ');
	it('should have module.app.get("' + name + '") = "' + val + '"', function () {
		mod.app.get(name).should.be.eql(val);
	});
};

exports.notExist = function notExist(obj, names) {
	if (!isArray(names)) names = [names];

	names.forEach(function(name) {
		it('should not exist "' + name + '"', function () {
			should.not.exist(obj[name]);
		});
	});
};

exports.appConfigNotExist = function appConfigNotExist(app, names) {
	if (!isArray(names)) names = [names];

	names.forEach(function(name) {
		it('should not exist app.get("' + name + '")', function () {
			should.not.exist(app.get([name]));
		});
	});
};

exports.appConfigProp = function appConfigProp(app, name, val) {
	it('should have property app.get("' + name + '") = "' + val + '"', function () {
		app.get(name).should.equal(val);
	});
};

exports.haveProp = function haveProp(obj, name, val) {

	if (isUndef(val)) {
		it('should have property "' + name + '"', function () {
			obj.should.have.property(name);
		});
	} else {
		it('should have property "' + name + '" = "' + val + '"', function () {
			obj.should.have.property(name, val);
		});
	}
};

exports.havePropEql = function havePropEql(obj, name, val) {

	if (isUndef(val)) {
		it('should have property "' + name + '"', function () {
			obj.should.have.property(name);
		});
	} else {
		it('should have property "' + name + '" = "' + val + '"', function () {
			obj.should.have.property(name).obj.should.eql(val);
		});
	}
};