namespace app.support.suggestion {
    
    import Properties = app.support.constants.Properties;
    
    describe('Suggestion', () => {
        
        let suggestionService: SuggestionService;
	    let http: ng.IHttpBackendService;
	    let suggestion =  <Suggestion> {
	       id: "sugerir-processo",
	       description: "Sugestão de Processos",
	       context: "Processos"
	    };
    	
    	beforeEach(angular.mock.module('app.support.constants', 'app.support.suggestion'));
        
    	beforeEach(inject(['app.support.suggestion.SuggestionService', 'properties', '$httpBackend',
    			(_suggestionService_: SuggestionService, properties: Properties, $httpBackend: ng.IHttpBackendService) => {
    		$httpBackend.whenGET(properties.apiUrl + '/discovery/api/queries/suggestions').respond([suggestion])
            $httpBackend.flush();
            suggestionService = _suggestionService_;
        }]));
    	
        it('O serviço deve pesquisar o componente de suggestion', () => {
        	suggestionService.findById('sugerir-processo')
                .then(sugg => expect(sugg).toEqual(suggestion));
        });
        
        it('O serviço deve listar os componentes de suggestion', () => {
            suggestionService.list()
                .then(suggs => expect(suggs).toEqual([suggestion]));
        });
    	
    });
}