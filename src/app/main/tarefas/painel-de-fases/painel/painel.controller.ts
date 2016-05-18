namespace app.tarefas.painelDeFases {
	
	class TarefasPainelDeFasesPainelController {
		
		public currentView: string = 'board';
        public board: any;
        public boardList: any;
        public cardFilters: any;
        public filteringIsOn: any;
        public openCardDialog: any;
        public clearFilters: any;
        public card: any = {};
        public cardOptions: any = {};
        public newListName: string = '';
        public sortableListOptions: any;
		public sortableCardOptions: any;
		
		/** @ngInject **/
		constructor(private $document: ng.IDocumentService,
					private $mdDialog: ng.material.IDialogService,
					private $mdSidenav: ng.material.ISidenavService,
					private msUtils,
					BoardList,
					BoardService,
					CardFilters, 
					DialogService) {
            // Data
            this.currentView = 'board';
            this.board = BoardService.data;
            this.boardList = BoardList.data;
            this.cardFilters = CardFilters;
            this.filteringIsOn = CardFilters.isOn;
            this.openCardDialog = DialogService.openCardDialog;
            this.clearFilters = CardFilters.clear;
            this.sortableListOptions = {
                axis       : 'x',
                delay      : 75,
                distance   : 7,
                items      : '> .list-wrapper',
                handle     : '.list-header',
                placeholder: 'list-wrapper list-sortable-placeholder',
                tolerance  : 'pointer',
                start      : function (event, ui) {
                    var width = ui.item[0].children[0].clientWidth;
                    var height = ui.item[0].children[0].clientHeight;

                    ui.placeholder.css({
                        'min-width': width + 'px',
                        'width'    : width + 'px',
                        'height'   : height + 'px'
                    });
                }
            };
            this.sortableCardOptions = {
                appendTo            : 'body',
                connectWith         : '.list-cards',
                delay               : 75,
                distance            : 7,
                forceHelperSize     : true,
                forcePlaceholderSize: true,
                handle              : this.msUtils.isMobile() ? '.list-card-sort-handle' : false,
                helper              : function (event, el)
                {
                    return el.clone().addClass('list-card-sort-helper');
                },
                placeholder         : 'list-card card-sortable-placeholder',
                tolerance           : 'pointer',
                scroll              : true,
                sort                : function (event, ui)
                {
                    var listContentEl = ui.placeholder.closest('.list-content');
                    var boardContentEl = ui.placeholder.closest('#board');

                    if ( listContentEl )
                    {
                        var listContentElHeight = listContentEl[0].clientHeight,
                            listContentElScrollHeight = listContentEl[0].scrollHeight;

                        if ( listContentElHeight !== listContentElScrollHeight )
                        {
                            var itemTop = ui.position.top,
                                itemBottom = itemTop + ui.item.height(),
                                listTop = listContentEl.offset().top,
                                listBottom = listTop + listContentElHeight;

                            if ( itemTop < listTop + 25 )
                            {
                                listContentEl.scrollTop(listContentEl.scrollTop() - 25);
                            }

                            if ( itemBottom > listBottom - 25 )
                            {
                                listContentEl.scrollTop(listContentEl.scrollTop() + 25);
                            }
                        }
                    }

                    if ( boardContentEl )
                    {
                        var boardContentElWidth = boardContentEl[0].clientWidth;
                        var boardContentElScrollWidth = boardContentEl[0].scrollWidth;

                        if ( boardContentElWidth !== boardContentElScrollWidth )
                        {
                            var itemLeft = ui.position.left,
                                itemRight = itemLeft + ui.item.width(),
                                boardLeft = boardContentEl.offset().left,
                                boardRight = boardLeft + boardContentElWidth;

                            if ( itemLeft < boardLeft + 25 )
                            {
                                boardContentEl.scrollLeft(boardContentEl.scrollLeft() - 25);
                            }

                            if ( itemRight > boardRight)
                            {
                                boardContentEl.scrollLeft(boardContentEl.scrollLeft() + 25);
                            }
                        }
                    }
                }
            };

            Array.prototype['getById'] = function(value) {
                return this.find(function (x) { return x.id === value; });
            };
		}
		
        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        public toggleSidenav(sidenavId): void {
            this.$mdSidenav(sidenavId).toggle();
        }

        /**
         * Card filter
         *
         * @param cardId
         * @returns {*}
         */
        public cardFilter(cardId): boolean|any {
            var card = this.board.cards.find(function(card) { return card.id === cardId; });

            try {
                if ( angular.lowercase(card.name).indexOf(angular.lowercase(this.cardFilters.name)) < 0 ) {
                    throw false;
                }

                angular.forEach(this.cardFilters.labels, label => {
                    if ( !this.msUtils.exists(label, card.idLabels) ) {
                        throw false;
                    }
                });

            } catch ( err ) {
                return err;
            }
            return true;
        }

        /**
         * Is the card overdue?
         *
         * @param cardDate
         * @returns {boolean}
         */
        public isOverdue(cardDate): boolean {
            return new Date() > cardDate;
        }	
	}	
}