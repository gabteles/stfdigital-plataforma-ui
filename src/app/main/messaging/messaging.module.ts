namespace app.messaging {
	'use strict';
	
	import IThemingProvider = angular.material.IThemingProvider;
	
	/** ngInject **/
	function config($mdThemingProvider: IThemingProvider) {
        $mdThemingProvider.theme('error-toast');
        $mdThemingProvider.theme('success-toast');
	}
	
	angular.module('app.messaging', ['ngMaterial']).config(config);
}