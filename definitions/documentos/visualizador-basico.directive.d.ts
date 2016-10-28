declare namespace app.documentos {
    class VisualizadorBasicoDirective implements ng.IDirective {
        private $http;
        private $parse;
        private anchorClickService;
        restrict: string;
        static factory(): (string | (($http: ng.IHttpService, $parse: ng.IParseService, anchorClickService: AnchorClickService) => VisualizadorBasicoDirective))[];
        constructor($http: ng.IHttpService, $parse: ng.IParseService, anchorClickService: AnchorClickService);
        link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void;
        private clickCallback(scope, element, attrs);
    }
}
