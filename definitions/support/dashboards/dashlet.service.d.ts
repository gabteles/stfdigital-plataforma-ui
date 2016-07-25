declare namespace app.support.dashboards {
    interface DashletConfiguration {
        id: string;
        definition: DashletDefinition;
    }
    interface DashletDefinition {
        templateUrl?: string;
        template?: string;
        controller: string;
        controllerAs?: string;
    }
    class DashletRegistry {
        private registeredDashlets;
        registerDashlet(id: string, definition: DashletDefinition): DashletRegistry;
        recoverDashlet(id: string): DashletDefinition;
    }
}
