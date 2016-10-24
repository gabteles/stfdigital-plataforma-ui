namespace app.support{
    'use strict';

    describe("Teste do CPF Service", () => {
        let cpfService;
        beforeEach(angular.mock.module(
            'app.support'
        ));

        beforeEach(inject(['cpfService', (_cpfService) => {
            cpfService = _cpfService;
        }]));

        it('Deveria retornar CPF inválido para string com menos de 11 caracteres', () => {
            expect(cpfService.validarCPF('0026796716')).toEqual(false);
        });

        it('Deveria retornar CPF inválido para um CPF padrão', () => {
            expect(cpfService.validarCPF('33333333333')).toEqual(false);
        });

        it('Deveria retornar CPF inválido para string com \\w', () => {
            expect(cpfService.validarCPF('abc12345678')).toEqual(false);
        });

        it('Deveria retornar CPF inválido', () => {
            expect(cpfService.validarCPF('00167167150')).toEqual(false);
        });

        it('Deveria retornar CPF válido', () => {
            expect(cpfService.validarCPF('00267967160')).toEqual(true);
        });
    });
}