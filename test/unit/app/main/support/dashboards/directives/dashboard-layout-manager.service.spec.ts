namespace app.support.dashboards {
	'use strict';

	describe('Teste do DashboardLayoutManager', () => {

		let dashboardLayoutManager: DashboardLayoutManager;
		let dashboardsMockData: DashboardsMockData;

		beforeEach(() => {
			dashboardLayoutManager = new DashboardLayoutManager();
		});

		it('Deveria gerar o layout default com 2 dashlets corretamente', () => {
			dashboardsMockData = new DashboardsMockData();

			let dashboardLayout:DashboardLayout = dashboardLayoutManager.defaultLayout([dashboardsMockData.DASHLET_01.value, dashboardsMockData.DASHLET_01.value]);

			expect(dashboardLayout.rows.length).toEqual(1);
			expect(dashboardLayout.rows[0].columns.length).toEqual(2);
		});

		it('Deveria gerar o layout default com 3 dashlets corretamente', () => {
			let dashboardsMockData: DashboardsMockData = new DashboardsMockData();

			let dashboardLayout:DashboardLayout = dashboardLayoutManager.defaultLayout([dashboardsMockData.DASHLET_01.value, dashboardsMockData.DASHLET_02.value, dashboardsMockData.DASHLET_03.value]);

			expect(dashboardLayout.rows.length).toEqual(2);
			expect(dashboardLayout.rows[0].columns.length).toEqual(2);
			expect(dashboardLayout.rows[1].columns.length).toEqual(1);
		});

		it('Deveria gerar o layout default com 4 dashlets corretamente', () => {
			let dashboardsMockData = new DashboardsMockData();

			let dashboardLayout:DashboardLayout = dashboardLayoutManager.defaultLayout([dashboardsMockData.DASHLET_01.value, dashboardsMockData.DASHLET_01.value, dashboardsMockData.DASHLET_03.value, dashboardsMockData.DASHLET_04.value]);

			expect(dashboardLayout.rows.length).toEqual(2);
			expect(dashboardLayout.rows[0].columns.length).toEqual(2);
			expect(dashboardLayout.rows[1].columns.length).toEqual(2);
		});

	});

}