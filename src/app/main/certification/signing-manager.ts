namespace app.certification {

	import IPromise = angular.IPromise;
	import IQService = angular.IQService;
	import IDeferred = angular.IDeferred;

	export class SigningManager {

		private certificateDeferred: IDeferred<Certificate>;
		private tokens: IDeferred<Certificate>[] = [];
		private availableParallelSignatures: number;

		constructor(private $q: IQService, private cryptoService: CryptoService, private signatureService: SignatureService, private maximumParallelSignatures: number) {
			this.availableParallelSignatures = maximumParallelSignatures;
		}

		/**
		 * Recupera o certificado já selecionado ou
		 * pede o usuário para selecionar caso nenhum já tenha sido selecionado.
		 * 
		 */
		recoverCertificate(): IPromise<Certificate> {
			if (!this.certificateDeferred) {
				this.certificateDeferred = this.$q.defer<Certificate>();
				this.cryptoService.getCertificate({lang: 'en'}).then((certificate: Certificate) => {
					this.certificateDeferred.resolve(certificate);
				}, (err) => {
					this.certificateDeferred.reject({'error': err});
				});
			}
			if (this.availableParallelSignatures === 0) {
				let token = this.$q.defer<Certificate>();
				this.tokens.push(token);
				return token.promise.then(() => {
					return this.certificateDeferred.promise;
				});
			} else {
				this.availableParallelSignatures--;
				return this.certificateDeferred.promise;
			}
		}

		signingFinished() {
			if (this.tokens.length > 0) {
				let token = this.tokens.shift();
				token.resolve();
			}
			this.availableParallelSignatures++;
		}

		getAvailableParallelSignatures(): number {
			return this.availableParallelSignatures;
		}

		createSigner() {
			return new Signer(this, this.cryptoService, this.signatureService, this.$q);
		}

	}

}