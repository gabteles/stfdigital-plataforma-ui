namespace app.certification {

	describe('Signer', () => {

		let signer: Signer;
		let signingManager: SigningManager;

		beforeEach(() => {
			signingManager = new SigningManager(null, null);
			signer = new Signer(null, null, null);
		});

		it('Deveria testar true', () => {
			expect(true).toEqual(true);
		});
		
	});

	describe('ProgressTracker', () => {

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
}