namespace app.certification {

	import IQService = angular.IQService;
	import IPromise = angular.IPromise;

	interface SignerDto {
		signerId: string;
	}

	interface PreSignatureDto {
		data: string;
		hash: string;
		hashType: string;
	}

	class Signature {
		signature: string;
	}

	class ProgressTracker {
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
	}

	class StepsChain<S> {

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

		private progressTracker: ProgressTracker;

		constructor(private manager: SigningManager, private cryptoService: CryptoService, private $q: IQService) {

		}

		start() {
			this.progressTracker = new ProgressTracker();
			this.cryptoService.use('auto').then((status) => {
				let sc = new StepsChain<void>(this.$q, this.progressTracker, null);
				sc.chain(() => this.requestUserCertificate())
					.chain((certificate: Certificate) => this.prepare(certificate))
					.chain((signer) => this.callSignerReadyCallback(signer))
					.chain((signer) => this.preSign(signer))
					.chain((preSignature) => this.sign(preSignature))
					.chain((signature) => this.postSign(signature))
					.chain(() => this.callSigningCompletedCallback())
					.promise()
					.catch((error) => {
						if (error.message == 'no_implementation') {
							
						} else {

						}
					});
			})
		}

		private requestUserCertificate(): IPromise<Certificate> {
			return this.manager.recoverCertificate();
		}

		private prepare(certificate: Certificate): IPromise<SignerDto> {
			return null;
		}

		private callSignerReadyCallback(signer: SignerDto): IPromise<SignerDto> {
			return this.$q.when(signer);
		}

		private preSign(signer: SignerDto): IPromise<PreSignatureDto> {
			return null;
		}

		private sign(preSignature: PreSignatureDto): IPromise<Signature> {
			return null;
		}

		private postSign(signature: Signature): IPromise<void> {
			return null;
		}

		private callSigningCompletedCallback(): IPromise<void> {
			return null;
		}

	}

}