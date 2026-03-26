# Export / Render / Release Guide

## Step 1 - EXPORT (Superset -> Source)
This step downloads dashboard assets from superset into this project's `dashboards/template` directory. This is safe to run and only updates local files.
- From development superset:  `npm run export-dev`
- From production superset:   `npm run export`

## Step 2 - RENDER (Template Dashboard Source -> Localized Dashboard Sources)
Rendering the dashboards substitutes localized strings from locales in `src/translations` into each dashboard in `dashboards/template/dashboards`. The rendered dashboards are checked into source control. Dashboards should be re-rendered when either the dashboard template changes or the localized strings change.

This is safe to run and only updates local files.
- For development:  `npm run render-dashboards-dev`
- For production:   `npm run render-dashboards`

NOTE: Clickhouse has two backends for SQLAlchemy / Superset:
- (HTTP): clickhousedb+connect://clickhouse_operator:XXXXXXXXXX@clickhouse-data-platform.data-platform:8123/highlander
- (TCP): clickhouse+native://clickhouse_operator:XXXXXXXXXX@clickhouse-data-platform.data-platform:9000/highlander

The appropriate one should be represented in the dashboards/{locale}/databases/ClickHouse.yaml file.

## Step 3 - RELEASE (Source -> Superset)
This step uploads localized dashboard assets from the dashboard/* folders (except template), up to superset. This step modifies the assets of a target superset site - either in development, or production.
1. Set the CLICKHOUSE_PASSWORD env variable to the clickhouse database password for your target environment.
2. Set the SUPERSET_PASSWORD env variable to the superset user password for your target environment. (Can also specify SUPERSET_USERNAME)
3. Release

To release to [Local Superset](http://localhost:8088):
`task dev` (ensure local instance is running)
`npm run release-dashboards-dev`

To release to [Staging Superset](https://superset.data-us-east4.clusters.staging.universe.engineer):
`CLICKHOUSE_PASSWORD={PASSWORD_HERE} SUPERSET_PASSWORD={PASSWORD_HERE} npm run release-dashboards-staging`

To release to [Production Superset](https://superset.data-us-east4.clusters.production.universe.engineer):
`CLICKHOUSE_PASSWORD={PASSWORD_HERE} SUPERSET_PASSWORD={PASSWORD_HERE} npm run release-dashboards`

### NOTE: Development
Releasing for development releases dashboards to your locally running superset instance. After you do so, to work with
dashboards locally, you need to:
1. Enable embedding on a dashboard. Visit localhost:8088 after releasing dashboards.
1. Visit dashboards, select a dashboard (pick the Onsite (en) one if possible).
1. Click the three dots -> Embed Dashboard.
1. Copy the UUID, and replace the `embeddableUUID` for the dashboard you would like to work on, in the `DEVELOPMENT_DASHBOARDS_CONFIG` configuration here: https://github.com/uniiverse/reports/blob/main/src/config/dashboards-config-map.ts#L423. 

## Dashboards Setup
Dashboards are built by editing a template dashboard in the live superset environment. Then, the template dashboard 
assets are exported, which downloads them from superset into this repository's `dashboard/template` folder. The template
assets are checked into this repository, so it's possible to recreate the dashboards in any superset environment.

## Dashboard Localization Setup
To deploy the dashboards seen by users, the template dashboard is "rendered". This process takes the template assets 
and replaces all string instances within them, producing folders containing the rendered templates for each locale.

Rendering is a safe operation - it generates local assets from the template.

```
/dashboards
  /template
  /en (rendered from the template)
  /fr (rendered from the template)
  /...
```

## Dashboard Template Structure
There are four main components in superset:
```
/dashboards
  /template
    /charts
    /dashboards
    /databases
    /datasets
```

- `Databases` - this captures a database connection string.
- `Datasets` - these are a layer over each database table, which can introduce custom column definitions.
- `Charts` - these are individual charts, which may be reused across dashboards.
- `Dashboards` - these are the top-level dashboards, which group together charts.
