namespace app.pesquisaAvancada {
	'use strict';
	
	import IHttpService = angular.IHttpService;
    import IPromise = angular.IPromise;
    import IHttpPromiseCallbackArg = angular.IHttpPromiseCallbackArg;
    
    class PesquisaAvancada {
        constructor(public description: string,
        			public stateName: string,
        			public navigationItem: string,
        			public translation: string) {}
    }

    export class PesquisaAvancadaService {

        private static apiPesquisas: string = '/services/routes.json';

        /** @ngInject **/
        constructor(private $http: IHttpService, private msNavigationService, private properties) { }
        
        public load(): void {
        	this.list()
        		.then((pesquisas: PesquisaAvancada[]) => {
        			pesquisas.forEach((pesquisa: PesquisaAvancada) => {
        				this.msNavigationService.saveItem(pesquisa.navigationItem, {
        			        title : pesquisa.description,
        			        icon : 'icon-magnify',
        			        state : pesquisa.stateName,
        			        translation : pesquisa.translation,
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
	                    return pesquisas.filter((pesquisa: any) => {
	                        //TODO: Deve vir filtrado do backend
	                        return (pesquisa.stateName.indexOf("pesquisa-avancada") !== -1);
	                    }).map((pesquisa: any) => {
	                        return new PesquisaAvancada(pesquisa.description, 
	                        							pesquisa.stateName,
	                        							pesquisa.navigationItem,
	                        							pesquisa.translation);
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