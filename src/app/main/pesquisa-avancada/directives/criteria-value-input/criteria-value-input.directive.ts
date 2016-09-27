namespace app.pesquisaAvancada {
    'use strict';

    import IScope = angular.IScope;
    import IDirective = angular.IDirective;
    import IAugmentedJQuery = angular.IAugmentedJQuery;
    import IAttributes = angular.IAttributes;
    import IDirectiveFactory = angular.IDirectiveFactory;

    interface CriteriaValueInputScope extends IScope {
        criteria: ICriteria;
    }

    class CriteriaValueInputDirective implements IDirective {

        public restrict: string = 'E';
        public templateUrl: string = 'app/main/pesquisa-avancada/directives/criteria-value-input/criteria-value-input.html';
        public scope: Object = {
            criteria : "="
        };
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

            $scope.$watch('criteria.comparisonOperator', (op: ComparisionOperator) => {
                let criteria: ICriteria = $scope.criteria,
                    value = criteria.value;

                if (op == ComparisionOperator.ENTRE) {
                    criteria.value = _.isArray(value) ? value : [value];
                } else {
                    criteria.value = _.isArray(value) ? value[0] : value;
                }
                CriteriaValueInputDirective.updateCriteriaValidity(criteria);
            });
        };

        private static updateCriteriaValidity(criteria: ICriteria): void {
            switch (criteria.comparisonOperator) {
                case ComparisionOperator.IGUAL:
                case ComparisionOperator.CONTEM:
                case ComparisionOperator.MAIORQUE:
                case ComparisionOperator.MENORQUE:
                    if (criteria.trait.dataType == 'date') {
                        criteria.valid = (!!criteria.value);
                    } else {
                        criteria.valid = ((!!criteria.value) && ((<Array<any>> criteria.value).length > 0));
                    }
                    break;

                case ComparisionOperator.ENTRE:
                    if (criteria.trait.dataType == 'date') {
                        criteria.valid = ((!!criteria.value[0]) && (!!criteria.value[1]));
                    } else {
                        criteria.valid = ((!!criteria.value[0]) && (!!criteria.value[1]) && (criteria.value[0].length > 0) && (criteria.value[1].length > 0));
                    }
                    break;

                case ComparisionOperator.EXISTE:
                    criteria.valid = true;
                    break;
            }
        }

        public static factory(): IDirectiveFactory {
            return () => new CriteriaValueInputDirective();
        }
    }

    angular
        .module('app.pesquisa-avancada')
        .directive('criteriaValueInput', CriteriaValueInputDirective.factory());
}