namespace app.support.dashboards {
	'use strict';

	interface DashletScope extends ng.IScope {
		value: string;
	}

	class DashletDirective implements ng.IDirective {

		public restrict: string = 'E';

		public scope: Object = {
			value: '='
		};

		constructor(private $timeout: ng.ITimeoutService, private dashletRegistry: DashletRegistry, private $compile: ng.ICompileService) {

		}

		public link(scope: DashletScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
			this.$timeout(() => {
				let dashletName = scope.value;
				let dashlet: DashletDefinition = this.dashletRegistry.recoverDashlet(dashletName);
				let controller = dashlet.controller;
				let template = dashlet.template;
				let alias = dashlet.controllerAs;
				let directiveHtml = '<div data-ng-controller="' + controller + ' as ' + alias + '">' +
					template
					+ '</div>';
				element.html(directiveHtml);

				let link = this.$compile(element.contents());
				
				link(scope);
			});
		}

		public static factory(): ng.IDirectiveFactory {
			return ($timeout: ng.ITimeoutService, dashletRegistry: DashletRegistry, $compile: ng.ICompileService) => {
				"ngInject";
				return new DashletDirective($timeout, dashletRegistry, $compile);
			};
		}

	}

	angular.module('app.support.dashboards').directive('dashlet', DashletDirective.factory());
}