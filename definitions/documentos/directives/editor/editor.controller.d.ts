declare namespace app.documentos {
    import IQService = angular.IQService;
    import IIntervalService = angular.IIntervalService;
    import IPromise = angular.IPromise;
    class EditorController {
        private $q;
        private $interval;
        private $scope;
        private onlyofficeService;
        showEditor: boolean;
        showProgress: boolean;
        edicaoIniciada: boolean;
        documento: any;
        config: {};
        static $inject: string[];
        constructor($q: IQService, $interval: IIntervalService, $scope: EditorScope, onlyofficeService: OnlyofficeService);
        private iniciarEditor(numeroEdicao);
        private tentativasVerificaoEdicaoCompleta;
        private deferredEdicaoCompleta;
        verificarEdicaoCompleta(): IPromise<{}>;
        private iteracaoVerificarEdicaoCompleta();
        private tentativasVerificaoEdicaoIniciada;
        private deferredEdicaoIniciada;
        private verificarEdicaoIniciada();
        private iteracaoVerificarEdicaoIniciada();
        private tratarNaoAtivo();
    }
}
