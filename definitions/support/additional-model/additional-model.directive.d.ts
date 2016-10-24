declare namespace app.support {
    interface StfAdditionalModelScope {
        stfAdditionalModel: Object;
        $watch: Function;
    }
    /**
     * Diretiva que permite fazer o bind adicional de uma variável
     * quando usado em combinação com o ng-model. Esse bind é apenas
     * one-way, sincronizando o $modelValue atual do ng-model com
     * a variável especificada nessa diretiva.
     */
    class StfAdditionalModel implements ng.IDirective {
        scope: Object;
        require: string;
        constructor();
        link($scope: StfAdditionalModelScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: any): void;
        static factory(): ng.IDirectiveFactory;
    }
}
