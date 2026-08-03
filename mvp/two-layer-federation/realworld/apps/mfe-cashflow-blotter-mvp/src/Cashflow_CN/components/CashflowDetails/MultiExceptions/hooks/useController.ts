import cloneDeep from "lodash/cloneDeep";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import {
  CashflowSubStateType,
  CashflowSubStateTypes,
  Checker,
  Maker,
  Maker_Of_Ready_State,
  MultiExceptionsNames,
  UserType,
  Visitor,
} from "../common/interface";
import {
  ADHOC,
  EDIT,
  extractMeaningfulTitleOfSSIException,
  FIXING_MISSING_NOSTRO,
  isMissingNostroException,
  isSSIGoodStamping,
} from "../common/utils";
import {
  ClassifiedCommonExceptionsType,
  LayoutAvailableActions,
  LayoutItemProperty,
  LayoutSetting,
} from "./interface";

const defaultLayoutSetting: { [e: string]: LayoutItemProperty } = {
  [MultiExceptionsNames.Vostro]: {
    show: true,
    disable: true,
    title: "Vostro",
  },
  [MultiExceptionsNames.Nostro]: {
    show: true,
    disable: true,
    title: "Nostro",
  },
  [MultiExceptionsNames.Affirmation]: {
    show: true,
    disable: true,
    title: "Cashflow Affirmation",
  },
  [MultiExceptionsNames.Backvalue]: {
    show: true,
    disable: true,
    title: "Back Value",
  },
  [MultiExceptionsNames.NSTP]: {
    show: true,
    disable: true,
    title: "Exceptions",
  },
  [MultiExceptionsNames.Other]: {
    show: true,
    disable: true,
    title: "Other Exceptions",
  },
  [MultiExceptionsNames.Comment]: {
    show: true,
    title: "Comment",
  },
};

const COLOR_WARNING = "warning";

const renderTitleColor = ({ hasException }: { hasException?: boolean }) => {
  if (hasException) return COLOR_WARNING;
  return "";
};

export const renderTitle = ({
  title,
  hasException,
}: {
  title: string;
  hasException?: boolean;
}) => {
  return title + (hasException ? " Exception" : "");
};

export const AdhocingContext = createContext<{
  isAdhocing: boolean;
  setIsAdhocing: Dispatch<SetStateAction<boolean>>;
}>({
  isAdhocing: false,
  setIsAdhocing: () => {},
});

export const FixingMissingNostroContext = createContext<{
  isFixingMissingNostro: boolean;
  setIsFixingMissingNostro: Dispatch<SetStateAction<boolean>>;
}>({
  isFixingMissingNostro: false,
  setIsFixingMissingNostro: () => {},
});

export const isDisableAffirmation = (
  disableAllActions: boolean,
  hasAffirmationException: boolean,
  userRole: UserType
) => {
  return disableAllActions || !hasAffirmationException || userRole !== Maker;
};

const isDisableBackvalue = (
  disableAllActions: boolean,
  hasBackvalueException: boolean,
  isMakerReviewing: boolean,
  userRole: UserType
) => {
  return (
    disableAllActions ||
    !hasBackvalueException ||
    isMakerReviewing ||
    ![Maker, Checker].includes(userRole)
  );
};

const isVostroDefaultDisable = (
  hasSSIException: boolean,
  isMakerReviewing: boolean
) => {
  return !hasSSIException || isMakerReviewing;
};

const isDisableVostro = (
  disableAllActions: boolean,
  vostroDisable: boolean,
  userRole: UserType
) => {
  return disableAllActions || vostroDisable || userRole === Visitor;
};

const isDisableNostro = (
  disableAllActions: boolean,
  nostroDisable: boolean
) => {
  return disableAllActions || nostroDisable;
};

const getAvailableActions = (
  disableAllActions: boolean,
  userRole: UserType,
  availableActions: LayoutAvailableActions[]
) => {
  return disableAllActions || userRole === Visitor ? [] : availableActions;
};

