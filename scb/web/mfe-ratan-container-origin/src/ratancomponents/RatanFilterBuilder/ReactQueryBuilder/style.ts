import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_Ratan_Query_Builder`;

const Root = styled(Box)(
  ({ theme }) =>
    css`
      // custom
      .queryBuilder .ruleGroup .ruleGroup-body .rule .rule-value {
        width: 100%;
        max-width: 500px;
        min-width: 200px;
        .ant-picker-suffix {
          margin-left: 0;
        }
        .multiple-date-picker {
          input {
            opacity: 0;
          }
        }
      }
      .queryBuilder
        .ruleGroup
        .ruleGroup-body
        .rule
        .rule-operators
        .ant-select {
        width: 75px;
      }

      /* disable style in rule group */
      .queryBuilder .ruleGroup {
        border-color: transparent;
        // border-style: unset;
        border-radius: unset;
        // border-width: unset;
        background: unset;
      }

      .bordered-bg .queryBuilder .ruleGroup {
        border-color: #8081a2;
        background: rgba(0, 75, 183, 0.2);
        border-radius: 0.25rem;
      }

      /* validation */
      .validateQuery .queryBuilder .ruleGroup.queryBuilder-invalid {
        background-color: rgba(102, 51, 153, 0.4);
      }
      .validateQuery
        .queryBuilder
        .ruleGroup.queryBuilder-invalid
        .ruleGroup-addRule {
        font-weight: bold !important;
      }
      .validateQuery
        .queryBuilder
        .ruleGroup.queryBuilder-invalid
        > .ruleGroup-header::after {
        content: "Please don't use any key words";
        color: white;
      }
      .validateQuery .queryBuilder .rule.queryBuilder-invalid .rule-value {
        background-color: rgba(102, 51, 153, 0.4);
      }
      .validateQuery
        .queryBuilder
        .rule.queryBuilder-invalid
        .rule-value::placeholder {
        color: #47246b;
      }

      /* Search Mode */
      .mode-search
        .queryBuilder
        .ruleGroup
        .ruleGroup-body
        .rule
        .rule-operators
        .ant-select
        .ant-select-selector {
        border: none;
      }

      /* bordered bg every group */
      .bordered-bg .queryBuilder .ruleGroup {
        border-color: #8081a2;
        background: rgba(0, 75, 183, 0.2);
        border-radius: 0.25rem;
      }

      /* mode-drools-rule + borderd-bg root group */
      .mode-drools-rule.bordered-bg .queryBuilder .ruleGroup:first-child {
        /* background: linear-gradient(
          90deg,
          #191f26 0%,
          rgba(26, 33, 41, 0.6) 100%
        ); */
        border-color: #8081a2;
        /* border: 1px solid;
        border-image-source: linear-gradient(131.49deg, rgba(14, 52, 254, 0.5) 0%, rgba(40, 49, 80, 0.6) 100%); */
        /* box-shadow: 0px 0px 50px 8px #122751b2 inset; */
      }
      /* mode-drools-rule + borderd-bg every group */
      .mode-drools-rule.bordered-bg .queryBuilder .ruleGroup {
        border: 1.5px solid #8081a255;
        /* background: #11171d; */
        /* border-image-source: linear-gradient(90.77deg, rgba(178, 186, 198, 0.4) 0.82%, rgba(44, 50, 59, 0.32) 100%); */
      }
      /* mode-drools-rule group combinators */
      .mode-drools-rule
        .queryBuilder
        .ruleGroup
        .ruleGroup-header
        .ruleGroup-combinators {
        margin-right: auto;
      }
      .mode-drools-rule
        .queryBuilder
        .ruleGroup
        .ruleGroup-header
        .ruleGroup-combinators
        .ant-select
        .ant-select-selector {
        border-radius: 2rem;
        /* background: #0d4eab; */
      }
      /* when disabled */
      .mode-drools-rule
        .queryBuilder
        .ruleGroup
        .ruleGroup-header
        .ruleGroup-combinators
        .ant-select.ant-select-disabled
        .ant-select-selector {
        /* background: ${theme.palette.grey[100]}; */
      }

      /* mode-drools-rule group addrule action */
      .mode-drools-rule
        .queryBuilder
        .ruleGroup
        .ruleGroup-header
        .ruleGroup-addRule {
        /* background: transparent; */
      }

      /* mode-drools-rule group addgroup action */
      .mode-drools-rule
        .queryBuilder
        .ruleGroup
        .ruleGroup-header
        .ruleGroup-addGroup {
        /* background: transparent; */
      }

      /* mode-drools-rule group remove action */
      .mode-drools-rule
        .queryBuilder
        .ruleGroup
        .ruleGroup-header
        .ruleGroup-remove {
        /* background: transparent; */
        width: 32px;
        padding: unset;
        margin-left: 0 !important;
      }

      /* mode-drools-rule remove action */
      .mode-drools-rule
        .queryBuilder
        .ruleGroup
        .ruleGroup-body
        .rule
        .rule-remove {
        /* background: transparent; */
        width: 32px;
        padding: unset;
      }

      .queryBuilder .ruleGroup .ruleGroup-body .rule .rule-value .ant-select {
        width: 100%;
      }

      .queryBuilder .ruleGroup-addGroup + button.ruleGroup-cloneGroup,
      .queryBuilder .ruleGroup-addGroup + button.ruleGroup-lock,
      .queryBuilder .ruleGroup-addGroup + button.ruleGroup-remove,
      .queryBuilder .rule-operators + button.rule-cloneRule,
      .queryBuilder .rule-operators + button.rule-lock,
      .queryBuilder .rule-operators + button.rule-remove,
      .queryBuilder .rule-value + button.rule-cloneRule,
      .queryBuilder .rule-value + button.rule-lock,
      .queryBuilder .rule-value + button.rule-remove,
      .queryBuilder .control + button.rule-cloneRule,
      .queryBuilder .control + button.rule-lock,
      .queryBuilder .control + button.rule-remove,
      .queryBuilder .chakra-select__wrapper + button.rule-cloneRule,
      .queryBuilder .chakra-select__wrapper + button.rule-lock,
      .queryBuilder .chakra-select__wrapper + button.rule-remove {
        margin-left: auto !important;
      }

      // built-in
      .ruleGroup {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
        border-color: #8081a2;
        border-style: solid;
        border-radius: 0.25rem;
        border-width: 1px;
        background: rgba(0, 75, 183, 0.2);
      }
      .ruleGroup .ruleGroup-body {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .ruleGroup .ruleGroup-body:empty {
        display: none;
      }
      .ruleGroup .ruleGroup-header,
      .ruleGroup .rule {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .ruleGroup .rule .rule-value:has(.rule-value-list-item) {
        display: flex;
        gap: 0.5rem;
        align-items: baseline;
      }

      [data-inlinecombinators="disabled"] .dndOver.rule,
      [data-inlinecombinators="disabled"] .dndOver.ruleGroup-header {
        border-bottom-width: 2px;
        border-bottom-style: dashed;
        border-bottom-color: rebeccapurple;
        padding-bottom: 0.5rem;
      }
      [data-inlinecombinators="disabled"] .dndOver.rule.dndCopy,
      [data-inlinecombinators="disabled"] .dndOver.ruleGroup-header.dndCopy {
        border-bottom-color: #669933;
      }

      [data-inlinecombinators="enabled"] .dndOver.rule:last-child,
      [data-inlinecombinators="enabled"] .dndOver.ruleGroup-header,
      [data-inlinecombinators="enabled"] .dndOver.rule + .betweenRules,
      [data-inlinecombinators="enabled"] .dndOver.betweenRules {
        border-bottom-width: 2px;
        border-bottom-style: dashed;
        border-bottom-color: rebeccapurple;
        padding-bottom: 0.5rem;
      }
      [data-inlinecombinators="enabled"] .dndOver.rule:last-child.dndCopy,
      [data-inlinecombinators="enabled"] .dndOver.ruleGroup-header.dndCopy,
      [data-inlinecombinators="enabled"] .dndOver.rule + .betweenRules.dndCopy,
      [data-inlinecombinators="enabled"] .dndOver.betweenRules.dndCopy {
        border-bottom-color: #669933;
      }

      .ruleGroup.dndDragging,
      .rule.dndDragging {
        opacity: 0.5;
      }
      .ruleGroup .queryBuilder-dragHandle,
      .rule .queryBuilder-dragHandle {
        cursor: move;
      }

      .queryBuilder-branches .ruleGroup-body {
        margin-left: calc(2 * 0.5rem);
      }
      .queryBuilder-branches .rule,
      .queryBuilder-branches .ruleGroup .ruleGroup {
        position: relative;
      }
      .queryBuilder-branches .rule::before,
      .queryBuilder-branches .rule::after,
      .queryBuilder-branches .ruleGroup .ruleGroup::before,
      .queryBuilder-branches .ruleGroup .ruleGroup::after {
        content: "";
        width: 0.5rem;
        left: calc(-0.5rem - 1px);
        border-color: #8081a2;
        border-style: solid;
        border-radius: 0;
        position: absolute;
      }
      .queryBuilder-branches .rule::before,
      .queryBuilder-branches .ruleGroup .ruleGroup::before {
        top: -0.5rem;
        height: calc(50% + 0.5rem);
        border-width: 0 0 1px 1px;
      }
      .queryBuilder-branches .rule:last-child::before,
      .queryBuilder-branches .ruleGroup .ruleGroup:last-child::before {
        border-bottom-left-radius: 0.25rem;
      }
      .queryBuilder-branches .rule::after,
      .queryBuilder-branches .ruleGroup .ruleGroup::after {
        top: 50%;
        height: 50%;
        border-width: 0 0 0 1px;
      }
      .queryBuilder-branches .rule:last-child::after,
      .queryBuilder-branches .ruleGroup .ruleGroup:last-child::after {
        display: none;
      }
      .queryBuilder-branches .ruleGroup .ruleGroup::before,
      .queryBuilder-branches .ruleGroup .ruleGroup::after {
        left: calc(calc(-0.5rem - 1px) - 1px);
      }
      .queryBuilder-branches .ruleGroup .ruleGroup::before {
        top: calc(-0.5rem - 1px);
        height: calc(50% + 0.5rem + 1px);
      }
      .queryBuilder-branches .ruleGroup .ruleGroup::after {
        height: calc(50% + 1px);
      }
      .queryBuilder-branches .betweenRules {
        position: relative;
      }
      .queryBuilder-branches .betweenRules::before {
        content: "";
        width: 0.5rem;
        left: calc(-0.5rem - 1px);
        border-color: #8081a2;
        border-style: solid;
        border-radius: 0;
        position: absolute;
        top: -0.5rem;
        height: calc(100% + 0.5rem);
        border-width: 0 0 0 1px;
      }
    `
);

export default Root;
