declare namespace app.pesquisaAvancada {
    import IHttpService = angular.IHttpService;
    class PesquisaAvancadaService {
        private $http;
        private msNavigationService;
        private properties;
        private static apiPesquisas;
        /** @ngInject **/
        constructor($http: IHttpService, msNavigationService: any, properties: any);
        load(): void;
        private list();
    }
}
