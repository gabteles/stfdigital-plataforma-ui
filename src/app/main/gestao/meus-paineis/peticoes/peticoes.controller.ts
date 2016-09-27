namespace app.gestao.meusPaineis {
    'use strict';

    export class PeticoesController {

        public chart1: any;
        public chart2: any;

        /** @ngInject **/
        constructor(private meusPaineisService: MeusPaineisService) {
            this.chart1 = meusPaineisService.loadDashboardWidget('Chart1');
            this.chart2 = meusPaineisService.loadDashboardWidget('Chart2');
        }
    }
    
    angular
        .module('app.gestao.meus-paineis')
        .controller('app.gestao.meus-paineis.PeticoesController', PeticoesController);
}