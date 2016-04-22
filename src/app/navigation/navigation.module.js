(function (){
    'use strict';

    angular
        .module('app.navigation', ['app.constants'])
        .config(config);

    /** @ngInject **/
    function config($translatePartialLoaderProvider, $ocLazyLoadProvider, $stateProvider, $futureStateProvider, $provide, properties) {

    	$translatePartialLoaderProvider.addPart('app/navigation');
    	
    	/**
    	 * Define como os estados futuros do ui-router serão carregados
    	 */
		$futureStateProvider.stateFactory('load', /** @ngInject **/ function($q, $ocLazyLoad, futureState) {
		
			var def = $q.defer();
			
			//Realiza a importação dos arquivos dos módulos
			System.import(futureState.src).then(function(loaded) {
				var newModule = loaded;
				
				if (!loaded.name) {
					var key = Object.keys(loaded);
					newModule = loaded[key[0]];
				}
				
				//Carrega o módulo angular importado
				$ocLazyLoad.load(newModule).then(function() {
					def.resolve();
				}, function(err) {
					throw err;
				});
			});
			return def.promise;
		});
		
		//Adiciona um timestamp na url garantindo que no primeiro carregamento não vai ao cache
		var systemLocate = System.locate;
		System.locate = function (load) {
		    var System = this;
		    return Promise.resolve(systemLocate.call(this, load)).then(function (url) {
		        return url + (url.indexOf("?") === -1 ? "?" : "&") + "ts=" + Date.now().toString();
		    });
		};

		//Configura o SystemJS para importar os arquivos através do gateway
		System.config({
		    baseURL: properties.url + ':' + properties.port,
		    defaultExtension: 'js',
		    defaultJSExtensions: true
		});
		
		//Carrega as configurações das rotas dos módulos no FutureState do ui-router
		//possibilitando a garantia de que o estado estará carregado antes da transição
		//de estados ocorrer
		$.getJSON(properties.url + ':' + properties.port + '/services/routes.json', function(futureRoutes) {
			angular.forEach(futureRoutes, function(route) {
				$futureStateProvider.futureState(route);
			});
		});
		
		//Desabilita o cache dos templates do ui-router
		/** @ngInject **/
		function templateFactoryDecorator($delegate) {
			var fromUrl = angular.bind($delegate, $delegate.fromUrl);
			$delegate.fromUrl = function (url, params) {
				if (url !== null && angular.isDefined(url) && angular.isString(url)) {
					url += (url.indexOf("?") === -1 ? "?" : "&") + "ts=" + Date.now().toString();
				}
				return fromUrl(url, params);
			};
			return $delegate;
		}
		if (properties.development) {
			$provide.decorator('$templateFactory', templateFactoryDecorator);
		}
    }

})();