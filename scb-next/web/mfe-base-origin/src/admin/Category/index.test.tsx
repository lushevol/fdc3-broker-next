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

vi.mock("@mui/x-data-grid/components/cell/GridActionsCellItem", () => {
  return {
    __esModule: true,
    default: () => {
      return {
        GridActionsCellItem: (props) => { return (<div>{props.children}</div>) },
      };
    },
    GridActionsCellItem: (props) => { return (<div>{props.children}</div>) },
  };
});

const CategoryData = [
  {
    "applicationCategoryId": 1,
    "orderNo": 1,
    "label": "Admin Module",
    "ems2Role": "SUPER_USER",
    "createdAt": "2024-10-21T07:16:21.022+00:00",
    "updatedAt": "2024-10-21T07:16:21.022+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "applicationCategoryId": 2,
    "orderNo": 2,
    "label": "Template",
    "ems2Role": "SUPER_USER",
    "createdAt": "2024-10-21T07:16:21.022+00:00",
    "updatedAt": "2024-10-21T07:16:21.022+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": false
  },
  {
    "applicationCategoryId": 3,
    "orderNo": 3,
    "label": "Confirmations",
    "ems2Role": "CDUPS_ADMIN",
    "createdAt": "2024-10-21T07:16:27.809+00:00",
    "updatedAt": "2024-10-21T07:16:27.809+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "applicationCategoryId": 4,
    "orderNo": 4,
    "label": "Exception Management",
    "ems2Role": "RATAN_ADMIN",
    "createdAt": "2024-10-21T07:16:32.317+00:00",
    "updatedAt": "2024-10-21T07:16:32.317+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "applicationCategoryId": 5,
    "orderNo": 5,
    "label": "M7 Platform",
    "ems2Role": "RATAN_ADMIN",
    "createdAt": "2024-10-21T07:16:32.317+00:00",
    "updatedAt": "2024-10-21T07:16:32.317+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "applicationCategoryId": 6,
    "orderNo": 6,
    "label": "Business Rule",
    "ems2Role": "RATAN_ADMIN",
    "createdAt": "2024-10-21T07:16:32.317+00:00",
    "updatedAt": "2024-10-21T07:16:32.317+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "applicationCategoryId": 7,
    "orderNo": 7,
    "label": "Settlement",
    "ems2Role": "RATAN_ADMIN",
    "createdAt": "2024-10-21T07:16:32.317+00:00",
    "updatedAt": "2024-10-21T07:16:32.317+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "applicationCategoryId": 8,
    "orderNo": 8,
    "label": "Static",
    "ems2Role": "RATAN_ADMIN",
    "createdAt": "2024-10-21T07:16:32.317+00:00",
    "updatedAt": "2024-10-21T07:16:32.317+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "applicationCategoryId": 9,
    "orderNo": 9,
    "label": "Trade Processing",
    "ems2Role": "RATAN_ADMIN",
    "createdAt": "2024-10-21T07:16:32.317+00:00",
    "updatedAt": "2024-10-21T07:16:32.317+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "applicationCategoryId": 10,
    "orderNo": 10,
    "label": "FSS SERVICES",
    "ems2Role": "FSS_ADMIN",
    "createdAt": "2024-10-21T07:16:39.395+00:00",
    "updatedAt": "2024-10-21T07:16:39.395+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "applicationCategoryId": 11,
    "orderNo": 11,
    "label": "SSDR",
    "ems2Role": "SUPER_USER",
    "createdAt": "2024-10-21T07:16:43.363+00:00",
    "updatedAt": "2024-10-21T07:16:43.363+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "applicationCategoryId": 12,
    "orderNo": 12,
    "label": "SSI plus",
    "ems2Role": "SUPER_USER",
    "createdAt": "2024-10-21T07:16:43.363+00:00",
    "updatedAt": "2024-10-21T07:16:43.363+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "applicationCategoryId": 13,
    "orderNo": 13,
    "label": "SSTM",
    "ems2Role": "SUPER_USER",
    "createdAt": "2024-10-21T07:16:43.363+00:00",
    "updatedAt": "2024-10-21T07:16:43.363+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  {
    "applicationCategoryId": 14,
    "orderNo": 14,
    "label": "Static Data Mapping",
    "ems2Role": "SUPER_USER",
    "createdAt": "2024-10-21T07:16:43.363+00:00",
    "updatedAt": "2024-10-21T07:16:43.363+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  }
]

const CategoryAuditData = [
  {
    "applicationCategoryAuditId": 2,
    "transactionMode": "maker",
    "applicationCategoryId": 4,
    "label": "Exception Management",
    "ems2Role": "RATAN_ADMIN",
    "createdAt": "2024-10-21T07:16:32.317+00:00",
    "updatedAt": "2024-10-21T08:37:23.376+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": false
  },
  {
    "applicationCategoryAuditId": 1,
    "transactionMode": "maker",
    "applicationCategoryId": 4,
    "label": "Exception Management test",
    "ems2Role": "RATAN_ADMIN",
    "createdAt": "2024-10-21T07:16:32.317+00:00",
    "updatedAt": "2024-10-21T08:37:14.616+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": false
  }
]

const CategoryRecord = {
  "applicationCategoryId": 4,
  "label": "Exception Management Test",
  "ems2Role": "RATAN_ADMIN",
  "createdAt": "2024-10-21T08:43:50.054+00:00",
  "updatedAt": "2024-10-21T08:44:32.317+00:00",
  "createdBy": "2001208",
  "updatedBy": "2001208",
  "active": false
}

const NewRecord = {
  "applicationCategoryId": 99999,
  "label": "New Label",
  "ems2Role": "RATAN_ADMIN",
  "createdAt": "2024-10-21T08:43:50.054+00:00",
  "updatedAt": "2024-10-21T08:44:32.317+00:00",
  "createdBy": "2001208",
  "updatedBy": "2001208",
  "active": false
}

vi.mock('./services/useServices', () => {
  return {
    __esModule: true,
    default: () => ({
      getCategory: async () => { return Promise.resolve([...CategoryData]) },
      getCategoryAudit: async () => { return Promise.resolve([...CategoryAuditData]) },
      updateCategory: async () => { return Promise.resolve({ ...CategoryRecord }) },
      verifyCategory: async () => { return Promise.resolve({ ...CategoryRecord }) },
      deactivateCategory: async () => { return Promise.resolve({ ...CategoryRecord }) },
      createCategory: async () => { return Promise.resolve({ ...NewRecord }) },
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
    label: "Category",
    isLoaded: true,
    isActive: true,
    containers: []
  },
}

const rowsData = CategoryData.map((item: any) => {
  item.id = item.applicationCategoryId;
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
    onVerify,
    onUpdate,
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
    onOpen(rowsData[0], "edit")();
    onChange("abc", "label");
    onUpdate();
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
    columns[3].renderCell(false)
    //@ts-ignore
    columns[3].renderCell(true)
    //@ts-ignore
    columns[4].renderCell({ value: "" })
    //@ts-ignore
    columns[6].renderCell({ value: "" })
    //@ts-ignore
    columns[4].renderCell({ value: rowsData[0].createdBy })
    //@ts-ignore
    columns[6].renderCell({ value: rowsData[0].updatedBy })
    //@ts-ignore
    auditColumns[4].renderCell(true)
    //@ts-ignore
    auditColumns[5].valueGetter({ row: {} })
    //@ts-ignore
    auditColumns[7].valueGetter({ row: {} })
    //@ts-ignore
    auditColumns[5].valueGetter({ row: rowsData[3] })
    //@ts-ignore
    auditColumns[7].valueGetter({ row: rowsData[3] })
    dispacthEntitlementsToken("");
  }, [])

  return (
    <Index  {...props} />
  )
};

describe("Admin Module category component", () => {
  it("should be in the document", async () => {
    await render(
      <Provider data={{ ...providerData }}>
        <ThemeProvider>
          <Comp module="/category" tile="/category" panelId="1" tabId="1" />
        </ThemeProvider>
      </Provider>
    );
    expect(screen).toBeDefined();
    await waitFor(3000);
  });

});
