namespace app.certification {

	import IHttpService = angular.IHttpService;
	import IPromise = angular.IPromise;
	import IHttpPromiseCallbackArg = angular.IHttpPromiseCallbackArg;

	export class SigningError {

		constructor(public error: string) {
			
		}

	}

	export class PrepareCommand {
		constructor(public certificateAsHex: string) {

		}
	}

	export interface SignerDto {
		signerId: string;
	}

	export class SignatureService {

		constructor(private properties, private $http: IHttpService, private crypto: CryptoService) {

		}

		prepare(command: PrepareCommand): IPromise<SignerDto> {
			return this.$http.post(this.properties.apiUrl + '/certification/signature/prepare', command)
				.then((response: IHttpPromiseCallbackArg<SignerDto>) => {
					return response.data;
				});
		}

		signingManager() {
			return new SigningManager(null, null, this);
		}

	}

	angular.module('app.certification').service('SignatureService', SignatureService);
}