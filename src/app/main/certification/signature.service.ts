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

	export class ProvideToSignCommand {
		constructor(public signerId: string, public documentId: number) {

		}
	}

	export class PostSignCommand {
		constructor(public signerId: string, public signatureAsHex: string) {

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
			return this.$http.post(this.properties.apiUrl + SignatureService.apiSignature + '/prepare', command)
				.then((response: IHttpPromiseCallbackArg<SignerDto>) => {
					return response.data;
				});
		}

		provideToSign(command: ProvideToSignCommand): IPromise<any> {
			return this.$http.post(this.properties.apiUrl + SignatureService.apiSignature + '/provide-to-sign', command)
				.then((response: IHttpPromiseCallbackArg<any>) => {
					return null;
				});
		}

		preSign(command: PreSignCommand): IPromise<PreSignatureDto> {
			return this.$http.post(this.properties.apiUrl + SignatureService.apiSignature + '/pre-sign', command)
				.then((response: IHttpPromiseCallbackArg<PreSignatureDto>) => {
					return response.data;
				});
		}

		postSign(command: PostSignCommand): IPromise<void> {
			return this.$http.post(this.properties.apiUrl + SignatureService.apiSignature + '/post-sign', command)
				.then(() => {
					return null;
				});
		}

		save(signerId: string): IPromise<SignedDocumentDto> {
			return this.$http.post(this.properties.apiUrl + SignatureService.apiSignature + '/save-signed/' + signerId, {})
				.then((response: IHttpPromiseCallbackArg<SignedDocumentDto>) => {
					return response.data;
				});
		}

		signingManager(maximumParallelSignatures: number = 2) {
			return new SigningManager(this.$q, this.cryptoService, this, maximumParallelSignatures);
		}

	}

	angular.module('app.certification').service('app.certification.SignatureService', SignatureService);
}