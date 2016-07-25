declare namespace app.autenticacao {
    import IStateService = angular.ui.IStateService;
    import MessagesService = app.support.messaging.MessagesService;
    interface FormLogin {
        usuario: string;
        senha: string;
    }
    class LoginController {
        private $state;
        private messagesService;
        private AuthService;
        form: FormLogin;
        /** @ngInject **/
        constructor($state: IStateService, messagesService: MessagesService, AuthService: any);
        entrar(): void;
    }
}
