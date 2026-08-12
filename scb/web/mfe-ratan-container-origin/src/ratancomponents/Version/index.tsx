import React, { FC } from "react";
import { isProduction } from "../../ratanutils/utils";
import { css, styled } from "@mui/material/styles";
import { useContext } from "../../Root/hooks/provider";
import { VersionType } from "../../Root/hooks/model/root";

const VersionStyle = styled("div")(
  css`
    font-size: 12px;
    height: 20px;
    width: 100%;
    color: var(--theme-color-modal-header-font);
    background-color: var(--theme-color-modal-header);
    display: flex;
    align-items: center;
    padding-left: 11px;
    span {
      margin-right: 15px;
    }
  `
);

export const Version: FC<VersionType> = ({ version, env }) => {
  const [store] = useContext();
  const versionValue = store?.versionState?.version || version;
  const envValue = store?.versionState?.env || env;
  return !isProduction() ? (
    <VersionStyle data-testid="version">
      {versionValue && <span>Version: {versionValue}</span>}
      {envValue && <span>Env: {envValue}</span>}
    </VersionStyle>
  ) : null;
};
