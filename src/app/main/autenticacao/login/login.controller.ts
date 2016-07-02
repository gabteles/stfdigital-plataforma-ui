namespace app.autenticacao {
	'use strict';

	import IStateService = angular.ui.IStateService;
	import IHttpService = angular.IHttpService;
	import MessagesService = app.support.messaging.MessagesService;
	
	export class LoginController {
	
		public form: any;
		
		/** @ngInject **/
		constructor(private $state: IStateService, private $rootScope: any, private $http: IHttpService, private messagesService: MessagesService, private AuthService?: (d: any) => any) { }

		public entrar(): void {
			this.AuthService.login(this.form.usuario, this.form.senha).then(() => {
				this.$state.go('app.tarefas.minhas-tarefas');
            }, () => {
				this.messagesService.error('Usuário e/ou senha inválido(s).'); 
            });
		}
	}

	angular.module('app.login').controller('app.login.LoginController', LoginController);
}