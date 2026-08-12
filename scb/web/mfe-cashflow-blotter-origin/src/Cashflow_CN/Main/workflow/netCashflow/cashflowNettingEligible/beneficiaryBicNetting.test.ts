import { message, Modal } from "antd";
import { WorkflowActionExtraOptions } from "src/Cashflow_CN/Main/common/interface";
import { mockCashflow1, mockCashflow2 } from "src/Cashflow_CN/test/mockData/cashflow";

import { beneficiaryBICNettingValidation, canBeneficiaryBICNetting,extractErrorContent } from "./beneficiaryBicNetting";

it("beneficiaryBICNettingValidation", () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const res = beneficiaryBICNettingValidation([mockCashflow1, mockCashflow2], mockWorkflowActionExtraOptions);
    expect(res).toBe(false);
});

it("extractErrorContent", () => {
    const errorAlerts = extractErrorContent({
        netIdArray: ["test_id_3"],
        entityArray: [],
        valueDateArray: [],
        beneficiaryBICArray: [],
        loanIQValidationPassed: true,
    });

    expect(errorAlerts.length).toBe(1);
});

it("extractErrorContent", () => {
    const errorAlerts = extractErrorContent({
        netIdArray: [],
        entityArray: [],
        valueDateArray: [],
        beneficiaryBICArray: [],
        loanIQValidationPassed: false,
    });

    expect(errorAlerts.length).toBe(1);
});

it("canBeneficiaryBICNetting should return true'", () => {
  const cashflow: CNCashflow = {
    Cashflow: {
        Cashflow_Id: "008690236385",
        Cashflow_State: "WAITING",
        Cashflow_Sub_State_Type: "Pending Netting",
    },
    Entity: {
      Booking_Entity_SCI_FMCODE: "SCB LONDON*LDN",
      Counterparty_SCI_BIC_Net_Flag: "Y"
    }
  };
  const result = canBeneficiaryBICNetting(cashflow);
  expect(result).toBe(true);
});
it("canBeneficiaryBICNetting Splitting Id is empty should return true'", () => {
  const cashflow: CNCashflow = {
    Cashflow: {
        Cashflow_Id: "008690236385",
        Cashflow_State: "WAITING",
        Cashflow_Sub_State_Type: "Pending Netting",
        Splitting_Id: "",
    },
    Entity: {
      Booking_Entity_SCI_FMCODE: "SCB LONDON*LDN",
      Counterparty_SCI_BIC_Net_Flag: "Y"
    }
  };
  const result = canBeneficiaryBICNetting(cashflow);
  expect(result).toBe(true);
});
it("canBeneficiaryBICNetting Splitting Id is null should return true'", () => {
  const cashflow: CNCashflow = {
    Cashflow: {
        Cashflow_Id: "008690236385",
        Cashflow_State: "WAITING",
        Cashflow_Sub_State_Type: "Pending Netting",
        Splitting_Id: null,
    },
    Entity: {
      Booking_Entity_SCI_FMCODE: "SCB LONDON*LDN",
      Counterparty_SCI_BIC_Net_Flag: "Y"
    }
  };
  const result = canBeneficiaryBICNetting(cashflow);
  expect(result).toBe(true);
});
it("canBeneficiaryBICNetting has Splitting Id is not null should return false'", () => {
  const cashflow: CNCashflow = {
    Cashflow: {
        Cashflow_Id: "008690236385",
        Cashflow_State: "WAITING",
        Cashflow_Sub_State_Type: "Pending Netting",
        Splitting_Id: "123",
    },
    Entity: {
      Booking_Entity_SCI_FMCODE: "SCB LONDON*LDN",
      Counterparty_SCI_BIC_Net_Flag: "Y"
    }
  };
  const result = canBeneficiaryBICNetting(cashflow);
  expect(result).toBe(false);
});

it("beneficiaryBICNettingValidation should return false when loanIQValidationPassed is false", () => {
    const selectedData: CNCashflow[] = [
      {
        Cashflow: {
          Cashflow_Id: "008690236385",
          Cashflow_Sub_State: "WAITING",
          Cashflow_Sub_State_Type: "Pending Netting",
        },
        Entity: {
          Booking_Entity_SCI_FMID: "SCB LONDON*LDN",
          Counterparty_SCI_BIC_Code: "BIC123",
        },
        Trade_Original_Source_System_Name: "LOANIQ",
      },
      {
        Cashflow: {
          Cashflow_Id: "008690236386",
          Cashflow_Sub_State: "WAITING",
          Cashflow_Sub_State_Type: "Pending Netting",
        },
        Entity: {
          Booking_Entity_SCI_FMID: "SCB LONDON*LDN",
          Counterparty_SCI_BIC_Code: "BIC456",
        },
      },
    ];
  
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch: jest.fn(),
      messageApi: message,
      modalApi: Modal,
    };
    const res = beneficiaryBICNettingValidation(
      selectedData,
      mockWorkflowActionExtraOptions
    );
    expect(res).toBe(false);
  });