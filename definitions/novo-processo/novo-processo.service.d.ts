declare namespace app.novoProcesso {
    import IHttpService = angular.IHttpService;
    import IPromise = angular.IPromise;
    interface IProcessoWorkflow {
        description: string;
        stateName: string;
    }
    class ProcessoWorkflow implements IProcessoWorkflow {
        description: string;
        stateName: string;
        constructor(description: string, stateName: string);
    }
    class NovoProcessoService {
        private $http;
        private properties;
        private static apiProcessos;
        /** @ngInject **/
        constructor($http: IHttpService, properties: any);
        list(): IPromise<IProcessoWorkflow[]>;
    }
}
