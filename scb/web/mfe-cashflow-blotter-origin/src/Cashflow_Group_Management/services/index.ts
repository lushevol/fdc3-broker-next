import { getWrappedAxiosService } from "src/Root/analysis";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";
import { Service } from "src/Root/import";

import { BlotterDataType } from "../Main/store/interface";

const service =
  featureScopedEnabled("Axios_GraphQL_Monitor_Wrapper") &&
  getWrappedAxiosService
    ? getWrappedAxiosService("/cashflow_blotter_cn/cashflow_group_management")
    : Service.service;

export const postManualSTP = (rows: BlotterDataType[]) =>
  service.post(
    "/api/ratan/v1/message/deliver",
    rows.map((r) => r.Id)
  );

export const postManualResend = (rows: BlotterDataType[]) =>
  service.post(
    "/api/ratan/v1/message/resend",
    rows.map((r) => r.Id)
  );
