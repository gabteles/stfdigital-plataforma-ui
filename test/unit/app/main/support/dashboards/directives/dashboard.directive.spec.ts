namespace app.support.dashboards {

	describe('Teste da diretiva dashboard', () => {

		let $controllerProvider: ng.IControllerProvider;

		let $q: ng.IQService;
		let $compile: ng.ICompileService;
		let $compileProvider: ng.ICompileProvider;
		let $timeout: ng.ITimeoutService;

		let scope;

		let dashboardsMockdata: DashboardsMockData;

		let dashboard01: Dashboard;

		let dashboardLayoutManager: DashboardLayoutManager;

		beforeEach(angular.mock.module('templates', 'app.core', 'app.support.dashboards'));

		beforeEach(angular.mock.module((_$compileProvider_: ng.ICompileProvider) => {
			$compileProvider = _$compileProvider_;
		}));

		beforeEach(inject((_$q_, _$compile_: ng.ICompileService, _$rootScope_: ng.IRootScopeService, _$timeout_: ng.ITimeoutService, $httpBackend: ng.IHttpBackendService, $templateCache) => {
			$q = _$q_;
			$compile = _$compile_;
			$timeout = _$timeout_;
			scope = _$rootScope_.$new();
		}));

		beforeEach(inject(['app.support.dashboards.DashboardLayoutManager', (_dashboardLayoutManager_: DashboardLayoutManager) => {
			dashboardLayoutManager = _dashboardLayoutManager_;
		}]));

		beforeEach(() => {
			dashboardsMockdata = new DashboardsMockData();

			dashboard01 = dashboardsMockdata.DASHBOARD_01.value;

			spyOn(dashboardLayoutManager, 'defaultLayout').and.callThrough();
		})

		it('Deveria compilar a diretiva', () => {
			let dashletsNames: string[] = [];
			// Sobreescrevendo a diretiva interna utilizada.
			$compileProvider.directive('dashlet', function() {
				return {
					restrict : 'EA',
					priority: 9999,
					scope: {
						value: '='
					},
					terminal: true,
					template: '',
					link: function(scope, element, attrs) {
						dashletsNames.push(scope.dashlet);
					}
				};
			});

			scope.dashboard = dashboardsMockdata.DASHBOARD_01.value;
			var element = $compile('<dashboard value="dashboard"></dashboard>')(scope);
			
			scope.$digest();
			
			expect(dashboardLayoutManager.defaultLayout).toHaveBeenCalledWith([dashboardsMockdata.DASHLET_01.value, dashboardsMockdata.DASHLET_02.value]);
		});

	});

}