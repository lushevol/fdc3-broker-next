import { SettingOutlined, SyncOutlined } from "@ant-design/icons";
import { Divider } from "@mui/material";
import { Button, Dropdown, type MenuProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  setGroupBlotterPageSize,
  triggerSearch,
} from "src/Cashflow_Group_Management/Main/store/slice";

import { GroupBlotterRootState } from "../../Main/store/interface";

const LOAD_MORE_ITEMS: MenuProps["items"] = [1000, 5000].map((i) => ({
  key: i,
  label: `set size to ${i}`,
}));

export const GridFooterLoadNextBtn = () => {
  const dispatch = useDispatch<any>();
  const { lastPage, pageSize } = useSelector(
    (state: GroupBlotterRootState) => state.groupBlotter.blotterPagination
  );
  const isLoadingNextPage = useSelector(
    (state: GroupBlotterRootState) => state.groupBlotter.isLoadingNextPage
  );

  const handleLoadNext = () => {
    dispatch(triggerSearch("next"));
  };

  const handlePageSizeChange = (e: any) => {
    dispatch(setGroupBlotterPageSize(Number(e.key)));
    dispatch(triggerSearch("initial"));
  };

  return (
    <>
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ margin: "0 20px" }}
      />
      <Button
        icon={<SyncOutlined />}
        loading={isLoadingNextPage}
        data-testid={"CASHFLOW_GROUP_BLOTTER_AUTO_LOAD_NEXT_BTN"}
        onClick={handleLoadNext}
        disabled={lastPage}
        size="middle"
      >
        Load next {pageSize}
      </Button>
      <div className="load-next-settings" style={{ marginLeft: "8px" }}>
        <Dropdown
          menu={{
            items: LOAD_MORE_ITEMS.filter((i) => i?.key !== pageSize),
            onClick: handlePageSizeChange,
          }}
          disabled={isLoadingNextPage}
          data-testid={"CASHFLOW_GROUP_BLOTTER_LOAD_NEXT_DROPDOWN"}
        >
          <SettingOutlined />
        </Dropdown>
      </div>
    </>
  );
};
