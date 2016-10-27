namespace app.documentos {

	describe("Teste da diretiva visualizador-basico", () => {

		/**
		 * Escopo que simula a situação típica em que
		 * a diretiva será utilizada.
		 */
		interface TestScope extends ng.IScope {
			vm: {
				apiParaAcessarODocumento;
			};
		}

		let $compile: ng.ICompileService;
		let scope: TestScope;
		let element;
		let template;

		beforeEach(inject((_$compile_: ng.ICompileService, _$rootScope_: ng.IRootScopeService) => {
			$compile = _$compile_;
			scope = <TestScope>_$rootScope_.$new();

			scope.vm = {
				apiParaAcessarODocumento: "api/para/acessar-o-documento"
			};

			element = angular.element(`<a href="" stf-visualizador-basico="vm.apiParaAcessarODocumento"></a>`);
			template = $compile(element)(scope);
		}));

		it("Deveria compilar a diretiva sendo utilizada em uma anchor", () => {
			let controller = element.controller("stf-visualizador-basico");

			expect(controller).toBeDefined("A controller da diretiva deveria ter sido instalada no elemento");
		});

	});

}