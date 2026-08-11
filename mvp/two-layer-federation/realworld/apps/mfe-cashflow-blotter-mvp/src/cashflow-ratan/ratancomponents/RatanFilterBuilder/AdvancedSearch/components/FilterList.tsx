import {
  Card,
  CardContent,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { FilterRecord } from "../common/types";
import { classes } from "../common/style";
import { DEFAULT_CREATING_FILTER_KEY } from "../common/const";
import { Input } from "antd";
import { useState } from "react";

const highlight = (flag: boolean) => {
  return flag ? classes.filterListItemHighlight : "";
};

const FilterList = ({
  classifiedFilterList,
  displayFilter,
  appliedFilter,
  onClickFilter,
  onClickCreateNewFilter,
}: // onClickClearFilter,
{
  classifiedFilterList: {
    title: string;
    key: string;
    options: FilterRecord[];
  }[];
  displayFilter: FilterRecord;
  appliedFilter: FilterRecord | null;
  onClickFilter: (f: FilterRecord) => void;
  onClickCreateNewFilter: () => void;
  // onClickClearFilter: () => void;
}) => {
  const [searchInput, setSearchInput] = useState("");

  const filteredClassifiedFilterList = classifiedFilterList
    .map((group) => ({
      ...group,
      options: group.options.filter((filterItem) =>
        searchInput
          ? filterItem.name.toLowerCase().includes(searchInput.toLowerCase())
          : true
      ),
    }))
    .filter((group) => group.options.length > 0);

  return (
    <Card className={classes.filterList} variant="outlined">
      {/* <CardActions>
        <Button
          size="small"
          variant="contained"
          onClick={() => onClickCreateNewFilter()}
          className={classes.filterListAction}
        >
          Create
        </Button>
        <Button
          size="small"
          color="inherit"
          onClick={() => onClickClearFilter()}
        >
          Clear
        </Button>
      </CardActions> */}
      <CardContent sx={{ p: 0, flex: 1 }}>
        <List
          className={classes.filterListContent}
          component="nav"
          aria-labelledby="nested-list-subheader"
          dense
          subheader={<li />}
        >
          <ListItemButton
            className={classes.filterListItem}
            onClick={() => onClickCreateNewFilter()}
            selected={displayFilter?.rowKey === DEFAULT_CREATING_FILTER_KEY}
            dense
            data-testid={"new-filter-btn"}
          >
            <ListItemText
              title="+ New Filter"
              primary="+ New Filter"
              className={highlight(
                appliedFilter?.rowKey === DEFAULT_CREATING_FILTER_KEY
              )}
              primaryTypographyProps={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            />
          </ListItemButton>
          <Divider />
          <div className={classes.filterListSearch}>
            <Input
              className={classes.filterListSearchInput}
              placeholder="Search filters"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              allowClear
            />
          </div>
          {filteredClassifiedFilterList.map((group) => (
            <li key={`section-${group.key}`}>
              <ul>
                <ListSubheader sx={{ lineHeight: "inherit" }}>
                  {group.title}
                </ListSubheader>
                {group.options.map((filterItem) => (
                  <ListItemButton
                    key={filterItem.rowKey}
                    className={classes.filterListItem}
                    onClick={() => onClickFilter(filterItem)}
                    selected={displayFilter?.rowKey === filterItem.rowKey}
                    dense
                  >
                    <ListItemText
                      title={filterItem.name}
                      primary={filterItem.name}
                      className={highlight(
                        appliedFilter?.rowKey === filterItem.rowKey
                      )}
                      primaryTypographyProps={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textTransform: "none",
                      }}
                    />
                  </ListItemButton>
                ))}
              </ul>
            </li>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default FilterList;
