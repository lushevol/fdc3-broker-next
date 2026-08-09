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

jest.mock("@mui/x-data-grid/components/cell/GridActionsCellItem", () => {
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
    "label": "Static Data Mapping",
    "ems2Role": "SUPER_USER",
    "createdAt": "2024-10-21T07:16:43.363+00:00",
    "updatedAt": "2024-10-21T07:16:43.363+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  }
]

const TileData = [
  {
    "applicationTileId": 1,
    "ems2Role": "SUPER_USER",
    "title": "Import Map",
    "subtitle": null,
    "imageDarkTheme": "darkIcons/icon12.svg",
    "imageLightTheme": "lightIcons/icon12.svg",
    "module": "importmap",
    "tile": "importmap",
    "ems2Subject": "/importmap",
    "ems2Entities": "FMO PORTAL ADMIN",
    "emailSupport": "",
    "createdAt": "2024-10-22T01:42:14.071+00:00",
    "updatedAt": "2024-10-22T01:42:14.071+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "applicationCategory": {
      "applicationCategoryId": 1,
      "label": "Admin Module",
      "ems2Role": "SUPER_USER",
      "createdAt": "2024-10-22T01:42:12.380+00:00",
      "updatedAt": "2024-10-22T01:42:12.380+00:00",
      "createdBy": "2001208",
      "updatedBy": "2001208",
      "active": true,
      "recordId": "1",
    },
    "importMap": {
      "importMapId": 5,
      "ems2Role": "SUPER_USER",
      "keyName": "base",
      "path": "//localhost:8002/base.js",
      "createdAt": "2024-10-22T01:42:09.325+00:00",
      "updatedAt": "2024-10-22T01:42:09.325+00:00",
      "createdBy": "2001208",
      "updatedBy": "2001208",
      "active": true,
      "recordId": "1",
    },
    "active": true,
    "template": false
  },
  {
    "applicationTileId": 2,
    "ems2Role": "SUPER_USER",
    "title": "Drawer Category",
    "subtitle": null,
    "imageDarkTheme": "darkIcons/icon13.svg",
    "imageLightTheme": "lightIcons/icon13.svg",
    "module": "category",
    "tile": "category",
    "ems2Subject": "/category",
    "ems2Entities": "FMO PORTAL ADMIN",
    "emailSupport": "",
    "createdAt": "2024-10-22T01:42:14.071+00:00",
    "updatedAt": "2024-10-22T01:42:14.071+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "applicationCategory": {
      "applicationCategoryId": 1,
      "label": "Admin Module",
      "ems2Role": "SUPER_USER",
      "createdAt": "2024-10-22T01:42:12.380+00:00",
      "updatedAt": "2024-10-22T01:42:12.380+00:00",
      "createdBy": "2001208",
      "updatedBy": "2001208",
      "active": true,
      "recordId": "2",
    },
    "importMap": {
      "importMapId": 5,
      "ems2Role": "SUPER_USER",
      "keyName": "base",
      "path": "//localhost:8002/base.js",
      "createdAt": "2024-10-22T01:42:09.325+00:00",
      "updatedAt": "2024-10-22T01:42:09.325+00:00",
      "createdBy": "2001208",
      "updatedBy": "2001208",
      "active": true,
      "recordId": "2",
    },
    "active": true,
    "template": false
  },
  {
    "applicationTileId": 3,
    "ems2Role": "SUPER_USER",
    "title": "Tile Configuration",
    "subtitle": null,
    "imageDarkTheme": "darkIcons/icon14.svg",
    "imageLightTheme": "lightIcons/icon14.svg",
    "module": "tile",
    "tile": "tile",
    "ems2Subject": "/tile",
    "ems2Entities": "FMO PORTAL ADMIN",
    "emailSupport": "",
    "createdAt": "2024-10-22T01:42:14.071+00:00",
    "updatedAt": "2024-10-22T01:42:14.071+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "applicationCategory": {
      "applicationCategoryId": 1,
      "label": "Admin Module",
      "ems2Role": "SUPER_USER",
      "createdAt": "2024-10-22T01:42:12.380+00:00",
      "updatedAt": "2024-10-22T01:42:12.380+00:00",
      "createdBy": "2001208",
      "updatedBy": "2001208",
      "active": true,
      "recordId": "3",
    },
    "importMap": {
      "importMapId": 5,
      "ems2Role": "SUPER_USER",
      "keyName": "base",
      "path": "//localhost:8002/base.js",
      "createdAt": "2024-10-22T01:42:09.325+00:00",
      "updatedAt": "2024-10-22T01:42:09.325+00:00",
      "createdBy": "2001208",
      "updatedBy": "2001208",
      "active": true,
      "recordId": "3",
    },
    "active": true,
    "template": false
  }
]

