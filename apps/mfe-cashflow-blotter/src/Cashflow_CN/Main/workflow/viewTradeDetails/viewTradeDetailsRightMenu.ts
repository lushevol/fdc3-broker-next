import { WorkflowActionExtraOptions } from "../../common/interface";
import { viewTradeDetailsAction } from "../../store/actions";
import { transformDataSourceForTrade } from "./utils";

export const openTradeDetailsDialog = (
  details: CNCashflow,
  options: Pick<WorkflowActionExtraOptions, "dispatch">
) => {
  const dss = transformDataSourceForTrade(
    details.Data_Flow?.Data_Source_System ?? ""
  );
  const { dispatch } = options;
  dispatch(
    viewTradeDetailsAction({
      isOpenTradeDetails: true,
      data: {
        Trade_Id: details.Trade_Id,
        ...(dss === "Murex"
          ? {
              Data_Flow: {
                Data_Source_System: dss,
              },
            }
          : {}),
      },
    })
  );
};
