import {
  DashboardsConfig,
  DashboardConfig,
  DashboardLocaleConfig,
} from "../common/dashboards-config.js";

import Config from "./index.js";

// NOTE: Each of these maps contain the embeddable dashboard IDs from superset. This class resolves these dashboard IDs
// from constant keys, like "sales_dashboard" or the yaml filenames like "Account_Dashboard_template_14.yaml".
// To create an embeddable dashboard ID in superset, go to the dashboard, click "...", then click "Embed dashboard".

const PRODUCTION_DASHBOARDS_CONFIG = new DashboardsConfig([
  new DashboardConfig(
    "Account Dashboard",
    // TODO: Transition host app away from "sales_dashboard" to "account_dashboard", then remove "sales_dashboard".
    [
      "sales_dashboard",
      "account_dashboard",
      "Account_Dashboard_template_14.yaml",
    ],
    [
      new DashboardLocaleConfig({
        locales: ["da"],
        embeddableUUID: "06f30158-8c94-40da-a6a4-14e42924e42e",
        stableUUID: "89217172-833e-4a2a-b0c8-bec1638cfe61",
      }),
      new DashboardLocaleConfig({
        locales: ["de"],
        embeddableUUID: "91757c03-5ccb-4933-a079-6bcf820f7986",
        stableUUID: "f9b3f371-7932-4227-803b-f2f510ea2d6f",
      }),
      new DashboardLocaleConfig({
        locales: ["el"],
        embeddableUUID: "fbc92cc8-2852-492f-b471-55100e94acc6",
        stableUUID: "4f3b058d-c4ff-4067-8045-8dbeb45967f3",
      }),
      new DashboardLocaleConfig({
        locales: ["en"],
        embeddableUUID: "3ce5fd5e-a6ba-4d07-9e86-8d112abe884a",
        stableUUID: "c51eb182-132f-4804-905c-05f08d79fdfa",
      }),
      new DashboardLocaleConfig({
        locales: ["es"],
        embeddableUUID: "83eb946f-6eb7-4d08-a225-d0a7e6b52937",
        stableUUID: "7650b2f5-6213-46c9-9f9a-a94f9e0a3841",
      }),
      new DashboardLocaleConfig({
        locales: ["fi"],
        embeddableUUID: "385af906-1436-4f36-a99a-f541ebd2bac9",
        stableUUID: "63903e65-13c4-4b00-a2d8-b6bf1d5c7cf6",
      }),
      new DashboardLocaleConfig({
        locales: ["fr"],
        embeddableUUID: "9d092179-3300-4737-841f-48171d296951",
        stableUUID: "b0672e05-84b6-45b5-9705-ecc6fe6473be",
      }),
      new DashboardLocaleConfig({
        locales: ["nb"],
        embeddableUUID: "59ba43e8-1ca8-4180-acc6-c5971cfcc559",
        stableUUID: "309dbd10-cdff-4651-8999-194ebd5c596d",
      }),
      new DashboardLocaleConfig({
        /* "nl_BE" in src/translations/locales */
        locales: ["nl-be", "nl_be"],
        embeddableUUID: "f3488093-1f79-46e5-bdea-a62649010bf7",
        stableUUID: "2781e2c7-6d39-4101-a77e-7f504c12392d",
      }),
      new DashboardLocaleConfig({
        /* "nl_NL" in src/translations/locales */
        locales: ["nl", "nl-nl", "nl_nl"],
        embeddableUUID: "4342abbe-27cf-489e-8be7-15bcd17536a1",
        stableUUID: "ed717373-55a7-4d51-b409-2816e6efeae0",
      }),
      new DashboardLocaleConfig({
        locales: ["sv"],
        embeddableUUID: "1cc84494-1ff8-4717-bc0f-6d7cf04fbf33",
        stableUUID: "6499b921-8eb6-47cc-91cf-08120170ca15",
      }),
    ],
  ),
  new DashboardConfig(
    "Mobile Dashboard",
    ["mobile_dashboard", "Mobile_Dashboard_template_27.yaml"],
    [
      new DashboardLocaleConfig({
        locales: ["da"],
        embeddableUUID: "cc8b93a6-24f7-4894-af43-60d1e5d5e5f9",
        stableUUID: "11d31975-8d1e-4958-b099-2a0cf16d24d5",
      }),
      new DashboardLocaleConfig({
        locales: ["de"],
        embeddableUUID: "a1ba577b-acdd-4b3f-bc18-2a32484b9096",
        stableUUID: "087491b2-96c9-4c22-9954-0cabdd2b4d68",
      }),
      new DashboardLocaleConfig({
        locales: ["el"],
        embeddableUUID: "1de50a31-3197-4533-9438-630a4183a2ec",
        stableUUID: "085d8325-d3a2-4785-87ee-358aa6540166",
      }),
      new DashboardLocaleConfig({
        locales: ["en"],
        embeddableUUID: "eae20e92-f980-4ffd-8e5f-b6b47c44f380",
        stableUUID: "0837326f-d98c-457d-98df-166d0c909068",
      }),
      new DashboardLocaleConfig({
        locales: ["es"],
        embeddableUUID: "1c681467-b781-4803-ac4f-80b31a11d261",
        stableUUID: "8807e701-c562-43a3-96cb-336f95645500",
      }),
      new DashboardLocaleConfig({
        locales: ["fi"],
        embeddableUUID: "147338d3-3e44-4ffc-8d7a-87394d4103e5",
        stableUUID: "9fbf02fb-f9d3-4612-bf8e-6ebfc43dfee4",
      }),
      new DashboardLocaleConfig({
        locales: ["fr"],
        embeddableUUID: "47a15442-7eda-40fe-87b7-116f4b8a105d",
        stableUUID: "d2fedfcc-a861-4933-a105-1f558de8f134",
      }),
      new DashboardLocaleConfig({
        locales: ["nb"],
        embeddableUUID: "80ceba24-2b9e-4595-be12-53832460ae6c",
        stableUUID: "021a3862-115b-4282-8887-66ca4afff181",
      }),
      new DashboardLocaleConfig({
        /* "nl_BE" in src/translations/locales */
        locales: ["nl-be", "nl_be"],
        embeddableUUID: "6c575bd5-09c4-426d-81c4-2bbeee567a8d",
        stableUUID: "16e8ec2c-7549-4678-8195-fcd0fbd02f39",
      }),
      new DashboardLocaleConfig({
        /* "nl_NL" in src/translations/locales */
        locales: ["nl", "nl-nl", "nl_nl"],
        embeddableUUID: "176597a0-231d-47f7-90d9-91e3db98459c",
        stableUUID: "cd034698-cb9e-4601-a6d2-c322efbfda74",
      }),
      new DashboardLocaleConfig({
        locales: ["sv"],
        embeddableUUID: "8b6e4b9a-8539-4ef2-8d3a-834f8cb8e76d",
        stableUUID: "010f056e-9de2-487a-8162-d9ea3db4df96",
      }),
    ],
  ),
  new DashboardConfig(
    "Onsite Dashboard",
    ["onsite_dashboard", "Onsite_Dashboard_template_44.yaml"],
    [
      new DashboardLocaleConfig({
        locales: ["da"],
        embeddableUUID: "TODO",
        stableUUID: "7dc375a0-1bea-40e6-83f0-6d2253d8c402",
      }),
      new DashboardLocaleConfig({
        locales: ["de"],
        embeddableUUID: "TODO",
        stableUUID: "e53f0274-bccf-4624-8e0b-1496636c17ae",
      }),
      new DashboardLocaleConfig({
        locales: ["el"],
        embeddableUUID: "TODO",
        stableUUID: "085d8325-d3a2-4785-87ee-358aa6540166",
      }),
      new DashboardLocaleConfig({
        locales: ["en"],
        embeddableUUID: "TODO",
        stableUUID: "6c40f6fc-87ea-4ec4-a834-f416aa042350",
      }),
      new DashboardLocaleConfig({
        locales: ["es"],
        embeddableUUID: "TODO",
        stableUUID: "9b7c961f-2ef8-4048-a6fa-4f2dff662714",
      }),
      new DashboardLocaleConfig({
        locales: ["fi"],
        embeddableUUID: "TODO",
        stableUUID: "5b6b393b-04ba-47b2-b1de-338ac91ee74b",
      }),
      new DashboardLocaleConfig({
        locales: ["fr"],
        embeddableUUID: "TODO",
        stableUUID: "3f6228a5-3564-4ff5-a348-103c323f74d4",
      }),
      new DashboardLocaleConfig({
        locales: ["nb"],
        embeddableUUID: "TODO",
        stableUUID: "23a721dc-0061-4cb3-bf9c-0c3e1fd205d1",
      }),
      new DashboardLocaleConfig({
        /* "nl_BE" in src/translations/locales */
        locales: ["nl-be", "nl_be"],
        embeddableUUID: "TODO",
        stableUUID: "2681e2b8-2df5-4993-b6cd-01b8b91ce3c4",
      }),
      new DashboardLocaleConfig({
        /* "nl_NL" in src/translations/locales */
        locales: ["nl", "nl-nl", "nl_nl"],
        embeddableUUID: "TODO",
        stableUUID: "c0b7b026-233e-43e2-b4ee-79d09fe63f69",
      }),
      new DashboardLocaleConfig({
        locales: ["sv"],
        embeddableUUID: "TODO",
        stableUUID: "127aa40a-f0ee-4db2-90e8-2fa641f15ad5",
      }),
    ],
  ),
]);

