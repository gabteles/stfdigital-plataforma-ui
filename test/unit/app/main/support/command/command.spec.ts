namespace app.support.command {

	describe('Command', () => {
		
		class Remessa implements CommandTarget<Remessa> {
			type: string;
			status: string;
			volumes: number;
		}
	
		class TestConditionHandler implements ConditionHandler<Remessa> {
			
			match(targets: CommandTarget<Remessa>[]): boolean {
				targets.forEach((target: Remessa) => {
					if (target.type !== "Originario") {
						return false;
					}
				});
				return true;
			}
		}
		
		let remessa: Remessa = new Remessa();
		remessa.type = "Originario";
		
		let command: Command = new Command();
		command.id = "registrar";
		command.context = "recebimento";
		command.description = "Registrar";
		command.listable = false;
		command.target = <TargetConfig> {
			mode: "One",
			type: "Remessa"
		}
		command.addHandler(new TestConditionHandler());
		
		class CommandServiceTest {
			
			constructor(private command: Command) { }
			//verificar sintaxe
			addHandler(handler: {new(): ConditionHandler<any>}): void {
				this.command.addHandler(new handler);
			}
		}

		it('O target deve ser válido para o comando', () => {
			expect(command.match([remessa])).toEqual(true);
		});
		
		it('O handler deve validar o target', () => {
			let handler: ConditionHandler<Remessa> = new TestConditionHandler();
			expect(handler.match([remessa])).toEqual(true);
		});
		
		it('O handler deve invalidar o target', () => {
			remessa.type = "Recursal"
			let handler: ConditionHandler<Remessa> = new TestConditionHandler();
			expect(handler.match([remessa])).toEqual(true);
		});
		
		it('O serviço deve adicionar o handler ao comando', () => {
			spyOn(command, 'addHandler').and.callThrough();
			let service: CommandServiceTest = new CommandServiceTest(command);
			service.addHandler(TestConditionHandler);
			expect(command.addHandler).toHaveBeenCalledWith(new TestConditionHandler());
		});
		
	});
}