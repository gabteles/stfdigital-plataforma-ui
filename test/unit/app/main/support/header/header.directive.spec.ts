namespace app.support {
    import Properties = app.support.constants.Properties;

    describe('Teste da diretiva stf-header', () => {
        let $compile, scope, template;
        beforeEach(angular.mock.module('ngMockE2E', 'templates', 'app.core', 'app.support'));

        beforeEach(inject((_$compile_:ng.ICompileService, _$rootScope_:ng.IRootScopeService, properties:Properties, $httpBackend:ng.IHttpBackendService, $templateCache) => {
            $compile = _$compile_;
            scope = _$rootScope_.$new();

            $httpBackend.whenGET(properties.apiUrl + '/discovery/api/commands').passThrough();
            $httpBackend.whenGET('app/main/support/header/header.html').passThrough();
        }));

        it('Deveria compilar a diretiva sem fabAction', () => {
            let element = angular.element('<stf-header></stf-header>');
            template = $compile(element)(scope);
            scope.$digest();
            
            expect(element.find('div.header.stf-header').length).toEqual(1);
            expect(scope.hasFabAction).toBeFalsy();
        });

        it('Deveria compilar a diretiva com fabAction', () => {
            scope.callback = () => {
                return true;
            }
            let element = angular.element('<stf-header fab-action="callback()"></stf-header>');
            template = $compile(element)(scope);
            scope.$digest();
            scope = element.isolateScope() || element.scope();

            expect(element.find('div.header.stf-header').length).toEqual(1);
            expect(scope.hasFabAction).toBeTruthy();
            expect(scope.fabAction()).toEqual(true);
        });
    });
}