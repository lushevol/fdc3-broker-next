import { Grid, Tab } from "@mui/material";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import React, {
  createContext,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import ratanConfig from "src/Cashflow_CN/Main/config/ratanConfig";
import { useCashflowDetailsContext } from "src/Cashflow_CN/Main/workflow/viewCashflowDetails/CashflowDetailsContext";
import { transformDataSourceForTrade } from "src/Cashflow_CN/Main/workflow/viewTradeDetails/utils";
import type { QueryTradeResponse } from "src/Cashflow_CN/services/type";
import { useBatchCollect, useE2Elatency, useRTT } from "src/Root/analysis";
import {
  CASHFLOW_DETAILS_DIALOG_TAB,
  CASHFLOW_DETAILS_TABS_CLICK,
  DETAIL_RENDERING_LATENCY_STAGES,
  DETAILS_RENDERING_LATENCY,
  RTT_QUERY_COUNTRY_IN_DETAIL,
  RTT_QUERY_CP_IN_DETAIL,
  RTT_QUERY_DETAIL_GRAPHQL,
} from "src/Root/analysis/const";
import { HistoryDetailsDialog, Loading } from "src/Root/import/ratancomponents";
import {
  getRealIdOfTrade,
  hasPermission,
  queryTradeVersionsData,
  swiftMessageDetails,
} from "src/Root/import/ratanutils";

import { historyFields_CN } from "../../Main/config/historyGridConfig";
import { getCountryInfo, getSwiftMessageByCashflowId } from "../../services";
import {
  queryCashFlowDetails,
  queryCounterPartyDetails_CN,
} from "../../services/graphql";
import { LEVEL2_NOTIFICATION_DOM_ANCHOR } from "../CashflowNotification/dialogWrap";
import { AccountingDetail } from "./AccountingDetail";
import CashflowPanel from "./CashflowPanel";
import { generateEmptyGraphQLCashflowDetails } from "./common/utils";
import MultiExceptions from "./MultiExceptions";
import { classes, StyledBody, StyledTabs } from "./style";
import TradePanel from "./TradePanel";

const MultiSwiftMessage = React.lazy(() => import("./MultiSwiftMessage"));

export const isNettedCashflow = (cashflowDetails: CNCashflow) => {
  return (
    cashflowDetails &&
    cashflowDetails.Cashflow?.Cashflow_State !== "NETTED" &&
    cashflowDetails.Cashflow?.Netting_Id
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  activeKey: string;
  valueKey: string;
  className?: string;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, valueKey, activeKey, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={activeKey !== valueKey}
      id={`simple-tabpanel-${valueKey}`}
      aria-labelledby={`simple-tab-${valueKey}`}
      {...other}
    >
      {children}
    </div>
  );
};

function a11yProps(key: string) {
  return {
    id: `simple-tab-${key}`,
    "aria-controls": `simple-tabpanel-${key}`,
  };
}

export interface HeaderTabsProps {
  activeKey?: string;
  hiddenTabs?: Set<string>;
  onTabClick: (t: string) => void;
}

export const CASHFLOW_DETAILS_TAB = "1";
export const HISTORY_TAB = "3";
export const SWIFT_MESSAGE_TAB = "4";
export const EBBS_ACCOUNTING_DETAILS = "6";

export const TAB_PANES = [
  {
    label: "Cashflow Detail",
    value: CASHFLOW_DETAILS_TAB,
  },
  {
    label: "History",
    value: HISTORY_TAB,
  },
  {
    label: "Swift Message",
    value: SWIFT_MESSAGE_TAB,
  },
  {
    label: "Accounting Detail",
    value: EBBS_ACCOUNTING_DETAILS,
  },
];

export const getTabLabel = (tabValue: string) => {
  return TAB_PANES.find((i) => i.value === tabValue)?.label;
};

export const HeaderTabs = memo(
  ({
    activeKey = TAB_PANES[0].value,
    hiddenTabs = new Set(),
    onTabClick,
  }: HeaderTabsProps) => {
    const { startTracking } = useBatchCollect();
    useEffect(() => {
      startTracking(CASHFLOW_DETAILS_TABS_CLICK)([getTabLabel(activeKey)!]);
    }, []);
    return (
      <StyledTabs
        className={classes.tabs}
        data-testid={CASHFLOW_DETAILS_DIALOG_TAB}
        value={activeKey}
        onChange={(_, t) => {
          onTabClick(t);
          const clickedTabLabel = getTabLabel(t);
          clickedTabLabel &&
            startTracking(CASHFLOW_DETAILS_TABS_CLICK)([clickedTabLabel]);
        }}
        sx={{
          minWidth: "300px",
        }}
      >
        {TAB_PANES.filter((TAB) => !hiddenTabs.has(TAB.value)).map((TAB) => (
          <Tab {...TAB} {...a11yProps(TAB.value)}></Tab>
        ))}
      </StyledTabs>
    );
  }
);

export interface DetailsBodyProps {
  details: CNCashflow;
  activeKey?: string;
  refreshCashflow?: () => Promise<CNCashflow>;
  onQueryCashflow: (cashflowIds: string[], isPass?: boolean) => void;
  onOpenTradeDetails: () => Promise<void>;
  disableTradeOpenBtn?: boolean;
  onTabVisibleChange?: (tabname: string, visible: boolean) => void;
  onClose?: () => void;
}

type PromiseStatus = "Pending" | "Fullfiled" | "Rejected";

export const IsPendingRequestContext = createContext(true);

export const handleTradeVersionsData = (
  res: QueryTradeResponse
): (Trade_Review & { Versions: Trade_Review[] }) | null => {
  const data = res.tradeVersions.results;
  if (data.length > 0) {
    const lastVersion = data.splice(0, 1);
    return {
      ...lastVersion[0],
      Versions: data,
    };
  } else {
    return null;
  }
};

export const hasTradeBlotterPermission = () => {
  return (
    hasPermission("RATAN_TRADE_BLOTTER:UI_Read_Access") ||
    hasPermission("RATAN_TRADE_BLOTTER:ACCESS_FMO_POST_TRADE_PORTAL")
  );
};

export const shouldShowSwiftMessage = (data: GraphqlCashflowDetails) => {
  return (
    ["RELEASED", "SETTLED"].includes(
      data.cashflow?.Cashflow?.Cashflow_State + ""
    ) ||
    !!data.cashflowAuditTrail?.find((h) =>
      ["RELEASED", "SETTLED"].includes(h.Cashflow?.Cashflow_State + "")
    )
  );
};

export const tradeDetailsHandler = async (data?: CashflowDataModal) => {
  if (!data) return null;
  const tradeIdOrBCS = getRealIdOfTrade(data);
  if (
    hasTradeBlotterPermission() &&
    !isNettedCashflow(data) &&
    tradeIdOrBCS &&
    data.Trade_Version + ""
  ) {
    const dss = transformDataSourceForTrade(
      data.Data_Flow?.Data_Source_System ?? ""
    );
    const filters: FilterItem[] = [
      { field: "Trade_Id", operator: "EQ", values: tradeIdOrBCS },
      ...(dss === "Murex"
        ? [
            {
              field: "Data_Flow.Data_Source_System",
              operator: "EQ",
              values: dss,
            },
          ]
        : []),
    ];
    try {
      const res = (await queryTradeVersionsData(
        filters,
        null,
        ratanConfig.cashflow.tradeDetailsResultInCashflowCN
      )) as QueryTradeResponse;

      return handleTradeVersionsData(res);
    } catch (error) {
      console.error(error);
    }
  }

  return null;
};

export const displaySwiftMessage = (
  swiftMessage: string | swiftmessageList[],
  cashflowId: string
) => {
  //MX
  if (Array.isArray(swiftMessage)) {
    return (
      <Suspense fallback="">
        <MultiSwiftMessage
          swiftMessages={swiftMessage}
          cashflowId={cashflowId}
        />
      </Suspense>
    );
  }
  //MT
  const isSwiftmessage = swiftMessage && swiftMessage.trim() !== "";
  return isSwiftmessage ? (
    <pre className={classes.swiftMessage}>{swiftMessage}</pre>
  ) : (
    <div className={classes.noSwiftMessage}>No Swift Message</div>
  );
};

export const DetailsBody = memo<DetailsBodyProps>(
  ({
    details,
    activeKey = CASHFLOW_DETAILS_TAB,
    refreshCashflow,
    onOpenTradeDetails,
    onQueryCashflow,
    onTabVisibleChange,
    disableTradeOpenBtn,
    onClose,
  }) => {
    const [counterPartyDetails, setCounterPartyDetails] =
      useState<CounterPartyDetailsFMEntity>();
    const [tradeDetails, setTradeDetails] = useState<
      (Trade_Review & { Versions: Trade_Review[] }) | null
    >(null);
    const [swiftMessage, setSwiftMessage] = useState<
      string | swiftmessageList[] | null
    >(null);
    const [isShowSwift, setIsShowSwift] = useState(false);
    const [fetchResultStatus, setFetchResultStatus] =
      useState<PromiseStatus>("Pending");
    const [graphCashflowDetails, setGraphCashflowDetails] =
      useState<GraphqlCashflowDetails>(
        generateEmptyGraphQLCashflowDetails(details)
      );
    const { startTracking } = useRTT();
    const { addTrackingPoint, completeTracking, abortTracking } = useE2Elatency(
      DETAILS_RENDERING_LATENCY
    );

    const [fetchingSwiftMessage, setFetchingSwiftMessage] = useState(false);

    const getSwiftMessageDetails = useCallback(
      async (detailsData: CNCashflow) => {
        setFetchingSwiftMessage(true);
        const res = await fetchSwiftMessage(detailsData);
        setSwiftMessage(res);
        setFetchingSwiftMessage(false);
      },
      []
    );
    const opensearch = useCashflowDetailsContext().opensearch;

    useEffect(() => {
      if (details) {
        addTrackingPoint(DETAIL_RENDERING_LATENCY_STAGES.RENDER_DETAIL_FRAME);
        setFetchResultStatus("Pending");
        const emptyCashflowDetails =
          generateEmptyGraphQLCashflowDetails(details);
        setGraphCashflowDetails(emptyCashflowDetails);
        const swiftMsgVisible = shouldShowSwiftMessage(emptyCashflowDetails);
        setIsShowSwift(swiftMsgVisible);
        onTabVisibleChange?.(SWIFT_MESSAGE_TAB, swiftMsgVisible);
        const {
          completeTracking: completeTrackingRTT1,
          abortTracking: abortTrackingRTT1,
        } = startTracking();
        queryCashFlowDetails([details.Cashflow?.Cashflow_Id + ""], opensearch)
          .then((res) => {
            const resp = res?.graphCashFlowDetails[0];
            if (resp) {
              completeTrackingRTT1({ name: RTT_QUERY_DETAIL_GRAPHQL });
              addTrackingPoint(
                DETAIL_RENDERING_LATENCY_STAGES.RENDER_DETAIL_DATA
              );
              completeTracking();
              tradeDetailsHandler(resp.cashflow).then((tradeDetailsResp) =>
                setTradeDetails(tradeDetailsResp)
              );
              setGraphCashflowDetails(resp);
              const swiftMsgVisible = shouldShowSwiftMessage(resp);
              setIsShowSwift(swiftMsgVisible);
              onTabVisibleChange?.(SWIFT_MESSAGE_TAB, swiftMsgVisible);
              setFetchResultStatus("Fullfiled");
            } else {
              setFetchResultStatus("Rejected");
              abortTrackingRTT1();
              abortTracking();
            }
          })
          .catch(() => {
            setFetchResultStatus("Rejected");
            abortTrackingRTT1();
            abortTracking();
          });
        if (details.Entity?.Counterparty_SCI_FMID) {
          const {
            completeTracking: completeTrackingRTT2,
            abortTracking: abortTrackingRTT2,
          } = startTracking();
          queryCounterPartyDetails_CN(details.Entity.Counterparty_SCI_FMID)
            .then((res) => {
              if (res?.fmEntity) {
                completeTrackingRTT2({
                  name: RTT_QUERY_CP_IN_DETAIL,
                });
                const data = res.fmEntity;
                const convertData = cloneDeep(data);
                const requestParams = convertData.fmAddress
                  ?.map((i) => {
                    return i.country;
                  })
                  .filter((item: any) => item !== null);
                const {
                  completeTracking: completeTrackingRTT3,
                  abortTracking: abortTrackingRTT3,
                } = startTracking();
                getCountryInfo({
                  countryCodes: Array.from(new Set(requestParams)),
                })
                  .then((result) => {
                    completeTrackingRTT3({
                      name: RTT_QUERY_COUNTRY_IN_DETAIL,
                    });
                    const convertCountry = (country: string) => {
                      const countryInfo = result.countryInfoList?.find(
                        (i) => i.countryCode === country
                      );
                      return countryInfo?.countryName || country;
                    };
                    convertData.fmAddress?.forEach((k) => {
                      k.country = convertCountry(k.country);
                    });
                    setCounterPartyDetails(convertData);
                  })
                  .catch((error: any) => {
                    abortTrackingRTT3();
                    console.error(error);
                  });
              } else {
                abortTrackingRTT2();
              }
            })
            .catch((error: any) => {
              console.error(error);
              abortTrackingRTT2();
            });
        }
      }
    }, [details]);

    useEffect(() => {
      if (
        activeKey === SWIFT_MESSAGE_TAB &&
        swiftMessage === null &&
        !fetchingSwiftMessage
      ) {
        getSwiftMessageDetails(graphCashflowDetails.cashflow ?? {});
      }
    }, [activeKey, graphCashflowDetails, swiftMessage, fetchingSwiftMessage]);

    const handleRefreshCashflow = useCallback(async () => {
      refreshCashflow?.();
    }, [refreshCashflow]);

    return (
      <StyledBody
        className={LEVEL2_NOTIFICATION_DOM_ANCHOR}
        sx={{ p: 1 }}
        data-testid="cashflow-details-dialog-body"
      >
        {fetchResultStatus !== "Rejected" ? (
          <IsPendingRequestContext.Provider
            value={fetchResultStatus === "Pending"}
          >
            <CustomTabPanel
              className={classes.tabpanel}
              activeKey={activeKey}
              valueKey={CASHFLOW_DETAILS_TAB}
            >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TradePanel
                    trade={tradeDetails}
                    cashflow={graphCashflowDetails.cashflow}
                    onOpenTradeDetails={onOpenTradeDetails}
                    disableTradeOpenBtn={disableTradeOpenBtn}
                  ></TradePanel>
                </Grid>
                <Grid item xs={12}>
                  <CashflowPanel
                    cashflow={graphCashflowDetails.cashflow ?? {}}
                    cashflowHistory={
                      graphCashflowDetails.cashflowAuditTrail ?? []
                    }
                    onQueryCashflow={onQueryCashflow}
                  ></CashflowPanel>
                </Grid>
              </Grid>
              <MultiExceptions
                cashflowDetails={graphCashflowDetails}
                counterPartyDetails={counterPartyDetails}
                refreshCashflow={handleRefreshCashflow}
                closeDialog={onClose}
              />
            </CustomTabPanel>
            <CustomTabPanel
              className={classes.tabpanel}
              activeKey={activeKey}
              valueKey={HISTORY_TAB}
            >
              <HistoryDetailsDialog
                details={graphCashflowDetails.cashflow ?? details}
                historyDataList={graphCashflowDetails.cashflowAuditTrail ?? []}
                gridFields={historyFields_CN}
                historyPageName="Cashflow"
              />
            </CustomTabPanel>
            {isShowSwift && (
              <CustomTabPanel
                className={classes.tabpanel}
                activeKey={activeKey}
                valueKey={SWIFT_MESSAGE_TAB}
              >
                {swiftMessage === null ? (
                  <Loading loading size={70} text="loading..." />
                ) : (
                  displaySwiftMessage(
                    swiftMessage,
                    get(
                      graphCashflowDetails.cashflow ?? details,
                      "Cashflow.Cashflow_Id"
                    )
                  )
                )}
              </CustomTabPanel>
            )}
            <CustomTabPanel
              className={classes.tabpanel}
              activeKey={activeKey}
              valueKey={EBBS_ACCOUNTING_DETAILS}
            >
              <AccountingDetail
                cashflowId={get(
                  graphCashflowDetails.cashflow ?? details,
                  "Cashflow.Cashflow_Id"
                )}
              />
            </CustomTabPanel>
          </IsPendingRequestContext.Provider>
        ) : (
          <div className={classes.nodata}>
            <span>
              <i className="fas fa-exclamation-circle"></i>
              Unable to fetch cashflow{" "}
              <span className="cashflow-details-id">
                {details?.Cashflow?.Cashflow_Id}
              </span>{" "}
              at the moment!
            </span>
          </div>
        )}
      </StyledBody>
    );
  }
);

export const fetchSwiftMessage = async (
  detailsData: CNCashflow
): Promise<string | swiftmessageList[]> => {
  try {
    const swiftMessageStandard =
      detailsData.Cashflow?.Cashflow_Swift_Message_Standard;
    if (["MX", "MT"].includes(swiftMessageStandard + "")) {
      const res = await getSwiftMessageByCashflowId(
        detailsData.Cashflow!.Cashflow_Id + ""
      );
      if (res.swiftType == "MT" && Array.isArray(res.mtMessageList)) {
        return res.mtMessageList.join("\n\n");
      }
      if (res.swiftType == "MX" && Array.isArray(res.mxMessageLists)) {
        return res.mxMessageLists;
      }
      return "";
    }
  } catch (error) {
    return "";
  }
  const results = {
    cashflowId: detailsData.Cashflow?.Cashflow_Id,
    bookingEntitySciFmid: detailsData.Entity?.Booking_Entity_SCI_FMID,
    cashflowVersion: detailsData.Cashflow?.Cashflow_Version,
    businessVersion: detailsData.Cashflow?.Cashflow_Business_Version,
    tradeOriginalSourceSystem: detailsData.Trade_Original_Source_System_Name,
  };
  try {
    const res = await swiftMessageDetails(results);
    return res;
  } catch (error) {
    return "";
  }
};
