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

		const API_PARA_ACESSAR_DOCUMENTO = "/api/para/acessar-o-documento";
		const PDF_CONTENT = "%PDF-1.3\nAAA\n30 0 obj\n%%EOF333";

		let $compile: ng.ICompileService;
		let $rootScope: ng.IRootScopeService;
		let scope: TestScope;
		let element: ng.IAugmentedJQuery;
		let template;

		let anchorClickService: AnchorClickService;

		let $httpBackend: ng.IHttpBackendService;

		beforeEach(() => {
			angular.mock.module("app.core");

			angular.module("app.autenticado", []);
			angular.mock.module("app.support.constants");
			angular.module("app.support", ["app.support.constants"]);

			angular.mock.module("ngMockE2E", "templates", "app.documentos");
		});

		beforeEach(inject(["app.documentos.AnchorClickService", (_anchorClickService_: AnchorClickService) => {
			anchorClickService = _anchorClickService_;
		}]));

		beforeEach(inject((_$compile_: ng.ICompileService, _$rootScope_: ng.IRootScopeService, _$httpBackend_: ng.IHttpBackendService) => {
			$compile = _$compile_;
			$httpBackend = _$httpBackend_;
			$rootScope = _$rootScope_;

			$httpBackend.whenGET('http://docker:8765/documents/api/onlyoffice/baseUrl').respond(200, "http://onlyoffice");

			scope = <TestScope>_$rootScope_.$new();

			scope.vm = {
				apiParaAcessarODocumento: API_PARA_ACESSAR_DOCUMENTO
			};

			element = angular.element(`<a href="#" stf-visualizador-basico="vm.apiParaAcessarODocumento"></a>`);
			template = $compile(element)(scope);
			$rootScope.$digest();
		}));

		it("Deveria carregar o documento da api", () => {
			$httpBackend.expectGET(API_PARA_ACESSAR_DOCUMENTO).respond(200, PDF_CONTENT);

			element.triggerHandler("click");

			$httpBackend.verifyNoOutstandingExpectation();
		});

		it("Deveria carregar o documento em uma nova janela do navegador", () => {
			$httpBackend.expectGET(API_PARA_ACESSAR_DOCUMENTO).respond(200, PDF_CONTENT);

			element.triggerHandler("click");

			spyOn(anchorClickService, "clickAnchor").and.callFake((a: HTMLAnchorElement) => {
				expect(a.target).toBe("_blank");
				expect(a.href).toBeTruthy();
			});

			$httpBackend.flush();
		});

	});

}