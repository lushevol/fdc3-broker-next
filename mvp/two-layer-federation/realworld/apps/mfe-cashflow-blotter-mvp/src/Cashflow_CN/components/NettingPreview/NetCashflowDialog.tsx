import { css, styled } from "@mui/material";
import { DatePicker, Form, Input, message, Result } from "antd";
import { Button, LoadingButton } from "Import/index";
import { MuiDialog } from "Import/ratancomponents";
import { FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import { NetType } from "src/Cashflow_CN/Main/workflow/netCashflow/netCashflowRightMenu";
import { useRTT } from "src/Root/analysis";
import {
  CASHFLOW_BLOTTER_NET_WITH_AFFIRM_BTN,
  CASHFLOW_BLOTTER_NETTING_DIALOG_CLOSE_BTN,
  CASHFLOW_BLOTTER_NETTING_DIALOG_NET_SUBMIT_BTN,
  RTT_QUERY_NETTING_PREVIEW,
} from "src/Root/analysis/const";

import { updateNetCashflowWorkflowStatus } from "../../Main/store/actions/workflowAction";
import {
  ApiCashflowNewNettingPreviewResponse,
  CashflowNewNettingPreviewMatrix,
  NetPreviewComponentProps,
  ToBeNettedCashflowRequest,
} from "./common/interface";
import {
  getNettingPreviewApi,
  netCashflowHelper,
  netCashflowWithAffirmationHelper,
} from "./NetCashflowDialogUtils";
import NetPreviewComponent from "./NetPreviewComponent";
import {
  netPreviewDataExtracter,
  netPreviewDataParser,
} from "./netPreviewDataParser";

const INPUT_WIDTH = "200px";
const StyledMuiDialog = styled(MuiDialog)(
  () => css`
    .component-cashflow-dialog-body {
      padding: 10px 20px;
      display: flex;
      flex-direction: column;
      height: 98%;
    }
    .update-affirmation-status {
      padding-top: 20px;
    }
    .bottom-btn {
      padding: 0 10px;
      .btn {
        & + .btn {
          margin-left: 10px;
        }
      }
    }
  `
);

const CloseButtion = (onClick: () => void, disabled: boolean) => {
  return (
    <Button
      className="btn"
      onClick={onClick}
      data-testid={CASHFLOW_BLOTTER_NETTING_DIALOG_CLOSE_BTN}
      disabled={disabled}
      variant="outlined"
      size="medium"
    >
      Close
    </Button>
  );
};

export const netButtonText = ({
  nettingStatus,
  proceedNetting,
  netType,
}: {
  nettingStatus: string;
  proceedNetting: boolean;
  netType: NetType;
}) => {
  if (nettingStatus === "FINISHED") return "Netting Done";
  if (proceedNetting) return "Proceed Netting";
  return netType === NetType.BeneficiaryBICNetting
    ? "Net All Cashflows"
    : "Net All Cashflows with Affirmation";
};

interface NetPreviewCashflowProps {
  tobeNettedRequest: ToBeNettedCashflowRequest;
  onCashflowNetted: (ids: string[]) => Promise<CNCashflow[]>;
  onCashflowUpdate: (ids: string[]) => Promise<CNCashflow[]>;
  onClose?: () => void;
}

const NettingPreviewDialog: FC<NetPreviewCashflowProps> = memo(
  ({
    tobeNettedRequest,
    onCashflowNetted,
    onCashflowUpdate,
    onClose = () => {},
  }) => {
    const dispatch = useDispatch<any>();
    const { requestParams } = tobeNettedRequest;
    const { nettingStatus, netType } = useSelector(
      (state: RootState) => state.netWorkflow
    );

    const [form] = Form.useForm();
    const [messageApi, messageContext] = message.useMessage();
    const [open, setOpen] = useState(true);
    const [openAffirmation, setOpenAffirmation] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [proceedPreviewing, setProceedPreviewing] = useState(false);
    const [proceedNetting, setProceedNetting] = useState(false);
    const [previewMetrix, setPreviewMetrix] = useState<
      CashflowNewNettingPreviewMatrix[]
    >([]);
    const [nettingResult, setNettingResult] = useState<
      NetPreviewComponentProps["nettingResult"]
    >({
      netting: [],
      single: [],
      valid: [],
      failed: [],
    });
    const { startTracking: startTrackingRTT } = useRTT();
    useEffect(() => {
      // query for netting preview cashflow here
      if (Array.isArray(requestParams) && requestParams.length > 1) {
        setOpen(true);
        setProceedPreviewing(true);
        setPreviewMetrix(
          requestParams.reduce<CashflowNewNettingPreviewMatrix[]>(
            (res, cur) => {
              const index = res.findIndex(
                (i) =>
                  i.originalCashflowList.findIndex(
                    (r) =>
                      r.Cashflow?.Payment_Currency ===
                      cur.Cashflow?.Payment_Currency
                  ) > -1
              );
              if (index > -1) {
                res[index].originalCashflowList.push(cur);
              } else {
                res.push({
                  originalCashflowList: [cur],
                  previewCashflowList: [],
                  errorMsg: null,
                  valid: true,
                });
              }
              return res;
            },
            []
          )
        );
        const requestPayload = {
          requestList: requestParams.map((i) => netPreviewDataExtracter(i)),
        };
        const { completeTracking, abortTracking } = startTrackingRTT();
        const nettingPreviewApi = getNettingPreviewApi(netType);
        nettingPreviewApi(requestPayload)
          .then((res) => {
            setProceedPreviewing(false);
            const { data, status } = res;
            if (status !== 200) {
              messageApi.error(res.message);
              setErrorMessage(res.message);
              dispatch(
                updateNetCashflowWorkflowStatus({ nettingStatus: "ERROR" })
              );
            } else {
              const { resultList } =
                data as ApiCashflowNewNettingPreviewResponse;
              const previewMatrix = resultList.map((item) => {
                const { originalCashflowList, previewCashflowList } = item;
                const source: CNCashflow[] =
                  originalCashflowList?.map((item: any) =>
                    netPreviewDataParser(item)
                  ) || [];
                const preview: CNCashflow[] =
                  previewCashflowList?.map((item: any) =>
                    netPreviewDataParser(item)
                  ) || [];
                if (source.length === 1 && preview.length === 0) {
                  preview.push({
                    ...source[0],
                    Type: "single",
                  } as CNCashflow);
                }
                return {
                  ...item,
                  originalCashflowList: source,
                  previewCashflowList: preview,
                };
              });
              setPreviewMetrix(previewMatrix);
            }
            completeTracking({ name: RTT_QUERY_NETTING_PREVIEW });
          })
          .catch((error: any) => {
            setProceedPreviewing(false);
            messageApi.error(error.message);
            setErrorMessage(error.message);
            dispatch(
              updateNetCashflowWorkflowStatus({ nettingStatus: "ERROR" })
            );
            abortTracking();
          });
      }
    }, [requestParams]);

    const close = () => {
      if (!proceedNetting) {
        setPreviewMetrix([]);
        setOpen(false);
        onClose();
      }
    };

    useEffect(() => {
      if (nettingStatus === "FINISHED") {
        setProceedNetting(false);
      }
    }, [nettingStatus]);

    const netCashflow = netCashflowHelper({
      requestParams,
      setProceedNetting,
      netType,
      messageApi,
      setErrorMessage,
      dispatch,
      setPreviewMetrix,
      onCashflowNetted,
      onCashflowUpdate,
      setNettingResult,
      startTrackingRTT,
    });

    const closeAffirmation = () => {
      setOpenAffirmation(false);
      form.resetFields();
    };

    const netCashflowWithAffirmation = netCashflowWithAffirmationHelper({
      form,
      closeAffirmation,
      netCashflow,
    });

    const primaryButtonClickHandler = () => {
      if (netType === NetType.BeneficiaryBICNetting) {
        netCashflow();
      } else {
        setOpenAffirmation(true);
      }
    };

    return (
      <>
        {messageContext}
        <StyledMuiDialog
          open={open}
          onClose={close}
          title="Cashflow Netting Preview"
          width="900px"
          height="700px"
          enableResize
          actions={
            <div className="bottom-btn">
              <LoadingButton
                className="btn"
                onClick={primaryButtonClickHandler}
                disabled={
                  !previewMetrix.length ||
                  ["FINISHED", "ERROR"].includes(nettingStatus)
                }
                data-testid={CASHFLOW_BLOTTER_NET_WITH_AFFIRM_BTN}
                loading={proceedNetting}
                variant="outlined"
                size="medium"
              >
                {netButtonText({ nettingStatus, proceedNetting, netType })}
              </LoadingButton>
              {CloseButtion(close, proceedNetting)}
            </div>
          }
        >
          <div
            className="component-cashflow-dialog-body"
            data-testid="component-cashflow-dialog-body"
          >
            {nettingStatus !== "ERROR" ? (
              <NetPreviewComponent
                previewMetrix={previewMetrix}
                proceedPreviewing={proceedPreviewing}
                nettingResult={nettingResult}
                netType={netType}
              />
            ) : (
              <Result
                status="warning"
                title="Can not Netting"
                subTitle={errorMessage}
                extra={CloseButtion(close, proceedNetting)}
              ></Result>
            )}
          </div>
        </StyledMuiDialog>
        <StyledMuiDialog
          open={openAffirmation}
          onClose={closeAffirmation}
          title="Update Affirmation"
          width="400px"
          height="280px"
          enableResize
          inside
          actions={
            <LoadingButton
              className="btn"
              variant="contained"
              size="medium"
              onClick={netCashflowWithAffirmation}
              disabled={!previewMetrix.length || nettingStatus === "FINISHED"}
              data-testid={CASHFLOW_BLOTTER_NETTING_DIALOG_NET_SUBMIT_BTN}
              loading={proceedNetting}
            >
              Submit
            </LoadingButton>
          }
        >
          <div
            className="update-affirmation-status"
            data-testid="update-affirmation-status"
          >
            <Form
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              form={form}
              autoComplete="off"
            >
              <Form.Item
                name="affirmedBy"
                label="Affirmed with (Name)"
                rules={[
                  {
                    required: true,
                    message: "Please enter your name.",
                  },
                ]}
              >
                <Input
                  style={{ width: INPUT_WIDTH }}
                  data-testid="affirmedName"
                />
              </Form.Item>

              <Form.Item
                name="phone_email"
                label="Email ID/Phone No."
                rules={[
                  {
                    required: true,
                    message: "Please enter a valid email or phone number.",
                  },
                ]}
              >
                <Input
                  style={{ width: INPUT_WIDTH }}
                  data-testid="affirmedEmail"
                />
              </Form.Item>

              <Form.Item
                name="affirmedAt"
                label="Date Time"
                rules={[
                  {
                    required: true,
                    message: "Please select date time",
                  },
                ]}
              >
                <DatePicker showTime data-testid="affirmedAt" />
              </Form.Item>
            </Form>
          </div>
        </StyledMuiDialog>
      </>
    );
  }
);

export default NettingPreviewDialog;
