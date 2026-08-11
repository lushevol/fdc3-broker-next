jest.mock('./common', () => {
  return { getEnv: () => "LOCAL" }
});
import { getEntities } from "./entities";

describe("entities Util", () => {
  it("should be true", () => {
    const drawers = [
      {
        "tiles": [
          {
            "container": "@fm/base",
            "imageDarkTheme": "darkIcons/icon12.svg",
            "subject": "/importmap",
            "isTemplate": false,
            "emailSupport": "",
            "module": "/importmap",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon12.svg",
            "tile": "/importmap",
            "id": 1,
            "title": "Module Map",
            "entity": [
              "FMO PORTAL ADMIN"
            ]
          },
          {
            "container": "@fm/base",
            "imageDarkTheme": "darkIcons/icon13.svg",
            "subject": "/category",
            "isTemplate": false,
            "emailSupport": "",
            "module": "/category",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon13.svg",
            "tile": "/category",
            "id": 2,
            "title": "Drawer Category",
            "entity": [
              "FMO PORTAL ADMIN"
            ]
          },
          {
            "container": "@fm/base",
            "imageDarkTheme": "darkIcons/icon14.svg",
            "subject": "/tile",
            "isTemplate": false,
            "emailSupport": "",
            "module": "/tile",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon14.svg",
            "tile": "/tile",
            "id": 3,
            "title": "Tile Configuration",
            "entity": [
              "FMO PORTAL ADMIN"
            ]
          }
        ],
        "id": 1,
        "label": "Admin Module"
      },
      {
        "tiles": [
          {
            "container": "@fm/mfe_fssservices_container",
            "imageDarkTheme": "darkIcons/icon10.svg",
            "subject": "FSS Payments Services",
            "isTemplate": false,
            "emailSupport": "FM_BPMS.SUPPORT@sc.com",
            "module": "/mfe_fssservices_tiles",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon10.svg",
            "tile": "/tile1",
            "id": 19,
            "title": "Payment Processing",
            "entity": [
              "FSS_PAYMENTS_SERVICES_TH",
              " FSS_PAYMENTS_SERVICES_SG"
            ]
          },
          {
            "container": "@fm/mfe_fssservices_peregrine_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "FSS Services Peregrine",
            "isTemplate": false,
            "emailSupport": "FM_BPMS.SUPPORT@sc.com",
            "module": "/mfe_fssservices_peregrine_tiles",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/peregrine",
            "id": 22,
            "title": "FSS Services – DAC",
            "entity": [
              "FSS_SERVICES_PEREGRINE",
              "FSS_SERVICES_PEREGRINE_AE",
              "FSS_SERVICES_PEREGRINE_HK",
              "FSS_SERVICES_PEREGRINE_LU"
            ]
          }
        ],
        "id": 5,
        "label": "FSS SERVICES"
      },
      {
        "tiles": [
          {
            "container": "@fm/ssi_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "SEARCH",
            "isTemplate": false,
            "emailSupport": "FM-TPT-JavaX-Studio@exchange.standardchartered.com",
            "module": "/ssi",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/search",
            "id": 43,
            "title": "SSI",
            "entity": [
              "SSIPLUS"
            ]
          },
          {
            "container": "@fm/ssi_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "STATIC",
            "isTemplate": false,
            "emailSupport": "FM-TPT-JavaX-Studio@exchange.standardchartered.com",
            "module": "/ssi",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/static",
            "id": 44,
            "title": "Static",
            "entity": [
              "SSIPLUS"
            ]
          },
          {
            "container": "@fm/ssi_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "VALIDATIONRULES",
            "isTemplate": false,
            "emailSupport": "FM-TPT-JavaX-Studio@exchange.standardchartered.com",
            "module": "/ssi",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/validationrules",
            "id": 45,
            "title": "Validation rules and Market filter set",
            "entity": [
              "SSIPLUS"
            ]
          },
          {
            "container": "@fm/ssi_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "WORKQUEUE",
            "isTemplate": false,
            "emailSupport": "FM-TPT-JavaX-Studio@exchange.standardchartered.com",
            "module": "/ssi",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/queues",
            "id": 46,
            "title": "Work Queues",
            "entity": [
              "SSIPLUS"
            ]
          },
          {
            "container": "@fm/ssi_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "IMPORTEXPORT",
            "isTemplate": false,
            "emailSupport": "FM-TPT-JavaX-Studio@exchange.standardchartered.com",
            "module": "/ssi",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/import_export",
            "id": 47,
            "title": "Import/Export",
            "entity": [
              "SSIPLUS"
            ]
          }
        ],
        "id": 11,
        "label": "SSI plus"
      },
      {
        "tiles": [
          {
            "container": "@fm/stamp_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "Mapping Query",
            "isTemplate": false,
            "emailSupport": "MLS_BAU@sc.com",
            "module": "/stamp",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/stamp-mappingquery",
            "id": 48,
            "title": "Mapping Query",
            "entity": [
              "STAMP_STATIC"
            ]
          },
          {
            "container": "@fm/stamp_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "Audit",
            "isTemplate": false,
            "emailSupport": "MLS_BAU@sc.com",
            "module": "/stamp",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/stamp-audit",
            "id": 49,
            "title": "Audit",
            "entity": [
              "STAMP_STATIC"
            ]
          }
        ],
        "id": 12,
        "label": "Static Data Mapping"
      }
    ];
    let entities = getEntities(drawers);
    entities = Object.keys(getEntities(drawers));
    let check = entities.includes("FMO PORTAL ADMIN");
    expect(check).toBeTruthy();
    check = entities.includes("X_RATANONE");
    expect(check).toBeFalsy();
  });
});