namespace app.certification {

	import IQService = angular.IQService;
	import IPromise = angular.IPromise;
	import IDeferred = angular.IDeferred;

	interface PreSignatureDto {
		data: string;
		hash: string;
		hashType: string;
	}

	export class ProgressTracker {
		private finishedSteps: number = 0;
		private totalSteps: number = 0;

		incrementTotalSteps() {
			this.totalSteps++;
		}

		incrementFinishedSteps() {
			this.finishedSteps++;
		}

		currentProgress() {
			return this.currentProgressOfTotal(100);
		}

		currentProgressOfTotal(totalProgress: number) {
			return (this.finishedSteps / this.totalSteps) * totalProgress;
		}

		public getTotalSteps(): number {
			return this.totalSteps;
		}
	}

	/**
	 * Representa uma cadeia de passos a serem executados
	 * sequencialmente, encapsulando a passagem de um dado
	 * para o próximo passo como resultado do passo atual.
	 */
	export class StepsChain<S> {

		private data: IPromise<S>;

		constructor(private $q: IQService, private progressTracker: ProgressTracker, data: IPromise<S>) {
			this.data = $q.when(data);
		}

		chain<T>(func: (param: S) => IPromise<T>): StepsChain<T> {
			this.progressTracker.incrementTotalSteps();
			let promise = this.$q((resolve, reject) => {
				this.data.then((dataObj) => {
					func(dataObj).then((obj) => {
						this.progressTracker.incrementFinishedSteps();
						resolve(obj);
					}, (error) => {
						reject(error);
					});
				}, () => {

				});
				
			});
			return new StepsChain<T>(this.$q, this.progressTracker, promise);
		}

		promise(): IPromise<S> {
			return this.data;
		}

	}

	export class Signer {

		/**
		 * Permite o acompanhamento do progresso do processo
		 * de assinatura.
		 */
		private progressTracker: ProgressTracker;

		/**
		 * Callbacks possivelmente registrados.
		 */
		private signerCreatedCallback: (SignerDto) => void;
		private signingCompletedCallback: () => void;
		private errorCallback: (SigningError) => void;

		private certificate: Certificate;
		private signer: SignerDto;

		/**
		 * Este deferred é utilizado para bloquear a execução
		 * da cadeia de chamadas para a assinatura enquanto o
		 * upload do documento não terminar. A responsabilidade
		 * desse upload é do cliente desta classe. 
		 */
		private documentUploadDeferred: IDeferred<SignerDto>;

		constructor(private manager: SigningManager, private cryptoService: CryptoService,
			private signatureService: SignatureService, private $q: IQService) {

		}

		/**
		 * Registra um callback a ser chamado quando o signer do
		 * backend estiver pronto para a assinatura.
		 */
		onSignerReady(callback: (SignerDto) => void) {
			this.signerCreatedCallback = callback;
		}

		/**
		 * Registra um callback a ser chamado quando o processo de
		 * assinatura tiver sido completado.
		 */
		onSigningCompleted(callback: () => void) {
			this.signingCompletedCallback = callback;
		}

		/**
		 * Registra um callback a ser chamado quando ocorrer algum
		 * erro durante o processo de assinatura.
		 */
		onErrorCallback(callback: (SigningError) => void) {
			this.errorCallback = callback;
		}

		saveSignedDocument(): IPromise<SignedDocumentDto> {
			return this.signatureService.save(this.signer.signerId);
		}

		/**
		 * Inicia a cadeia de chamadas para efetuar a assinatura. Esses passos
		 * envolvem operações tanto no cliente, quanto no servidor, que precisam
		 * ser executados em ordem para gerar um documento assinado com sucesso.
		 */
		start() {
			this.progressTracker = new ProgressTracker();
			this.cryptoService.use('auto').then((status) => {
				let sc = new StepsChain<void>(this.$q, this.progressTracker, null);
				sc.chain(() => this.requestUserCertificate())
					.chain((certificate: Certificate) => this.storeCertificate(certificate))
					.chain((certificate: Certificate) => this.prepare(certificate))
					.chain((signer: SignerDto) => this.storeSigner(signer))
					.chain((signer) => this.callSignerReadyCallback(signer))
					// A chamada acima bloqueará o encadeamento até que o upload seja concluído.
					.chain((signer) => this.preSign(signer))
					.chain((preSignature) => this.sign(preSignature))
					.chain((signature) => this.postSign(signature))
					.chain(() => this.callSigningCompletedCallback())
					.promise()
					.catch((error) => {
						if (error.message == 'no_implementation') {
							this.callErrorCallback("O plugin de assinatura não foi encontrado.");
						} else {
							this.callErrorCallback(error);
						}
					});
			}, (error) => {
				this.callErrorCallback("O plugin de assinatura não foi encontrado.");
			});
		}

		private requestUserCertificate(): IPromise<Certificate> {
			return this.manager.recoverCertificate();
		}

		private storeCertificate(certificate: Certificate): IPromise<Certificate> {
			this.certificate = certificate;
			return this.$q.when(certificate);
		}

		private storeSigner(signer: SignerDto): IPromise<SignerDto> {
			this.signer = signer;
			return this.$q.when(signer);
		}

		private prepare(certificate: Certificate): IPromise<SignerDto> {
			let command = new PrepareCommand(certificate.hex);
			return this.signatureService.prepare(command);
		}

		/**
		 * Chama o callback cadastrado quando o signer já tiver
		 * sido preparado no backend.
		 */
		private callSignerReadyCallback(signer: SignerDto): IPromise<SignerDto> {
			this.documentUploadDeferred = this.$q.defer<SignerDto>();
			if (this.signerCreatedCallback) {
				this.signerCreatedCallback(signer);
			} else {
				this.documentUploadDeferred.reject(new SigningError('Callback SignerCreated não definido.'));
			}
			return this.documentUploadDeferred.promise;
		}

		private preSign(signer: SignerDto): IPromise<PreSignatureDto> {
			let command = new PreSignCommand(signer.signerId);
			return this.signatureService.preSign(command);
		}

		private sign(preSignature: PreSignatureDto): IPromise<Signature> {
			return this.$q((resolve, reject) => {
				this.cryptoService.sign(this.certificate,
					{
						data: preSignature.data,
						type: 'SHA-256',
						hex: preSignature.hash
					},
					{
						lang: 'en'
					}
				).then((signature) => {
					return signature;
				});
			});
		}

		private postSign(signature: Signature): IPromise<void> {
			let command = new PostSignCommand(this.signer.signerId, signature.hex);
			return this.signatureService.postSign(command);
		}

		private callSigningCompletedCallback(): IPromise<void> {
			if (this.signingCompletedCallback) {
				this.signingCompletedCallback();
			}
			return this.$q.when();
		}

		private callErrorCallback(error: string): void {
			if (this.errorCallback) {
				this.errorCallback(new SigningError(error));
			}
		}

	}

}