namespace app.core {

	export interface StfHeaderScope extends ng.IScope {
		layoutOnly: boolean;
		fabAction: any;
		fabAriaLabel: any;
		fabIcon: any;
		fabText: any;
		fabActive: any;
        path: any;
        hasFabAction: boolean;
	}

    /**
     * Diretiva <stf-header>
     *
     * Mostra o cabeçalho padrão para as views. Faz breadcrumbs automaticamente
     * e mostra o título usando o serviço de navegação do FUSE. 
     *
     * O conteúdo da tag ficará alinhado do lado direito do header.
     *
     * É possível utilizar o atributo layout-only="true|false" para exibir 
     * somente o conteúdo da tag, sem breadcrumb e título.
     */
    class StfHeader implements ng.IDirective {

		public scope: Object = {
            'layoutOnly': '=',
            'fabAction': '&',
            'fabAriaLabel': '@',
            'fabIcon': '@',
            'fabText': '@',
            'fabActive': '=',
            'path': '='
        };

        public templateUrl: string = 'app/main/core/directives/stf-header/stf-header.html';

        public transclude: boolean = true;

        public controller: any = StfHeaderController;
        public controllerAs: string = 'vm';

        constructor(private msNavigationService) {

        }

        public link($scope: StfHeaderScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
            $scope.hasFabAction = angular.isDefined(attrs.$attr['fabAction']);
        }

		public static factory(): ng.IDirectiveFactory {
			return (msNavigationService) => {
				"ngInject";
				return new StfHeader(msNavigationService);
			};
		}

    }

    angular.module('app.core').directive('stfHeader', StfHeader.factory());

}