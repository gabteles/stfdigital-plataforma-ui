declare namespace app.certification {
    import IHttpService = angular.IHttpService;
    class SignatureService {
        constructor(properties: any, $http: IHttpService, crypto: CryptoService);
        signingManager(): SigningManager;
    }
}
