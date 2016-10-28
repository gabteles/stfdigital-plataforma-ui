namespace app.support.messaging{
    'use strict';
    import Properties = app.support.constants.Properties;
    import IToastService = angular.material.IToastService;
    describe('Teste do MessagesService', () => {
        let messagesService, $mdToast:IToastService;
        beforeEach(angular.mock.module('ngMockE2E', 'app.core', 'app.support'));
        beforeEach(inject((_$mdToast_:IToastService, $httpBackend:ng.IHttpBackendService, properties:Properties, _messagesService_) => {
            messagesService = _messagesService_;
            $mdToast = _$mdToast_;
            spyOn($mdToast, 'show');
            $httpBackend.whenGET(properties.apiUrl + '/discovery/api/commands').passThrough();
        }));

        it('Deveria exibir a mensagem de erro', () => {
            messagesService.error('Erro');
            
            expect($mdToast.show).toHaveBeenCalledTimes(1);
        });

        it('Deveria exibir a mensagem de sucesso', () => {
            messagesService.success('Sucesso');
            
            expect($mdToast.show).toHaveBeenCalledTimes(1);
        });
    });
}