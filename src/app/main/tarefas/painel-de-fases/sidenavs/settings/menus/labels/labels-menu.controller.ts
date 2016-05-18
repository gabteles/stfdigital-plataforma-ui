namespace app.tarefas.painelDeFases {
	
	class LabelsMenuController {
		
		public board: any;
		public palettes: ng.material.IPalette;
		public rgba: any;
		public hue: number = 500;
		public newLabelColor: string = 'red';
		public newLabelName: string = '';
		
		/** @ngInject **/
		constructor(private $document: ng.IDocumentService,
					private $translate: ng.translate.ITranslateService,
					$mdColorPalette: ng.material.IPalette,
					private $mdDialog: ng.material.IDialogService,
					fuseGenerator,
					private msUtils,
					BoardService) {
			
            this.board = BoardService.data;
            this.palettes = $mdColorPalette;
            this.rgba = fuseGenerator.rgba;
		}
		
        /**
         * Add New Label
         */
        public addNewLabel(): void {
            this.board.labels.push({
                id: this.msUtils.guidGenerator(),
                name: this.newLabelName,
                color: this.newLabelColor
            });
            this.newLabelName = '';
        }

        /**
         * Remove label
         *
         * @param ev
         * @param labelId
         */
        public removeLabel(ev, labelId): void {
            var confirm = this.$mdDialog.confirm()
                .title(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.REMOVER-ROTULO'))
                .parent(this.$document.find('#scrumboard'))
                .textContent(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.REMOVER-ROTULO-CONFIRMACAO'))
                .ariaLabel(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.REMOVER-ROTULO'))
                .targetEvent(ev)
                .clickOutsideToClose(true)
                .escapeToClose(true)
                .ok(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.REMOVER'))
                .cancel(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.CANCELAR'));

            this.$mdDialog.show(confirm).then(() => {
                var arr = this.board.labels;
                arr.splice(arr.indexOf(arr.getById(labelId)), 1);

                angular.forEach(this.board.cards, function (card) {
                    if (card.idLabels && card.idLabels.indexOf(labelId) > -1 ) {
                        card.idLabels.splice(card.idLabels.indexOf(labelId), 1);
                    }
                });
            });
        }	
	}
	
	angular
		.module('app.tarefas.painel-de-fases')
		.controller('app.tarefas.painel-de-fases.LabelsMenuController', LabelsMenuController);	
}