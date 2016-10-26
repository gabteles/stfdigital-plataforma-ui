namespace app.support {
    import Properties = app.support.constants.Properties;

    describe('Teste do StfHeaderController', () => {
        let template, controller;
        let $compile, scope;
        beforeEach(angular.mock.module('ngMockE2E', 'app.core', 'app.support'));

        beforeEach(inject((_$compile_: ng.IControllerService, _$rootScope_:ng.IRootScopeService, $httpBackend:ng.IHttpBackendService, properties: Properties) => {
            scope = _$rootScope_.$new();
            $compile = _$compile_;

            $httpBackend.whenGET(properties.apiUrl + '/discovery/api/commands').passThrough();
            $httpBackend.whenGET('app/main/support/header/header.html').passThrough();
        }));
        beforeEach(() => {
            let element = angular.element('<stf-header></stf-header>')
            template = $compile(element)(scope);
            scope.$digest();
            controller = element.controller;
        });

        it('Deveria retornar a existência ou não de breadcrumb registrado', () => {
            
        });
    });
}