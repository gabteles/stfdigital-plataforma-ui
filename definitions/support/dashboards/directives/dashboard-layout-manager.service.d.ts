declare namespace app.support.dashboards {
    interface DashboardLayout {
        rows: DashboardRow[];
    }
    interface DashboardRow {
        columns: DashboardColumn[];
    }
    interface DashboardColumn {
        dashlet: Dashlet;
    }
    class DashboardLayoutManager {
        constructor();
        defaultLayout(dashlets: Dashlet[]): DashboardLayout;
    }
}