const STAGING_DASHBOARDS_CONFIG = new DashboardsConfig([
  new DashboardConfig(
    "Account Dashboard",
    // TODO: Transition host app away from "sales_dashboard" to "account_dashboard", then remove "sales_dashboard".
    [
      "sales_dashboard",
      "account_dashboard",
      "Account_Dashboard_template_14.yaml",
    ],
    [
      new DashboardLocaleConfig({
        locales: ["da"],
        embeddableUUID: "210bf1de-ed49-45e6-89fe-ce057b60954d",
        stableUUID: "89217172-833e-4a2a-b0c8-bec1638cfe61",
      }),
      new DashboardLocaleConfig({
        locales: ["de"],
        embeddableUUID: "6051052a-1ee1-470f-9ce8-c252f0b78157",
        stableUUID: "f9b3f371-7932-4227-803b-f2f510ea2d6f",
      }),
      new DashboardLocaleConfig({
        locales: ["el"],
        embeddableUUID: "ae2741ec-33ce-4e0a-88f9-47a2c3235954",
        stableUUID: "4f3b058d-c4ff-4067-8045-8dbeb45967f3",
      }),
      new DashboardLocaleConfig({
        locales: ["en"],
        embeddableUUID: "ffafa5b9-8ffb-450e-862b-1d5ce5565bf6",
        stableUUID: "c51eb182-132f-4804-905c-05f08d79fdfa",
      }),
      new DashboardLocaleConfig({
        locales: ["es"],
        embeddableUUID: "272965ec-5777-4fd2-a6fc-45513a719579",
        stableUUID: "7650b2f5-6213-46c9-9f9a-a94f9e0a3841",
      }),
      new DashboardLocaleConfig({
        locales: ["fi"],
        embeddableUUID: "0b92aeb6-50a8-4d9b-a589-cbf607811eae",
        stableUUID: "63903e65-13c4-4b00-a2d8-b6bf1d5c7cf6",
      }),
      new DashboardLocaleConfig({
        locales: ["fr"],
        embeddableUUID: "ad139634-f988-45a0-9b3a-1198196fa19e",
        stableUUID: "b0672e05-84b6-45b5-9705-ecc6fe6473be",
      }),
      new DashboardLocaleConfig({
        locales: ["nb"],
        embeddableUUID: "e2a1849d-2b86-43ef-8575-e13cf97d30e1",
        stableUUID: "309dbd10-cdff-4651-8999-194ebd5c596d",
      }),
      new DashboardLocaleConfig({
        /* "nl_BE" in src/translations/locales */
        locales: ["nl-be", "nl_be"],
        embeddableUUID: "5f96c4b4-c239-4110-8efc-4864fca71fda",
        stableUUID: "2781e2c7-6d39-4101-a77e-7f504c12392d",
      }),
      new DashboardLocaleConfig({
        /* "nl_NL" in src/translations/locales */
        locales: ["nl", "nl-nl", "nl_nl"],
        embeddableUUID: "4ba3255e-2328-4802-9b31-30eccf36df0a",
        stableUUID: "ed717373-55a7-4d51-b409-2816e6efeae0",
      }),
      new DashboardLocaleConfig({
        locales: ["sv"],
        embeddableUUID: "6b0486a6-cf80-4913-a57e-7f4e94abcdf4",
        stableUUID: "6499b921-8eb6-47cc-91cf-08120170ca15",
      }),
    ],
  ),
  new DashboardConfig(
    "Mobile Dashboard",
    ["mobile_dashboard", "Mobile_Dashboard_template_27.yaml"],
    [
      new DashboardLocaleConfig({
        locales: ["da"],
        embeddableUUID: "a291c0d3-0f69-4bc6-b8fa-18e816d1fca4",
        stableUUID: "11d31975-8d1e-4958-b099-2a0cf16d24d5",
      }),
      new DashboardLocaleConfig({
        locales: ["de"],
        embeddableUUID: "249b5667-24c8-4095-b9f5-c78e273348e6",
        stableUUID: "087491b2-96c9-4c22-9954-0cabdd2b4d68",
      }),
      new DashboardLocaleConfig({
        locales: ["el"],
        embeddableUUID: "80f9ae80-fe14-47da-9986-964bd78c365a",
        stableUUID: "085d8325-d3a2-4785-87ee-358aa6540166",
      }),
      new DashboardLocaleConfig({
        locales: ["en"],
        embeddableUUID: "fb9351e6-0d37-4ddf-9d5e-baa46be28218",
        stableUUID: "0837326f-d98c-457d-98df-166d0c909068",
      }),
      new DashboardLocaleConfig({
        locales: ["es"],
        embeddableUUID: "b58400be-0401-4521-9db2-73b3ba67890f",
        stableUUID: "8807e701-c562-43a3-96cb-336f95645500",
      }),
      new DashboardLocaleConfig({
        locales: ["fi"],
        embeddableUUID: "834f0a57-249b-4cdb-b487-fb0a1f3831a8",
        stableUUID: "9fbf02fb-f9d3-4612-bf8e-6ebfc43dfee4",
      }),
      new DashboardLocaleConfig({
        locales: ["fr"],
        embeddableUUID: "c2902dc8-b647-4241-b406-b1933d8c2235",
        stableUUID: "d2fedfcc-a861-4933-a105-1f558de8f134",
      }),
      new DashboardLocaleConfig({
        locales: ["nb"],
        embeddableUUID: "b9f6483c-217f-4eec-ad90-73d6516f9a26",
        stableUUID: "021a3862-115b-4282-8887-66ca4afff181",
      }),
      new DashboardLocaleConfig({
        /* "nl_BE" in src/translations/locales */
        locales: ["nl-be", "nl_be"],
        embeddableUUID: "40aec9c5-61aa-4f50-a914-205cb10026c8",
        stableUUID: "16e8ec2c-7549-4678-8195-fcd0fbd02f39",
      }),
      new DashboardLocaleConfig({
        /* "nl_NL" in src/translations/locales */
        locales: ["nl", "nl-nl", "nl_nl"],
        embeddableUUID: "e776b2ac-fe97-48ef-a656-acdb788975a9",
        stableUUID: "cd034698-cb9e-4601-a6d2-c322efbfda74",
      }),
      new DashboardLocaleConfig({
        locales: ["sv"],
        embeddableUUID: "5c83e78d-250e-4bf4-bfcc-c5f29fe52067",
        stableUUID: "010f056e-9de2-487a-8162-d9ea3db4df96",
      }),
    ],
  ),
  new DashboardConfig(
    "Onsite Dashboard",
    ["onsite_dashboard", "Onsite_Dashboard_template_44.yaml"],
    [
      new DashboardLocaleConfig({
        locales: ["da"],
        embeddableUUID: "e2c81505-8be5-43e2-baf3-1ea2f0d6292a",
        stableUUID: "9041d5e3-a086-449c-b5aa-d0c7b79d5884",
      }),
      new DashboardLocaleConfig({
        locales: ["de"],
        embeddableUUID: "a5bfc9e9-b9e9-4a8d-bb2b-28210d1a1f1a",
        stableUUID: "81b7305b-32a5-4d7a-b57c-70fcb782f3d5",
      }),
      new DashboardLocaleConfig({
        locales: ["el"],
        embeddableUUID: "f7adbb32-a50b-4bff-9c10-ea2732d9c6d5",
        stableUUID: "2505326d-3c79-4bbd-a197-3cebda38d48a",
      }),
      new DashboardLocaleConfig({
        locales: ["en"],
        embeddableUUID: "aef90e6b-6846-4066-808f-7e87e963100a",
        stableUUID: "6c40f6fc-87ea-4ec4-a834-f416aa042350",
      }),
      new DashboardLocaleConfig({
        locales: ["es"],
        embeddableUUID: "192502dc-19f2-4c10-861e-5ffff19aaba3",
        stableUUID: "e726a978-620c-450d-a9da-69bf3207d4bd",
      }),
      new DashboardLocaleConfig({
        locales: ["fi"],
        embeddableUUID: "46529975-9b34-46d7-96ff-e2e7b392b0f3",
        stableUUID: "11e1403a-bb5a-49c4-9bd6-78d0ca3d23e6",
      }),
      new DashboardLocaleConfig({
        locales: ["fr"],
        embeddableUUID: "a6d0c59e-69de-46b6-8d96-70bb6eb5e811",
        stableUUID: "f46d93d5-4049-4849-9057-d8e879150916",
      }),
      new DashboardLocaleConfig({
        locales: ["nb"],
        embeddableUUID: "8fcebdbd-1f88-4fea-a45f-d0ca3a53ac5a",
        stableUUID: "37c2d0d5-7898-4d43-8d42-c16f77d88b0c",
      }),
      new DashboardLocaleConfig({
        /* "nl_BE" in src/translations/locales */
        locales: ["nl-be", "nl_be"],
        embeddableUUID: "d6cefe54-da80-44f8-9e09-cc78a9f5a69b",
        stableUUID: "42cd5702-b4ef-4eb4-994d-429a06d84b99",
      }),
      new DashboardLocaleConfig({
        /* "nl_NL" in src/translations/locales */
        locales: ["nl", "nl-nl", "nl_nl"],
        embeddableUUID: "045b6c5c-2f81-4f54-b6cb-7b21075f09d5",
        stableUUID: "c46dff31-2e47-4235-89f6-37db224384c9",
      }),
      new DashboardLocaleConfig({
        locales: ["sv"],
        embeddableUUID: "115720df-2418-4958-afcd-dd2d155bbf79",
        stableUUID: "91199d4b-d59e-4f39-8958-32ecf55628f3",
      }),
    ],
  ),
]);

