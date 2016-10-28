declare namespace app.pesquisaAvancada {
    class ComparisonOperator {
        static EQUALS: string;
        static CONTAINS: string;
        static BETWEEN: string;
        static GREATER_THAN: string;
        static LESS_THAN: string;
        static EXISTS: string;
    }
    class LogicalOperator {
        static MUST: string;
        static SHOULD: string;
        static MUST_NOT: string;
    }
    class TraitListItem {
        id: any;
        value: any;
        constructor(id: any, value: any);
    }
    interface ITrait {
        id: string;
        name: string;
        field: string;
        dataType: string;
        values?: Array<TraitListItem>;
        api?: string;
        apiId?: string;
        apiValue?: string;
    }
    class Criteria {
        logicalOperator: LogicalOperator;
        trait: ITrait;
        comparisonOperator: ComparisonOperator;
        value: any;
        valid: boolean;
        constructor(logicalOperator?: LogicalOperator, trait?: ITrait);
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
    interface ISearchConfig {
        traits: ITrait[];
        resultColumns: IResultColumn[];
        api: string;
        context: string;
    }
    interface ISearch {
        id: number;
        label: string;
        context: string;
        executable: boolean;
        criterias: Criteria[];
    }
}
