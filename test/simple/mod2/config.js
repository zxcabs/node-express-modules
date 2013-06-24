/**
 * User: Evgeny Reznichenko
 * Date: 25.06.13
 * Project: node-express-modules
 *
 */

exports.name = 'supermod';
exports.before = function noop(req, res, next) { next(); };
exports.after = [function noop(req, res, next) { next(); }];
exports.trust_proxy = true;
exports.json_spaces = 4;
exports.view_cache = true;
exports.strict_routing = true;
exports.case_sensitive_routing = true;
exports.jsonp_callback_name = 'cbjsonp';
exports.view_engine = 'ejs';
exports.views = __dirname + '/vvv';