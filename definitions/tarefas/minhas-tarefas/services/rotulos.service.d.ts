declare namespace app.tarefas.minhasTarefas {
    import IHttpService = angular.IHttpService;
    import IPromise = angular.IPromise;
    class RotulosService {
        private $http;
        private static apiRotulos;
        /** @ngInject **/
        constructor($http: IHttpService);
        get(): IPromise<ITaskTag[]>;
    }
}
