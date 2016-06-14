namespace app.support.command {
	
	export interface CommandTarget {
		type(): string;
	}
	
	export interface ConditionHandler {
		match(target: CommandTarget): boolean;
	}
	
	export interface RouteConfig {
		stateName: string;
		navigationItem: string;
		translation: string;
		urlPrefix: string;
		src: string;
	}
	
	export interface CommandConfig {
		id: string;
		description: string;
		route: RouteConfig;
		targetType: string;
		listable: boolean;
		startProcess: boolean;
		advancedSearch: boolean;	
	}
	
	export class Command {
		
		private id: string;

		description: string;
		route: RouteConfig;
		targetType: string;
		listable: boolean;
		startProcess: boolean;
		advancedSearch: boolean;
		protected handlers: ConditionHandler[] = [];
	
		constructor(private config: CommandConfig) {
			this.id = config.id;
		}
	
		public getId(): string {
			return this.id;
		}
	
		public addHandler(handler: ConditionHandler): void {
			this.handlers.push(handler);
		}
		
		public match(target: CommandTarget): boolean {
			if (target.type() !== this.config.targetType) {
				return false;
			}
			if (this.handlers.length === 0) {
				return true;	
			}
			for (let handler of this.handlers) {
				if (!handler.match(target)) {
					return false;
				}
			}
			return true;
		}
	}
	
	export class CommandService {
		
		private commands: ng.IPromise<Command[]>;
		
		/** @ngInject **/
		constructor($http: ng.IHttpService, private $q: ng.IQService, private properties: any) {
			let commandsDeferred = $q.defer();
			this.commands = commandsDeferred.promise;
			
			$http.get(this.properties.apiUrl + '/discovery/api/commands')
				.then((response: ng.IHttpPromiseCallbackArg<CommandConfig[]>) => {
					let cmds: Command[] = [];
					response.data.forEach(config => {
							cmds.push(new Command(config));
					});
					commandsDeferred.resolve(cmds);
				}, () => {
					commandsDeferred.reject();
				});
		}
		
		public list(): ng.IPromise<Command[]> {
			return this.commands;
		}
		
		public addHandlers(id: string, handlers: {new(): ConditionHandler }[]): void {
        	this.findById(id)
        		.then(command => {
    				for (let handler of handlers) {
    					command.addHandler(new handler());
    				}
    			});
		}
		
		public listMatched(target: CommandTarget): ng.IPromise<Command[]> {
			let matched: ng.IDeferred<Command[]> = this.$q.defer();
			
			this.commands
				.then((commands: Command[]) => {
					matched.resolve(commands.filter(command => {
						return command.match(target);
					}));
				}, () => {
					matched.reject();
				});
			return matched.promise;
		}
		
		public match(id: string, target: CommandTarget): ng.IPromise<boolean> {
			let matched: ng.IDeferred<boolean> = this.$q.defer();
			
			this.findById(id)
				.then(command => {
					matched.resolve(command.match(target));
				}, () => {
					matched.reject();
				});
			return matched.promise;
		}
		
		public findById(id): ng.IPromise<Command> {
			let found: ng.IDeferred<Command> = this.$q.defer();
			
			this.commands
				.then((commands: Command[]) => {
					for (let command of commands) {
						if (command.getId() === id) {
							return found.resolve(command);
						}
					}
				}, () => {
				found.reject();
			});
			return found.promise;
		}
		
	}
	
	angular
		.module('app.support.command')
		.service('app.support.command.CommandService', CommandService);
}