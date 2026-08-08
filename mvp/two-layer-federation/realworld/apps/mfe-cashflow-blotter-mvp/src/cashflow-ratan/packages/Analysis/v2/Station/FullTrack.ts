import { MonitorEventSubType, MonitorEventType } from "../Event/type";
import { ItemSubType, ItemType } from "../Item/type";
import { constructPath, parsePath } from "../Item/utils";
import { emit } from "../Sensor";
import { featureScopedEnabled } from "../import";

export const capturableNodeName = ["button", "svg", "li"];

export const RATAN_CONTAINER_ROOT_CLASSNAME =
  "MicroWebUI_ratan_container_page_container_page";

// export const TRACKABLE_DOM_PREFIX = "TrackableDom:";

export const FULL_TRACK_INDENTIFIER_PREFIX = "kp--";
export const ITEM_PATH_SEPERATOR = "/";

enum DomTrackable {
  NOT_TRACKABLE,
  TRACK_BY_TESTID,
  TRACK_BY_KP,
}

type DomTrackPayload = {
  type: DomTrackable;
  payload?: string | string[];
};

export const MouseEventCapture = (e: MouseEvent) => {
  requestIdleCallback(() => {
    const { clientX, clientY, target } = e;
    const { nodeName, innerText } = target as HTMLElement;
    const trackable = isTrackableEvent(e);
    if (trackable.type != DomTrackable.NOT_TRACKABLE) {
      let itemPathList: string[] = [];
      let itemPath = "";

      if (trackable.type === DomTrackable.TRACK_BY_TESTID) {
        itemPath = trackable.payload as string;
        itemPathList = parsePath(itemPath);
      } else if (trackable.type === DomTrackable.TRACK_BY_KP) {
        itemPathList = trackable.payload as string[];
        itemPath = constructPath(itemPathList);
      }
      emit(
        {
          name: "Full Track Click",
          type: MonitorEventType.ACTION,
          subType: MonitorEventSubType.Click,
          item: {
            name: itemNameParser(itemPathList),
            path: itemPath,
            type: ItemType.Element, // all clickable item are element.
            subType: nodeName?.toLocaleLowerCase() as ItemSubType,
          },
        },
        [
          {
            tag: "Element Text",
            value: innerText,
          },
          {
            tag: "clientX",
            value: clientX + "",
          },
          {
            tag: "clientY",
            value: clientY + "",
          },
        ]
      );
    }
  });
};

export const isTrackableEvent = (e: MouseEvent): DomTrackPayload => {
  const { target } = e;
  if (!target) return { type: DomTrackable.NOT_TRACKABLE };
  // @ts-ignore
  const { nodeName } = target;
  return (
    (typeof nodeName === "string" &&
      capturableNodeName.includes(nodeName.toLowerCase()) &&
      checkDomTrackable(target as HTMLElement)) || {
      type: DomTrackable.NOT_TRACKABLE,
    }
  );
};

// 0: not tracking dom
// 1: testid
// 2: key path
export const checkDomTrackable = (e: HTMLElement): DomTrackPayload => {
  const testId = itemPathParser(e.dataset);
  if (isTestIdTrackable(testId))
    return {
      type: DomTrackable.TRACK_BY_TESTID,
      payload: testId,
    };
  if (featureScopedEnabled("PM_Client_SDK_V2_Enable_Check_KP")) {
    const kpIds = reduceGetKeyPathIdentifierList(e);
    if (kpIds.length) return { type: DomTrackable.TRACK_BY_KP, payload: kpIds };
  }
  // remove this due to mount dom may on body
  // while (!isRatanContainerRootDom(e)) {
  //   const parent = e.parentElement;
  //   if (!parent) return false;
  //   e = parent;
  // }

  return { type: DomTrackable.NOT_TRACKABLE };
};

// const isRatanContainerRootDom = (target: HTMLElement): boolean => {
//   return target.classList.contains(RATAN_CONTAINER_ROOT_CLASSNAME);
// };

const isTestIdTrackable = (testId?: string) => {
  return testId?.startsWith(ITEM_PATH_SEPERATOR);
};

const extractKeyPathIdentifierFromClass = (className: string): string => {
  if (!className) return "";
  const matched = className.match?.(
    new RegExp(FULL_TRACK_INDENTIFIER_PREFIX + "[a-z_/]+")
  );

  return matched?.at(0)?.slice(FULL_TRACK_INDENTIFIER_PREFIX.length) ?? "";
};

const reduceGetKeyPathIdentifierList = (e: HTMLElement): string[] => {
  const idList: string[] = [];
  while (e.nodeName !== "html") {
    const kpId = extractKeyPathIdentifierFromClass(e.className);
    if (kpId) idList.unshift(kpId);

    // find in parent
    const parent = e.parentElement;
    if (!parent) return idList;
    e = parent;
  }

  return idList;
};

const itemPathParser = (dataset: DOMStringMap) => {
  return dataset.testid ?? "";
};

const itemNameParser = (itemPathList: string[]) => {
  return itemPathList.at(-1) ?? "";
};

// export const encodeTestId = (ti: string) => {
//   return TRACKABLE_DOM_PREFIX + encode(ti);
// };

// export const decodeTestId = (ti: string) => {
//   try {
//     if (ti.startsWith(TRACKABLE_DOM_PREFIX))
//       return decode(ti.slice(TRACKABLE_DOM_PREFIX.length));
//   } catch (error) {}

//   return ti;
// };
