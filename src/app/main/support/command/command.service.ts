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
	export interface CommandConfig {
		
		id: string;
		description: string;
		context: string;
		route: RouteConfig;
		target: TargetConfig; 
		listable: boolean;
		startProcess: boolean;
	}
	
	/**
	 * Serviço para manipulação das configurações de comando. 
	 */
	export class CommandService {
		
		private commandConfigs: ng.IPromise<CommandConfig[]>;
		private commandValidators: Object = {};
		private commandMatchers: Object = {};
		
		/** @ngInject **/
		constructor(private $http: ng.IHttpService, private $q: ng.IQService, private $log: ng.ILogService,
				$rootScope: ng.IRootScopeService, private properties: Properties) {
			$rootScope.$on('user:logged', () => this.loadCommands());
			$rootScope.$on('user:exited', () => this.resetCommands());
		}
		
        public loadCommands(): void {
            let commandConfigsDeferred = this.$q.defer();
            this.commandConfigs = commandConfigsDeferred.promise;
            
            this.$http.get(this.properties.apiUrl + '/discovery/api/commands')
                .then((response: ng.IHttpPromiseCallbackArg<CommandConfig[]>) => {
                    commandConfigsDeferred.resolve(response.data);
                }, (reason) => {
                    this.$log.error("Erro ao carregar comandos:" + reason);
                    commandConfigsDeferred.resolve([]);
                });
        }
        
        public resetCommands(): void {
            let commandConfigsDeferred = this.$q.defer();
            this.commandConfigs = commandConfigsDeferred.promise;
            commandConfigsDeferred.resolve([]);
        }

		/**
		 * Lista os comandos
		 */
		public list(): ng.IPromise<CommandConfig[]> {
			return this.commandConfigs;
		}
		
		/**
		 * Adiciona um matcher a uma configuração 
		 */
		public addMatcher(commandId: string, matcher: CommandMatcher): void {
            if (!angular.isString(commandId) || commandId.length === 0) {
                throw new Error("Não foi definido um identificador para o matcher");
            }
            let exists = this.commandMatchers.hasOwnProperty(commandId);
            if (exists) {
            	this.commandMatchers[commandId].push(matcher);
            } else {
            	this.commandMatchers[commandId] = [matcher];
            }
		}
		
		/**
		 * Armazena um validador para verificação 
		 */
		public addValidator(id: string, validator: CommandValidator): void {
            if (!angular.isString(id) || id.length === 0) {
                throw new Error("Não foi definido um identificador para o validador");
            }
            let exists = this.commandValidators.hasOwnProperty(id);
            if (exists) {
                throw new Error("Já existe um validador com o id: "+ id);
            }
            this.commandValidators[id] = validator;
		}
		
		/**
		 * Lista os comandos que são aplicáveis à lista de alvos. 
		 */
		public listMatched(targets: CommandTarget[], filter ?: CommandFilter): ng.IPromise<CommandConfig[]> {
			let matched: ng.IDeferred<CommandConfig[]> = this.$q.defer();
			
			this.commandConfigs
				.then((commandsConfig: CommandConfig[]) => {
					matched.resolve(commandsConfig.filter(cmd => cmd.listable && this.match(cmd, targets, filter)));
				}, () => {
					matched.reject("Erro ao carregar comandos!");
				});
			return matched.promise;
		}
		
		/**
		 * Verifica se um comando é valido de acordo com sua configuração.
		 * Um validator deve ser criado para realizar a checagem
		 */
		public isValid(validatorId: string, commandId: string, command: Command): ng.IPromise<boolean> {
			let matched: ng.IDeferred<boolean> = this.$q.defer();
			
			this.findById(commandId)
				.then(commandConfig => {
					matched.resolve(this.verify(validatorId, command));
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
			
			this.commandConfigs
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
		
	    /**
         * Verifica se um comando é válido
         */
        private verify(validatorId: string, command: Command): boolean {
        	let exists = this.commandValidators.hasOwnProperty(validatorId);            
            if (exists) {
                return this.commandValidators[validatorId].isValid(command);
            }
            return true;
        }
        
        /**
         * Retorna os matchers de um command
         */
        private findMatchersById(id: string): CommandMatcher[] {
        	if (this.commandMatchers.hasOwnProperty(id)) {
        		return this.commandMatchers[id];
        	} else {
        		return [];
        	}
        }
        
        /**
         * Varifica se um comando é aplicável ao conjunto de alvos
         */
        private match(command: CommandConfig, targets: CommandTarget[], filter ?: CommandFilter): boolean {
            // match filter
            if (filter) {
                if ((filter.targetType && command.target.type !== filter.targetType) ||
                        (filter.context && command.context !== filter.context)) {
                    return false;
                }
            }
            
            //match mode
            let length = angular.isArray(targets) ? targets.length : 0;
            
            if (!this.isCompatibleMode(command.target.mode, length)) {
                return false
            }
            
            let matchers: CommandMatcher[] = this.findMatchersById(command.id);
            
            //match matchers
            if (!matchers || matchers.length === 0) {
                return true;    
            }
            
            for (let matcher of matchers) {
                if (!matcher.match(targets)) {
                    return false;
                }
            }
            return true;
        }
        
        /**
         * Verifica se o modo do comando é compatível com a quantidade de alvos
         */
        private isCompatibleMode(mode: string, length: number): boolean {
            if ((length === 0 && mode === "None") ||
                (length === 1 && (mode === "One" || mode === "OneOrMany")) ||
                (length > 1  && (mode === "Many" || mode === "OneOrMany"))) {
                return true;
            }
            return false;
        }
		
	}
	
	angular
		.module('app.support.command')
		.service('commandService', CommandService);
}