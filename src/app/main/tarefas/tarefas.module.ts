namespace app.tarefas {
    'use strict';
    
    import ITranslatePartialLoaderProvider = angular.translate.ITranslatePartialLoaderProvider;
    import IStateProvider = angular.ui.IStateProvider;

    /** @ngInject * */
    function config($translatePartialLoaderProvider: ITranslatePartialLoaderProvider,
                    $stateProvider: IStateProvider,
                    msNavigationServiceProvider: any) {
        $translatePartialLoaderProvider.addPart('app/main/tarefas');
        $stateProvider.state('app.tarefas', {
            abstract: true,
            url: '/tarefas',
            parent: 'app.autenticado'
        });

        // Navigation
        msNavigationServiceProvider.saveItem('tarefas', {
            title: 'TAREFAS',
            translation: 'TAREFAS.TAREFAS',
            group: true,
            weight: 1
        });
    }

    /** @ngInject */
    function run(stfBreadcrumbsService: app.core.StfBreadcrumbsService) {
        stfBreadcrumbsService.registerPath({
            id: 'tarefas',
            translation: 'Tarefas',
            uisref: 'app.tarefas.minhas-tarefas'
        });
    }

    angular
        .module('app.tarefas', ['app.autenticado', 'app.support'])
        .config(config)
        .run(run);
}