declare namespace app.gestao.meusPaineis {
    import IStateService = angular.ui.IStateService;
    class PaineisController {
        private $state;
        dashboards: app.support.dashboards.Dashboard[];
        private currentDashboardId;
        /** @ngInject **/
        constructor($state: IStateService, dashboards: app.support.dashboards.Dashboard[], $stateParams: ng.ui.IStateParamsService);
        configure(): void;
        isTabActive(dashboardId: string): boolean;
    }
}
