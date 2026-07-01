import { Form, Input } from "antd";
import cn from "classnames";
import React, { useEffect } from "react";

import { PropertiesPanelProps } from "../config/ILayoutsConfig";
import LightBulbIcon from "../node_icon/lightBulb.png";
import ToolTipIcon from "../node_icon/tooltip2.svg";
import ToolTipIconDark from "../node_icon/tooltip2_dark.svg";

const ParallelGatewayNodeForm: React.FC<PropertiesPanelProps> = ({
  nodeData,
  onNodeDataChange,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(nodeData || {});
  }, [nodeData, form]);

  const handleValuesChange = (_: any, allValues: any) => {
    if (nodeData) {
      Object.assign(nodeData, allValues);
      onNodeDataChange?.(allValues);
    }
  };

  return (
    <div>
      {/* Info banner */}
      <div
        className={cn(
          "flex flex-row items-start gap-[3px]",
          "rounded-[5px] mb-[16px]",
          "bg-[#E5F1FC] dark:bg-[#1A1A1A] pr-[8px]"
        )}
      >
        <div className="flex items-start p-[9px_2px_9px_10.5px] shrink-0 translate-y-[1px]">
          <img
            src={ToolTipIcon}
            alt="info"
            className="w-full h-full dark:hidden"
          />
          <img
            src={ToolTipIconDark}
            alt="info"
            className="w-full h-full hidden dark:block"
          />
        </div>
        <div className="flex flex-col p-[9px_3px] gap-[2px] flex-1">
          <span
            className={cn(
              "font-medium text-[12px] leading-[18px] text-[#035CBB] dark:text-[#1D81EC]"
            )}
          >
            Parallel Gateway
          </span>
          <span
            className={cn(
              "font-normal text-[12px] leading-[16px] text-[#595959] dark:text-dark-content-body"
            )}
          >
            This gateway automatically splits the workflow into parallel paths
            and synchronizes them back together. All paths execute
            simultaneously and no configuration is needed.
          </span>
        </div>
      </div>

      {/* Label field */}
      <Form layout="vertical" form={form} onValuesChange={handleValuesChange}>
        <Form.Item
          label={
            <span className="font-medium text-[12px] text-[#4D4D4D] dark:text-dark-content-label-text">
              Label
            </span>
          }
          name="label"
        >
          <Input
            maxLength={200}
            className="h-[32px] dark:!bg-[#262626] dark:!border-[#666666] dark:text-[#a0a0a0]"
          />
        </Form.Item>
      </Form>

      {/* How it works section */}
      <div className="mt-[16px]">
        <div
          className={cn(
            "flex items-center",
            "border-b border-b-[#cccccc] dark:border-b-[#444] pb-[8px] mb-[12px]"
          )}
        >
          <span className="font-bold text-[12px] leading-[16px] text-[#0367D2] dark:text-[#1D81EC]">
            How it works
          </span>
        </div>

        <div
          className={cn(
            "flex flex-row items-center gap-[16px]",
            "p-[24px]",
            "border border-dashed border-[#CCCCCC] rounded-[4px]",
            "bg-[#F9F9F9] dark:bg-[#1A1A1A] dark:border-[#444]"
          )}
        >
          <img
            src={LightBulbIcon}
            alt="How it works"
            className="w-[53px] h-[146px] shrink-0 object-contain"
          />
          <div className="flex flex-col gap-[6px]">
            <span className="font-semibold text-[14px] leading-[22px] text-[#262626] dark:text-dark-content-title">
              How it works
            </span>
            <div className="flex flex-col gap-[4px]">
              <p className="text-[12px] leading-[18px] text-[#595959] dark:text-dark-content-body m-0">
                <span className="font-semibold">Multiple Outputs:</span> All
                outgoing paths are activated simultaneously
              </p>
              <p className="text-[12px] leading-[18px] text-[#595959] dark:text-dark-content-body m-0">
                <span className="font-semibold">Multiple Inputs:</span> All
                incoming paths must complete before continuing
              </p>
              <p className="text-[12px] leading-[18px] text-[#595959] dark:text-dark-content-body m-0">
                <span className="font-semibold">No Conditions:</span> All
                connected paths are always activated
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallelGatewayNodeForm;
