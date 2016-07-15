namespace app.support.dashboards {
	
	export interface DashboardLayout {
		rows: DashboardRow[]
	}

	interface DashboardRow {
		columns: DashboardColumn[];
	}

	interface DashboardColumn {
		dashlet: Dashlet;
	}

	export class DashboardLayoutManager {

		constructor() {

		}

		public defaultLayout(dashlets: Dashlet[]): DashboardLayout {
			let layout: DashboardLayout = {
				rows: []
			};
			if (dashlets && dashlets.length > 0) {
				let currentRow: DashboardRow;
				for (var i = 0; i < dashlets.length; i++) { // Monta um layout tabular de duas colunas.
					if (i % 2 === 0) {
						currentRow = {
							columns: []
						};
						layout.rows.push(currentRow);
						currentRow.columns.push({dashlet: dashlets[i]});
					} else {
						currentRow.columns.push({dashlet: dashlets[i]});
					}
				}
			}
			return layout;
		}

	}

	angular.module('app.support.dashboards').service('app.support.dashboards.DashboardLayoutManager', DashboardLayoutManager);

}