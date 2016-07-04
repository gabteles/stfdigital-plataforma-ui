declare namespace app.novoProcesso {
    class NovoProcessoController {
        private $scope;
        processos: IProcessoWorkflow[];
        buscaProcesso: string;
        private todosProcessos;
        /** @ngInject **/
        constructor($scope: ng.IScope, processos: IProcessoWorkflow[]);
        private filtrarProcessos();
    }
}
