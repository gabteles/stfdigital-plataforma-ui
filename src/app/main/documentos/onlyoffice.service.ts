namespace app.documentos {
	'use strict';
	
	import IHttpService = angular.IHttpService;
	import IQService = angular.IQService;
	import IPromise = angular.IPromise;

	export class OnlyofficeService {
		
		private baseUrl: string;

		/** @ngInject **/
		constructor(private $http: IHttpService, private $q : IQService, private properties) { }

		private getBaseUrl(): IPromise<string> {
			if (!this.baseUrl) {
				return this.$http({
					method: "GET",
					url: this.properties.apiUrl + '/documents/api/onlyoffice/server/baseUrl',
					transformResponse: (data, headersGetter, status) => {
						return {
							url: data
						};
					}
				}).then((response: any) => {
					this.baseUrl = response.data.url;
					return this.baseUrl;
				});
			} else {
				return this.$q.when(this.baseUrl);
			}
		}
		
		public criarUrlConteudoDocumento(id: number) {
			return this.getBaseUrl().then(function(baseUrl) {
				return baseUrl + '/documents/api/onlyoffice/documentos/' + id + '/conteudo.docx';
			});
		}

		public gerarNumeroEdicao(id: number) : IPromise<any> {
			return this.$http.put(this.properties.apiUrl + '/documents/api/onlyoffice/documentos/' + id + '/edicao', null).then(function(response) {
				return response.data;
			});
		}
		
		public recuperarNumeroEdicao(id: number): IPromise<any> {
			return this.$http.get(this.properties.apiUrl + '/documents/api/onlyoffice/documentos/' + id + '/edicao').then(function(response) {
				return response.data;
			});
		}
		
		recuperarUrlCallback(id: number) {
			return this.$q.when(this.getBaseUrl()).then(function(baseUrl) {
				return baseUrl + '/documents/api/onlyoffice/documentos/' + id + '/callback';
			});
		}
		
		recuperarUrlArquivoApi(): IPromise<string> {
			return this.$http({
				method: "GET",
				url: this.properties.apiUrl + '/documents/api/onlyoffice/baseUrl',
				transformResponse: (data, headersGetter, status) => {
					return {
						url: data
					};
				}
			}).then((response: any) => {
				return response.data.url + '/OfficeWeb/apps/api/documents/api.js';
			});
		}
	}

	angular.module('app.documentos').service('app.documentos.OnlyofficeService', OnlyofficeService);
}