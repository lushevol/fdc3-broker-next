import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import { propsAddTile } from "../Drawer/common/interface";
import ThemeProvider from "../../theme";
import { PREFIX } from "./common/style";
import useController from "./common/useController";
afterAll(() => {
  vi.clearAllMocks();
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
    getEnv: () => "LOCAL",
    getHostName: () => "localhost",
    getSurveyLink: () => "https://surveys.sc.com/jfe/preview/previewId/b35e7b90-467e-473f-9ff3-8b6a099569d5/SV_cUVyvBdVELMVr02?Q_CHL=preview&Q_SurveyVersionID=current",
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
    getWindowOpen: () => {
      return () => { }
    },
    aOrb: (a, b) => a ?? b,
  }
});
const Comp = () => {
  return (<Root />);
};

const Comp2 = () => {
  const {
    addTile,
    openPopUp,
    winFocusEvent,
    beforeunloadEvent,
  } = useController();
  React.useEffect(() => {
    addTile({
      ...propsAddTile,
      container: "@FM/TEMPLATE_CONTAINER",
      module: "/TEMPLATE",
      tile: "/TILE1",
      title: `Tile 1`,
      parameters: undefined,
    });
    addTile({
      ...propsAddTile,
      container: "@FM/TEMPLATE_CONTAINER",
      module: "/TEMPLATE",
      tile: "/TILE1",
      title: `Tile 1`,
      parameters: undefined,
    });
    openPopUp();
    winFocusEvent();
    winFocusEvent({ preventDefault: () => { } } as any);
    beforeunloadEvent({ preventDefault: () => { } } as any);
  }, []);
  return (<Root />);
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
  it("should be in the document", () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: "?survey=no"
      },
      writable: true
    });
    render(<Provider data={{ drawers, user: { id: "123" }, token: "123", theme: "dark" }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    const newTile = screen.getByTestId(`undefined_new_tile`);
    expect(newTile).toBeInTheDocument();
    newTile.click();
    newTile.click();

    const avatar = screen.getByTestId(`undefined_avatar`);
    expect(avatar).toBeInTheDocument();
    avatar.click();

    const Logout = screen.getByTestId(`undefined_avatar_Logout`);
    expect(Logout).toBeInTheDocument();
    Logout.click();
  });
  it("should be in the document", () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 100,
      writable: true
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 100,
      writable: true
    });
    Object.defineProperty(window, 'setTimeout', {
      value: (f) => { f(); },
      writable: true
    });
    Object.defineProperty(window, 'location', {
      value: {
        search: "?survey=yes"
      },
      writable: true
    });
    render(<Provider data={{ drawers, user: { id: "123" }, token: "123", theme: "light" }}>
      <ThemeProvider>
        <Comp2 />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    const newTile = screen.getByTestId(`undefined_new_tile`);
    expect(newTile).toBeInTheDocument();
    newTile.click();
    newTile.click();
  });
  it("should be in the document", () => {
    Object.defineProperty(window, 'innerWidth', {
      value: undefined,
      writable: true
    });
    Object.defineProperty(window, 'innerHeight', {
      value: undefined,
      writable: true
    });
    Object.defineProperty(window, 'setTimeout', {
      value: (f) => { f(); },
      writable: true
    });
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: 100,
      configurable: true,
      writable: true
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 100,
      configurable: true,
      writable: true
    });
    render(<Provider data={{ drawers, user: { id: "123" }, token: "123", theme: "light", workspaces: undefined }}>
      <ThemeProvider>
        <Comp2 />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    const newTile = screen.getByTestId(`undefined_new_tile`);
    expect(newTile).toBeInTheDocument();
    newTile.click();
    newTile.click();
  });
  it("should be in the document", () => {
    Object.defineProperty(window, 'innerWidth', {
      value: undefined,
      writable: true
    });
    Object.defineProperty(window, 'innerHeight', {
      value: undefined,
      writable: true
    });
    Object.defineProperty(window, 'setTimeout', {
      value: (f) => { f(); },
      writable: true
    });
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: undefined,
      configurable: true,
      writable: true
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: undefined,
      configurable: true,
      writable: true
    });
    global.screen = Object.create(screen);
    Object.defineProperty(screen, 'width', {
      value: 100,
      writable: true
    });
    Object.defineProperty(screen, 'height', {
      value: 100,
      writable: true
    });
    render(<Provider data={{ drawers, user: { id: "123" }, token: "123", theme: "light", currentWorkspace: undefined }}>
      <ThemeProvider>
        <Comp2 />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    const newTile = screen.getByTestId(`undefined_new_tile`);
    expect(newTile).toBeInTheDocument();
    newTile.click();
    newTile.click();
  });
});
