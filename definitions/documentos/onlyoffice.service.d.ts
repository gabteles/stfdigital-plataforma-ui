declare namespace app.documentos {
    import IHttpService = angular.IHttpService;
    import IQService = angular.IQService;
    import IPromise = angular.IPromise;
    class OnlyofficeService {
        private $http;
        private $q;
        private properties;
        private baseUrl;
        /** @ngInject **/
        constructor($http: IHttpService, $q: IQService, properties: any);
        private getBaseUrl();
        criarUrlConteudoDocumento(id: number): IPromise<string>;
        gerarNumeroEdicao(id: number): IPromise<any>;
        recuperarNumeroEdicao(id: number): IPromise<any>;
        recuperarUrlCallback(id: number): IPromise<string>;
        recuperarUrlArquivoApi(): IPromise<string>;
    }
}
