declare namespace app.pesquisaAvancada {
    import Properties = app.support.constants.Properties;
    class PesquisaAvancadaService {
        private $http;
        private msNavigationService;
        private properties;
        private static apiPesquisas;
        /** @ngInject **/
        constructor($http: ng.IHttpService, msNavigationService: any, properties: Properties);
        load(): void;
        private addRouteToNavigation(pesquisa);
    }
}
