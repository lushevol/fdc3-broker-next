import { onDeactivateUtil, onSaveUtil } from "./config";

describe("Admin Module Category Util", () => {

  it("should be true", () => {
    onSaveUtil({ applicationConfigId: 1 }, [{ applicationConfigId: 0 }], () => { })
    onSaveUtil({ id: 1 }, [{ applicationConfigId: 0 }], () => { })

    onDeactivateUtil({ applicationConfigId: 1 }, [{ applicationConfigId: 1 }], () => { })
    onDeactivateUtil({ applicationConfigId: 1 }, [{ applicationConfigId: 2 }], () => { })
    onDeactivateUtil({ id: 1 }, [{ applicationConfigId: 2 }], () => { })

  });
});