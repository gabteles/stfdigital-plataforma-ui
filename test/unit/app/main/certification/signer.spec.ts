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
}