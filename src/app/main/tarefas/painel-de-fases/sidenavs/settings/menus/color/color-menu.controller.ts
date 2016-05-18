namespace app.tarefas.painelDeFases {
	
	class ColorMenuController {
		
		public board: any;
		public palettes: any;
		
		/** @ngInject **/
		constructor($mdColorPalette: ng.material.IPalette,
					BoardService) {
            this.board = BoardService.data;
            this.palettes = $mdColorPalette;
		}
	}
	
	angular
		.module('app.tarefas.painel-de-fases')
		.controller('app.tarefas.painel-de-fases.ColorMenuController', ColorMenuController);
}