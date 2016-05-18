namespace app.tarefas.painelDeFases {
	
	class FiltersSidenavController {
		
		public board: any;
		public cardFilters: any;
		public labels: any;
		public members: any;
		public selectedMenu: string;
		public exists: any;
		public toggleInArray: any;
		public clearFilters: any;
		public filteringIsOn: any;
		
		/** @ngInject **/
		constructor(msUtils, BoardService, CardFilters) {
			//Data
            this.board = BoardService.data;
            this.cardFilters = CardFilters;
            this.labels = this.board.labels;
            this.members = this.board.members;
            this.selectedMenu = 'Settings';

            // Methods
            this.exists = msUtils.exists;
            this.toggleInArray = msUtils.toggleInArray;
            this.clearFilters = CardFilters.clear;
            this.filteringIsOn = CardFilters.isOn;
		}
	}
	
	angular
		.module('app.tarefas.painel-de-fases')
		.controller('app.tarefas.painel-de-fases.FiltersSidenavController', FiltersSidenavController);
}