declare namespace app.support.command {
    interface CommandTarget<T> {
        type: string;
        status?: string;
    }
    interface ConditionHandler<T> {
        match(targets: CommandTarget<T>[]): boolean;
    }
    interface RouteConfig {
        stateName: string;
        navigationItem: string;
        translation: string;
        urlPrefix: string;
        src: string;
    }
    interface TargetConfig {
        type: string;
        mode: string;
    }
    interface FilterCommand {
        targetType?: string;
        context?: string;
    }
    class Command {
        id: string;
        description: string;
        context: string;
        route: RouteConfig;
        target: TargetConfig;
        listable: boolean;
        startProcess: boolean;
        protected handlers: ConditionHandler<any>[];
        addHandler(handler: ConditionHandler<any>): void;
        match(targets: CommandTarget<any>[], filter?: FilterCommand): boolean;
        private isCompatibleMode(length);
    }
    class CommandService {
        private $q;
        private properties;
        private commands;
        /** @ngInject **/
        constructor($http: ng.IHttpService, $q: ng.IQService, properties: any);
        list(): ng.IPromise<Command[]>;
        addHandlers(id: string, handlers: {
            new (): ConditionHandler<any>;
        }[]): void;
        listMatched(targets: CommandTarget<any>[], filter?: FilterCommand): ng.IPromise<Command[]>;
        match(id: string, targets: CommandTarget<any>[], targetType?: string): ng.IPromise<boolean>;
        findById(id: any): ng.IPromise<Command>;
    }
}
