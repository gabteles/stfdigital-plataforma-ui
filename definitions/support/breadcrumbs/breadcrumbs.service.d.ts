declare namespace app.support {
    interface BreadcrumbPath {
        id: string;
        translation: string;
        uisref: string;
        parent?: string;
    }
    class StfBreadcrumbsService {
        private msNavigationService;
        EMPTY_BREADCRUMB: {
            current: {
                label: string;
                link: string;
            };
            parents: any[];
        };
        breadcrumbs: {
            current: {
                label: string;
                link: string;
            };
            parents: any[];
        };
        private registeredPaths;
        /** @ngInject */
        constructor($rootScope: ng.IRootScopeService, $state: ng.ui.IStateService, msNavigationService: any);
        getRegisteredPath(id: string): BreadcrumbPath;
        registerPath(path: BreadcrumbPath): void;
        private _generateBreadcrumbs(stateName);
        private _navigationObject();
        private _getBreadcrumbPath(pathStr);
        private buildPathArrayRecursively(path, pathArray);
        generateBreadcrumbFromLocalPath(path: any): {
            parents: any[];
            current: any;
        };
        getBreadcrumbFromPath(path: any): {
            parents: any[];
            current: any;
        };
        private _parsePathPart(part);
    }
}
