namespace app.novoProcesso {
	'use strict';
	
    export class NovoProcessoController {

        public buscaProcesso: string = "";
        private todosProcessos: IProcessoWorkflow[];
        
        /** @ngInject **/
        constructor(private $scope: ng.IScope, public processos: IProcessoWorkflow[]) {
            this.$scope.$watch(() => this.buscaProcesso, () => this.filtrarProcessos());
            this.todosProcessos = angular.copy(processos);
        }

        private filtrarProcessos(): void {
            var busca: string = this.buscaProcesso.toLowerCase();

            if (busca.length === 0) {
                this.processos = this.todosProcessos;
            } else {
                this.processos = this.todosProcessos.filter((processo) => {
                    return (processo.description.toLowerCase().indexOf(busca) !== -1);
                });
            }
        }
    }

    angular
        .module('app.novo-processo')
        .controller('app.novo-processo.NovoProcessoController', NovoProcessoController);
}