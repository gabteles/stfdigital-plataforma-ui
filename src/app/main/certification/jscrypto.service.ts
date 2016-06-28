namespace app.certification {
    'use strict';

	export class Signature {
		constructor(private converterService: ConverterService, private signatureContent) {

		}

		asHex() {
			return this.converterService.arrayBuffer2hex(this.signatureContent);
		}
		
		asUint8Array() {
			return new Uint8Array(10);
		}
	}

	export class JsCrypto {

		constructor(private $q: ng.IQService, private converterService: ConverterService, private privateKey, private certificate) {

		}

		certificateAsUint8Array() {
			return new Uint8Array(10);
		}
			
		certificateAsHex() {
			return this.certificate;
		}
		
		sign(data) {
			return this.$q(function(resolve, reject) {
				window.crypto.subtle.sign({
						name: 'RSASSA-PKCS1-v1_5'
					},
					this.privateKey,
					this.converterService.hex2ArrayBuffer(data.data)
				).then(function(sig) {
					resolve(new Signature(this.converterService, sig));
				}).catch(function(err) {
					reject(err);
				});
			});
		};

	}

    export class JsCryptoFactory {

		static $inject = ['$q', 'app.support.ConverterService'];

        constructor(private $q: ng.IQService, private converterService: ConverterService) {

		}

        create(privateKey, certificate) {
			return this.$q((resolve, reject) => {
				window.crypto.subtle.importKey('pkcs8', new DataView(this.converterService.base64ToArrayBuffer(privateKey)), <Algorithm>{
					name: 'RSASSA-PKCS1-v1_5',
					hash: {name: 'SHA-256'}
				}, true, ['sign']).then(function(pk) {
					resolve(new JsCrypto(this.$q, this.converterService, pk, certificate));
				}).catch(function(err) {
					reject(err);
				});
			});
		}
    }

    angular.module('app.certification').service('app.certification.JsCryptoFactory', JsCryptoFactory);
}
