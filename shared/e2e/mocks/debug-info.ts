declare var angular;

/**
 * É necessário habilitar o debug info para o correto funcionamento do protractor 
 * 
 */
function debugInfoModuleDefineFunction() {

    let debugInfoModule = angular.module('e2e.debug.info', ['app']);

    debugInfoModule.config(['$compileProvider', ($compileProvider) => {
        $compileProvider.debugInfoEnabled(true);
    }]);
}

export default debugInfoModuleDefineFunction;