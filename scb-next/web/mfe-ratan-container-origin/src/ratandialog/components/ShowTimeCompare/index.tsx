import { FC } from "react";
import { Time, ContainerProvider } from "../../../Root/import/index";
import { timeCompare } from "../../../ratanutils/utils";

interface ShowTimeCompareProps {
  data: any;
}
export const ShowTimeCompare: FC<ShowTimeCompareProps> = ({ data }) => {
  const [ContainerStore] = ContainerProvider.useContext();
  const timeType = ContainerStore?.timeType || "utc";
  const compareTime = timeCompare(data.Cashflow.Payment_Cutoff_Time);
  const cutOffHighLight = 3;
  let className = "";

  if (parseInt(compareTime) < cutOffHighLight) {
    className = "key-data-show-cut-off-red";
  }
  return (
    <td className={className}>
      <Time
        value={data.Cashflow.Payment_Cutoff_Time}
        field="Cashflow.Payment_Cutoff_Time"
      />
      {timeType === "utc" ? "(UTC)" : ""}
    </td>
  );
};
