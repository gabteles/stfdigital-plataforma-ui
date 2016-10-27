namespace app.support {
    import Properties = app.support.constants.Properties;

    describe('Teste do StfHeaderController', () => {
        let template, controller, $compile, scope, breadcrumbService;
        beforeEach(angular.mock.module('ngMockE2E', 'templates', 'app.core', 'app.support'));

        beforeEach(inject((_$compile_: ng.IControllerService, _$rootScope_:ng.IRootScopeService, $httpBackend:ng.IHttpBackendService, properties: Properties, $templateCache, _stfBreadcrumbsService_) => {
            scope = _$rootScope_.$new();
            $compile = _$compile_;
            breadcrumbService = _stfBreadcrumbsService_;

            $httpBackend.whenGET(properties.apiUrl + '/discovery/api/commands').passThrough();
            $httpBackend.whenGET('app/main/support/header/header.html').passThrough();

        }));

        beforeEach(() => {
            let element = angular.element('<stf-header path="path"></stf-header>')
            template = $compile(element)(scope);
            scope.path = [{
                id: 'home',
                translation: 'HOME',
                uisref: '/',
                parent: null
            }];
            scope.$digest();
            controller = element.controller('stf-header');
            scope = element.isolateScope() || element.scope();
        });

        // hasBreadcrumbs
        it('Deveria retornar a existência ou não de breadcrumb registrado', () => {
            expect(controller.hasBreadcrumbs()).toBeTruthy();
            scope.layoutOnly = true;
            expect(controller.hasBreadcrumbs()).toEqual(false);
        });

        // breadcrumbs
        describe('Breadcrumbs', () => {
            beforeEach(inject((_$state_, _$rootScope_, _msNavigationService_) => {
                _msNavigationService_.saveItem('home', {
                    title : 'Minhas Tarefas',
                    icon : '',
                    state : 'home',
                    translation : 'HOME',
                    weight : 1,
                })
                _$state_.current.name = 'home';
                _$rootScope_.$digest();
            }));
            it('Deveria retornar os breadcrumbs locais', () => {
                expect(controller.breadcrumbs()).toEqual({
                    parents: [],
                    current: {
                        label: 'HOME',
                        link: '/'
                    }
                });
            });

            it('Deveria retornar os breadcrumbs de acordo com o $state', () => {
                expect(breadcrumbService.breadcrumbs).toEqual({
                    parents: [],
                    current: {
                        label: 'HOME',
                        link: 'home'
                    }
                });
            });
        });
    });
}