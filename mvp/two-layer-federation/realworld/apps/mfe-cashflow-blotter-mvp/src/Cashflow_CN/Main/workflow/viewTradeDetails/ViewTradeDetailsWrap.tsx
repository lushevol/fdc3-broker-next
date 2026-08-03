import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TradeDetailsDialog } from "src/compat/related-applications";

import { viewTradeDetailsAction } from "../../store/actions";
import { RootState } from "../../store/interface";

export const ViewTradeDetailsWrap: FC = () => {
  const dispatch = useDispatch<any>();
  const { isOpenTradeDetails, data } = useSelector(
    (state: RootState) => state.viewTradeDetailsWorkflow
  );

  const onCloseTradeDetailDialog = () => {
    dispatch(viewTradeDetailsAction({ isOpenTradeDetails: false, data: null }));
  };

  return (
    <>
      {isOpenTradeDetails ? (
        <TradeDetailsDialog
          details={data}
          onClose={onCloseTradeDetailDialog}
          defaultActiveKey={"1"}
          isInTradeBlotter={false}
        />
      ) : (
        <></>
      )}
    </>
  );
};
