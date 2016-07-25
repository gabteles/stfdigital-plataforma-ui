namespace app.novoProcesso {
	'use strict';

	import ITranslatePartialLoaderProvider = ng.translate.ITranslatePartialLoaderProvider;
	import IStateProvider = ng.ui.IStateProvider;
	import IPromise = ng.IPromise;
	
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
                processos : ['app.novo-processo.NovoProcessoService', '$futureState',
                    (novoProcessoService: NovoProcessoService, $futureState/** // TODO Encontrar typings */): ng.IPromise<IProcessoWorkflow[]> => {
                    return novoProcessoService.list().then((processos) => {
                        // Registra o future state que porventura não tenha sido já registrado.
                        for (let processo of processos) {
                            let route: any = processo.route;
                            if (route) {
                                route.type = 'load';
                                $futureState.futureState(route);
                            }
                        }
                        return processos;
                    });
                }]
            }
        });
    }

    angular
        .module('app.novo-processo', ['app.autenticado'])
        .config(config);
}