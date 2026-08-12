import { SettingOutlined, SyncOutlined } from "@ant-design/icons";
import { Divider } from "@mui/material";
import { Button, Dropdown, type MenuProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  queryNextPageCashflowList,
  setCashflowListQueryPageSize,
} from "src/Cashflow_CN/Main/store/actions";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import { CASHFLOW_BLOTTER_AUTO_LOAD_NEXT_BTN } from "src/Root/analysis/const";

const LOAD_MORE_ITEMS: MenuProps["items"] = [1000, 5000].map((i) => ({
  key: i,
  label: `set size to ${i}`,
}));

export const LoadNextButton = () => {
  const dispatch = useDispatch<any>();
  const cashflowListQueryPageSize = useSelector(
    (state: RootState) => state.cashflowListQueryPageSize
  );
  const { lastPage } = useSelector(
    (state: RootState) => state.cashflowListPagination
  );
  const isLoadingNextPage = useSelector(
    (state: RootState) => state.isLoadingNextPage
  );

  const loadButton = () => {
    dispatch(
      queryNextPageCashflowList({
        pageSize: cashflowListQueryPageSize,
      })
    );
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
        data-testid={CASHFLOW_BLOTTER_AUTO_LOAD_NEXT_BTN}
        onClick={() => loadButton()}
        disabled={lastPage}
        size="middle"
      >
        Load next {cashflowListQueryPageSize}
      </Button>
      <div className="load-next-settings" style={{ marginLeft: "8px" }}>
        <Dropdown
          menu={{
            items: LOAD_MORE_ITEMS.filter(
              (i) => i?.key !== cashflowListQueryPageSize
            ),
            onClick: (e) => {
              dispatch(setCashflowListQueryPageSize(Number(e.key)));
            },
          }}
          disabled={isLoadingNextPage}
        >
          <SettingOutlined />
        </Dropdown>
      </div>
    </>
  );
};
