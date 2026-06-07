import React from "react";

import { ComponentType } from "../types";
import { ButtonElement } from "./elements/ButtonElement";
import { CheckboxElement } from "./elements/CheckboxElement";
import { ContainerElement } from "./elements/ContainerElement";
import { DatePickerElement } from "./elements/DatePickerElement";
import { HeaderElement } from "./elements/HeaderElement";
import { InputElement } from "./elements/InputElement";
import { NumberInputElement } from "./elements/NumberInputElement";
import { RadioElement } from "./elements/RadioElement";
import { SelectElement } from "./elements/SelectElement";
import { SwitchElement } from "./elements/SwitchElement";
import { TabsElement } from "./elements/TabsElement";
import { TextareaElement } from "./elements/TextareaElement";
import { TextElement } from "./elements/TextElement";
import { TimePickerElement } from "./elements/TimePickerElement";
import { ElementRendererProps } from "./elements/types";

interface ElementRendererInput extends ElementRendererProps {
  type: ComponentType;
}

const TabItemPlaceholder: React.FC<ElementRendererProps> = () => null; // TAB_ITEM is rendered via TabsElement

const renderers: Record<ComponentType, React.FC<ElementRendererProps>> = {
  [ComponentType.TITLE]: HeaderElement,
  [ComponentType.TEXT]: TextElement,
  [ComponentType.INPUT]: InputElement,
  [ComponentType.INPUT_NUMBER]: NumberInputElement,
  [ComponentType.DATE_PICKER]: DatePickerElement,
  [ComponentType.TIME_PICKER]: TimePickerElement,
  [ComponentType.TEXTAREA]: TextareaElement,
  [ComponentType.SELECT]: SelectElement,
  [ComponentType.MULTI_SELECT]: SelectElement,
  [ComponentType.CHECKBOX]: CheckboxElement,
  [ComponentType.RADIO]: RadioElement,
  [ComponentType.SWITCH]: SwitchElement,
  [ComponentType.BUTTON]: ButtonElement,
  [ComponentType.CONTAINER]: ContainerElement,
  [ComponentType.TABS]: TabsElement,
  [ComponentType.TAB_ITEM]: TabItemPlaceholder,
};

export const FormElementRenderer: React.FC<ElementRendererInput> = ({
  type,
  props,
  children,
  node,
  activeTabId,
  onTabChange,
  isPreview,
}) => {
  const Renderer = renderers[type];

  if (!Renderer) {
    return <div className="text-red-500">Unknown Component: {type}</div>;
  }

  return (
    <Renderer
      props={props}
      children={children}
      node={node}
      activeTabId={activeTabId}
      onTabChange={onTabChange}
      isPreview={isPreview}
    />
  );
};
