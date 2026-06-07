import cloneDeep from "lodash/cloneDeep";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { findAffirmationDataFromExceptionsStashing } from "src/Cashflow_CN/components/BulkFixExceptions/utils/filter";
import { convertAffirmationFormData2RatanAffirmation } from "src/Cashflow_CN/components/BulkFixExceptions/utils/utils";
import { emptyOrNilOptional } from "src/Cashflow_CN/Main/utils";
import { getUser } from "src/Root/import/ratanutils";

import { checkAuthLimit } from "../../../../services/index";
import { isValidGraphQLCashflowDetails } from "../../common/utils";
import { IsPendingRequestContext } from "../../detailsBody";
import {
  CashflowStateTypes,
  CashflowSubState_ExceptionStatus,
  CashflowSubStateType,
  CashflowSubStateTypes,
  CashflowSubStateTypeTypes,
  Checker,
  ExceptionBundleStatusTypes,
  ExceptionItem,
  Maker,
  Maker_Of_Ready_State,
  MultiExceptionsNames,
  Submiter,
  UserProfile,
  UserType,
  Verifier,
  Visitor,
} from "../common/interface";
import {
  findIfSubmitByYou,
  generateEmptyNostro,
  generateEmptyVostro,
  getUserProfile,
  getUserRole,
  hasHighRiskExceptionPermission,
  isMissingNostroException,
  isMissingVostroException,
  isMultiVostroException,
  isRebookException,
  isSSIGoodStamping,
  isSSIMissMatchedException,
  matchException,
  revertSSI,
  vostroInformExtractWrapper,
} from "../common/utils";
import { HistoryDataType } from "../components/ActionHistory/interface";
import { AffirmationFormDataType } from "../components/Affirmation/interface";
import { BackValueFormDataType } from "../components/BackValue/interface";
import {
  NostroFormDetails,
  NostroListDataType,
} from "../components/Nostro/interface";
import {
  VostroFormDetails,
  VostroListDataType,
} from "../components/Vostro/interface";
import { ClassifiedCommonExceptionsType } from "./interface";

// temprorayly fix comment not show issue, but this list can be used in further optimization.
export const ActionHistoryKeyActions = ["Comment"];

export const Halt_States = ["READY"];

const keyActionName = ["SETTLEASGROSS", "SPLITNEW"];

const makerActionName = [
  "REVERTPENVERFICATION",
  "APPROVE",
  "SUBMIT",
  "ISNSTPCHECKER",
  "ISNSTP",
  "MANUALSWIFTSUPPRESS",
  "MANUALSUPPRESS",
];

// UI maintains a user action list to display
const userActionList = [
  "Materialize",
  "Net",
  "UnNet",
  "Split",
  "UnSplit",
  "ManualSuppress",
  "ManualSettle",
  "ManualUnSuppress",
  "ManualSwiftUnSuppress",
  "ManualSwiftSuppress",
  "Fail",
  "ReInstate",
  "Approve",
  "Submit",
  "Reject",
  "Hold",
  "UnHold",
  "ManualAffirmed",
  "SettleAsGross",
  "Comment",
  "ManualStp",
  "ReplayStatusWriteBack",
  "ResendToRazor",
  "ReGenerateSwift",
  "EarlyRelease",
  "NetNew",
];

const displayFieldsWhileChecker = [
  "beneficiaryAddress",
  "accountWithInstitutionAddress",
  "intermediaryAddress",
  "receiversCorrespondentAddress",
  "orderCustomerAddress",
  "beneficiaryCity",
  "accountWithInstitutionCity",
  "intermediaryPostcode",
  "receiversCorrespondentCity",
  "orderCustomerCity",
  "senderToReceiver1",
  "senderToReceiver2",
  "senderToReceiver3",
  "senderToReceiver4",
  "senderToReceiver5",
  "senderToReceiver6",
  "remittanceInformation1",
  "remittanceInformation2",
  "remittanceInformation3",
  "remittanceInformation4",
  "popDubai",
];

