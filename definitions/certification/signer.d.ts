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