const shouldShowComment = (
  disableAllActions: boolean,
  userRole: UserType,
  isSubmitByYou: boolean,
  isAdhocing: boolean
) => {
  const canUserComment =
    userRole === Maker ||
    (userRole === Checker && !isSubmitByYou) ||
    isAdhocing;
  return !disableAllActions && canUserComment;
};

export const setAffirmationDetails = (
  classifiedCommonExceptions: ClassifiedCommonExceptionsType
) => {
  const hasAffirmationException =
    !!classifiedCommonExceptions[MultiExceptionsNames.Affirmation]?.length;
  const affirmationTitle = hasAffirmationException
    ? classifiedCommonExceptions[MultiExceptionsNames.Affirmation][0]
        ?.Exception_Code
    : defaultLayoutSetting[MultiExceptionsNames.Affirmation].title;
  return { hasAffirmationException, affirmationTitle };
};

const setBackvalueDetails = (
  classifiedCommonExceptions: ClassifiedCommonExceptionsType
) => {
  const hasBackvalueException =
    !!classifiedCommonExceptions[MultiExceptionsNames.Backvalue]?.length;
  const backvalueTitle = hasBackvalueException
    ? classifiedCommonExceptions[MultiExceptionsNames.Backvalue][0]
        ?.Exception_Code
    : defaultLayoutSetting[MultiExceptionsNames.Backvalue].title;
  return { hasBackvalueException, backvalueTitle };
};

const hasVostroSSIGoodStamping = (
  classifiedCommonExceptions: ClassifiedCommonExceptionsType
) => {
  return (
    classifiedCommonExceptions[MultiExceptionsNames.Vostro].length === 1 &&
    isSSIGoodStamping(
      classifiedCommonExceptions[MultiExceptionsNames.Vostro][0]
    )
  );
};

const hasVostroSSIException = (
  classifiedCommonExceptions: ClassifiedCommonExceptionsType,
  hasSSIGoodStamping: boolean
) => {
  return (
    !!classifiedCommonExceptions[MultiExceptionsNames.Vostro]?.length &&
    !hasSSIGoodStamping
  );
};

