namespace app.support.dashboards {

	describe('Teste da diretiva dashlet', () => {

		let $controllerProvider: ng.IControllerProvider;

		let $q: ng.IQService;
		let $compile: ng.ICompileService;
		let $timeout: ng.ITimeoutService;

		let scope;

		let dashletRegistry: DashletRegistry;

		let dashletsMockdata: DashletsMockData;

		let dashlet01: MockDashletDefinition;

		beforeEach(angular.mock.module('app.core', 'app.support', 'app.support.dashboards'));

		beforeEach(angular.mock.module((_$provide_: ng.auto.IProvideService, _$controllerProvider_: ng.IControllerProvider) => {
			$controllerProvider = _$controllerProvider_;
		}));

		beforeEach(inject((_$q_, _dashletRegistry_: DashletRegistry, _$compile_: ng.ICompileService, _$rootScope_: ng.IRootScopeService, _$timeout_: ng.ITimeoutService) => {
			dashletRegistry = _dashletRegistry_;
			$q = _$q_;
			$compile = _$compile_;
			$timeout = _$timeout_;
			scope = _$rootScope_.$new();
		}));

		beforeEach(() => {
			dashletsMockdata = new DashletsMockData();

			dashlet01 = dashletsMockdata.DASHLET_01;

			spyOn(dashletRegistry, 'recoverDashlet').and.callFake((id: string) => {
				if (id === dashlet01.id) {
					return dashlet01.value;
				}
			});

			$controllerProvider.register(dashlet01.value.controller, dashlet01.mockController);
		})

		it('Deveria compilar a diretiva', () => {
			scope.dashletName = dashlet01.id;
			let element = $compile('<dashlet value="dashletName"></dashlet>')(scope);

			scope.$digest();
			$timeout.flush(1);

			let item = element.find('div.dashlet-content');
			expect(item.length).toEqual(1);
			expect(item.text()).toEqual('Dashlet 01');
		});

	});

}