declare namespace app.support.suggestion {
    import Properties = app.support.constants.Properties;
    interface Suggestion {
        id: string;
        description: string;
        context: string;
    }
    class SuggestionService {
        private $http;
        private properties;
        private $q;
        private static apiSuggestions;
        private suggestions;
        /** @ngInject **/
        constructor($http: ng.IHttpService, properties: Properties, $rootScope: ng.IRootScopeService, $q: ng.IQService);
        list(): ng.IPromise<Suggestion[]>;
        /**
         * Pesquisa uma configuração de sugestão por id
         */
        findById(id: any): ng.IPromise<Suggestion>;
        /**
         * Carrega os componentes de sugestão
         */
        private loadSuggestions();
        /**
         * Limpa as sugestões carregadas
         */
        private resetSuggestions();
    }
}
