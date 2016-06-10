declare namespace app.pesquisaAvancada {
    import IScope = angular.IScope;
    import ITranslateService = angular.translate.ITranslateService;
    import IToastService = angular.material.IToastService;
    import ISidenavService = angular.material.ISidenavService;
    import IDialogService = angular.material.IDialogService;
    class PesquisaAvancadaController {
        private $scope;
        private $translate;
        private $mdDialog;
        private $mdToast;
        private $mdSidenav;
        traits: ITrait[];
        savedSearchs: ISearch[];
        searchResults: any;
        defaultSearch: ISearch;
        newSearch: ISearch;
        loadedSearch: ISearch;
        resultSearch: ISearch;
        selectedTab: number;
        searchComplete: boolean;
        editEnabled: boolean;
        resultsDtOptions: any;
        /** @ngInject **/
        constructor($scope: IScope, $translate: ITranslateService, $mdDialog: IDialogService, $mdToast: IToastService, $mdSidenav: ISidenavService, traits: ITrait[], savedSearchs: ISearch[], searchResults: any);
        private defineResultsDtOptions();
        canSearch(): boolean;
        doSearch(): void;
        saveSearch(event: any): void;
        openSavedSearchs(): void;
        loadSearch(savedSearch: ISearch): void;
    }
}
