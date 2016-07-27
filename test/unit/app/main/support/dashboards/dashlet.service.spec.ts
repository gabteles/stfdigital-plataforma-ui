namespace app.support.dashboards {
	'use strict';

	describe('Teste do DashletRegistry', () => {

		let dashletRegistry: DashletRegistry;

		beforeEach(() => {
			dashletRegistry = new DashletRegistry();
		});

		it('Deveria registrar e recuperar dashlets', () => {
			let dashlet01: DashletDefinition = {
				template: '<div>Dashlet 01</div>',
				controller: 'Dashlet01Controller',
				controllerAs: 'vm'
			};

			let dashlet02 = {
				template: '<div>Dashlet 02</div>',
				controller: 'Dashlet01Controller',
				controllerAs: 'vm'
			};

			let fluidDashletRegistry = dashletRegistry.registerDashlet('dashlet-01', dashlet01);

			expect(fluidDashletRegistry).toEqual(dashletRegistry);

			fluidDashletRegistry.registerDashlet('dashlet-02', dashlet02);

			let recoveredDashlet01 = dashletRegistry.recoverDashlet('dashlet-01');
			
			expect(recoveredDashlet01).toEqual(dashlet01);

			let recoveredDashlet02 = dashletRegistry.recoverDashlet('dashlet-02');

			expect(recoveredDashlet02).toEqual(dashlet02);
		});

		it('Deveria lançar erro ao tentar recuperar dashlet não registrado', () => {
			let dashlet01: DashletDefinition = {
				template: '<div>Dashlet 01</div>',
				controller: 'Dashlet01Controller',
				controllerAs: 'vm'
			};

			dashletRegistry.registerDashlet('dashlet-01', dashlet01)

			let dashletNaoRegistrado;
			try {
				let dashletNaoRegistrado = dashletRegistry.recoverDashlet('dashlet-nao-registrado');
				fail('Excceção esperada não lançada')
			} catch (e) {
				expect(e).toEqual(new Error("Dashlet dashlet-nao-registrado não foi encontrado."));
			}

			expect(dashletNaoRegistrado).toBeUndefined();
		});

	});
}