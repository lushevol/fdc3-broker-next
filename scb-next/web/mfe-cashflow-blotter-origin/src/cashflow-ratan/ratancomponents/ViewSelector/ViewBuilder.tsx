import React, { FC, memo, useEffect, useState } from "react";
import { Button } from "../../Root/import";

import {
  hasPrivatePermission,
  hasPublicPermission,
} from "../../ratanutils/authenticator";
import { css, styled } from "@mui/material";
import { MuiDialog } from "../Dialog/indexMuiV1";
import { ViewName } from "./ViewName";
import { ViewOptions, Option } from "./ViewOptions";

interface ViewBuilderProps {
  openBuilder: boolean;
  onClose: Function;
  tradeGridReady: any;
  viewFieldType: string;
  ems2Subject?: string;
  viewOptions: any;
  showIndexTerm?: boolean;
}
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_viewbuilder`;
const classes = {
  viewBuilderBody: `${PREFIX}-view-builder-body`,
};
const ViewBuilderStyledDialog = styled(MuiDialog)(
  css`
    .dialog-body {
      display: flex;
    }
    .view-builder-wrap {
      position: relative;
      overflow-x: auto;
      .${classes.viewBuilderBody} {
        width: 1070px;
        padding: 10px;
        .view-options div[role="presentation"] {
          display: contents;
        }
      }
    }
    .view-builder-btn {
      float: right;
      margin: 0 10px 10px 0;
    }
  `
);

export const matchFields = (value, searchValue) => {
  if (value?.toLowerCase().includes(searchValue.toLocaleLowerCase())) {
    const reg = new RegExp(searchValue, "i");
    const text = value.match(reg)[0];
    return text ? value.replace(text, `<b>${text}</b>`) : value;
  }
  return null;
};

export const handleOptions = (options, searchValue) => {
  const newOptions = options.map((item) => {
    const headerName = matchFields(item.headerName, searchValue);
    const field = matchFields(item.field, searchValue);
    return {
      ...item,
      searchHeaderName: headerName,
      searchField: field,
      searchShow: !searchValue || !!(headerName || field),
    };
  });
  return newOptions;
};

export const ViewBuilder: FC<ViewBuilderProps> = memo(
  ({
    openBuilder,
    onClose,
    tradeGridReady,
    viewFieldType,
    ems2Subject,
    viewOptions,
    showIndexTerm,
  }) => {
    const [options, setOptions] = useState<Option[]>([]);
    const [searchValue, setSearchValue] = useState("");

    const search = (value: string) => {
      setSearchValue(value);
    };

    const closeViewBuilder = () => {
      onClose?.();
      setSearchValue("");
    };

    useEffect(() => {
      const newOptions = handleOptions(options, searchValue);
      setOptions(newOptions);
    }, [searchValue]);

    useEffect(() => {
      if (openBuilder) {
        let newOptions: Option[] = [];
        const allDisplayedColumns = tradeGridReady.api
          ?.getAllDisplayedColumns()
          .map((item) => item.colId);
        viewOptions.forEach((value: any[], key: string) => {
          value.forEach((item) => {
            newOptions.push({
              ...item,
              searchHeaderName: "",
              searchFieldName: "",
              searchShow: true,
              group: key,
              hide: !allDisplayedColumns.includes(item.field),
            });
          });
        });
        setOptions(newOptions);
      }
    }, [viewOptions, openBuilder]);
    return (
      <ViewBuilderStyledDialog
        className="view-builder"
        destoryWhenHidden={false}
        open={openBuilder}
        onClose={() => closeViewBuilder()}
        // width={"auto"}
        // height={"auto"}
        title={"View Builder"}
      >
        <div className={"view-builder-wrap"}>
          {(hasPrivatePermission(ems2Subject ?? viewFieldType) ||
            hasPublicPermission(ems2Subject ?? viewFieldType)) && (
            <ViewName
              viewFieldType={viewFieldType}
              ems2Subject={ems2Subject}
              tradeGridReady={tradeGridReady}
              onSearch={search}
            />
          )}
          <div className={classes.viewBuilderBody}>
            <ViewOptions
              tradeGridReady={tradeGridReady}
              isOpen={openBuilder}
              showIndexTerm={showIndexTerm}
              options={options}
              setOptions={setOptions}
              searchValue={searchValue}
            />
          </div>
        </div>
        <div
          style={{ width: "100%", textAlign: "right", padding: "16px 10px" }}
        >
          <Button
            onClick={() => closeViewBuilder()}
            variant="contained"
            data-testid="setBtn"
          >
            Close
          </Button>
        </div>
      </ViewBuilderStyledDialog>
    );
  }
);
