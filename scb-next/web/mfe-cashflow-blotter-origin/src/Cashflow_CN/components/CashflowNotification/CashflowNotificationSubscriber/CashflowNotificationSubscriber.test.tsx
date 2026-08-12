  import { matchFilters } from "./graphqlFilterMatcher";
  
  afterAll(() => {
    vi.clearAllMocks();
  });
  
  // describe("Test Cashflow Notification Subscriber Pool", () => {
  //   it("should work as expected", async () => {
  //     const callback = vi.fn();
  //     const pool = new CashflowNotificationPool<CNCashflow>({
  //         holdingTime: 5000,
  //         recordKey: "Cashflow.Cashflow_Id"
  //     });
  //     pool.subscribe(callback);
  //     await mockNotificationFlow(pool);
  
  //     expect(callback).toHaveBeenCalled();
  //     pool.destory();
  //   });
  // });
  
  describe("Graphql Filter Matcher", () => {
    it("should work as expected", async () => {
      const cashflowDatas: CNCashflow[] = [
        {
          Cashflow: {
            Cashflow_Id: "092023041385",
            Cashflow_Business_Version: 0,
            Cashflow_Version: 0,
            Cashflow_State: "WAITING",
            Cashflow_Affirmation_Status: "Unaffirmed",
            Cashflow_Event_Type: "New",
            Cashflow_Minor_Version: 3,
            Payment_Currency: "USD",
            Payment_Date: "2023-04-10",
            Payment_Type: "netAmount",
            Payment_Cutoff_Time: "2023-04-07T00:00",
            Pay_Receive_Indicator: "Receive",
            Payment_Amount: "1001",
            Netting_Id: null,
            Netting_Cuttoff_Date: "null",
            Payment_Receiver_Party_Reference: "party1",
            Payment_Payer_Party_Reference: "party2",
            Cashflow_Sub_State: "Pending Operator",
            Cashflow_Sub_State_Type: "Pending Exception",
            Cashflow_Sub_State_Updater: null,
            Status_Event_Type: "",
            Event_Date: "2023-04-10",
          },
          Delivery_Method: "",
          Settlement_Method: "",
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
        },
        {
          Cashflow: {
            Cashflow_Id: "092023041384",
            Cashflow_Business_Version: 0,
            Cashflow_Version: 0,
            Cashflow_State: "READY",
            Cashflow_Affirmation_Status: "Affirmed",
            Cashflow_Event_Type: "New",
            Cashflow_Minor_Version: 7,
            Payment_Currency: "USD",
            Payment_Date: "2023-04-10",
            Payment_Type: "netAmount",
            Payment_Cutoff_Time: "2023-04-07T00:00",
            Pay_Receive_Indicator: "Receive",
            Payment_Amount: "1001",
            Netting_Id: null,
            Netting_Cuttoff_Date: "null",
            Payment_Receiver_Party_Reference: "party1",
            Payment_Payer_Party_Reference: "party2",
            Cashflow_Sub_State: "NA",
            Cashflow_Sub_State_Type: "NA",
            Cashflow_Sub_State_Updater: "1481696",
            Status_Event_Type: "",
            Event_Date: "2023-04-10",
          },
          Delivery_Method: "",
          Settlement_Method: "",
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
        },
      ];
      const filters = [
        {
          field: "Cashflow.Cashflow_Sub_State",
          operator: "NE",
          values: ["NA"],
        },
        {
          field: "Cashflow.Cashflow_Id",
          operator: "LIKE",
          values: "09",
        },
        {
          field: "Cashflow.Payment_Date",
          operator: "BET",
          values: ["2023-01-10", "2023-05-10"],
        },
        {
          field: "Cashflow.Event_Date",
          operator: "ONORBEFORE",
          values: "2023-05-10",
        },
        {
          field: "Cashflow.Payment_Cutoff_Time",
          operator: "ONORLATER",
          values: "2023-03-10",
        },
        {
          field: "Cashflow.Cashflow_Minor_Version",
          operator: "LTE",
          values: 3,
        },
        {
          field: "Trade_Version",
          operator: "GTE",
          values: 0,
        },
        {
          field: "Cashflow.Cashflow_Affirmation_Status",
          operator: "IN",
          values: ["Affirmed", "Unaffirmed"],
        },
        {
          field: "Cashflow.Cashflow_State",
          operator: "NOTIN",
          values: ["NETTED", "DEAD", "READY"],
        },
      ];
  
      const result = matchFilters<CNCashflow>(cashflowDatas, filters);
      expect(result.length).toBe(2);
    });
  });
  
  // describe("Cashflow Notification Subscriber Component", () => {
  //     it("should be in the document", async () => {
  //         const cashflowCommingHandler = vi.fn();
  //         const { container } = render(<CashflowNotification  onCashflowComming={cashflowCommingHandler} />);
  //         expect(container).not.toBeEmptyDOMElement();
  //     });
  // });
  
  // describe("Cashflow Notification Subscriber Utils", () => {
  //     it("should work as expected", async () => {
  //         const mockCashflow1: CNCashflow = {
  //             "Cashflow": {
  //                 "Cashflow_Id": "092023041384",
  //                 "Cashflow_Business_Version": 0,
  //                 "Cashflow_Version": 0,
  //                 "Cashflow_State": "READY",
  //                 "Cashflow_Affirmation_Status": "Affirmed",
  //                 "Cashflow_Event_Type": "New",
  //                 "Cashflow_Minor_Version": 7,
  //                 "Payment_Currency": "USD",
  //                 "Payment_Date": "2023-04-10",
  //                 "Payment_Type": "netAmount",
  //                 "Payment_Cutoff_Time": "2023-04-07T00:00",
  //                 "Pay_Receive_Indicator": "Receive",
  //                 "Payment_Amount": "1001",
  //                 "Netting_Id": null,
  //                 "Netting_Cuttoff_Date": "null",
  //                 "Payment_Receiver_Party_Reference": "party1",
  //                 "Payment_Payer_Party_Reference": "party2",
  //                 "Cashflow_Sub_State": "NA",
  //                 "Cashflow_Sub_State_Type": "NA",
  //                 "Cashflow_Sub_State_Updater": "1481696",
  //                 "Status_Event_Type": "",
  //                 "Event_Date": "2023-04-10"
  //             },
  //             "Delivery_Method": "",
  //             "Settlement_Method": "",
  //             "Trade_Id": "1816352",
  //             "Trade_Version": 0,
  //             "Entity": {
  //                 "Booking_Entity_SCI_FMID": "10075222",
  //                 "Booking_Entity_SCI_FMCODE": null,
  //                 "Counterparty_SCI_FMID": "400640613",
  //                 "Counterparty_SCI_FMCODE": null
  //             },
  //             "Parent_Trade_Id": "1816352",
  //             "Trade_State": "VALIDATED",
  //             "Portfolio": {
  //                 "Booking_Entity_Trade_Portfolio_Name": "BCS_FSS_UK_BTBLTQ"
  //             }
  //         };
  //         const mockCashflow2: CNCashflow = {
  //             "Cashflow": {
  //                 "Cashflow_Id": "092023041384",
  //                 "Cashflow_Business_Version": 0,
  //                 "Cashflow_Version": 0,
  //                 "Cashflow_State": "READY",
  //                 "Cashflow_Affirmation_Status": "Affirmed",
  //                 "Cashflow_Event_Type": "New",
  //                 "Cashflow_Minor_Version": 8,
  //                 "Payment_Currency": "USD",
  //                 "Payment_Date": "2023-04-10",
  //                 "Payment_Type": "netAmount",
  //                 "Payment_Cutoff_Time": "2023-04-07T00:00",
  //                 "Pay_Receive_Indicator": "Receive",
  //                 "Payment_Amount": "1001",
  //                 "Netting_Id": null,
  //                 "Netting_Cuttoff_Date": "null",
  //                 "Payment_Receiver_Party_Reference": "party1",
  //                 "Payment_Payer_Party_Reference": "party2",
  //                 "Cashflow_Sub_State": "NA",
  //                 "Cashflow_Sub_State_Type": "NA",
  //                 "Cashflow_Sub_State_Updater": "1481696",
  //                 "Status_Event_Type": "",
  //                 "Event_Date": "2023-04-10"
  //             },
  //             "Delivery_Method": "",
  //             "Settlement_Method": "",
  //             "Trade_Id": "1816352",
  //             "Trade_Version": 0,
  //             "Entity": {
  //                 "Booking_Entity_SCI_FMID": "10075222",
  //                 "Booking_Entity_SCI_FMCODE": null,
  //                 "Counterparty_SCI_FMID": "400640613",
  //                 "Counterparty_SCI_FMCODE": null
  //             },
  //             "Parent_Trade_Id": "1816352",
  //             "Trade_State": "VALIDATED",
  //             "Portfolio": {
  //                 "Booking_Entity_Trade_Portfolio_Name": "BCS_FSS_UK_BTBLTQ"
  //             }
  //         };
  //         expect(isSameCashflow(mockCashflow1, mockCashflow2)).toBe(true);
  //         expect(isCashflowUpdated(mockCashflow1, mockCashflow2)).toBe(true);
  //         expect(areAllNotifiedCashflows([mockCashflow1])).toBe(false);
  //     });
  // });
  