// double maker searching, users with below 2 kinds of actions are both treated as makers.
export const findMakerFromHistory = ({
  actionHistoryListData,
}: {
  actionHistoryListData: HistoryDataType[];
}) => {
  const keyActionHistoryData = actionHistoryListData.find((history) =>
    keyActionName.includes(history.Action ? history.Action.toUpperCase() : "")
  );
  const makerActionHistoryData = actionHistoryListData.find((history) =>
    makerActionName.includes(history.Action ? history.Action.toUpperCase() : "")
  );
  return [keyActionHistoryData?.User_PSID, makerActionHistoryData?.User_PSID];
};

export const parseMakerIdFromHistory = (
  userRole: UserType,
  actionHistoryListData: HistoryDataType[]
) => {
  if (userRole === Checker) {
    return findMakerFromHistory({ actionHistoryListData });
  }
  return [];
};

const isCashflowStateNotChanged = (
  source: HistoryDataType,
  target: HistoryDataType
) => {
  return (
    source.Cashflow?.Cashflow_State === target.Cashflow?.Cashflow_State &&
    source.Cashflow?.Cashflow_Sub_State === target.Cashflow?.Cashflow_Sub_State
  );
};

export const histroyDataHandlingByPesetAction = (
  historyData: CashflowAuditTrail[]
): CashflowAuditTrail[] => {
  if (!(historyData instanceof Array)) return [];
  const historyDataCopy: HistoryDataType[] = cloneDeep(
    historyData.filter((item) => item.User_PSID?.toLowerCase() !== "system")
  );
  return historyDataCopy
    .filter((item) => item.Action && userActionList.includes(item.Action))
    .reverse();
};

// workflow: Pending Operator => Pending Verification => Pending Operator ... => Done.
// when maker/checker take actions, it will not trigger the final approve or reject right now.
// there are several actions before that.
// group those actions and insert into the next action record.
export const histroyDataHandling = (historyData: HistoryDataType[]) => {
  if (!(historyData instanceof Array)) return [];
  const historyDataCopy: HistoryDataType[] = cloneDeep(
    historyData.filter((item) => item.User_PSID?.toLowerCase() !== "system")
  );

  const rowsIndexToDel: number[] = [];
  let skipTill = 0;
  const childrenForNextState: HistoryDataType[] = [];
  for (let index = 0; index < historyDataCopy.length; index++) {
    if (index < skipTill) continue;
    const item = historyDataCopy[index];
    // now scope is only Pending Exception
    // READY is the first state after WAITING, and it's not Pending Exception.
    if (
      item?.Cashflow?.Cashflow_Sub_State_Type === "Pending Exception" ||
      Halt_States.includes(item?.Cashflow?.Cashflow_State as string)
    ) {
      if (childrenForNextState.length) {
        item.children = childrenForNextState.slice();
        childrenForNextState.splice(0);
      }
      for (
        let subIndex = index + 1;
        subIndex < historyDataCopy.length;
        subIndex++
      ) {
        const subItem = historyDataCopy[subIndex];
        if (
          subItem?.Cashflow?.Cashflow_Sub_State_Type === "Pending Exception" &&
          isCashflowStateNotChanged(item, subItem) &&
          !ActionHistoryKeyActions.includes(subItem.Action as string)
        ) {
          childrenForNextState.push(subItem);
          rowsIndexToDel.push(subIndex);
          skipTill = subIndex + 1;
        } else break;
      }
    }
  }
  return historyDataCopy
    .filter((_, i) => !rowsIndexToDel.includes(i))
    .reverse();
};

export const handleMissMatchedException = ({
  stampedVostro,
  cashflowDetails,
}: {
  stampedVostro: VostroFormDetails;
  cashflowDetails: GraphqlCashflowDetails;
}) => {
  const { ssiId } = stampedVostro;
  const targetVosto = (cashflowDetails.ratanVostroCandidates ?? []).find(
    (v) => v.SSI_Id === ssiId
  );
  if (targetVosto) {
    const targetVostoAlias = revertSSI(targetVosto);
    return {
      ...stampedVostro,
      ssiId,
      settlementAccount: targetVostoAlias.vostro.settlementAccount,
      settlementMeans: targetVostoAlias.vostro.settlementMeans,
    };
  } else {
    return {
      ...stampedVostro,
      settlementAccount: "",
      settlementMeans: "",
    };
  }
};

export const DEFAULT_SETTLEMENT_METHOD = "CASH";

