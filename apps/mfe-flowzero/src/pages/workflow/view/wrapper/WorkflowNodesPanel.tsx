import React, { memo } from "react";
import CodeIcon from "src/images/node_icon/Code.png";
import HttpIcon from "src/images/node_icon/Http.png";
import IfIcon from "src/images/node_icon/If.png";
import ParallelGatewayIcon from "src/images/node_icon/Parallel_Gateway.png";
import EndIcon from "src/pages/workflow/view/node_icon/End.png";
import InclusiveGatewayIcon from "src/pages/workflow/view/node_icon/Inclusive_Gateway.png";
import StartEventIcon from "src/pages/workflow/view/node_icon/Start_Task.png";
import UserTaskIcon from "src/pages/workflow/view/node_icon/User_Task.png";
import DragableNodes from "src/pages/workflow/view/wrapper/DragableNodes";

import HeaderBg from "/src/images/WorkflowDesignPanelBg.png";
import HeaderDarkBg from "/src/images/WorkflowDesignPanelDarkBg.png";

import { WorkflowNodeType } from "../../types/nodeTypes";

interface NodeListItem {
  name: string;
  id: string;
  type: WorkflowNodeType;
  desc: string;
  icon: string;
}

const nodeList: NodeListItem[] = [
  {
    name: "Start with Form",
    id: "start-event",
    type: WorkflowNodeType.START_EVENT,
    desc: "The Start Node connects with a form. Form submission will initiate the workflow.",
    icon: StartEventIcon,
  },
  {
    name: "End",
    id: "end",
    type: WorkflowNodeType.END_EVENT,
    desc: "The End Node marks the completion of the workflow.",
    icon: EndIcon,
  },
  {
    name: "If",
    id: "exclusive-gateway",
    type: WorkflowNodeType.EXCLUSIVE_GATEWAY,
    desc: "The Exclusive Gatway Node that routes the flow to the True or False branch.",
    icon: IfIcon,
  },
  {
    name: "Inclusive Gateway",
    id: "inclusive-gateway",
    type: WorkflowNodeType.INCLUSIVE_GATEWAY,
    desc: "The inclusive gateway allows for making multiple decisions based on data.",
    icon: InclusiveGatewayIcon,
  },
  {
    name: "Parallel Gateway",
    id: "parallel-gateway",
    type: WorkflowNodeType.PARALLEL_GATEWAY,
    desc: "A parallel gateway allows you to split the flow into concurrent paths.",
    icon: ParallelGatewayIcon,
  },
  {
    name: "Workflow Step",
    id: "user-task",
    type: WorkflowNodeType.USER_TASK,
    desc: "The User Task Node where the assigned user reviews and takes actions on the task.",
    icon: UserTaskIcon,
  },
];

const WorkflowNodePanel = () => {
  return (
    <div className="border-l-[#ccc] dark:border-l-[#666666] border-l  bg-white border-r border-gray-200 dark:bg-[#171d24] h-full overflow-y-auto">
      <div>
        {nodeList.map((node) => (
          <DragableNodes
            key={node.id}
            nodeConfig={{
              name: node.name,
              id: node.id,
              type: node.type,
            }}
          >
            <div className="flex items-start px-[16px] border-l-2 border-l-transparent space-x-4 cursor-pointer  hover:border-l-[#737373] dark:hover:bg-transparent dark:hover:border-l-[#0473EA] py-[12px] mb-[8px] transition">
              <div
                className={`rounded-lg w-[75px] h-[75px] flex items-center justify-center`}
              >
                <img src={node.icon} alt={node.name} className="max-w-[75px]" />
              </div>
              <div className="h-[75px] flex flex-col justify-center">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-[#D9D9D9] mb-[8px]">
                    {node.name}
                  </div>
                  <div className="text-gray-500 text-[12px] h-[30px] leading-[16px]  line-clamp-2 dark:text-[#808080]">
                    {node.desc}
                  </div>
                </div>
              </div>
            </div>
          </DragableNodes>
        ))}
      </div>
    </div>
  );
};

export default memo(WorkflowNodePanel);
