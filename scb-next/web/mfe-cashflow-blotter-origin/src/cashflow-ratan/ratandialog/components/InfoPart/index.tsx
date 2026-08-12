import React, { FC, memo } from "react";
import { RootStyle, classes } from "./style";

interface InfoPartProps {
  className?: string;
  partDetail: any;
  details: any;
  item: any;
}

export const InfoPart: FC<InfoPartProps> = memo(
  ({ className, partDetail, details, item }) => {
    return (
      <RootStyle className={className}>
        <div className={classes.partHeader}>
          {item.key}
          {details[item.value] ? `: ${details[item.value]}` : ""}
        </div>
        <table>
          <tbody>
            {partDetail.map((detailItem: any, index: number) => {
              return (
                <tr key={detailItem.key}>
                  <td>{detailItem.key}</td>
                  <td>{details[detailItem.value]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </RootStyle>
    );
  }
);
