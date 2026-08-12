import React from "react";
import { render, screen } from "@testing-library/react";
import { Item } from "./MenuItem";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { DrawerProps } from "./common/interface";
import { Container } from "../../hooks/model/workspaces";
import useController from "./common/MenuItem.useController";
afterAll(() => {
  vi.clearAllMocks();
});
vi.mock('../../utils/common', () => {
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
    validateTile: () => false
  }
});
const tileProps = {
  title: "",
  pinImage: "",
  imageDarkTheme: "",
  disabled: false,
  pinned: false,
  container: "",
  module: "",
  tile: "",
  emailSupport: "",
  entity: ["a"],
  subject: "b",
  isTemplate: false,
}
const Comp = (props: DrawerProps) => {
  const { onClick, getParamter } = useController(props, tileProps);
  React.useEffect(() => {
    onClick()
    getParamter(undefined)
    getParamter({ a: "1" })
  }, []);
  return Item(props, tileProps);
};

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
  },
  {
    "tiles": [
      {
        "container": "@fm/template_container",
        "imageDarkTheme": "darkIcons/icon01.svg",
        "subject": "",
        "isTemplate": true,
        "emailSupport": "",
        "module": "/template",
        "subtitle": "",
        "imageLightTheme": "lightIcons/icon01.svg",
        "tile": "/tile1",
        "id": 65,
        "title": "Date Range Picker Example",
        "entity": [
          ""
        ]
      },
    ],
    "id": 2,
    "label": "Template"
  },
];

describe("Appbar component", () => {
  it("should be in the document", async () => {
    render(<Provider data={{ drawers, user: { id: "123" }, token: "123", theme: "dark" }}>
      <ThemeProvider>
        <Comp anchor={true} toggleDrawer={() => { }} addTile={(item: Container) => { }} drawers={drawers} />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", async () => {
    render(<Provider data={{ user: { id: "123" }, token: "123", theme: "dark" }}>
      <ThemeProvider>
        <Comp anchor={true} toggleDrawer={() => { }} addTile={(item: Container) => { }} drawers={drawers} />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});
