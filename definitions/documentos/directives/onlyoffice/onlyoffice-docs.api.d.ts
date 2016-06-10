declare namespace DocsAPI {
    interface OnlyofficeDocEditor {
        denyEditingRights(string: any): void;
        downloadAs(): void;
        showMessage(title: string, message: string, type: string): void;
    }
    interface OnlyofficeConfig {
        documentType: string;
        height: string;
        type: string;
        width: "100%";
        document: OnlyofficeDocument;
        editorConfig: OnlyofficeEditorConfig;
        events?: OnlyofficeEventConfig;
    }
    interface OnlyofficeDocument {
        fileType: string;
        key: string;
        title: string;
        url: string;
        info?: OnlyofficeDocumentInfo;
        permissions: OnlyofficeDocumentPermission;
    }
    interface OnlyofficeDocumentInfo {
        author: string;
        created: string;
        folder: string;
        sharingSettings: OnlyofficeSharingSetting[];
    }
    interface OnlyofficeSharingSetting {
        permissions: string;
        user: string;
    }
    interface OnlyofficeDocumentPermission {
        download: boolean;
        edit: boolean;
        print: boolean;
    }
    interface OnlyofficeEditorConfig {
        callbackUrl: string;
        createUrl?: string;
        lang: string;
        mode: string;
        customization?: OnlyofficeEditorCustomization;
        embedded?: OnlyofficeEmbeddedConfig;
        recent?: OnlyofficeRecentDocument[];
        user?: OnlyofficeUser;
    }
    interface OnlyofficeEditorCustomization {
        about?: boolean;
        chat?: boolean;
        comments?: boolean;
        customer?: OnlyofficeCustomerConfig;
        feedback?: OnlyofficeFeedbackConfig;
        goback?: OnlyofficeGobackConfig;
        logo?: OnlyofficeLogoConfig;
    }
    interface OnlyofficeCustomerConfig {
        address: string;
        info: string;
        logo: string;
        mail: string;
        name: string;
        www: string;
    }
    interface OnlyofficeFeedbackConfig {
        url: string;
        visible: boolean;
    }
    interface OnlyofficeGobackConfig {
        text: string;
        url: string;
    }
    interface OnlyofficeLogoConfig {
        image: string;
        imageEmbeddded: string;
        url: string;
    }
    interface OnlyofficeEmbeddedConfig {
        embedUrl: string;
        fullscreenUrl: string;
        saveUrl: string;
        shareUrl: string;
        toolbarDocked: string;
    }
    interface OnlyofficeRecentDocument {
        folder: string;
        title: string;
        url: string;
    }
    interface OnlyofficeUser {
        firstname: string;
        id: string;
        lastname: string;
    }
    interface OnlyofficeEventConfig {
        onCollaborativeChanges?: Function;
        onDocumentStateChange?: Function;
        onDownloadAs?: Function;
        onError?: Function;
        onReady?: Function;
        onRequestEditRights?: Function;
        onRequestHistory?: Function;
        onRequestHistoryData?: Function;
        onRequestHistoryClose?: Function;
    }
    interface DocEditorFactory {
        new (id: string, config: OnlyofficeConfig): OnlyofficeDocEditor;
    }
    var DocEditor: DocEditorFactory;
}
