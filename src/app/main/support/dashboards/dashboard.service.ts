namespace app.support.dashboards {
	'use strict';

	export interface Dashboard {
		id: string;
		nome: string;
		dashlets: Dashlet[];
	}

	export interface Dashlet {
		context: string;
		id: string;
		nome: string;
		src: string;
	}

	export class DashboardService {

		/** @ngInject **/
		constructor(private $http: ng.IHttpService, private properties: app.support.constants.Properties, private $ocLazyLoad: oc.ILazyLoad, private $q: ng.IQService, private dashletRegistry: DashletRegistry) {

		}

		public dashboards() : ng.IPromise<Dashboard> {
			return this.$http.get(this.properties.apiUrl + '/discovery/api/dashboards')
				.then((response: ng.IHttpPromiseCallbackArg<Dashboard>) => {
					return response.data;
				});
		}

		public loadDashlets(dashboard: Dashboard): ng.IPromise<DashletDefinition[]> {
			let dashlets: Dashlet[] = dashboard.dashlets;
			let dashletsContexts: string[] = [];
			let dashletsModules: string[] = [];
			let dashletsPromises = [];


			for (let dashlet of dashlets) {
				if (dashletsContexts.indexOf(dashlet.context) === -1) {
					dashletsContexts.push(dashlet.context);
				}
				if (dashletsModules.indexOf(dashlet.src) === -1) {
					dashletsModules.push(dashlet.src);
				}
			}

			return this.$q.all(dashletsContexts.map<ng.IPromise<{}>>((context) => {
				let bundle: string = context + '/bundle';
				return this.$q.when(System.import(bundle));
			})).then(() => {
				return this.$q.all(dashletsModules.map<ng.IPromise<{}>>((modulePath) => {
					return this.$q.when(System.import(modulePath).then((importedModule) => {
						let newModule = importedModule;

						if (!importedModule.name) {
							var key = Object.keys(importedModule);
							newModule = importedModule[key[0]];
						}

						return this.$q.when(this.$ocLazyLoad.load(newModule));
					}));
				}));
			}).then<DashletDefinition[]>(() => {
				return dashlets.map<DashletDefinition>((dashlet) => {
					return this.dashletRegistry.recoverDashlet(dashlet.id);
				});
			});
		}

	}

	angular
		.module('app.support.dashboards')
		.service('app.support.dashboards.DashboardService', DashboardService);
}