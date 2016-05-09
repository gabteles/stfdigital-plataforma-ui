(function ()
{
    'use strict';

    angular
        .module('app')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, $log)
    {
        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState, toParams)
        {
            $rootScope.loadingProgress = true;

            if (toState.redirectTo) {
                event.preventDefault();
                $state.go(toState.redirectTo, toParams);
            }
        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
        {
            $timeout(function ()
            {
                $rootScope.loadingProgress = false;
            });
        });
        
        var stateNotFoundEvent = $rootScope.$on('$stateNotFound', function(event, unfoundState)
        {
            $log.warn('State: "' + unfoundState.to + '" not found');
        });
        
        var stateChangeErrorEvent = $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error)
        {
        	$log.error(error);
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
            stateNotFoundEvent();
            stateChangeErrorEvent();
        });
    }
})();
