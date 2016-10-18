/**
 * @author Rodrigo Barreiros
 * 
 * @since 1.0.0
 * @since 24.06.2016
 */
namespace app.autenticacao{
	'use strict';
	export class AuthService {
		public USER_QUERY_URL:string;
		public OAUTH_TOKEN_URL:string;
		public AUTH_POST_CONTENT_TYPE:string = 'application/x-www-form-urlencoded; charset=utf-8';
		public ACCESS_TOKEN = 'access_token';
		constructor(
			private $http, 
			private $cookies, 
			private $httpParamSerializer, 
			private $q, 
			private $rootScope, 
			private properties
		){
			let baseUrl: string = this.properties.url + ':' + this.properties.port;
			this.USER_QUERY_URL = baseUrl + '/userauthentication/user';
			this.OAUTH_TOKEN_URL = baseUrl + '/userauthentication/oauth/token';
		}

		/**
		 * Verifica se o usuário já se autenticou no sistema. A verificação aqui checa se o token de acesso previamente 
		 * armazenado (durante o login do usuário) ainda está válido no servidor.
		 */
		public isAuthenticated():any{
			return this.$http.get(this.USER_QUERY_URL).then((response) => {    
				return response.data;
			});
		}

		/**
		 * Utiliza a API fornecida pelo Oauth2 para solicitar um token de acesso. Utiliza 'password'
		 * como grant type e Basic Authorization para informar as credenciais do cliente.
		 */
		public authenticate(usuario: string, senha: string): any{
			let data = {username: usuario, password: senha, grant_type: 'password'};
			let request = {
				method: 'POST',
				url: this.OAUTH_TOKEN_URL,
				headers: {
					'Authorization': 'Basic ' + btoa('userinterface:userinterface'),
                	'Content-type': this.AUTH_POST_CONTENT_TYPE
				},
				data: this.$httpParamSerializer(data)
			};
			
			return this.$http(request).then((response) => {				
				this.$cookies.put(this.ACCESS_TOKEN, response.data.access_token);
				this.$rootScope.$broadcast('user:logged');
				return response.data;
			});
		}

		/**
		 * Invalida a seção no serviço de autenticação e remove o cookie com o token de acesso.
		 */	
		public logout(): void{
			this.$rootScope.$broadcast('user:exited');
			this.$cookies.remove(this.ACCESS_TOKEN);
		}
	}

	angular
		.module('app.autenticacao')
		.service('AuthService', AuthService);
}