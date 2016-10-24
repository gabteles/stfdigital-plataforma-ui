declare namespace app.support {
    class ReadableFilesize {
        constructor();
        filter(bytes: any, precision: any): string;
        static factory(): () => (bytes: any, precision: any) => string;
    }
}
