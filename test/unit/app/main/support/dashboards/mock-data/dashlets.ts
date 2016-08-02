namespace app.support.dashboards {

	export interface MockDashletDefinition {
		id: string;
		value: DashletDefinition;
		mockController: Function;
	}

	export interface DashletController {
		fakeVariable: string;
	}

	export class Dashlet01Controller implements DashletController {
		
		public fakeVariable = 'fakeVariable';

	}

	export class Dashlet02Controller implements DashletController {
		
		public fakeVariable = 'fakeVariable';

	}

	export class DashletsMockData {

		public DASHLET_01: MockDashletDefinition = {
			id: 'dashlet-01',
			value: {
				template: '<div class="dashlet-content">Dashlet 01</div>',
				controller: 'Dashlet01Controller',
				controllerAs: 'vm'
			},
			mockController: Dashlet01Controller
		};

		public DASHLET_02: MockDashletDefinition = {
			id: 'dashlet-02',
			value: {
				template: '<div class="dashlet-content">Dashlet 02</div>',
				controller: 'Dashlet02Controller',
				controllerAs: 'vm'
			},
			mockController: Dashlet02Controller
		};

	}

}