namespace app.support{
    describe('Teste do BreadcrumbsService', () => {
        let stfBreadcrumbsService;
        beforeEach(angular.mock.module('app.core', 'app.support'));

        beforeEach(inject(['stfBreadcrumbsService', (_stfBreadcrumbsService) => {
            stfBreadcrumbsService = _stfBreadcrumbsService;
        }]));

        // registerPath
        it('Deveria registrar uma path', () => {
            let path = {
                id: 'home',
                translation: 'HOME',
                uisref: '/'
            }

            stfBreadcrumbsService.registerPath(path);
            
            expect(stfBreadcrumbsService.getRegisteredPath('home')).toEqual(path);
        });

        // getRegisteredPath
        it('Deveria retornar uma path registrada', () => {
            let path = {
                id: 'home',
                translation: 'HOME',
                uisref: '/'
            }

            stfBreadcrumbsService.registerPath(path);
            
            expect(stfBreadcrumbsService.getRegisteredPath('home')).toEqual(path);
        });

        // getBreadcrumbFromPath
        it('Deveria gerar o breadcrumb de um array de paths', () => {
            let path = {
                id: 'home',
                translation: 'HOME',
                uisref: '/'
            }
            
            expect(stfBreadcrumbsService.getBreadcrumbFromPath([path]).current.label).toEqual('HOME');
        });

        // generateBreadcrumbFromLocalPath
        describe('Teste de paths com parent', () => {
            beforeEach(() => {
                let path = {
                    id: 'home',
                    translation: 'HOME',
                    uisref: '/',
                    parent: null
                }

                stfBreadcrumbsService.registerPath(path);
                path = {
                    id: 'minhasTarefas',
                    translation: 'MINHAS TAREFAS',
                    uisref: '/minhas-tarefas',
                    parent: 'home'
                };

                stfBreadcrumbsService.registerPath(path);
            });

            it('Deveria gerar o breadcrumb da path filha, trazendo a lista de parents', () => {
                let path = stfBreadcrumbsService.getRegisteredPath('minhasTarefas');
                
                let breadcrumbs = stfBreadcrumbsService.generateBreadcrumbFromLocalPath(path);
                
                expect(breadcrumbs.current.label).toEqual('MINHAS TAREFAS');
                expect(breadcrumbs.parents.length).toEqual(1);
            });

            it('Deveria gerar o breadcrumb da path filha a partir de uma lista de paths', () => {
                let list = [stfBreadcrumbsService.getRegisteredPath('home'), stfBreadcrumbsService.getRegisteredPath('minhasTarefas')];
                let breadcrumbs = stfBreadcrumbsService.generateBreadcrumbFromLocalPath(list);
                expect(breadcrumbs.current.label).toEqual('MINHAS TAREFAS');
                expect(breadcrumbs.parents.length).toEqual(1);
            });
        })
        
    });
}