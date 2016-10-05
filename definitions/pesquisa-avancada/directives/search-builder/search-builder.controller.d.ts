declare namespace app.pesquisaAvancada {
    import IScope = angular.IScope;
    import Properties = app.support.constants.Properties;
    import IHttpService = ng.IHttpService;
    interface SearchBuilderScope extends IScope {
        traits: ITrait[];
        search: ISearch;
    }
    class SearchBuilderController {
        private $scope;
        private $http;
        private properties;
        logicalOperators: string[];
        comparisonOperators: Object;
        traitSearchText: string;
        newCriteria: Criteria;
        traits: ITrait[];
        search: ISearch;
        /** @ngInject **/
        constructor($scope: SearchBuilderScope, $http: IHttpService, properties: Properties);
        setCriteriaLogicalOperator(criteria: Criteria, operator: string): void;
        removeCriteria(i: any): void;
        querySearch(query: any): ITrait[];
        addNewCriteria(): void;
        getComparisonOperators(dataType: any): Object;
        private createFilterFor(query);
        private loadTraitValuesIfNeeded(trait);
    }
}
