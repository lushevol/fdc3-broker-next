import { Divider } from "antd";
import { Button } from "Import/index";
import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showOrHideCashflowSearchBar } from "src/Cashflow_CN/Main/store/actions";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import {
  CASHFLOW_BLOTTER_HIDE_SEARCH_BAR_BTN,
  CASHFLOW_BLOTTER_SHOW_SEARCH_BAR_BTN,
} from "src/Root/analysis/const";

import Root, { classes } from "./style";

const App: FC = () => {
  const dispatch = useDispatch<any>();
  const showCashflowSearchBar = useSelector(
    (state: RootState) => state.showCashflowSearchBar
  );
  const handleSearchBar = (show: boolean) => {
    dispatch(showOrHideCashflowSearchBar(show));
  };
  return (
    <Root>
      <Divider
        style={{
          margin: "5px 0",
          borderColor: "var(--theme-color-modal-port-border)",
        }}
      >
        {showCashflowSearchBar ? (
          <Button
            className={classes.hideSearchBar}
            startIcon={<i className="fa fa-angle-double-up"></i>}
            onClick={() => handleSearchBar(false)}
            data-testid={CASHFLOW_BLOTTER_HIDE_SEARCH_BAR_BTN}
          >
            Hide Search Bar
          </Button>
        ) : (
          <Button
            className={classes.showSearchBar}
            startIcon={<i className="fa fa-angle-double-down"></i>}
            onClick={() => handleSearchBar(true)}
            data-testid={CASHFLOW_BLOTTER_SHOW_SEARCH_BAR_BTN}
          >
            Show Search Bar
          </Button>
        )}
      </Divider>
    </Root>
  );
};

export default App;
