import { message } from "antd";
import React, {
  createContext,
  FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import { CommonUtil } from "src/Root/import";
import { useRatanDispatcher } from "src/Root/import/ratancomponents";

import json from "../../../package.json";
import LimitationDetailsDialog from "../components/DetailsDialog";
import { LimitationDetailsDialogProps } from "../components/DetailsDialog/interface";
import LimitationDataGrid from "../components/LimitationDataGrid";
import OperationActions from "../components/OperationActions";
import getServices from "../services";
import {
  LimitationActionType,
  LimitationRecord,
  LimitationSearchParams,
  MainProps,
  UserRole,
} from "./common/interface";
import StyledRoot, { classes } from "./style";
import {
  getUserRole,
  hasViewPermission,
  isSameLimitationRecord,
} from "./utils";
const {
  getLimitationList,
  updateLimitation,
  createLimitation,
  deleteLimitation,
  approveActionLimitation,
  rejectActionLimitation,
} = getServices();

const INIT_SEARCH_PARAMS: LimitationSearchParams = {
  profiles: [],
  currencies: [],
};

export const UserRoleContext = createContext<UserRole>("Visitor");

const App: FC<MainProps> = () => {
  const [userRole] = useState(getUserRole());
  const [searchParams] = useState<LimitationSearchParams>(INIT_SEARCH_PARAMS);
  const [limitationDataList, setLimitationDataList] = useState<
    LimitationRecord[]
  >([]);
  const [limitationDetailsDialogData, setLimitationDetailsDialogData] =
    useState<Pick<LimitationDetailsDialogProps, "open" | "data" | "type">>({
      open: false,
      type: LimitationActionType.VIEW,
    });
  const [messageApi, messageContextHolder] = message.useMessage();
  const { dispatchVersionState, dispatchApiStatusList } = useRatanDispatcher();
  useEffect(() => {
    // initial grid list
    refreshLimitationList();
  }, []);
  const refreshLimitationList = useCallback(() => {
    getLimitationList(searchParams).then((res) => {
      setLimitationDataList(res.filter((r) => !r.deleted));
    });
  }, [searchParams]);
  const updateLimitationRecord = useCallback((data?: LimitationRecord) => {
    if (data) {
      if (!data.deleted) {
        setLimitationDataList((list) => {
          return list.map((i) => {
            if (isSameLimitationRecord(i, data)) {
              return data;
            } else return i;
          });
        });
      } else {
        setLimitationDataList((list) =>
          list.filter((item) => !isSameLimitationRecord(item, data))
        );
      }
    }
  }, []);
  const handleSubmit = useCallback(
    async (data: LimitationRecord) => {
      if (limitationDetailsDialogData.type === LimitationActionType.CREATE) {
        const resp = await createLimitation(data);
        resp && setLimitationDataList((list) => [...list, resp]);
        messageApi.success("Submit Creating Limitation");
      } else if (
        limitationDetailsDialogData.type === LimitationActionType.EDIT
      ) {
        const resp = await updateLimitation(data);
        updateLimitationRecord(resp);
        messageApi.success("Submit Updating Limitation");
      }
      handleDialogClose();
    },
    [limitationDetailsDialogData]
  );
  const handleDelete = useCallback(async (data: LimitationRecord) => {
    const resp = await deleteLimitation(data);
    updateLimitationRecord(resp);
  }, []);
  const handleDialogClose = useCallback(() => {
    setLimitationDetailsDialogData({
      open: false,
      data: undefined,
      type: LimitationActionType.VIEW,
    });
  }, []);
  const handleOpenDetailsDialog = useCallback((open, data, type) => {
    setLimitationDetailsDialogData({ open, data, type });
  }, []);
  const handleCreatingNewLimitation = useCallback(() => {
    setLimitationDetailsDialogData({
      open: true,
      data: {
        profile: "",
        currency: "USD",
        limitation: 0,
      },
      type: LimitationActionType.CREATE,
    });
  }, []);
  const handleApproveLimitation = useCallback(
    async (data: LimitationRecord) => {
      const resp = await approveActionLimitation(data);
      updateLimitationRecord(resp);
    },
    []
  );
  const handleRejectLimitation = useCallback(async (data: LimitationRecord) => {
    const resp = await rejectActionLimitation(data);
    updateLimitationRecord(resp);
  }, []);
  useEffect(() => {
    dispatchVersionState({ version: json.version, env: CommonUtil.getEnv() });
    dispatchApiStatusList([]);
  }, []);
  return hasViewPermission() ? (
    <StyledRoot>
      {messageContextHolder}
      <UserRoleContext.Provider value={userRole}>
        <div className={classes.header}>
          <OperationActions
            onCreateNewLimitation={handleCreatingNewLimitation}
          />
        </div>
        <div className={classes.body}>
          <LimitationDataGrid
            gridData={limitationDataList}
            onOpenDetailsDialog={handleOpenDetailsDialog}
            onDeleteLimitation={handleDelete}
            onApproveAddLimitation={handleApproveLimitation}
            onRejectAddLimitation={handleRejectLimitation}
            onApproveDeleteLimitation={handleApproveLimitation}
            onRejectDeleteLimitation={handleRejectLimitation}
            onApproveEditLimitation={handleApproveLimitation}
            onRejectEditLimitation={handleRejectLimitation}
          />
        </div>
        <LimitationDetailsDialog
          {...limitationDetailsDialogData}
          onClose={handleDialogClose}
          onSubmit={handleSubmit}
        ></LimitationDetailsDialog>
      </UserRoleContext.Provider>
    </StyledRoot>
  ) : (
    <></>
  );
};

export default App;
