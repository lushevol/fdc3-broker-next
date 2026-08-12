import { setDetail, refreshTabUtil, fdc3InitUtil, broadcastUtil, openTileUtil } from "./util";

describe("Home Page Util", () => {
  it("should be true", () => {
    let container = "base";
    let tile = "home";
    let title = "";
    let workspace = { "containers": [{ "id": "532a0821-e595-4188-b4d8-f005643b9cb5", "container": "@fm/template_container", "module": "/template", "tile": "/tile2", "title": "Modal Example ", "emailSupport": "khairul.anshar1@sc.com", "panelId": "", "tabId": "", "parameters": { "testId": "123" } }] }
    setDetail(workspace, title, container, tile);
    refreshTabUtil(
      { '123': () => { } },
      [{ id: '123', label: 'label' }],
      '123',
      () => { },
      () => { }
    )
    refreshTabUtil(
      { '123': () => { } },
      [{ id: '123', label: 'label' }],
      '1234',
      () => { },
      () => { }
    )
    fdc3InitUtil(true, true, true, "LOCAL", () => { })
    fdc3InitUtil(false, true, true, "LOCAL", () => { })
    fdc3InitUtil(true, false, true, "LOCAL", () => { })
    fdc3InitUtil(true, true, false, "LOCAL", () => { })
    fdc3InitUtil(true, true, true, "DEV", () => { })
    fdc3InitUtil(true, true, true, "UAT", () => { })
    broadcastUtil(true, { broadcast: (_p) => { } }, "LOCAL", {})
    broadcastUtil(false, { broadcast: (_p) => { } }, "LOCAL", {})
    broadcastUtil(true, undefined, "LOCAL", {})
    broadcastUtil(true, { broadcast: (_p) => { } }, "DEV", {})
    broadcastUtil(true, { broadcast: (_p) => { } }, "UAT", {})
    openTileUtil(true, true, (_t, _p) => { }, {}, {})
    openTileUtil(false, true, (_t, _p) => { }, {}, {})
    openTileUtil(true, false, (_t, _p) => { }, {}, {})
    openTileUtil(false, false, (_t, _p) => { }, {}, {})
  });
  it("should be false", () => {
    let container = "base";
    let tile = "home";
    let title = "";
    let workspace = {};
    setDetail(workspace, title, container, tile)
  });
});