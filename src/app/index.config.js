(function () {
    'use strict';

    angular.module('app').config(config);

    /** @ngInject */
    function config($translatePartialLoaderProvider, $httpProvider, $compileProvider) {
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        $httpProvider.interceptors.push('AuthInterceptor');
        
        // Adiciona o conjunto de strings de tradução
        $translatePartialLoaderProvider.addPart('app/main');
        $compileProvider.debugInfoEnabled(false);
    }

})();