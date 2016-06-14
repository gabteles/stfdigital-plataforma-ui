namespace app.pesquisaAvancada {
	'use strict';
	
	import IHttpService = angular.IHttpService;
    import IPromise = angular.IPromise;
    import IHttpPromiseCallbackArg = angular.IHttpPromiseCallbackArg;
    import RouteConfig = app.support.command.RouteConfig;
    
    
    class PesquisaAvancada {
        constructor(public description: string,
        			public route: RouteConfig) {}
    }

    export class PesquisaAvancadaService {

        private static apiPesquisas: string = '/discovery/api/queries';

        /** @ngInject **/
        constructor(private $http: IHttpService, private msNavigationService, private properties) { }
        
        public load(): void {
        	this.list()
        		.then((pesquisas: PesquisaAvancada[]) => {
        			pesquisas.forEach((pesquisa: PesquisaAvancada) => {
        				let route: RouteConfig = pesquisa.route; 
        				this.msNavigationService.saveItem(route.navigationItem, {
        			        title : pesquisa.description,
        			        icon : 'icon-magnify',
        			        state : route.stateName,
        			        translation : route.translation,
        			        lazy : true,
        			        weight: 1
        			    });
        			})
        		});
        }

        private list(): IPromise<PesquisaAvancada[]> {
            return this.$http.get(this.properties.apiUrl + PesquisaAvancadaService.apiPesquisas)
                .then((response: IHttpPromiseCallbackArg<any>): PesquisaAvancada[] => {
                	var pesquisas = response.data;
                	if (angular.isArray(pesquisas)) {
	                    return pesquisas.map((pesquisa: any) => {
	                        return new PesquisaAvancada(pesquisa.description, 
	                        							pesquisa.route);
	                    });
                	} else {
                		return [];
                	}
                });
        }
    }

    angular
        .module('app.pesquisa-avancada')
        .service('app.pesquisa-avancada.PesquisaAvancadaService', PesquisaAvancadaService);
}