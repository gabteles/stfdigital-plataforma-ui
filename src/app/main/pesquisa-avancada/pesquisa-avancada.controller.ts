namespace app.pesquisaAvancada {
    'use strict';
    import IScope = angular.IScope;
    import ISidenavService = angular.material.ISidenavService;
    import IDialogService = angular.material.IDialogService;
    import Properties = app.support.constants.Properties;
    import MessagesService = app.support.messaging.MessagesService;
    import CommandService = app.support.command.CommandService;
    import ISCEService = angular.ISCEService;
    import IHttpService = angular.IHttpService;
    import ITranslateService = angular.translate.ITranslateService;
    
    enum Tab {
        NEW_SEARCH, RESULT, EDIT_SEARCH 
    }
    
    export class PesquisaAvancadaController {

        public defaultSearch: ISearch;
        public newSearch: ISearch;
        public search: ISearch;
        public selectedTab: number = Tab.NEW_SEARCH;
        public searchComplete: boolean = false;
        public editEnabled: boolean = false;
        public tableOptions: Object;
        public tableColumnDefs: Array<Object>;
        public searchResults: Array<any> = [];
        public savedSearchs: ISearch[] = [];
        private activeSaveAction: boolean = false;
        
        /** @ngInject **/
        constructor(private $scope: IScope,
                    private $mdDialog: IDialogService,
                    private $mdSidenav: ISidenavService,
                    private $sce: ISCEService,
                    private $http: IHttpService,
                    private $translate: ITranslateService,
                    private DTColumnDefBuilder: any,
                    private pesquisaAvancadaService: PesquisaAvancadaService,
                    private properties: Properties,
                    commandService: CommandService,
                    private messagesService: MessagesService,
                    public searchConfig: ISearchConfig) {

            this.defaultSearch = <ISearch>{id: null, context: searchConfig.context, label: '', criterias: []};
            this.newSearch = angular.copy(this.defaultSearch);
            this.search = angular.copy(this.defaultSearch);
            this.configureDatatables();
            this.loadSavedSearchs();
            commandService.findById('salvar-pesquisa-avancada').then(() => this.activeSaveAction = true);
        }

        /**
         * Verifica se uma pesquisa está válida
         */
        public canSearch(): boolean {
            var search = (this.selectedTab === Tab.NEW_SEARCH ? this.newSearch : this.search);
            return ((search.criterias.length > 0) && (_.every(search.criterias, 'valid')));
        }

        /**
         * Realiza uma pesquisa
         */
        public doSearch(): void {
            this.setLoadingProgress(true);
            
            if (this.selectedTab === Tab.NEW_SEARCH) {
                angular.copy(this.newSearch, this.search);
                angular.copy(this.defaultSearch, this.newSearch);
            }
            this.pesquisaAvancadaService.executeSearch(this.searchConfig.api, this.search)
                .then(result => {
                    this.searchResults = result;
                }).catch(() => {
                    this.messagesService.error(this.$translate.instant("PESQUISA-AVANCADA.PESQUISA-NAO-EXECUTADA"));
                }).finally(() => {
                    this.selectedTab = Tab.RESULT;
                    this.editEnabled = true;
                    this.searchComplete = true;
                    this.setLoadingProgress(false);
                });
        }

        /**
         * Salva uma pesquisa
         */
        public saveSearch(event): void {
            this.$mdDialog.show({
                clickOutsideToClose: true,
                controller: 'app.pesquisa-avancada.SaveSearchController',
                locals: {
                    search: this.search
                },
                controllerAs: 'vm',
                templateUrl: 'app/main/pesquisa-avancada/modals/save-search/save-search.html',
                parent: angular.element(document.body),
                targetEvent: event
            });

            var removeListener = this.$scope.$on('save-search:confirm', () => {
                let foundIndex: number = this.savedSearchs.findIndex(savedSearch => savedSearch.id === this.search.id)
                
                if (foundIndex > -1) {
                    angular.copy(this.search, this.savedSearchs[foundIndex]);
                } else {
                    this.savedSearchs.unshift(angular.copy(this.search));
                }
                removeListener();
            });
        }
        
        /**
         * Salva uma pesquisa
         */
        public deleteSearch(search: ISearch): void {
            this.pesquisaAvancadaService.deleteSearch(search.id)
                .then(response => {
                    if (this.search.id === search.id) this.reset();
                    let foundIndex: number = this.savedSearchs.findIndex(savedSearch => savedSearch.id === search.id);
                    this.savedSearchs.splice(foundIndex, 1);
                    this.messagesService.success("Pesquisa excluída com sucesso!");
                }).catch(() => {
                    this.messagesService.error("Erro ao excluir pesquisa!"); 
                });
        }

        /**
         * Abre a navegação das pesquisas salvas
         */
        public openSavedSearchs(): void {
            this.$mdSidenav('sidenav-search').open();
        }

        /**
         * Carrega uma pesquisa salva
         */
        public loadSearch(savedSearch: ISearch): void {
            angular.copy(savedSearch, this.search);
            this.$mdSidenav('sidenav-search').close();
            this.editEnabled = true;
            this.selectedTab = Tab.EDIT_SEARCH;
            this.searchResults = [];
            this.searchComplete = false;
            
            if (this.search.executable) {
                this.doSearch();
            }
        }
        
        /**
         * Ativa as ações do header de pesquisa
         */
        public activateActionHeader(): boolean {
            let active = false;
            
            if (this.selectedTab === Tab.NEW_SEARCH) { 
                active = this.canSearch();
            } else if (this.selectedTab === Tab.RESULT) {
                active = this.activeSaveAction;
            } else {
                active = true;
            }
            return active;
        }
        
        /**
         * Monta o template da tabela de resultados
         */
        public resultTemplate(): string {
            let template : string = "";
            this.searchConfig.resultColumns.forEach(rc => {
                template += "<td" + ((rc.result.css) ? " class='" + rc.result.css + "'" : "") + ">"
                         + "{{" + rc.result.field + "}}</td>";
            });
            return this.$sce.trustAsHtml(template);
        }
        
        /**
         * Reset da tela de pesquisa 
         */
        private reset(): void {
            angular.copy(this.defaultSearch, this.search);
            this.selectedTab = Tab.NEW_SEARCH;
            this.searchComplete = false;
            this.editEnabled = false;
        }
        
        /**
         * Configura a tabela de resultados
         */
        private configureDatatables(): void {
            this.tableOptions = {
               dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
               pagingType: 'simple',
               autoWidth: true,
               responsive: false,
               searching: false
            };
       }
       
       /**
        * Carrega as pesquisa salvas
        */
       private loadSavedSearchs(): void {
           this.setLoadingProgress(true);
           this.pesquisaAvancadaService.loadSavedSearchs(this.searchConfig.context)
               .then(searchs => this.savedSearchs = searchs)
               .catch(() => this.messagesService.error(this.$translate.instant("PESQUISA-AVANCADA.PESQUISAS-NAO-CARREGADAS")))
               .finally(() => this.setLoadingProgress(false));
       }
       
       /**
        * Ativa o efeito do loading
        */
       private setLoadingProgress(loading: boolean): void {
           (<any>this.$scope.$root).loadingProgress = loading;
       }
       
    }
    
    angular
        .module('app.pesquisa-avancada')
        .controller('app.pesquisa-avancada.PesquisaAvancadaController', PesquisaAvancadaController);
}