import React, {
  FC,
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useReducer,
} from "react";
import { Modal, message, Select } from "antd";
import { Button } from "../../Root/import";
import { GridApi } from "ag-grid-community";
import { FieldLabel } from "../FieldLabel";
import {
  Context,
  reducer,
  defaultState,
  getViews,
  getView,
  removeView,
} from "./store";
import MfeThemeProvider from "../../Root/component/MfeThemeProvider";
import { ViewBuilder } from "./ViewBuilder";
import useViewName from "./useViewName";
import StyleRoot, { classes } from "./common/ViewSelectorStyle";
import { useBatchCollect } from "../../packages/Analysis";
import {
  CUSTOM_VIEW_CLEAR,
  CUSTOM_VIEW_CREATE_MODIFY,
  CUSTOM_VIEW_SELECTED,
} from "../../Root/analysis/const";
import {
  generateViewSelectorOptions,
  generateViewSelectorOptionsForRole,
} from "./common/utils";
import { filterOption } from "../../ratanutils/utils";
import { getEnable } from "../../ratanutils/componentEnabling";

const { confirm } = Modal;

export function handleCurrentView(
  currentView,
  name,
  selectedViewName,
  clear,
  onSelectName
) {
  if (currentView) {
    selectedViewName.changeViewName(currentView.name);
    if (!currentView.name) {
      clear(true);
    }
    if (onSelectName && currentView.name !== name) {
      onSelectName(currentView.name);
    }
  }
}

export const checkRemove = (
  setIsLoading: (boolean) => void,
  newParams: any,
  dispatch: (any) => void,
  rowKey: string,
  viewFieldType: string
) => {
  setIsLoading(true);
  removeView(newParams, viewFieldType)
    .then(() => {
      dispatch({
        type: "REMOVE_VIEW",
        data: { rowKey, viewFieldType },
      });
      message.success("View removed successfully!");
      setIsLoading(false);
    })
    .catch(() => {
      message.error("Remove view failed!");
      setIsLoading(false);
    });
};

export const realDiffView = ({
  api,
  lastIds,
  skipDiff,
  setLastIds,
  onChangedView,
  onNeedChange,
}: {
  api?: GridApi;
  lastIds: string[];
  skipDiff?: boolean;
  setLastIds: (ids: string[]) => void;
  onChangedView?: (fields: string[]) => void;
  onNeedChange?: (changed: boolean) => void;
}) => {
  const colIds: string[] =
    api?.getAllDisplayedColumns()?.map((item: any) => item.colId) ?? [];
  const newFields: string[] = [];
  colIds?.forEach((item: string) => {
    if (!lastIds.includes(item)) {
      newFields.push(item);
    }
  });
  if ((newFields.length || skipDiff) && onChangedView) {
    onChangedView(newFields);
    onNeedChange?.(true);
  }
  onNeedChange?.(false);
  setLastIds(colIds);
};

