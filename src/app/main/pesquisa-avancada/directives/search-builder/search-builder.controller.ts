namespace app.pesquisaAvancada {
    'use strict';
    import IScope = angular.IScope;
    import Properties = app.support.constants.Properties;
    import IHttpService = ng.IHttpService;

    export interface SearchBuilderScope extends IScope {
        traits: ITrait[];
        search: ISearch;
    }
    
    export class SearchBuilderController {
        
        public logicalOperators: string[] = [LogicalOperator.MUST, LogicalOperator.SHOULD, LogicalOperator.MUST_NOT];
        public comparisonOperators: Object = {
            [ComparisonOperator.EQUALS] : ['string', 'number', 'currency', 'date', 'list'],
            [ComparisonOperator.CONTAINS]: ['string'],
            [ComparisonOperator.BETWEEN]: ['number', 'currency', 'date'],
            [ComparisonOperator.GREATER_THAN]: ['number', 'currency', 'date'],
            [ComparisonOperator.LESS_THAN]: ['number', 'currency', 'date'],
            [ComparisonOperator.EXISTS]: ['constant', 'string', 'number', 'currency', 'date', 'list']
        };
        public traitSearchText: string = '';
        public newCriteria: Criteria = new Criteria();
        public traits: ITrait[];
        public search: ISearch;
        
        /** @ngInject **/
        constructor(private $scope: SearchBuilderScope, private $http: IHttpService, private properties: Properties) {
            $scope.traits.forEach(trait => this.loadTraitValuesIfNeeded(trait));
            this.traits = $scope.traits;
            this.search = $scope.search;
        }

        public setCriteriaLogicalOperator(criteria: Criteria, operator: string): void {
            criteria.logicalOperator = operator;
        }

        public removeCriteria(i): void {
            _.pullAt(this.search.criterias, i);
        }

        public querySearch(query): ITrait[] {
            return query ? _.filter(this.traits, this.createFilterFor(query)) : this.traits;
        }

        public addNewCriteria(): void {
            let trait: ITrait = this.newCriteria.trait;
            let logicalOperator: LogicalOperator = this.newCriteria.logicalOperator;
            let criteria: Criteria = new Criteria(logicalOperator, trait);
            this.traitSearchText = '';
            this.newCriteria.trait = null;
            this.search.criterias.push(criteria);
        }

        public getComparisonOperators(dataType): Object {
            var operatorMapping = this.comparisonOperators;
            var ops = _.keys(operatorMapping);
            return _.reject(ops, op => !_.includes(operatorMapping[op], dataType));
        }

        private createFilterFor(query): Function {
            var lowercaseQuery = angular.lowercase(query);
            return (trait: ITrait): boolean => (trait.name.toLowerCase().indexOf(lowercaseQuery) !== -1);
        }
        
        private loadTraitValuesIfNeeded(trait: ITrait) {
            if (trait.api && !trait.values) {
                trait.values = [];
                this.$http.get(this.properties.apiUrl + trait.api, {cache: true})
                    .then((response: ng.IHttpPromiseCallbackArg<Array<Object>>) => {
                        response.data.forEach(item => {
                            let obj = new TraitListItem(item[trait.apiId], item[trait.apiValue]);                            
                            trait.values.push(obj);
                        });
                    });
            }
        }
        
    }

    angular
        .module('app.pesquisa-avancada')
        .controller('app.pesquisa-avancada.SearchBuilderController', SearchBuilderController);
}