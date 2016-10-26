namespace app.support{
    describe('Teste do filtro readableFilesize', () => {
        let filter;
        beforeEach(angular.mock.module('app.support'));
        beforeEach(inject((_$filter_) => {
            filter = _$filter_('readableFilesize');
        }));

        it('Deveria retornar - quando o valor não for numérico', () => {
            expect(filter('abcde')).toEqual('-');
            expect(filter('')).toEqual('-');
            expect(filter(null)).toEqual('-');
            expect(filter(undefined)).toEqual('-');
            expect(filter(Number.POSITIVE_INFINITY)).toEqual('-');
        });

        it('Deveria transformar um valor em bytes na unidade apropriada', () => {
            expect(filter('12')).toEqual('12.0 B');
            expect(filter('1212')).toEqual('1.2 KB');
            expect(filter('1212123')).toEqual('1.2 MB');
            expect(filter('1212123123')).toEqual('1.1 GB');
            expect(filter('1212123123123')).toEqual('1.1 TB');
            expect(filter('1212123123123123')).toEqual('1.1 PB');
        });

        it('Deveria transformar um valor em bytes na unidade apropriada, com 2 casas decimais', () => {
            expect(filter('12', 2)).toEqual('12.00 B');
            expect(filter('1212', 2)).toEqual('1.18 KB');
            expect(filter('1212123', 2)).toEqual('1.16 MB');
            expect(filter('1212123123', 2)).toEqual('1.13 GB');
            expect(filter('1212123123123', 2)).toEqual('1.10 TB');
            expect(filter('1212123123123123', 2)).toEqual('1.08 PB');
        });
    });
}