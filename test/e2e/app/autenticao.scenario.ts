import {LoginPage} from './shared/pages/login.page';
import {PrincipalPage} from './shared/pages/principal.page';

describe('Autenticação', () => {
	
	let loginPage: LoginPage = new LoginPage();
	let principalPage: PrincipalPage = new PrincipalPage();	
	                
	it('Deveria logar no sistema', () => {
		loginPage.open();
		loginPage.login('recebedor', '123');
	});

	it('Deveria fazer o logout do sistema', () => {
		principalPage.logout();
	});
})