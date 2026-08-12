vi.mock('./common', () => {
  return { getEnv: () => "LOCAL" }
});
import { getSubject, findTile, setTabPanel, getTile } from "./drawer";
import { Tile } from "../components/Drawer/common/interface";
export const waitFor = (time = 2000) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
const workspaces = [{ "id": "21a6d709-842d-4a16-a44d-ef14969d7cce", "label": "Drawer Category ", "isActive": false, "containers": [{ "id": "e635e409-3212-4ac6-83cd-ceeac5209c02", "container": "@fm/base", "module": "/category", "tile": "/category", "title": "Drawer Category ", "emailSupport": "", "panelId": "", "tabId": "", "leftPosition": "calc(50% - 45px)", "topPossition": "8px" }] }, { "id": "0460fe39-26ba-458c-b255-3e12814d3d29", "label": "Mapping Query ", "isActive": false, "containers": [{ "id": "bda45e98-2b0a-4162-9a14-6133ac4ff045", "container": "@fm/stamp_container", "module": "/stamp", "tile": "/stamp-mappingquery", "title": "Mapping Query ", "emailSupport": "MLS_BAU@sc.com", "panelId": "", "tabId": "", "leftPosition": "calc(50% - 45px)", "topPossition": "8px" }] }]
const Tile0: Tile = {
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
}
const Tile1: Tile = { "title": "Mapping Query", "pinImage": "", "imageDarkTheme": "test-file-stub", "imageLightTheme": "test-file-stub", "disabled": false, "pinned": false, "container": "@undefined/stamp_container", "module": "/stamp", "tile": "/stamp-mappingquery", "parameters": { "testId": "123" }, "emailSupport": "MLS_BAU@sc.com", "entity": ["STAMP_STATIC"], "subject": "Mapping Query" }
const Tile11: any = { "title": "Mapping Query", "pinImage": "", "imageDarkTheme": "test-file-stub", "imageLightTheme": "test-file-stub", "disabled": false, "pinned": false, "container": "@undefined/stamp_container", "module": "/stamp", "tile": "/stamp-mappingquery", "parameters": { "testId": "123" }, "emailSupport": "MLS_BAU@sc.com", "entity": "STAMP_STATIC", "subject": "Mapping Query" }
const Tile111: any = { "title": "Mapping Query", "pinImage": "", "imageDarkTheme": "test-file-stub", "imageLightTheme": "test-file-stub", "disabled": false, "pinned": false, "container": "@undefined/stamp_container", "module": "/stamp", "tile": "/stamp-mappingquery", "parameters": { "testId": "123" }, "emailSupport": "MLS_BAU@sc.com", "entity": ["STAMP_STATIC_XXX"], "subject": "Mapping Query" }
const Tile2: Tile = { "title": "Mapping Query", "pinImage": "", "imageDarkTheme": "test-file-stub", "imageLightTheme": "test-file-stub", "disabled": false, "pinned": false, "container": "@undefined/stamp_container", "module": "/stamp", "tile": "/stamp-mappingquery", "parameters": { "testId": "123" }, "emailSupport": "MLS_BAU@sc.com", "entity": ["STAMP_STATIC"], "subject": "Mapping Query1" }
const entities = [{
  "id": 290661,
  "name": "STAMP_STATIC",
  "applicationName": "ASSET CONTROL",
  "roleId": 290692,
  "roleName": "STATIC_STAMP",
  "subjects": [
    {
      "longName": "/Audit",
      "name": "Audit",
      "id": 290663,
      "actions": [
        {
          "name": "Read",
          "id": 290698,
          "entitlementId": 291417
        }
      ]
    },
    {
      "longName": "/Mapping Query",
      "name": "Mapping Query",
      "id": 290675,
      "actions": [
        {
          "name": "Write",
          "id": 290699,
          "entitlementId": 291464
        }
      ]
    }
  ]
}]
const subject = {
  "longName": "/Mapping Query",
  "name": "Mapping Query",
  "id": 290675,
  "actions": [
    {
      "name": "Write",
      "id": 290699,
      "entitlementId": 291464
    }
  ]
}
const drawers = [
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
]
vi.mock('../hooks/HooksBase', () => {
  const hooksBase = {
    store: { drawers, entities },
    setStore: function (store) {
      this.store = store;
    },
    baseDispatch: () => { },
    setBaseDispatch: function (dispatch) {
      this.baseDispatch = dispatch;
    },
  };
  const getHooksBase = () => hooksBase;
  return { getHooksBase }
});
describe("Channel Util", () => {
  it("should be undefined", () => {
    expect(getTile([], "1")).toBeUndefined();
  });
  it("should be undefined", () => {
    expect(getTile(workspaces, "1")).toBeUndefined();
  });
  it("should be undefined", () => {
    expect(getTile(workspaces, "0460fe39-26ba-458c-b255-3e12814d3d29")).toStrictEqual(Tile0);
  });
  it("should be undefined", () => {
    expect(getSubject([], {})).toBeUndefined();
  });
  it("should be undefined", () => {
    expect(getSubject(entities, Tile0)).toStrictEqual(subject);
  });
  it("should be undefined", () => {
    expect(getSubject(entities, Tile1)).toStrictEqual(subject);
  });
  it("should be undefined", () => {
    expect(getSubject(entities, Tile11)).toStrictEqual(subject);
  });
  it("should be undefined", () => {
    expect(getSubject(entities, Tile111)).toBeUndefined();
  });
  it("should be undefined", () => {
    expect(getSubject(entities, Tile2)).toBeUndefined();
  });
  it("should be undefined", () => {
    const index = workspaces.findIndex((workspace) => workspace.id === "0460fe39-26ba-458c-b255-3e12814d3d29");
    const workspace = workspaces[index];
    expect(findTile(drawers, workspace)).toStrictEqual(Tile0);
  });
  it("should be undefined", () => {
    const index = workspaces.findIndex((workspace) => workspace.id === "21a6d709-842d-4a16-a44d-ef14969d7cce");
    const workspace = workspaces[index];
    expect(findTile(drawers, workspace)).toBeUndefined();
  });
  it("setTabPanel", async () => {
    let b = false;
    let isHidden = false;
    let isHidden2 = false;
    setTabPanel(1, 1, (_value) => { isHidden = _value; }, (_value) => { isHidden2 = _value; }, b, (_value) => { b = _value; });
    await waitFor(800);
    expect(isHidden).toBeFalsy();
    expect(isHidden2).toBeFalsy();
    expect(b).toBeTruthy()

    isHidden = false;
    isHidden2 = false;
    setTabPanel(1, 2, (_value) => { isHidden = _value; }, (_value) => { isHidden2 = _value; }, b, (_value) => { b = _value; });
    await waitFor(800);
    expect(isHidden).toBeTruthy();
    expect(isHidden2).toBeTruthy();
    expect(b).toBeTruthy();

    b = false;
    isHidden = false;
    isHidden2 = false;
    setTabPanel(1, 1, (_value) => { isHidden = _value; }, (_value) => { isHidden2 = _value; }, b, (_value) => { b = _value; });
    await waitFor(800);
    expect(isHidden).toBeFalsy();
    expect(isHidden2).toBeFalsy();
    expect(b).toBeTruthy();

    b = true;
    isHidden = false;
    isHidden2 = false;
    setTabPanel(1, 1, (_value) => { isHidden = _value; }, (_value) => { isHidden2 = _value; }, b, (_value) => { b = _value; });
    await waitFor(800);
    expect(isHidden).toBeFalsy();
    expect(isHidden2).toBeFalsy();
    expect(b).toBeTruthy();
  });
});
