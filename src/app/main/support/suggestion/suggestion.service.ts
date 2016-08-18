namespace app.support.suggestion {
    'use strict';
    
    import Properties = app.support.constants.Properties;

    export interface Suggestion {
        id: string;
        description: string;
        context: string;
    }

    export class SuggestionService {

    	private static apiSuggestions: string = '/discovery/api/queries/suggestions';
    	
    	private suggestions: ng.IPromise<Suggestion[]>;
    	
        /** @ngInject **/
        constructor(private $http: ng.IHttpService, private properties: Properties,
        		$rootScope: ng.IRootScopeService, private $q: ng.IQService) {
        	this.loadSuggestions();
            $rootScope.$on('user:logged', () => this.loadSuggestions());
            $rootScope.$on('user:exited', () => this.resetSuggestions());
        }

        public list(): ng.IPromise<Suggestion[]> {
            return this.suggestions;
        }
        
        /**
         * Pesquisa uma configuração de sugestão por id
         */
        public findById(id): ng.IPromise<Suggestion> {
            let found: ng.IDeferred<Suggestion> = this.$q.defer();
            
            this.suggestions
                .then((suggestions: Suggestion[]) => {
                    for (let suggestion of suggestions) {
                        if (suggestion.id === id) {
                            return found.resolve(suggestion);
                        }
                    }
                    return found.reject("Identificador não encontrado: " + id);
                }, () => {
                found.reject("Erro ao carregar componentes de sugestão!");
            });
            return found.promise;
        }
        
        /**
         * Carrega os componentes de sugestão
         */
        private loadSuggestions(): void {
            let suggestionsDeferred: ng.IDeferred<Suggestion[]> = this.$q.defer();
            this.suggestions = suggestionsDeferred.promise;
            
            this.$http.get(this.properties.apiUrl + SuggestionService.apiSuggestions)
               .then((response: ng.IHttpPromiseCallbackArg<Suggestion[]>) => suggestionsDeferred.resolve(response.data),
                     () => suggestionsDeferred.reject());
        }
        
        /**
         * Limpa as sugestões carregadas
         */
        private resetSuggestions(): void {
            let suggestionConfigsDeferred = this.$q.defer();
            this.suggestions = suggestionConfigsDeferred.promise;
            suggestionConfigsDeferred.resolve([]);
        }

    }

    angular
        .module('app.support.suggestion')
        .service('app.support.suggestion.SuggestionService', SuggestionService);
}