import React, { FC, memo, useState, useEffect, useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DeleteOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import ViewOptionsStyledContainertainer, {
  classes,
} from "./common/ViewOptionsStyledContainer";

import { Context } from "./store";

export interface Option {
  field: string;
  headerName: string;
  hide: boolean;
  group: string;
  searchField: string;
  searchHeaderName: string;
  searchShow: boolean;
}

export function dropIndex({ destination, source, api }) {
  const nowColumnState = api.getColumnState();
  let enableNum =
    destination.droppableId === source.droppableId &&
    destination.index > source.index
      ? -1
      : 0;
  const realIndex = nowColumnState.findIndex((item) => {
    if (destination.index === enableNum) {
      return true;
    } else if (!item.hide && !item.pinned) {
      enableNum++;
    }
    return false;
  });

  return realIndex;
}

export const SwitchHeaderName = ({ openField, rowData, setOpenField }) => {
  const isOpen = openField.includes(rowData.headerName);

  const handleOpen = () => {
    if (isOpen) {
      setOpenField(
        openField.filter((item: any) => item !== rowData.headerName)
      );
    } else {
      setOpenField([...openField, rowData.headerName]);
    }
  };

  return (
    <div>
      <Button
        title="Show field name"
        size="small"
        type="link"
        icon={isOpen ? <DownOutlined /> : <RightOutlined />}
        onClick={handleOpen}
        data-testid="show-field-name"
      ></Button>
      <span
        dangerouslySetInnerHTML={{
          __html: rowData.searchHeaderName || rowData.headerName,
        }}
      ></span>
      {isOpen && (
        <div
          style={{
            wordBreak: "break-word",
            paddingLeft: "24px",
            opacity: 0.6,
            fontSize: "12px",
          }}
          dangerouslySetInnerHTML={{
            __html: rowData.searchField || rowData.field,
          }}
        ></div>
      )}
    </div>
  );
};

export function setGroupFun(options: Option[], nowGroup: string, api: any) {
  let groups: string[] = [];
  options.forEach((item) => {
    if (item.hide && item.searchShow && !groups.includes(item.group)) {
      groups.push(item.group);
    }
  });
  groups = Array.from(groups).sort((a: any, b: any) => a.localeCompare(b));
  let groupsData = options.filter(
    (item) =>
      item.group === (nowGroup || groups[0]) && item.hide && item.searchShow
  );
  if (groupsData.length === 0 && nowGroup) {
    groupsData = options.filter((item) => item.group === groups[0]);
  }
  return { groups, groupsData };
}

export const getIndex = (list: any[], colId: string) => {
  let thisIndex = 0;
  list.forEach((item: any, index: number) => {
    if (item.colId === colId) {
      thisIndex = index;
    }
  });
  return thisIndex;
};

export const handleDrag = ({
  result,
  api,
  setOptions,
  resultData,
  updateNewResultData,
}) => {
  const { source, destination, draggableId } = result;
  const colId = draggableId.split("-")[0];

  if (!destination || destination.droppableId === "droppable") {
    return;
  }

  const realIndex = dropIndex({ destination, source, api });

  if (source.droppableId === "droppable2") {
    // sort
    const diff = destination.index > source.index ? 1 : 0;
    api?.moveColumns([colId], realIndex === 0 ? 1 : realIndex - diff);
  } else {
    // add
    const index = getIndex(resultData, colId);
    const compensate = index <= realIndex ? -1 : 0;
    api?.setColumnsVisible([colId], true);
    api?.moveColumns([colId], realIndex + compensate);
  }

  setOptions((value) => {
    const newValue = value.map((item) => {
      if (item.field === colId) {
        return {
          ...item,
          hide: false,
        };
      }
      return item;
    });
    return newValue;
  });
  updateNewResultData();
};

interface ViewOptionsProps {
  tradeGridReady: { api: any };
  isOpen: boolean;
  options: Option[];
  setOptions: (option: Option[] | ((oldOption: Option[]) => Option[])) => void;
  showIndexTerm?: boolean;
  searchValue: string;
}
export const ViewOptions: FC<ViewOptionsProps> = memo(
  ({ tradeGridReady = {}, isOpen, options, setOptions, showIndexTerm }) => {
    const { api } = tradeGridReady;
    const [group, setGroup] = useState<string[]>([]);
    const [groupData, setGroupData] = useState<any>([]);
    const [resultData, setResultData] = useState<any>([]);
    const { state, dispatch } = useContext(Context);
    const [openField, setOpenField] = useState([]);
    const hasFields =
      groupData.filter((item) => item.searchShow && item.hide).length > 0;

    const setNewGroupMap = (nowColumnState: any[]) => {
      options.forEach((item: any) => {
        const thisState = nowColumnState.filter(
          (subItem: any) => subItem.colId === item.field
        );
        item.hide = thisState[0]?.hide;
      });
    };

    const setNewResultData = () => {
      if (isOpen && api) {
        const nowColumnState = api
          .getColumnState()
          .filter(
            (item: { colId: string }) =>
              !["ag-Grid-ControlsColumn"].includes(item.colId)
          );
        const result = nowColumnState.map((item: any, _index: number) => {
          // @ts-ignore
          item.headerName = api.getColumn(item.colId)["colDef"]["headerName"];
          item.enable =
            !item.pinned &&
            item.colId !== "ag-Grid-AutoColumn" &&
            item.colId !== "Select" &&
            !item.hide;
          return item;
        });
        setResultData(result);
        setNewGroupMap(nowColumnState);
      }
    };

    const updateNewResultData = () => {
      const newColumnState = api?.getColumnState();
      setNewResultData();
      dispatch({
        type: "CHANGE_VIEW",
        data: newColumnState,
      });
    };

    const setGroupDataEvent = (item: string) => {
      setGroupData(options.filter((subItem) => subItem.group === item));
    };

    const onDragEnd = (result: any) => {
      handleDrag({
        result,
        api,
        setOptions,
        resultData,
        updateNewResultData,
      });
    };

    const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
      // some basic styles to make the items look a bit nicer
      userSelect: "none",
      // change background colour if dragging
      background: isDragging
        ? "var(--theme-color-modal-filed-hover)"
        : "transparent",
      // styles we need to apply on draggables
      ...draggableStyle,
    });

    const deleteColumn = (colId: string) => {
      setOptions((value) => {
        const newValue = value.map((item) => {
          if (item.field === colId) {
            return {
              ...item,
              hide: true,
            };
          }
          return item;
        });
        return newValue;
      });
      api?.setColumnsVisible([colId], false);
      updateNewResultData();
    };

    const keyDownHander = () => {
      return null;
    };

    useEffect(() => {
      if (isOpen) {
        const { groups, groupsData } = setGroupFun(
          options,
          groupData[0]?.group,
          api
        );
        setGroup(groups);
        setGroupData(groupsData);
        setNewResultData();
      }
    }, [isOpen, options]);

    return (
      <ViewOptionsStyledContainertainer className="view-options">
        <div className={classes.title}>
          <span className="group-title">Category</span>
          <span className="group-data-title">
            Available Fields
            <Tooltip title="Drag the field name to the Display View pane to include within the view">
              <i className="fa fa-question-circle"></i>
            </Tooltip>
          </span>
          <span className="result-data-title">
            Display View
            <Tooltip title="These are the fields and order in which they appear in the view. Drag the field label to change the order">
              <i className="fa fa-question-circle"></i>
            </Tooltip>
          </span>
        </div>
        <div className={classes.column}>
          <div className="group">
            <ul>
              {group.map((item: string) => {
                return (
                  <a
                    className={
                      groupData[0].group === item ? "group-active" : ""
                    }
                    key={item}
                    onClick={() => {
                      setGroupDataEvent(item);
                    }}
                    onKeyDown={keyDownHander}
                  >
                    <li dangerouslySetInnerHTML={{ __html: item }}></li>
                  </a>
                );
              })}
            </ul>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div ref={provided.innerRef} className="group-data">
                  {groupData.map((item: any, index: number) => (
                    <Draggable
                      key={`${item.field}-${index}`}
                      draggableId={`${item.field}-${index}`}
                      index={index}
                    >
                      {(providedL2, snapshotL2) => (
                        <li
                          className={
                            item.hide && item.searchShow ? "show" : "hide"
                          }
                          ref={providedL2.innerRef}
                          {...providedL2.draggableProps}
                          {...providedL2.dragHandleProps}
                          style={getItemStyle(
                            snapshotL2.isDragging,
                            providedL2.draggableProps.style
                          )}
                        >
                          {showIndexTerm ? (
                            <SwitchHeaderName
                              openField={openField}
                              rowData={item}
                              setOpenField={setOpenField}
                            />
                          ) : (
                            <span
                              dangerouslySetInnerHTML={{
                                __html:
                                  item.searchHeaderName || item.headerName,
                              }}
                            ></span>
                          )}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className="arrow">
              <div className="icon"></div>
            </div>
            <Droppable droppableId="droppable2">
              {(provided) => (
                <div ref={provided.innerRef} className="result-data">
                  {resultData
                    .filter((item) => item.enable)
                    .map((item: any, index: number) => (
                      <Draggable
                        key={item.colId}
                        draggableId={item.colId}
                        index={index}
                      >
                        {(providedL2, snapshotL2) => (
                          <li
                            className={item.enable ? "show" : "hide"}
                            ref={providedL2.innerRef}
                            {...providedL2.draggableProps}
                            {...providedL2.dragHandleProps}
                            style={getItemStyle(
                              snapshotL2.isDragging,
                              providedL2.draggableProps.style
                            )}
                          >
                            <Button
                              className="delete-btn"
                              icon={<DeleteOutlined />}
                              type="link"
                              title="Delete"
                              onClick={() => {
                                deleteColumn(item.colId);
                              }}
                            />
                            {item.headerName}
                          </li>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        {!hasFields && <div className="no-fields">No Fields</div>}
      </ViewOptionsStyledContainertainer>
    );
  }
);
