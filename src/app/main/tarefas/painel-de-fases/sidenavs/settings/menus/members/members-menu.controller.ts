namespace app.tarefas.painelDeFases {
	
	class MembersMenuController {
		
		public board: any;
		public newMemberSearchInput: string = '';
		
		/** @ngInject **/	
		constructor(private $document: ng.IDocumentService,
					private $translate: ng.translate.ITranslateService,
					private $mdDialog: ng.material.IDialogService,
					BoardService) {
            this.board = BoardService.data;
            this.newMemberSearchInput = '';
		}
		
        /**
         * Add New Member
         */
        public addNewMember(): void {
            // Add new member
        }

        /**
         * Remove member
         *
         * @param ev
         * @param memberId
         */
        public removeMember(ev, memberId) {
            var confirm = this.$mdDialog.confirm()
                .title(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.REMOVER-MEMBRO'))
                .parent(this.$document.find('#scrumboard'))
                .textContent(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.REMOVER-MEMBRO-CONFIRMACAO'))
                .ariaLabel(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.REMOVER-MEMBRO'))
                .targetEvent(ev)
                .clickOutsideToClose(true)
                .escapeToClose(true)
                .ok(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.REMOVER'))
                .cancel(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.CANCELAR'));

            this.$mdDialog.show(confirm).then(() => {
                var arr = this.board.members;
                arr.splice(arr.indexOf(arr.getById(memberId)), 1);

                angular.forEach(this.board.cards, function (card) {
                    if ( card.idMembers && card.idMembers.indexOf(memberId) > -1 ) {
                        card.idMembers.splice(card.idMembers.indexOf(memberId), 1);
                    }
                });
            });
        }
	}
	
	angular
		.module('app.tarefas.painel-de-fases')
		.controller('app.tarefas.painel-de-fases.MembersMenuController', MembersMenuController);	
}