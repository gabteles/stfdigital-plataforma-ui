namespace app.documentos {

    /**
     * Service auxiliar utilizado para tornar testável
     * o carregamento do documento PDF em uma nova aba.
     * 
     * Sem essa delegação do clique, não seria possível
     * verificar esse carregamento.
     */
    export class AnchorClickService {

        /**
         * Realiza o clique no elemento anchor.
         */
        public clickAnchor(a: HTMLAnchorElement) {
            a.click();
        }

    }

    angular.module("app.documentos").service("app.documentos.AnchorClickService", AnchorClickService);

}