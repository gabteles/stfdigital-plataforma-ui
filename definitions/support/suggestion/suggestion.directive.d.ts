/**
 * Diretiva que cria uma caixa de seleção com autocomplete
 *
 * @author Lucas.Rodrigues
 *
 * @since 1.0.0
 */
declare namespace app.support.suggestion {
    interface SuggestionDirectiveScope extends ng.IScope {
        id: string;
        itemText: Function;
        selectedItem: any;
        api: string;
        searchItem: string;
        useDescription: boolean;
    }
    /**
     * Diretiva de sugestao
     * Ex. de uso:
     * &lt;suggestion id="sugerir-processo" ng-model="vm.processo" api="/api/processos/sugestao"
     * search-item="identificacao" item-text="vm.format(item)" use-description="true"&gt;&lt;/suggestion&gt;
     */
    class SuggestionDirective implements ng.IDirective {
        require: ['ngModel'];
        restrict: string;
        templateUrl: string;
        scope: Object;
        constructor();
        link: ng.IDirectiveLinkFn;
        controller: any;
        controllerAs: string;
        static factory(): ng.IDirectiveFactory;
    }
}
