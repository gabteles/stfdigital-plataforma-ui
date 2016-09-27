namespace app.support.dashboards {
	'use strict';

	export interface DashboardScope extends ng.IScope {
		value: Dashboard;
	}

	class DashboardController {

		public layout: DashboardLayout;

	    /** @ngInject **/
		constructor(private $scope: DashboardScope, private dashboardLayoutManager: DashboardLayoutManager) {
			this.$scope.$watch('value', () => {
				let dashlets = angular.isDefined(this.$scope.value) ? this.$scope.value.dashlets : [];
				this.layout = dashboardLayoutManager.defaultLayout(dashlets);
			});
		}

	}

	class DashboardDirective implements ng.IDirective {

		public restrict: string = 'E';
		public templateUrl: string = 'app/main/support/dashboards/directives/dashboard.tpl.html';

		public scope: Object = {
			value: "="
		};

		public controller = DashboardController;
		public controllerAs: string = 'vm';

		public static factory(): ng.IDirectiveFactory {
			return () => {
				return new DashboardDirective();
			};
		}

	}

	angular
		.module('app.support.dashboards')
		.directive('dashboard', DashboardDirective.factory());
}