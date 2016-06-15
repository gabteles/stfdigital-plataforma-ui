(function (){
    'use strict';

    angular
        .module('app.navigation', ['app.support'])
        .config(config);

    /** @ngInject **/
    function config($translatePartialLoaderProvider, $ocLazyLoadProvider, $stateProvider, $futureStateProvider, $provide, properties) {
    	
    	$translatePartialLoaderProvider.addPart('app/navigation');
    	
    	/**
    	 * Define como os estados futuros do ui-router serão carregados
    	 */
		$futureStateProvider.stateFactory('load', /** @ngInject **/ function($q, $ocLazyLoad, $log, $mdDialog, $translate, $futureState, $timeout, futureState) {
			
			var deferredState = $q.defer();
			
			var alert = $mdDialog.alert()
				.clickOutsideToClose(true)
	        	.title($translate.instant('NAVEGACAO.SERVICO_INDISPONIVEL.TITULO'))
	        	.textContent($translate.instant('NAVEGACAO.SERVICO_INDISPONIVEL.MSG'))
	        	.ariaLabel($translate.instant('NAVEGACAO.SERVICO_INDISPONIVEL.ALERTA'))
	        	.ok($translate.instant('NAVEGACAO.SERVICO_INDISPONIVEL.OK'));
			
			function fnErr(err) {
				$log.error(err);
				deferredState.reject();
				$mdDialog.show(alert);
				//Coloca o estado como futuro, para que tente acessar novamente
				$timeout(function() {
					$futureState.futureState(futureState);
				});
			}
			
			//Realiza a importação dos arquivos dos módulos
			System.import(futureState.src).then(function(loaded) {
				var newModule = loaded;
				
				if (!loaded.name) {
					var key = Object.keys(loaded);
					newModule = loaded[key[0]];
				}
				//Carrega o módulo angular importado
				$ocLazyLoad.load(newModule).then(function() {
					deferredState.resolve();
				}, fnErr);
			}, fnErr);
			return deferredState.promise;
		});
		
		/**
		 * Carrega as configurações das rotas dos módulos no FutureState do ui-router
		 * possibilitando a garantia de que o estado estará carregado antes da transição
		 * de estados ocorrer
		 */
		$futureStateProvider.addResolve(/** @ngInject **/ function($q, $http) {
			
			var deferredRoutes = $q.defer();
			
	    	$http.get(properties.apiUrl + '/discovery/api/routes').then(function(response) {
				angular.forEach(response.data, function(route) {
					route.type = "load";
					$futureStateProvider.futureState(route);
				});
				deferredRoutes.resolve();
			}, function() {
				deferredRoutes.reject();
			});
	    	return deferredRoutes.promise;
		});
		
		//Configura o SystemJS para importar os arquivos através do gateway
		System.config({
		    baseURL: properties.apiUrl,
		    defaultExtension: 'js',
		    defaultJSExtensions: true
		});
		
		//Adiciona um timestamp na url garantindo que no primeiro carregamento não vai ao cache
		var systemLocate = System.locate;
		System.locate = function (load) {
			var System = this;
		    return Promise.resolve(systemLocate.call(this, load)).then(getUrlWithTimestamp);
		};
		
		if (properties.development) {
			$provide.decorator('$templateFactory', templateFactoryDecorator);
			$ocLazyLoadProvider.config({debug: true});
		}
    }
    
	//Desabilita o cache dos templates de módulos externos no ui-router.
	/** @ngInject **/
	function templateFactoryDecorator($delegate, properties) {
		var fromUrl = angular.bind($delegate, $delegate.fromUrl);
		var gatewayUrl = properties.apiUrl; 
		$delegate.fromUrl = function (url, params) {
			
			if (url !== null && angular.isDefined(url) && angular.isString(url) && url.indexOf(gatewayUrl) !== -1) {
				url = getUrlWithTimestamp(url);
			}
			return fromUrl(url, params);
		};
		return $delegate;
	}
    
	//Monta uma url com um timestamp na querystring
	function getUrlWithTimestamp(url) {
		return url + (url.indexOf("?") === -1 ? "?" : "&") + "ts=" + Date.now().toString();
	}

})();