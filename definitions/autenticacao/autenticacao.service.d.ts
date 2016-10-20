/**
 * @author Rodrigo Barreiros
 *
 * @since 1.0.0
 * @since 24.06.2016
 */
declare namespace app.autenticacao {
    class AuthService {
        private $http;
        private $cookies;
        private $httpParamSerializer;
        private $q;
        private $rootScope;
        private properties;
        USER_QUERY_URL: string;
        OAUTH_TOKEN_URL: string;
        AUTH_POST_CONTENT_TYPE: string;
        ACCESS_TOKEN: string;
        constructor($http: any, $cookies: any, $httpParamSerializer: any, $q: any, $rootScope: any, properties: any);
        /**
         * Verifica se o usuário já se autenticou no sistema. A verificação aqui checa se o token de acesso previamente
         * armazenado (durante o login do usuário) ainda está válido no servidor.
         */
        isAuthenticated(): any;
        /**
         * Utiliza a API fornecida pelo Oauth2 para solicitar um token de acesso. Utiliza 'password'
         * como grant type e Basic Authorization para informar as credenciais do cliente.
         */
        authenticate(usuario: string, senha: string): any;
        /**
         * Invalida a seção no serviço de autenticação e remove o cookie com o token de acesso.
         */
        logout(): void;
    }
}
