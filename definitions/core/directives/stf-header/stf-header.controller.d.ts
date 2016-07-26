declare namespace app.core {
    class StfHeaderController {
        private $scope;
        private stfBreadcrumbsService;
        private localBreadcrumbs;
        /**  @ngInject */
        constructor($scope: StfHeaderScope, stfBreadcrumbsService: StfBreadcrumbsService);
        hasBreadcrumbs(): boolean;
        hasFabAction(): boolean;
        breadcrumbs(): any;
    }
}
