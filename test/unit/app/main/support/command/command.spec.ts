namespace app.support.command {
	
	import Properties = app.support.constants.Properties;
	
	describe('Command', () => {
		
		class Remessa implements CommandTarget {
			type: string = "Originario";
			status: string;
			volumes: number;
		}
	
		class TestMatcher implements CommandMatcher {
			
			match(targets: Remessa[]): boolean {
				for (let target of targets) {
					if (target.type !== "Originario") {
						return false;
					}
				}
				return true;
			}
		}
		
		class TestValidator implements CommandValidator {
			public id: string = 'registrar';
			public isValid(command: RegistrarRemessaCommand): boolean {
				return command != null;
			}
		}
		
		class RegistrarRemessaCommand implements Command { }
		
		let http: ng.IHttpBackendService;
		let commandService: CommandService;
		let commandConfig: CommandConfig;
		let remessa: Remessa;
		
		beforeEach(angular.mock.module('app.support.command'));
		
		beforeEach(inject((properties: Properties, $httpBackend: ng.IHttpBackendService) => {
			http = $httpBackend;
			http.whenGET(properties.apiUrl + '/discovery/api/commands').respond([commandConfig])
		}));
		
		beforeEach(inject((_commandService_: CommandService) => {
			http.flush();
			commandService = _commandService_;
			
			commandConfig = <CommandConfig> {};
			commandConfig.id = "registrar";
			commandConfig.context = "recebimento";
			commandConfig.description = "Registrar";
			commandConfig.listable = false;
			commandConfig.target = <TargetConfig> {
				mode: "One",
				type: "Remessa"
			}
			
			remessa = new Remessa();
		}));
		
		it('O matcher deve invalidar o target', () => {
			remessa.type = "Recursal"
			let matcher: TestMatcher = new TestMatcher();
			
			expect(matcher.match([remessa])).toBeFalsy();
		});
		
		it('O serviço deve listar o comando', () => {
			commandService.list()
				.then(comandos => expect(comandos[0]).toEqual([commandConfig]));
		});
		
		it('O serviço deve pesquisar o comando', () => {
			commandService.findById('registrar')
				.then(comando => expect(comando).toEqual(commandConfig));
		});
		
		it('O serviço deve validar o comando', () => {
			commandService.addValidator(new TestValidator());
			commandService.isValid('registrar', 'registrar', new RegistrarRemessaCommand())
				.then(valid => expect(valid).toBeTruthy());
		});
		
		it('O serviço deve listar o comando relacionado ao target', () => {
			commandService.addMatcher('registrar', new TestMatcher());
			commandService.listMatched([remessa])
				.then(comandos => expect(comandos).toEqual([commandConfig]));
		});
		
		it('O serviço deve filtrar o comando relacionado ao target', () => {
			let filtro: CommandFilter = <CommandFilter> {
				context: 'Recebimento',
				targetType: 'Remessa'
			}
			commandService.listMatched([remessa], filtro)
				.then(comandos => expect(comandos).toEqual([commandConfig]));
		});
		
	});
}