namespace app.support.dashboards {
	'use strict';

	import Properties = app.support.constants.Properties;

	describe('Teste do DashboardService', () => {

		let dashboardService: DashboardService;
		let $httpBackend: ng.IHttpBackendService;
		let properties: Properties;
		let $rootScope: ng.IRootScopeService;
		let $q: ng.IQService;
		let $ocLazyLoad: oc.ILazyLoad;

		let dashletsMockData: DashletsMockData;
		let dashboardsMockData: DashboardsMockData;
		let modulesMockData: ModulesMockData;

		let handler;

		beforeEach(angular.mock.module('app.core', 'app.support.constants', 'app.support.dashboards'));

		beforeEach(inject(['app.support.dashboards.DashboardService', '$httpBackend', 'properties', '$rootScope', '$q', '$ocLazyLoad',
				(_dashboardService_: DashboardService, _$httpBackend_: ng.IHttpBackendService, _properties_: Properties, _$rootScope_: ng.IRootScopeService, _$q_: ng.IQService, _$ocLazyLoad_: oc.ILazyLoad) => {
			dashboardService = _dashboardService_;
			$httpBackend = _$httpBackend_;
			properties = _properties_;
			$rootScope = _$rootScope_;
			$q = _$q_;
			$ocLazyLoad = _$ocLazyLoad_;
		}]));

		beforeEach(() => {
			dashletsMockData = new DashletsMockData();
			dashboardsMockData = new DashboardsMockData();
			modulesMockData = new ModulesMockData();

			handler = {
				success: () => {},
				error: () => {}
			};
			spyOn(handler, 'success').and.callThrough();
			spyOn(handler, 'error').and.callThrough();
		});

		it('Deveria recuperar os dashboards', () => {
			let mockDashboards: Dashboard[] = [dashboardsMockData.DASHBOARD_01.value];
			$httpBackend.expectGET(properties.apiUrl + '/discovery/api/dashboards').respond(200, mockDashboards);

			dashboardService.dashboards().then(handler.success, handler.error);

			$httpBackend.flush();

			expect(handler.success).toHaveBeenCalledWith(mockDashboards);
			
			expect(handler.error).not.toHaveBeenCalled();
		});

		it('Deveria carregar os dashlets do dashboard', () => {
			let mockModule01 = modulesMockData.MODULE_01.value;
			let mockModule02 = modulesMockData.MODULE_02.value;
			mockModule01.default.run((dashletRegistry: DashletRegistry) => {
				dashletRegistry.registerDashlet(dashletsMockData.DASHLET_01.id, dashletsMockData.DASHLET_01.value);
				dashletRegistry.registerDashlet(dashletsMockData.DASHLET_02.id, dashletsMockData.DASHLET_02.value);
			});
			spyOn(System, 'import').and.callFake((modulePath) => {
				if (modulePath === (dashboardsMockData.DASHLET_01.value.context + '/bundle')) {
					return $q.when();
				} else if (modulePath === (dashboardsMockData.DASHLET_02.value.context + '/bundle')) {
					return $q.when();
				} else if (modulePath === dashboardsMockData.DASHLET_01.value.src) {
					return $q.when(mockModule01);
				} else if (modulePath === dashboardsMockData.DASHLET_02.value.src) {
					return $q.when(mockModule02);
				} else {
					return $q.reject();
				}
			});

			spyOn($ocLazyLoad, 'load').and.callThrough();

			let mockDashboard: Dashboard = dashboardsMockData.DASHBOARD_01.value;
			dashboardService.loadDashlets(mockDashboard).then(handler.success, handler.error);

			$rootScope.$apply();

			expect($ocLazyLoad.load).toHaveBeenCalledTimes(2);
			expect($ocLazyLoad.load).toHaveBeenCalledWith(mockModule01.default);
			expect($ocLazyLoad.load).toHaveBeenCalledWith(mockModule02.default);

			expect(handler.success).toHaveBeenCalledWith([dashletsMockData.DASHLET_01.value, dashletsMockData.DASHLET_02.value]);
		});

	});
}