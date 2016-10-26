namespace app.support{
    import Properties = app.support.constants.Properties;

    describe('Teste da diretiva stf-additional-model', () => {
        let scope,  $rootScope, $compile:ng.ICompileService;

        beforeEach(angular.mock.module('ngMockE2E', 'app.support'));

        beforeEach(inject((_$compile_:ng.ICompileService, _$rootScope_, $httpBackend:ng.IHttpBackendService, properties:Properties) => {
            $rootScope = _$rootScope_;
            $compile = _$compile_;

            $httpBackend.whenGET(properties.apiUrl + '/discovery/api/commands').passThrough();
        }));

        it('Deveria compilar a diretiva com valor de stfAdditionalModel igual ao do ng-model', () => {
            $rootScope.model = 1;
            let element = $compile('<div ng-model="model" stf-additional-model></div>')($rootScope);
            
            scope = element.isolateScope();

            $rootScope.$digest();

            expect(scope.stfAdditionalModel).toEqual($rootScope.model);
        });
    })
}