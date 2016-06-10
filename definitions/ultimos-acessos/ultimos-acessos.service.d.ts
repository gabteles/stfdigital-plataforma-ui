declare namespace app.ultimosAcessos {
    import IQService = angular.IQService;
    import IPromise = angular.IPromise;
    interface IAcesso {
        name: string;
        type: {
            name: string;
            icon: {
                name: string;
                color: string;
            };
        };
        last_update_by: string;
        size: number;
        updated_at: number;
    }
    class UltimosAcessosService {
        private $q;
        /** @ngInject **/
        constructor($q: IQService);
        acessos(): IPromise<IAcesso[]>;
        private static mockAcessos();
    }
}
