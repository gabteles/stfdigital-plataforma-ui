declare namespace app.gestao.meusPaineis {
    import IStateService = angular.ui.IStateService;
    class PaineisController {
        private $state;
        /** @ngInject **/
        constructor($state: IStateService);
        foo(): void;
        isTabActive(stateName: string): boolean;
    }
}
