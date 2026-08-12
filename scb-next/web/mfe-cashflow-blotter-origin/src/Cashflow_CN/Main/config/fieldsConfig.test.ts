import { displayCountDownTime, styleForCountDownTime } from "Import/ratanutils";
import { mockVostroFormData } from "src/Cashflow_CN/test/mockData/vostro";
import { mockFormInstanceOfVostro } from "src/Cashflow_CN/test/mockUtils/form";

import { NetType } from "../workflow/netCashflow/netCashflowRightMenu";
import {
  cashflowCustomFields,
  componentCashflowNetPreviewGrid,
  customizeCashflowFields,
  resolveGroupTitle,
  SSI_DETAILS_CONFIG_CN_Group,
} from "./fieldsConfig";
afterAll(() => {
  vi.clearAllMocks();
});

describe("SSI_DETAILS_CONFIG_CN_Group", () => {
  it("swiftType onChange updates group titles and popDubai hidden", () => {
    const swiftTypeItem =
      SSI_DETAILS_CONFIG_CN_Group[0].row[0].itemConfig?.find(
        (item) => item.field === "swiftType"
      );
    const newConfig = swiftTypeItem?.onChange(
      "MT202",
      SSI_DETAILS_CONFIG_CN_Group,
      mockFormInstanceOfVostro({ formData: mockVostroFormData })
    );

    const orderingGroup = newConfig?.find((g) =>
      g.title?.startsWith("52a:")
    );
    const beneficiaryGroup = newConfig?.find((g) =>
      g.title?.startsWith("58a:")
    );

    expect(orderingGroup?.title).toBe("52a: Ordering Institution");
    expect(beneficiaryGroup?.title).toBe("58a: Beneficiary Customer");

    const popGroup = newConfig?.find(
      (g) => g.row?.[0]?.itemConfig?.[0]?.field === "popDubai"
    );
    const popDubai = popGroup?.row?.[0]?.itemConfig?.[0];
    expect(popDubai?.hidden).toBe(true);
  });

  it("settlementAccount onChange updates popDubai hidden", () => {
    const settlementAccountItem =
      SSI_DETAILS_CONFIG_CN_Group[0].row[1].itemConfig?.find(
        (item) => item.field === "settlementAccount"
      );
    const newConfig = settlementAccountItem?.onChange(
      "",
      SSI_DETAILS_CONFIG_CN_Group,
      mockFormInstanceOfVostro({ formData: mockVostroFormData })
    );

    const popGroup = newConfig?.find(
      (g) => g.row?.[0]?.itemConfig?.[0]?.field === "popDubai"
    );
    const popDubai = popGroup?.row?.[0]?.itemConfig?.[0];
    expect(popDubai?.hidden).toBe(true);
  });
});

describe("resolveGroupTitle", () => {
  it("returns MT202 title for known groups", () => {
    expect(resolveGroupTitle("50a:", "MT202")).toBe(
      "52a: Ordering Institution"
    );
    expect(resolveGroupTitle("58a:", "MT202")).toBe(
      "58a: Beneficiary Customer"
    );
  });

  it("returns default title for non-MT202 swiftType", () => {
    expect(resolveGroupTitle("50a:", "MT103")).toBe(
      "50a: Ordering Customer"
    );
    expect(resolveGroupTitle("59a:", "MT103")).toBe(
      "59a: Beneficiary Customer"
    );
  });

  it("returns undefined for unknown group key", () => {
    expect(resolveGroupTitle("70:", "MT202")).toBeUndefined();
  });
});

