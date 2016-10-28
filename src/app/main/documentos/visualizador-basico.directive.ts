namespace app.documentos {

	export class VisualizadorBasicoDirective implements ng.IDirective {

		public restrict: string = "A";

		public static factory() {
			return ["$http", "$parse", "app.documentos.AnchorClickService",
					($http: ng.IHttpService, $parse: ng.IParseService, anchorClickService: AnchorClickService) => {
				return new VisualizadorBasicoDirective($http, $parse, anchorClickService);
			}];
		}

		public constructor(private $http: ng.IHttpService, private $parse: ng.IParseService, private anchorClickService: AnchorClickService) {

		}

		public link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
			element.bind("click", () => this.clickCallback(scope, element, attrs));
		}

		private clickCallback(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
			let url = this.$parse(attrs["stfVisualizadorBasico"])(scope);
			this.$http.get(url, {responseType: "arraybuffer"}).then((response) => {
				let a: any = document.createElement("a");
				a.style = "display: none";
				document.body.appendChild(a);
				let blob = new Blob([response.data], {type: "application/pdf"});
				let url = window.URL.createObjectURL(blob);
				a.href = url;
				a.target = "_blank";
				
				this.anchorClickService.clickAnchor(a); // Delega o clique para tornar a diretiva testável

				document.body.removeChild(a);
			});
		}

	}

	angular.module("app.documentos").directive("stfVisualizadorBasico", VisualizadorBasicoDirective.factory());

}