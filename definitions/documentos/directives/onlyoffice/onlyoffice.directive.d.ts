declare namespace app.documentos {
    interface DocumentConfig {
        document: Document;
        user: User;
    }
    interface Document {
        src: string;
        key: string;
        name: string;
        callbackUrl: string;
    }
    interface User {
        id: string;
        name: string;
    }
}
