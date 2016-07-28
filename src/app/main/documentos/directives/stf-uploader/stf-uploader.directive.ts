namespace app.documentos {
	
	/**
	 * Permite realizar o upload de arquivos para o contexto
	 * de documentos.
	 * 
	 * @author Tomas.Godoi
	 * @since 0.0.1
	 */
	export class StfUploaderDirective implements ng.IDirective {
		//TODO Extrair o código do peticionamento e trazer para cá.

		public static factory(): ng.IDirectiveFactory {
			return () => {
				return new StfUploaderDirective();
			};
		}

	}

	angular.module('app.documentos').directive('stfUploaderDirective', StfUploaderDirective.factory());

}