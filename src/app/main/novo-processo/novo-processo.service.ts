namespace app.novoProcesso {
	'use strict';
	
    import Properties = app.support.constants.Properties;
    import RouteConfig = app.support.command.RouteConfig;
	
    export interface IProcessoWorkflow {
        description: string;
        route: RouteConfig;
    }

    export class NovoProcessoService {

        private static apiProcessos: string = '/discovery/api/commands/start-process';
        private 

        /** @ngInject **/
        constructor(private $http: ng.IHttpService, private properties: Properties, private msNavigationService) { }

        public list(): ng.IPromise<IProcessoWorkflow[]> {
            return this.$http.get(this.properties.url + ":" + this.properties.port + NovoProcessoService.apiProcessos)
                .then((response: ng.IHttpPromiseCallbackArg<IProcessoWorkflow[]>): IProcessoWorkflow[] => {
                	let processos: IProcessoWorkflow[] = [];
                	response.data
                	        .filter(processo => angular.isDefined(processo.route))
                	        .forEach(processo => processos.push(processo));
                	return processos;
                });
        }
    }

    angular
        .module('app.novo-processo')
        .service('app.novo-processo.NovoProcessoService', NovoProcessoService);
}