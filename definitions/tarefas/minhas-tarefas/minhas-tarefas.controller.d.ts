declare namespace app.tarefas.minhasTarefas {
    import IDialogService = angular.material.IDialogService;
    import ISidenavService = angular.material.ISidenavService;
    import IFilterService = angular.IFilterService;
    import IScope = angular.IScope;
    import IDocumentService = angular.IDocumentService;
    import IStateService = angular.ui.IStateService;
    import CommandService = app.support.command.CommandService;
    interface ISelectedFilter {
        filter: string;
        dueDate: number | boolean;
    }
    interface ITaskFilters {
        search: string;
        tags: ITaskTag[];
        completed: boolean;
        deleted: boolean;
        important: boolean;
        starred: boolean;
    }
    class MinhasTarefasController {
        private $document;
        private $mdDialog;
        private $mdSidenav;
        private $filter;
        private $scope;
        private $state;
        private commandService;
        private tasks;
        private tags;
        completed: Array<string>;
        colors: Array<string>;
        selectedFilter: ISelectedFilter;
        taskFilters: ITaskFilters;
        taskFiltersDefaults: ITaskFilters;
        showAllTasks: boolean;
        taskOrder: string;
        taskOrderDescending: boolean;
        sortableOptions: Object;
        msScrollOptions: Object;
        collapsed: boolean;
        newTag: string;
        /** @ngInject **/
        constructor($document: IDocumentService, $mdDialog: IDialogService, $mdSidenav: ISidenavService, $filter: IFilterService, $scope: IScope, $state: IStateService, commandService: CommandService, tasks: ITask[], tags: ITaskTag[]);
        /**
         * Prevent default
         *
         * @param e
         */
        preventDefault(e: Event): void;
        openTask(task: ITask): void;
        /**
         * Open new task dialog
         *
         * @param ev
         * @param task
         */
        openTaskDialog(ev: MouseEvent, task: ITask): void;
        /**
         * Toggle completed status of the task
         *
         * @param task
         * @param event
         */
        toggleCompleted(task: ITask, event: Event): void;
        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        toggleSidenav(sidenavId: string): void;
        /**
         * Toggles filter with true or false
         *
         * @param filter
         */
        toggleFilter(filter: string): void;
        /**
         * Toggles filter with true or empty string
         * @param filter
         */
        toggleFilterWithEmpty(filter: string): void;
        /**
         * Reset filters
         */
        resetFilters(): void;
        /**
         * Check filters and mark showAllthis.Tasks
         * as true if no filters selected
         */
        checkFilters(): void;
        /**
         * Filter Due Date
         *
         * @param item
         * @returns {boolean}
         */
        filterByDueDate(): Function;
        /**
         * Toggles tag filter
         *
         * @param tag
         */
        toggleTagFilter(tag: ITaskTag): void;
        /**
         * Returns if tag exists in the tagsFilter
         *
         * @param tag
         * @returns {boolean}
         */
        isTagFilterExists(tag: ITaskTag): boolean;
        processNewTagKeydown(event: KeyboardEvent): void;
        countTagsWithFilter(filter: string): number;
        hasSelectedTasks(): boolean;
        selectedCompleteDistribution(): number;
        selectedToggleCompleted($event: Event): void;
        removeSelection(): void;
    }
}
