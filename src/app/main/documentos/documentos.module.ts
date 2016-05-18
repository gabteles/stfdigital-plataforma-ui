namespace app.documentos {
	'use strict';
	
	declare var $: JQueryStatic;
	
	angular.module('app.documentos', ['app.autenticado', 'app.constants']).run((properties) => {
		"ngInject";
		$('body').append('<script src="' + properties.apiUrl + '/OfficeWeb/apps/api/documents/api.js' + '"></script>');
	});
}