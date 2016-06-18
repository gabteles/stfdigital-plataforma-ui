/**
 * Diretiva que cria um botão com dropdown da lista de ações pertinentes aos
 * recursos, ou cria um botão específico para uma única ação
 * 
 * @author Lucas.Rodrigues
 * 
 * @since 1.0.0
 */
namespace app.support.command {
	'use strict';
	
	export interface CommandListDirectiveScope extends ng.IScope {
		commands: Command[];
		targets: CommandTarget<any>[];
		targetType: string;
		context: string;
	
		go(index: number): void;
	}
	
	/**
	 * Diretiva de lista de comandos
	 * Ex. de uso: 
	 * &lt;commands targets="vm.recursos" context="autuacao" targetType="Processo"&gt;&lt;/commands&gt;
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
	
		public link($scope: CommandListDirectiveScope): void {
			
			let filter: FilterCommand = <FilterCommand>{
				context: $scope.context,
				targetType: $scope.targetType
			}
			
			var listCommands = (commandService: CommandService): Function => {
				return (n: CommandTarget<any>[], v: CommandTarget<any>[]) => {
					//serviço que lista os comandos
					commandService.listMatched($scope.targets, filter)
						.then((commands: Command[]) => {
							$scope.commands = commands;
						});
					}
			};
			
			//os comandos devem ser recarregadas sempre que a quantidade de objetos mudar
			$scope.$watchCollection('targets', listCommands(this.commandService)());
			
			//vai para o estado de uma ação selecionada, passando o target como parâmetro
			$scope.go = (index: number) => {
				let command: Command = $scope.commands[index]; 
				let params: any = {	};
				let targets = $scope.targets;  
				
				if (angular.isArray(targets)) {
					if (targets.length > 1) {
						params.targets = targets;
					} else if (targets.length === 1) {
						params.target = targets[0];
					}
				}
				this.$state.go(command.route.stateName, params);
			};
		}
	
	    public static factory(): ng.IDirectiveFactory {
	        let directive = (commandService: CommandService, $state: ng.ui.IStateService) => {
	        	return new CommandListDirective(commandService, $state);
	        }
	        directive.$inject = ['app.support.command.CommandService', '$state'];
	        return directive;
	    }
	}
	
	export interface CommandDirectiveScope extends ng.IScope {
		targets: CommandTarget<any>[]
	}
	
	export interface CommandDirectiveAttributes extends ng.IAttributes {
		id: string;
	}
	
	/**
	 * Bot&atilde;o de um comando espec&iacute;fico
	 * Ex. de uso: 
	 * &lt;button id="registrar" targets="vm.recursos"&gt;Executar&lt;/button&gt; 
	 */
	export class CommandDirective implements ng.IDirective {
		
		public restrict: string = 'A';
		
		public constructor(private commandService: CommandService, private $state: ng.ui.IStateService) { }
		
		public link($scope: CommandDirectiveScope, element: ng.IAugmentedJQuery, attrs: CommandDirectiveAttributes): void {
			
			attrs.$set('disabled', 'disabled');
			
			$scope.$watchCollection('targets', () => {
				this.commandService.match(attrs.id, $scope.targets)
					.then(match => (match) ? attrs.$set('disabled', '') : angular.noop());
			});
						
		}
		
	    public static factory(): ng.IDirectiveFactory {
	        let directive = (commandService: CommandService, $state: ng.ui.IStateService) => {
	        	return new CommandDirective(commandService, $state);
	        }
	        directive.$inject = ['app.support.command.CommandService', '$state'];
	        return directive;
	    }
		
	}
	
	angular
		.module('app.support.command')
		.directive('commands', CommandListDirective.factory())
		.directive('command', CommandDirective.factory());
	
}