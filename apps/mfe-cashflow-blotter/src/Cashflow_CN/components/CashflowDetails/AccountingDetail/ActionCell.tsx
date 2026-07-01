import { useCallback, useState } from "react";
import { ACCOUNTING_DETAILS_REPUBLISH_BTN } from "src/Root/analysis/const";
import { Button } from "src/Root/import";

import { republishableTaskStatusList } from "./const";
import { AggridCustomCellProps } from "./type";

export const shouldRenderRepublishButton = (
  props: AggridCustomCellProps
): boolean => {
  const { data, rowIndex } = props;
  if (data.taskStatus === "MISSING_INFO") return true;
  return (
    republishableTaskStatusList.includes(data.taskStatus) && rowIndex % 2 === 0
  );
};

export const AccountingActionCell = (props: AggridCustomCellProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data, triggerRepublish } = props;

  const onClick = useCallback(async () => {
    try {
      setIsLoading(true);
      await triggerRepublish([data.externalSystemKey]);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  return shouldRenderRepublishButton(props) ? (
    <Button
      onClick={onClick}
      size="medium"
      variant="contained"
      loading={isLoading}
      data-testid={ACCOUNTING_DETAILS_REPUBLISH_BTN}
    >
      Republish
    </Button>
  ) : (
    <></>
  );
};
