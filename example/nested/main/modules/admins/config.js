/**
 * User: jo
 * Date: 13.06.13
 * Time: 16:26
 *
 */
var express = require('express');

exports.engine = 'jade';
exports.views = __dirname + '/views/';
exports.before = [
	function (req, res, next) {
		console.log('Admins!');
		next();
	},
	express.static(__dirname + '/public')
];