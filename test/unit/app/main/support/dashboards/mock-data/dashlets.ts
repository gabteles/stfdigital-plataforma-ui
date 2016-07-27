namespace app.support.dashboards {

	export interface MockDashletDefinition {
		id: string;
		value: DashletDefinition;
	}

	export class DashletsMockData {

		public DASHLET_01: MockDashletDefinition = {
			id: 'dashlet-01',
			value: {
				template: '<div>Dashlet 01</div>',
				controller: 'Dashlet01Controller',
				controllerAs: 'vm'
			}
		};

		public DASHLET_02: MockDashletDefinition = {
			id: 'dashlet-02',
			value: {
				template: '<div>Dashlet 02</div>',
				controller: 'Dashlet01Controller',
				controllerAs: 'vm'
			}
		};

	}

}