declare namespace app.certification {
    import IHttpService = angular.IHttpService;
    import IPromise = angular.IPromise;
    import IQService = angular.IQService;
    class SigningError {
        error: string;
        constructor(error: string);
    }
    class PrepareCommand {
        certificateAsHex: string;
        constructor(certificateAsHex: string);
    }
    class PreSignCommand {
        signerId: string;
        constructor(signerId: string);
    }
    class ProvideToSignCommand {
        signerId: string;
        documentId: number;
        constructor(signerId: string, documentId: number);
    }
    class PostSignCommand {
        signerId: string;
        signatureAsHex: string;
        constructor(signerId: string, signatureAsHex: string);
    }
    interface SignerDto {
        signerId: string;
    }
    interface PreSignatureDto {
        data: string;
        hash: string;
        hashType: string;
    }
    interface SignedDocumentDto {
        documentId: string;
    }
    class SignatureService {
        private properties;
        private $http;
        private $q;
        private cryptoService;
        private static apiSignature;
        static $inject: string[];
        constructor(properties: any, $http: IHttpService, $q: IQService, cryptoService: CryptoService);
        prepare(command: PrepareCommand): IPromise<SignerDto>;
        provideToSign(command: ProvideToSignCommand): IPromise<any>;
        preSign(command: PreSignCommand): IPromise<PreSignatureDto>;
        postSign(command: PostSignCommand): IPromise<void>;
        save(signerId: string): IPromise<SignedDocumentDto>;
        signingManager(): SigningManager;
    }
}
