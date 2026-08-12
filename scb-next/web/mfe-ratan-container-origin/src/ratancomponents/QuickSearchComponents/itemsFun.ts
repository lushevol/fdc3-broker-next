import { MessageInstance } from "antd/es/message/interface";
import {
  queryCounterpartyDynamicList,
  queryFetchPortfolio,
} from "../../ratanutils/http/graphql";
const formatReferenceData = (data, fieldName) => {
  let newArrary = [];
  if (data && data.length >= 1) {
    newArrary = data.map((item: any) => {
      let value = "";
      if (fieldName === "lmp_long_name") {
        value = item.lmp_long_name;
      } else {
        value = item.fm_profile_sys_gen_id;
      }
      return {
        label: value,
        value,
      };
    });
  }
  return newArrary;
};
interface ConterPartyApiResponse {
  fmId: string;
  counterpartyLongName: string;
}
export function debounceFindConterparty(
  value: string,
  fieldName: string,
  callback: (result: { label: string; value: string }[]) => void,
  messageApi: MessageInstance,
  label: string
) {
  System.import("@fm/ratan_trades").then((root) => {
    const { queryConterParty } = root.TradeApi;
    queryConterParty(value).then((data: ConterPartyApiResponse[]) => {
      const re = data.map((item) => {
        const returnItem = {
          label: `${item.fmId} | ${item.counterpartyLongName}`,
          value: `${item.fmId}`,
        };
        if (fieldName != "fmId") {
          returnItem.value = item[fieldName];
        }
        return returnItem;
      });
      if (data.length == 0) {
        messageApi?.info(`[${label}] No data found`);
      }
      callback(re);
    });
  });
}

export function debounceGetDynamicList(
  searchName: string,
  fieldName: string,
  callback: (result: string[]) => void,
  messageApi?: MessageInstance,
  label?: string
) {
  let newArrary: any[] = [];
  if (searchName.length >= 1) {
    if (searchName.length === 1 && fieldName !== "fm_profile_sys_gen_id") {
      callback(newArrary);
      messageApi?.info("Please input more than two characters !");
      return;
    }
    queryCounterpartyDynamicList(fieldName, searchName)
      .then((res: any) => {
        newArrary = formatReferenceData(res.referenceData, fieldName);
        if (newArrary.length == 0) {
          messageApi?.info(`[${label}] No data found`);
        }
        callback(newArrary);
      })
      .catch(() => callback(newArrary));
  } else {
    callback(newArrary);
  }
}

export function getDynamicListForPortfolio(
  searchName: string,
  fieldName: string,
  callback: (result: string[]) => void,
  messageApi?: MessageInstance,
  label?: string
) {
  let newArrary: any[] = [];

  if (searchName.length === 1) {
    callback(newArrary);
    messageApi?.info("Please input more than two characters !");
  } else if (searchName.length >= 1) {
    queryFetchPortfolio(searchName)
      .then((res: any) => {
        if (res?.fetchPortfolio.length > 0) {
          newArrary = res.fetchPortfolio.map((item: any) => {
            return {
              label: item.Name,
              value: item.Name,
            };
          });
        } else {
          messageApi?.info(`[${label}] No data found`);
        }
      })
      .catch((error: any) => messageApi?.error(error.message))
      .finally(() => {
        callback(newArrary);
      });
  } else {
    callback(newArrary);
  }
}
