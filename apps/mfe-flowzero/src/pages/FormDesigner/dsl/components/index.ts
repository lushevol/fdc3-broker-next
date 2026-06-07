import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";
import { buttonDSL } from "./button";
import { checkboxDSL } from "./checkbox";
import { containerDSL } from "./container";
import { datePickerDSL } from "./datePicker";
import { headerDSL } from "./header";
import { inputDSL } from "./input";
import { inputNumberDSL } from "./inputNumber";
import { multiSelectDSL } from "./multiSelect";
import { radioDSL } from "./radio";
import { selectDSL } from "./select";
import { switchDSL } from "./switch";
import { tabItemDSL } from "./tabItem";
import { tabsDSL } from "./tabs";
import { textDSL } from "./text";
import { textareaDSL } from "./textarea";
import { timePickerDSL } from "./timePicker";
export const componentDSLs: Record<ComponentType, ComponentDSLDefinition> = {
  [ComponentType.CONTAINER]: containerDSL,
  [ComponentType.TABS]: tabsDSL,
  [ComponentType.TAB_ITEM]: tabItemDSL,
  [ComponentType.INPUT]: inputDSL,
  [ComponentType.INPUT_NUMBER]: inputNumberDSL,
  [ComponentType.DATE_PICKER]: datePickerDSL,
  [ComponentType.TIME_PICKER]: timePickerDSL,
  [ComponentType.TEXTAREA]: textareaDSL,
  [ComponentType.SELECT]: selectDSL,
  [ComponentType.CHECKBOX]: checkboxDSL,
  [ComponentType.RADIO]: radioDSL,
  [ComponentType.SWITCH]: switchDSL,
  [ComponentType.BUTTON]: buttonDSL,
  [ComponentType.TEXT]: textDSL,
  [ComponentType.TITLE]: headerDSL,
  [ComponentType.MULTI_SELECT]: multiSelectDSL,
};

export const DEFAULT_PROPS: Record<ComponentType, ComponentProps> =
  Object.values(componentDSLs).reduce((acc, dsl) => {
    acc[dsl.type] = dsl.defaultProps;
    return acc;
  }, {} as Record<ComponentType, ComponentProps>);
