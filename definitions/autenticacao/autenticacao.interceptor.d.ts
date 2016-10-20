/**
 * @author Fabrício Mendonça
 *
 * @since 1.2.0
 * @since 18.10.2016
 */
declare namespace app.autenticacao {
    class AuthInterceptor {
        private $q;
        private $window;
        private $cookies;
        constructor($q: any, $window: any, $cookies: any);
        request(config: any): any;
        responseError(response: any): any;
    }
}
