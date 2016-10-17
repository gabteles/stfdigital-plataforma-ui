namespace app.support{
    'use strict';

    export class StfCpf implements ng.IDirective{
        public require: string = 'ngModel';

        constructor(private cpfService: CPFService){
            
        }

        public link($scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any): void{
            ctrl.$validators.cpf = (modelValue, viewValue) => {
                if (ctrl.$isEmpty(modelValue)) {
                    return true;
                }

                return this.cpfService.validarCPF(modelValue);
            };
        }

        public static factory():ng.IDirectiveFactory{
            return (cpfService: CPFService) => {
                "ngInject";

                return new StfCpf(cpfService);
            }
        }
    }

    angular
        .module('app.support')
        .directive('stfCpf', StfCpf.factory());
}