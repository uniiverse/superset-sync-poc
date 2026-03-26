# reports

Serving the reports domain since 2023.

| Staging | Production |
| ------- | ---------- |
| - | ![App Status](https://argocd.universe.engineer/api/badge?name=production-reports&revision=true) |
| - | [ArgoCD Dashboard](https://argocd.universe.engineer/applications/production-reports) |

## Guides
- [Export / Render / Release Guide](export-render-release-guide.md)

## Setup
1. Install Docker: https://docs.docker.com/get-docker/
1. Install Kind: `brew install kind`
1. Install Skaffold: `brew install skaffold`.
1. Install Task: https://taskfile.dev/installation/
1. Create Kind cluster: `kind create cluster`. This will show up as a container in Docker - `kind-kind`.
1. Switch to the necessary context: `kubectx kind-kind`
1. Ensure you have the correct gcloud permissions. Create a PR and add your info to https://github.com/uniiverse/org/blob/main/members.jsonnet.

## Starting Reports + Clickhouse + Superset + gRPC Gateway in Docker
1. Start the container:

```
task dev
```

1. If you receive an API permissions error, run `task sync-credentials`.

1. Visit superset: http://localhost:8088
1. Install postman: `brew install --cask postman`
1. Call service in Postman: New -> gRPC Request -> Enter URL `grpc://localhost:9001` -> Select a Method Dropdown -> Use Server Reflection (if there's no service definition) -> Choose a call -> Use Example Message (optional) -> Invoke.

There's also an HTTP gateway that proxies the gRPC service as an OpenAPI/swagger REST service. This would make a POST request against the gateway (the grpc-gateway service in Docker):

```
curl --location 'localhost:8082/reports.v1.ReportsService/CreateGuestToken' \
--header 'Content-Type: text/plain' \
--data '{
    "dashboardId": "10",
    "locale": "en",
    "filter": {
        "userId": "us_0"
    }
}'
```

## View SuperSet Dashboards in Local Development
To work with the SuperSet dashboard locally in Host, you'll need to render and release the dashboards. You'll need to ensure that the Reports service is running with `task dev` and then run the following locally in the Reports project:

1. `npm run render-dashboards-dev`
1. `npm run release-dashboards-dev`

Additional information is included in the [Export / Render / Release Guide](export-render-release-guide.md), please follow the `### NOTE: Development` section of this guide to then enable embedding of those dashboards. 

## Building Release Artifacts
NOTE: These are steps to release the redemptions service, not the Superset dashboards. To release dashboards, see [Export / Render / Release Guide](export-render-release-guide.md)
1. `task build render`
1. Commit the generated artifacts under the dist/ folder.

## FAQ / Troubleshooting

### HTTP Swagger Docs

This project is publicly exposed through an HTTP gateway. It is documented with swagger, [here](https://www.universe.com/reports-service/reports/v1/swagger.json).

### Updating Superset library
1. `brew install swagger-codegen`
1. Log into Superset (https://superset.data-us-east4.clusters.production.universe.engineer, or http://localhost:8088 in docker using username/password `admin/admin`)
1. Copy your whole Cookie header from an authenticated request (using Chrome dev tools or similar)
1. `swagger-codegen generate -i https://superset.data-us-east4.clusters.production.universe.engineer/api/v1/_openapi -l typescript-fetch -o lib/superset-api -a "Cookie:PASTE_YOUR_COOKIE_VALUE"`

Some important notes made during development:

- Whether exporting charts, dashboards or other assets from Superset for backup purposes, the export always delivers a .zip file with the same directory structure inside: one folder each for charts, dashboards, datasets and databases, along with a singular ```metadata.yaml``` file. This is the same structure that the import API expects in order to properly update and overwrite all of the assets in production.
- The import API endpoint is ```/api/v1/assets/import``` and it accepts a .zip file of the aforementioned directories.
- All assets are represented as .yaml files, which requires the `VERSIONED_EXPORT` feature flag enabled in Superset. Without that flag, assets are returned as a single .json file.
- If the import script is giving a ```422 UNPROCESSABLE ENTITY``` error, check that the ```metadata.yaml``` file contains ```type: assets``` and not some other type such as charts or dashboards. The ```api/v1/assets/import``` endpoint requires this.
- With this reports container running in docker on port 8088, the following curl request can be used to export all assets from the local Superset instance:

```
  curl -X 'GET' \
  'http://localhost:8088/api/v1/assets/export/' \
  -H 'accept: application/zip' \
  -H 'authorization: Bearer [access_token]' \
  --output asset_export.zip
```

## Roadmap / Known Issues
- [ ] In dev, clickhouse database (lib/clickhouse) is a copy of https://github.com/uniiverse/highlander/tree/main/images/clickhouse. Find a better schema sharing approach.
- [ ] In dev, gRPC gateway (lib/grpc-gateway) is a copy of https://github.com/uniiverse/api/tree/main/gateway. Find a better sharing approach.
