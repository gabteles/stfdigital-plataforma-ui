namespace app.pesquisaAvancada {
    'use strict';
    
    import IFilterDate = ng.IFilterDate;
    import ITranslateService = ng.translate.ITranslateService;
    import IFilterService = ng.IFilterService;

    class CriteriaDisplayNameFilter {

        private static getFilter($filter: IFilterService, $translate: ITranslateService): Function {

            return (criteria: Criteria) => {

                let date: IFilterDate = $filter('date');
                let name: string | number | Array<string | number> = angular.copy(criteria.value);

                if (criteria.trait.dataType === 'date') {
                    if (_.isArray(name)) {
                        name[0] = date(name[0], 'dd/MM/yyyy');
                        name[1] = date(name[1], 'dd/MM/yyyy');
                    } else {
                        name = date(<string> name, 'dd/MM/yyyy');
                    }
                }
                
                switch (criteria.comparisonOperator) {
                    case ComparisionOperator.BETWEEN :
                        name = (name[0] || '') + ' < ' + criteria.trait.name + ' < ' + (name[1] || '');
                        break;

                    case ComparisionOperator.GREATER_THAN:
                        name = criteria.trait.name + ' > ' + name;
                        break;

                    case ComparisionOperator.LESS_THAN:
                        name = criteria.trait.name + ' < ' + name;
                        break;

                    case ComparisionOperator.EXISTS:
                        name = "Existe";
                }
                return <string> name;
            };
        }

        public static filter(): Function {
            /** @ngInject **/
            return ($filter, $translate) => CriteriaDisplayNameFilter.getFilter($filter, $translate);
        }
    }

    angular
        .module('app.pesquisa-avancada')
        .filter('criteriaDisplayName', CriteriaDisplayNameFilter.filter());
}