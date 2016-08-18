namespace app.pesquisaAvancada {
    'use strict';
    
    import ITranslatePartialLoaderProvider = angular.translate.ITranslatePartialLoaderProvider;
    import IStateProvider = angular.ui.IStateProvider;

    /** @ngInject **/
    function config($translatePartialLoaderProvider: ITranslatePartialLoaderProvider,
                    $stateProvider: IStateProvider,
                    msNavigationServiceProvider,
                    properties) {

        $translatePartialLoaderProvider.addPart('app/main/pesquisa-avancada');

        $stateProvider.state('app.pesquisa-avancada', {
        	parent : 'app.autenticado',
            url: '/pesquisa-avancada',
            abstract: true
        });

        msNavigationServiceProvider.saveItem('pesquisa-avancada', {
            title : 'PESQUISA AVANÇADA',
            group : true,
            translation : 'PESQUISA-AVANCADA.PESQUISA-AVANCADA',
            weight : 1
        });
    }
    
    function run(pesquisaAvancadaService: PesquisaAvancadaService) {
    	pesquisaAvancadaService.loadQueries();
    }
    run.$inject = ['app.pesquisa-avancada.PesquisaAvancadaService'];

    angular
        .module('app.pesquisa-avancada', ['app.autenticado', 'app.support'])
        .config(config)
        .run(run);
}