namespace app.documentos {
	
	import IDirective = angular.IDirective;
	import IDirectiveFactory = angular.IDirectiveFactory;
	import IScope = angular.IScope;
	import IAugmentedJQuery = angular.IAugmentedJQuery;
	import IAttributes = angular.IAttributes;
	import ITimeoutService = angular.ITimeoutService;
	
	// Funções utilitárias
	
	function key(k: string): string {
		var result : string = k.replace(new RegExp("[^0-9-.a-zA-Z_=]", "g"), "_");
		return result.substring(result.length - Math.min(result.length, 50));
	}
	
	function getDocumentType(ext : string): string {
		if (".docx.doc.odt.rtf.txt.html.htm.mht.pdf.djvu.fb2.epub.xps".indexOf(ext) != -1)
			return "text";
		if (".xls.xlsx.ods.csv".indexOf(ext) != -1)
			return "spreadsheet";
		if (".pps.ppsx.ppt.pptx.odp".indexOf(ext) != -1)
			return "presentation";
		return null;
	}
	
	interface OnlyofficeScope extends IScope {
		config: DocumentConfig;
		docEditor: DocsAPI.OnlyofficeDocEditor;
		ready: boolean;
	}
	
	export interface DocumentConfig {
		document: Document;
		user: User;
	}
	
	export interface Document {
		src: string;
		key: string;
		name: string;
		callbackUrl: string;
	}
	
	export interface User {
		id: string;
		name: string;
	}
	
	class OnlyofficeDirective implements IDirective {

		public restrict: string = 'AE';
		public template: string = '<div id="onlyoffice-editor"></div>';
	
		public scope: Object = {
			config: "=onlyoffice",
		};

		constructor(private $timeout: ITimeoutService) {
			
		}
		
		public link($scope: OnlyofficeScope, el: IAugmentedJQuery, attrs: IAttributes) {
			$scope.$watch('config.document.src', (newVal) => {
				if (!newVal)
					return;
				
				let docUrl : string = $scope.config.document.src;
				
				let docTitle = $scope.config.document.name || docUrl;
				let docKey = key(docUrl);
				
				let docType = docUrl.split('?')[0].substring(docUrl.lastIndexOf(".") + 1).trim().toLowerCase();
				let documentType = getDocumentType(docType);
				
				let callbackUrl = $scope.config.document.callbackUrl;
				
				let config: DocsAPI.OnlyofficeConfig = {
					documentType : documentType,
					height : '100%',
					type : "desktop",
					width : '100%',
					document : {
						fileType : docType,
						key : $scope.config.document.key || docKey,
						title : docTitle,
						url : docUrl,
						permissions : {
							edit : true,
							download : false,
							print: true
						},
					},
					editorConfig : {
						callbackUrl: callbackUrl,
						lang: 'pt-BR',
						mode : 'edit',
						customization: {
							about: true,
							chat: true
						}
					},
					events : {
						onReady : function() {
							this.$timeout(function() {
								$scope.ready = true;
							}, 0);
						},
						
					}
				};
				
				$scope.docEditor = new DocsAPI.DocEditor("onlyoffice-editor", config);
			});
		}
		
		public static factory(): IDirectiveFactory {
			return ($timeout: ITimeoutService) => {
				"ngInject";
				return new OnlyofficeDirective($timeout);
			};
		}
	
	}
	
	angular.module('app.documentos').directive('onlyoffice', OnlyofficeDirective.factory());
}