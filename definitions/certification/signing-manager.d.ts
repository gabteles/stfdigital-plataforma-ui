declare namespace app.certification {
    import IPromise = angular.IPromise;
    import IQService = angular.IQService;
    class SigningManager {
        private $q;
        private cryptoService;
        private certificate;
        constructor($q: IQService, cryptoService: CryptoService);
        injectCertificate(resolvedObject: any): void;
        collectCertificate(cert: any): void;
        injectAlreadySelectedCertificate(): void;
        /**
         * Recupera o certificado já selecionado ou
         * pede o usuário para selecionar caso nenhum já tenha sido selecionado.
         *
         */
        recoverCertificate(): IPromise<Certificate>;
        createSigner(): Signer;
    }
}
