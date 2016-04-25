namespace app.novoProcesso {
    'use strict';
    
    import IHttpService = angular.IHttpService;
    import IPromise = angular.IPromise;
    import IHttpPromiseCallbackArg = angular.IHttpPromiseCallbackArg;

    export interface IProcessoWorkflow {
        description: string;
        stateName: string;
    }

    export class ProcessoWorkflow implements IProcessoWorkflow {
        constructor(public description: string, public stateName: string) {}
    }

    export class NovoProcessoService {

        private static apiProcessos: string = '/services/routes.json';

        /** @ngInject **/
        constructor(private $http: IHttpService, private properties) { }

        public list(): IPromise<IProcessoWorkflow[]> {
            return this.$http.get(this.properties.url + ":" + this.properties.port + NovoProcessoService.apiProcessos)
                .then((response: IHttpPromiseCallbackArg<any>): IProcessoWorkflow[] => {
                    return response.data.filter((processo: any) => {
                        //TODO: Deve vir filtrado do backend
                        return (processo.stateName.indexOf("novo-processo") !== -1);
                    }).map((processo: any) => {
                        return new ProcessoWorkflow(processo.description, processo.stateName);
                    });
                });
        }
    }

    angular
        .module('app.novo-processo')
        .service('app.novo-processo.NovoProcessoService', NovoProcessoService);
}