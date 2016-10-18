/**
 * @author Rodrigo Barreiros
 * 
 * @since 1.0.0
 * @since 24.06.2016
 */
(function() {
	'use strict';

	angular.module('app.core').service('AuthService', function($http, $cookies, $httpParamSerializer, $q, $rootScope, properties) {

		var USER_QUERY_URL = properties.url + ':' + properties.port + '/identidades/user';

		var OAUTH_TOKEN_URL = properties.url + ':' + properties.port + '/identidades/oauth/token';

		var AUTH_POST_CONTENT_TYPE = 'application/x-www-form-urlencoded; charset=utf-8';

		var ACCESS_TOKEN = 'access_token';

		/**
		 * Verifica se o usuário já se autenticou no sistema. A verificação aqui checa se o token de acesso previamente 
		 * armazenado (durante o login do usuário) ainda está válido no servidor.
		 */
		this.isAuthenticated = function() {
			return $http.get(USER_QUERY_URL).then(function(response) {    
				return response.data;
			});
		};

		/**
		 * Utiliza a API fornecida pelo Oauth2 para solicitar um token de acesso. Utiliza 'password'
		 * como grant type e Basic Authorization para informar as credenciais do cliente.
		 */
		this.authenticate = function(usuario, senha) {
			var data = {username: usuario, password: senha, grant_type: 'password'};
			var request = {
				method: 'POST',
				url: OAUTH_TOKEN_URL,
				headers: {
					'Authorization': 'Basic ' + btoa('userinterface:userinterface'),
                	'Content-type': AUTH_POST_CONTENT_TYPE
				},
				data: $httpParamSerializer(data)
			};
			
			return $http(request).then(function(response) {				
				$cookies.put(ACCESS_TOKEN, response.data.access_token);
				$rootScope.$broadcast('user:logged');
				return response.data;
			});
		};

		/**
		 * Invalida a seção no serviço de autenticação e remove o cookie com o token de acesso.
		 */	
		this.logout = function() {
			$rootScope.$broadcast('user:exited');
			$cookies.remove(ACCESS_TOKEN);
		};
		
	});
})();