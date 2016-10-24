namespace app.autenticacao {
	'use strict';
	
	import IStateProvider = angular.ui.IStateProvider;
	import ITranslatePartialLoaderProvider = angular.translate.ITranslatePartialLoaderProvider;

	/** @ngInject **/
	function config($translatePartialLoaderProvider: ITranslatePartialLoaderProvider,
					$stateProvider: IStateProvider) {
		$translatePartialLoaderProvider.addPart('app/main/autenticacao/nao-autenticado');

		$stateProvider
			.state('app.nao-autenticado', {
				abstract: true,
				views: {
					'main@': {
						templateUrl: 'app/core/layouts/content-only.html',
						controller : MainController,
						controllerAs: 'vm'
					},
					'content@app.nao-autenticado': {
						templateUrl: 'app/main/autenticacao/nao-autenticado/nao-autenticado.html'
					}
				}
			});
	}

	angular
		.module('app.nao-autenticado', ['app.autenticacao'])
		.config(config);
}