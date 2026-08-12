import {
  Button,
  FormControlLabel,
  Stack,
  TextField,
  Checkbox,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Save as SaveIcon,
  Telegram as TelegramIcon,
  CopyAll as CopyAllIcon,
} from "@mui/icons-material";
import FilterList from "./FilterList";
import StyledRoot, { classes } from "../common/style";
import { Shadow2Filter, useDisplayFilter } from "../hooks/useDisplayFilter";
import { useFilterBuilderContext, useFilterList } from "../hooks/useContext";
import { memo } from "react";
import RatanQueryBuilder from "../../ReactQueryBuilder/export";
import { FilterBuilderBodySkeleton } from "./Skeleton";
import { FilterInfo } from "./FilterInfo";
import {
  ADVANCED_SEARCH_PREVIEW_DIALOG_DELETE_BTN,
  ADVANCED_SEARCH_PREVIEW_DIALOG_SAVE_CREATE_BTN,
  ADVANCED_SEARCH_PREVIEW_DIALOG_SEARCH_BTN,
} from "../../../../packages/Analysis/const";
import { useFilterOperationController } from "../hooks/useController";

const MainPanel = memo(() => {
  useFilterList();
  const {
    userId,
    filterMode,
    fields,
    classifiedFilterList,
    appliedFilter,
    onApplyFilter,
    saveFilter,
    createFilter,
    deleteFilter,
    setFilterList,
  } = useFilterBuilderContext();
  const {
    isProcessing,
    fetchingLatest,
    displayFilter,
    shadowDisplayFilter,
    isOnNewFilterTab,
    handleApplyFilter,
    handleDisplayFilterCreateNew,
    handleDisplayFilterChange,
    handleShadowDisplayFilterUpdate,
    handleShadowDisplayFilterBodyUpdate,
    handleDisplayFilterSave,
    handleDisplayFilterDelete,
    handleDuplicateFilter,
    MessageContext,
  } = useDisplayFilter({
    appliedFilter,
    saveFilter,
    deleteFilter,
    createFilter,
    setFilterList,
  });
  const { confirmProcessing, ModalContext } = useFilterOperationController();
  return (
    <StyledRoot className={classes.root}>
      {MessageContext}
      {ModalContext}
      <FilterList
        classifiedFilterList={classifiedFilterList}
        displayFilter={displayFilter}
        appliedFilter={appliedFilter}
        onClickFilter={handleDisplayFilterChange}
        onClickCreateNewFilter={handleDisplayFilterCreateNew}
      ></FilterList>
      {shadowDisplayFilter && (
        <div className={classes.filterBuilder}>
          <Stack
            className={classes.filterBuilderHeader}
            direction="row"
            spacing={3}
          >
            <div className={classes.filterBuilderName}>
              <TextField
                className={classes.filterBuilderNameInput}
                required
                label="Filter Name"
                value={shadowDisplayFilter.name}
                onChange={(e) =>
                  handleShadowDisplayFilterUpdate({ name: e.target.value })
                }
                placeholder="Please type filter name here."
              />
            </div>
            <div className={classes.filterBuilderPublic}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!shadowDisplayFilter.isPublic}
                    onChange={(e) =>
                      handleShadowDisplayFilterUpdate({
                        isPublic: !e.target.checked,
                      })
                    }
                  />
                }
                label="Private"
              />
            </div>
            <div className={classes.filterBuilderInfo}>
              {!isOnNewFilterTab ? (
                <Button
                  onClick={() => handleDuplicateFilter()}
                  title="Duplicate this filter"
                >
                  <CopyAllIcon />
                </Button>
              ) : null}
              <FilterInfo filter={displayFilter} />
            </div>
          </Stack>
          <div className={classes.filterBuilderBody}>
            {fetchingLatest && <FilterBuilderBodySkeleton />}
            <RatanQueryBuilder
              mode={filterMode}
              fields={fields}
              query={shadowDisplayFilter.body}
              onQueryChange={handleShadowDisplayFilterBodyUpdate}
              allowDuplicateField={false}
              datetimeFormat="YYYY-MM-DDTHH:mm:ss[Z]"
              datePickerVariable
            />
          </div>
          <div className={classes.filterBuilderActions}>
            {displayFilter.owner === userId && !isOnNewFilterTab && (
              <Button
                className={classes.filterBuilderActionBtn}
                startIcon={<DeleteIcon fontSize="small" />}
                onClick={() =>
                  confirmProcessing("Delete", handleDisplayFilterDelete)
                }
                variant="outlined"
                color="error"
                disabled={isProcessing}
                data-testid={ADVANCED_SEARCH_PREVIEW_DIALOG_DELETE_BTN}
              >
                Delete
              </Button>
            )}
            {displayFilter.owner === userId && (
              <Button
                disabled={!shadowDisplayFilter.body || isProcessing}
                className={classes.filterBuilderActionBtn}
                onClick={() =>
                  isOnNewFilterTab
                    ? handleDisplayFilterSave()
                    : confirmProcessing("Save", handleDisplayFilterSave)
                }
                startIcon={<SaveIcon fontSize="small" />}
                variant="outlined"
                color="success"
                data-testid={ADVANCED_SEARCH_PREVIEW_DIALOG_SAVE_CREATE_BTN}
              >
                {isOnNewFilterTab ? "Create" : "Save"}
              </Button>
            )}
            <Button
              disabled={!shadowDisplayFilter.body || isProcessing}
              className={classes.filterBuilderActionBtn}
              onClick={() =>
                handleApplyFilter(Shadow2Filter(shadowDisplayFilter))
              }
              endIcon={<TelegramIcon fontSize="small" />}
              variant="outlined"
              data-testid={ADVANCED_SEARCH_PREVIEW_DIALOG_SEARCH_BTN}
            >
              Search
            </Button>
            {/* <Button
              className={classes.filterBuilderActionBtn}
              onClick={() => handleClickResetFilter()}
            >
              Reset
            </Button>
            <Button
              className={classes.filterBuilderActionBtn}
              onClick={() => handleClickClearFilter()}
            >
              Clear
            </Button> */}
          </div>
        </div>
      )}
    </StyledRoot>
  );
});

export default MainPanel;
