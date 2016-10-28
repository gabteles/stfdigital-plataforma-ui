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

		beforeEach(() => {
			angular.mock.module("app.core");

			angular.module("app.autenticado", []);
			angular.mock.module("app.support.constants");
			angular.module("app.support", ["app.support.constants"]);

			angular.mock.module("ngMockE2E", "templates", "app.documentos");
		});

		beforeEach(inject((_$compile_: ng.ICompileService, _$rootScope_: ng.IRootScopeService, $httpBackend: ng.IHttpBackendService) => {
			$compile = _$compile_;

			$httpBackend.whenGET('http://docker:8765/documents/api/onlyoffice/baseUrl').respond("http://onlyoffice");

			scope = <TestScope>_$rootScope_.$new();

			scope.vm = {
				apiParaAcessarODocumento: "api/para/acessar-o-documento"
			};

			element = angular.element(`<a href="#" stf-visualizador-basico="vm.apiParaAcessarODocumento"></a>`);
			template = $compile(element)(scope);
			scope.$digest();
		}));

		it("Deveria compilar a diretiva sendo utilizada em uma anchor", () => {
			let controller = element.controller("stf-visualizador-basico");

			expect(controller).toBeDefined("A controller da diretiva deveria ter sido instalada no elemento");
		});

	});

}