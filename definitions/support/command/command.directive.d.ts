/**
 * Diretiva que cria um botão com dropdown da lista de ações pertinentes aos
 * recursos, ou cria um botão específico para uma única ação
 *
 * @author Lucas.Rodrigues
 *
 * @since 1.0.0
 */
declare namespace app.support.command {
    interface CommandListDirectiveScope extends ng.IScope {
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
    class CommandListDirective implements ng.IDirective {
        private commandService;
        private $state;
        restrict: string;
        templateUrl: string;
        scope: Object;
        constructor(commandService: CommandService, $state: ng.ui.IStateService);
        link($scope: CommandListDirectiveScope): void;
        static factory(): ng.IDirectiveFactory;
    }
    interface CommandDirectiveScope extends ng.IScope {
        targets: CommandTarget<any>[];
    }
    interface CommandDirectiveAttributes extends ng.IAttributes {
        id: string;
    }
    /**
     * Bot&atilde;o de um comando espec&iacute;fico
     * Ex. de uso:
     * &lt;button id="registrar" targets="vm.recursos"&gt;Executar&lt;/button&gt;
     */
    class CommandDirective implements ng.IDirective {
        private commandService;
        private $state;
        restrict: string;
        constructor(commandService: CommandService, $state: ng.ui.IStateService);
        link($scope: CommandDirectiveScope, element: ng.IAugmentedJQuery, attrs: CommandDirectiveAttributes): void;
        static factory(): ng.IDirectiveFactory;
    }
}
