import { render, screen } from "@testing-library/react";
import React from "react";
import useDispatcher from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { ActionType } from "../reducer/util/ActionType";

afterAll(() => {
  vi.clearAllMocks();
});
vi.mock('../service', () => {
  return {
    putService: async () => { return Promise.resolve({}) },
    postService: async () => { return Promise.resolve({}) },
    getService: async () => { return Promise.resolve({}) }
  }
});
vi.mock("../../utils/common", () => {
  return {
    getJWTPayload: () => "JWT",
    storeData: vi.fn(),
    clearLocalStorage: vi.fn(),
    clearStorageWhenLogout: vi.fn(),
    uuidv4: () => "id",
    showErrorMsg: vi.fn(),
    show_error_msg: vi.fn(),
    getEnv: () => "UAT",
    getHostName: () => "UAT",
    getLocalStorage: () => ({
      setItem: (v) => { },
      getItem: () => undefined,
      clear: () => { }
    }),
    getSessionStorage: () => ({
      setItem: (v) => { },
      getItem: () => undefined,
      clear: () => { }
    }),
  }
});
const loginResponse = { "result": "success", "entities": [{ "id": 65, "name": "EMS2", "applicationName": "", "roleId": 66, "roleName": "EMS2_ADMIN", "actions": [], "subjects": [] }, { "id": 11279700, "name": "SSIPLUS", "applicationName": "SSIPLUS", "roleId": 11279756, "roleName": "SSI_SUPER_USER", "actions": [{ "name": "WRITE", "id": 11279851, "entitlementId": 11280762 }, { "name": "WRITE", "id": 11279851, "entitlementId": 11280763 }, { "name": "WRITE", "id": 11279851, "entitlementId": 11280764 }], "subjects": [{ "longName": "/SEARCH", "name": "SEARCH", "id": 11279801, "actions": [{ "name": "WRITE", "id": 11279851, "entitlementId": 11280762 }] }, { "longName": "/STATIC", "name": "STATIC", "id": 11279800, "actions": [{ "name": "WRITE", "id": 11279851, "entitlementId": 11280763 }] }, { "longName": "/VALIDATIONRULES", "name": "VALIDATIONRULES", "id": 11279802, "actions": [{ "name": "WRITE", "id": 11279851, "entitlementId": 11280764 }] }] }] }
const Comp = () => {
  const {
    dispacthLoading,
    dispacthTheme,
    dispacthToken,
    dispacthUser,
    dispacthClientBus,
    dispacthErrorMessage,
    dispacthWorkspaces,
    dispacthCurrentWorkspace,
    dispacthError,
    dispacthDrawer,
    addWorkspace,
    dispacthUserLoginTime,
    dispacthOpenCashflow,
    OpenCashflow,
    dispacthIsOpenFin,
    dispacthTimeType,
    dispacthEntities,
    dispacth,
    registerRefreshTab,
    dispacthEntitlementsToken,
    dispacthIsOnLogout,
    dispacthDrawers,
    subscribe,
    dispacthSsePayload,
  } = useDispatcher();
  React.useEffect(() => {
    subscribe("123", ()=>{});
    dispacthSsePayload({});
    dispacthIsOnLogout(true);
    dispacthIsOnLogout(false);
    dispacthLoading(true);
    dispacthLoading(false);
    dispacthTheme("dark");
    dispacthTheme("light");
    dispacthToken("abc");
    dispacthToken(undefined);
    dispacthUser({ id: "123" });
    dispacthUser(undefined);
    dispacthClientBus(undefined);
    dispacthErrorMessage("error");
    dispacthErrorMessage(undefined);
    dispacthWorkspaces(undefined);
    dispacthCurrentWorkspace(undefined);
    dispacthError("error");
    dispacthDrawer(true);
    dispacthDrawer(false);
    addWorkspace({ "panelId": "123", "tabId": "123", "id": "d6bcbcb4-4260-410b-a362-1580c82ee609", "container": "TemplateContainer", "module": "/template", "tile": "/tile1", "title": "Tile 1 ", "emailSupport": "" });
    addWorkspace();
    dispacthUserLoginTime({ exp: 80, iat: "123", userLoginTime: "2023-03-16T14:05:20.000+00:00[GMT]" });
    dispacthOpenCashflow("123", "/cashflow_bau");
    //@ts-ignore
    dispacthOpenCashflow(123, "/cashflow_bau");
    dispacthOpenCashflow([{ "field": "Cashflow.Cashflow_State", "operator": "IN", "values": ["ERROR"] }], "/cashflow_bau");
    //@ts-ignore
    dispacthOpenCashflow({ "field": "Cashflow.Cashflow_State", "operator": "IN", "values": ["ERROR"] }, "/cashflow_bau");
    //@ts-ignore
    OpenCashflow([], "123", "/cashflow_bau");
    //@ts-ignore
    OpenCashflow([], 123, "/cashflow_bau");
    //@ts-ignore
    OpenCashflow([], { "field": "Cashflow.Cashflow_State", "operator": "IN", "values": ["ERROR"] }, "/cashflow_bau");
    const drawers = [
      {
        "tiles": [
          {
            "container": "@fm/ratan_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "cashflow",
            "isTemplate": false,
            "emailSupport": "MLS_BAU@sc.com",
            "module": "/ratan",
            "subtitle": "cashflow",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/cashflow_bau",
            "id": 48,
            "title": "Cashflow",
            "entity": [
              "STAMP_STATIC"
            ]
          },
        ],
        "id": 12,
        "label": "Settlement"
      }
    ]
    //@ts-ignore
    OpenCashflow(drawers, "123", "/cashflow_bau");
    //@ts-ignore
    OpenCashflow(drawers, 123, "/cashflow_bau");
    //@ts-ignore
    OpenCashflow(drawers, { "field": "Cashflow.Cashflow_State", "operator": "IN", "values": ["ERROR"] }, "/cashflow_bau");
    OpenCashflow(drawers, [{ "field": "Cashflow.Cashflow_State", "operator": "IN", "values": ["ERROR"] }], "/cashflow_bau");
    dispacthIsOpenFin(false);
    dispacthIsOpenFin(true);
    dispacthTimeType("utc");
    dispacthTimeType("local");
    dispacthEntities(loginResponse.entities);
    registerRefreshTab("123", () => { });
    dispacthEntitlementsToken("token");
    dispacth({
      type: ActionType.SET_REFRESH_TOKEN,
      data: { refreshToken: "a" },
    });
    dispacth({
      type: ActionType.SET_REFRESH_TOKEN,
      data: { refreshToken: undefined },
    });
    dispacth({
      type: ActionType.CLEAR,
      data: {},
    });
    dispacthDrawers([
      {
        "createdAt": "2024-10-18T02:00:38.118+00:00",
        "tiles": [
          {
            "template": false,
            "container": "@fm/base",
            "imageDarkTheme": "darkIcons/icon12.svg",
            "updatedBy": "2001208",
            "subject": "/importmap",
            "imageLightTheme": "lightIcons/icon12.svg",
            "module": "/importmap",
            "ems2Entities": "FMO PORTAL ADMIN",
            "applicationTileId": 1,
            "active": true,
            "title": "Import Map",
            "createdAt": "2024-10-18T02:00:40.172+00:00",
            "createdBy": "2001208",
            "emailSupport": "",
            "isTemplate": false,
            "subtitle": null,
            "tile": "/importmap",
            "id": 1,
            "ems2Subject": "/importmap",
            "entity": [
              "FMO PORTAL ADMIN"
            ],
            "ems2Role": "SUPER_USER",
            "updatedAt": "2024-10-18T02:00:40.172+00:00"
          },
          {
            "template": false,
            "container": "@fm/base",
            "imageDarkTheme": "darkIcons/icon13.svg",
            "updatedBy": "2001208",
            "subject": "/category",
            "imageLightTheme": "lightIcons/icon13.svg",
            "module": "/category",
            "ems2Entities": "FMO PORTAL ADMIN",
            "applicationTileId": 2,
            "active": true,
            "title": "Drawer Category",
            "createdAt": "2024-10-18T02:00:40.172+00:00",
            "createdBy": "2001208",
            "emailSupport": "",
            "isTemplate": false,
            "subtitle": null,
            "tile": "/category",
            "id": 2,
            "ems2Subject": "/category",
            "entity": [
              "FMO PORTAL ADMIN"
            ],
            "ems2Role": "SUPER_USER",
            "updatedAt": "2024-10-18T02:00:40.172+00:00"
          },
          {
            "template": false,
            "container": "@fm/base",
            "imageDarkTheme": "darkIcons/icon14.svg",
            "updatedBy": "2001208",
            "subject": "/tile",
            "imageLightTheme": "lightIcons/icon14.svg",
            "module": "/tile",
            "ems2Entities": "FMO PORTAL ADMIN",
            "applicationTileId": 3,
            "active": true,
            "title": "Tile Configuration",
            "createdAt": "2024-10-18T02:00:40.172+00:00",
            "createdBy": "2001208",
            "emailSupport": "",
            "isTemplate": false,
            "subtitle": null,
            "tile": "/tile",
            "id": 3,
            "ems2Subject": "/tile",
            "entity": [
              "FMO PORTAL ADMIN"
            ],
            "ems2Role": "SUPER_USER",
            "updatedAt": "2024-10-18T02:00:40.172+00:00"
          }
        ],
        "updatedBy": "2001208",
        "createdBy": "2001208",
        "active": true,
        "applicationCategoryId": 1,
        "label": "Admin Module",
        "id": 1,
        "ems2Role": "SUPER_USER",
        "updatedAt": "2024-10-18T02:00:38.118+00:00"
      }
    ])
  }, []);
  return (<div />);
};
const workspacesDefault = JSON.parse(`[{"id":"4cf8ffb7-1bcd-4718-95a3-ea1c13e873ed","label":"Tile 1 ","isLoaded":false,"isActive":false,"containers":[{"id":"d6bcbcb4-4260-410b-a362-1580c82ee609","container":"TemplateContainer","module":"/template","tile":"/tile1","title":"Tile 1 "}]},{"id":"d83bfcbd-c3da-46f2-b1ba-b607a18bd7ad","label":"Tile 2 ","isLoaded":true,"isActive":false,"containers":[{"id":"fe14fc89-12e5-40d2-8cef-52227d900895","container":"TemplateContainer","module":"/template","tile":"/tile2","title":"Tile 2 ","parameters":{"testId":"123"}}]},{"id":"9f701ba7-2020-4c57-a6d2-4ef1727ac1c0","label":"Trade Blotter ","isLoaded":true,"isActive":false,"containers":[{"id":"6e1e9524-2e19-4443-8143-aae86af206e3","container":"RatanContainer","module":"/trade_blotter","tile":"/trade","title":"Trade Blotter "}]},{"id":"d588c755-1949-465c-82eb-32f698bac642","label":"Cashflow Blotter ","isLoaded":true,"isActive":false,"containers":[{"id":"59830ac0-8323-498c-82e2-af97ac4334ed","container":"RatanContainer","module":"/cashflow_blotter","tile":"/cashflow_cn","title":"Cashflow Blotter "}]},{"id":"dd215265-08f7-43a8-9191-26f0e41d24b6","label":"Netting Eligibility Rules ","isLoaded":true,"isActive":false,"containers":[{"id":"6922ca51-6e01-486d-8c5f-c73acecc51ae","container":"RatanContainer","module":"/rules_blotter","tile":"/new_netting_rules","title":"Netting Eligibility Rules "}]},{"id":"c42f785d-3f09-4197-838d-a4a4d0ac0950","label":"Authorization Limits ","isLoaded":true,"isActive":false,"containers":[{"id":"c860bc4e-c9af-4b1e-97a1-7805a8480b35","container":"RatanContainer","module":"/authorization_limits_container","tile":"/authorization_limits","title":"Authorization Limits "}]},{"id":"4b90dc6f-d901-40ab-a9fc-90bd3e512281","label":"Tile 1 ","isLoaded":true,"isActive":false,"containers":[{"id":"fab8b25f-f008-4d4f-b00d-4084ad41995c","container":"abc","module":"/template","tile":"/tile1","title":"Tile 1 "}]},{"id":"681b6db5-f0ea-4a6d-a799-2b4ae2897d44","label":"Tile 2 ","isLoaded":true,"isActive":false,"containers":[{"id":"8d0425c3-3fac-460a-844a-4af20f1f839e","container":"CdupsContainer","module":"/template","tile":"/tile2","title":"Tile 2 "}]}]`)
const workspacesDefault2 = JSON.parse(`[{"id":"4cf8ffb7-1bcd-4718-95a3-ea1c13e873ed","label":"Tile 1 ","isLoaded":false,"isActive":false,"containers":[{"id":"d6bcbcb4-4260-410b-a362-1580c82ee609","container":"TemplateContainer","module":"/template","tile":"/tile1","title":"Tile 1 "}]},{"id":"d83bfcbd-c3da-46f2-b1ba-b607a18bd7ad","label":"Tile 2 ","isLoaded":true,"isActive":false,"containers":[{"id":"fe14fc89-12e5-40d2-8cef-52227d900895","container":"TemplateContainer","module":"/template","tile":"/tile2","title":"Tile 2 ","parameters":{"testId":"123"}}]},{"id":"9f701ba7-2020-4c57-a6d2-4ef1727ac1c0","label":"Trade Blotter ","isLoaded":true,"isActive":false,"containers":[{"id":"6e1e9524-2e19-4443-8143-aae86af206e3","container":"RatanContainer","module":"/trade_blotter","tile":"/trade","title":"Trade Blotter "}]},{"id":"d588c755-1949-465c-82eb-32f698bac642","label":"Cashflow Blotter ","isLoaded":true,"isActive":false,"containers":[{"id":"59830ac0-8323-498c-82e2-af97ac4334ed","container":"RatanContainer","module":"/cashflow_blotter","tile":"/cashflow_cn","title":"Cashflow Blotter "}]},{"id":"dd215265-08f7-43a8-9191-26f0e41d24b6","label":"Netting Eligibility Rules ","isLoaded":true,"isActive":false,"containers":[{"id":"6922ca51-6e01-486d-8c5f-c73acecc51ae","container":"RatanContainer","module":"/rules_blotter","tile":"/new_netting_rules","title":"Netting Eligibility Rules "}]},{"id":"c42f785d-3f09-4197-838d-a4a4d0ac0950","label":"Authorization Limits ","isLoaded":true,"isActive":false,"containers":[{"id":"c860bc4e-c9af-4b1e-97a1-7805a8480b35","container":"RatanContainer","module":"/authorization_limits_container","tile":"/authorization_limits","title":"Authorization Limits "}]},{"id":"4b90dc6f-d901-40ab-a9fc-90bd3e512281","label":"Tile 1 ","isLoaded":true,"isActive":false,"containers":[{"id":"fab8b25f-f008-4d4f-b00d-4084ad41995c","container":"abc","module":"/template","tile":"/tile1","title":"Tile 1 "}]},{"id":"681b6db5-f0ea-4a6d-a799-2b4ae2897d44","label":"Workspace2 ","isLoaded":true,"isActive":false,"containers":[{"id":"8d0425c3-3fac-460a-844a-4af20f1f839e","container":"CdupsContainer","module":"/template","tile":"/tile2","title":"Tile 2 "}]}]`)

describe("useDispatcher component", () => {
  it("should be in the document", () => {
    render(<Provider data={{ user: { id: "123" }, token: "123", theme: "dark", workspaces: undefined, currentWorkspace: undefined }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(<Provider data={{
      user: { id: "123" }, token: "123", theme: "dark",
      workspaces: workspacesDefault,
      currentWorkspace: workspacesDefault[0]
    }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(<Provider data={{
      user: { id: "123" }, token: "123", theme: "dark",
      workspaces: workspacesDefault2,
      currentWorkspace: workspacesDefault2[0]
    }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});
