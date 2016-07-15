namespace app.gestao.meusPaineis {
    'use strict';
    import ITranslatePartialLoaderProvider = angular.translate.ITranslatePartialLoaderProvider;
    import IStateProvider = angular.ui.IStateProvider;

    import Dashboard = app.support.dashboards.Dashboard;
    import DashboardService = app.support.dashboards.DashboardService;
    
    /** @ngInject **/
    function config($translatePartialLoaderProvider: ITranslatePartialLoaderProvider,
                    $stateProvider: IStateProvider,
                    msNavigationServiceProvider: any) {
            
        $translatePartialLoaderProvider.addPart('app/main/gestao/meus-paineis');

        $stateProvider.state('app.gestao.meus-paineis', {
            url: '/meus-paineis',
            resolve: {
                dashboards: ['app.support.dashboards.DashboardService', (dashboardService: app.support.dashboards.DashboardService) => {
                    return dashboardService.dashboards();
                }]
            }
        }).state('app.gestao.meus-paineis.dashboard', {
            url: '/:dashboardId',
            views: {
                'content@app.autenticado': {
                    templateUrl: 'app/main/gestao/meus-paineis/meus-paineis.html',
                    controller: PaineisController,
                    controllerAs: 'vm'
                }
            },
            resolve: {
                dashlets: ['$q', '$stateParams', 'dashboards', 'app.support.dashboards.DashboardService',
                    ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService, dashboards: Dashboard[], dashboardService: DashboardService) => {
                    return $q((resolve, reject) => {
                        // Lógica para carregamento dos módulos nos quais estão definidos os dashlets usados pelo dashboard atual.
                        let dashboard: Dashboard;
                        let dashboardId: string = $stateParams['dashboardId'];
                        if (!dashboardId) {
                            if (dashboards.length > 0) {
                                dashboard = dashboards[0]; // Dashboard padrão será o primeiro da lista.
                            } else {
                                resolve([]);
                                return;
                            }
                        } else {
                            for (let d of dashboards) {
                                if (d.id === dashboardId) {
                                    dashboard = d;
                                    break;
                                }
                            }
                        }
                        if (!dashboard) {
                            reject("Dashboard com Id " + dashboardId + " não encontrado.");
                            return;
                        }

                        dashboardService.loadDashlets(dashboard).then((dashlets) => {
                            resolve(dashlets);
                        }, () => {
                            reject('Erro ao carregar os dashlets.');
                        });
                    });
                }]
            }
        }).state('app.gestao.meus-paineis.principal', {
            url: '/principal',
        }).state('app.gestao.meus-paineis.peticoes', {
            url: '/peticoes',
        }).state('app.gestao.meus-paineis.autuacoes', {
            url: '/autuacoes',
        }).state('app.gestao.meus-paineis.produtividade-do-time', {
            url: '/produtividade-do-time',
        });

        msNavigationServiceProvider.saveItem('gestao.meus-paineis', {
            title      : 'Meus Painéis',
            icon       : 'icon-view-dashboard',
            state      : 'app.gestao.meus-paineis.dashboard',
            translation: 'GESTAO.MEUS-PAINEIS.MEUS-PAINEIS',
            weight     : 1
        });
    }

    angular
        .module('app.gestao.meus-paineis', ['app.gestao', 'app.support.dashboards'])
        .config(config);
}