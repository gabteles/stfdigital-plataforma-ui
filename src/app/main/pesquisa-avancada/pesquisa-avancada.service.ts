namespace app.pesquisaAvancada {
	'use strict';
	
    import RouteConfig = app.support.command.RouteConfig;
    import Properties = app.support.constants.Properties;
    
    interface IPesquisaAvancada {
    	description: string;
        route: RouteConfig;
    }

    export class PesquisaAvancadaService {

        private static apiPesquisas: string = '/discovery/api/queries/searchs';

        /** @ngInject **/
        constructor(private $http: ng.IHttpService, private msNavigationService, private properties: Properties) { }
        
        public load(): void {
            this.$http.get(this.properties.apiUrl + PesquisaAvancadaService.apiPesquisas)
                .then((response: ng.IHttpPromiseCallbackArg<IPesquisaAvancada[]>) => {
                    response.data
                            .filter(pesquisa => angular.isDefined(pesquisa.route))
                            .forEach(pesquisa => this.addRouteToNavigation(pesquisa));
                });
        }
        
        private addRouteToNavigation(pesquisa: IPesquisaAvancada): void {
            let route: RouteConfig = pesquisa.route;
	        this.msNavigationService.saveItem(route.navigationItem, {
	            title : pesquisa.description,
	            icon : 'icon-magnify',
	            state : route.stateName,
	            translation : route.translation
	        });
        }
    }

    angular
        .module('app.pesquisa-avancada')
        .service('app.pesquisa-avancada.PesquisaAvancadaService', PesquisaAvancadaService);
}