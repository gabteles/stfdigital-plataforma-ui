/**
 * @author Fabrício Mendonça
 * 
 * @since 1.2.0
 * @since 18.10.2016
 */
namespace app.autenticacao{
	'use strict';
	
	export class AuthInterceptor{

		constructor(
			private $q,
			private $window,
			private $cookies
		){
			this.request = this.request.bind(this);
			this.responseError = this.responseError.bind(this);
		}

		public request(config): any{
			let accessToken = this.$cookies.get('access_token');

			// Para viabilizar a transferência do token CSRF entre domínios diferentes, estamos usando
			// o token de acesso, gerado no Auth Server como token CSRF
	        if (accessToken) {
	            config.headers.Authorization = 'Bearer ' + accessToken;
	            config.headers['X-XSRF-TOKEN'] = accessToken;
	        }

	        return config;
		}

		public responseError(response): any{
			// Detecta um token inválido.
			if (response.status === 401 && response.data && response.data.error === 'invalid_token') {
				// Caso tenha detectado um token inválido e não esteja tentando acessar o login, limpa esse token
				// e redireciona para o login
				if (!this.$window.location.href.endsWith('/login') && this.$cookies.get('access_token')) {
					// 
					this.$cookies.remove('access_token')
					this.$window.location.href = '/login';
				}
				return this.$q.reject(response);
			}
			
	        return this.$q.reject(response);
		}
	}

	angular
		.module('app.autenticacao').service('AuthInterceptor', AuthInterceptor);
}