import { renderHook } from "@testing-library/react";
import { DataGrid } from "Import/ratancomponents";
import { useEffect } from "react";
import defaultPreloadedState from "src/Cashflow_CN/Main/store/state";
import { NetType } from "src/Cashflow_CN/Main/workflow/netCashflow/netCashflowRightMenu";
import { renderWithProviders } from "src/test/test-utils";

import ThemeProvider from "../../../Root/common/component/MfeThemeProvider";
import NetPreviewComponent from "./NetPreviewComponent";

describe("NetPreviewComponent", () => {
  it("should be in the document", () => {
    const props = {
      previewMetrix: [
        {
          originalCashflowList: [
            {
              BCS_Trade_Id: "91786402",
              BCS_Parent_Trade_Id: "91786402",
              FMO_Comments: [
                {
                  FMO_Comment: "Matched rules are: 7198973181699629056",
                  FMO_Comment_Timestamp: "Mon Jun 03 07:24:42 GMT 2024",
                  FMO_Comment_Updater: "System",
                },
                {
                  FMO_Comment: "auto test manual fail",
                  FMO_Comment_Timestamp: "Mon Jun 03 07:24:50 GMT 2024",
                  FMO_Comment_Updater: "1639796",
                },
                {
                  FMO_Comment: "auto test ReInstate",
                  FMO_Comment_Timestamp: "Mon Jun 03 07:24:56 GMT 2024",
                  FMO_Comment_Updater: "1639796",
                },
                {
                  FMO_Comment:
                    "Matched rules are: 7198973182404272128,7198973181699629056",
                  FMO_Comment_Timestamp: "Mon Jun 03 07:24:59 GMT 2024",
                  FMO_Comment_Updater: "System",
                },
              ],
              Cashflow: {
                Cashflow_Id: "000017700731",
                Cashflow_Business_Version: 0,
                Cashflow_Version: 0,
                Cashflow_State: "WAITING",
                Cashflow_Affirmation_Status: "Unaffirmed",
                Cashflow_Event_Type: "New",
                Cashflow_Minor_Version: 11,
                Payment_Currency: "CNO",
                Payment_Date: "2024-06-03",
                Payment_Type: "Cashflow",
                Payment_Cutoff_Time: "2024-05-31T00:30Z",
                Pay_Receive_Indicator: "Pay",
                Payment_Amount: "0.01",
                Netting_Id: null,
                Netting_Cuttoff_Date: null,
                Payment_Receiver_Party_Reference: "party2",
                Payment_Payer_Party_Reference: "party1",
                Cashflow_Sub_State: "Pending Operator",
                Cashflow_Sub_State_Type: "Pending Exception",
                Cashflow_Sub_State_Updater: "System",
                Status_Event_Type: "SsiStamped",
                Event_Date: "2024-01-03",
                Cashflow_Event_Reason: "",
              },
              Delivery_Method: "",
              Settlement_Method: "",
              Trade_Id: "91786402",
              Trade_Version: 0,
              Entity: {
                Booking_Entity_SCI_FMID: "400085753",
                Booking_Entity_SCI_FMCODE: "SCB CN HANGZHOU*HNZ",
                Counterparty_SCI_FMID: "400899993",
                Counterparty_SCI_FMCODE: "SCB CN CHO*CHO",
              },
              Instrument_Common: {
                ISDA_Taxonomy: "COM|SWAP",
                Source_System_Instrument_Sub_Type: "",
              },
              Parent_Trade_Id: "91786402",
              Trade_State: "CONFIRMED",
              Portfolio: {
                Booking_Entity_Trade_Portfolio_Name: "BTB-SHANGHAI-IR-STL",
              },
            },
            {
              BCS_Trade_Id: "97278358",
              BCS_Parent_Trade_Id: "97278358",
              FMO_Comments: [
                {
                  FMO_Comment: "Matched rules are: 7198973181699629056",
                  FMO_Comment_Timestamp: "Mon Jun 03 07:24:24 GMT 2024",
                  FMO_Comment_Updater: "System",
                },
              ],
              Cashflow: {
                Cashflow_Id: "000017700730",
                Cashflow_Business_Version: 0,
                Cashflow_Version: 0,
                Cashflow_State: "WAITING",
                Cashflow_Affirmation_Status: "Unaffirmed",
                Cashflow_Event_Type: "New",
                Cashflow_Minor_Version: 3,
                Payment_Currency: "CNO",
                Payment_Date: "2024-06-03",
                Payment_Type: "UpfrontFee",
                Payment_Cutoff_Time: "2024-05-31T00:30Z",
                Pay_Receive_Indicator: "Pay",
                Payment_Amount: "0.01",
                Netting_Id: null,
                Netting_Cuttoff_Date: null,
                Payment_Receiver_Party_Reference: "party2",
                Payment_Payer_Party_Reference: "party1",
                Cashflow_Sub_State: "Pending Operator",
                Cashflow_Sub_State_Type: "Pending Exception",
                Cashflow_Sub_State_Updater: "System",
                Status_Event_Type: "SsiStamped",
                Event_Date: "2024-01-03",
                Cashflow_Event_Reason: "",
              },
              Delivery_Method: "",
              Settlement_Method: "",
              Trade_Id: "97278358",
              Trade_Version: 0,
              Entity: {
                Booking_Entity_SCI_FMID: "400085753",
                Booking_Entity_SCI_FMCODE: "SCB CN HANGZHOU*HNZ",
                Counterparty_SCI_FMID: "400899993",
                Counterparty_SCI_FMCODE: "SCB CN CHO*CHO",
              },
              Instrument_Common: {
                ISDA_Taxonomy: "COM|SWAP",
                Source_System_Instrument_Sub_Type: "",
              },
              Parent_Trade_Id: "97278358",
              Trade_State: "CONFIRMED",
              Portfolio: {
                Booking_Entity_Trade_Portfolio_Name: "BTB-SHANGHAI-IR-STL",
              },
            },
          ],
          previewCashflowList: [],
          errorMsg: null,
          valid: true,
        },
        {
          originalCashflowList: [],
          previewCashflowList: [],
          errorMsg: null,
          valid: true,
        },
      ],
      proceedPreviewing: true,
      nettingResult: {
        netting: [
          {
            BCS_Trade_Id: null,
            BCS_Parent_Trade_Id: "",
            FMO_Comments: [
              {
                FMO_Comment:
                  "Matched rules are: 7198973182131642368,7198973182953725952",
                FMO_Comment_Timestamp: "Mon Jun 03 08:08:37 GMT 2024",
                FMO_Comment_Updater: "System",
              },
            ],
            Cashflow: {
              Cashflow_Id: "N00000001438",
              Cashflow_Business_Version: 0,
              Cashflow_State: "WAITING",
              Cashflow_Affirmation_Status: "Affirmed",
              Cashflow_Event_Type: "New",
              Cashflow_Minor_Version: 2,
              Payment_Currency: "CNO",
              Payment_Date: "2024-06-03",
              Payment_Type: "netAmount",
              Payment_Cutoff_Time: "2024-05-31T00:30Z",
              Pay_Receive_Indicator: "Pay",
              Payment_Amount: "0.0200",
              Netting_Id: "7a450a13-2180-11ef-8bba-005056acac40",
              Netting_Cuttoff_Date: null,
              Payment_Receiver_Party_Reference: "party2",
              Payment_Payer_Party_Reference: "party1",
              Cashflow_Sub_State: "Pending Verification",
              Cashflow_Sub_State_Type: "Pending Exception",
              Cashflow_Sub_State_Updater: "System",
              Status_Event_Type: "SsiStamped",
              Event_Date: "2024-06-03",
              Cashflow_Event_Reason: "",
            },
            Delivery_Method: "Cash",
            Settlement_Method: "Gross",
            Trade_Id: "",
            Trade_Version: 0,
            Entity: {
              Booking_Entity_SCI_FMID: "400085753",
              Booking_Entity_SCI_FMCODE: "SCB CN HANGZHOU*HNZ",
              Counterparty_SCI_FMID: "400899993",
              Counterparty_SCI_FMCODE: "SCB CN CHO*CHO",
            },
            Instrument_Common: {
              ISDA_Taxonomy: "COM|SWAP",
              Source_System_Instrument_Sub_Type: "",
              CFI_Code: "STXXXX",
            },
            Parent_Trade_Id: "",
            Trade_State: "",
            Portfolio: {
              Booking_Entity_Trade_Portfolio_Name: "BTB-SHANGHAI-IR-STL",
            },
            Data_Flow: {
              Data_Source_System: "Ratan",
              Data_Publication_Date_Time: "2024-06-03T08:08:36Z",
            },
          },
          {
            BCS_Trade_Id: "91786402",
            BCS_Parent_Trade_Id: "91786402",
            FMO_Comments: [
              {
                FMO_Comment: "Matched rules are: 7198973181699629056",
                FMO_Comment_Timestamp: "Mon Jun 03 07:24:42 GMT 2024",
                FMO_Comment_Updater: "System",
              },
              {
                FMO_Comment: "auto test manual fail",
                FMO_Comment_Timestamp: "Mon Jun 03 07:24:50 GMT 2024",
                FMO_Comment_Updater: "1639796",
              },
              {
                FMO_Comment: "auto test ReInstate",
                FMO_Comment_Timestamp: "Mon Jun 03 07:24:56 GMT 2024",
                FMO_Comment_Updater: "1639796",
              },
              {
                FMO_Comment:
                  "Matched rules are: 7198973182404272128,7198973181699629056",
                FMO_Comment_Timestamp: "Mon Jun 03 07:24:59 GMT 2024",
                FMO_Comment_Updater: "System",
              },
            ],
            Cashflow: {
              Cashflow_Id: "000017700731",
              Cashflow_Business_Version: 0,
              Cashflow_State: "NETTED",
              Cashflow_Affirmation_Status: "Unaffirmed",
              Cashflow_Event_Type: "New",
              Cashflow_Minor_Version: 12,
              Payment_Currency: "CNO",
              Payment_Date: "2024-06-03",
              Payment_Type: "Cashflow",
              Payment_Cutoff_Time: "2024-05-31T00:30Z",
              Pay_Receive_Indicator: "Pay",
              Payment_Amount: "0.01",
              Netting_Id: "7a450a13-2180-11ef-8bba-005056acac40",
              Netting_Cuttoff_Date: null,
              Payment_Receiver_Party_Reference: "party2",
              Payment_Payer_Party_Reference: "party1",
              Cashflow_Sub_State: "NA",
              Cashflow_Sub_State_Type: "NA",
              Cashflow_Sub_State_Updater: "1639796",
              Status_Event_Type: "SsiStamped",
              Event_Date: "2024-01-03",
              Cashflow_Event_Reason: "",
            },
            Delivery_Method: "",
            Settlement_Method: "",
            Trade_Id: "91786402",
            Trade_Version: 0,
            Entity: {
              Booking_Entity_SCI_FMID: "400085753",
              Booking_Entity_SCI_FMCODE: "SCB CN HANGZHOU*HNZ",
              Counterparty_SCI_FMID: "400899993",
              Counterparty_SCI_FMCODE: "SCB CN CHO*CHO",
            },
            Instrument_Common: {
              ISDA_Taxonomy: "COM|SWAP",
              Source_System_Instrument_Sub_Type: "",
              CFI_Code: "STXXXX",
            },
            Parent_Trade_Id: "91786402",
            Trade_State: "CONFIRMED",
            Portfolio: {
              Booking_Entity_Trade_Portfolio_Name: "BTB-SHANGHAI-IR-STL",
            },
            Data_Flow: {
              Data_Source_System: "Stella",
              Data_Publication_Date_Time: "2024-01-03T10:18:31Z",
            },
          },
          {
            BCS_Trade_Id: "97278358",
            BCS_Parent_Trade_Id: "97278358",
            FMO_Comments: [
              {
                FMO_Comment: "Matched rules are: 7198973181699629056",
                FMO_Comment_Timestamp: "Mon Jun 03 07:24:24 GMT 2024",
                FMO_Comment_Updater: "System",
              },
            ],
            Cashflow: {
              Cashflow_Id: "000017700730",
              Cashflow_Business_Version: 0,
              Cashflow_State: "NETTED",
              Cashflow_Affirmation_Status: "Unaffirmed",
              Cashflow_Event_Type: "New",
              Cashflow_Minor_Version: 4,
              Payment_Currency: "CNO",
              Payment_Date: "2024-06-03",
              Payment_Type: "UpfrontFee",
              Payment_Cutoff_Time: "2024-05-31T00:30Z",
              Pay_Receive_Indicator: "Pay",
              Payment_Amount: "0.01",
              Netting_Id: "7a450a13-2180-11ef-8bba-005056acac40",
              Netting_Cuttoff_Date: null,
              Payment_Receiver_Party_Reference: "party2",
              Payment_Payer_Party_Reference: "party1",
              Cashflow_Sub_State: "NA",
              Cashflow_Sub_State_Type: "NA",
              Cashflow_Sub_State_Updater: "1639796",
              Status_Event_Type: "SsiStamped",
              Event_Date: "2024-01-03",
              Cashflow_Event_Reason: "",
            },
            Delivery_Method: "",
            Settlement_Method: "",
            Trade_Id: "97278358",
            Trade_Version: 0,
            Entity: {
              Booking_Entity_SCI_FMID: "400085753",
              Booking_Entity_SCI_FMCODE: "SCB CN HANGZHOU*HNZ",
              Counterparty_SCI_FMID: "400899993",
              Counterparty_SCI_FMCODE: "SCB CN CHO*CHO",
            },
            Instrument_Common: {
              ISDA_Taxonomy: "COM|SWAP",
              Source_System_Instrument_Sub_Type: "",
              CFI_Code: "STXXXX",
            },
            Parent_Trade_Id: "97278358",
            Trade_State: "CONFIRMED",
            Portfolio: {
              Booking_Entity_Trade_Portfolio_Name: "BTB-SHANGHAI-IR-STL",
            },
            Data_Flow: {
              Data_Source_System: "Stella",
              Data_Publication_Date_Time: "2024-01-03T10:18:31Z",
            },
          },
        ],
        single: [],
        valid: [
          {
            id: "000017700731",
            Data_Flow: {
              Data_Source_System: "Stella",
              Data_Publication_Date_Time: "2024-01-03T10:18:31",
            },
            Cashflow: {
              Cashflow_Id: "000017700731",
              Cashflow_State: "WAITING",
              Cashflow_Sub_State: "Pending Operator",
              Cashflow_Sub_State_Type: "Pending Exception",
              Cashflow_Business_Version: 0,
              Cashflow_Minor_Version: 11,
              Netting_Id: null,
              Cashflow_Event_Type: "New",
              Payment_Date: "2024-06-03",
              Payment_Amount: "0.01",
              Payment_Currency: "CNO",
              Pay_Receive_Indicator: "Pay",
              Payment_Type: "Cashflow",
            },
            Entity: {
              Booking_Entity_SCI_FMID: "400085753",
              Counterparty_SCI_FMID: "400899993",
              Counterparty_SCI_FMCODE: "SCB CN CHO*CHO",
              Booking_Entity_SCI_FMCODE: "SCB CN HANGZHOU*HNZ",
            },
            Instrument_Common: {
              Source_System_Instrument_Sub_Type: "",
              CFI_Code: "STXXXX",
              ISDA_Taxonomy: "COM|SWAP",
            },
          },
          {
            id: "000017700730",
            Data_Flow: {
              Data_Source_System: "Stella",
              Data_Publication_Date_Time: "2024-01-03T10:18:31",
            },
            Cashflow: {
              Cashflow_Id: "000017700730",
              Cashflow_State: "WAITING",
              Cashflow_Sub_State: "Pending Operator",
              Cashflow_Sub_State_Type: "Pending Exception",
              Cashflow_Business_Version: 0,
              Cashflow_Minor_Version: 3,
              Netting_Id: null,
              Cashflow_Event_Type: "New",
              Payment_Date: "2024-06-03",
              Payment_Amount: "0.01",
              Payment_Currency: "CNO",
              Pay_Receive_Indicator: "Pay",
              Payment_Type: "UpfrontFee",
            },
            Entity: {
              Booking_Entity_SCI_FMID: "400085753",
              Counterparty_SCI_FMID: "400899993",
              Counterparty_SCI_FMCODE: "SCB CN CHO*CHO",
              Booking_Entity_SCI_FMCODE: "SCB CN HANGZHOU*HNZ",
            },
            Instrument_Common: {
              Source_System_Instrument_Sub_Type: "",
              CFI_Code: "STXXXX",
              ISDA_Taxonomy: "COM|SWAP",
            },
          },
        ],
        failed: [],
      },
    };
    jest.mocked(DataGrid).mockImplementation((props) => {
      const { onGridReady } = props;
      const params = {
        api: {
          setGridOption: jest.fn(),
          setRowData: jest.fn(),
          setColumnVisible: jest.fn()
        },
      };
      useEffect(() => {
        onGridReady?.(params);
      }, []);
      return <section data-testid="mocked-datagrid"></section>;
    });
    const { result } = renderHook(() =>
      renderWithProviders(
        <ThemeProvider>
          <NetPreviewComponent
            previewMetrix={props.previewMetrix}
            proceedPreviewing={props.proceedPreviewing}
            nettingResult={props.nettingResult}
            netType={NetType.BilateralNetting}
          />
        </ThemeProvider>,
        {
          preloadedState: defaultPreloadedState,
        }
      )
    );
    expect(result.current).toBeDefined();
  });
  it("handle differences netting results", () => {
    const props = {
      previewMetrix: [
        {
          originalCashflowList: [
            {
              BCS_Trade_Id: "91786402",
              BCS_Parent_Trade_Id: "91786402",
              FMO_Comments: [
                {
                  FMO_Comment: "Matched rules are: 7198973181699629056",
                  FMO_Comment_Timestamp: "Mon Jun 03 07:24:42 GMT 2024",
                  FMO_Comment_Updater: "System",
                },
                {
                  FMO_Comment: "auto test manual fail",
                  FMO_Comment_Timestamp: "Mon Jun 03 07:24:50 GMT 2024",
                  FMO_Comment_Updater: "1639796",
                },
                {
                  FMO_Comment: "auto test ReInstate",
                  FMO_Comment_Timestamp: "Mon Jun 03 07:24:56 GMT 2024",
                  FMO_Comment_Updater: "1639796",
                },
                {
                  FMO_Comment:
                    "Matched rules are: 7198973182404272128,7198973181699629056",
                  FMO_Comment_Timestamp: "Mon Jun 03 07:24:59 GMT 2024",
                  FMO_Comment_Updater: "System",
                },
              ],
              Cashflow: {
                Cashflow_Id: "000017700731",
                Cashflow_Business_Version: 0,
                Cashflow_Version: 0,
                Cashflow_State: "WAITING",
                Cashflow_Affirmation_Status: "Unaffirmed",
                Cashflow_Event_Type: "New",
                Cashflow_Minor_Version: 11,
                Payment_Currency: "CNO",
                Payment_Date: "2024-06-03",
                Payment_Type: "Cashflow",
                Payment_Cutoff_Time: "2024-05-31T00:30Z",
                Pay_Receive_Indicator: "Pay",
                Payment_Amount: "0.01",
                Netting_Id: null,
                Netting_Cuttoff_Date: null,
                Payment_Receiver_Party_Reference: "party2",
                Payment_Payer_Party_Reference: "party1",
                Cashflow_Sub_State: "Pending Operator",
                Cashflow_Sub_State_Type: "Pending Exception",
                Cashflow_Sub_State_Updater: "System",
                Status_Event_Type: "SsiStamped",
                Event_Date: "2024-01-03",
                Cashflow_Event_Reason: "",
              },
              Delivery_Method: "",
              Settlement_Method: "",
              Trade_Id: "91786402",
              Trade_Version: 0,
              Entity: {
                Booking_Entity_SCI_FMID: "400085753",
                Booking_Entity_SCI_FMCODE: "SCB CN HANGZHOU*HNZ",
                Counterparty_SCI_FMID: "400899993",
                Counterparty_SCI_FMCODE: "SCB CN CHO*CHO",
              },
              Instrument_Common: {
                ISDA_Taxonomy: "COM|SWAP",
                Source_System_Instrument_Sub_Type: "",
              },
              Parent_Trade_Id: "91786402",
              Trade_State: "CONFIRMED",
              Portfolio: {
                Booking_Entity_Trade_Portfolio_Name: "BTB-SHANGHAI-IR-STL",
              },
            },
            {
              BCS_Trade_Id: "97278358",
              BCS_Parent_Trade_Id: "97278358",
              FMO_Comments: [
                {
                  FMO_Comment: "Matched rules are: 7198973181699629056",
                  FMO_Comment_Timestamp: "Mon Jun 03 07:24:24 GMT 2024",
                  FMO_Comment_Updater: "System",
                },
              ],
              Cashflow: {
                Cashflow_Id: "000017700730",
                Cashflow_Business_Version: 0,
                Cashflow_Version: 0,
                Cashflow_State: "WAITING",
                Cashflow_Affirmation_Status: "Unaffirmed",
                Cashflow_Event_Type: "New",
                Cashflow_Minor_Version: 3,
                Payment_Currency: "CNO",
                Payment_Date: "2024-06-03",
                Payment_Type: "UpfrontFee",
                Payment_Cutoff_Time: "2024-05-31T00:30Z",
                Pay_Receive_Indicator: "Pay",
                Payment_Amount: "0.01",
                Netting_Id: null,
                Netting_Cuttoff_Date: null,
                Payment_Receiver_Party_Reference: "party2",
                Payment_Payer_Party_Reference: "party1",
                Cashflow_Sub_State: "Pending Operator",
                Cashflow_Sub_State_Type: "Pending Exception",
                Cashflow_Sub_State_Updater: "System",
                Status_Event_Type: "SsiStamped",
                Event_Date: "2024-01-03",
                Cashflow_Event_Reason: "",
              },
              Delivery_Method: "",
              Settlement_Method: "",
              Trade_Id: "97278358",
              Trade_Version: 0,
              Entity: {
                Booking_Entity_SCI_FMID: "400085753",
                Booking_Entity_SCI_FMCODE: "SCB CN HANGZHOU*HNZ",
                Counterparty_SCI_FMID: "400899993",
                Counterparty_SCI_FMCODE: "SCB CN CHO*CHO",
              },
              Instrument_Common: {
                ISDA_Taxonomy: "COM|SWAP",
                Source_System_Instrument_Sub_Type: "",
              },
              Parent_Trade_Id: "97278358",
              Trade_State: "CONFIRMED",
              Portfolio: {
                Booking_Entity_Trade_Portfolio_Name: "BTB-SHANGHAI-IR-STL",
              },
            },
          ],
          previewCashflowList: [
            {
              id: "000017700731",
              Cashflow: {
                Cashflow_Id: "000017700731",
                Cashflow_State: "WAITING",
                Cashflow_Sub_State: "Pending Operator",
                Cashflow_Sub_State_Type: "Pending Exception",
                Cashflow_Business_Version: 0,
                Cashflow_Minor_Version: 11,
                Netting_Id: null,
                Cashflow_Event_Type: "New",
                Payment_Date: "2024-06-03",
                Payment_Amount: "0.01",
                Payment_Currency: "CNO",
                Pay_Receive_Indicator: "Pay",
                Payment_Type: "Cashflow",
              },
            },
          ],
          errorMsg: null,
          valid: true,
        },
        {
          originalCashflowList: [],
          previewCashflowList: [],
          errorMsg: null,
          valid: true,
        },
      ],
      proceedPreviewing: true,
      nettingResult: {
        netting: [
          {
            Cashflow: {},
            Delivery_Method: "Cash",
            Settlement_Method: "Gross",
            Trade_Id: "",
            Trade_Version: 0,
          },
          {
            Cashflow: {},
            Delivery_Method: "",
            Settlement_Method: "",
            Trade_Id: "91786402",
            Trade_Version: 0,
          },
        ],
        single: [
          {
            id: "000017700731",
            Cashflow: {
              Cashflow_Id: "000017700731",
              Cashflow_State: "WAITING",
              Cashflow_Sub_State: "Pending Operator",
              Cashflow_Sub_State_Type: "Pending Exception",
              Cashflow_Business_Version: 0,
              Cashflow_Minor_Version: 11,
              Netting_Id: null,
              Cashflow_Event_Type: "New",
              Payment_Date: "2024-06-03",
              Payment_Amount: "0.01",
              Payment_Currency: "CNO",
              Pay_Receive_Indicator: "Pay",
              Payment_Type: "Cashflow",
            },
          },
        ],
        valid: [
          {
            id: "000017700731",
            Cashflow: {
              Cashflow_Id: "000017700731",
              Cashflow_State: "WAITING",
              Cashflow_Sub_State: "Pending Operator",
              Cashflow_Sub_State_Type: "Pending Exception",
              Cashflow_Business_Version: 0,
              Cashflow_Minor_Version: 11,
              Netting_Id: null,
              Cashflow_Event_Type: "New",
              Payment_Date: "2024-06-03",
              Payment_Amount: "0.01",
              Payment_Currency: "CNO",
              Pay_Receive_Indicator: "Pay",
              Payment_Type: "Cashflow",
            },
          },
          {
            id: "000017700730",
            Cashflow: {
              Cashflow_Id: "000017700730",
              Cashflow_State: "WAITING",
              Cashflow_Sub_State: "Pending Operator",
              Cashflow_Sub_State_Type: "Pending Exception",
              Cashflow_Business_Version: 0,
              Cashflow_Minor_Version: 3,
              Netting_Id: null,
              Cashflow_Event_Type: "New",
              Payment_Date: "2024-06-03",
              Payment_Amount: "0.01",
              Payment_Currency: "CNO",
              Pay_Receive_Indicator: "Pay",
              Payment_Type: "UpfrontFee",
            }
          },
        ],
        failed: [
          {
            id: "000017700731",
            Cashflow: {
              Cashflow_Id: "000017700731",
              Cashflow_State: "WAITING",
              Cashflow_Sub_State: "Pending Operator",
              Cashflow_Sub_State_Type: "Pending Exception",
              Cashflow_Business_Version: 0,
              Cashflow_Minor_Version: 11,
              Netting_Id: null,
              Cashflow_Event_Type: "New",
              Payment_Date: "2024-06-03",
              Payment_Amount: "0.01",
              Payment_Currency: "CNO",
              Pay_Receive_Indicator: "Pay",
              Payment_Type: "Cashflow",
            },
          },
        ],
      },
    };
    jest.mocked(DataGrid).mockImplementation((props) => {
      const { onGridReady } = props;
      const params = {
        api: {
          setGridOption: jest.fn(),
          setRowData: jest.fn(),
          setColumnVisible: jest.fn()
        },
      };
      useEffect(() => {
        onGridReady?.(params);
      }, []);
      return <section data-testid="mocked-datagrid"></section>;
    });
    const { result } = renderHook(() =>
      renderWithProviders(
        <ThemeProvider>
          <NetPreviewComponent
            previewMetrix={props.previewMetrix}
            proceedPreviewing={props.proceedPreviewing}
            nettingResult={props.nettingResult}
            netType={NetType.BilateralNetting}
          />
        </ThemeProvider>,
        {
          preloadedState: defaultPreloadedState,
        }
      )
    );
    expect(result.current).toBeDefined();
  });
});