export const isSSIGoodStampingException = (
  hasSSIGoodStamping: boolean,
  isMakerReviewing: boolean
) => {
  return hasSSIGoodStamping && !isMakerReviewing;
};
const useController = ({
  classifiedCommonExceptions,
  userRole,
  cashflowSubState,
  isSubmitByYou,
  disableAllActions,
  isAdhocing,
  isFixingMissingNostro,
}: {
  classifiedCommonExceptions: ClassifiedCommonExceptionsType;
  userRole: UserType;
  cashflowSubState: CashflowSubStateType;
  isSubmitByYou: boolean;
  disableAllActions: boolean;
  isAdhocing: boolean;
  isFixingMissingNostro: boolean;
}) => {
  const [layoutSetting, setLayoutSetting] = useState<LayoutSetting>(
    cloneDeep(defaultLayoutSetting)
  );
  useEffect(() => {
    const newLayoutSetting: LayoutSetting = cloneDeep(defaultLayoutSetting);
    let isMakerReviewing = false;
    if (cashflowSubState === CashflowSubStateTypes.PendingVerification) {
      isMakerReviewing = isSubmitByYou;
    }
    // common exceptions, nstp & other
    const commonExceptions = [
      MultiExceptionsNames.NSTP,
      MultiExceptionsNames.Other,
    ];
    commonExceptions.forEach((exceptionName) => {
      newLayoutSetting[exceptionName] = {
        ...newLayoutSetting[exceptionName],
        // titleColor: renderTitleColor({ hasException }),
        disable: disableAllActions,
      };
    });

    // affirmation
    const { hasAffirmationException, affirmationTitle } = setAffirmationDetails(
      classifiedCommonExceptions
    );
    newLayoutSetting[MultiExceptionsNames.Affirmation] = {
      title: affirmationTitle + "",
      titleColor: renderTitleColor({ hasException: hasAffirmationException }),
      show: true,
      disable: isDisableAffirmation(
        disableAllActions,
        hasAffirmationException,
        userRole
      ),
    };

    // backvalue
    const { hasBackvalueException, backvalueTitle } = setBackvalueDetails(
      classifiedCommonExceptions
    );
    newLayoutSetting[MultiExceptionsNames.Backvalue] = {
      title: backvalueTitle + "",
      titleColor: renderTitleColor({ hasException: hasBackvalueException }),
      show: true,
      disable: isDisableBackvalue(
        disableAllActions,
        hasBackvalueException,
        isMakerReviewing,
        userRole
      ), // double blind validate
    };

    // Vostro
    let vostroTitle = "Vostro SI Information";
    let nostroTitle = "Nostro SI Information";
    let vostroTitleColor = "";
    let nostroTitleColor = "";
    const hasSSIGoodStamping = hasVostroSSIGoodStamping(
      classifiedCommonExceptions
    );
    const hasSSIException = hasVostroSSIException(
      classifiedCommonExceptions,
      hasSSIGoodStamping
    );

    // no ssi exception or maker review or ssi exception on nostro.
    let vostroDisable = isVostroDefaultDisable(
      hasSSIException,
      isMakerReviewing
    );
    let nostroDisable = true;
    const vostroAvailableActions: LayoutAvailableActions[] = [];
    const nostroAvailableActions: LayoutAvailableActions[] = [];
    if (hasSSIException) {
      if (!isMakerReviewing) nostroAvailableActions.push(EDIT);
      if (
        isMissingNostroException(
          classifiedCommonExceptions[MultiExceptionsNames.Vostro][0]
        )
      ) {
        nostroTitle = renderTitle({
          title: extractMeaningfulTitleOfSSIException(
            classifiedCommonExceptions[MultiExceptionsNames.Vostro][0]
          ),
          hasException: true,
        });
        nostroTitleColor = COLOR_WARNING;
        nostroAvailableActions.splice(0);
        nostroAvailableActions.push(FIXING_MISSING_NOSTRO);
        if (isFixingMissingNostro) {
          vostroDisable = false;
        } else {
          vostroDisable = true;
        }
      } else {
        vostroTitle = renderTitle({
          title: extractMeaningfulTitleOfSSIException(
            classifiedCommonExceptions[MultiExceptionsNames.Vostro][0]
          ),
          hasException: true,
        });
        vostroTitleColor = COLOR_WARNING;
      }
    } else if (
      isSSIGoodStampingException(hasSSIGoodStamping, isMakerReviewing)
    ) {
      if (isAdhocing) {
        vostroTitle = "Adhoc SSI - Vostro";
        nostroTitle = "Adhoc SSI - Nostro";
        vostroDisable = false;
        nostroDisable = false;
      } else if ([Maker, Maker_Of_Ready_State].includes(userRole)) {
        // when good ssi stamp
        vostroAvailableActions.push(ADHOC);
      }
    }
    newLayoutSetting[MultiExceptionsNames.Vostro] = {
      title: vostroTitle,
      titleColor: vostroTitleColor,
      show: true,
      disable: isDisableVostro(disableAllActions, vostroDisable, userRole),
      availableActions: getAvailableActions(
        disableAllActions,
        userRole,
        vostroAvailableActions
      ),
    };

    // Nostro
    newLayoutSetting[MultiExceptionsNames.Nostro] = {
      title: nostroTitle,
      titleColor: nostroTitleColor,
      show: true,
      disable: isDisableNostro(disableAllActions, nostroDisable),
      availableActions: getAvailableActions(
        disableAllActions,
        userRole,
        nostroAvailableActions
      ),
    };

    // comment
    newLayoutSetting[MultiExceptionsNames.Comment] = {
      ...newLayoutSetting[MultiExceptionsNames.Comment],
      show: shouldShowComment(
        disableAllActions,
        userRole,
        isSubmitByYou,
        isAdhocing
      ),
    };

    setLayoutSetting(newLayoutSetting);
  }, [
    classifiedCommonExceptions,
    cashflowSubState,
    isSubmitByYou,
    disableAllActions,
    isAdhocing,
    isFixingMissingNostro,
    userRole,
  ]);
  return {
    layoutSetting,
  };
};

export default useController;