test("cashflowCustomFields", async () => {
  cashflowCustomFields["Cashflow.Cashflow_Id"].colDefs.comparator(2, 1);

  cashflowCustomFields["Cashflow.Cashflow_State"].colDefs.cellStyle({
    value: "X",
  });

  cashflowCustomFields["Cashflow.Cashflow_State"].colDefs.cellStyle({
    value: "QUEUED",
    data: { Cashflow: {} },
  });

  cashflowCustomFields["Cashflow.Payment_Amount"].colDefs.comparator(2, 1);

  cashflowCustomFields.Trade_Id.colDefs.comparator(2, 1);

  cashflowCustomFields.Parent_Trade_Id.colDefs.comparator(2, 1);

  cashflowCustomFields["FMO_Comments.FMO_Comment"].colDefs.valueGetter({
    data: {
      FMO_Comments: [],
    },
  });

  cashflowCustomFields["FMO_Comments.FMO_Comment"].colDefs.valueGetter({
    data: {
      FMO_Comments: [
        {
          FMO_Comment: "auto test SettleAsGross",
          FMO_Comment_Timestamp: "Mon May 20 03:52:31 GMT 2024",
          FMO_Comment_Updater: "1639796",
        },
      ],
    },
  });

  cashflowCustomFields["FMO_Comments.FMO_Comment"].colDefs.valueGetter({
    data: {
      FMO_Comments: [
        {
          FMO_Comment: "auto test SettleAsGross",
          FMO_Comment_Timestamp: "Mon May 20 03:52:31 GMT 2024",
          FMO_Comment_Updater: "1639796",
        },
        {
          FMO_Comment: "netting test",
          FMO_Comment_Timestamp: "Sun May 19 00:08:31 GMT 2024",
          FMO_Comment_Updater: "System",
        },
      ],
    },
  });

  cashflowCustomFields[
    "Cashflow.Is_Amended_Post_Settlement"
  ].colDefs.filterValueGetter({
    data: { Cashflow: { Is_Amended_Post_Settlement: "0" } },
  });

  cashflowCustomFields[
    "Cashflow.Is_Amended_Post_Settlement"
  ].colDefs.valueFormatter({
    data: { Cashflow: { Is_Amended_Post_Settlement: "1" } },
  });

  cashflowCustomFields[
    "Cashflow.Is_Private_Banking_Cashflow"
  ].colDefs.filterValueGetter({
    data: { Cashflow: { Is_Private_Banking_Cashflow: "0" } },
  });

  cashflowCustomFields[
    "Cashflow.Is_Private_Banking_Cashflow"
  ].colDefs.valueFormatter({
    data: { Cashflow: { Is_Private_Banking_Cashflow: "1" } },
  });

  cashflowCustomFields["Cashflow.Is_STP_RATAN"].colDefs.filterValueGetter({
    data: { Cashflow: { Is_STP_RATAN: "0" } },
  });

  cashflowCustomFields["Cashflow.Is_STP_RATAN"].colDefs.valueFormatter({
    data: { Cashflow: { Is_STP_RATAN: "1" } },
  });

  cashflowCustomFields["Cashflow.Is_STP"].colDefs.filterValueGetter({
    data: { Cashflow: { Is_STP: "0" } },
  });

  const isStp = cashflowCustomFields["Cashflow.Is_STP"].colDefs.valueFormatter({
    data: { Cashflow: { Is_STP: "1" } },
  });
  expect(isStp).toEqual("1");
});

test("componentCashflowNetPreviewGrid1", async () => {
  let style;
  componentCashflowNetPreviewGrid(NetType.BilateralNetting).forEach((item) => {
    if (item.headerName == "Cashflow Id") {
      //@ts-ignore
      style = item.cellStyle({ data: { Resullt: false, Type: "single" } });
    }
  });
  expect(style).toBeDefined();
});

test("cashflowIdOfNettingPreviewGrid2", async () => {
  let style;
  componentCashflowNetPreviewGrid(NetType.BilateralNetting).forEach((item) => {
    if (item.headerName == "Cashflow Id") {
      //@ts-ignore
      style = item.cellStyle({ data: {} });
    }
  });
  expect(style).toBeUndefined();
});

test("cashflowIdOfNettingPreviewGrid3", async () => {
  let style;
  componentCashflowNetPreviewGrid(NetType.BilateralNetting).forEach((item) => {
    if (item.headerName == "Cashflow Id") {
      //@ts-ignore
      style = item.cellStyle({ data: { Resullt: false, Type: "" } });
    }
  });
  expect(style).toBeUndefined();
});

test("customizeCashflowFields", async () => {
  customizeCashflowFields.forEach((item) => {
    if (item.headerName == "Release Timer") {
      //@ts-ignore
      item.filterValueGetter({
        data: {
          Cashflow: { Payment_Cutoff_Time: "20240613" },
        },
      });
      //@ts-ignore
      item.valueFormatter({
        data: {
          Cashflow: { Payment_Cutoff_Time: "20240613" },
        },
      });
      //@ts-ignore
      item.cellClass({
        data: {
          Cashflow: { Payment_Cutoff_Time: "20240613" },
        },
      });
    }
  });
  expect(displayCountDownTime).toHaveBeenCalled();
  expect(styleForCountDownTime).toHaveBeenCalled();
});
