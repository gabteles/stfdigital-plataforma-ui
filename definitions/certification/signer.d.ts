declare namespace app.certification {
    import IQService = angular.IQService;
    import IPromise = angular.IPromise;
    class ProgressTracker {
        private finishedSteps;
        private totalSteps;
        incrementTotalSteps(): void;
        incrementFinishedSteps(): void;
        currentProgress(): number;
        currentProgressOfTotal(totalProgress: number): number;
        getTotalSteps(): number;
    }
    /**
     * Representa uma cadeia de passos a serem executados
     * sequencialmente, encapsulando a passagem de um dado
     * para o próximo passo como resultado do passo atual.
     */
    class StepsChain<S> {
        private $q;
        private progressTracker;
        private data;
        constructor($q: IQService, progressTracker: ProgressTracker, data: IPromise<S>);
        chain<T>(func: (param: S) => IPromise<T>): StepsChain<T>;
        promise(): IPromise<S>;
    }
    class Signer {
        private manager;
        private cryptoService;
        private signatureService;
        private $q;
        /**
         * Permite o acompanhamento do progresso do processo
         * de assinatura.
         */
        private progressTracker;
        /**
         * Callbacks possivelmente registrados.
         */
        private signerCreatedCallback;
        private signingCompletedCallback;
        private errorCallback;
        private certificate;
        private signer;
        /**
         * Este deferred é utilizado para bloquear a execução
         * da cadeia de chamadas para a assinatura enquanto o
         * upload do documento não terminar. A responsabilidade
         * desse upload é do cliente desta classe.
         */
        private documentUploadDeferred;
        constructor(manager: SigningManager, cryptoService: CryptoService, signatureService: SignatureService, $q: IQService);
        /**
         * Registra um callback a ser chamado quando o signer do
         * backend estiver pronto para a assinatura.
         */
        onSignerReady(callback: (SignerDto) => void): void;
        /**
         * Registra um callback a ser chamado quando o processo de
         * assinatura tiver sido completado.
         */
        onSigningCompleted(callback: () => void): void;
        /**
         * Registra um callback a ser chamado quando ocorrer algum
         * erro durante o processo de assinatura.
         */
        onErrorCallback(callback: (SigningError) => void): void;
        saveSignedDocument(): IPromise<SignedDocumentDto>;
        provideExistingDocument(documentId: number): void;
        getProgressTracker(): ProgressTracker;
        triggerDocumentProvided(): void;
        /**
         * Inicia a cadeia de chamadas para efetuar a assinatura. Esses passos
         * envolvem operações tanto no cliente, quanto no servidor, que precisam
         * ser executados em ordem para gerar um documento assinado com sucesso.
         */
        start(): void;
        private requestUserCertificate();
        private storeCertificate(certificate);
        private storeSigner(signer);
        private prepare(certificate);
        /**
         * Chama o callback cadastrado quando o signer já tiver
         * sido preparado no backend.
         */
        private callSignerReadyCallback(signer);
        private preSign(signer);
        private sign(preSignature);
        private postSign(signature);
        private callSigningCompletedCallback();
        private callErrorCallback(error);
    }
}
