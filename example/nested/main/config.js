/**
 * User: jo
 * Date: 13.06.13
 * Time: 16:26
 *
 */
var express = require('express');

exports.engine = 'jade';
exports.views = __dirname + '/views';
exports.strict_routing = true;

exports.before = [
	express.logger('dev'),
	express.static(__dirname + '/public'),
	express.cookieParser('some secret here'),
	express.session(),
	express.bodyParser(),
	express.methodOverride()
];

exports.after = [
	function catchError(err, req, res, next) {
		// treat as 404
		if (~err.message.indexOf('not found')) return next();

		// log it
		console.error(err.stack);

		// error page
		res.status(500).render('500');
	},
	function error404(req, res, next){
		res.status(404).render('404', { url: req.originalUrl });
	}
];