declare namespace app.gestao.meusPaineis {
    class PeticoesController {
        private meusPaineisService;
        chart1: any;
        chart2: any;
        /** @ngInject **/
        constructor(meusPaineisService: MeusPaineisService);
    }
}
