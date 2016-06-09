declare namespace app.ultimosAcessos {
    import IFilterFilter = angular.IFilterFilter;
    import IStateService = angular.ui.IStateService;
    class UltimosAcessosController {
        private $filter;
        private $state;
        ultimosAcessos: IAcesso[];
        ultimosAcessosDtOptions: any;
        ultimosAcessosOrig: IAcesso[];
        activeFilter: number;
        filterObject: any;
        /** @ngInject **/
        constructor($filter: IFilterFilter, $state: IStateService, ultimosAcessos: IAcesso[]);
        foo(): void;
        setActiveFilter(index: any): void;
        isTabActive(stateName: any, index: any): boolean;
        private updateFilterObject();
        private defineUltimosAcessosDtOptions();
    }
}
