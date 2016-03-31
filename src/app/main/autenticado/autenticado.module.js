(function() {
	'use strict';

	angular
		.module('app.autenticado', ['classy'])
		.config(config);

	/** @ngInject **/
	function config($translatePartialLoaderProvider, $stateProvider, $translateProvider, msNavigationServiceProvider) {
		$translatePartialLoaderProvider.addPart('app/main/autenticado');
		
		$stateProvider
			.state('app.autenticado', {
				abstract: true,
				views: {
					'main@': {
	                    templateUrl: 'app/core/layouts/vertical-navigation.html',
	                    controller : 'MainController',
	                    controllerAs: 'vm'
	                },
					'toolbar@app.autenticado'   : {
                        templateUrl: 'app/toolbar/toolbar.html',
                        controller : 'ToolbarController',
                        controllerAs: 'vm'
                    },
                    'navigation@app.autenticado': {
                        templateUrl: 'app/navigation/navigation.html',
                        controller : 'NavigationController',
                        controllerAs: 'vm'
                    },
				}
			});
	}
})();