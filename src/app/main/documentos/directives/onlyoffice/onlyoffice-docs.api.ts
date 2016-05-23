namespace DocsAPI {
	
	export interface OnlyofficeDocEditor {
		denyEditingRights(string): void;
		downloadAs(): void;
		showMessage(title: string, message: string, type: string): void;
	}
	
	export interface OnlyofficeConfig {
		documentType: string;
		height: string;
		type: string;
		width: "100%";
		document: OnlyofficeDocument;
		editorConfig: OnlyofficeEditorConfig;
		events?: OnlyofficeEventConfig;
	}
	
	export interface OnlyofficeDocument {
		fileType: string;
		key: string;
		title: string;
		url: string;
		info?: OnlyofficeDocumentInfo;
		permissions: OnlyofficeDocumentPermission;
	}
	
	export interface OnlyofficeDocumentInfo {
		author: string;
		created: string;
		folder: string;
		sharingSettings: OnlyofficeSharingSetting[];
	}
	
	export interface OnlyofficeSharingSetting {
		permissions: string;
		user: string;
	}
	
	export interface OnlyofficeDocumentPermission {
		download: boolean;
		edit: boolean;
		print: boolean;
	}
	
	export interface OnlyofficeEditorConfig {
		callbackUrl: string;
		createUrl?: string;
		lang: string;
		mode: string;
		customization?: OnlyofficeEditorCustomization;
		embedded?: OnlyofficeEmbeddedConfig;
		recent?: OnlyofficeRecentDocument[];
		user?: OnlyofficeUser;
	}
	
	export interface OnlyofficeEditorCustomization {
		about?: boolean;
		chat?: boolean;
		comments?: boolean;
		customer?: OnlyofficeCustomerConfig;
		feedback?: OnlyofficeFeedbackConfig;
		goback?: OnlyofficeGobackConfig;
		logo?: OnlyofficeLogoConfig;
	}
	
	export interface OnlyofficeCustomerConfig {
		address: string;
		info: string;
		logo: string;
		mail: string;
		name: string;
		www: string;
	}
	
	export interface OnlyofficeFeedbackConfig {
		url: string;
		visible: boolean;
	}
	
	export interface OnlyofficeGobackConfig {
		text: string;
		url: string;
	}
	
	export interface OnlyofficeLogoConfig {
		image: string;
		imageEmbeddded: string;
		url: string;
	}
	
	export interface OnlyofficeEmbeddedConfig {
		embedUrl: string;
		fullscreenUrl: string;
		saveUrl: string;
		shareUrl: string;
		toolbarDocked: string;
	}
	
	export interface OnlyofficeRecentDocument {
		folder: string;
		title: string;
		url: string;
	}
	
	export interface OnlyofficeUser {
		firstname: string;
		id: string;
		lastname: string;
	}
	
	export interface OnlyofficeEventConfig {
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
	
	export interface DocEditorFactory {
		new(id: string, config: OnlyofficeConfig): OnlyofficeDocEditor;
	}
	
	export declare var DocEditor: DocEditorFactory;
}