namespace app.tarefas.painelDeFases {
	
	class SettingsSidenavController {
		
		public board: any;
		public palettes: ng.material.IPalette;
		public selectedMenu: string = 'CONFIGURACOES';
		
		/** @ngInject **/
		constructor($mdColorPalette: ng.material.IPalette,
					BoardService) {
            this.board = BoardService.data;
            this.palettes = $mdColorPalette;
		}
	}
	angular
		.module('app.tarefas.painel-de-fases')
		.controller('app.tarefas.painel-de-fases.SettingsSidenavController', SettingsSidenavController);
}