namespace DocsAPI {

	export interface OnlyofficeDocument {
		src: string;
		name: string;
		callbackUrl: string;
	}
	
	export interface DocEditorFactory {
		new(id: string, document: OnlyofficeDocument): any;
	}
	
	export declare var DocEditor: DocEditorFactory;
}

namespace app.documentos {
	
	import IDirective = angular.IDirective;
	import IDirectiveFactory = angular.IDirectiveFactory;
	import IScope = angular.IScope;
	import IAugmentedJQuery = angular.IAugmentedJQuery;
	import IAttributes = angular.IAttributes;
	
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
	
	interface OnlyofficeDocument {
		src: string;
		name: string;
		callbackUrl: string;
	}
	
	interface OnlyofficeConfig {
		document: OnlyofficeDocument;
	}
	
	interface OnlyofficeScope extends IScope {
		config: OnlyofficeConfig;
		ready: boolean;
		save: Function;
		close: any;
	}
	
	class OnlyofficeDirective implements IDirective {

		public restrict: string = 'AE';
		public template: string = '<div id="onlyoffice-editor"></div>';
	
		public scope: Object = {
			config: "=onlyoffice",
		};
	
		constructor() {
			
		}
		
		public link($scope: OnlyofficeScope, el: IAugmentedJQuery, attrs: IAttributes) {
			$scope.$watch('config.document.src', () => {
				if (!$scope.config || !$scope.config.document || !$scope.config.document.src)
					return;
				
				let docUrl : string = $scope.config.document.src;
				
				let docTitle = $scope.config.document.name || docUrl;
				let docKey = key(docUrl);
				
				let docType = docUrl.split('?')[0].substring(docUrl.lastIndexOf(".") + 1).trim().toLowerCase();
				let documentType = getDocumentType(docType);
				
				let callbackUrl = $scope.config.document.callbackUrl;
				
				let defaultConfig = {
					type : "desktop",
					width : '100%',
					height : '100%',
					documentType : documentType,
					document : {
						title : docTitle,
						url : docUrl,
						fileType : docType,
						key : docKey,
						permissions : {
							edit : true,
							download : false
						}
					},
					editorConfig : {
						mode : 'edit',
						callbackUrl: callbackUrl
					},
					events : {
						onReady : function() {
							setTimeout(function() {
								$scope.$apply(function() {
									$scope.ready = true;
								});
							}, 5000);
						},
						onSave : function(event) {
							var url = event.data;
							$scope.save({
								url : url,
								close : $scope.close
							});
						}
					}
				};
			
				let config = angular.merge(defaultConfig, $scope.config);
				
				new DocsAPI.DocEditor("onlyoffice-editor", config);
			});
		}
		
		public static factory(): IDirectiveFactory {
			return () => {
				return new OnlyofficeDirective();
			};
		}
	
	}
	
	angular.module('app.documentos').directive('onlyoffice', OnlyofficeDirective.factory());
}