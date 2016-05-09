namespace app.ultimosAcessos {
	'use strict';
    import ITranslatePartialLoaderProvider = angular.translate.ITranslatePartialLoaderProvider;
    import IStateProvider = angular.ui.IStateProvider;

	/** @ngInject **/
	function config($translatePartialLoaderProvider: ITranslatePartialLoaderProvider,
                    $stateProvider: IStateProvider,
                    msNavigationServiceProvider) {

		$translatePartialLoaderProvider.addPart('app/main/ultimos-acessos');

		$stateProvider
			.state('app.ultimos-acessos', {
                url: '/ultimos-acessos',
				views: {
					'content@app.autenticado': {
						templateUrl: 'app/main/ultimos-acessos/ultimos-acessos.html',
                        controller: UltimosAcessosController,
                        controllerAs: 'vm'
					}
				},
                resolve: {
                    ultimosAcessos : ['app.ultimos-acessos.UltimosAcessosService', (ultimosAcessosService: UltimosAcessosService) => {
                        return ultimosAcessosService.acessos();
                    }]
                }
			})
            .state('app.ultimos-acessos.todos', {
                url: '/todos'
            })
            .state('app.ultimos-acessos.peticoes', {
                url: '/peticoes'
            })
            .state('app.ultimos-acessos.processos', {
                url: '/processos'
            })
            .state('app.ultimos-acessos.pecas', {
                url: '/pecas'
            });

        msNavigationServiceProvider.saveItem('ultimos-acessos', {
            title      : 'Últimos Acessos',
            icon       : 'icon-history',
            state      : 'app.ultimos-acessos',
            translation: 'ULTIMOS-ACESSOS.ULTIMOS-ACESSOS',
            weight     : 1
        });
	}

    angular
        .module('app.ultimos-acessos', ['app.autenticado'])
        .config(config);
}
