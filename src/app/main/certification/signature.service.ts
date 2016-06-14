namespace app.certification {

	import IHttpService = angular.IHttpService;
	import IPromise = angular.IPromise;
	import IHttpPromiseCallbackArg = angular.IHttpPromiseCallbackArg;
	import IQService = angular.IQService;

	export class SigningError {

		constructor(public error: string) {
			
		}

	}

	export class PrepareCommand {
		constructor(public certificateAsHex: string) {

		}
	}

	export class PreSignCommand {
		constructor(public signerId: string) {

		}
	}

	export class PostSignCommand {
		constructor(public signerId: string, signatureAsHex: string) {

		}
	}

	export interface SignerDto {
		signerId: string;
	}

	export interface PreSignatureDto {
		data: string;
		hash: string;
		hashType: string;
	}

	export interface SignedDocumentDto {
		documentId: string;
	}

	export class SignatureService {

		private static apiSignature: string = "/documents/api/certification/signature"

		static $inject = ['properties', '$http', '$q', 'app.certification.CryptoService'];

		constructor(private properties, private $http: IHttpService, private $q: IQService, private cryptoService: CryptoService) {

		}

		prepare(command: PrepareCommand): IPromise<SignerDto> {
			return this.$http.post(this.properties.apiUrl + '/prepare', command)
				.then((response: IHttpPromiseCallbackArg<SignerDto>) => {
					return response.data;
				});
		}

		preSign(command: PreSignCommand): IPromise<PreSignatureDto> {
			return this.$http.post(SignatureService.apiSignature + '/pre-sign', command)
				.then((response: IHttpPromiseCallbackArg<PreSignatureDto>) => {
					return response.data;
				});
		}

		postSign(command: PostSignCommand): IPromise<void> {
			return this.$http.post(SignatureService.apiSignature + '/post-sign', command)
				.then(() => {
					return null;
				});
		}

		save(signerId: string): IPromise<SignedDocumentDto> {
			return this.$http.post(SignatureService.apiSignature + '/save-signed/' + signerId, {})
				.then((response: IHttpPromiseCallbackArg<SignedDocumentDto>) => {
					return response.data;
				});
		}

		signingManager() {
			return new SigningManager(this.$q, this.cryptoService, this);
		}

	}

	angular.module('app.certification').service('SignatureService', SignatureService);
}