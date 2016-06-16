declare namespace app.support.command {
    interface CommandTarget {
        type(): string;
    }
    interface ConditionHandler {
        match(target: CommandTarget): boolean;
    }
    interface RouteConfig {
        stateName: string;
        navigationItem: string;
        translation: string;
        urlPrefix: string;
        src: string;
    }
    interface CommandConfig {
        id: string;
        description: string;
        route: RouteConfig;
        targetType: string;
        listable: boolean;
        startProcess: boolean;
        advancedSearch: boolean;
    }
    class Command {
        private config;
        private id;
        description: string;
        route: RouteConfig;
        targetType: string;
        listable: boolean;
        startProcess: boolean;
        advancedSearch: boolean;
        protected handlers: ConditionHandler[];
        constructor(config: CommandConfig);
        getId(): string;
        addHandler(handler: ConditionHandler): void;
        match(target: CommandTarget): boolean;
    }
    class CommandService {
        private $q;
        private properties;
        private commands;
        /** @ngInject **/
        constructor($http: ng.IHttpService, $q: ng.IQService, properties: any);
        list(): ng.IPromise<Command[]>;
        addHandlers(id: string, handlers: {
            new (): ConditionHandler;
        }[]): void;
        listMatched(target: CommandTarget): ng.IPromise<Command[]>;
        match(id: string, target: CommandTarget): ng.IPromise<boolean>;
        findById(id: any): ng.IPromise<Command>;
    }
}
