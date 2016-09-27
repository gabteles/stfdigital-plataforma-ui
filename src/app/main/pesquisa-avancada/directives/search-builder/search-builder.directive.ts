namespace app.pesquisaAvancada {
    'use strict';
    
    import IDirective = angular.IDirective;
    import IDirectiveFactory = angular.IDirectiveFactory;

    export class ComparisionOperator {
        public static get IGUAL(): string { return 'IGUAL'; }
        public static get CONTEM(): string { return 'CONTEM'; }
        public static get ENTRE(): string { return 'ENTRE'; }
        public static get MAIORQUE(): string { return 'MAIOR-QUE'; }
        public static get MENORQUE(): string { return 'MENOR-QUE'; }
        public static get EXISTE(): string { return 'EXISTE'; }
    }

    export interface ISearch {
        id: number;
        label: string;
        context: string;
        executable: boolean;
        criterias: ICriteria[];
    }

    export interface ICriteria {
        value: number | string | Array<string | number>;
        trait: ITrait;
        logicalOperator: string;
        comparisonOperator: ComparisionOperator;
        valid: boolean;
    }
    
    export class ITraitListItem {

        constructor(public id: any, public value: any) {};
    }

    export interface ITrait {
        id: string;
        name: string;
        field: string;
        dataType: string;
        values ?: Array<ITraitListItem>;
        api ?: string;
        apiId ?: string;
        apiValue ?: string;
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