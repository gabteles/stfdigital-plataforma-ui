namespace app.support.dashboards {

	export interface MockModuleEntry {
		id: string;
		value: MockModule;
	}

	export class MockModule {

		private _default: any;

		constructor(moduleName: string) {
			this._default = angular.module(moduleName, []);
		}

		get default() {
			return this._default;
		}

		set default(def) {
			this._default = def;
		}

	}

	export class ModulesMockData {

		public MODULE_01: MockModuleEntry = {
			id: 'module-01',
			value: new MockModule('module-01')
		};

		public MODULE_02: MockModuleEntry = {
			id: 'module-02',
			value: new MockModule('module-02')
		};

	}

}