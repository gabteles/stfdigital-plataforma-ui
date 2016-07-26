namespace app.support.command {
	
	import Properties = app.support.constants.Properties;
	
	/**
	 * Interface para um comando
	 */
	export interface Command {	}
	
	/**
	 * Interface para definição de um alvo do comando.
	 * Ex: Processo, Peticao, etc 
	 */
	export interface CommandTarget {
		type: string;
		status?: string;
	}
	
	/**
	 * Interface para definição de um matcher
	 * que verifica se o comando é aplicável para um alvo.
	 */
	export interface CommandMatcher {
		match(targets: CommandTarget[]): boolean;
	}
	
	/**
	 * Interface para definição de um validador para o comando.
	 */
	export interface CommandValidator {
		isValid(command: Command): boolean;
	}
	
	/**
	 * Interface da configuração de uma rota. 
	 */
	export interface RouteConfig {
		stateName: string;
		navigationItem: string;
		translation: string;
	    url: string;
		urlPrefix: string;
		src: string;
	}
	
	/**
	 * Interface da configuração de um alvo de um comando. 
	 */
	export interface TargetConfig {
		type: string;
		mode: string;
	}
	
	/**
	 * Interface para definição de um filtro para os comandos 
	 */
	export interface CommandFilter {
		targetType ?: string;
		context ?: string;
	}
	
	/**
	 * Classe que define a configuração de um comando. 
	 */
	export class CommandConfig {
		
		id: string;
		description: string;
		context: string;
		route: RouteConfig;
		target: TargetConfig; 
		listable: boolean;
		startProcess: boolean;
		protected matchers: CommandMatcher[] = [];
		protected validator: CommandValidator;
	
		/**
		 * Adiciona um matcher
		 */
		public addMatcher(matcher: CommandMatcher): void {
			this.matchers.push(matcher);
		}
		
		/**
		 * Relaciona um validador
		 */
		public setValidator(validator: CommandValidator): void {
			this.validator = validator;
		}
		
		/**
		 * Varifica se o comando é aplicável ao conjunto de alvos
		 */
		public match(targets: CommandTarget[], filter ?: CommandFilter): boolean {
			// match filter
			if (filter) {
				if ((filter.targetType && this.target.type !== filter.targetType) ||
						(filter.context && this.context !== filter.context)) {
					return false;
				}
			}
			
			//match mode
			let length = angular.isArray(targets) ? targets.length : 0;
			
			if (!this.isCompatibleMode(length)) {
				return false
			}
			
			//match matchers
			if (this.matchers.length === 0) {
				return true;	
			}
			
			for (let matcher of this.matchers) {
				if (!matcher.match(targets)) {
					return false;
				}
			}
			return true;
		}
		
		/**
		 * Verifica se um comando é válido
		 */
		public isValid(command: Command): boolean {
			if (this.validator) {
				return this.validator.isValid(command);
			}
			return true;
		}
		
		/**
		 * Verifica se o modo do comando é compatível com a quantidade de alvos
		 */
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
	
	/**
	 * Serviço para manipulação das configurações de comando. 
	 */
	export class CommandService {
		
		private commandsConfig: ng.IPromise<CommandConfig[]>;
		
		/** @ngInject **/
		constructor(private $http: ng.IHttpService, private $q: ng.IQService, private properties: Properties) {
			this.loadCommands();
		}
		
		public loadCommands(): void {
			let commandsConfigDeferred = this.$q.defer();
			this.commandsConfig = commandsConfigDeferred.promise;
			
			this.$http.get(this.properties.apiUrl + '/discovery/api/commands')
				.then((response: ng.IHttpPromiseCallbackArg<CommandConfig[]>) => {
					let commandsConfig: CommandConfig[] = [];
					response.data.forEach(commandConfigData => {
						let commandConfig = new CommandConfig();
						angular.extend(commandConfig, commandConfigData);
						commandsConfig.push(commandConfig);
					});
					commandsConfigDeferred.resolve(commandsConfig);
				}, () => {
					commandsConfigDeferred.reject();
				});
		}

		/**
		 * Lista os comandos
		 */
		public list(): ng.IPromise<CommandConfig[]> {
			return this.commandsConfig;
		}
		
		/**
		 * Adiciona um matcher a uma configuração 
		 */
		public addMatcher(id: string, matcher: CommandMatcher): void {
        	this.findById(id)
        		.then(commandConfig => commandConfig.addMatcher(matcher));
		}
		
		/**
		 * Relaciona um validador a uma configuração 
		 */
		public setValidator(id: string, validator: CommandValidator): void {
        	this.findById(id)
        		.then(commandConfig => commandConfig.setValidator(validator))
        		.catch(reason => { throw new Error(reason); });
		}
		
		/**
		 * Lista os comandos que são aplicáveis à lista de alvos. 
		 */
		public listMatched(targets: CommandTarget[], filter ?: CommandFilter): ng.IPromise<CommandConfig[]> {
			let matched: ng.IDeferred<CommandConfig[]> = this.$q.defer();
			
			this.commandsConfig
				.then((commandsConfig: CommandConfig[]) => {
					matched.resolve(commandsConfig.filter(cmd => cmd.listable && cmd.match(targets, filter)));
				}, () => {
					matched.reject("Erro ao carregar comandos!");
				});
			return matched.promise;
		}
		
		/**
		 * Verifica se um comando é valido de acordo com sua configuração.
		 * Um validator deve ser criado para realizar a checagem
		 */
		public isValid(id: string, command: Command): ng.IPromise<boolean> {
			let matched: ng.IDeferred<boolean> = this.$q.defer();
			
			this.findById(id)
				.then(commandConfig => {
					matched.resolve(commandConfig.isValid(command));
				}, () => {
					matched.resolve(false);
				});
			return matched.promise;
		}
		
		/**
		 * Pesquisa uma configuração por id
		 */
		public findById(id): ng.IPromise<CommandConfig> {
			let found: ng.IDeferred<CommandConfig> = this.$q.defer();
			
			this.commandsConfig
				.then((commandsConfig: CommandConfig[]) => {
					for (let commandConfig of commandsConfig) {
						if (commandConfig.id === id) {
							return found.resolve(commandConfig);
						}
					}
					return found.reject("Identificador não encontrado: " + id);
				}, () => {
				found.reject("Erro ao carregar comandos!");
			});
			return found.promise;
		}
		
	}
	
	angular
		.module('app.support.command')
		.service('commandService', CommandService);
}