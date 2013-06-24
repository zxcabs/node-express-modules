/**
 * User: Evgeny Reznichenko
 * Date: 25.06.13
 * Project: node-express-modules
 *
 */


exports.name = 'mynews';
exports.views = 'myviews';
exports.before = function noop(req, res, next) { next(); };

exports.index = function index(req, res, next) {
	res.render('index');
};