declare namespace app.support {
    interface StfMatchesScope {
        stfMatches: Object;
        $watch: Function;
    }
    class StfMatches implements ng.IDirective {
        scope: Object;
        require: string;
        constructor();
        link($scope: StfMatchesScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any): void;
        static factory(): ng.IDirectiveFactory;
    }
}
