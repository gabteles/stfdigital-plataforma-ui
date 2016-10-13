declare namespace app.support {
    interface StfHeaderScope extends ng.IScope {
        layoutOnly: boolean;
        fabAction: Function;
        fabActionId: string;
        fabAriaLabel: string;
        fabIcon: string;
        fabText: string;
        fabActive: boolean;
        path: string;
        hasFabAction: boolean;
    }
}
