declare namespace app.certification {
    import IPromise = angular.IPromise;
    import IQService = angular.IQService;
    class SigningManager {
        private $q;
        private cryptoService;
        private signatureService;
        private maximumParallelSignatures;
        private certificateDeferred;
        private tokens;
        private availableParallelSignatures;
        constructor($q: IQService, cryptoService: CryptoService, signatureService: SignatureService, maximumParallelSignatures: number);
        /**
         * Recupera o certificado já selecionado ou
         * pede o usuário para selecionar caso nenhum já tenha sido selecionado.
         *
         */
        recoverCertificate(): IPromise<Certificate>;
        signingFinished(): void;
        createSigner(): Signer;
    }
}
