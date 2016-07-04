declare namespace app.novoProcesso {
    import Properties = app.support.constants.Properties;
    import RouteConfig = app.support.command.RouteConfig;
    interface IProcessoWorkflow {
        description: string;
        route: RouteConfig;
    }
    class NovoProcessoService {
        private $http;
        private properties;
        private msNavigationService;
        private static apiProcessos;
        private: any;
        /** @ngInject **/
        constructor($http: ng.IHttpService, properties: Properties, msNavigationService: any);
        list(): ng.IPromise<IProcessoWorkflow[]>;
    }
}
