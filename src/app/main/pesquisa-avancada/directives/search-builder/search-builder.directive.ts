namespace app.pesquisaAvancada {
    'use strict';
    
    import IDirective = angular.IDirective;
    import IDirectiveFactory = angular.IDirectiveFactory;

    export class ComparisionOperator {
        public static get EQUALS(): string { return 'EQUALS'; }
        public static get CONTAINS(): string { return 'CONTAINS'; }
        public static get BETWEEN(): string { return 'BETWEEN'; }
        public static get GREATER_THAN(): string { return 'GREATER_THAN'; }
        public static get LESS_THAN(): string { return 'LESS_THAN'; }
        public static get EXISTS(): string { return 'EXISTS'; }
    }
    
    export class LogicalOperator {
        public static get MUST(): string { return 'MUST'; }
        public static get SHOULD(): string { return 'SHOULD'; }
        public static get MUST_NOT(): string { return 'MUST_NOT'; }
    }
    
    export class TraitListItem {

        constructor(public id: any, public value: any) {};
    }

    export interface ITrait {
        id: string;
        name: string;
        field: string;
        dataType: string;
        values ?: Array<TraitListItem>;
        api ?: string;
        apiId ?: string;
        apiValue ?: string;
    }

    export class Criteria {
        
        public comparisonOperator: ComparisionOperator = ComparisionOperator.EQUALS;
        public value: any;
        public valid: boolean = false;
        private group = false;
    
        constructor(public logicalOperator?: LogicalOperator, public trait?: ITrait) {
            if (trait && trait.dataType === 'constant') {
                this.comparisonOperator = ComparisionOperator.EXISTS;
                this.value = trait.name;    
            }
            if (!logicalOperator) {
                this.logicalOperator = LogicalOperator.MUST;
            }
        }
    }
    
    export interface IResultColumn {
        header: {
            title : string;
            css : string;
            translate: string;
        },
        result: {
            field: string;
            css : string;
        }
    }
    
    export interface ISearchConfig {
        traits: ITrait[];
        resultColumns: IResultColumn[];
        api: string;
        context: string;
    }
    
    export interface ISearch {
        
        id: number;
        label: string;
        context: string;
        executable: boolean;
        criterias: Criteria[];
    }
    
    class SearchBuilderDirective implements IDirective {
        
        public restrict: string = 'E';
        public templateUrl: string = 'app/main/pesquisa-avancada/directives/search-builder/search-builder.html';

        public scope: Object = {
            traits: '=',
            search: '='
        };
        public controller: any = SearchBuilderController;
        public controllerAs: string = 'vm';
        
        constructor() { }

        public static factory(): IDirectiveFactory {
            return () => new SearchBuilderDirective();
        }
        
    }

    angular
        .module('app.pesquisa-avancada')
        .directive('searchBuilder', SearchBuilderDirective.factory())
}