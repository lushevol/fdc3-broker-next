import { memo } from "react";

import { WorkflowNodeType } from "../../types/nodeTypes";
import EndNodeForm from "../NodePropertiesConfig/EndNodeForm";
import IfNodeForm from "../NodePropertiesConfig/IfNodeForm";
import InclusiveGatewayNodeForm from "../NodePropertiesConfig/InclusiveGatewayNodeForm";
import ParallelGatewayNodeForm from "../NodePropertiesConfig/ParallelGatewayNodeForm";
import StartEventNodeForm from "../NodePropertiesConfig/StartEventNodeForm";
import UserTaskNodeForm from "../NodePropertiesConfig/UserTaskNodeForm";
import {
  EndEventNodeLayout,
  ExclusiveGatewayNodeLayout,
  InclusiveGatewayNodeLayout,
  ParallelGatewayNodeLayout,
  StartEventNodeLayout,
  UserTaskNodeLayout,
} from "../wrapper/nodeLayout";
import { ILayoutsConfig, PropertiesPanelProps } from "./ILayoutsConfig";

const StartEventPropertiesPanel = memo((props: PropertiesPanelProps) => {
  return <StartEventNodeForm {...props} />;
});

const EndEventPropertiesPanel = memo((props: PropertiesPanelProps) => {
  return <EndNodeForm {...props} />;
});

const UserTaskPropertiesPanel = memo((props: PropertiesPanelProps) => {
  return <UserTaskNodeForm {...props} />;
});

const ExclusiveGatewayPropertiesPanel = memo((props: PropertiesPanelProps) => {
  return <IfNodeForm {...props} />;
});

const ParallelGatewayPropertiesPanel = memo((props: PropertiesPanelProps) => {
  return <ParallelGatewayNodeForm {...props} />;
});

const InclusiveGatewayPropertiesPanel = memo((props: PropertiesPanelProps) => {
  return <InclusiveGatewayNodeForm {...props} />;
});

export const StartEventLayoutConfig: ILayoutsConfig = {
  nodeLayout: StartEventNodeLayout,
  propertiesLayout: StartEventPropertiesPanel,
};

export const EndEventLayoutConfig: ILayoutsConfig = {
  nodeLayout: EndEventNodeLayout,
  propertiesLayout: EndEventPropertiesPanel,
};

export const UserTaskLayoutConfig: ILayoutsConfig = {
  nodeLayout: UserTaskNodeLayout,
  propertiesLayout: UserTaskPropertiesPanel,
};

export const ExclusiveGatewayLayoutConfig: ILayoutsConfig = {
  nodeLayout: ExclusiveGatewayNodeLayout,
  propertiesLayout: ExclusiveGatewayPropertiesPanel,
};

export const ParallelGatewayLayoutConfig: ILayoutsConfig = {
  nodeLayout: ParallelGatewayNodeLayout,
  propertiesLayout: ParallelGatewayPropertiesPanel,
};

export const InclusiveGatewayLayoutConfig: ILayoutsConfig = {
  nodeLayout: InclusiveGatewayNodeLayout,
  propertiesLayout: InclusiveGatewayPropertiesPanel,
};
