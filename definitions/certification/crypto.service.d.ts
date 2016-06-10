declare namespace app.certification {
    interface CertificateOptions {
        lang?: string;
        filter?: {};
    }
    interface SigningOptions {
        lang?: string;
        info?: string;
    }
    interface Certificate {
        encoded: Uint8Array;
        hex?: string;
    }
    interface Hash {
        type: string;
        value?: Uint8Array;
        hex: string;
    }
    interface Signature {
        value: Uint8Array;
        hex?: string;
    }
    interface SigningData {
        data: string;
        type: string;
        hex: string;
    }
}
declare namespace hwcrypto {
    function use(backend: string): Promise<boolean>;
    function getCertificate(options: app.certification.CertificateOptions): Promise<app.certification.Certificate>;
    function sign(certificate: app.certification.Certificate, hash: app.certification.Hash, options: app.certification.SigningOptions): Promise<app.certification.Signature>;
}
declare namespace app.certification {
    class CryptoService {
        use(backend: string): Promise<boolean>;
        getCertificate(options: CertificateOptions): Promise<Certificate>;
        sign(certificate: Certificate, data: SigningData, options: SigningOptions): Promise<Signature>;
    }
}
