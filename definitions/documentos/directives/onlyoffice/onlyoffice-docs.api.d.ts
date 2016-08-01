declare namespace DocsAPI {
    interface OnlyofficeDocEditor {
        denyEditingRights(string: any): void;
        downloadAs(): void;
        showMessage(title: string, message: string, type: string): void;
    }
    interface OnlyofficeConfig {
        /**
         * 'desktop or mobile'
         */
        type: string;
        /**
         * '100% by default'
         */
        width: string;
        /**
         * '100% by default'
         */
        height: string;
        /**
         * 'text' | 'spreadsheet' | 'presentation'
         */
        documentType: string;
        document: OnlyofficeDocument;
        editorConfig: OnlyofficeEditorConfig;
        events?: OnlyofficeEventConfig;
    }
    interface OnlyofficeDocument {
        /**
         * 'document title'
         */
        title: string;
        /**
         * 'document url'
         */
        url: string;
        /**
         * 'document file type'
         */
        fileType: string;
        /**
         * <advanced options>
         */
        options?: {};
        /**
         * 'key'
         */
        key: string;
        /**
         * 'vkey'
         */
        vkey?: string;
        info?: OnlyofficeDocumentInfo;
        permissions: OnlyofficeDocumentPermission;
    }
    interface OnlyofficeDocumentInfo {
        /**
         * 'author name'
         */
        author: string;
        /**
         * 'path to document'
         */
        folder: string;
        /**
         * '<creation date>'
         */
        created: string;
        sharingSettings: OnlyofficeSharingSetting[];
    }
    interface OnlyofficeSharingSetting {
        /**
         * 'user name'
         */
        user: string;
        /**
         * '<permissions>'
         */
        permissions: string;
        /**
         * false
         */
        isLink: boolean;
    }
    interface OnlyofficeDocumentPermission {
        /**
         * <can edit>, // default = true
         */
        edit?: boolean;
        /**
         * <can download>
         */
        download: boolean;
        /**
         * <can view in readable mode>
         */
        reader: boolean;
        /**
         * <can review> // default = edit
         */
        review?: boolean;
        /**
         * <can print> // default = true
         */
        print?: boolean;
    }
    interface OnlyofficeEditorConfig {
        /**
         * 'view or edit'
         */
        mode: string;
        /**
         * <language code>
         */
        lang: string;
        /**
         * <location>
         */
        location?: string;
        /**
         * <can coauthoring documents>
         */
        canCoAuthoring?: boolean;
        /**
         * <can autosave documents>
         */
        canAutosave?: boolean;
        /**
         * <can return to folder> - deprecated. use "customization.goback" parameter
         */
        canBackToFolder?: boolean;
        /**
         * 'create document url'
         */
        createUrl?: string;
        /**
         * 'document sharing settings url'
         */
        sharingSettingsUrl?: string;
        /**
         * 'mail merge sources url'
         */
        fileChoiceUrl?: string;
        /**
         * <url for connection between sdk and portal>
         */
        callbackUrl: string;
        /**
         * 'folder for saving merged file'
         */
        mergeFolderUrl?: string;
        /**
         * <url for license>
         */
        licenseUrl?: string;
        /**
         * <customer id>
         */
        customerId?: string;
        user?: OnlyofficeUser;
        recent?: OnlyofficeRecentDocument[];
        templates?: OnlyofficeTemplate[];
        customization?: OnlyofficeEditorCustomization;
        plugins?: OnlyofficePluginsConfig;
        embedded?: OnlyofficeEmbeddedConfig;
    }
    interface OnlyofficeUser {
        /**
         * 'user id'
         */
        id: string;
        /**
         * 'user first name'
         */
        firstname: string;
        /**
         * 'user last name'
         */
        lastname: string;
    }
    interface OnlyofficeRecentDocument {
        /**
         * 'document title'
         */
        title: string;
        /**
         * 'document url'
         */
        url: string;
        /**
         * 'path to document'
         */
        folder: string;
    }
    interface OnlyofficeTemplate {
        /**
         * 'template name'
         */
        name: string;
        /**
         * 'template icon url'
         */
        icon: string;
        /**
         * 'http://...'
         */
        url: string;
    }
    interface OnlyofficeEditorCustomization {
        logo?: OnlyofficeLogoConfig;
        /**
         * 'header background color'
         */
        backgroundColor?: string;
        /**
         * 'header text color'
         */
        textColor?: string;
        customer?: OnlyofficeCustomerConfig;
        /**
         * false
         */
        about?: boolean;
        feedback?: OnlyofficeFeedbackConfig;
        goback?: OnlyofficeGobackConfig;
        /**
         * false
         */
        chat?: boolean;
        /**
         * false
         */
        comments?: boolean;
    }
    interface OnlyofficeLogoConfig {
        /**
         * url
         */
        image: string;
        /**
         * url
         */
        imageEmbeddded: string;
        /**
         * http://...
         */
        url: string;
    }
    interface OnlyofficeCustomerConfig {
        /**
         * 'SuperPuper'
         */
        name: string;
        /**
         * 'New-York, 125f-25'
         */
        address: string;
        /**
         * 'support@gmail.com'
         */
        mail: string;
        /**
         * 'www.superpuper.com'
         */
        www: string;
        /**
         * 'Some info'
         */
        info: string;
        /**
         * ''
         */
        logo: string;
    }
    interface OnlyofficeFeedbackConfig {
        /**
         * false
         */
        visible: boolean;
        /**
         * http://...
         */
        url: string;
    }
    interface OnlyofficeGobackConfig {
        /**
         * 'http://...'
         */
        url: string;
        /**
         * 'Go to London'
         */
        text: string;
    }
    interface OnlyofficePluginsConfig {
        /**
         * '../../../../sdkjs-plugins/'
         */
        url: string;
        pluginsData: OnlyofficePluginData[];
    }
    interface OnlyofficePluginData {
        /**
         * "chess (fen)"
         */
        name: string;
        /**
         * "asc.{FFE1F462-1EA2-4391-990D-4CC84940B754}"
         */
        guid: string;
        variations: OnlyofficePluginVariation[];
    }
    interface OnlyofficePluginVariation {
        /**
         * "chess"
         */
        description: string;
        /**
         * "chess/index.html"
         */
        url: string;
        /**
         * ["chess/icon.png", "chess/icon@2x.png"]
         */
        icons: string[];
        /**
         * true
         */
        isViewer: boolean;
        /**
         * ["word", "cell", "slide"]
         */
        EditorsSupport: string[];
        /**
         * true
         */
        isVisual: boolean;
        /**
         * true
         */
        isModal: boolean;
        /**
         * false
         */
        isInsideMode: boolean;
        /**
         * "ole"
         */
        initDataType: string;
        /**
         * ""
         */
        initData: string;
        /**
         * true
         */
        isUpdateOleOnResize: boolean;
        buttons: OnlyofficeButton[];
    }
    interface OnlyofficeButton {
        /**
         * "Ok"
         */
        text: string;
        /**
         * true
         */
        primary: boolean;
    }
    interface OnlyofficeEmbeddedConfig {
        /**
         * 'url'
         */
        embedUrl: string;
        /**
         * 'url'
         */
        fullscreenUrl: string;
        /**
         * 'url'
         */
        saveUrl: string;
        /**
         * 'url'
         */
        shareUrl: string;
        /**
         * 'top or bottom'
         */
        toolbarDocked: string;
    }
    interface OnlyofficeEventConfig {
        onCollaborativeChanges?: Function;
        /**
         * <document state changed callback>
         */
        onDocumentStateChange?: Function;
        onDownloadAs?: Function;
        onError?: Function;
        /**
         * <document ready callback>
         */
        onReady?: Function;
        onRequestEditRights?: Function;
        onRequestHistory?: Function;
        onRequestHistoryData?: Function;
        onRequestHistoryClose?: Function;
        /**
         * <back to folder callback>
         */
        onBack?: Function;
        /**
         * <save request callback>
         */
        onSave?: Function;
    }
    interface DocEditorFactory {
        new (id: string, config: OnlyofficeConfig): OnlyofficeDocEditor;
    }
    var DocEditor: DocEditorFactory;
}
