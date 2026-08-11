import React, { FC } from "react";
import { formatDate, formatDateToISO, isDate } from "../../utils/common";
import { TimeProps } from "./common/interface";
import useController, {
  excludedList,
  includesArray,
} from "./common/useController";

export const Time: FC<TimeProps> = (props) => {
  const { store } = useController();
  const { value, isAccurateToDay = false, field = "", colDef } = props;
  let newIsAccurateToDay = isAccurateToDay;
  const nowField = field ?? colDef?.field;
  const regez = /^\d{4}-\d{2}-\d{2}$/;

  if (value === "null") return <></>;

  if (includesArray(excludedList, nowField)) {
    return <>{value}</>;
  } else if (
    nowField &&
    isDate(value) &&
    (`${value}`.includes("00:00:00") || regez.test(value))
  ) {
    newIsAccurateToDay = true;
  }

  return (
    <>
      {store.timeType?.toUpperCase() === "LOCAL"
        ? formatDate(value, newIsAccurateToDay)
        : formatDateToISO(value, newIsAccurateToDay)}
    </>
  );
};

export default React.memo(Time);
