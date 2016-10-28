namespace app.pesquisaAvancada {
    'use strict';

    declare var moment;
    
    import IScope = angular.IScope;
    import IDirective = angular.IDirective;
    import IAugmentedJQuery = angular.IAugmentedJQuery;
    import IAttributes = angular.IAttributes;
    import IDirectiveFactory = angular.IDirectiveFactory;
    import IDateLocaleService = angular.material.IDateLocaleProvider;

    interface CriteriaValueInputScope extends IScope {
        criteria: Criteria;
        strToDate: Function;
    }

    class CriteriaValueInputDirective implements IDirective {

        public restrict: string = 'E';
        public templateUrl: string = 'app/main/pesquisa-avancada/directives/criteria-value-input/criteria-value-input.html';
        public scope: Object = {
            criteria : "="
        };
    
        constructor(public $mdDateLocale: IDateLocaleService) {}
    
        public link: Function = ($scope: CriteriaValueInputScope, el: IAugmentedJQuery, attrs: IAttributes) => {

            $scope.$watch('criteria.value', function() {
                CriteriaValueInputDirective.updateCriteriaValidity($scope.criteria);
            });

            $scope.$watch('criteria.value[0]', function() {
                CriteriaValueInputDirective.updateCriteriaValidity($scope.criteria);
            });

            $scope.$watch('criteria.value[1]', function() {
                CriteriaValueInputDirective.updateCriteriaValidity($scope.criteria);
            });

            $scope.$watch('criteria.comparisonOperator', (op: ComparisonOperator) => {
                let criteria: Criteria = $scope.criteria,
                    value = criteria.value;

                if (op == ComparisonOperator.BETWEEN) {
                    criteria.value = _.isArray(value) ? value : [value];
                } else {
                    criteria.value = _.isArray(value) ? value[0] : value;
                }
                CriteriaValueInputDirective.updateCriteriaValidity(criteria);
            });
            
            $scope.strToDate = (str: string): Date => {
                return this.$mdDateLocale.parseDate(str);
            }
        };

        private static updateCriteriaValidity(criteria: Criteria): void {
            switch (criteria.comparisonOperator) {
                case ComparisonOperator.EQUALS:
                case ComparisonOperator.CONTAINS:
                case ComparisonOperator.GREATER_THAN:
                case ComparisonOperator.LESS_THAN:
                    if (criteria.trait.dataType == 'date') {
                        criteria.valid = (!!criteria.value);
                    } else {
                        criteria.valid = ((!!criteria.value) && (criteria.value.length > 0));
                    }
                    break;

                case ComparisonOperator.BETWEEN:
                    if (criteria.trait.dataType == 'date') {
                        criteria.valid = ((!!criteria.value[0]) && (!!criteria.value[1]));
                    } else {
                        criteria.valid = ((!!criteria.value[0]) && (!!criteria.value[1]) &&
                                            (criteria.value[0].length > 0) && (criteria.value[1].length > 0));
                    }
                    break;

                case ComparisonOperator.EXISTS:
                    criteria.valid = true;
                    break;
            }
        }

        public static factory(): IDirectiveFactory {
            /** @ngInject **/
            return ($mdDateLocale) => new CriteriaValueInputDirective($mdDateLocale);
        }
    }

    angular
        .module('app.pesquisa-avancada')
        .directive('criteriaValueInput', CriteriaValueInputDirective.factory());
}