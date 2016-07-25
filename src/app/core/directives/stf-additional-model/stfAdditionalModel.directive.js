(function () {
    'use strict';

    /**
     * Diretiva que permite fazer o bind adicional de uma variável
     * quando usado em combinação com o ng-model. Esse bind é apenas
     * one-way, sincronizando o $modelValue atual do ng-model com
     * a variável especificada nessa diretiva.
     */
    angular
        .module('app.core')
        .directive('stfAdditionalModel', stfAdditionalModel);

    /** @ngInject */
    function stfAdditionalModel() {
        return {
            require: 'ngModel',
            scope: {
                stfAdditionalModel: '='
            },
            link: function(scope, elm, attrs, ngModel) {
                scope.$watch(function() {
                    return ngModel.$modelValue;
                }, function(modelValue) {
                    scope.stfAdditionalModel = modelValue;
                });
            }
        };
    }

})();