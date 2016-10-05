declare namespace app.pesquisaAvancada {
    import IScope = angular.IScope;
    import ISidenavService = angular.material.ISidenavService;
    import IDialogService = angular.material.IDialogService;
    import Properties = app.support.constants.Properties;
    import MessagesService = app.support.messaging.MessagesService;
    import CommandService = app.support.command.CommandService;
    import ISCEService = angular.ISCEService;
    import IHttpService = angular.IHttpService;
    import ITranslateService = angular.translate.ITranslateService;
    class PesquisaAvancadaController {
        private $scope;
        private $mdDialog;
        private $mdSidenav;
        private $sce;
        private $http;
        private $translate;
        private DTColumnDefBuilder;
        private pesquisaAvancadaService;
        private properties;
        private messagesService;
        searchConfig: ISearchConfig;
        defaultSearch: ISearch;
        newSearch: ISearch;
        search: ISearch;
        selectedTab: number;
        searchComplete: boolean;
        editEnabled: boolean;
        tableOptions: Object;
        tableColumnDefs: Array<Object>;
        searchResults: Array<any>;
        savedSearchs: ISearch[];
        private activeSaveAction;
        /** @ngInject **/
        constructor($scope: IScope, $mdDialog: IDialogService, $mdSidenav: ISidenavService, $sce: ISCEService, $http: IHttpService, $translate: ITranslateService, DTColumnDefBuilder: any, pesquisaAvancadaService: PesquisaAvancadaService, properties: Properties, commandService: CommandService, messagesService: MessagesService, searchConfig: ISearchConfig);
        /**
         * Verifica se uma pesquisa está válida
         */
        canSearch(): boolean;
        /**
         * Realiza uma pesquisa
         */
        doSearch(): void;
        /**
         * Salva uma pesquisa
         */
        saveSearch(event: any): void;
        /**
         * Salva uma pesquisa
         */
        deleteSearch(search: ISearch): void;
        /**
         * Abre a navegação das pesquisas salvas
         */
        openSavedSearchs(): void;
        /**
         * Carrega uma pesquisa salva
         */
        loadSearch(savedSearch: ISearch): void;
        /**
         * Ativa as ações do header de pesquisa
         */
        activateActionHeader(): boolean;
        /**
         * Monta o template da tabela de resultados
         */
        resultTemplate(): string;
        /**
         * Reset da tela de pesquisa
         */
        private reset();
        /**
         * Configura a tabela de resultados
         */
        private configureDatatables();
        /**
         * Carrega as pesquisa salvas
         */
        private loadSavedSearchs();
        /**
         * Ativa o efeito do loading
         */
        private setLoadingProgress(loading);
    }
}
