import { render, screen } from "@testing-library/react";

import { DisplayAmendment } from "./index";

afterAll(() => {
  vi.clearAllMocks();
});

describe("DisplayAmendment component", () => {
  it("Warning Amendment", async () => {
    const cashflow = {
      Cashflow_Id: "M00050052406",
      Cashflow_Business_Version: 0,
      Cashflow_Version: 0,
      Cashflow_State: "WAITING",
      Cashflow_Affirmation_Status: "Unaffirmed",
      Cashflow_Event_Type: "New",
      Cashflow_Minor_Version: 3,
      Payment_Currency: "SGD",
      Payment_Date: "2024-05-24",
      Payment_Type: "",
      Payment_Cutoff_Time: "2024-05-23T11:00Z",
      Pay_Receive_Indicator: "Receive",
      Payment_Amount: "1462785.000000",
      Netting_Id: null,
      Netting_Cuttoff_Date: null,
      Payment_Receiver_Party_Reference: "party1",
      Payment_Payer_Party_Reference: "party2",
      Cashflow_Sub_State: "Pending Operator",
      Cashflow_Sub_State_Type: "Pending Exception",
      Cashflow_Sub_State_Updater: "System",
      Status_Event_Type: "NostroStamped",
      Event_Date: "2023-03-05",
      Cashflow_Event_Reason: "Reversal",
      Booking_System_Event: "Amendment",
    };
    const { container } = render(<DisplayAmendment cashflow={cashflow} />);
    expect(container).toContainHTML("Reversal");
  });
  it("Success Amendment", async () => {
    const cashflow = {
      Cashflow_Id: "M00050052406",
      Cashflow_Business_Version: 0,
      Cashflow_Version: 0,
      Cashflow_State: "WAITING",
      Cashflow_Affirmation_Status: "Unaffirmed",
      Cashflow_Event_Type: "New",
      Cashflow_Minor_Version: 3,
      Payment_Currency: "SGD",
      Payment_Date: "2024-05-24",
      Payment_Type: "",
      Payment_Cutoff_Time: "2024-05-23T11:00Z",
      Pay_Receive_Indicator: "Receive",
      Payment_Amount: "1462785.000000",
      Netting_Id: null,
      Netting_Cuttoff_Date: null,
      Payment_Receiver_Party_Reference: "party1",
      Payment_Payer_Party_Reference: "party2",
      Cashflow_Sub_State: "Pending Operator",
      Cashflow_Sub_State_Type: "Pending Exception",
      Cashflow_Sub_State_Updater: "System",
      Status_Event_Type: "NostroStamped",
      Event_Date: "2023-03-05",
      Cashflow_Event_Reason: "Rebook",
      Booking_System_Event: "Amendment",
    };
    const { container } = render(<DisplayAmendment cashflow={cashflow} />);
    expect(container).toContainHTML("Rebook");
  });
  it("Default Amendment", async () => {
    const cashflow = {
      Cashflow_Id: "M00050052406",
      Cashflow_Business_Version: 0,
      Cashflow_Version: 0,
      Cashflow_State: "WAITING",
      Cashflow_Affirmation_Status: "Unaffirmed",
      Cashflow_Event_Type: "New",
      Cashflow_Minor_Version: 3,
      Payment_Currency: "SGD",
      Payment_Date: "2024-05-24",
      Payment_Type: "",
      Payment_Cutoff_Time: "2024-05-23T11:00Z",
      Pay_Receive_Indicator: "Receive",
      Payment_Amount: "1462785.000000",
      Netting_Id: null,
      Netting_Cuttoff_Date: null,
      Payment_Receiver_Party_Reference: "party1",
      Payment_Payer_Party_Reference: "party2",
      Cashflow_Sub_State: "Pending Operator",
      Cashflow_Sub_State_Type: "Pending Exception",
      Cashflow_Sub_State_Updater: "System",
      Status_Event_Type: "NostroStamped",
      Event_Date: "2023-03-05",
      Cashflow_Event_Reason: "",
      Booking_System_Event: "Amendment",
    };
    render(<DisplayAmendment cashflow={cashflow} />);
    expect(screen).toBeDefined();
  });
});
