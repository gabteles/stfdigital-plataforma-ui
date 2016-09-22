/**
 * Diretiva que cria um botão com dropdown da lista de ações pertinentes aos
 * recursos, ou desabilita um botão, ou link para uma única ação
 *
 * @author Lucas.Rodrigues
 *
 * @since 1.0.0
 */
declare namespace app.support.command {
    interface CommandListDirectiveScope extends ng.IScope {
        commandsConfig: CommandConfig[];
        targets: CommandTarget[];
        targetType: string;
        context: string;
        go(commandConfig: CommandConfig): void;
    }
    /**
     * Diretiva de lista de comandos
     * Ex. de uso:
     * &lt;commands targets="vm.recursos" context="autuacao" target-type="Processo"&gt;&lt;/commands&gt;
     */
    class CommandListDirective implements ng.IDirective {
        private commandService;
        private $state;
        restrict: string;
        templateUrl: string;
        scope: Object;
        constructor(commandService: CommandService, $state: ng.ui.IStateService);
        link: ng.IDirectiveLinkFn;
        static factory(): ng.IDirectiveFactory;
    }
    interface CommandDirectiveScope extends ng.IScope {
        command: Command;
        validator: string;
        id: string;
    }
    /**
     * Bot&atilde;o de um comando espec&iacute;fico
     * Ex. de uso:
     * &lt;button id="registrar" command="vm.command" validator="validadorRegistro"&gt;Executar&lt;/button&gt;
     */
    class CommandDirective implements ng.IDirective {
        private commandService;
        private $state;
        restrict: string;
        scope: Object;
        constructor(commandService: CommandService, $state: ng.ui.IStateService);
        link: ng.IDirectiveLinkFn;
        static factory(): ng.IDirectiveFactory;
    }
}
