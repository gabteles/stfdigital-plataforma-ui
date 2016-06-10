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
        id?: string;
        title: string;
        notes: string;
        startDate: Date;
        startDateTimestamp: number;
        dueDate: Date;
        dueDateTimestamp: number;
        completed: boolean;
        starred: boolean;
        important: boolean;
        deleted: boolean;
        tags: ITaskTag[];
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
    }
}
