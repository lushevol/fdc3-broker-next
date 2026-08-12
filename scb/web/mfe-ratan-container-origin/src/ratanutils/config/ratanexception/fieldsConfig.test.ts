import { MessageInstance } from "antd/es/message/interface";
import { CustomFormConfigProps } from "../../../ratancomponents/CustomForm/FormItemComponents";
import { searchFmid, selectFmid, clear, handleSearchResponse, handleSelectFmidResponse, SSI_DETAILS_CONFIG } from "./fieldsConfig";

afterAll(() => {
  jest.clearAllMocks();
});

jest.mock("../../componentEnabling", () => {
  return { getEnable: () => true }
});

jest.mock("../../http/graphql", () => {
  return {
    queryFmidOrCounterpartyList: async () => Promise.resolve([]),
    queryCounterPartyDetails: async () => Promise.resolve([]),
  }
});

test("formatBuySell", async () => {
  const dummy: MessageInstance = {
    info: () => { },
    success: () => { },
    error: () => { },
  } as unknown as MessageInstance;
  const result = await searchFmid("x", [], { ...dummy });
  const configs = [{ field: "fm_profile_sys_gen_id", disabled: true }] as unknown as CustomFormConfigProps[];
  const result1 = await selectFmid({ "x": "x" }, "x", configs, {});

  handleSearchResponse(dummy)({ searchCounterParty: [{ fm_profile_sys_gen_id: "a", lmp_long_name: "v" }] });
  handleSelectFmidResponse({ "fm_profile_sys_gen_id": "fm_profile_sys_gen_id" }, configs, { setFieldsValue: () => { } })
    ({ counterPartyDetails: [{ fm_profile_sys_gen_id: "a", lmp_long_name: "v" }] });

  handleSelectFmidResponse({ "x": "x" }, configs, { setFieldsValue: () => { } })
    ({ counterPartyDetails: [{ fm_profile_sys_gen_id: "a", lmp_long_name: "v" }] });

  clear({ "x": "x" }, configs, { setFieldsValue: () => { } });
  clear({ "fm_profile_sys_gen_id": "fm_profile_sys_gen_id" }, configs, { setFieldsValue: () => { } });


  SSI_DETAILS_CONFIG[1].onChange("x", [{ field: "fm_profile_sys_gen_id", disabled: true }] as unknown as CustomFormConfigProps[]);
  SSI_DETAILS_CONFIG[1].onChange("x", [{ field: "orderCustomerBic", disabled: true }] as unknown as CustomFormConfigProps[]);
  SSI_DETAILS_CONFIG[1].onChange("MT202", [{ field: "orderCustomerBic", disabled: true }] as unknown as CustomFormConfigProps[]);
  
  SSI_DETAILS_CONFIG[1].onChange("x", [{ field: "beneficiaryBic", disabled: true }] as unknown as CustomFormConfigProps[]);
  SSI_DETAILS_CONFIG[1].onChange("MT202", [{ field: "beneficiaryBic", disabled: true }] as unknown as CustomFormConfigProps[]);
});

