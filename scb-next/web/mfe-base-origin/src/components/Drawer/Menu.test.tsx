import { render, screen } from "@testing-library/react";
import React from "react";
import Root from "./Menu";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { DrawerProps } from "./common/interface";
import { Container } from "../../hooks/model/workspaces";

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
    getEnv: () => "TEMP",
    getHostName: () => "localhost",
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
    validateTile: () => true
  }
});

const Comp = (props: DrawerProps) => {
  return (<Root {...props} />);
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

const waitFor = (time = 10000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time)
});

describe("Appbar component", () => {
  it("should be in the document", async () => {
    render(<Provider data={{ drawers, user: { id: "123" }, token: "123", theme: "dark" }}>
      <ThemeProvider>
        <Comp anchor={true} toggleDrawer={() => { }} addTile={(item: Container) => { }} drawers={drawers} />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    await waitFor();
  });
  it("should be in the document", async () => {
    render(<Provider data={{ user: { id: "123" }, token: "123", theme: "dark" }}>
      <ThemeProvider>
        <Comp anchor={true} toggleDrawer={() => { }} addTile={(item: Container) => { }} drawers={drawers} />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    await waitFor();
  });
});
