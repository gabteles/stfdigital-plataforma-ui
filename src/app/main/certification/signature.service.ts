namespace app.certification {

	import IHttpService = angular.IHttpService;

	export class SignatureService {

		constructor(properties, $http: IHttpService, crypto: CryptoService) {

		}

		signingManager() {
			return new SigningManager(null, null);
		}

	}

	angular.module('app.certification').service('SignatureService', SignatureService);
}