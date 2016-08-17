declare namespace app.support.suggestion {
    class SuggestionDirectiveController {
        private $scope;
        private $http;
        searchText: string;
        itemText: Function;
        items: Array<Object>;
        placeholder: string;
        private suggestion;
        private static $inject;
        constructor($scope: SuggestionDirectiveScope, $http: ng.IHttpService, suggestionService: SuggestionService);
        selectedItemChange(item: Object): void;
        searchTextChange(): void;
    }
}
