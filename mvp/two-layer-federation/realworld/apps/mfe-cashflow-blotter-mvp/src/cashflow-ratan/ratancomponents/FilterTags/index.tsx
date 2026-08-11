import React, { FC, useEffect, useMemo, useState } from "react";
import { Tag } from "antd";

import { eventBus, eventTypes } from "../../ratanutils/eventBus";
import StyledRoot, { classes } from "./style";
import MfeThemeProvider from "../../Root/component/MfeThemeProvider";
import { Divider } from "@mui/material";

export const FilterTags: FC<{ aggridTags: any[]; removeAggridTag }> = ({
  aggridTags,
  removeAggridTag,
}) => {
  const [customfilterTags, setCustomFilterTags] = useState<any[]>([]);

  const closeAGFilterTag = (item: any, e: any) => {
    e.preventDefault();
    removeAggridTag(item.colId);
  };

  const closeCustomFilterTag = (item: any, e: any) => {
    e.preventDefault();
    setCustomFilterTags((val) =>
      val.filter((subItem) => subItem.headerName !== item.headerName)
    );
  };

  const CustomTags = useMemo(() => {
    if (Array.isArray(customfilterTags)) {
      return customfilterTags.map((item: any) => {
        return (
          <Tag
            closable
            onClose={closeCustomFilterTag.bind(null, item)}
            key={item.index}
            className="filter-builder-tag"
            title="Custom Search"
            color="warning"
          >
            {item.headerName}
          </Tag>
        );
      });
    }
  }, [customfilterTags]);

  const AgTags = useMemo(() => {
    if (Array.isArray(aggridTags)) {
      return aggridTags.map((item: any) => {
        return (
          <Tag
            closable
            onClose={closeAGFilterTag.bind(null, item)}
            key={item.colId}
            title="Local Filter"
            color="warning"
          >
            {item.headerName}
          </Tag>
        );
      });
    }
  }, [aggridTags]);

  return (
    <MfeThemeProvider>
      <StyledRoot>
        <Divider orientation="vertical" flexItem />
        <div className={classes.tags}>
          {CustomTags}
          {AgTags}
        </div>
      </StyledRoot>
    </MfeThemeProvider>
  );
};
