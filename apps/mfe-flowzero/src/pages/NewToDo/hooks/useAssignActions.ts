import type { GridApi } from "ag-grid-community";
import { message } from "antd";
import { useCallback, useRef, useState } from "react";
import { batchAssignTasks, batchClaimTasks } from "src/api/task/Task";
import type { BatchItemResultVo } from "src/types/task";
import type { AssignableUserVo, TodoItem } from "src/types/todo";

export interface UseAssignActionsParams {
  currentUserId: string;
  gridApi: GridApi | null;
  pageDataCache: React.MutableRefObject<Map<number, TodoItem[]>>;
  clearTableState: () => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<TodoItem[]>>;
}

export const useAssignActions = ({
  currentUserId,
  gridApi,
  pageDataCache,
  clearTableState,
  setSelectedRows,
}: UseAssignActionsParams) => {
  const [assignVisible, setAssignVisible] = useState(false);
  const [assignTargetRows, setAssignTargetRows] = useState<TodoItem[]>([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);

  const handleClaimRef = useRef<(rows: TodoItem[]) => void>(() => {});
  const handleAssignOpenRef = useRef<(rows: TodoItem[]) => void>(() => {});
  const handleDirectAssignRef = useRef<(row: TodoItem) => void>(() => {});

  const handleClaim = useCallback(
    async (rows: TodoItem[]) => {
      const ids = rows.map((r) => r.taskId).filter(Boolean);
      if (!ids.length) return;
      setClaimLoading(true);
      try {
        const result = await batchClaimTasks({
          IdList: ids,
          toUserId: currentUserId,
        });
        if (result.status === "PARTIAL_SUCCESS" || result.status === "FAILED") {
          const successCount = (result.results ?? []).filter(
            (r: BatchItemResultVo) => r.status === "SUCCESS"
          ).length;
          const failCount = (result.results ?? []).filter(
            (r: BatchItemResultVo) => r.status === "FAILED"
          ).length;
          const failedTasks = (result.results ?? []).filter(
            (r: BatchItemResultVo) => r.status === "FAILED"
          );
          const failedTaskIds = failedTasks
            .map((t: BatchItemResultVo) => `${t.id}`)
            .join(", ");
          const failCountLabel = failCount > 1 ? "tasks" : "task";
          message.warning(
            `${successCount} ${
              successCount > 1 ? "tasks" : "task"
            } Assign successfully, ${failCount} ${failCountLabel} failed. Task ID ${failedTaskIds} has already been claimed!`
          );
        } else {
          message.success(
            ids.length === 1
              ? "Assign Successfully"
              : `${ids.length} ${
                  ids.length > 1 ? "tasks" : "task"
                } Assign successfully`
          );
        }
        if (gridApi) {
          pageDataCache.current.clear();
          clearTableState();
          gridApi.refreshInfiniteCache();
          setSelectedRows([]);
        }
      } catch {
        message.error("Failed to Assign task");
      } finally {
        setClaimLoading(false);
      }
    },
    [currentUserId, gridApi] // eslint-disable-line react-hooks/exhaustive-deps
  );

  handleClaimRef.current = handleClaim;

  const handleAssignOpen = useCallback((rows: TodoItem[]) => {
    setAssignTargetRows(rows);
    setAssignVisible(true);
  }, []);

  handleAssignOpenRef.current = handleAssignOpen;

  const handleDirectAssign = useCallback(
    async (row: TodoItem) => {
      const taskId = row?.taskId;
      if (!taskId) return;
      try {
        if (row.candidateUser) {
          await batchClaimTasks({ IdList: [taskId], toUserId: currentUserId });
        } else {
          await batchAssignTasks({ IdList: [taskId], toUserId: currentUserId });
        }
        message.success("Assign Successfully");
        if (gridApi) {
          pageDataCache.current.clear();
          clearTableState();
          gridApi.refreshInfiniteCache();
          setSelectedRows([]);
        }
      } catch {
        message.error("Failed to assign task");
      }
    },
    [currentUserId, gridApi] // eslint-disable-line react-hooks/exhaustive-deps
  );

  handleDirectAssignRef.current = handleDirectAssign;

  const handleAssignConfirm = async (user: AssignableUserVo) => {
    // Rows with candidateUser → claim (assign to current user)
    // Rows without candidateUser (candidateGroup only) → assign to selected user
    const claimRows = assignTargetRows.filter((r) => r.candidateUser);
    const assignRows = assignTargetRows.filter((r) => !r.candidateUser);

    const claimIds = claimRows.map((r) => r.taskId).filter(Boolean);
    const assignIds = assignRows.map((r) => r.taskId).filter(Boolean);

    if (!claimIds.length && !assignIds.length) return;
    setAssignLoading(true);

    try {
      const [claimResult, assignResult] = await Promise.all([
        claimIds.length
          ? batchClaimTasks({ IdList: claimIds, toUserId: currentUserId })
          : Promise.resolve(null),
        assignIds.length
          ? batchAssignTasks({ IdList: assignIds, toUserId: user.bankId })
          : Promise.resolve(null),
      ]);

      setAssignVisible(false);

      let totalSuccess = 0;
      let totalFail = 0;
      const failedIds: string[] = [];

      for (const result of [claimResult, assignResult]) {
        if (!result) continue;
        if (result.status === "PARTIAL_SUCCESS" || result.status === "FAILED") {
          totalSuccess += (result.results ?? []).filter(
            (r: BatchItemResultVo) => r.status === "SUCCESS"
          ).length;
          const failed = (result.results ?? []).filter(
            (r: BatchItemResultVo) => r.status === "FAILED"
          );
          totalFail += failed.length;
          failedIds.push(...failed.map((t: BatchItemResultVo) => `${t.id}`));
        } else {
          totalSuccess +=
            claimResult === result ? claimIds.length : assignIds.length;
        }
      }

      if (totalFail > 0) {
        const failCountLabel = totalFail > 1 ? "tasks" : "task";
        message.warning(
          `${totalSuccess} ${
            totalSuccess > 1 ? "tasks" : "task"
          } processed successfully, ${totalFail} ${failCountLabel} failed. Task ID ${failedIds.join(
            ", "
          )} failed!`
        );
      } else {
        const total = claimIds.length + assignIds.length;
        message.success(
          total === 1
            ? "Assign Successfully"
            : `${total} ${total > 1 ? "tasks" : "task"} assigned to ${
                user.userName
              } successfully`
        );
      }

      if (gridApi) {
        pageDataCache.current.clear();
        clearTableState();
        gridApi.refreshInfiniteCache();
        setSelectedRows([]);
      }
    } catch {
      message.error("Failed to assign task");
    } finally {
      setAssignLoading(false);
    }
  };

  return {
    assignVisible,
    setAssignVisible,
    assignTargetRows,
    assignLoading,
    claimLoading,
    handleClaimRef,
    handleAssignOpenRef,
    handleDirectAssignRef,
    handleAssignConfirm,
  };
};
