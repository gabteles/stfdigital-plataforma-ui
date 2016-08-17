/**
 * Diretiva que cria um botão com dropdown da lista de ações pertinentes aos
 * recursos, ou desabilita um botão, ou link para uma única ação
 * 
 * @author Lucas.Rodrigues
 * 
 * @since 1.0.0
 */
namespace app.support.command {
	'use strict';
	
	export interface CommandListDirectiveScope extends ng.IScope {
		commandsConfig: CommandConfig[];
		targets: CommandTarget[];
		targetType: string;
		context: string;
	
		go(index: number): void;
	}
	
	/**
	 * Diretiva de lista de comandos
	 * Ex. de uso: 
	 * &lt;commands targets="vm.recursos" context="autuacao" target-type="Processo"&gt;&lt;/commands&gt;
	 */
	export class CommandListDirective implements ng.IDirective {
		
		public restrict: string = 'AE';
		public templateUrl: string = 'app/main/support/command/commands.tpl.html';
		public scope: Object = {
				targets : '=', //obrigatório, recursos que sofrerão
				targetType : '@', //opcional, filtra os comandos de um determinado objeto alvo
				context : '@', //opcional, filtra os comandos de um determinado contexto	
		};
	
		public constructor(private commandService: CommandService, private $state: ng.ui.IStateService) { }
	
		public link: ng.IDirectiveLinkFn = ($scope: CommandListDirectiveScope): void => {
			
			let filter: CommandFilter = null;
		
			if ($scope.context || $scope.targetType) {
				filter = <CommandFilter> {
					context: $scope.context,
					targetType: $scope.targetType
				};
			}
			//remove undefined property
			filter = _.pickBy(filter);
			
			var listCommands = () => {
				//serviço que lista os comandos
				this.commandService.listMatched($scope.targets, filter)
					.then((commandsConfig: CommandConfig[]) => {
						$scope.commandsConfig = commandsConfig;
					});
			};
			
			//os comandos devem ser recarregadas sempre que a quantidade de objetos mudar
			$scope.$watchCollection(() => $scope.targets, listCommands);
			
			//vai para o estado de uma ação selecionada, passando o target como parâmetro
			$scope.go = (index: number) => {
				let commandConfig: CommandConfig = $scope.commandsConfig[index]; 
				let params: any = {	};
				let targets = $scope.targets;  
				
				if (angular.isArray(targets)) {
					if (targets.length > 1) {
						params.targets = targets;
					} else if (targets.length === 1) {
						params.target = targets[0];
					}
				}
				this.$state.go(commandConfig.route.stateName, params);
			};
		}
	
	    public static factory(): ng.IDirectiveFactory {
	        /** @ngInject **/
	    	let directive = (commandService: CommandService, $state: ng.ui.IStateService) => new CommandListDirective(commandService, $state);
	    	return directive;
	    }
	}
	
	export interface CommandDirectiveScope extends ng.IScope {
		command: Command;
	    validator: string;
	}
	
	/**
	 * Bot&atilde;o de um comando espec&iacute;fico
	 * Ex. de uso: 
	 * &lt;button id="registrar" command="vm.command" validator="validadorRegistro"&gt;Executar&lt;/button&gt; 
	 */
	export class CommandDirective implements ng.IDirective {
		
		public restrict: string = 'A';
		public scope: Object = {
			command : '=', //obrigatório, comando que será validado
			validator: '@' //opcional, validador para o comando, caso não informado procura por um com mesmo id do comando
		};
		
		public constructor(private commandService: CommandService, private $state: ng.ui.IStateService) { }
		
		public link: ng.IDirectiveLinkFn = ($scope: CommandDirectiveScope, element: ng.IAugmentedJQuery): void => {
			
			if (angular.isUndefined($scope.command)) {
				throw new Error("Comando não definido!");
			}
			
			let stopClick = (event: JQueryEventObject) => {
				event.preventDefault();
				event.stopPropagation();
			}
			
			let commandId: string = element.attr('id');
			let validatorId: string = angular.isString($scope.validator) ? $scope.validator : commandId;
			
			if (angular.isString(commandId) && commandId.length > 0) {
			
				$scope.$watch('command', () => {
					this.commandService.isValid(validatorId, commandId, $scope.command)
						.then(valid => {
							if (valid) {
								element.removeAttr('disabled');
								element.unbind('click', stopClick)
							} else {
								element.attr('disabled', 'disabled');
								element.bind('click', stopClick);
							}
						});
				}, true);
			}
		}
		
	    public static factory(): ng.IDirectiveFactory {
	    	/** @ngInject **/
	        let directive = (commandService: CommandService, $state: ng.ui.IStateService) => new CommandDirective(commandService, $state);
	        return directive;
	    }
	    
	}
	
	angular
		.module('app.support.command')
		.directive('commands', CommandListDirective.factory())
		.directive('command', CommandDirective.factory());
	
}