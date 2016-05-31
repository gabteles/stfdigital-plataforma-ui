namespace app.documentos {
	
	import IDirective = angular.IDirective;
	import IDirectiveFactory = angular.IDirectiveFactory;
	import IScope = angular.IScope;
	
	export interface EditorScope extends IScope {
		api: any;
		documento: any;
		edicaoConcluida: any;
		edicaoIniciada: Function;
		edicaoTimeout: any;
		aguardarConclusao: any;
	}
	
	class EditorDirective implements IDirective {
	
		public restrict: string = 'AE';
		public templateUrl: string = 'app/main/documentos/directives/editor/editor.tpl.html';
	
		public scope: Object = {
			api: "=?",
			documento: "=onlyofficeEditor",
			edicaoConcluida: "&",
			edicaoIniciada: "&",
			edicaoTimeout: "&",
			aguardarConclusao: "@"
		};
	
		public controller: any = EditorController;
		public controllerAs: string = 'vm';
	
		constructor() {
			this.templateUrl = 'app/main/documentos/directives/editor/editor.tpl.html';
		}
		
		public static factory(): IDirectiveFactory {
			return () => {
				return new EditorDirective();
			};
		}
	
	}
	
	angular.module('app.documentos').directive('onlyofficeEditor', EditorDirective.factory());
}