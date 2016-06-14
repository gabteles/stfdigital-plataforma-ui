namespace app.certification {

	import IPromise = angular.IPromise;
	import IQService = angular.IQService;

	export class SigningManager {

		private certificate: Certificate;

		constructor(private $q: IQService, private cryptoService: CryptoService, private signatureService: SignatureService) {

		}

		injectCertificate(resolvedObject) {

		}

		collectCertificate(cert) {

		}

		injectAlreadySelectedCertificate() {

		}

		/**
		 * Recupera o certificado já selecionado ou
		 * pede o usuário para selecionar caso nenhum já tenha sido selecionado.
		 * 
		 */
		recoverCertificate(): IPromise<Certificate> {
			return this.$q((resolve, reject) => {
				if (this.certificate) {
					resolve(this.certificate);
				} else {
					this.cryptoService.getCertificate({lang: 'en'}).then((response) => {
						resolve(response);
					}, (err) => {
						reject({'error': err});
					});
				}
			});
		}

		createSigner() {
			return new Signer(this, this.cryptoService, this.signatureService, this.$q);
		}

	}

}