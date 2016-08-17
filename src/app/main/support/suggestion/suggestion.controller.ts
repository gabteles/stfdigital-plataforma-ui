namespace app.support.suggestion {
    
    export class SuggestionDirectiveController {

        public searchText: string = "";
        public itemText: Function = (item: Object) => item.toString();
        public items: Array<Object> = [];
        public placeholder: string = "Digite aqui para pesquisar";
        private suggestion: Suggestion = <Suggestion>{ description: "" };
        
        private static $inject = ['$scope', '$http', 'app.support.suggestion.SuggestionService'];
        
        constructor(private $scope: SuggestionDirectiveScope, private $http: ng.IHttpService, suggestionService: SuggestionService) {
            suggestionService.findById($scope.id)
                .then(suggestion => {
                	this.suggestion = suggestion;
                	if ($scope.useDescription) {
                		this.placeholder = suggestion.description;
                	}
                    if (angular.isFunction($scope.itemText)) {
                        this.itemText = $scope.itemText;
                    }
                }, (error) => {throw new Error(error)});
        }
        
        public selectedItemChange(item: Object): void {
        	this.$scope.selectedItem = item;
        }
        
        public searchTextChange(): void {
            let config: ng.IRequestShortcutConfig = <ng.IRequestShortcutConfig>{
            	params: {
            		[this.$scope.searchItem] : this.searchText	
            	}
            };
        	this.$http.get("/" + this.suggestion.context + this.$scope.api, config)
        	   .success((items:Array<Object>) => this.items = items);
        }

    }

}