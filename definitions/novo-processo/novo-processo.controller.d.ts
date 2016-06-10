declare namespace app.novoProcesso {
    import IScope = angular.IScope;
    class NovoProcessoController {
        private $scope;
        processos: IProcessoWorkflow[];
        buscaProcesso: string;
        private todosProcessos;
        /** @ngInject **/
        constructor($scope: IScope, processos: IProcessoWorkflow[]);
        private filtrarProcessos();
    }
}
