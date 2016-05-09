namespace app.novoProcesso {
	'use strict';

	import ITranslatePartialLoaderProvider = angular.translate.ITranslatePartialLoaderProvider;
	import IStateProvider = angular.ui.IStateProvider;
	import IPromise = angular.IPromise;
	
    /** @ngInject * */
    function config($translatePartialLoaderProvider: ITranslatePartialLoaderProvider,
                    $stateProvider: IStateProvider) {

        $translatePartialLoaderProvider.addPart('app/main/novo-processo');
        
        $stateProvider.state('app.novo-processo', {
            parent : 'app.autenticado',
            url : '/novo-processo',
            views : {
                'content@app.autenticado' : {
                    templateUrl : 'app/main/novo-processo/novo-processo.html',
                    controller : NovoProcessoController,
                    controllerAs : 'vm'
                }
            },
            resolve : {
                processos : ['app.novo-processo.NovoProcessoService',
                    (novoProcessoService: NovoProcessoService): IPromise<IProcessoWorkflow[]> => {
                    return novoProcessoService.list();
                }]
            }
        });
    }

    angular
        .module('app.novo-processo', ['app.autenticado'])
        .config(config);
}