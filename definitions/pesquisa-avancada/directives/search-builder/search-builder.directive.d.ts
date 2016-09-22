declare namespace app.pesquisaAvancada {
    class ComparisionOperator {
        static IGUAL: string;
        static CONTEM: string;
        static ENTRE: string;
        static MAIORQUE: string;
        static MENORQUE: string;
        static EXISTE: string;
    }
    interface ISearch {
        id: number;
        label: string;
        criterias: ICriteria[];
    }
    interface ICriteria {
        id: number;
        value: string | Array<string>;
        trait: ITrait;
        logicalOperator: string;
        comparisonOperator: ComparisionOperator;
        isFavorite: boolean;
        valid: boolean;
    }
    interface ITrait {
        id: string;
        name: string;
        dataType: string;
        values: string[];
    }
    interface IResultColumn {
        header: {
            title: string;
            css: string;
            translate: string;
        };
        result: {
            field: string;
            css: string;
        };
    }
}
