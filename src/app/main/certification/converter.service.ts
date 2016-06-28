namespace app.certification {
    'use strict';

    export class ConverterService {

		base64ToArrayBuffer(base64) {
		    var binaryString =  window.atob(base64);
		    var len = binaryString.length;
		    var bytes = new Uint8Array(len);
		    for (var i = 0; i < len; i++)        {
		        bytes[i] = binaryString.charCodeAt(i);
		    }
		    return bytes.buffer;
		}
		
		arrayBufferToBase64(buffer) {
		    var binary = '';
		    var bytes = new Uint8Array(buffer);
		    var len = bytes.byteLength;
		    for (var i = 0; i < len; i++) {
		        binary += String.fromCharCode(bytes[i]);
		    }
		    return window.btoa(binary);
		}
		
		hex2ArrayBuffer(str) {
            var len = Math.floor(str.length / 2);
            var ret = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                ret[i] = parseInt(str.substr(i * 2, 2), 16);
            }
            return ret.buffer;
	    }
	    
	    arrayBuffer2hex(args) {
	        var ret = "";
	        var arr = new Uint8Array(args);
	        for (var i = 0; i < arr.length; i++) {
	        	ret += (arr[i] < 16 ? "0" : "") + arr[i].toString(16);
	        }
	        return ret.toLowerCase();
	    }

    }

    angular.module('app.certification').service('app.certification.ConverterService', ConverterService);
}
