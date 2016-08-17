/**
 * Diretiva que cria uma caixa de seleção com autocomplete
 * 
 * @author Lucas.Rodrigues
 * 
 * @since 1.0.0
 */
namespace app.support.suggestion {
    'use strict';
    
    export interface SuggestionDirectiveScope extends ng.IScope {
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
    export class SuggestionDirective implements ng.IDirective {
        
        public require: ['ngModel'];
        public restrict: string = 'AE';
        public templateUrl: string = 'app/main/support/suggestion/suggestion.tpl.html';
        public scope: Object = {
                id : '@', //obrigatório, identificador do suggestion
                selectedItem : '=ngModel', //obrigatório, bind do item selecionado
                api: '@', //obrigatório, api que será consumida
                searchItem: '@', //obrigatório, item que será sugerido
                itemText : '&', //opcional, callback de formatação do texto item
                useDescription: '@' //opcional, Boleano que indica se deve usar a descrição como placeholder
        };
    
        public constructor() { }
    
        public link: ng.IDirectiveLinkFn = (scope: SuggestionDirectiveScope, el: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {
            
        	if (angular.isUndefined(scope.id) || angular.isUndefined(scope.selectedItem)
        			|| angular.isUndefined(scope.api) || angular.isUndefined(scope.searchItem)) {
        		throw new Error("Parâmetros insuficientes para execução da diretiva de sugestão.");
        	}
        	if (angular.isUndefined(scope.useDescription)) {
        		scope.useDescription = false
        	}
        	if (angular.isUndefined(attrs.$attr['itemText'])) {
        		scope.itemText = undefined;
        	}
        }
        
        public controller: any = SuggestionDirectiveController;
        public controllerAs: string = 'vm';
    
        public static factory(): ng.IDirectiveFactory {
            return () => new SuggestionDirective();
        }
    }
    
    angular
        .module('app.support.suggestion')
        .directive('suggestion', SuggestionDirective.factory());
    
}