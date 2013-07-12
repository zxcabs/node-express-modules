/**
 * User: Evgeny Reznichenko
 * Date: 12.07.13
 * Project: node-express-modules
 *
 */

var program = require('commander');

var ACTIONS = ['index', 'show', 'create', 'list', 'update'];

function list(str) {
	return str.split(',');
}

program
	.command('controller [params]')
	.description('run setup commands for all envs')
	.option('-c, --create', 'Create flag')
	.option('-n, --name [name]', 'Controller [name]')
	.option('-m, --module_dir [dir]', 'Module dir')
	.option('-a, --actions [actions]', 'Controller actions', list, ACTIONS.join(','))
	.action(function(env, options){
		if (!options.create) return console.error('nothing do');

		var outoptions = ['name', 'actions', 'module_dir'].;

	});