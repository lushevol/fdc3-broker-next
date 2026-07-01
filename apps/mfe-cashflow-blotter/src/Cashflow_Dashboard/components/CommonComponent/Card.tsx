import { css, styled } from "@mui/material";
import { Card } from "antd";

export const StyledCard = styled(Card)(
  () => css`
    .ant-card-body {
      padding: 16px;
    }
  `
);
