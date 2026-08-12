import { onDeactivateUtil, onSaveUtil, onUpdateUtil, onVerifyUtil, getImportMap } from "./importmap";

const ImportMapData = [{
  "importMapId": 1,
  "ems2Role": "SUPER_USER",
  "keyName": "single-spa",
  "path": "/js/external/single-spa.dev.js",
  "createdAt": "2024-10-21T08:43:35.696+00:00",
  "updatedAt": "2024-10-21T08:43:35.696+00:00",
  "createdBy": "2001208",
  "updatedBy": "2001208",
  "active": true
}]

describe("Admin Module Category Util", () => {

  it("should be true", () => {
    onSaveUtil({ importMapId: 1 }, [{ importMapId: 0 }], () => { })
    onSaveUtil({ id: 1 }, [{ importMapId: 0 }], () => { })

    onVerifyUtil({ importMapId: 1 }, [{ importMapId: 1 }], () => { })
    onVerifyUtil({ importMapId: 1 }, [{ importMapId: 2 }], () => { })
    onVerifyUtil({ id: 1 }, [{ importMapId: 2 }], () => { })

    onUpdateUtil({ importMapId: 1 }, [{ importMapId: 1 }], () => { })
    onUpdateUtil({ importMapId: 1 }, [{ importMapId: 2 }], () => { })
    onUpdateUtil({ id: 1 }, [{ importMapId: 2 }], () => { })

    onDeactivateUtil({ importMapId: 1 }, [{ importMapId: 1 }], () => { })
    onDeactivateUtil({ importMapId: 1 }, [{ importMapId: 2 }], () => { })
    onDeactivateUtil({ id: 1 }, [{ importMapId: 2 }], () => { })

    getImportMap(ImportMapData, "single-spa")
    getImportMap([], "single-spa")
    getImportMap(ImportMapData, "react")
  });
});