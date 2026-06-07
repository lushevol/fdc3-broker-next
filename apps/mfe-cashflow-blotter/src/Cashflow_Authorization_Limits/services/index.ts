import { Service } from "../../Root/import";
import {
  LimitationRecord,
  LimitationSearchParams,
} from "../Main/common/interface";
const { service } = Service;

const PREFIX = "/api/ratan";

const getServices = () => {
  const getLimitationList = async (
    payload: LimitationSearchParams
  ): Promise<LimitationRecord[]> => {
    try {
      const params = {
        profiles: payload.profiles.join(","),
        currencies: payload.currencies.join(","),
      };
      const resp = await service.get(
        `${PREFIX}/v1/profileLimitation${
          !params.profiles && !params.currencies ? "/" : ""
        }${params.profiles ? "/profiles/" + params.profiles : ""}${
          params.currencies ? "/currencies/" + params.currencies : ""
        }`
      );
      return resp;
    } catch (e) {}
    return [];
  };
  const createLimitation = async (
    payload: LimitationRecord
  ): Promise<LimitationRecord | undefined> => {
    try {
      const resp = await service.post(
        `${PREFIX}/v1/profileLimitation/create`,
        payload
      );
      return resp;
    } catch (e) {}
    return undefined;
  };
  const updateLimitation = async (
    payload: LimitationRecord
  ): Promise<LimitationRecord | undefined> => {
    try {
      const resp = await service.put(
        `${PREFIX}/v1/profileLimitation/edit`,
        payload
      );
      return resp;
    } catch (e) {}
    return undefined;
  };
  const approveActionLimitation = async (
    payload: LimitationRecord
  ): Promise<LimitationRecord | undefined> => {
    try {
      const { profile, currency, status } = payload;
      const resp = await service.put(
        `${PREFIX}/v1/profileLimitation/confirm/${profile}/${currency}/${status}`,
        payload
      );
      return resp;
    } catch (e) {}
    return undefined;
  };
  const rejectActionLimitation = async (
    payload: LimitationRecord
  ): Promise<LimitationRecord | undefined> => {
    try {
      const { profile, currency, status } = payload;
      const resp = await service.put(
        `${PREFIX}/v1/profileLimitation/reject/${profile}/${currency}/${status}`,
        payload
      );
      return resp;
    } catch (e) {}
    return undefined;
  };
  const deleteLimitation = async (
    payload: LimitationRecord
  ): Promise<LimitationRecord | undefined> => {
    try {
      const resp = await service.delete(
        `${PREFIX}/v1/profileLimitation${
          payload.profile ? "/" + payload.profile : ""
        }${payload.currency ? "/" + payload.currency : ""}`
      );
      return resp;
    } catch (e) {}
    return undefined;
  };
  return {
    getLimitationList,
    createLimitation,
    updateLimitation,
    deleteLimitation,
    approveActionLimitation,
    rejectActionLimitation,
  };
};

export default getServices;
