import cloneDeep from "lodash/cloneDeep";
import _merge from "lodash/merge";

import CashflowNotificationPool from "./CashflowNotificationPool";

const exampleCashflow = {
  BCS_Trade_Id: "1816352",
  BCS_Parent_Trade_Id: "1816352",
  FMO_Comments: null,
  Cashflow: {
    Cashflow_Id: "008690236385",
    Cashflow_Business_Version: "0",
    Cashflow_Version: 0,
    Cashflow_State: "WAITING",
    Cashflow_Affirmation_Status: "affirmed",
    Cashflow_Event_Type: "New",
    Cashflow_Minor_Version: "4",
    Payment_Currency: "USD",
    Payment_Date: "2022-03-11",
    Payment_Type: "netAmount",
    Payment_Cutoff_Time: "2022-03-10T00:00",
    Pay_Receive_Indicator: "Pay",
    Payment_Amount: "1000",
    Netting_Id: "",
    Netting_Cuttoff_Date: "null",
    Payment_Receiver_Party_Reference: "party2",
    Payment_Payer_Party_Reference: "party1",
    Cashflow_Sub_State: "Pending Verification",
    Cashflow_Sub_State_Type: "Pending Exception",
    Cashflow_Sub_State_Updater: "1470797",
    Status_Event_Type: "",
    Event_Date: "2022-10-20",
  },
  Delivery_Method: "",
  Settlement_Method: "Cash",
  Trade_Id: "1816352",
  Trade_Version: 0,
  Entity: {
    Booking_Entity_SCI_FMID: "10075222",
    Booking_Entity_SCI_FMCODE: null,
    Counterparty_SCI_FMID: "400640613",
    Counterparty_SCI_FMCODE: null,
  },
  Parent_Trade_Id: "1816352",
  Trade_State: "VALIDATED",
  Portfolio: {
    Booking_Entity_Trade_Portfolio_Name: "BCS_FSS_UK_BTBLTQ",
  },
};

export const mockNotificationFlow = async (
  pool: CashflowNotificationPool<CNCashflow>
) => {
  pool.add(
    _merge(cloneDeep(exampleCashflow), {
      Cashflow: { Cashflow_Id: "1111111111" },
    })
  );
  await new Promise((r) => setTimeout(r, 5000));
  pool.add(
    _merge(cloneDeep(exampleCashflow), {
      Cashflow: { Cashflow_Id: "003796289958", Cashflow_Business_Version: "1" },
    })
  );
  await new Promise((r) => setTimeout(r, 5000));
  pool.add(
    _merge(cloneDeep(exampleCashflow), {
      Cashflow: { Cashflow_Business_Version: "1" },
    })
  );
  await new Promise((r) => setTimeout(r, 5000));
  pool.add(
    _merge(cloneDeep(exampleCashflow), {
      Cashflow: { Cashflow_Business_Version: "2" },
    })
  );
  await new Promise((r) => setTimeout(r, 5000));
  pool.add(
    _merge(cloneDeep(exampleCashflow), {
      Cashflow: { Cashflow_Business_Version: "3" },
    })
  );
  await new Promise((r) => setTimeout(r, 5000));
  pool.add(
    _merge(cloneDeep(exampleCashflow), {
      Cashflow: { Cashflow_Business_Version: "3" },
    })
  );
};
