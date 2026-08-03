import React, { FC, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ToBeNettedCashflowRequest } from "../../../components/NettingPreview/common/interface";
import ComponentCashflow from "../../../components/NettingPreview/NetCashflowDialog";
import {
  netCashflowAction,
  updateCashflowsInNetpreview,
} from "../../store/actions";
import { nettingSuccessUpdateCashflowByNettingId } from "../../utils";
import { NetType } from "./netCashflowRightMenu";

export const NetComponent: FC = () => {
  const dispatch = useDispatch<any>();
  const { isNetCashflowDialogVisible, data } = useSelector<
    {},
    {
      isNetCashflowDialogVisible: boolean;
      data: ToBeNettedCashflowRequest;
    }
  >((state: any) => state.netWorkflow);

  const onCashflowNetted = async (nettingIds: string[]) => {
    if (!nettingIds.length) return [];
    return nettingSuccessUpdateCashflowByNettingId(nettingIds, {
      dispatch,
    });
  };

  const onCashflowUpdate = async (ids: string[]) => {
    if (!ids.length) return [];
    return dispatch(updateCashflowsInNetpreview(ids));
  };

  const onCloseComponentCashflow = () => {
    dispatch(
      netCashflowAction({
        isNetCashflowDialogVisible: false,
        data: {
          requestParams: [],
        },
        nettingStatus: "INIT",
        netType: NetType.BilateralNetting,
      })
    );
  };

  return (
    <>
      {isNetCashflowDialogVisible ? (
        <Suspense fallback={<></>}>
          <ComponentCashflow
            tobeNettedRequest={data}
            onCashflowNetted={onCashflowNetted}
            onCashflowUpdate={onCashflowUpdate}
            onClose={onCloseComponentCashflow}
          />
        </Suspense>
      ) : (
        <></>
      )}
    </>
  );
};
