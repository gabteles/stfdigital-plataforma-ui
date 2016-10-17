declare namespace app.support {
    class StfCpf implements ng.IDirective {
        private cpfService;
        require: string;
        constructor(cpfService: CPFService);
        link($scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any): void;
        static factory(): ng.IDirectiveFactory;
    }
}
