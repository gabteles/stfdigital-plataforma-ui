declare namespace app.pesquisaAvancada {
    import Properties = app.support.constants.Properties;
    class PesquisaAvancadaService {
        private $http;
        private msNavigationService;
        private properties;
        private $q;
        private static apiPesquisas;
        /** @ngInject **/
        constructor($http: ng.IHttpService, msNavigationService: any, $rootScope: ng.IRootScopeService, properties: Properties, $q: any);
        loadQueries(): void;
        resetQueries(): void;
        executeSearch(searchApi: string, search: ISearch): ng.IPromise<Array<any>>;
        saveSearch(search: ISearch): ng.IPromise<ISearch>;
        deleteSearch(id: number): ng.IPromise<any>;
        loadSavedSearchs(context: string): ng.IPromise<ISearch[]>;
        private addRouteToNavigation(pesquisa);
    }
}
