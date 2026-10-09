import { onDeactivateUtil, onSaveUtil, onUpdateUtil, onVerifyUtil } from "./tile";

describe("Admin Module Category Util", () => {

  it("should be true", () => {
    onSaveUtil({ applicationTileId: 1 }, [{ applicationTileId: 0 }], () => { })
    onSaveUtil({ id: 1 }, [{ applicationTileId: 0 }], () => { })

    onVerifyUtil({ applicationTileId: 1 }, [{ applicationTileId: 1 }], () => { })
    onVerifyUtil({ applicationTileId: 1 }, [{ applicationTileId: 2 }], () => { })
    onVerifyUtil({ id: 1 }, [{ applicationTileId: 2 }], () => { })

    onUpdateUtil({ applicationTileId: 1 }, [{ applicationTileId: 1 }], () => { })
    onUpdateUtil({ applicationTileId: 1 }, [{ applicationTileId: 2 }], () => { })
    onUpdateUtil({ id: 1 }, [{ applicationTileId: 2 }], () => { })

    onDeactivateUtil({ applicationTileId: 1 }, [{ applicationTileId: 1 }], () => { })
    onDeactivateUtil({ applicationTileId: 1 }, [{ applicationTileId: 2 }], () => { })
    onDeactivateUtil({ id: 1 }, [{ applicationTileId: 2 }], () => { })

  });
});