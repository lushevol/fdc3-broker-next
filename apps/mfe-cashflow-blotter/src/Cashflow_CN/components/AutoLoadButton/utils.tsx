import { SelectionChangedEvent } from "ag-grid-community";
import { HookAPI } from "antd/es/modal/useModal";
import { selectionGridChanged } from "src/Cashflow_CN/Main/store/actions";

export const dataGridSelectionChangedHandler = (
  event: SelectionChangedEvent,
  dispatch,
  modalApi: HookAPI,
  cashflowListQueryPageSize: number
) => {
  const selectedDataCount = event.api.getSelectedRows().length;
  const displayDataCount = event.api.getDisplayedRowCount();
  const { isClientSelectAllDataButNotLoadAll, totalHits } = dispatch(
    selectionGridChanged(
      selectedDataCount,
      displayDataCount,
      cashflowListQueryPageSize
    )
  );
  if (isClientSelectAllDataButNotLoadAll) {
    modalApi.error({
      title: "Select All Warning",
      content: (
        <div>
          {`${selectedDataCount} out of ${totalHits} loaded, please load all records to use select all check box`}
        </div>
      ),
    });
  }
};
