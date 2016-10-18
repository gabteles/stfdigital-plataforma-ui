/**
 * @author Fabrício Mendonça
 * 
 * @since 1.2.0
 * @since 18.10.2016
 */
namespace app.autenticacao{
    /** @ngInject */
    function config($httpProvider){
        $httpProvider.interceptors.push('AuthInterceptor');
    }
    angular
        .module('app.autenticacao', [])
        .config(config);
}