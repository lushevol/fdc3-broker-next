import React from "react";
import { render, screen } from "@testing-library/react";
import Index from "./";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import useController from "./common/useController";
import useDispatcher from "../../hooks/dispathcer";

const waitFor = (time = 2000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time)
});

vi.mock("@mui/x-data-grid", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@mui/x-data-grid")>();
  return {
    ...actual,
    __esModule: true,
    default: () => {
      return {
        GridActionsCellItem: (props) => { return (<div>{props.children}</div>) },
      };
    },
    GridActionsCellItem: (props) => { return (<div>{props.children}</div>) },
  };
});

const ImportMapData = [
  {
    "importMapId": 1,
    "ems2Role": "SUPER_USER",
    "keyName": "single-spa",
    "path": "/js/external/single-spa.dev.js",
    "createdAt": "2024-10-21T08:43:35.696+00:00",
    "updatedAt": "2024-10-21T08:43:35.696+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 2,
    "ems2Role": "SUPER_USER",
    "keyName": "react",
    "path": "/js/external/react.development.js",
    "createdAt": "2024-10-21T08:43:35.696+00:00",
    "updatedAt": "2024-10-21T08:43:35.696+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 3,
    "ems2Role": "SUPER_USER",
    "keyName": "react-dom",
    "path": "/js/external/react-dom.development.js",
    "createdAt": "2024-10-21T08:43:35.696+00:00",
    "updatedAt": "2024-10-21T08:43:35.696+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 4,
    "ems2Role": "SUPER_USER",
    "keyName": "root-config",
    "path": "/config.js",
    "createdAt": "2024-10-21T08:43:35.696+00:00",
    "updatedAt": "2024-10-21T08:43:35.696+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 5,
    "ems2Role": "SUPER_USER",
    "keyName": "base",
    "path": "//localhost:8002/base.js",
    "createdAt": "2024-10-21T08:43:35.696+00:00",
    "updatedAt": "2024-10-21T08:43:35.696+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 6,
    "ems2Role": "SUPER_USER",
    "keyName": "template_container",
    "path": "/template_container/template_container.js",
    "createdAt": "2024-10-21T08:43:35.696+00:00",
    "updatedAt": "2024-10-21T08:43:35.696+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 7,
    "ems2Role": "SUPER_USER",
    "keyName": "template",
    "path": "/template/template.js",
    "createdAt": "2024-10-21T08:43:35.696+00:00",
    "updatedAt": "2024-10-21T08:43:35.696+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 8,
    "ems2Role": "CDUPS_ADMIN",
    "keyName": "cdups_container",
    "path": "/cdups_container/cdups_container.js",
    "createdAt": "2024-10-21T08:43:44.633+00:00",
    "updatedAt": "2024-10-21T08:43:44.633+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 9,
    "ems2Role": "CDUPS_ADMIN",
    "keyName": "cdups_tiles",
    "path": "/cdups_tiles/cdups_tiles.js",
    "createdAt": "2024-10-21T08:43:44.633+00:00",
    "updatedAt": "2024-10-21T08:43:44.633+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 10,
    "ems2Role": "RATAN_ADMIN",
    "keyName": "ratan_container",
    "path": "/ratan_container/ratan_container.js",
    "createdAt": "2024-10-21T08:43:47.185+00:00",
    "updatedAt": "2024-10-21T08:43:47.185+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 11,
    "ems2Role": "RATAN_ADMIN",
    "keyName": "ratan_cashflow",
    "path": "/ratan_cashflow/ratan_cashflow.js",
    "createdAt": "2024-10-21T08:43:47.185+00:00",
    "updatedAt": "2024-10-21T08:43:47.185+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 12,
    "ems2Role": "RATAN_ADMIN",
    "keyName": "ratan_trades",
    "path": "/ratan_trade/ratan_trades.js",
    "createdAt": "2024-10-21T08:43:47.185+00:00",
    "updatedAt": "2024-10-21T08:43:47.185+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 13,
    "ems2Role": "RATAN_ADMIN",
    "keyName": "ratan_exception",
    "path": "/ratan_exception/ratan_exception.js",
    "createdAt": "2024-10-21T08:43:47.185+00:00",
    "updatedAt": "2024-10-21T08:43:47.185+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 14,
    "ems2Role": "RATAN_ADMIN",
    "keyName": "ratan_rules",
    "path": "/ratan_rules/ratan_rules.js",
    "createdAt": "2024-10-21T08:43:47.185+00:00",
    "updatedAt": "2024-10-21T08:43:47.185+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 15,
    "ems2Role": "RATAN_ADMIN",
    "keyName": "ratan_authorization_limits",
    "path": "/ratan_authorization_limits/ratan_authorization_limits.js",
    "createdAt": "2024-10-21T08:43:47.185+00:00",
    "updatedAt": "2024-10-21T08:43:47.185+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 16,
    "ems2Role": "RATAN_ADMIN",
    "keyName": "ratan_cashflow_blotter",
    "path": "/ratan_cashflow_blotter/ratan_cashflow_blotter.js",
    "createdAt": "2024-10-21T08:43:47.185+00:00",
    "updatedAt": "2024-10-21T08:43:47.185+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 17,
    "ems2Role": "RATAN_ADMIN",
    "keyName": "ratan_nostro_static",
    "path": "/ratan_nostro_static/ratan_nostro_static.js",
    "createdAt": "2024-10-21T08:43:47.185+00:00",
    "updatedAt": "2024-10-21T08:43:47.185+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 18,
    "ems2Role": "FSS_ADMIN",
    "keyName": "mfe_fssservices_container",
    "path": "/mfe_fssservices_container/mfe_fssservices_container.js",
    "createdAt": "2024-10-21T08:43:54.073+00:00",
    "updatedAt": "2024-10-21T08:43:54.073+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 19,
    "ems2Role": "FSS_ADMIN",
    "keyName": "mfe_fssservices_tiles",
    "path": "/mfe_fssservices_tiles/mfe_fssservices_tiles.js",
    "createdAt": "2024-10-21T08:43:54.073+00:00",
    "updatedAt": "2024-10-21T08:43:54.073+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 20,
    "ems2Role": "FSS_ADMIN",
    "keyName": "mfe_fssservices_peregrine_container",
    "path": "/mfe_fssservices_peregrine_container/mfe_fssservices_container.js",
    "createdAt": "2024-10-21T08:43:54.073+00:00",
    "updatedAt": "2024-10-21T08:43:54.073+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 21,
    "ems2Role": "FSS_ADMIN",
    "keyName": "mfe_fssservices_peregrine_tiles",
    "path": "/mfe_fssservices_peregrine_tiles/mfe_fssservices_tiles.js",
    "createdAt": "2024-10-21T08:43:54.073+00:00",
    "updatedAt": "2024-10-21T08:43:54.073+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 22,
    "ems2Role": "FSS_ADMIN",
    "keyName": "mfe_fssservices_bap_container",
    "path": "/mfe_fssservices_bap_container/mfe_fssservices_container.js",
    "createdAt": "2024-10-21T08:43:54.073+00:00",
    "updatedAt": "2024-10-21T08:43:54.073+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 23,
    "ems2Role": "FSS_ADMIN",
    "keyName": "mfe_fssservices_bap_tiles",
    "path": "/mfe_fssservices_bap_tiles/mfe_fssservices_tiles.js",
    "createdAt": "2024-10-21T08:43:54.073+00:00",
    "updatedAt": "2024-10-21T08:43:54.073+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 24,
    "ems2Role": "FSS_ADMIN",
    "keyName": "fssservices_container",
    "path": "/fssservices_container/fssservices_container.js",
    "createdAt": "2024-10-21T08:43:54.073+00:00",
    "updatedAt": "2024-10-21T08:43:54.073+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 25,
    "ems2Role": "FSS_ADMIN",
    "keyName": "fss_feeaccrual_reference",
    "path": "/fss_feeaccrual_reference/fssservices_tiles.js",
    "createdAt": "2024-10-21T08:43:54.073+00:00",
    "updatedAt": "2024-10-21T08:43:54.073+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 26,
    "ems2Role": "FSS_ADMIN",
    "keyName": "fss_feeaccrual_transaction",
    "path": "/fss_feeaccrual_transaction/fssservices_tiles.js",
    "createdAt": "2024-10-21T08:43:54.073+00:00",
    "updatedAt": "2024-10-21T08:43:54.073+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 27,
    "ems2Role": "SUPER_USER",
    "keyName": "ssi_container",
    "path": "/ssi_container/ssi_container.js",
    "createdAt": "2024-10-21T08:43:59.100+00:00",
    "updatedAt": "2024-10-21T08:43:59.100+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 28,
    "ems2Role": "SUPER_USER",
    "keyName": "ssi_tiles",
    "path": "/ssi_tiles/ssi_tiles.js",
    "createdAt": "2024-10-21T08:43:59.100+00:00",
    "updatedAt": "2024-10-21T08:43:59.100+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 29,
    "ems2Role": "SUPER_USER",
    "keyName": "ssdr_container",
    "path": "/ssdr_container/ssdr_container.js",
    "createdAt": "2024-10-21T08:43:59.100+00:00",
    "updatedAt": "2024-10-21T08:43:59.100+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 30,
    "ems2Role": "SUPER_USER",
    "keyName": "ssdr_tiles",
    "path": "/ssdr_tiles/ssdr_tiles.js",
    "createdAt": "2024-10-21T08:43:59.100+00:00",
    "updatedAt": "2024-10-21T08:43:59.100+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 31,
    "ems2Role": "SUPER_USER",
    "keyName": "stamp_container",
    "path": "/stamp_container/stamp_container.js",
    "createdAt": "2024-10-21T08:43:59.100+00:00",
    "updatedAt": "2024-10-21T08:43:59.100+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "importMapId": 32,
    "ems2Role": "SUPER_USER",
    "keyName": "stamp_tiles",
    "path": "/stamp_tiles/stamp_tiles.js",
    "createdAt": "2024-10-21T08:43:59.100+00:00",
    "updatedAt": "2024-10-21T08:43:59.100+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  }
]

const ImportMapAuditData = [
  {
    "importMapAuditId": 1,
    "transactionMode": "maker",
    "importMapId": 17,
    "ems2Role": "RATAN_ADMIN",
    "keyName": "ratan_nostro_static test",
    "path": "/ratan_nostro_static/ratan_nostro_static.js",
    "createdAt": "2024-10-21T08:43:47.185+00:00",
    "updatedAt": "2024-10-21T10:22:39.388+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": false
  }
]

const ImportMapRecord = {
  "importMapId": 1,
  "ems2Role": "SUPER_USER",
  "keyName": "single-spa",
  "path": "/js/external/single-spa.dev.js",
  "createdAt": "2024-10-21T08:43:35.696+00:00",
  "updatedAt": "2024-10-21T08:43:35.696+00:00",
  "createdBy": "2001208",
  "updatedBy": "2001208",
  "active": true
}

const NewRecord = {
  "importMapId": 9999999,
  "ems2Role": "SUPER_USER",
  "keyName": "single-spa",
  "path": "/js/external/single-spa.dev.js",
  "createdAt": "2024-10-21T08:43:35.696+00:00",
  "updatedAt": "2024-10-21T08:43:35.696+00:00",
  "createdBy": "2001208",
  "updatedBy": "2001208",
  "active": true
}

vi.mock('./services/useServices', () => {
  return {
    __esModule: true,
    default: () => ({
      getImportMap: async () => { return Promise.resolve([...ImportMapData]) },
      getImportMapAudit: async () => { return Promise.resolve([...ImportMapAuditData]) },
      updateImportMap: async () => { return Promise.resolve({ ...ImportMapRecord }) },
      verifyImportMap: async () => { return Promise.resolve({ ...ImportMapRecord }) },
      deactivateImportMap: async () => { return Promise.resolve({ ...ImportMapRecord }) },
      createImportMap: async () => { return Promise.resolve({ ...NewRecord }) },
    })
  }
});

const providerData = {
  user: { id: "123" }, token: "123", theme: "light", timeType: "UTC", entitlementsToken: "123",
  entities: [{
    "id": 276822,
    "name": "FMO PORTAL ADMIN",
    "applicationName": "RATAN",
    "roleId": 276825,
    "roleName": "SUPER_USER",
    "subjects": [
      {
        "longName": "/category",
        "name": "category",
        "id": 276832,
        "actions": [
          {
            "name": "READ-WRITE",
            "id": 276824,
            "entitlementId": 276871
          }
        ]
      },
      {
        "longName": "/importmap",
        "name": "importmap",
        "id": 276831,
        "actions": [
          {
            "name": "READ-WRITE",
            "id": 276824,
            "entitlementId": 276872
          }
        ]
      },
      {
        "longName": "/tile",
        "name": "tile",
        "id": 276833,
        "actions": [
          {
            "name": "READ-WRITE",
            "id": 276824,
            "entitlementId": 276873
          }
        ]
      }
    ]
  }],
  currentWorkspace: {
    id: "1",
    label: "ImportMap",
    isLoaded: true,
    isActive: true,
    containers: []
  },
}

const rowsData = ImportMapData.map((item: any) => {
  item.id = item.importMapId;
  return item;
});

const Comp = (props) => {
  const { dispacthEntitlementsToken } = useDispatcher();
  const {
    onCreateNew,
    onOpen,
    columns,
    onClose,
    onChange,
    onReset,
    onSave,
    onSaveData,
    onVerify,
    onUpdate,
    onUpdateData,
    onDeactivate,
    refreshTab,
    auditColumns,
    getAuditData,
    onOpenAudit,
    onCloseAudit,
  } = useController(props);

  React.useEffect(() => {
    refreshTab();
    onCreateNew();
    onChange("abc", "label");
    onSave();
    onSaveData(undefined);
    onSaveData({ length: 1 });
    onSaveData({ updatedBy: "updatedBy" });
    onOpen(rowsData[0], "edit")();
    onChange("abc", "label");
    onUpdate();
    onUpdateData(undefined);
    onUpdateData({ length: 1 });
    onUpdateData({ updatedBy: "updatedBy" });
    onOpen(rowsData[0], "edit")();
    onReset();
    onClose();
    onOpen(rowsData[1], "verify")();
    onVerify();
    onOpen(rowsData[2], "deactivate")();
    onDeactivate();
    onOpenAudit(rowsData[5])();
    getAuditData(rowsData[5]);
    onCloseAudit();
    //@ts-ignore
    columns[0].getActions({ row: rowsData[3] })
    //@ts-ignore
    columns[4].renderCell(false)
    //@ts-ignore
    columns[4].renderCell(true)
    //@ts-ignore
    columns[5].renderCell({ value: "" })
    //@ts-ignore
    columns[7].renderCell({ value: "" })
    //@ts-ignore
    columns[5].renderCell({ value: rowsData[0].createdBy })
    //@ts-ignore
    columns[7].renderCell({ value: rowsData[0].updatedBy })
    //@ts-ignore
    auditColumns[5].renderCell(true)
    //@ts-ignore
    auditColumns[6].valueGetter({ row: {} })
    //@ts-ignore
    auditColumns[8].valueGetter({ row: {} })
    //@ts-ignore
    auditColumns[6].valueGetter({ row: rowsData[3] })
    //@ts-ignore
    auditColumns[8].valueGetter({ row: rowsData[3] })
    dispacthEntitlementsToken("");
  }, [])

  return (
    <Index  {...props} />
  )
};

describe("Admin Module import map component", () => {
  it("should be in the document", async () => {
    await render(
      <Provider data={{ ...providerData }}>
        <ThemeProvider>
          <Comp module="/importmap" tile="/importmap" panelId="2" tabId="2" />
        </ThemeProvider>
      </Provider>
    );
    expect(screen).toBeDefined();
    await waitFor(3000);
  });

});
