namespace app.certification {
    export interface CertificateOptions {
        lang?: string;
        filter?: {};
    }

    export interface SigningOptions {
        lang?: string;
        info?: string;
    }

    export interface Certificate {
        encoded: Uint8Array;
        hex?: string;
    }

    export interface Hash {
        type: string;
        value?: Uint8Array;
        hex: string;
    }

    export interface Signature {
        value: Uint8Array;
        hex?: string;
    }

    export interface SigningData {
        data: string;
        type: string;
        hex: string;
    }

}

namespace hwcrypto {
    export declare function use(backend: string): Promise<boolean>;
    export declare function getCertificate(options: app.certification.CertificateOptions): Promise<app.certification.Certificate>;
    export declare function sign(certificate: app.certification.Certificate, hash: app.certification.Hash, options: app.certification.SigningOptions): Promise<app.certification.Signature>;
}

namespace app.certification {
    'use strict';

    export class CryptoService {

        use(backend: string): Promise<boolean> {
            return hwcrypto.use(backend);
        }

        getCertificate(options: CertificateOptions) {
            return hwcrypto.getCertificate(options);
        }

        sign(certificate: Certificate, data: SigningData, options: SigningOptions) {
            return hwcrypto.sign(certificate, {type: data.type, hex: data.hex}, options);
        }
    }

    angular.module('app.certification').service('app.certification.CryptoService', CryptoService);
}
