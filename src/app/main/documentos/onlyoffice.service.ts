namespace app.documentos {
	'use strict';
	
	import IHttpService = angular.IHttpService;
	import IQService = angular.IQService;
	import IPromise = angular.IPromise;
	import ICookies = angular.cookies.ICookiesService;

	export class OnlyofficeService {
		
		private baseUrl: string;

		/** @ngInject **/
		constructor(private $http: IHttpService, private $q : IQService, private properties: app.support.constants.Properties,
			private $cookies: ICookies) { }

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
		
		private accessToken(): string {
			return this.$cookies.get('access_token');
		}

		private accessTokenParam(): string {
			return 'access_token=' + this.accessToken();
		}

		private csrfParam(): string {
			return '_csrf=' + this.accessToken();
		}

		public criarUrlConteudoDocumento(id: number) {
			return this.getBaseUrl().then((baseUrl) => {
				return baseUrl + '/documents/api/onlyoffice/documentos/' + id + '/conteudo.docx?' + this.accessTokenParam();
			});
		}

		public gerarNumeroEdicao(id: number) : IPromise<any> {
			return this.$http.put(this.properties.apiUrl + '/documents/api/onlyoffice/documentos/' + id + '/edicao', null).then((response) => {
				return response.data;
			});
		}
		
		public recuperarNumeroEdicao(id: number): IPromise<any> {
			return this.$http.get(this.properties.apiUrl + '/documents/api/onlyoffice/documentos/' + id + '/edicao').then((response) => {
				return response.data;
			});
		}
		
		recuperarUrlCallback(id: number) {
			return this.$q.when(this.getBaseUrl()).then((baseUrl) => {
				return baseUrl + '/documents/api/onlyoffice/documentos/' + id + '/callback?' + this.accessTokenParam() + '&' + this.csrfParam();
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
				return response.data.url + '/web-apps/apps/api/documents/api.js';
			});
		}
	}

	angular.module('app.documentos').service('app.documentos.OnlyofficeService', OnlyofficeService);
}