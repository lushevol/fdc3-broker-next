import { css, styled } from "@mui/material";
import React, { useMemo } from "react";
import { Provider } from "react-redux";
import { E2ELatencyStoreWrap } from "src/Root/analysis";
import { getUser } from "src/Root/import/ratanutils";

import { TileProps } from "../Root/routing/common/interface";
import Main from "./Main";
import ratanConfig from "./Main/config/ratanConfig";
import createStore from "./Main/store";

const StyledRoot = styled("div")(
  () => css`
    text-align: center;
    margin-top: 20px;
  `
);

const OpensearchHome: React.FC<TileProps> = (
  props: TileProps
): React.ReactElement => {
  const store = useMemo(() => createStore(), []);
  const { id } = getUser();
  const allowAccess = ratanConfig.cashflow.opensearchWhiteList.includes(id);

  return (
    <E2ELatencyStoreWrap>
      <Provider store={store}>
        {allowAccess ? (
          <Main {...props} />
        ) : (
          <StyledRoot>
            <div>
              <h2>Access Denied</h2>
              <p>You do not have permission to access this page.</p>
            </div>
          </StyledRoot>
        )}
      </Provider>
    </E2ELatencyStoreWrap>
  );
};

export default OpensearchHome;
