declare namespace app.documentos {
    import IHttpService = angular.IHttpService;
    import IQService = angular.IQService;
    import IPromise = angular.IPromise;
    import ICookies = angular.cookies.ICookiesService;
    class OnlyofficeService {
        private $http;
        private $q;
        private properties;
        private $cookies;
        private baseUrl;
        /** @ngInject **/
        constructor($http: IHttpService, $q: IQService, properties: app.support.constants.Properties, $cookies: ICookies);
        private getBaseUrl();
        private accessToken();
        private accessTokenParam();
        private csrfParam();
        criarUrlConteudoDocumento(id: number): IPromise<string>;
        gerarNumeroEdicao(id: number): IPromise<any>;
        recuperarNumeroEdicao(id: number): IPromise<any>;
        recuperarUrlCallback(id: number): IPromise<string>;
        recuperarUrlArquivoApi(): IPromise<string>;
    }
}
