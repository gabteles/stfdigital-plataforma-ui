namespace app.novoProcesso {
	'use strict';

	import ITranslatePartialLoaderProvider = ng.translate.ITranslatePartialLoaderProvider;
	import IStateProvider = ng.ui.IStateProvider;
	import IPromise = ng.IPromise;
	
    /** @ngInject */
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
                processos : ['app.novo-processo.NovoProcessoService', '$futureState', 'commandService',
                        (novoProcessoService: NovoProcessoService, $futureState/** // TODO Encontrar typings */,
                        commandService: app.support.command.CommandService): ng.IPromise<IProcessoWorkflow[]> => {
                    commandService.loadCommands(); // Recarrega os commands, pois algum novo serviço pode ter se registrado.
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

    /** @ngInject */
    function run(stfBreadcrumbsService: app.core.StfBreadcrumbsService) {
        stfBreadcrumbsService.registerPath({
            id: 'novo-processo',
            translation: 'Iniciar Processo',
            uisref: 'app.novo-processo'
        });
    }

    angular
        .module('app.novo-processo', ['app.autenticado'])
        .config(config)
        .run(run);
}