import { createPortal } from "react-dom";
import { Hooks } from "../../Root/import";

const { getHooks } = Hooks;

const getCurrentTile = () => {
  const { store } = getHooks();
  const currentTab = document.querySelector(
    `[tabid="${store.currentWorkspace?.id}"]`
  );
  return currentTab;
};

const rtCreatePortal = (dom: any, inTile?: boolean) => {
  let domNode: Element = document.body;
  if (inTile) {
    const currentTile = getCurrentTile();
    domNode = currentTile || document.body;
  }
  return createPortal(dom, domNode);
};

export default rtCreatePortal;
