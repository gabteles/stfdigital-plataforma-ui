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
        constructor($http: ng.IHttpService, properties: Properties, $q: ng.IQService);
        list(): ng.IPromise<Suggestion[]>;
        /**
         * Carrega os componentes de sugestão
         */
        loadSuggestions(): void;
        /**
         * Pesquisa uma configuração de sugestão por id
         */
        findById(id: any): ng.IPromise<Suggestion>;
    }
}
