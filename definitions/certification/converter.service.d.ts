declare namespace app.certification {
    class ConverterService {
        base64ToArrayBuffer(base64: any): ArrayBuffer;
        arrayBufferToBase64(buffer: any): string;
        hex2ArrayBuffer(str: any): ArrayBuffer;
        arrayBuffer2hex(args: any): string;
    }
}
