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

		const API_PARA_ACESSAR_DOCUMENTO = "api/para/acessar-o-documento";
		const PDF_CONTENT = "%PDF-1.3\nAAA\n30 0 obj\n%%EOF";

		let $compile: ng.ICompileService;
		let scope: TestScope;
		let element: ng.IAugmentedJQuery;
		let template;

		let $httpBackend: ng.IHttpBackendService;

		beforeEach(() => {
			angular.mock.module("app.core");

			angular.module("app.autenticado", []);
			angular.mock.module("app.support.constants");
			angular.module("app.support", ["app.support.constants"]);

			angular.mock.module("ngMockE2E", "templates", "app.documentos");
		});

		beforeEach(inject((_$compile_: ng.ICompileService, _$rootScope_: ng.IRootScopeService, _$httpBackend_: ng.IHttpBackendService) => {
			$compile = _$compile_;
			$httpBackend = _$httpBackend_;

			$httpBackend.whenGET('http://docker:8765/documents/api/onlyoffice/baseUrl').respond("http://onlyoffice");

			scope = <TestScope>_$rootScope_.$new();

			scope.vm = {
				apiParaAcessarODocumento: API_PARA_ACESSAR_DOCUMENTO
			};

			element = angular.element(`<a href="#" stf-visualizador-basico="vm.apiParaAcessarODocumento"></a>`);
			template = $compile(element)(scope);
			scope.$digest();
		}));

		it("Deveria compilar a diretiva sendo utilizada em uma anchor", () => {
			let controller = element.controller("stf-visualizador-basico");

			expect(controller).toBeDefined("A controller da diretiva deveria ter sido instalada no elemento");
		});

		it("Deveria carregar o documento da api", () => {
			$httpBackend.expectGET(API_PARA_ACESSAR_DOCUMENTO).respond(PDF_CONTENT);

			element.triggerHandler("click");

			scope.$digest();

			$httpBackend.verifyNoOutstandingExpectation();
		});

		it("Deveria carregar o documento em uma nova janela do navegador", () => {
			$httpBackend.whenGET(API_PARA_ACESSAR_DOCUMENTO).respond(PDF_CONTENT);

			element.triggerHandler("click");

			scope.$digest();

			fail("TDD TODO Escrever verificação de se o documento foi aberto na nova aba");
		});

	});

}