/**
 * UseData hooks will used by multiple component and some component using by external repository.
 * So please be careful when you want to change or delete any code in this file, especially for any state from redux.
 * Splitting related params using by settlement cashflow splitting workflow only so far.
 */
type UseDataProps = {
  cashflowDetails: GraphqlCashflowDetails;
  isSplittingScene?: boolean;
  isSplittingDataAvailable?: boolean;
  currentSplittingData?: SplitTargetCashflow;
};

const useData = ({
  cashflowDetails,
  isSplittingScene = false,
  isSplittingDataAvailable = false,
  currentSplittingData = undefined,
}: UseDataProps) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile());
  const [actionHistoryListData, setActionHistoryListData] = useState<
    HistoryDataType[]
  >([]);
  const [vostroListData, setVostroListData] = useState<SSI[]>(
    cashflowDetails.ratanVostroCandidates ?? []
  );
  const [vostroDetailsData, setVostroDetailsData] =
    useState<VostroFormDetails>();
  const [nostroListData, setNostroListData] = useState<SSI[]>(
    cashflowDetails.ratanNostroCandidates ?? []
  );
  const [nostroDetailsData, setNostroDetailsData] =
    useState<NostroFormDetails>();
  const [affirmationDefaultFormData, setAffirmationDefaultFormData] =
    useState<AffirmationFormDataType | null>(null);
  const [backvalueDefaultFormData, setBackvalueDefaultFormData] =
    useState<BackValueFormDataType | null>(null);
  const [allCommonExceptionsData, setAllCommonExceptionsData] = useState<
    ExceptionItem[]
  >([]);
  const [isAdhocing, setIsAdhocing] = useState(false);
  const [isFixingMissingNostro, setIsFixingMissingNostro] = useState(false);
  const isPendingRequest = useContext(IsPendingRequestContext);
  const [settlementMethod, setSettlementMethod] = useState("");

  // maker submitted vostro/nostro display
  const [makerSubmittedData, setMakerSubmittedData] = useState<{
    [n: string]: any;
  }>({
    [MultiExceptionsNames.Vostro]: undefined,
    [MultiExceptionsNames.Nostro]: undefined,
    [MultiExceptionsNames.Affirmation]: undefined,
    [MultiExceptionsNames.Backvalue]: undefined,
  });
  const [isAuthLimit, setIsAuthLimit] = useState(true);

  const disableAllActions = useMemo(() => {
    if (isPendingRequest) return true;
    return ["hold"].includes(
      (
        cashflowDetails?.cashflow?.Cashflow?.Cashflow_State as string
      ).toLowerCase()
    );
  }, [cashflowDetails, isPendingRequest]);

  const cashflowState = useMemo(
    () => cashflowDetails?.cashflow?.Cashflow?.Cashflow_State,
    [cashflowDetails]
  );

  const cashflowSubState = useMemo(
    () =>
      <CashflowSubStateType>(
        cashflowDetails?.cashflow?.Cashflow?.Cashflow_Sub_State
      ),
    [cashflowDetails]
  );

  const cashflowSubStateType = useMemo(
    () => cashflowDetails?.cashflow?.Cashflow?.Cashflow_Sub_State_Type,
    [cashflowDetails]
  );

  const userRole = useMemo((): UserType => {
    if (
      userProfile === Verifier &&
      cashflowState === CashflowStateTypes.WAITING &&
      cashflowSubStateType === CashflowSubStateTypeTypes.PendingException &&
      cashflowSubState === CashflowSubStateTypes.PendingVerification
    ) {
      return Checker;
    } else if ([Submiter, Verifier].includes(userProfile)) {
      if (
        cashflowState === CashflowStateTypes.WAITING &&
        cashflowSubStateType === CashflowSubStateTypeTypes.PendingException &&
        cashflowSubState === CashflowSubStateTypes.PendingOperator
      )
        return Maker;
      else if (
        cashflowState === CashflowStateTypes.READY &&
        cashflowSubStateType !== CashflowSubStateTypeTypes.PendingAck
      )
        return Maker_Of_Ready_State;
    }
    return Visitor;
  }, [userProfile, cashflowSubState, cashflowState]);

  const isSubmitByYou = useMemo(() => {
    return findIfSubmitByYou(userRole, actionHistoryListData);
  }, [userRole, actionHistoryListData]);

  const initHistoryAndSICandidatesData = useCallback(
    (_cashflowDetails: GraphqlCashflowDetails) => {
      const originHistoryData = _cashflowDetails.cashflowAuditTrail ?? [];
      const historyData = histroyDataHandlingByPesetAction(originHistoryData);
      setActionHistoryListData(historyData);

      setVostroListData(_cashflowDetails.ratanVostroCandidates ?? []);
      setNostroListData(_cashflowDetails.ratanNostroCandidates ?? []);
    },
    []
  );

  const initSIData = useCallback(
    ({
      cashflowDetails,
      userRole,
      cashflowSubState,
    }: {
      cashflowDetails: GraphqlCashflowDetails;
      userRole: UserType;
      cashflowSubState: CashflowSubStateType;
    }) => {
      const { wrapper } = vostroInformExtractWrapper(cashflowDetails);
      // set settlement method from stamped si
      // if blank or null, then use default sm.
      // #5694802
      // fix in 11.09 release, allow blank str to be default
      // #6219556
      setSettlementMethod(
        cashflowDetails.cashflow?.Settlement_Instruction?.Settlement_Method ||
          DEFAULT_SETTLEMENT_METHOD
      );
      const allexceptions: ExceptionItem[] =
        cashflowDetails.ratanException ?? [];
      // si
      setIsAdhocing(false);
      setIsFixingMissingNostro(false);
      const vostroException = allexceptions.find(
        (exp) =>
          matchException(exp) === MultiExceptionsNames.Vostro &&
          exp.Status === CashflowSubState_ExceptionStatus[cashflowSubState]
      );
      const { vostro: stampedVostro, nostro: stampedNostro } = revertSSI(
        cashflowDetails.cashflow?.Settlement_Instruction
      );
      if (!vostroException) {
        // if no vostro exception, then query ssi information and display.
        setVostroDetailsData(wrapper(stampedVostro));
        setNostroDetailsData(stampedNostro);
      } else {
        // if has vostro exception, then conditional query maker submitted ssi.
        // 1. checker review
        // 2. maker review submitted data by self, others can't get the data.
        const {
          Maker_Request_Body,
          Maker_Id,
          Checker_Request_Body,
          Checker_Id,
        } = vostroException.Stashing ?? {};
        let fitVostro;
        let fitNostro;
        try {
          const makerInput = JSON.parse(
            emptyOrNilOptional(Maker_Request_Body, "{}") ?? "{}"
          );
          const { vostro, nostro } = revertSSI(makerInput);
          fitVostro = vostro;
          fitNostro = nostro;
        } catch (error) {}
        const { id } = getUser();
        const submitByYou = id === Maker_Id;
        const isCheckerReview = userRole === Checker && !submitByYou;
        const isMakerReview =
          [Submiter, Verifier].includes(userProfile) && submitByYou;
        if (isCheckerReview) {
          setMakerSubmittedData((o) => ({
            ...o,
            [MultiExceptionsNames.Vostro]: fitVostro,
            [MultiExceptionsNames.Nostro]: fitNostro,
          }));
          setNostroDetailsData(stampedNostro);
          let vostroToShownInCheckerView = cloneDeep(
            stampedVostro
          ) as VostroFormDetails;
          if (Checker_Id === id && Checker_Request_Body) {
            try {
              const checkerInput = JSON.parse(Checker_Request_Body);
              const { vostro, nostro } = revertSSI(checkerInput);
              vostroToShownInCheckerView = vostro;
              setNostroDetailsData(nostro);
            } catch {}
          } else if (isSSIMissMatchedException(vostroException)) {
            vostroToShownInCheckerView = handleMissMatchedException({
              stampedVostro,
              cashflowDetails,
            });
          }
          if (Maker_Request_Body) {
            // override from maker'g input
            vostroToShownInCheckerView = displayFieldsWhileChecker.reduce(
              (res, cur) => {
                res[cur] = fitVostro[cur];
                return res;
              },
              vostroToShownInCheckerView
            );
          }
          setVostroDetailsData(wrapper(vostroToShownInCheckerView));
        } else if (isMakerReview) {
          // in missing nostro, when maker get from input, duplicate fields will have value.
          if (
            isMissingNostroException(vostroException) &&
            !fitVostro.ssiType &&
            !fitVostro.swiftType
          ) {
            fitVostro.settlementAccount = "";
            fitVostro.settlementMeans = "";
          }
          fitVostro && setVostroDetailsData(wrapper(fitVostro));
          fitNostro && setNostroDetailsData(fitNostro);
        } else {
          setNostroDetailsData(stampedNostro);
          if (
            !(
              isMissingVostroException(vostroException) ||
              isMultiVostroException(vostroException)
            )
          ) {
            if (isSSIMissMatchedException(vostroException)) {
              setVostroDetailsData(
                wrapper(
                  handleMissMatchedException({
                    stampedVostro,
                    cashflowDetails,
                  })
                )
              );
            } else {
              setVostroDetailsData(wrapper(stampedVostro));
            }
          } else {
            setVostroDetailsData(wrapper(stampedVostro));
          }
        }
      }
    },
    []
  );

  /**
   * Normally for ssi data will auto populate settlement fields but in look up ssi do not.
   */
  const initUnAutoPopSIData = useCallback(
    ({ cashflowDetails }: { cashflowDetails: GraphqlCashflowDetails }) => {
      const { wrapper } = vostroInformExtractWrapper(cashflowDetails);
      setIsAdhocing(false);
      setIsFixingMissingNostro(false);
      setVostroDetailsData(wrapper(generateEmptyVostro()));
      setNostroDetailsData(generateEmptyNostro());
    },
    []
  );

  const initAffirmationData = useCallback(
    ({
      cashflowDetails,
      userRole,
      cashflowSubState,
      isSubmitByYou,
    }: {
      cashflowDetails: GraphqlCashflowDetails;
      userRole: UserType;
      cashflowSubState: CashflowSubStateType;
      isSubmitByYou: boolean;
    }) => {
      const allexceptions: ExceptionItem[] =
        cashflowDetails.ratanException ?? [];
      const checkerReview = userRole === Checker && !isSubmitByYou;
      const makerReview = userRole === Maker && isSubmitByYou;
      // affirmation
      const affirmationException = allexceptions.find(
        (exp) => matchException(exp) === MultiExceptionsNames.Affirmation
      );
      if (affirmationException) {
        if (affirmationException.Status?.toUpperCase() === "CLOSED") {
          // if no affirmation exception, then query affirmation information and display.
          setAffirmationDefaultFormData(cashflowDetails.ratanAffirmation ?? {});
        } else if (
          affirmationException.Status ===
          CashflowSubState_ExceptionStatus[cashflowSubState]
        ) {
          // if has affirmation exception, then conditional query maker submitted affirmation.
          // 1. checker review
          // 2. maker review submitted data by self, others can't get the data.
          if (checkerReview || makerReview) {
            setAffirmationDefaultFormData(
              convertAffirmationFormData2RatanAffirmation(
                findAffirmationDataFromExceptionsStashing([
                  affirmationException,
                ])
              )
            );
          }
        }
      } else if (cashflowDetails.ratanAffirmation) {
        setAffirmationDefaultFormData(cashflowDetails.ratanAffirmation);
      }
    },
    []
  );

  const initBackvalueData = useCallback(
    ({
      cashflowDetails,
      userRole,
      cashflowSubState,
    }: {
      cashflowDetails: GraphqlCashflowDetails;
      userRole: UserType;
      cashflowSubState: CashflowSubStateType;
    }) => {
      const allexceptions: ExceptionItem[] =
        cashflowDetails.ratanException ?? [];
      // backvalue
      const backvalueException = allexceptions.find(
        (exp) => matchException(exp) === MultiExceptionsNames.Backvalue
      );
      if (backvalueException) {
        if (backvalueException.Status?.toUpperCase() === "CLOSED") {
          // if no backvalue exception, then query backvalue information and display.
          setBackvalueDefaultFormData({
            swiftPaymentDate:
              cashflowDetails.cashflow?.Settlement_Instruction
                ?.Swift_Payment_Date ?? "",
          });
        } else if (
          backvalueException.Status ===
          CashflowSubState_ExceptionStatus[cashflowSubState]
        ) {
          const {
            Maker_Request_Body,
            Maker_Id,
            Checker_Id,
            Checker_Request_Body,
          } = backvalueException.Stashing ?? {};
          const { id } = getUser();
          const submitByYou = id === Maker_Id;
          const isCheckerReview = userRole === Checker && !submitByYou;
          const isMakerReview =
            [Submiter, Verifier].includes(userProfile) && submitByYou;
          // if has backvalue exception, then conditional query maker submitted backvalue info.
          let formData = {
            swiftPaymentDate: "",
          };
          try {
            formData = JSON.parse(
              emptyOrNilOptional(Maker_Request_Body, "{}") ?? "{}"
            );
          } catch (error) {}
          if (isCheckerReview) {
            setMakerSubmittedData((o) => ({
              ...o,
              [MultiExceptionsNames.Backvalue]: formData,
            }));
            if (Checker_Id === id && Checker_Request_Body) {
              try {
                const checkerInput = JSON.parse(Checker_Request_Body);
                setBackvalueDefaultFormData(checkerInput);
              } catch (error) {}
            }
          } else if (isMakerReview) {
            setBackvalueDefaultFormData(formData);
          }
        } else {
          const { Maker_Request_Body, Maker_Id } =
            backvalueException.Stashing ?? {};
          const { id } = getUser();
          const submitByYou = id === Maker_Id;
          if (submitByYou) {
            let formData = {
              swiftPaymentDate: "",
            };
            try {
              formData = JSON.parse(
                emptyOrNilOptional(Maker_Request_Body, "{}") ?? "{}"
              );
            } catch (error) {}
            setBackvalueDefaultFormData(formData);
          }
        }
      }
    },
    []
  );

  const initSourceData = useCallback(() => {
    setUserProfile(getUserProfile());
    initHistoryAndSICandidatesData(cashflowDetails);
    const allexceptions: ExceptionItem[] = cashflowDetails.ratanException ?? [];
    setAllCommonExceptionsData(allexceptions);

    if (isSplittingScene) {
      initUnAutoPopSIData({ cashflowDetails });
    } else {
      initSIData({ cashflowDetails, userRole, cashflowSubState });
    }

    initAffirmationData({
      cashflowDetails,
      userRole,
      cashflowSubState,
      isSubmitByYou,
    });

    initBackvalueData({ cashflowDetails, userRole, cashflowSubState });
  }, [cashflowDetails, userRole, cashflowSubState, isSubmitByYou]);

  const hasAuthLimit = useCallback((cashflowDetail: GraphqlCashflowDetails) => {
    if (
      cashflowDetail.cashflow?.Cashflow?.Cashflow_Sub_State ===
      CashflowSubStateTypes.PendingVerification
    ) {
      const profile = getUserRole();
      const currency = cashflowDetail.cashflow?.Cashflow?.Payment_Currency;
      const amount = cashflowDetail.cashflow?.Cashflow?.Payment_Amount;
      checkAuthLimit({
        profile,
        currency,
        amount,
      })
        .then((res) => {
          if (res?.success === false) {
            setIsAuthLimit(false);
          }
        })
        .catch((error: any) => {
          console.error(error);
        });
    } else {
      setIsAuthLimit(true);
    }
  }, []);

  /**
   * Init Data when met splitting scene and splitting data available
   * Once open look up ssi then do not process si data and set it directly
   */
  const handleSplittingSSIData = (data: SplitTargetCashflow | undefined) => {
    data?.vostroAccount && setVostroDetailsData(data?.vostroAccount);
    data?.nostroAccount && setNostroDetailsData(data?.nostroAccount);
  };

  const handleNormalSSIData = (cashflowDetails: GraphqlCashflowDetails) => {
    if (isValidGraphQLCashflowDetails(cashflowDetails)) {
      initSourceData();
      hasAuthLimit(cashflowDetails);
    }
  };

  useEffect(() => {
    if (isSplittingScene && isSplittingDataAvailable) {
      handleSplittingSSIData(currentSplittingData);
    }
  }, [isSplittingScene, isSplittingDataAvailable, currentSplittingData]);

  useEffect(() => {
    if (!isSplittingScene || !isSplittingDataAvailable) {
      handleNormalSSIData(cashflowDetails);
    }
  }, [isSplittingScene, isSplittingDataAvailable, cashflowDetails]);

  // exception status equal current cashflow state or adhoc ssi exception.
  const allAvailableCommonExceptionsData = useMemo(() => {
    return allCommonExceptionsData.filter(
      (exp) =>
        exp.Status === CashflowSubState_ExceptionStatus[cashflowSubState] ||
        isSSIGoodStamping(exp)
    );
  }, [cashflowSubState, allCommonExceptionsData]);

  const classifiedCommonExceptions = useMemo(() => {
    return allAvailableCommonExceptionsData.reduce<ClassifiedCommonExceptionsType>(
      (res, exp) => {
        const sectionName = matchException(exp);
        if (Object.keys(res).includes(sectionName)) {
          res[sectionName].push(exp);
        }
        return res;
      },
      {
        [MultiExceptionsNames.Vostro]: [],
        [MultiExceptionsNames.Affirmation]: [],
        [MultiExceptionsNames.Backvalue]: [],
        [MultiExceptionsNames.NSTP]: [],
        [MultiExceptionsNames.HIGH_RISK_NSTP]: [],
        [MultiExceptionsNames.HARD_BLOCKER]: [],
        [MultiExceptionsNames.Other]: [],
      }
    );
  }, [allAvailableCommonExceptionsData]);

  const handleSelectVostroRecord = useCallback(
    (record: VostroListDataType) => {
      const { wrapper } = vostroInformExtractWrapper(cashflowDetails);
      const { vostro } = revertSSI(record);
      setSettlementMethod(vostro.settlementMethod);
      setVostroDetailsData(wrapper(vostro));
    },
    [cashflowDetails]
  );

  const handleSelectNostroRecord = useCallback((record: NostroListDataType) => {
    const { nostro } = revertSSI(record);
    setNostroDetailsData(nostro);
  }, []);

  const exceptionsWithRejectAction = useMemo(() => {
    return allAvailableCommonExceptionsData.filter((e) =>
      e.Actions?.some(
        (a) =>
          a.Action_Name?.toLowerCase() ===
          ExceptionBundleStatusTypes.Reject.toLowerCase()
      )
    );
  }, [allAvailableCommonExceptionsData]);

  const hasHighRiskExceptions = useMemo(() => {
    return !!classifiedCommonExceptions[MultiExceptionsNames.HIGH_RISK_NSTP]
      .length;
  }, [classifiedCommonExceptions]);

  const hasRebookExceptions = useMemo(() => {
    return (
      !!classifiedCommonExceptions[MultiExceptionsNames.HIGH_RISK_NSTP]
        .length &&
      classifiedCommonExceptions[MultiExceptionsNames.HIGH_RISK_NSTP].some(
        (e) => isRebookException(e)
      )
    );
  }, [classifiedCommonExceptions]);

  const hasHighRiskExceptionsButNoPermission = useMemo(() => {
    return hasHighRiskExceptions && !hasHighRiskExceptionPermission();
  }, [hasHighRiskExceptions]);

  const hasHardBlockerExceptions = useMemo(() => {
    return !!classifiedCommonExceptions[MultiExceptionsNames.HARD_BLOCKER]
      .length;
  }, [classifiedCommonExceptions]);

  return {
    userProfile,
    userRole,
    cashflowSubState,
    isSubmitByYou,
    actionHistoryListData,
    vostroListData,
    vostroDetailsData,
    handleSelectVostroRecord,
    nostroListData,
    nostroDetailsData,
    handleSelectNostroRecord,
    affirmationDefaultFormData,
    backvalueDefaultFormData,
    allAvailableCommonExceptionsData,
    classifiedCommonExceptions,
    makerSubmittedData,
    disableAllActions,
    isAdhocing,
    setIsAdhocing,
    exceptionsWithRejectAction,
    hasHighRiskExceptions,
    hasHighRiskExceptionsButNoPermission,
    hasRebookExceptions,
    hasHardBlockerExceptions,
    isFixingMissingNostro,
    setIsFixingMissingNostro,
    isAuthLimit,
    settlementMethod,

    // used for testing
    initHistoryAndSICandidatesData,
    initBackvalueData,
    initAffirmationData,
    initSIData,
    hasAuthLimit,
  };
};

export default useData;
