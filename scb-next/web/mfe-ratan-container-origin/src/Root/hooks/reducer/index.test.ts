import { render, screen, act } from "@testing-library/react";
import { reducers } from ".";
import { initialData } from "../model/root";
import { ActionType } from "./actions/ActionType";



describe("Reducer", () => {
  it("should be have value", async () => {
    const apiStatus = reducers(initialData, {
      type: ActionType.SET_API_STATUS, 
      data: {
        apiStatus: {
          data: {
            SSI_PLUS_QUERY: undefined,
            Ratan_Exception_Query: undefined,
            TDS3_Cashflow_Query: undefined,
            TDS3_Trade_Query: undefined,
            DQSL_Counterparty_Query_V2: "1",
          }
        }
      }
    });
    expect(apiStatus.apiStatus?.data?.DQSL_Counterparty_Query_V2).toBe("1");

    const refreshState = reducers(initialData, {
      type: ActionType.SET_REFRESH_STATE, 
      data: {
        refreshState: 1
      }
    });
    expect(refreshState.refreshState).toBe(1);
    const version = {
      env: "dev",
      version: "1.0.0"
    };
    const versionState = reducers(initialData, {
      type: ActionType.SET_VERSION_STATE, 
      data: {
        versionState: version
      }
    });
    expect(versionState.versionState).toBe(version);
  });
});