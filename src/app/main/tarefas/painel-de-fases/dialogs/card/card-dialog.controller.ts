namespace app.tarefas.painelDeFases {
	
	class ScrumboardCardDialogController{
		
		public board: any;
		public card: any;
		public editLabelId: string;
		public newLabelName: string;
		public newLabelColor: string;
		public members: any;
		public labels: any;
		public palettes: any;
		public rgba: any;
		public toggleInArray: any;
		public exists: any;
		public labelSearchText: string;
		public memberSearchText: string;
		public newCheckListTitle: string;
		
		/** @ngInject **/
		constructor(private $document: ng.IDocumentService, 
					private $mdDialog: ng.material.IDialogService,
					private fuseTheming,
					private fuseGenerator,
					private msUtils,
					private $translate: ng.translate.ITranslateService,
					BoardService, cardId) {
			
			//Data
            this.board = BoardService.data;
            this.card = this.board.cards.getById(cardId);
            this.newLabelColor = 'red';
            this.members = this.board.members;
            this.labels = this.board.labels;
            
            // Methods
            this.palettes = this.fuseTheming.getRegisteredPalettes();
            this.rgba = this.fuseGenerator.rgba;
            this.toggleInArray = this.msUtils.toggleInArray;
            this.exists = this.msUtils.exists;
            
            // Convert due date to the date object
            if ( this.card.due ) {
                this.card.due = new Date(this.card.due);
            }
		}
		
        /**
         * Close Dialog
         */
        public closeDialog() {
            this.$mdDialog.hide();
        }

        /**
         * Get Card List
         */
        public getCardList() {
            var response;
            for ( var i = 0, len = this.board.lists.length; i < len; i++ ) {
                if ( this.board.lists[i].idCards.indexOf(this.card.id) > -1 ) {
                    response = this.board.lists[i];
                    break;
                }
            }
            return response;
        }

        /**
         * Remove card
         *
         * @param ev
         */
        public removeCard(ev) {
            var confirm = this.$mdDialog.confirm().
                title(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.REMOVER-CARTAO'))
                .parent(this.$document.find('#scrumboard'))
                .textContent(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.REMOVER-CARTAO-CONFIRMACAO'))
                .ariaLabel(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.REMOVER-CARTAO'))
                .targetEvent(ev)
                .clickOutsideToClose(true)
                .escapeToClose(true)
                .ok(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.REMOVER'))
                .cancel(this.$translate.instant('TAREFAS.PAINEL-DE-FASES.DIALOGO.CANCELAR'));

            this.$mdDialog.show(confirm).then(() => {
                var cardList = this.getCardList();
                cardList.idCards.splice(cardList.idCards.indexOf(this.card.id), 1);
                this.board.cards.splice(this.board.cards.indexOf(this.card), 1);
            });
        }

        /**
         * Toggle cover image
         *
         * @param attachmentId
         */
        public toggleCoverImage(attachmentId) {
            if ( attachmentId === this.card.idAttachmentCover ) {
                this.card.idAttachmentCover = null;
            } else {
                this.card.idAttachmentCover = attachmentId;
            }
        }

        /**
         * Remove attachment
         *
         * @param item
         */
        public removeAttachment(item) {
            if ( this.card.idAttachmentCover === item.id ) {
                this.card.idAttachmentCover = '';
            }
            this.card.attachments.splice(this.card.attachments.indexOf(item), 1);
        }

        /**
         * Add label chips
         *
         * @param query
         * @returns {filterFn}
         */
        public labelQuerySearch(query) {
            return query ? this.labels.filter(this.createFilterFor(query)) : [];
        }

        /**
         * Label filter
         *
         * @param label
         * @returns {boolean}
         */
        public filterLabel(label) {
            if ( !this.labelSearchText || this.labelSearchText === '' ) {
                return true;
            }

            return angular.lowercase(label.name).indexOf(angular.lowercase(this.labelSearchText)) >= 0;
        }

        /**
         * Add new label
         */
        public addNewLabel() {
            this.board.labels.push({
                "id"   : this.msUtils.guidGenerator(),
                "name" : this.newLabelName,
                "color": this.newLabelColor
            });

            this.newLabelName = '';
        }

        /**
         * Remove label
         */
        public removeLabel() {
            var arr = this.board.labels;
            arr.splice(arr.indexOf(arr.getById(this.editLabelId)), 1);

            angular.forEach(this.board.cards, card => {
                if ( card.idLabels && card.idLabels.indexOf(this.editLabelId) > -1 ) {
                    card.idLabels.splice(card.idLabels.indexOf(this.editLabelId), 1);
                }
            });

            this.newLabelName = '';
        }

        /**
         * Add member chips
         *
         * @param query
         * @returns {Array}
         */
        public memberQuerySearch(query) {
            return query ? this.members.filter(this.createFilterFor(query)) : [];
        }

        /**
         * Member filter
         *
         * @param member
         * @returns {boolean}
         */
        public filterMember(member) {
            if ( !this.memberSearchText || this.memberSearchText === '' ) {
                return true;
            }

            return angular.lowercase(member.name).indexOf(angular.lowercase(this.memberSearchText)) >= 0;
        }

        /**
         * Update check list stats
         * @param list
         */
        public updateCheckedCount(list) {
            var checkItems = list.checkItems;
            var checkedItems = 0;
            var allCheckedItems = 0;
            var allCheckItems = 0;

            angular.forEach(checkItems, function (checkItem) {
                if ( checkItem.checked ) {
                    checkedItems++;
                }
            });

            list.checkItemsChecked = checkedItems;

            angular.forEach(this.card.checklists, function (item) {
                allCheckItems += item.checkItems.length;
                allCheckedItems += item.checkItemsChecked;
            });

            this.card.checkItems = allCheckItems;
            this.card.checkItemsChecked = allCheckedItems;
        }

        /**
         * Add checklist item
         *
         * @param text
         * @param checkList
         */
        public addCheckItem(text, checkList) {
            if ( !text || text === '' ) {
                return;
            }

            var newCheckItem = {
                'name'   : text,
                'checked': false
            };

            checkList.checkItems.push(newCheckItem);

            this.updateCheckedCount(checkList);
        }

        /**
         * Remove checklist
         *
         * @param item
         */
        public removeChecklist(item) {
            this.card.checklists.splice(this.card.checklists.indexOf(item), 1);

            angular.forEach(this.card.checklists, list => {
                this.updateCheckedCount(list);
            });
        }

        /**
         * Create checklist
         */
        public createCheckList() {
            this.card.checklists.push({
                "id"               : this.msUtils.guidGenerator(),
                "name"             : this.newCheckListTitle,
                "checkItemsChecked": 0,
                "checkItems"       : []
            });

            this.newCheckListTitle = '';
        }

        /**
         * Add new comment
         *
         * @param newCommentText
         */
        public addNewComment(newCommentText) {
            var newComment = {
                "idMember": "36027j1930450d8bf7b10158",
                "message" : newCommentText,
                "time"    : "now"
            };

            this.card.comments.unshift(newComment);
        }

        /**
         * Filter for chips
         *
         * @param query
         * @returns {filterFn}
         */
        public createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item)
            {
                return angular.lowercase(item.name).indexOf(lowercaseQuery) >= 0;
            };
        }	
	}
	
    angular
    	.module('app.tarefas.painel-de-fases')
    	.controller('app.tarefas.painel-de-fases.ScrumboardCardDialogController', ScrumboardCardDialogController);
}