namespace app.gestao.meusPaineis {
	'use strict';
	import IStateService = angular.ui.IStateService;
	
	export class PaineisController {

		private currentDashboardId: string;

		/** @ngInject **/
		constructor(private $state: IStateService, public dashboards: app.support.dashboards.Dashboard[], $stateParams: ng.ui.IStateParamsService) {
			if ($stateParams['dashboardId']) {
				this.currentDashboardId = $stateParams['dashboardId'];
			} else {
				if (dashboards.length > 0) {
					this.currentDashboardId = this.dashboards[0].id;
				}
			}
		}

        public configure(): void {
            console.log("// TODO configure");
        }

		public isTabActive(dashboardId: string): boolean {
			return this.currentDashboardId === dashboardId;
		}

	}

	angular
		.module('app.gestao.meus-paineis')
		.controller('app.gestao.meus-paineis.PaineisController', PaineisController);

}