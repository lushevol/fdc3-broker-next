import { Collapse } from "antd";
import React, { FC, PropsWithChildren } from "react";

import { classes } from "../styles/DialogStyle";
import { CashflowEligibleResult } from "../type";

export const BulkDialogLayout: FC<
  PropsWithChildren<{ classifiedCashflows: CashflowEligibleResult }>
> = ({ classifiedCashflows, children }) => {
  const [EligibleCashflowTable, ExtraForm, InsufficientCashflowTable] =
    React.Children.toArray(children);
  return (
    <div className={classes.body} data-testid={classes.body}>
      <div className={classes.eligibleTable}>{EligibleCashflowTable}</div>
      <div className={classes.extraForm}>{ExtraForm}</div>
      <div className={classes.insufficientTable}>
        {!!classifiedCashflows.insufficientForBulk.cashflows.length && (
          <Collapse
            items={[
              {
                key: "insufficientCashflows",
                label: `${classifiedCashflows.insufficientForBulk.cashflows.length} cashflows insufficient for bulk operation`,
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
