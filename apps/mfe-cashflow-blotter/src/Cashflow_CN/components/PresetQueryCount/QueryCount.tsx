import { Badge, BadgeProps, Button, styled } from "@mui/material";
import { FC, memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import { queryCashflow } from "src/Cashflow_CN/services/graphql";

import { matchFilters } from "../CashflowNotification/CashflowNotificationSubscriber";
import { consumeNotification } from "../CashflowNotification/NotificationConsumer";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -9,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    cursor: "pointer",
    fontSize: "0.7rem",
  },
}));

interface QueryResultCountProps {
  label: string;
  filters: Filter[];
  dataTestid: string;
  onQuery: (f: Filter[], key: string) => void;
  activeKey: string | null;
}

const countColor: (n: number) => BadgeProps["color"] = (count: number) => {
  if (count > 0) return "warning";
  return "primary";
};

const QueryResultCount: FC<QueryResultCountProps> = memo(
  ({ label, filters, onQuery, dataTestid, activeKey }) => {
    const [count, setCount] = useState<number>(0);
    const [matchedCashflows, setMatchedCashflows] = useState<CNCashflow[]>([]);
    const consumedNotificationStackId = useRef("");
    const latestNotificationStack = useSelector(
      (state: RootState) => state.latestNotificationStack
    );
    const opensearch = useSelector((state: RootState) => state.opensearch);
    useEffect(() => {
      if (filters.length) {
        (async () => {
          try {
            // BE CAREFULE, QUERY ONLY GET 1000 RECORDS !!!!
            const columnDefs = [{ field: "Cashflow.Cashflow_Id" }];
            const res = await queryCashflow({
              filters,
              columnDefs,
              disabledDefault: true,
              requireMandatoryFields: false,
              opensearch,
            });
            const { results, totalResult } = res?.cashflowUltraQuery || {};
            setCount(totalResult || 0);
            setMatchedCashflows(results || []);
          } catch (error: any) {}
        })();
      }
    }, [filters]);

    useEffect(() => {
      (async () => {
        if (
          consumedNotificationStackId.current !== latestNotificationStack.id &&
          latestNotificationStack.pool.length
        ) {
          const [hittedCashflows, droppedCashflows] = matchFilters(
            latestNotificationStack.pool.map((i) => i.Cashflow),
            filters
          );
          const { isUpdate, newTableDatas, paginationSizeOffset } =
            await consumeNotification({
              getCurrentTableDatas: () => Promise.resolve(matchedCashflows),
              dataToUpdates: hittedCashflows,
              dataToDelete: droppedCashflows,
              rowKey: "Cashflow.Cashflow_Id",
              isDataUpdated: () => true,
            });
          if (isUpdate) {
            setMatchedCashflows(newTableDatas!);
            setCount((c) => c + paginationSizeOffset!);
          }
          consumedNotificationStackId.current = latestNotificationStack.id;
        }
      })();
    }, [matchedCashflows, latestNotificationStack, filters]);
    return (
      <StyledBadge
        badgeContent={count}
        color={countColor(count)}
        showZero
        max={99}
        onClick={() => onQuery(filters, dataTestid)}
        title={"Total: " + count}
      >
        <Button
          variant="text"
          sx={{
            color:
              activeKey === dataTestid
                ? "#ffa726"
                : "var(--theme-color-modal-label)",
          }}
          data-testid={dataTestid}
        >
          {label}
        </Button>
      </StyledBadge>
    );
  }
);

export default QueryResultCount;
