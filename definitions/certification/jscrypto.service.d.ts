declare namespace app.certification {
    class Signature {
        private converterService;
        private signatureContent;
        constructor(converterService: ConverterService, signatureContent: any);
        asHex(): string;
        asUint8Array(): Uint8Array;
    }
    class JsCrypto {
        private $q;
        private converterService;
        private privateKey;
        private certificate;
        constructor($q: ng.IQService, converterService: ConverterService, privateKey: any, certificate: any);
        certificateAsUint8Array(): Uint8Array;
        certificateAsHex(): any;
        sign(data: any): ng.IPromise<{}>;
    }
    class JsCryptoFactory {
        private $q;
        private converterService;
        static $inject: string[];
        constructor($q: ng.IQService, converterService: ConverterService);
        create(privateKey: any, certificate: any): ng.IPromise<{}>;
    }
}
