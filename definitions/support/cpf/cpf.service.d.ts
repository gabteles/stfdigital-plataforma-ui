/**
 * @author Gabriel Teles
 *
 * @since 1.0.0
 * @since 10.12.2015
 */
declare namespace app.support {
    class CPFService {
        constructor();
        /**
         * Valida um CPF
         *
         * @param string numero O número do cpf, sem ponto ou traço
         * @return boolean Validade do CPF
         */
        validarCPF(numero: string): boolean;
        /**
         * Verifica se o CPF é padrão
         *
         * @param string numero O número do cpf, sem ponto ou traço
         * @return boolean
         */
        private _isCPFPadrao(numero);
    }
}
