declare namespace app.support {
    class StfHeaderController {
        private $scope;
        private stfBreadcrumbsService;
        private localBreadcrumbs;
        /**  @ngInject */
        constructor($scope: StfHeaderScope, stfBreadcrumbsService: StfBreadcrumbsService);
        hasBreadcrumbs(): boolean;
        breadcrumbs(): any;
    }
}
