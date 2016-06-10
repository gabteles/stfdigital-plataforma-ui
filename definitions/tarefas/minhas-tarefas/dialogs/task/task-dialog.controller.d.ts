declare namespace app.tarefas.minhasTarefas {
    import IDialogService = angular.material.IDialogService;
    import IHttpService = angular.IHttpService;
    import IStateService = angular.ui.IStateService;
    import ITranslateService = angular.translate.ITranslateService;
    class TaskDialogController {
        private $mdDialog;
        private $translate;
        private $http;
        private $state;
        private tasks;
        private event;
        private properties;
        newTask: boolean;
        private task;
        private static apiAutuacao;
        private static apiDistribuicao;
        /** @ngInject **/
        constructor($mdDialog: IDialogService, $translate: ITranslateService, $http: IHttpService, $state: IStateService, task: ITask, tasks: ITask[], event: MouseEvent, properties: any);
        /**
         * Add new task
         */
        addNewTask(): void;
        /**
         * Save task
         */
        saveTask(): void;
        /**
         * Delete task
         */
        deleteTask(): void;
        /**
         * New tag
         *
         * @param chip
         * @returns {{label: *, color: string}}
         */
        newTag(chip: any): ITaskTag;
        /**
         * Close dialog
         */
        closeDialog(): void;
        /**
         * Delete task attachment
         *
         * @param attachment
         * @param task
         */
        deleteAttachment(attachment: ITaskAttachment, task: ITask): void;
    }
}
