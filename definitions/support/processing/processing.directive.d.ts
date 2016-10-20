declare namespace app.support {
    interface StfProcessingScope extends ng.IScope {
        stfProcessing: any;
        $stfDecorateNgClickHandler: (promise: ng.IPromise<any>, event) => ng.IPromise<any>;
        $stfDecorateNgSubmitHandler: (promise: ng.IPromise<any>) => ng.IPromise<any>;
    }
}
