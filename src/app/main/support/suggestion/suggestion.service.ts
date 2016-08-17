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
        constructor(private $http: ng.IHttpService, private properties: Properties, private $q: ng.IQService) {
        	this.loadSuggestions();
        }

        public list(): ng.IPromise<Suggestion[]> {
            return this.suggestions;
        }

        /**
         * Carrega os componentes de sugestão
         */
        public loadSuggestions(): void {
        	let suggestionsDeferred: ng.IDeferred<Suggestion[]> = this.$q.defer();
        	this.suggestions = suggestionsDeferred.promise;
        	
        	this.$http.get(this.properties.apiUrl + SuggestionService.apiSuggestions)
        	   .then((response: ng.IHttpPromiseCallbackArg<Suggestion[]>) => suggestionsDeferred.resolve(response.data),
        			 () => suggestionsDeferred.reject());
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

    }

    angular
        .module('app.support.suggestion')
        .service('app.support.suggestion.SuggestionService', SuggestionService);
}