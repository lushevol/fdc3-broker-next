import { fireEvent, render, waitFor } from "src/test/test-utils";

import List from "./list";
import { classes } from "./style";

describe("Nostro List Component", () => {
  it("should render MultiExceptions correctly and handle row click/select", async () => {
    const listData = [
      {
        Account: {
          SCB_Nostro_Account_Number: "INO MAIN",
          SCB_Nostro_Account_Type: "NOS",
          Beneficiary_BIC_code: null,
          Beneficiary_Account_Name: null,
          Beneficiary_Account_Name_2: null,
          Beneficiary_Street_Address: null,
          Beneficiary_City: null,
          Beneficiary_Account_Number: null,
          Intermediary_BIC_code: null,
          Intermediary_Account_Name: null,
          Intermediary_Street_Address: null,
          Intermediary_City: null,
          Intermediary_Account_Number: null,
          Beneficiary_Bank_BIC_code: null,
          Beneficiary_Bank_Account_Name: null,
          Beneficiary_Bank_Street_Address: null,
          Beneficiary_Bank_City: null,
          Beneficiary_Bank_Account_Number: null,
          Beneficiary_Correspondent_BIC_code: null,
          Beneficiary_Correspondent_Account_Name: null,
          Beneficiary_Correspondent_Street_Address: null,
          Beneficiary_Correspondent_City: null,
          Beneficiary_Correspondent_Account_Number: null,
          Ordering_Customer_BIC_Code: null,
          Ordering_Customer_Account_Name: null,
          Ordering_Customer_Street_Address: null,
          Ordering_Customer_City: null,
          Ordering_Customer_Account_Number: null,
          Counterparty_CMS_Account_Number: null,
          EBBS_Bridge_Account_Number: null,
          EBBS_Account_Number: "23191235369",
          Booking_Entity_Correspondent_BIC_code: "SCBLINBBXXX",
          Booking_Entity_Correspondent_Account_Name: "SCB MUMBAI MMB",
          Booking_Entity_Correspondent_Street_Address:
            "GLOBAL MARKETS OPERATIONS   90 M G ROAD 1ST FLOOR",
          Booking_Entity_Correspondent_City: "MUMBAI",
          Booking_Entity_Correspondent_Account_Number: "23191235369",
        },
        SSI_Id: null,
        SSI_Unique_Id: "id-CN3-35bb42ab9-d3fc-4968-9ab0-1000010280",
        SSI_Source: null,
        SSI_Priority: null,
        Swift_Message_Type: null,
        CFI_Code: null,
        Payment_Currency: "INO",
        Counterparty_SCI_FMID: null,
        SCB_Entity_SCI_FMID: "4",
        Remittance_Information_1: null,
        Remittance_Information_2: null,
        Remittance_Information_3: null,
        Remittance_Information_4: null,
        Sender_To_Receiver_Information_1: null,
        Sender_To_Receiver_Information_2: null,
        Sender_To_Receiver_Information_3: null,
        Sender_To_Receiver_Information_4: null,
        Sender_To_Receiver_Information_5: null,
        Sender_To_Receiver_Information_6: null,
        Is_Third_Party_Payment: null,
        Swift_Payment_Method: null,
        Swift_Payment_Date: null,
        Charge_Bearer: null,
        Nostro_Swift_Message_Type: "N",
      },
    ];
    const onSelectRecord = jest.fn();
    const { container } = render(
      <List data={listData} onSelectRow={onSelectRecord} />
    );
    // basic render
    expect(container).toBeInTheDocument();

    // find first data row and click it
    const firstRow = container.querySelector("tbody tr.ant-table-row");
    expect(firstRow).toBeTruthy();
    fireEvent.click(firstRow as Element);

    // expect callback called with the record
    await waitFor(() => {
      expect(onSelectRecord).toHaveBeenCalledWith(listData[0]);
    });

    // row should have selected class
    expect(firstRow).toHaveClass(classes.rowSelected);
  });
});
