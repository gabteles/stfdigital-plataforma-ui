namespace app.support.dashboards {
	'use strict';

	describe('Teste do DashletRegistry', () => {

		let dashletRegistry: DashletRegistry;

		let dashletsMockData: DashletsMockData;

		beforeEach(() => {
			dashletRegistry = new DashletRegistry();

			dashletsMockData = new DashletsMockData();
		});

		it('Deveria registrar e recuperar dashlets', () => {
			let dashlet01: DashletDefinition = dashletsMockData.DASHLET_01.value;

			let dashlet02: DashletDefinition = dashletsMockData.DASHLET_02.value;

			let fluidDashletRegistry = dashletRegistry.registerDashlet(dashletsMockData.DASHLET_01.id, dashlet01);

			expect(fluidDashletRegistry).toEqual(dashletRegistry);

			fluidDashletRegistry.registerDashlet(dashletsMockData.DASHLET_02.id, dashlet02);

			let recoveredDashlet01 = dashletRegistry.recoverDashlet(dashletsMockData.DASHLET_01.id);
			
			expect(recoveredDashlet01).toEqual(dashlet01);

			let recoveredDashlet02 = dashletRegistry.recoverDashlet(dashletsMockData.DASHLET_02.id);

			expect(recoveredDashlet02).toEqual(dashlet02);
		});

		it('Deveria lançar erro ao tentar recuperar dashlet não registrado', () => {
			let dashlet01: DashletDefinition = dashletsMockData.DASHLET_01.value;

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