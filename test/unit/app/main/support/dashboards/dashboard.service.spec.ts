namespace app.support.dashboards {
	'use strict';

	import Properties = app.support.constants.Properties;

	describe('Teste do DashboardService', () => {

		let dashboardService: DashboardService;
		let $httpBackend: ng.IHttpBackendService;
		let properties: Properties;

		let dashletsMockData: DashletsMockData;
		let dashboardsMockData: DashboardsMockData;

		let handler;

		beforeEach(angular.mock.module('app.core', 'app.support', 'app.support.dashboards'));

		beforeEach(inject(['app.support.dashboards.DashboardService', '$httpBackend', 'properties', (_dashboardService_: DashboardService, _$httpBackend_: ng.IHttpBackendService, _properties_: Properties) => {
			dashboardService = _dashboardService_;
			$httpBackend = _$httpBackend_;
			properties = _properties_;
		}]));

		beforeEach(() => {
			dashletsMockData = new DashletsMockData();
			dashboardsMockData = new DashboardsMockData();

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

	});
}