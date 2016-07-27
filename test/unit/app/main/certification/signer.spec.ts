namespace app.certification {

	import IQService = angular.IQService;
	import IPromise = angular.IPromise;
	import IDeferred = angular.IDeferred;
	import IRootScopeService = angular.IRootScopeService;

	describe('Teste do Signer', () => {

		let $q: IQService;
		let $rootScope: IRootScopeService;

		let signer: Signer;
		let signingManager: SigningManager;

		let mockCryptoService: any;
		let mockSignatureService: any;

		let callbacks;
		let certificate: Certificate;

		beforeEach(inject((_$q_: IQService, _$rootScope_: IRootScopeService) => {
			$q = _$q_;
			$rootScope = _$rootScope_;
		}));

		beforeEach(() => {
			certificate = {encoded: new Uint8Array(123), hex: '1234567890'};

			mockCryptoService = {
				use: () => $q.when(true),
				getCertificate: () => $q.when(certificate),
				sign: () => $q.when({value: new Uint8Array(123), hex: '1234567890'})
			};
			mockSignatureService = {
				prepare: () => $q.when({signerId: '123'}),
				preSign: () => $q.when({data: 123, hash: '123456789', hashType: 'SHA-256'}),
				postSign: () => $q.when(null),
				save: () => {},
				provideToSign: () => $q.when()
			};
			callbacks = {
				onSignerReady: () => {},
				onSigningCompleted: () => {},
				onErrorCallback: () => {}
			};
			signingManager = new SigningManager($q, mockCryptoService, mockSignatureService, 2);
			signer = signingManager.createSigner();

			spyOn(signingManager, 'signingFinished').and.callThrough();
			spyOn(mockSignatureService, 'prepare').and.callThrough();
			spyOn(mockSignatureService, 'preSign').and.callThrough();
			spyOn(mockSignatureService, 'postSign').and.callThrough();
			spyOn(mockSignatureService, 'save').and.callThrough();
			spyOn(callbacks, 'onSigningCompleted').and.callThrough();
			spyOn(callbacks, 'onErrorCallback').and.callThrough();
			spyOn(mockCryptoService, 'sign').and.callThrough();
		});

		it('Deveria realizar a assinatura', () => {
			spyOn(signingManager, 'recoverCertificate').and.callThrough();
			spyOn(callbacks, 'onSignerReady').and.callFake(() => {signer.triggerDocumentProvided()});			

			signer.onSignerReady(callbacks.onSignerReady);
			signer.onSigningCompleted(callbacks.onSigningCompleted);

			signer.start();

			$rootScope.$apply();

			expect(signingManager.recoverCertificate).toHaveBeenCalledWith();

			expect(mockSignatureService.prepare).toHaveBeenCalledWith(new PrepareCommand('1234567890'));

			expect(callbacks.onSignerReady).toHaveBeenCalledWith({signerId: '123'});

			expect(mockSignatureService.preSign).toHaveBeenCalledWith(new PreSignCommand('123'));

			expect(mockCryptoService.sign).toHaveBeenCalledWith(certificate, {data: 123, type: 'SHA-256', hex: '123456789'}, {lang: 'en'});

			expect(callbacks.onSigningCompleted).toHaveBeenCalled();

			signer.saveSignedDocument();

			expect(mockSignatureService.save).toHaveBeenCalledWith('123');
		});
		
		it('Deveria retornar o progressTracker', () => {
			spyOn(signingManager, 'recoverCertificate').and.callThrough();
			spyOn(callbacks, 'onSignerReady').and.callFake(() => {signer.provideExistingDocument(7)});
			spyOn(mockSignatureService, 'provideToSign').and.callThrough();

			signer.onSignerReady(callbacks.onSignerReady);
			signer.onSigningCompleted(callbacks.onSigningCompleted);

			signer.start();

			$rootScope.$apply();

			let progressTracker = signer.getProgressTracker();

			expect(progressTracker).toBeDefined();

			expect(mockSignatureService.provideToSign).toHaveBeenCalledWith(new ProvideToSignCommand('123', 7));
		});

		it('Deveria chamar o callback de erro do tipo no_implementation', () => {
			spyOn(signingManager, 'recoverCertificate').and.callFake(() => $q.reject({error: {message: 'no_implementation'}}));
			spyOn(callbacks, 'onSignerReady').and.callFake(() => {signer.provideExistingDocument(7)});

			signer.onSignerReady(callbacks.onSignerReady);
			signer.onSigningCompleted(callbacks.onSigningCompleted);
			signer.onErrorCallback(callbacks.onErrorCallback);

			signer.start();

			$rootScope.$apply();

			let progressTracker = signer.getProgressTracker();

			expect(progressTracker).toBeDefined();

			expect(callbacks.onErrorCallback).toHaveBeenCalledWith(new SigningError('O plugin de assinatura não foi encontrado. Por favor instalar em http://www.id.ee/'));
		});

		it('Deveria chamar o callback de erro do tipo no_certificates', () => {
			spyOn(signingManager, 'recoverCertificate').and.callFake(() => $q.reject({error: {message: 'no_certificates'}}));
			spyOn(callbacks, 'onSignerReady').and.callFake(() => {signer.provideExistingDocument(7)});

			signer.onSignerReady(callbacks.onSignerReady);
			signer.onSigningCompleted(callbacks.onSigningCompleted);
			signer.onErrorCallback(callbacks.onErrorCallback);

			signer.start();

			$rootScope.$apply();

			let progressTracker = signer.getProgressTracker();

			expect(progressTracker).toBeDefined();

			expect(callbacks.onErrorCallback).toHaveBeenCalledWith(new SigningError('Nenhum certificado encontrado.'));
		});

		it('Deveria chamar o callback de erro do tipo user_cancel', () => {
			spyOn(signingManager, 'recoverCertificate').and.callFake(() => $q.reject({error: {message: 'user_cancel'}}));
			spyOn(callbacks, 'onSignerReady').and.callFake(() => {signer.provideExistingDocument(7)});

			signer.onSignerReady(callbacks.onSignerReady);
			signer.onSigningCompleted(callbacks.onSigningCompleted);
			signer.onErrorCallback(callbacks.onErrorCallback);

			signer.start();

			$rootScope.$apply();

			let progressTracker = signer.getProgressTracker();

			expect(progressTracker).toBeDefined();

			expect(callbacks.onErrorCallback).toHaveBeenCalledWith(new SigningError('Usuário cancelou a operação.'));
		});

		it('Deveria chamar o callback de erro do genérico', () => {
			spyOn(signingManager, 'recoverCertificate').and.callFake(() => $q.reject({error: 'my-error'}));
			spyOn(callbacks, 'onSignerReady').and.callFake(() => {signer.provideExistingDocument(7)});

			signer.onSignerReady(callbacks.onSignerReady);
			signer.onSigningCompleted(callbacks.onSigningCompleted);
			signer.onErrorCallback(callbacks.onErrorCallback);

			signer.start();

			$rootScope.$apply();

			let progressTracker = signer.getProgressTracker();

			expect(progressTracker).toBeDefined();

			expect(callbacks.onErrorCallback).toHaveBeenCalledWith(new SigningError('my-error'));
		});

		it('Deveria chamar o callback de erro do genérico 2', () => {
			spyOn(signingManager, 'recoverCertificate').and.callFake(() => $q.reject({message: 'my-error-obj'}));
			spyOn(callbacks, 'onSignerReady').and.callFake(() => {signer.provideExistingDocument(7)});

			signer.onSignerReady(callbacks.onSignerReady);
			signer.onSigningCompleted(callbacks.onSigningCompleted);
			signer.onErrorCallback(callbacks.onErrorCallback);

			signer.start();

			$rootScope.$apply();

			let progressTracker = signer.getProgressTracker();

			expect(progressTracker).toBeDefined();

			expect(callbacks.onErrorCallback).toHaveBeenCalledWith(new SigningError('Erro desconhecido.'));
		});

		it('Deveria detectar que o plugin de assinatura não está instalado', () => {
			spyOn(mockCryptoService, 'use').and.callFake(() => $q.reject('erro'));

			signer.onSignerReady(callbacks.onSignerReady);
			signer.onSigningCompleted(callbacks.onSigningCompleted);
			signer.onErrorCallback(callbacks.onErrorCallback);

			signer.start();

			$rootScope.$apply();

			let progressTracker = signer.getProgressTracker();

			expect(progressTracker).toBeDefined();

			expect(callbacks.onErrorCallback).toHaveBeenCalledWith(new SigningError('O plugin de assinatura não foi encontrado.'));
		});

		it('Deveria chamar callback com erro ao prover documento para assinatura', () => {
			spyOn(callbacks, 'onSignerReady').and.callFake(() => {signer.provideExistingDocument(7)});
			spyOn(mockSignatureService, 'provideToSign').and.callFake(() => $q.reject('Erro ao prover documento para assinatura.'));

			signer.onSignerReady(callbacks.onSignerReady);
			signer.onSigningCompleted(callbacks.onSigningCompleted);
			signer.onErrorCallback(callbacks.onErrorCallback);

			signer.start();

			$rootScope.$apply();

			expect(callbacks.onErrorCallback).toHaveBeenCalledWith(new SigningError('Erro ao prover documento para assinatura.'));
		});

		it('Deveria chamar callback com erro de que o callback SignerCreated não está definido', () => {
			spyOn(callbacks, 'onSignerReady').and.callFake(() => {signer.provideExistingDocument(7)});
			signer.onErrorCallback(callbacks.onErrorCallback);

			signer.start();

			$rootScope.$apply();

			expect(callbacks.onErrorCallback).toHaveBeenCalledWith(new SigningError('Callback SignerCreated não definido.'));
		});

	});

	describe('Teste do ProgressTracker', () => {

		let progressTracker: ProgressTracker;

		beforeEach(() => {
			progressTracker = new ProgressTracker();
		});

		it('Deveria calcular o progresso corretamente', () => {
			progressTracker.incrementTotalSteps();
			progressTracker.incrementTotalSteps();
			expect(progressTracker.currentProgress()).toEqual(0);
			expect(progressTracker.currentProgressOfTotal(10)).toEqual(0);

			progressTracker.incrementFinishedSteps();
			expect(progressTracker.currentProgress()).toEqual(50);
			expect(progressTracker.currentProgressOfTotal(10)).toEqual(5);

			progressTracker.incrementFinishedSteps();
			expect(progressTracker.currentProgress()).toEqual(100);
			expect(progressTracker.currentProgressOfTotal(10)).toEqual(10);
		});

	});

	describe('Teste do StepsChain', () => {
		let $q: IQService;
		let $rootScope: IRootScopeService;

		let stepsChain: StepsChain<void>;
		let progressTracker: ProgressTracker;

		beforeEach(inject((_$q_: IQService, _$rootScope_: IRootScopeService) => {
			$q = _$q_;
			$rootScope = _$rootScope_;
			progressTracker = new ProgressTracker();
			stepsChain = new StepsChain<void>($q, progressTracker, null);
		}));

		it('Deveria encadear dois passos corretamente', () => {
			class Class1 {
				constructor (public data1: string) { }
			}

			class Class2 {
				constructor (public data2: string) { }
			}

			let deferred1: IDeferred<Class1> = $q.defer<Class1>();
			let deferred2: IDeferred<Class2> = $q.defer<Class2>();

			class HostClass {
				recoverObjectOfClass1FromSomewhere(): IPromise<Class1> {
					return deferred1.promise;
				}

				recoverObjectOfClass2ReceivingObjectOfClass1(arg: Class1): IPromise<Class2> {
					return deferred2.promise;
				}

				receiveFinalValue(arg: Class2) {

				}
			}

			let hostObject = new HostClass();

			spyOn(hostObject, 'recoverObjectOfClass1FromSomewhere').and.callThrough();
			spyOn(hostObject, 'recoverObjectOfClass2ReceivingObjectOfClass1').and.callThrough();
			spyOn(hostObject, 'receiveFinalValue').and.callThrough();

			let promise: IPromise<Class2> = stepsChain.chain(() => hostObject.recoverObjectOfClass1FromSomewhere())
				.chain((param) => hostObject.recoverObjectOfClass2ReceivingObjectOfClass1(param))
				.promise();
			
			promise.then((finalVal) => {
				hostObject.receiveFinalValue(finalVal);
			});

			expect(progressTracker.getTotalSteps()).toEqual(2);
			expect(progressTracker.currentProgress()).toEqual(0);

			let resolve1 = new Class1('value1');
			deferred1.resolve(resolve1);
			$rootScope.$digest();
			expect(progressTracker.currentProgress()).toEqual(50);
			expect(hostObject.recoverObjectOfClass1FromSomewhere).toHaveBeenCalledWith();
			expect(hostObject.recoverObjectOfClass2ReceivingObjectOfClass1).toHaveBeenCalledWith(resolve1);

			let resolve2 = new Class2('value2');
			deferred2.resolve(resolve2);
			$rootScope.$digest();
			expect(progressTracker.currentProgress()).toEqual(100);
			expect(hostObject.receiveFinalValue).toHaveBeenCalledWith(resolve2);
		});

		it('Deveria interromper a cadeia de passos caso ocorra algum erro', () => {
			class Class1 {
				constructor (public data1: string) { }
			}

			class Class2 {
				constructor (public data2: string) { }
			}

			let deferred1: IDeferred<Class1> = $q.defer<Class1>();
			let deferred2: IDeferred<Class2> = $q.defer<Class2>();

			class HostClass {
				recoverObjectOfClass1FromSomewhere(): IPromise<Class1> {
					return deferred1.promise;
				}

				recoverObjectOfClass2ReceivingObjectOfClass1(arg: Class1): IPromise<Class2> {
					return deferred2.promise;
				}

				receiveFinalValue(arg: Class2) {

				}

				errorOcurred(error) {

				}
			}

			let hostObject = new HostClass();

			spyOn(hostObject, 'recoverObjectOfClass1FromSomewhere').and.callThrough();
			spyOn(hostObject, 'recoverObjectOfClass2ReceivingObjectOfClass1').and.callThrough();
			spyOn(hostObject, 'receiveFinalValue').and.callThrough();
			spyOn(hostObject, 'errorOcurred').and.callThrough();

			let promise: IPromise<Class2> = stepsChain.chain(() => hostObject.recoverObjectOfClass1FromSomewhere())
				.chain((param) => hostObject.recoverObjectOfClass2ReceivingObjectOfClass1(param))
				.promise();
			
			promise.then((finalVal) => {
				hostObject.receiveFinalValue(finalVal);
			}, (error) => {
				hostObject.errorOcurred(error);
			});

			expect(progressTracker.getTotalSteps()).toEqual(2);
			expect(progressTracker.currentProgress()).toEqual(0);

			let resolve1 = new Class1('value1');
			deferred1.reject('error');
			$rootScope.$digest();
			expect(progressTracker.currentProgress()).toEqual(0);
			expect(hostObject.errorOcurred).toHaveBeenCalledWith('error');
			expect(hostObject.recoverObjectOfClass1FromSomewhere).toHaveBeenCalledWith();
			expect(hostObject.recoverObjectOfClass2ReceivingObjectOfClass1).not.toHaveBeenCalled();

			let resolve2 = new Class2('value2');
			deferred2.resolve(resolve2);
			$rootScope.$digest();
			expect(progressTracker.currentProgress()).toEqual(0);
			expect(hostObject.receiveFinalValue).not.toHaveBeenCalled();
		});
	});
}