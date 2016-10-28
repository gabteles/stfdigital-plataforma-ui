namespace app.support{
    'use strict';
    import Properties = app.support.constants.Properties;

    describe('Teste da diretiva stf-matches', () => {
        beforeEach(angular.mock.module('ngMockE2E', 'app.support'));
        
        let $compile, scope, element;

        beforeEach(inject((_$compile_:ng.ICompileService, _$rootScope_:ng.IRootScopeService, $httpBackend:ng.IHttpBackendService, properties:Properties) => {
            $compile = _$compile_;
            scope = _$rootScope_.$new();

            $httpBackend.whenGET(properties.apiUrl + '/discovery/api/commands').passThrough();

            scope.senha = '';
            scope.repetirSenha = '';
            element = $compile('<form name="form"><input type="password" name="senha" ng-model="senha"><input type="password" name="repetir-senha" ng-model="repetirSenha" stf-matches="senha"></form>')(scope);
            scope.$digest();
        }));

        it('Deveria compilar a diretiva', () => {
            expect(element.find('input[stf-matches="senha"]').length).toEqual(1);
        });

        it('Deveria invalidar a senha com a repetição', () => {
            scope.senha = 'teste';
            scope.repetirSenha = 'tsete';
            scope.$digest();
            expect(scope.form['repetir-senha'].$valid).toEqual(false);
        });

         it('Deveria validar a senha com a repetição', () => {
            scope.senha = 'teste';
            scope.repetirSenha = 'teste';
            scope.$digest();
            expect(scope.form['repetir-senha'].$valid).toEqual(true);
        });
    });
}