namespace app.pesquisaAvancada {
    'use strict';
    import IRootScope = angular.IRootScopeService;
    import ILogService = angular.ILogService;
    import IDialogService = angular.material.IDialogService;
    import ITranslateService = angular.translate.ITranslateService;
    import MessagesService = app.support.messaging.MessagesService;
    
    export class SaveSearchController {
        
        /** @ngInject **/
        constructor(private $rootScope: IRootScope,
                    private $log: ILogService,
                    private $mdDialog: IDialogService,
                    private $translate: ITranslateService,
                    private messagesService: MessagesService,
                    private pesquisaAvancadaService: PesquisaAvancadaService,
                    public search: ISearch) { }
        
        public cancel(): void {
            this.$mdDialog.cancel();
        }
        
        public confirm(): void {
            this.pesquisaAvancadaService.saveSearch(this.search)
                .then(search => {
                    this.$rootScope.$broadcast('save-search:confirm');
                    this.messagesService.success(this.$translate.instant("PESQUISA-AVANCADA.PESQUISA-SALVA"));
                }).catch((reason) => {
                    this.messagesService.error(this.$translate.instant("PESQUISA-AVANCADA.PESQUISA-NAO-SALVA"));
                    this.$log.error(reason);
                }).finally(() => this.$mdDialog.cancel());
        }

    }
    
    angular
        .module('app.pesquisa-avancada')
        .controller('app.pesquisa-avancada.SaveSearchController', SaveSearchController);
}