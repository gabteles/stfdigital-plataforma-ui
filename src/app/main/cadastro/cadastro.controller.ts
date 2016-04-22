namespace app.cadastro {
	'use strict';
	
	angular.module('app.cadastro').controller("app.CadastroController", CadastroController);

	interface ICadastro {
		tipoCadastro: number;
	}

	export class CadastroController {

		private form: ICadastro;

		constructor() {
			this.form.tipoCadastro = 1;
		}

		public cadastrar(): void {
			console.log("TODO: Fazer cadastro. Detalhes do usuário: ", this.form);
		}

	}
}