namespace app.core {

	export interface StfProcessingScope extends ng.IScope {
		stfProcessing: any;
		$stfDecorateNgClickHandler: (promise: ng.IPromise<any>) => ng.IPromise<any>;
		$stfDecorateNgSubmitHandler: (promise: ng.IPromise<any>) => ng.IPromise<any>;
	}

	/**
	 * Diretiva para indicar que está se processando algo como consequência do 
	 * clique de um botão ou submit de form. Ela desabilita o botão enquanto estiver
	 * processando a promise e mostra o loader global do sistema.
	 * 
	 * O handler do ng-click ou do ng-submit deve retornar uma promise que indicará o status
	 * do processamento.
	 */
	class StfProcessing implements ng.IDirective {

		private $scope: StfProcessingScope;
		private element: ng.IAugmentedJQuery;
		private attrs: ng.IAttributes;

		public link($scope: StfProcessingScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
			this.$scope = $scope;
			this.element = element;
			this.attrs = attrs;

			$scope.$stfDecorateNgClickHandler = (promise: ng.IPromise<any>) => this.$stfDecorateNgClickHandler(promise);
			$scope.$stfDecorateNgSubmitHandler = (promise: ng.IPromise<any>) => this.$stfDecorateNgSubmitHandler(promise);
		}

		private $stfDecorateNgClickHandler(promise: ng.IPromise<any>): ng.IPromise<any> {
			if (promise) {
				this.element.prop('disabled', true);
				(<any>this.$scope.$root).loadingProgress = true;
				promise.finally(() => {
					this.element.prop('disabled', false);
					(<any>this.$scope.$root).loadingProgress = false;
				});
			}
			return promise;
		}

		private $stfDecorateNgSubmitHandler(promise: ng.IPromise<any>): ng.IPromise<any> {
			if (promise) {
				this.element.find('[type=submit]').prop('disabled', true);
				(<any>this.$scope.$root).loadingProgress = true;
				promise.finally(() => {
					this.element.find('[type=submit]').prop('disabled', false);
					(<any>this.$scope.$root).loadingProgress = false;
				});
			}
			return promise;
		}

		public static factory(): ng.IDirectiveFactory {
			return () => {
				return new StfProcessing();
			};
		}

	}

	angular.module('app.core').directive('stfProcessing', StfProcessing.factory());
}