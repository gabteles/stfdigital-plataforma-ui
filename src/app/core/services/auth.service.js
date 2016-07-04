/**
 * @author Rodrigo Barreiros
 * 
 * @since 1.0.0
 * @since 24.06.2016
 */
(function() {
	'use strict';

	angular.module('app.core').service('AuthService', function($http, $cookies, $httpParamSerializer, $q, properties) {

		/**
		 * Verifica se o usuário já se autenticou no sistema. A verificação aqui apenas checa se o token
		 * de acesso foi previamente armazenado, não verifica se ele ainda está válido no servidor.
		 */
		this.isAuthenticated = function() {
			return (typeof $cookies.get("access_token") != 'undefined');
		};

		this.user = function () {
			return $http.get(properties.url + ":" + properties.port + '/userauthentication/user');
		}

		/**
		 * Utiliza a API fornecida pelo Oauth2 para solicitar um token de acesso. Utiliza 'password'
		 * como grant type e Basic Authorization para informar as credenciais do cliente.
		 */
		this.login = function(usuario, senha) {
			var deferred = $q.defer();
			var data = {username: usuario, password: senha, grant_type: 'password'};
			var req = {
				method: 'POST',
				url: properties.url + ":" + properties.port + "/userauthentication/oauth/token",
				headers: {
					"Authorization": "Basic " + btoa('userinterface:userinterface'),
                	"Content-type": "application/x-www-form-urlencoded; charset=utf-8"
				},
				data: $httpParamSerializer(data)
			}	
			
			$http(req).success(function(data) {				
				$cookies.put('access_token', data.access_token);
				$cookies.put('XSRF-TOKEN', data.access_token);
				deferred.resolve();
			}).error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}

		/**
		 * Invalida a seção no serviço de autenticação e remove o cookie com o token de acesso.
		 */	
		this.logout = function() {
			$cookies.remove('access_token');
		}
		
	});
})();