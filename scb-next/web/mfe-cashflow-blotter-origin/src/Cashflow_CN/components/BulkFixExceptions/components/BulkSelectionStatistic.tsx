import { DescriptionsProps, Divider, Space, Typography } from "antd";
import { useMemo } from "react";

import { CashflowDisplay } from "../type";
import { exceptionStatisticByDisplayCashflows } from "../utils/statistic";

export const BulkSelectionStatistic = ({
  selectedCashflows,
}: {
  selectedCashflows: CashflowDisplay[];
}) => {
  const exceptionStatistic = useMemo(() => {
    const esm = exceptionStatisticByDisplayCashflows(selectedCashflows);
    const res: DescriptionsProps["items"] = [];
    esm.forEach((v, k) => {
      res.push({
        key: k,
        label: k,
        children: v,
      });
    });
    return res;
  }, [selectedCashflows]);

  return (
    <>
      {!!exceptionStatistic.length && (
        <Space
          split={<Divider type="vertical" />}
          data-testid="bulk-selection-statistic"
        >
          <span>
            <Typography.Text strong>Selected:&nbsp;</Typography.Text>
            <Typography.Text type="secondary">
              {selectedCashflows.length} cashflows
            </Typography.Text>
          </span>
          <span style={{ display: "flex", gap: "10px" }}>
            {exceptionStatistic.map((item) => (
              <span key={item.key}>
                <Typography.Text strong>{item.label}:&nbsp;</Typography.Text>
                <Typography.Text type="secondary">
                  {item.children}
                </Typography.Text>
              </span>
            ))}
          </span>
        </Space>
      )}
    </>
  );
};
