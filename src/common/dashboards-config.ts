export class DashboardsConfig {
  dashboards: Map<string, DashboardConfig>;

  constructor(dashboards: DashboardConfig[]) {
    this.dashboards = new Map<string, DashboardConfig>();
    dashboards.forEach((dashboard) => {
      dashboard.dashboardIds.forEach((id) => {
        this.dashboards.set(id, dashboard);
      });
    });
  }

  public get(
    dashboardId: string,
    locale: string,
    defaultToEn: boolean,
  ): DashboardLocaleConfig | null {
    const dashboardConfig = this.dashboards.get(dashboardId);
    if (!dashboardConfig) {
      return null;
    }

    // If no map exists for this locale, so default to "en".
    return dashboardConfig.get(locale, defaultToEn);
  }
}

export class DashboardConfig {
  title: string;
  dashboardIds: string[];
  dashboardLocales: Map<string, DashboardLocaleConfig>;

  constructor(
    title: string,
    dashboardIds: string[],
    locales: DashboardLocaleConfig[],
  ) {
    this.title = title;
    this.dashboardIds = dashboardIds;
    this.dashboardLocales = new Map<string, DashboardLocaleConfig>();
    locales.forEach((dashboardLocale) => {
      dashboardLocale.locales.forEach((locale) => {
        dashboardLocale.title = title;
        this.dashboardLocales.set(locale, dashboardLocale);
      });
    });
  }

  public get(
    locale: string,
    defaultToEn: boolean,
  ): DashboardLocaleConfig | null {
    return (
      this.dashboardLocales.get(locale) ||
      (defaultToEn && this.dashboardLocales.get("en")) ||
      null
    );
  }
}

export class DashboardLocaleConfig {
  title = ""; // Set by parent config.
  locales: string[];
  embeddableUUID: string;
  stableUUID: string;

  constructor({
    locales,
    embeddableUUID,
    stableUUID,
  }: {
    locales: string[];
    embeddableUUID: string;
    stableUUID: string;
  }) {
    this.locales = locales;
    this.embeddableUUID = embeddableUUID;
    this.stableUUID = stableUUID;
  }
}