const TileAuditData = [
  {
    "applicationTileAuditId": 1,
    "transactionMode": "maker",
    "applicationTileId": 5,
    "ems2Role": "SUPER_USER",
    "title": "Modal Example test",
    "subtitle": "",
    "imageDarkTheme": "darkIcons/icon02.svg",
    "imageLightTheme": "lightIcons/icon02.svg",
    "module": "template",
    "tile": "modal",
    "ems2Subject": "",
    "ems2Entities": "",
    "emailSupport": "",
    "createdAt": "2024-10-22T01:42:15.721+00:00",
    "updatedAt": "2024-10-22T01:53:28.166+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "applicationCategory": {
      "applicationCategoryId": 2,
      "label": "Template",
      "ems2Role": "SUPER_USER",
      "createdAt": "2024-10-22T01:42:12.380+00:00",
      "updatedAt": "2024-10-22T01:42:12.380+00:00",
      "createdBy": "2001208",
      "updatedBy": "2001208",
      "active": true
    },
    "importMap": {
      "importMapId": 6,
      "ems2Role": "SUPER_USER",
      "keyName": "template_container",
      "path": "/template_container/template_container.js",
      "createdAt": "2024-10-22T01:42:09.325+00:00",
      "updatedAt": "2024-10-22T01:42:09.325+00:00",
      "createdBy": "2001208",
      "updatedBy": "2001208",
      "active": true
    },
    "active": false,
    "template": true
  }
]

