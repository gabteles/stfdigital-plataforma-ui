namespace app.documentos {

	class VisualizadorBasicoController {

	}

	class VisualizadorBasicoDirective implements ng.IDirective {

		public restrict: string = "A";

		public controller = VisualizadorBasicoController;
		public controllerAs: string = "vm";

		public static factory(): ng.IDirectiveFactory {
			return () => {
				return new VisualizadorBasicoDirective();
			};
		}

	}

	angular.module("app.documentos").directive("stfVisualizadorBasico", VisualizadorBasicoDirective.factory());

}