namespace app.support.command {
	
	export interface CommandTarget<T> {
		type: string;
		status?: string;
	}
	
	export interface ConditionHandler<T> {
		match(targets: CommandTarget<T>[]): boolean;
	}
	
	export interface RouteConfig {
		stateName: string;
		navigationItem: string;
		translation: string;
		urlPrefix: string;
		src: string;
	}
	
	export interface TargetConfig {
		type: string;
		mode: string;
	}
	
	export interface FilterCommand {
		targetType ?: string;
		context ?: string;
	}
	
	export class Command {
		
		id: string;
		description: string;
		context: string;
		route: RouteConfig;
		target: TargetConfig; 
		listable: boolean;
		startProcess: boolean;
		protected handlers: ConditionHandler<any>[] = [];
	
		public addHandler(handler: ConditionHandler<any>): void {
			this.handlers.push(handler);
		}
		
		public match(targets: CommandTarget<any>[], filter ?: FilterCommand): boolean {
			// match filter
			if (filter) {
				if (this.target.type !== filter.targetType || this.context !== filter.context) {
					return false;
				}
			}
			
			//match mode
			let length = angular.isArray(targets) ? targets.length : 0;
			
			if (!this.isCompatibleMode(length)) {
				return false
			}
			
			//match handlers
			if (this.handlers.length === 0) {
				return true;	
			}
			
			for (let handler of this.handlers) {
				if (!handler.match(targets)) {
					return false;
				}
			}
			return true;
		}
		
		//Verifica se o modo do comando é compatível com a quantidade de targets
		private isCompatibleMode(length: number): boolean {
			let mode = this.target.mode;
			if ((length === 0 && mode === "None") ||
				(length === 1 && (mode === "One" || mode === "OneOrMany")) ||
				(length > 1  && (mode === "Many" || mode === "OneOrMany"))) {
				return true;
			}
			return false;
		}
	}
	
	export class CommandService {
		
		private commands: ng.IPromise<Command[]>;
		
		/** @ngInject **/
		constructor($http: ng.IHttpService, private $q: ng.IQService, private properties: any) {
			let commandsDeferred = $q.defer();
			this.commands = commandsDeferred.promise;
			
			$http.get(this.properties.apiUrl + '/discovery/api/commands')
				.then((response: ng.IHttpPromiseCallbackArg<Command[]>) => {
					let commands: Command[] = [];
					response.data.forEach(commandData => {
						let command = new Command();
						angular.extend(command, commandData);
						commands.push(command);
					});
					commandsDeferred.resolve(commands);
				}, () => {
					commandsDeferred.reject();
				});
		}
		
		public list(): ng.IPromise<Command[]> {
			return this.commands;
		}
		
		public addHandlers(id: string, handlers: {new(): ConditionHandler<any> }[]): void {
        	this.findById(id)
        		.then(command => {
    				for (let handler of handlers) {
    					command.addHandler(new handler());
    				}
    			});
		}
		
		public listMatched(targets: CommandTarget<any>[], filter ?: FilterCommand): ng.IPromise<Command[]> {
			let matched: ng.IDeferred<Command[]> = this.$q.defer();
			
			this.commands
				.then((commands: Command[]) => {
					matched.resolve(commands.filter((command: Command) => command.match(targets, filter)));
				}, () => {
					matched.reject();
				});
			return matched.promise;
		}
		
		public match(id: string, targets: CommandTarget<any>[], targetType ?: string): ng.IPromise<boolean> {
			let matched: ng.IDeferred<boolean> = this.$q.defer();
			
			this.findById(id)
				.then(command => {
					matched.resolve(command.match(targets, targetType));
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
						if (command.id === id) {
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