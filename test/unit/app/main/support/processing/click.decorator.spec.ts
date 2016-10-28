namespace app.support{
    import Properties = app.support.constants.Properties;

    describe('Teste do click decorator', () => {
        let $compile, template, scope, deferred;
        beforeEach(angular.mock.module('ngMockE2E', 'app.support'));
        beforeEach(inject((_$compile_:ng.ICompileService, _$rootScope_:ng.IRootScopeService, _$q_:ng.IQService, $httpBackend:ng.IHttpBackendService, properties:Properties) => {
            $compile = _$compile_;
            deferred = _$q_.defer();
            scope = _$rootScope_.$new();
            scope.click = () => {
                return deferred.promise;
            }
            spyOn(deferred.promise, 'finally').and.callThrough();
            spyOn(scope, 'click').and.callThrough();
            
            $httpBackend.whenGET(properties.apiUrl + '/discovery/api/commands').passThrough();
        }));

        it('Deveria executar a ação do botão duas vezes', () => {
            let element = angular.element('<button ng-click="click()">Teste</button>');
            template = $compile(element)(scope);
            scope.$digest();
            
            element.click();
            element.click();
            expect(scope.click).toHaveBeenCalledTimes(2);
        });

        it('Deveria executar a ação do botão apenas uma vez', () => {
            let element = angular.element('<button ng-click="click()" stf-processing>Teste</button>');
            template = $compile(element)(scope);
            scope.$digest();
            
            element.click();
            expect(deferred.promise.finally).toHaveBeenCalled();
            element.click();
            expect(deferred.promise.finally).toHaveBeenCalledTimes(1);
            expect(scope.click).toHaveBeenCalledTimes(1);
        });
    });
}