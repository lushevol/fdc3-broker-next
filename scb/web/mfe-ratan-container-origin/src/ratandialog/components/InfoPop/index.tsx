import React, { FC, memo } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { IconButton } from "@mui/material";
import { RootStyle, classes } from "./style";

interface InfoPopProps {
  popDetail: any;
  details: any;
  detailItem: any;
}

export const InfoPop: FC<InfoPopProps> = memo(
  ({ popDetail, details, detailItem }) => {
    return (
      <RootStyle
        trigger="click"
        content={
          <div className={classes.infoContentPop}>
            <table>
              <tbody>
                {popDetail.map((popDetailItem: any, index: number) => {
                  return (
                    <tr key={popDetailItem.key}>
                      <td>{popDetailItem.key}</td>
                      <td>{details[popDetailItem.value]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        }
      >
        <IconButton
          className={classes.infoPopoverbtn}
          id={`cashflow-counterparty-${detailItem.key}`}
          data-testid={`cashflow-counterparty-${detailItem.key}`}
        >
          <InfoIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </RootStyle>
    );
  }
);
