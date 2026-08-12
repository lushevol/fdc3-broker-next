import EventEmitter from "events";

export const eventBus = new EventEmitter();

export const eventTypes = {
  // Show Tags
  REMOVE_AGGRID_FILTER_ITEM: "REMOVE_AGGRID_FILTER_ITEM",
  CHANGE_AGGRID_FILTER_TAG: "CHANGE_AGGRID_FILTER_TAG",
};
