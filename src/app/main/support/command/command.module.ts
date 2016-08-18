namespace app.support.command {
	'use strict';
	
	/** @ngInject **/
    function run(commandService: CommandService) {
    	commandService.loadCommands();
    }
	
	angular
	   .module('app.support.command', ['ngMaterial', 'app.support.constants'])
	   .run(run);
}