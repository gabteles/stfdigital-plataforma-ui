namespace app.certification {

	import IQService = angular.IQService;
	import IPromise = angular.IPromise;
	import IDeferred = angular.IDeferred;
	import IRootScopeService = angular.IRootScopeService;

	describe('Teste do Signer', () => {

		let signer: Signer;
		let signingManager: SigningManager;

		beforeEach(inject((_$q_: IQService) => {
			let mockCryptoService: CryptoService = <CryptoService>{

			};
			let mockSignatureService: SignatureService = <SignatureService>{

			};
			signingManager = new SigningManager(_$q_, mockCryptoService, mockSignatureService, 2);
			signer = signingManager.createSigner();
		}));

		it('TODO: Deveria testar o método start', () => {
			expect(true).toEqual(true);
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
	});
}