namespace app.certification {

	describe('Teste do signing-manager', () => {

		let signingManager: SigningManager;
		let $q: ng.IQService;
		let $rootScope: ng.IRootScopeService;

		let mockCryptoService;
		let mockSignatureService;

		let certificate: Certificate;

		let handler;

		beforeEach(inject((_$q_: ng.IQService, _$rootScope_) => {
			$q = _$q_;
			$rootScope = _$rootScope_;
		}));

		beforeEach(() => {
			mockCryptoService = {
				getCertificate: () => {}
			};
			mockSignatureService = {};

			handler = {
            	success: () => {},
            	error: () => {}
			};

			spyOn(handler, 'success').and.callThrough();
			spyOn(handler, 'error').and.callThrough();

			certificate = {encoded: new Uint8Array(123), hex: '1234567890'};

			signingManager = new SigningManager($q, mockCryptoService, mockSignatureService, 2);
		});

		describe('Método recoverCertificate', () => {

			it('Deveria recuperar o certificado ainda não inicializado', () => {
				spyOn(mockCryptoService, 'getCertificate').and.returnValue($q.when(certificate));

				signingManager.recoverCertificate().then(handler.success, handler.error);

				$rootScope.$apply();

				expect(mockCryptoService.getCertificate).toHaveBeenCalledWith({lang: 'en'});
				expect(handler.success).toHaveBeenCalledWith(certificate);
				expect(handler.error).not.toHaveBeenCalled();
				expect(signingManager.getAvailableParallelSignatures()).toEqual(1);
			});

			it('Deveria bloquear a promise que retorna certificado caso o contador de assinaturas paralelas zerar', () => {
				spyOn(mockCryptoService, 'getCertificate').and.returnValue($q.when(certificate));

				signingManager.recoverCertificate();
				$rootScope.$apply();
				expect(mockCryptoService.getCertificate).toHaveBeenCalledTimes(1);

				signingManager.recoverCertificate();
				$rootScope.$apply();
				expect(mockCryptoService.getCertificate).toHaveBeenCalledTimes(1);

				expect(signingManager.getAvailableParallelSignatures()).toEqual(0);

				signingManager.recoverCertificate().then(handler.success, handler.error);
				$rootScope.$apply();

				expect(mockCryptoService.getCertificate).toHaveBeenCalledTimes(1);
				expect(handler.success).not.toHaveBeenCalled();

				signingManager.signingFinished();

				$rootScope.$apply();

				expect(handler.success).toHaveBeenCalledWith(certificate);
				expect(signingManager.getAvailableParallelSignatures()).toEqual(1);
			});

			it('Deveria rejeitar a promise de certificado caso dê erro ao recuperar o certificado do cryptoService', () => {
				spyOn(mockCryptoService, 'getCertificate').and.returnValue($q.reject('erro'));

				signingManager.recoverCertificate().then(handler.success, handler.error);

				$rootScope.$apply();

				expect(mockCryptoService.getCertificate).toHaveBeenCalledWith({lang: 'en'});
				expect(handler.success).not.toHaveBeenCalled();
				expect(handler.error).toHaveBeenCalledWith({error: 'erro'});
			});

		});

	});

}