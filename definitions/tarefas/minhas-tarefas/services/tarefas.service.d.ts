declare namespace app.tarefas.minhasTarefas {
    import IHttpService = angular.IHttpService;
    import IPromise = angular.IPromise;
    interface ITaskTag {
        id?: number;
        name: string;
        label: string;
        color: string;
    }
    interface ITaskAttachment {
        name: string;
        size: number;
    }
    interface ITask {
        id: string;
        title: string;
        command: string;
        startDate: Date;
        startDateTimestamp: number;
        dueDate: Date;
        dueDateTimestamp: number;
        completed: boolean;
        starred: boolean;
        important: boolean;
        notes: string;
        tags: ITaskTag[];
        informationId: number;
        attachments: ITaskAttachment[];
        selected?: boolean;
    }
    class MinhasTarefasService {
        private $http;
        private properties;
        private static apiTarefas;
        /** @ngInject **/
        constructor($http: IHttpService, properties: any);
        get(): IPromise<ITask[]>;
        private getInformationId(taskId);
    }
}
