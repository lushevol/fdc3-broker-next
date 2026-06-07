import { Collapse } from "antd";
import React, { FC, PropsWithChildren } from "react";

import { classes } from "../style";
import { CashflowEligibleResult } from "../type";

export const DialogLayout: FC<
  PropsWithChildren<{ classifiedCashflows: CashflowEligibleResult }>
> = ({ classifiedCashflows, children }) => {
  const [EligibleCashflowTable, ExtraForm, InsufficientCashflowTable] =
    React.Children.toArray(children);
  return (
    <div className={classes.body} data-testid={classes.body}>
      <div className={classes.eligibleTable}>{EligibleCashflowTable}</div>
      <div className={classes.extraForm}>{ExtraForm}</div>
      <div className={classes.insufficientTable}>
        {!!classifiedCashflows.insufficientForUpdate.cashflows.length && (
          <Collapse
            items={[
              {
                key: "insufficientCashflows",
                label: `${classifiedCashflows.insufficientForUpdate.cashflows.length} cashflows insufficient for Settlement Method Update`,
                children: InsufficientCashflowTable,
              },
            ]}
            bordered={false}
          />
        )}
      </div>
    </div>
  );
};
