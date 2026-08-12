import { FC, useEffect, useState } from "react";
import cn from "classnames";
import { Loading } from "../../ratancomponents/Loading";
import { queryHolidy } from "../../ratanutils/http/api";
import holidayDB from "../../ratanutils/holidayDB";
import { Time } from "../../Root/import";
import StyledRoot, { classes } from "./style";

const holidayQueryStore = new Map();
let timeOut: any;
function waitQuery(params: any, callback: Function) {
  const paramString = `${params.eventDate}-${params.currencyCode}`;

  if (timeOut) {
    clearTimeout(timeOut);
  }

  if (holidayQueryStore.has(paramString)) {
    holidayQueryStore.set(paramString, {
      params,
      callbacks: [...holidayQueryStore.get(paramString).callbacks, callback],
      isLoading: false,
    });
  } else {
    holidayQueryStore.set(paramString, {
      params,
      callbacks: [callback],
      isLoading: false,
    });
  }

  timeOut = setTimeout(() => {
    const allParams: any = [];
    holidayQueryStore.forEach((item, key) => {
      if (!item.isLoading) {
        allParams.push(item.params);
        holidayQueryStore.set(key, { ...item, isLoading: true });
      }
    });

    if (allParams.length) {
      queryHolidy(allParams)
        .then((data: any) => {
          data?.forEach((item: any) => {
            const params = `${item.eventDate}-${item.currencyCode}`;
            if (holidayQueryStore.has(params)) {
              const callbacks = holidayQueryStore.get(params).callbacks;
              callbacks.forEach((callback: Function) => {
                callback(item.eventName);
              });
              holidayDB.add(item.eventName, params);
              holidayQueryStore.delete(params);
            }
          });
        })
        .catch(() => {
          allParams.forEach((item: any) => {
            const params = `${item.eventDate}-${item.currencyCode}`;
            if (holidayQueryStore.has(params)) {
              const callbacks = holidayQueryStore.get(params).callbacks;
              callbacks.forEach((callback: Function) => {
                callback(null);
              });
            }
          });
        });
    }
  }, 1000);
}

interface CellProps {
  value: any;
  isAccurateToDay?: Boolean;
  field: string;
  colDef?: {
    field: string;
  };
  data: any;
}

export const HandleHoliday: FC<CellProps> = (props) => {
  const [holiday, setHoliday] = useState<string>();
  const className = cn(classes.root, { "in-holiday": !!holiday });
  const data = props.data;

  useEffect(() => {
    const params = `${data.Cashflow.Payment_Date?.split("T")[0]}-${
      data.Cashflow.Payment_Currency
    }`;
    holidayDB.get(params).then((holidayName: any) => {
      if (typeof holidayName !== "undefined") {
        setHoliday(holidayName);
      } else {
        waitQuery(
          {
            eventDate: data.Cashflow.Payment_Date?.split("T")[0],
            currencyCode: data.Cashflow.Payment_Currency,
            cashflowId: data.Cashflow.Cashflow_Id,
          },
          setHoliday
        );
      }
    });
  }, []);

  return (
    <StyledRoot>
      <div className={className} title={holiday}>
        <Time {...props} />
        <Loading loading={typeof holiday === "undefined"} size={14} />
      </div>
    </StyledRoot>
  );
};
