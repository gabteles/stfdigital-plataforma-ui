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
        private $sce;
        private $http;
        private properties;
        traits: ITrait[];
        resultColumns: IResultColumn[];
        savedSearchs: ISearch[];
        defaultSearch: ISearch;
        newSearch: ISearch;
        loadedSearch: ISearch;
        resultSearch: ISearch;
        selectedTab: number;
        searchComplete: boolean;
        editEnabled: boolean;
        resultsDtOptions: any;
        searchResults: any;
        /** @ngInject **/
        constructor($scope: IScope, $translate: ITranslateService, $mdDialog: IDialogService, $mdToast: IToastService, $mdSidenav: ISidenavService, $sce: ng.ISCEService, $http: any, properties: any, traits: ITrait[], resultColumns: IResultColumn[], savedSearchs: ISearch[]);
        private defineResultsDtOptions();
        canSearch(): boolean;
        doSearch(): void;
        saveSearch(event: any): void;
        openSavedSearchs(): void;
        loadSearch(savedSearch: ISearch): void;
        resultTemplate(): string;
    }
}
