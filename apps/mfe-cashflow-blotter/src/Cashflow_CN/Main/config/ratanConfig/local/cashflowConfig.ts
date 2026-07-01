const config = {
  cashflowSettlementMandatoryFields: [
    "BCS_Trade_Id",
    "BCS_Parent_Trade_Id",
    "FMO_Comments.FMO_Comment",
    "FMO_Comments.FMO_Comment_Timestamp",
    "FMO_Comments.FMO_Comment_Updater",
    "Cashflow.Cashflow_Id",
    "Cashflow.Cashflow_Business_Version",
    "Cashflow.Cashflow_Version",
    "Cashflow.Cashflow_State",
    "Cashflow.Cashflow_Affirmation_Status",
    "Cashflow.Cashflow_Event_Type",
    "Cashflow.Cashflow_Minor_Version",
    "Cashflow.Payment_Currency",
    "Cashflow.Payment_Date",
    "Cashflow.Payment_Type",
    "Cashflow.Payment_Cutoff_Time",
    "Cashflow.Pay_Receive_Indicator",
    "Cashflow.Payment_Amount",
    "Cashflow.Netting_Id",
    "Cashflow.Splitting_Id",
    "Cashflow.Netting_Cuttoff_Date",
    "Cashflow.Payment_Receiver_Party_Reference",
    "Cashflow.Payment_Payer_Party_Reference",
    "Cashflow.Cashflow_Sub_State",
    "Cashflow.Cashflow_Sub_State_Type",
    "Cashflow.Cashflow_Sub_State_Updater",
    "Delivery_Method",
    "Settlement_Method",
    "Trade_Id",
    "Trade_Version",
    "Entity.Booking_Entity_SCI_FMID",
    "Entity.Booking_Entity_SCI_FMCODE",
    "Entity.Counterparty_SCI_FMID",
    "Entity.Counterparty_SCI_FMCODE",
    "Entity.Counterparty_SCI_BIC_Net_Flag",
    "Cashflow.Status_Event_Type",
    "Instrument_Common.ISDA_Taxonomy",
    "Instrument_Common.Source_System_Instrument_Sub_Type",
    "Trade_Original_Source_System_Name",
    "Data_Flow.Data_Source_System",
    "Trade_State",
    "Instrument_Common.Murex_Product_Strategy",
  ],
  opensearchWhiteList: [
    "1481696",
    "1490627",
    "1480988",
    "1633330",
    "1640671",
    "2022123",
    "2000830",
    "1466717",
    "1598678",
    "8192550",
    "1622463",
    "2036027",
    "8224688",
    "8230103",
    "8220478",
  ],
};

const featureFlagControl = (source: any) => {
  const targetConfig = Object.assign({}, source);
  targetConfig.cashflowSettlementMandatoryFields.push(
    "Cashflow.Cashflow_Swift_Message_Standard"
  );
  return targetConfig;
};

export default featureFlagControl(config);
