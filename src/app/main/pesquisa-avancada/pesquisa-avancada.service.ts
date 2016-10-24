namespace app.pesquisaAvancada {
	'use strict';
	
    import RouteConfig = app.support.command.RouteConfig;
    import Properties = app.support.constants.Properties;
    
    interface IPesquisaAvancada {
    	description: string;
        route: RouteConfig;
    }
    
    class SalvarPesquisaCommand {
        
        public criterio: string;
        
        constructor(public pesquisaId: number, public descricao: string, public contexto: string, 
                public execucaoAutomatica: boolean, criterio: Array<Criteria>) {
            this.criterio = angular.toJson(criterio);
        }
    }

    export class PesquisaAvancadaService {

        private static apiPesquisas: string = '/discovery/api/queries/searchs';

        /** @ngInject **/
        constructor(private $http: ng.IHttpService, private msNavigationService,
        		$rootScope: ng.IRootScopeService, private properties: Properties, private $q) {
            $rootScope.$on('user:logged', () => this.loadQueries());
            $rootScope.$on('user:exited', () => this.resetQueries());
        }
        
        public loadQueries(): void {
            this.$http.get(this.properties.apiUrl + PesquisaAvancadaService.apiPesquisas)
                .then((response: ng.IHttpPromiseCallbackArg<IPesquisaAvancada[]>) => {
                    response.data
                            .filter(pesquisa => angular.isDefined(pesquisa.route))
                            .forEach(pesquisa => this.addRouteToNavigation(pesquisa));
                });
        }
        
        public resetQueries(): void {
            let navigation: Array<any> = this.msNavigationService.getNavigationObject();
            navigation.filter(nav => nav._id === "pesquisa-avancada").forEach(nav => nav.children = []);
        }
        
        public executeSearch(searchApi: string, search: ISearch): ng.IPromise<Array<any>> {
            return this.$http.post(searchApi, search).then(response => response.data);
        }
        
        public saveSearch(search: ISearch): ng.IPromise<ISearch> {
            let command = new SalvarPesquisaCommand(search.id, search.label, search.context, search.executable, search.criterias);
            return this.$http.post(this.properties.apiUrl + '/identidades/api/pesquisas', command)
                        .then((response: ng.IHttpPromiseCallbackArg<number>) => {
                            search.id = response.data;
                            return search;
                        });
        }
        
        public deleteSearch(id: number): ng.IPromise<any> {
            return this.$http.delete(this.properties.apiUrl + '/identidades/api/pesquisas/' + id);
        }
        
        public loadSavedSearchs(context: string): ng.IPromise<ISearch[]> {
            let config = {params: {contexto: context}};
            return this.$http.get(this.properties.apiUrl + '/identidades/api/pesquisas', config)
                        .then(response => response.data);
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