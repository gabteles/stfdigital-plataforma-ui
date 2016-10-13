namespace app.support{
    'use strict';

    export interface StfAdditionalModelScope {
        stfAdditionalModel: Object;
        $watch: Function;
    }

    /**
     * Diretiva que permite fazer o bind adicional de uma variável
     * quando usado em combinação com o ng-model. Esse bind é apenas
     * one-way, sincronizando o $modelValue atual do ng-model com
     * a variável especificada nessa diretiva.
     */
    export class StfAdditionalModel implements ng.IDirective {
        public scope: Object = {
            stfAdditionalModel: '='
        };

        public require: string = 'ngModel';

        constructor() {

        }

        public link($scope: StfAdditionalModelScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: any) :void {
            $scope.$watch(
                () => {
                    return ngModel.$modelValue;
                },
                (modelValue) => {
                    $scope.stfAdditionalModel = modelValue;
                }
            );
        }

        public static factory(): ng.IDirectiveFactory {
            return () => {
                "ngInject";
                return new StfAdditionalModel();
            }
        }
    }

    angular
        .module('app.support')
        .directive('stfAdditionalModel', StfAdditionalModel.factory());
}