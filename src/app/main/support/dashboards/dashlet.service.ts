namespace app.support.dashboards {
	"use strict";

	export interface DashletConfiguration {
		id: string;
		definition: DashletDefinition;
	}

	export interface DashletDefinition {
		templateUrl?: string;
		template?: string;
		controller: string;
		controllerAs?: string;
	}

	export class DashletRegistry {
		
		private registeredDashlets = [];

		public registerDashlet(id: string, definition: DashletDefinition): DashletRegistry {
			this.registeredDashlets.push(<DashletConfiguration>{id: id, definition: definition});
			return this;
		}

		public recoverDashlet(id: string): DashletDefinition {
			for (let dashlet of this.registeredDashlets) {
				if (dashlet.id === id) {
					return dashlet.definition;
				}
			}
			throw new Error("Dashlet " + id + " não foi encontrado.");
		}

	}

	angular.module('app.support.dashboards').service('dashletRegistry', DashletRegistry);
}