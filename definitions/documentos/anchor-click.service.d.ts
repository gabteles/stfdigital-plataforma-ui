declare namespace app.documentos {
    /**
     * Service auxiliar utilizado para tornar testável
     * o carregamento do documento PDF em uma nova aba.
     *
     * Sem essa delegação do clique, não seria possível
     * verificar esse carregamento.
     */
    class AnchorClickService {
        /**
         * Realiza o clique no elemento anchor.
         */
        clickAnchor(a: HTMLAnchorElement): void;
    }
}
