declare namespace app.support.messaging {
    import IToastService = angular.material.IToastService;
    class MessagesService {
        private $mdToast;
        private static DEFAULT_HIDE_DELAY;
        private static DEFAULT_PARENT_SELECTOR;
        private static DEFAULT_POSITION;
        /** ngInject **/
        constructor($mdToast: IToastService);
        error(message: string): void;
        success(message: string): void;
    }
}
