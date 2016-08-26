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
        id: number,
        label: string,
        criterias: ICriteria[]
    }

    export interface ICriteria {
        id: number;
        value: string | Array<string>;
        trait: ITrait;
        logicalOperator: string;
        comparisonOperator: ComparisionOperator;
        isFavorite: boolean;
        valid: boolean;
    }

    export interface ITrait {
        id: string;
        name: string;
        dataType: string;
        values: string[];
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