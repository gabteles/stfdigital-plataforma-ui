namespace app.support {
    'use strict';

    export interface StfMatchesScope {
        stfMatches: Object;
        $watch: Function;
    }
    export class StfMatches implements ng.IDirective {
        public scope: Object = {
            stfMatches: '='
        };
        public require: string = 'ngModel';

        constructor(){
            
        }

        public link($scope: StfMatchesScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any): void{
            ctrl.$validators.matches = (modelValue) => {
                if (ctrl.$isEmpty(modelValue) && ctrl.$isEmpty($scope.stfMatches)) {
                    return true;
                }
                
                return (modelValue === $scope.stfMatches);
            };

            $scope.$watch("stfMatches", () => {
                ctrl.$validate();
            });
        }

        public static factory(): ng.IDirectiveFactory {
            return () => {
                "ngInject";
                return new StfMatches();
            }
        }
    }
    
    angular
        .module('app.support')
        .directive('stfMatches', StfMatches.factory());
}
