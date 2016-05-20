namespace app.documentos {
	'use strict';
	
	declare var $: JQueryStatic;
	
	angular.module('app.documentos', ['app.autenticado', 'app.constants'])
	.run(['properties', 'app.documentos.OnlyofficeService', (properties, onlyofficeService: OnlyofficeService) => {
		onlyofficeService.recuperarUrlArquivoApi().then((url) => {
			$('body').append('<script src="' + url + '"></script>');
		});
	}]);
}