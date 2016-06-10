declare module app.login {
    import IStateService = angular.ui.IStateService;
    class LoginController {
        private $state;
        form: any;
        /** @ngInject **/
        constructor($state: IStateService);
        entrar(): void;
    }
}
