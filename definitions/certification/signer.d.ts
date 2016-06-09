declare namespace app.certification {
    import IQService = angular.IQService;
    class Signer {
        private manager;
        private cryptoService;
        private $q;
        private progressTracker;
        constructor(manager: SigningManager, cryptoService: CryptoService, $q: IQService);
        start(): void;
        private requestUserCertificate();
        private prepare(certificate);
        private callSignerReadyCallback(signer);
        private preSign(signer);
        private sign(preSignature);
        private postSign(signature);
        private callSigningCompletedCallback();
    }
}
