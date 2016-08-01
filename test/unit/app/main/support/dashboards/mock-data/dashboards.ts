namespace app.support.dashboards {

	export interface MockDashboard {
		id: string;
		value: Dashboard;
	}

	export interface MockDashlet {
		id: string;
		value: Dashlet;
	}

	export class DashboardsMockData {

		public DASHLET_01: MockDashlet = {
			id: 'dashlet-01',
			value: {
				id: 'dashlet-01',
				context: 'context-01',
				src: 'context-01/dashlets',
				nome: 'Dashlet 01'
			}
		};

		public DASHLET_02: MockDashlet = {
			id: 'dashlet-02',
			value: {
				id: 'dashlet-02',
				context: 'context-02',
				src: 'context-02/dashlets',
				nome: 'Dashlet 02'
			}
		};


		public DASHLET_03: MockDashlet = {
			id: 'dashlet-03',
			value: {
				id: 'dashlet-03',
				context: 'context-03',
				src: 'context-03/dashlets',
				nome: 'Dashlet 03'
			}
		};

		public DASHLET_04: MockDashlet = {
			id: 'dashlet-04',
			value: {
				id: 'dashlet-04',
				context: 'context-04',
				src: 'context-04/dashlets',
				nome: 'Dashlet 04'
			}
		};

		public DASHBOARD_01: MockDashboard = {
			id: 'dashboard-01',
			value: {
				id: 'dashboard-01',
				nome: 'Dashboard 01',
				dashlets: [
					this.DASHLET_01.value, this.DASHLET_02.value
				]
			}
		};

	}

}