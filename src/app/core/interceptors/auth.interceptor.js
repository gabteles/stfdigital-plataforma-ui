/**
 * @author Rodrigo Barreiros
 * 
 * @since 1.0.0
 * @since 24.06.2016
 */
(function() {
	'use strict';

	angular.module('app.core').service('AuthInterceptor', function ($q, $window, $cookies) {
		
	    this.request = function(config) {
	        var accessToken = $cookies.get('access_token');

	        if (accessToken) {
	            config.headers.Authorization = 'Bearer ' + accessToken;
	        }

			var csrfToken = $cookies.get('XSRF-TOKEN');

	        if (csrfToken) {
	            config.headers['X-XSRF-TOKEN'] = csrfToken;
	        }

	        return config;
	    };

	    this.responseError = function(response) {
			// No caso de 401, só devemos redirecionar para '/login' se a requisição não for de login. 
			// 401, no caso do login, significa usuário ou senha inválidos. 
	        if ((response.status === 401 && !response.config.url.endsWith('/oauth/token')) || response.status === 403) {
	        	//$window.location.href = '/login';
	        }
	        return $q.reject(response);
	    };

	});

})();