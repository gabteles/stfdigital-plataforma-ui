declare namespace app.pesquisaAvancada {
    import IRootScope = angular.IRootScopeService;
    import ILogService = angular.ILogService;
    import IDialogService = angular.material.IDialogService;
    import ITranslateService = angular.translate.ITranslateService;
    import MessagesService = app.support.messaging.MessagesService;
    class SaveSearchController {
        private $rootScope;
        private $log;
        private $mdDialog;
        private $translate;
        private messagesService;
        private pesquisaAvancadaService;
        search: ISearch;
        /** @ngInject **/
        constructor($rootScope: IRootScope, $log: ILogService, $mdDialog: IDialogService, $translate: ITranslateService, messagesService: MessagesService, pesquisaAvancadaService: PesquisaAvancadaService, search: ISearch);
        cancel(): void;
        confirm(): void;
    }
}
