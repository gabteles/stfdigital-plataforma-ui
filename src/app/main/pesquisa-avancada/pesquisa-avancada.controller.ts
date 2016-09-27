namespace app.pesquisaAvancada {
    'use strict';
    import IScope = angular.IScope;
    import ISidenavService = angular.material.ISidenavService;
    import IDialogService = angular.material.IDialogService;
    import Properties = app.support.constants.Properties;
    import CommandService = app.support.command.CommandService;
    import ISCEService = angular.ISCEService;
    import IHttpService = angular.IHttpService;
    
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
                    private DTColumnDefBuilder: any,
                    private pesquisaAvancadaService: PesquisaAvancadaService,
                    private properties: Properties,
                    commandService: CommandService,
                    public searchConfig: ISearchConfig) {

            this.defaultSearch = <ISearch>{id: null, context: searchConfig.context, label: '', criterias: []};
            this.newSearch = angular.copy(this.defaultSearch);
            this.search = angular.copy(this.defaultSearch);
            this.configureDatatables();
            this.loadSavedSearchs();
            commandService.findById('salvar-pesquisa-avancada').then(() => this.activeSaveAction = true);
        }

        public canSearch(): boolean {
            var search = (this.selectedTab === Tab.NEW_SEARCH ? this.newSearch : this.search);
            return ((search.criterias.length > 0) && (_.every(search.criterias, 'valid')));
        }

        public doSearch(): void {
            if (this.selectedTab === Tab.NEW_SEARCH) {
                angular.copy(this.newSearch, this.search);
                angular.copy(this.defaultSearch, this.newSearch);
            }
            this.pesquisaAvancadaService.executeSearch(this.searchConfig.api, this.search)
                .then(result => this.searchResults = result);
            this.selectedTab = Tab.RESULT;
            this.searchComplete = true;
            this.editEnabled = true;
        }

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
                
                if (foundIndex > 0) {
                    angular.copy(this.search, this.savedSearchs[foundIndex]);
                } else {
                    this.savedSearchs.unshift(angular.copy(this.search));
                }
                removeListener();
            });
        }

        public openSavedSearchs(): void {
            this.$mdSidenav('sidenav').open();
        }

        public loadSearch(savedSearch: ISearch): void {
            angular.copy(savedSearch, this.search);
            this.$mdSidenav('sidenav').close();
            this.editEnabled = true;
            
            if (this.search.executable) {
                this.doSearch();
            } else {
                this.selectedTab = Tab.EDIT_SEARCH;
                this.searchResults = [];
                this.searchComplete = false;
            }
        }
        
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
        
        public resultTemplate(): string {
            
            let template : string = "";
            this.searchConfig.resultColumns.forEach(rc => {
                template += "<td" + ((rc.result.css) ? " class='" + rc.result.css + "'" : "") + ">"
                         + "{{" + rc.result.field + "}}</td>";
            });
            return this.$sce.trustAsHtml(template);
        }
        
        private configureDatatables(): void {
            this.tableOptions = {
               dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
               pagingType: 'simple',
               autoWidth: true,
               responsive: false,
               searching: false
            };
       }
        
       private loadSavedSearchs(): void {
           this.pesquisaAvancadaService.loadSavedSearchs(this.searchConfig.context)
               .then(searchs => this.savedSearchs = searchs);
       }
    }
    
    angular
        .module('app.pesquisa-avancada')
        .controller('app.pesquisa-avancada.PesquisaAvancadaController', PesquisaAvancadaController);
}