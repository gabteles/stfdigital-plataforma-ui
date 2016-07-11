declare namespace app.autenticacao {
    import IStateService = angular.ui.IStateService;
    import IHttpService = angular.IHttpService;
    import MessagesService = app.support.messaging.MessagesService;
    class LoginController {
        private $state;
        private $rootScope;
        private $http;
        private messagesService;
        private AuthService;
        form: any;
        /** @ngInject **/
        constructor($state: IStateService, $rootScope: any, $http: IHttpService, messagesService: MessagesService, AuthService?: (d: any) => any);
        entrar(): void;
    }
}
