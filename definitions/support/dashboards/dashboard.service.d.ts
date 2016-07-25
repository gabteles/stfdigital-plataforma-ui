declare namespace app.support.dashboards {
    interface Dashboard {
        id: string;
        nome: string;
        dashlets: Dashlet[];
    }
    interface Dashlet {
        context: string;
        id: string;
        nome: string;
        src: string;
    }
    class DashboardService {
        private $http;
        private properties;
        private $ocLazyLoad;
        private $q;
        private dashletRegistry;
        /** @ngInject **/
        constructor($http: ng.IHttpService, properties: app.support.constants.Properties, $ocLazyLoad: oc.ILazyLoad, $q: ng.IQService, dashletRegistry: DashletRegistry);
        dashboards(): ng.IPromise<Dashboard>;
        loadDashlets(dashboard: Dashboard): ng.IPromise<DashletDefinition[]>;
    }
}
