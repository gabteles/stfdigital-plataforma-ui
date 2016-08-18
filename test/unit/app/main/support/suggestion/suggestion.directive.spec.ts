namespace app.support.suggestion {

	import Properties = app.support.constants.Properties;
	
    describe('Teste da diretiva de suggestion', () => {

        let $compile: ng.ICompileService;
        let scope;
        let suggestion = <Suggestion> {
            id: "sugerir-processo",
            description: "Sugestão de Processos",
            context: "services"
        };
        let processoSugerido = {
        	classe: 'HC',
        	numero: 1
        } 
        
        beforeEach(angular.mock.module('ngMockE2E', 'templates', 'app.support.suggestion', 'app.support.constants'));

        beforeEach(inject((_$compile_: ng.ICompileService, _$rootScope_: ng.IRootScopeService, $httpBackend: ng.IHttpBackendService, properties: Properties, $templateCache) => {
            $compile = _$compile_;
            scope = _$rootScope_.$new();
            
            $httpBackend.whenGET('app/main/support/suggestion/suggestion.tpl.html').passThrough();
            $httpBackend.whenGET(properties.apiUrl + '/discovery/api/queries/suggestions').respond([suggestion])
            $httpBackend.whenGET(properties.apiUrl + '/services/api/processos/sugestao?identificacao=hc1').respond([processoSugerido])
        }));

        it('Deveria compilar a diretiva', () => {
        	scope.processo = {};
        	scope.format = (item) => {
        		return item.classe + item.numero;
        	}
        	
            let element = $compile('<suggestion id="sugerir-processo" ng-model="processo" api="/api/processos/sugestao" search-item="identificacao" item-text="format(item)" use-description="true"></suggestion>')(scope);

            scope.$digest();

            let item = element.find('md-autocomplete');
            expect(item.length).toEqual(1);
        });

    });

}