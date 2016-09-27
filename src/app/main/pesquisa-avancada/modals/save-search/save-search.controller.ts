namespace app.pesquisaAvancada {
    'use strict';
    import IRootScope = angular.IRootScopeService;
    import ILogService = angular.ILogService;
    import IDialogService = angular.material.IDialogService;
    import ITranslateService = angular.translate.ITranslateService;
    import IToastService = angular.material.IToastService;
    
    export class SaveSearchController {
        
        /** @ngInject **/
        constructor(private $rootScope: IRootScope,
                    private $log: ILogService,
                    private $mdDialog: IDialogService,
                    private $mdToast: IToastService,
                    private $translate: ITranslateService,
                    private pesquisaAvancadaService: PesquisaAvancadaService,
                    public search: ISearch) { }
        
        public cancel(): void {
            this.$mdDialog.cancel();
        }
        
        public confirm(): void {
            let message: string;
            this.pesquisaAvancadaService.saveSearch(this.search)
                .then(search => {
                    this.$rootScope.$broadcast('save-search:confirm');
                    message = this.$translate.instant("PESQUISA-AVANCADA.PESQUISA-SALVA");
                }).catch((reason) => {
                    message = this.$translate.instant("PESQUISA-AVANCADA.PESQUISA-NAO-SALVA");
                    this.$log.error(reason);
                })
                .finally(() => {
                    this.$mdToast.show(
                            this.$mdToast.simple()
                                .textContent(message)
                                .position('top right')
                                .hideDelay(3000));
                    this.$mdDialog.cancel();
                });
        }

    }
    
    angular
        .module('app.pesquisa-avancada')
        .controller('app.pesquisa-avancada.SaveSearchController', SaveSearchController);
}