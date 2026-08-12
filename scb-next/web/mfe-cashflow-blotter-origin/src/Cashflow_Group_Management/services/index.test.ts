import { Service } from "src/Root/import";

import { BlotterDataType } from "../Main/store/interface";
import { postManualResend,postManualSTP } from "./index";

afterAll(() => {
  vi.clearAllMocks();
});

describe("Grouping Blotter Entry", () => {
  it("should be in the document", async () => {
    const rows: BlotterDataType[] = [
      {
        Id: "",
        Group_Id: "",
        Group_Status: "",
        Group_Event: "",
        Trade_Id: "",
        Major_Version: 0,
        Cashflow_Id: "",
        Cashflow_Count: 200,
        Cashflow_Sequence: 1,
        Cashflow_Event_Reason: "",
        Booking_System_Event: "",
        Business_Event: "",
        Business_Version: 0,
        Status: "",
        Create_At: "",
        Update_At: "",
        Updated_By: "",
        Is_Group_Locked: false,
        Cashflow_Status: "",
        Booking_Entity_Id: "",
        Counterparty_Fm_Id: "",
        Value_Date: "",
        Is_Trade_Validated: true,
        Mxg_Trade_Id: "",
        Client_Domicile_Country: "",
        Commodity_Flag: "",
        Counterparty_Fm_Code: "",
        Booking_Entity_Fm_Code:"",
        ISDA_Taxonomy: "",
        Pay_Direction: "",
      },
    ];
    postManualSTP(rows);
    postManualResend(rows);
    expect(Service.service.post).toHaveBeenCalled();
  });
});
