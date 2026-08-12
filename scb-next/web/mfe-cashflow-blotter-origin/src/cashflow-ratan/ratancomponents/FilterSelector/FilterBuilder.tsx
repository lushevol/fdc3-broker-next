import React, {
  FC,
  memo,
  useState,
  useEffect,
  useMemo,
  useContext,
} from "react";
import { Cascader, message } from "antd";
import { MuiDialog } from "../Dialog/indexMuiV1";
import { FilterName } from "./FilterName";
import { FilterItem } from "./FilterItem";
import { Context } from "./store";
import { OPERATORS, OPERATORS_CN } from "./operatorConfig";
import { deepClone, removeSpacesFromStrings } from "../../ratanutils/utils";
import { css, styled } from "@mui/material";
import { MessageInstance } from "antd/lib/message/interface";
import { LoadingButton } from "../../Root/import";

export const FilterBuilderStyledDialog = styled(MuiDialog)(
  css`
    .dialog-body {
      min-width: 1000px;
    }
    .filter-builder-body {
      padding: 10px 0;
    }
    .filter-builder-add {
      width: 281px;
    }
  `
);

export interface FilterBuilderProps {
  openBuilder: any[];
  onClose: Function;
  filterFieldType: string;
  CASCADER_OPTIONS: any;
  FILTER_FIELDS: any;
  searchFunction: Function;
  messageOnLevelOne: MessageInstance;
  isCashflowSettlementCN?: boolean;
}

export const FilterBuilder: FC<FilterBuilderProps> = memo(
  ({
    openBuilder,
    onClose,
    filterFieldType,
    CASCADER_OPTIONS,
    FILTER_FIELDS,
    searchFunction,
    messageOnLevelOne,
    isCashflowSettlementCN,
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { state, dispatch } = useContext(Context);
    const { temporaryFilter } = state;
    const { body } = temporaryFilter;
    const isOpen = openBuilder.length > 0;
    const [messageApi, messageContextHolder] = message.useMessage();

    useEffect(() => {
      return () => {
        setIsLoading(false);
      };
    }, [openBuilder]);

    const setQueryOptions = (filterValue: CascaderFilter, index: number) => {
      const newBody = deepClone(body);
      newBody[index] = Object.assign(newBody[index], filterValue);
      const { name, operator, values } = newBody[index];
      if (name === "TextInput" && operator === "IN" && values) {
        newBody[index].values = values.split(",");
      }
      dispatch({ type: "UPDATE_TEMPORARY_FILTER", data: { body: newBody } });
    };

    const removeItem = (index: number) => {
      const newBody = [...body];
      newBody.splice(index, 1);
      dispatch({ type: "UPDATE_TEMPORARY_FILTER", data: { body: newBody } });
    };

    const setQueryItems = useMemo(() => {
      const queryItemView: any = [];

      if (Array.isArray(body)) {
        body.forEach((item: CascaderFilter, index) => {
          queryItemView.push(
            <FilterItem
              key={item.field.join(".")}
              index={index}
              filterValue={item}
              onChange={setQueryOptions}
              onRemove={removeItem}
              CASCADER_OPTIONS={CASCADER_OPTIONS}
              FILTER_FIELDS={FILTER_FIELDS}
              isCashflowSettlementCN
            />
          );
        });
      }

      return queryItemView;
    }, [body, isCashflowSettlementCN]);

    const pushNewFilter = (value: any[]) => {
      if (value[0] === "TRADEDETAIL" || value[0] === "CASHFLOWDETAIL") {
        value.shift();
      }
      const str = value.join(".");
      if (str) {
        const myField = FILTER_FIELDS.filter(
          (item: any) => item.indexedTerm === str
        )[0];
        const newBody = [...body];
        const { operators, displayStyle } = myField;

        if (operators && displayStyle) {
          newBody.push({
            field: value,
            operator: operators,
            values: "",
            name: (isCashflowSettlementCN ? OPERATORS_CN : OPERATORS)[
              displayStyle
            ][operators].name,
          });
          dispatch({
            type: "UPDATE_TEMPORARY_FILTER",
            data: { body: newBody },
          });
        }
      }
    };

    const setFilterFields = () => {
      const fields: Filter[] = [];

      body.forEach((item: CascaderFilter) => {
        if (
          (Array.isArray(item.values) && item.values.length) ||
          (!Array.isArray(item.values) &&
            (removeSpacesFromStrings(item.values) ||
              item.values === 0 ||
              item.values === false))
        ) {
          fields.push({
            field: item.field.join("."),
            operator: item.operator,
            values: item.values,
          });
        }
      });

      return fields;
    };

    const search = () => {
      const fields = setFilterFields();
      if (fields.length) {
        setIsLoading(true);

        searchFunction(fields, (isSuccess: boolean) => {
          if (isSuccess) {
            dispatch({ type: "UPDATE_CURRENT_FILTER", data: temporaryFilter });
            messageOnLevelOne.success("Search success!");
            onClose();
          }
          setIsLoading(false);
        });
      } else {
        messageApi.error("At least one filter, and the value cannot be empty!");
      }
    };

    return (
      <>
        <FilterBuilderStyledDialog
          className="filter-builder"
          destoryWhenHidden={false}
          open={isOpen}
          onClose={() => onClose()}
          width={"auto"}
          height={"auto"}
          testId="filter-builder"
          title={"Filter Builder"}
        >
          <FilterName
            filterFieldType={filterFieldType}
            onRemove={onClose}
            messageApi={messageApi}
          />
          <div className="filter-builder-body">
            {setQueryItems}
            <Cascader
              className="filter-builder-add"
              data-testid="addFilter"
              options={CASCADER_OPTIONS}
              placeholder="-- Add Filter --"
              expandTrigger="hover"
              allowClear={false}
              showSearch={true}
              value={[""]}
              onChange={pushNewFilter}
            />
          </div>
          <div style={{ width: "100%", textAlign: "right", padding: "16px" }}>
            <LoadingButton
              disabled={isLoading}
              loading={isLoading}
              onClick={search}
              variant="contained"
            >
              Search
            </LoadingButton>
          </div>
          {messageContextHolder}
        </FilterBuilderStyledDialog>
      </>
    );
  }
);
