(function () {
    'use strict';

    angular.module('app').run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, $log, $http, properties, AuthService) {

        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

            $rootScope.loadingProgress = true;

            AuthService.isAuthenticated().then(function(user) {
                // Se já está logado e solicita a página de login, deve ser redirecionado para o inbox de tarefas    
                if (toState.url === '/login') {
                    event.preventDefault();
                    $state.go('app.tarefas.minhas-tarefas');
                }
            }).catch(function() {
                // Se não está logado e solicita uma página protegida, deve ser redirecionado para a página de login     
                if (toState.url !== '/login') {
                    event.preventDefault();
                    $state.go('app.login');
                }
            });

        });

        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function () {
            $timeout(function () {
                $rootScope.loadingProgress = false;
            });
        });
        
        var stateChangeErrorEvent = $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        	$log.error(error);
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function () {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
            stateChangeErrorEvent();
        });
    }
})();