const TileRecord = {
  "applicationTileId": 1,
  "ems2Role": "SUPER_USER",
  "title": "Import Map",
  "subtitle": null,
  "imageDarkTheme": "darkIcons/icon12.svg",
  "imageLightTheme": "lightIcons/icon12.svg",
  "module": "importmap",
  "tile": "importmap",
  "ems2Subject": "/importmap",
  "ems2Entities": "FMO PORTAL ADMIN",
  "emailSupport": "",
  "createdAt": "2024-10-22T01:42:14.071+00:00",
  "updatedAt": "2024-10-22T01:42:14.071+00:00",
  "createdBy": "2001208",
  "updatedBy": "2001208",
  "applicationCategory": {
    "applicationCategoryId": 1,
    "label": "Admin Module",
    "ems2Role": "SUPER_USER",
    "createdAt": "2024-10-22T01:42:12.380+00:00",
    "updatedAt": "2024-10-22T01:42:12.380+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  "importMap": {
    "importMapId": 5,
    "ems2Role": "SUPER_USER",
    "keyName": "base",
    "path": "//localhost:8002/base.js",
    "createdAt": "2024-10-22T01:42:09.325+00:00",
    "updatedAt": "2024-10-22T01:42:09.325+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  "active": true,
  "template": false
}

const NewRecord = {
  "applicationTileId": 99999,
  "ems2Role": "SUPER_USER",
  "title": "Import Map",
  "subtitle": null,
  "imageDarkTheme": "darkIcons/icon12.svg",
  "imageLightTheme": "lightIcons/icon12.svg",
  "module": "importmap",
  "tile": "importmap",
  "ems2Subject": "/importmap",
  "ems2Entities": "FMO PORTAL ADMIN",
  "emailSupport": "",
  "createdAt": "2024-10-22T01:42:14.071+00:00",
  "updatedAt": "2024-10-22T01:42:14.071+00:00",
  "createdBy": "2001208",
  "updatedBy": "2001208",
  "applicationCategory": {
    "applicationCategoryId": 1,
    "label": "Admin Module",
    "ems2Role": "SUPER_USER",
    "createdAt": "2024-10-22T01:42:12.380+00:00",
    "updatedAt": "2024-10-22T01:42:12.380+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  "importMap": {
    "importMapId": 5,
    "ems2Role": "SUPER_USER",
    "keyName": "base",
    "path": "//localhost:8002/base.js",
    "createdAt": "2024-10-22T01:42:09.325+00:00",
    "updatedAt": "2024-10-22T01:42:09.325+00:00",
    "createdBy": "2001208",
    "updatedBy": "2001208",
    "active": true
  },
  "active": true,
  "template": false
}

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

jest.mock('./services/useServices', () => {
  return {
    __esModule: true,
    default: () => ({
      getTile: async () => { return Promise.resolve([...TileData]) },
      getTileAudit: async () => { return Promise.resolve([...TileAuditData]) },
      updateTile: async () => { return Promise.resolve({ ...TileRecord }) },
      verifyTile: async () => { return Promise.resolve({ ...TileRecord }) },
      deactivateTile: async () => { return Promise.resolve({ ...TileRecord }) },
      createTile: async () => { return Promise.resolve({ ...NewRecord }) },
      getCategory: async () => { return Promise.resolve([...CategoryData]) },
      getImportMap: async () => { return Promise.resolve([...ImportMapData]) },
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
    label: "Tile",
    isLoaded: true,
    isActive: true,
    containers: []
  },
}

const rowsData = TileData.map((item: any) => {
  item.id = item.importMapId;
  return item;
});

const categoryRowsData = CategoryData.map((item: any) => {
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
    onSaveData,
    onVerify,
    onUpdate,
    onUpdateData,
    onDeactivate,
    auditColumns,
    getAuditData,
    onOpenAudit,
    onCloseAudit,
    setCategories,
    setOriginalCategories,
    onInputChange,
    onCategoryChange,
    getCategoryData,
    refresh,
    initData,
    setCategoryData,
  } = useController(props);

  React.useEffect(() => {
    setCategoryData(categoryRowsData)
    setCategoryData([{...categoryRowsData[0]}])
    setCategories([{...categoryRowsData[0]}])
    setCategories(categoryRowsData)
    setOriginalCategories([{...categoryRowsData[0]}])
    setOriginalCategories(categoryRowsData)
    initData()
    refresh()
    onCreateNew();
    onChange("abc", "label");
    onChange("template_container", "importMap");
    onChange("Admin Module", "applicationCategory");
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
    onOpenAudit(rowsData[0])();
    getAuditData(rowsData[0]);
    onCloseAudit();
    onInputChange({}, "");
    onInputChange({}, "abc");
    getCategoryData(undefined);
    getCategoryData(categoryRowsData[0]);
    getCategoryData({ id: -1, label: "All" })
    onCategoryChange({}, categoryRowsData[0])
    onCategoryChange({}, { id: -1, label: "All" })
    refresh()

    //@ts-ignore
    columns[0].getActions({ row: rowsData[0] })
    //@ts-ignore
    columns[1].renderCell({ row: rowsData[0] })
    //@ts-ignore
    columns[1].valueGetter({ row: rowsData[0] })
    //@ts-ignore
    columns[6].renderCell({ row: rowsData[0] })
    //@ts-ignore
    columns[6].valueGetter({ row: rowsData[0] })
    //@ts-ignore
    columns[14].renderCell(false)
    //@ts-ignore
    columns[14].renderCell(true)
    //@ts-ignore
    columns[15].renderCell({ value: "" })
    //@ts-ignore
    columns[17].renderCell({ value: "" })
    //@ts-ignore
    columns[15].renderCell({ value: rowsData[0].createdBy })
    //@ts-ignore
    columns[17].renderCell({ value: rowsData[0].updatedBy })
    //@ts-ignore
    columns[20].renderCell({ row: rowsData[0] })
    //@ts-ignore
    columns[20].valueGetter({ row: rowsData[0] })
    //@ts-ignore
    columns[21].renderCell({ row: rowsData[0] })
    //@ts-ignore
    columns[21].valueGetter({ row: rowsData[0] })
    //@ts-ignore
    auditColumns[3].renderCell({ row: rowsData[0] })
    //@ts-ignore
    auditColumns[8].renderCell({ row: rowsData[0] })
    //@ts-ignore
    auditColumns[15].renderCell({ row: rowsData[0] })
    //@ts-ignore
    auditColumns[16].valueGetter({ row: {} })
    //@ts-ignore
    auditColumns[18].valueGetter({ row: {} })
    //@ts-ignore
    auditColumns[16].valueGetter({ row: rowsData[0] })
    //@ts-ignore
    auditColumns[18].valueGetter({ row: rowsData[0] })
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
