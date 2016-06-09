declare namespace app.gestao.meusPaineis {
    import IHttpService = angular.IHttpService;
    class MeusPaineisService {
        private $http;
        private static widgetsJson;
        /** @ngInject **/
        constructor($http: IHttpService);
        loadDashboardWidget(widgetName: string): any;
        private data();
        private getChart1(data);
        private getChart2(data);
        private getWidget1(data);
        private getWidget2(data);
        private getWidget3(data);
        private getWidget4(data);
        private getWidget5(data);
        private getWidget6(data);
        private getWidget7(data);
        private getWidget8(data);
        private getWidget9(data);
        private getWidget10(data);
        private getWidget11(data);
    }
}
