import React, { FC, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";

const TradeDetailsDialog = React.lazy(() =>
  // @ts-ignore
  System.import("@fm/ratan_trades").then((a) => {
    return a.TradeDetails;
  })
);

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
    <Suspense fallback={<></>}>
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
    </Suspense>
  );
};
