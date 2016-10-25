namespace app.support{
    import Properties = app.support.constants.Properties;
    describe('Teste da diretiva de CPF', () =>{
        let $compile:ng.ICompileService, scope, element;

        beforeEach(angular.mock.module('ngMockE2E', 'app.support'));

        beforeEach(inject((_$compile_:ng.ICompileService, _$rootScope_:ng.IRootScopeService, $httpBackend:ng.IHttpBackendService, properties) => {
            $compile = _$compile_;
            scope = _$rootScope_.$new();

            $httpBackend.whenGET(properties.apiUrl + '/discovery/api/commands').passThrough();

            scope.cpf = '00267967160';
            element = $compile('<form name="form"><input type="text" ng-model="cpf" name="cpf" stf-cpf></form>')(scope);

            scope.$digest();
        }));

        it('Deveria compilar a diretiva com cpf válido', () => {
            expect(scope.form.cpf.$valid).toEqual(true);
        });

        it('Deveria retornar CPF inválido', () => {
            scope.cpf = '11111111111';
            scope.$digest();

            expect(scope.form.cpf.$valid).toEqual(false);
        });
    })
}