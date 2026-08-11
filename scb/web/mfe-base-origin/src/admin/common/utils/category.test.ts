import { onDeactivateUtil, onSaveUtil, onUpdateUtil, onVerifyUtil, getCategory } from "./category";

const CategoryData = [{
  "applicationCategoryId": 7,
  "label": "M7 Platform",
  "ems2Role": "RATAN_PROD",
  "createdAt": "2025-02-20T07:14:20.491+00:00",
  "updatedAt": "2025-03-10T02:45:35.248+00:00",
  "createdBy": "FMO_PORTAL_SERVICE",
  "updatedBy": "FMO Portal Service",
  "orderNo": 9,
  "active": true
}]

describe("Admin Module Category Util", () => {

  it("should be true", () => {
    onSaveUtil({ applicationCategoryId: 1 }, [{ applicationCategoryId: 0 }], () => { })
    onSaveUtil({ id: 1 }, [{ applicationCategoryId: 0 }], () => { })

    onVerifyUtil({ applicationCategoryId: 1 }, [{ applicationCategoryId: 1 }], () => { })
    onVerifyUtil({ applicationCategoryId: 1 }, [{ applicationCategoryId: 2 }], () => { })
    onVerifyUtil({ id: 1 }, [{ applicationCategoryId: 2 }], () => { })

    onUpdateUtil({ applicationCategoryId: 1 }, [{ applicationCategoryId: 1 }], () => { })
    onUpdateUtil({ applicationCategoryId: 1 }, [{ applicationCategoryId: 2 }], () => { })
    onUpdateUtil({ id: 1 }, [{ applicationCategoryId: 2 }], () => { })

    onDeactivateUtil({ applicationCategoryId: 1 }, [{ applicationCategoryId: 1 }], () => { })
    onDeactivateUtil({ applicationCategoryId: 1 }, [{ applicationCategoryId: 2 }], () => { })
    onDeactivateUtil({ id: 1 }, [{ applicationCategoryId: 2 }], () => { })

    getCategory(CategoryData, "M7 Platform")
    getCategory([], "label")
    getCategory(CategoryData, "label")

  });
});