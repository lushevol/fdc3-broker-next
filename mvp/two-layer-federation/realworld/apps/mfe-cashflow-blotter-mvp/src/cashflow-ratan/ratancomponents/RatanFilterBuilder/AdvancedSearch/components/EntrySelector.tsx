import { Button, Box } from "@mui/material";
import { useFilterBuilderContext, useFilterList } from "../hooks/useContext";
import { css, styled } from "@mui/material/styles";
import { useMemo, useState } from "react";
import {
  ADVANCED_SEARCH_ENTRY_CLEAR_BTN,
  ADVANCED_SEARCH_ENTRY_SETTING_BTN,
} from "../../../../packages/Analysis/const";
import Select from "../../../../LazyAntd/Select";
import { filterOption } from "../../../../ratanutils/utils";
import type {
  FilterOptionItem,
  GroupFilterOption,
} from "../../../../ratanutils/config/common/interface";
import { DEFAULT_CREATING_FILTER_KEY } from "../common/const";

const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_advanced_search_entry_selector`;
export const classes = {
  label: `${PREFIX}-label`,
  selectorWrap: `${PREFIX}-selector-wrap`,
  selector: `${PREFIX}-selector`,
  clearBtn: `${PREFIX}-clear-btn`,
  viewBtn: `${PREFIX}-view-btn`,
};

export const Root = styled(Box)(
  css`
    margin-bottom: 5px;
    width: 100%;
    display: flex;
    height: 30px;
    gap: 10px;
    .${classes.label} {
      display: flex;
      align-self: center;
      color: var(--theme-color-modal-label);
    }
    .${classes.selector} {
      flex: 1;
      height: 100%;
    }
    .${classes.clearBtn} {
      min-width: 64px;
    }
    .${classes.viewBtn} {
      min-width: 64px;
      white-space: nowrap;
      overflow: hidden;
    }
  `
);

export const EntrySelector = ({ onOpenSetting }) => {
  useFilterList();
  const {
    appliedFilter,
    onClearAppliedFilter,
    classifiedFilterList,
    onApplyFilterByKey,
  } = useFilterBuilderContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async (value: string) => {
    try {
      setIsLoading(true);
      await onApplyFilterByKey(value);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const Options = useMemo(() => {
    let newOptions: GroupFilterOption[] = [];
    const privateOptions: GroupFilterOption = {
      label: "Private",
      options: [],
    };
    const publicOptions: GroupFilterOption = {
      label: "Public",
      options: [],
    };

    classifiedFilterList.forEach((item: any) => {
      const options: FilterOptionItem[] = item.options.map((f) => {
        return {
          label: f.name,
          value: f.rowKey,
        };
      });
      if (item.key === "public") {
        publicOptions.options = options;
      } else if (item.key === "private") {
        privateOptions.options = options;
      }
    });
    privateOptions.options.length && newOptions.push(privateOptions);
    publicOptions.options.length && newOptions.push(publicOptions);
    return newOptions;
  }, [classifiedFilterList]);

  return (
    <Root>
      <label className={classes.label}>Filters</label>
      <Select
        className={classes.selector}
        value={
          appliedFilter?.rowKey === DEFAULT_CREATING_FILTER_KEY
            ? null
            : appliedFilter?.rowKey
        }
        onChange={handleSelect}
        disabled={isLoading}
        data-testid={"select-fliter"}
        placeholder="Select..."
        showSearch={true}
        loading={isLoading}
        options={Options}
        filterOption={filterOption}
        popupMatchSelectWidth={false}
        dropdownStyle={{ maxWidth: "350px" }}
      />
      <Button
        color={appliedFilter ? "warning" : undefined}
        onClick={() => onClearAppliedFilter()}
        disabled={!appliedFilter}
        variant="outlined"
        className={classes.clearBtn}
        data-testid={ADVANCED_SEARCH_ENTRY_CLEAR_BTN}
      >
        Clear
      </Button>
      <Button
        onClick={() => onOpenSetting()}
        variant="contained"
        className={classes.viewBtn}
        data-testid={ADVANCED_SEARCH_ENTRY_SETTING_BTN}
      >
        Create or Modify
      </Button>
    </Root>
  );
};
