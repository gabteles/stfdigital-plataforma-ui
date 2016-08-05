namespace app.core {
	
	export class StfHeaderController {

		private localBreadcrumbs;

		/**  @ngInject */
		constructor(private $scope: StfHeaderScope, private stfBreadcrumbsService: StfBreadcrumbsService) {
			if (this.$scope.path) {
				this.localBreadcrumbs = this.stfBreadcrumbsService.generateBreadcrumbFromLocalPath(this.$scope.path);
			}
		}

		public hasBreadcrumbs(): boolean {
			return !this.$scope.layoutOnly &&
				(this.localBreadcrumbs || (this.stfBreadcrumbsService.breadcrumbs != this.stfBreadcrumbsService.EMPTY_BREADCRUMB));
		}

		public breadcrumbs(): any {
			if (this.localBreadcrumbs) {
				return this.localBreadcrumbs;
			} else {
				return this.stfBreadcrumbsService.breadcrumbs
			}
		}

	}

}