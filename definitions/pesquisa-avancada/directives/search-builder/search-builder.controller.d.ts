declare namespace app.pesquisaAvancada {
    import IScope = angular.IScope;
    interface SearchBuilderScope extends IScope {
        traits: ITrait[];
        search: ISearch;
    }
    class SearchBuilderController {
        logicalOperators: string[];
        comparisonOperators: Object;
        traitSearchText: string;
        newCriteria: ICriteria;
        traits: ITrait[];
        search: ISearch;
        criteriaOrder: string;
        sortableOptions: Object;
        /** @ngInject **/
        constructor($scope: SearchBuilderScope);
        setCriteriaLogicalOperator(criteria: ICriteria, operator: string): void;
        setAsFavorite(criteria: ICriteria): void;
        removeCriteria(i: any): void;
        querySearch(query: any): ITrait[];
        addNewCriteria(): void;
        getComparisonOperators(dataType: any): Object;
        private createFilterFor(query);
    }
}
