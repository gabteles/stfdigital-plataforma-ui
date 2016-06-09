declare module app {
    import IScope = angular.IScope;
    import IRootScopeService = angular.IRootScopeService;
    class MainController {
        /** @ngInject **/
        constructor($scope: IScope, $rootScope: IRootScopeService);
    }
}
