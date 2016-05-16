(function (){
    'use strict';

    angular
        .module('app.navigation', ['app.constants'])
        .config(config)
        .run(run);

    /** @ngInject **/
    function config($translatePartialLoaderProvider, $ocLazyLoadProvider, $stateProvider, $futureStateProvider, $provide, properties) {
        	 
    	$translatePartialLoaderProvider.addPart('app/navigation');
    	
    	/**
    	 * Define como os estados futuros do ui-router serão carregados
    	 */
		$futureStateProvider.stateFactory('load', /** @ngInject **/ function($q, $ocLazyLoad, futureState) {
			
			var deferred = $q.defer();
			
			//Realiza a importação dos arquivos dos módulos
			System.import(futureState.src).then(function(loaded) {
				var newModule = loaded;
				if (!loaded.name) {
					var key = Object.keys(loaded);
					newModule = loaded[key[0]];
				}
				//Carrega o módulo angular importado
				$ocLazyLoad.load(newModule)
					.then(function() {
						deferred.resolve();
					}, function(err) {
						throw err;
					});
			});
			return deferred.promise;
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
		    return new Promise(function(resolve) {
		    	resolve(systemLocate.call(System, load))
		    		.then(getUrlWithTimestamp);
		    });
		};
		
		if (properties.development) {
			$provide.decorator('$templateFactory', templateFactoryDecorator);
			$ocLazyLoadProvider.config({debug: true});
		}
    }
    
    /** @ngInject **/
    function run($http, $futureState, $rootScope, properties) {
    	
		//Carrega as configurações das rotas dos módulos no FutureState do ui-router
		//possibilitando a garantia de que o estado estará carregado antes da transição
		//de estados ocorrer
    	$http.get(properties.apiUrl + '/services/routes.json')
    		.then(function(response) {
				angular.forEach(response.data, function(route) {
					$futureState.futureState(route);
				});
			});
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