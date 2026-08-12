import styled from "@emotion/styled";
import { css } from "@mui/material/styles";

export const OptionContent = styled("div")(
  () => () =>
    css`
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 16px;

      .ratan-container-quick-search-option-copy {
        visibility: hidden;
        flex-shrink: 0;
        width: 16px;
        height: 16px;
      }

      &:hover .ratan-container-quick-search-option-copy {
        visibility: visible;
      }
    `
);
