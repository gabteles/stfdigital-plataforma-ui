declare namespace app.documentos {
    import IScope = angular.IScope;
    interface EditorScope extends IScope {
        api: any;
        documento: any;
        edicaoConcluida: any;
        edicaoIniciada: Function;
        edicaoTimeout: any;
        aguardarConclusao: any;
    }
}