interface ViewSelectorProps {
  tradeGridReady?: { api: GridApi };
  viewFieldType: string;
  ems2Subject?: string;
  viewOptions: any;
  name?: string;
  showIndexTerm?: boolean;
  onSelectName?: (name: string | undefined) => void;
  setNameList?: (name: string[]) => void;
  onChangedView?: (fields: string[]) => void;
  onNeedChange?: (changed: boolean) => void;
}
const ViewSelectorComp: FC<ViewSelectorProps> = memo(
  ({
    tradeGridReady = {},
    viewFieldType,
    ems2Subject,
    viewOptions,
    name,
    showIndexTerm,
    onSelectName,
    setNameList,
    onChangedView,
    onNeedChange,
  }) => {
    const { api } = tradeGridReady;
    const [openBuilder, setOpenBuilder] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = React.useState(false);
    const [lastIds, setLastIds] = useState<string[]>([]);
    const [state, dispatch] = useReducer(reducer, defaultState);
    const { viewList, currentView } = state;
    const selectedViewName = useViewName();
    const { startTracking } = useBatchCollect();

    useEffect(() => {
      getViews(viewFieldType).then((list: any[]) => {
        setNameList &&
          setNameList(list[viewFieldType]?.map((item) => item.name));
        dispatch({ type: "UPDATE_VIEWS", data: list });
      });
    }, []);

    useEffect(() => {
      handleCurrentView(
        currentView,
        name,
        selectedViewName,
        clear,
        onSelectName
      );
    }, [currentView?.rowKey]);

    useEffect(() => {
      if (api) {
        const colIds: string[] =
          api.getAllDisplayedColumns()?.map((item: any) => item.colId) || [];
        setLastIds(colIds);
      }
    }, [api]);

    useEffect(() => {
      if (onSelectName && isReady && name && currentView?.name !== name) {
        const config = viewList[viewFieldType].find(
          (item) => item.name === name
        );
        if (config) {
          changeView(config.rowKey, true);
        }
      }
    }, [name, isReady]);

    useEffect(() => {
      if (viewList[viewFieldType]) {
        setIsReady(true);
      }
    }, [viewList]);

    const options = useMemo(() => {
      if (getEnable("View_Builder_POC", viewFieldType)) {
        return generateViewSelectorOptionsForRole(viewList, viewFieldType);
      }
      return generateViewSelectorOptions(viewList, viewFieldType);
    }, [viewList]);

    const delView = (rowKey: string) => {
      const newParams = {
        rowKey,
        moduleOwner: currentView?.moduleOwner,
      };

      confirm({
        title: "Error",
        content: "View format error. Do you want to delete this view?",
        okText: "Remove",
        onOk() {
          checkRemove(setIsLoading, newParams, dispatch, rowKey, viewFieldType);
        },
      });
    };

    const diffView = (skipDiff?: boolean) => {
      realDiffView({
        api,
        lastIds,
        skipDiff,
        setLastIds,
        onChangedView,
        onNeedChange,
      });
    };

    const changeView = useCallback(
      (value: string, skipDiff?: boolean) => {
        setIsLoading(true);
        getView(value, viewFieldType)
          .then((view: any) => {
            api?.applyColumnState({ state: view.body, applyOrder: true });
            diffView(skipDiff);
            dispatch({ type: "UPDATE_CURRENT_VIEW", data: view });
          })
          .catch((error) => {
            if (error.message?.includes("JSON")) {
              dispatch({ type: "UPDATE_CURRENT_VIEW", data: null });
              delView(value);
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      },
      [api, viewList]
    );

    const open = () => {
      const colIds: string[] =
        api?.getAllDisplayedColumns().map((item: any) => item.colId) || [];
      setLastIds(colIds);
      setOpenBuilder(true);
      const track = startTracking(CUSTOM_VIEW_CREATE_MODIFY);
      track([CUSTOM_VIEW_CREATE_MODIFY]);
    };

    const close = () => {
      diffView();
      setOpenBuilder(false);
    };

    const clear = (isReset?: boolean) => {
      if (isReset && api) {
        api.resetColumnState();
        diffView();
      }
      if (!isReset) {
        dispatch({ type: "UPDATE_CURRENT_VIEW", data: {} });
        const track = startTracking(CUSTOM_VIEW_CLEAR);
        track([CUSTOM_VIEW_CLEAR]);
      }
    };

    const selectView = (value: string, option: any) => {
      api?.resetColumnState();
      changeView(value);
      const track = startTracking(CUSTOM_VIEW_SELECTED);
      track([JSON.stringify(option)]);
    };

    return (
      <MfeThemeProvider>
        <Context.Provider value={{ state, dispatch }}>
          <StyleRoot>
            <FieldLabel className={classes.viewSelector} text="Views">
              <Select
                className={classes.selector}
                data-testid="selectView"
                placeholder="Select..."
                optionFilterProp="children"
                popupMatchSelectWidth={false}
                dropdownStyle={{ maxWidth: "350px" }}
                showSearch={true}
                disabled={!api || isLoading}
                loading={isLoading}
                value={currentView?.rowKey}
                onSelect={selectView}
                options={options}
                filterOption={filterOption}
              ></Select>
              <Button
                className={classes.viewBtn}
                disabled={!currentView?.rowKey || isLoading}
                onClick={() => clear()}
                data-testid="customView-clear-btn"
                variant="outlined"
                color="warning"
              >
                Clear
              </Button>
              <Button
                className={classes.viewBtn}
                disabled={!api || isLoading}
                onClick={open}
                data-testid="customView-create-modify-btn"
                variant="contained"
              >
                Create or Modify
              </Button>
            </FieldLabel>
          </StyleRoot>
          <ViewBuilder
            openBuilder={openBuilder}
            onClose={close}
            tradeGridReady={tradeGridReady}
            viewFieldType={viewFieldType}
            ems2Subject={ems2Subject}
            viewOptions={viewOptions}
            showIndexTerm={showIndexTerm}
            data-testid="viewBuildercloseBtn"
          />
        </Context.Provider>
      </MfeThemeProvider>
    );
  }
);

export default ViewSelectorComp;