const DEVELOPMENT_DASHBOARDS_CONFIG = new DashboardsConfig([
  new DashboardConfig(
    "Account Dashboard",
    [
      "sales_dashboard",
      "account_dashboard",
      "Account_Dashboard_template_14.yaml",
    ],
    [
      // NOTE: To set up local chart embedding:
      // 1. Visit localhost:8088, log in and navigate to the dashboard you want to embed.
      // 2. Click "...", then "Embed dashboard", then "Enable Embedding".
      // 3. Copy the ID from the modal and replace the ID below.
      // 4. Reload the page where the dashboard is embedded.
      new DashboardLocaleConfig({
        locales: ["en"],
        embeddableUUID: "edef1409-54b4-430e-a26d-14a2e5882b57",
        stableUUID: "257bc637-71b9-474e-912b-79c39e7c5cd4",
      }),
      new DashboardLocaleConfig({
        locales: ["fr"],
        embeddableUUID: "edef1409-54b4-430e-a26d-14a2e5882b57",
        stableUUID: "b0672e05-84b6-45b5-9705-ecc6fe6473be",
      }),
    ],
  ),
  new DashboardConfig(
    "Mobile Dashboard",
    ["mobile_dashboard", "Mobile_Dashboard_template_27.yaml"],
    [
      new DashboardLocaleConfig({
        locales: ["en"],
        embeddableUUID: "REPLACE_ME_WITH_LOCAL_VALUE",
        stableUUID: "0837326f-d98c-457d-98df-166d0c909068",
      }),
      new DashboardLocaleConfig({
        locales: ["fr"],
        embeddableUUID: "REPLACE_ME_WITH_LOCAL_VALUE",
        stableUUID: "d2fedfcc-a861-4933-a105-1f558de8f134",
      }),
    ],
  ),
  new DashboardConfig(
    "Onsite Dashboard",
    ["onsite_dashboard", "Onsite_Dashboard_template_44.yaml"],
    [
      new DashboardLocaleConfig({
        locales: ["en"],
        embeddableUUID: "REPLACE_ME_WITH_LOCAL_VALUE",
        stableUUID: "6c40f6fc-87ea-4ec4-a834-f416aa042350",
      }),
    ],
  ),
]);

export class DashboardsConfigMap {
  public getDashboardLocaleConfig(
    dashboardId: string,
    locale: string,
    defaultToEn: boolean,
  ): DashboardLocaleConfig | null {
    // Use either the development or production config.
    let dashboardsConfig = PRODUCTION_DASHBOARDS_CONFIG;

    if (Config.BUILD_TYPE == "staging") {
      dashboardsConfig = STAGING_DASHBOARDS_CONFIG;
    } else if (Config.IS_DEV) {
      dashboardsConfig = DEVELOPMENT_DASHBOARDS_CONFIG;
    }

    return dashboardsConfig.get(dashboardId, locale.toLowerCase(), defaultToEn);
  }
}
