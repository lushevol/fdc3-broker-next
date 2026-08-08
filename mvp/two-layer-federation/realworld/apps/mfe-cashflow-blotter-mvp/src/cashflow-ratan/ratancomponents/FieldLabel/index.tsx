import React, { FC, PropsWithChildren, useMemo, useState } from "react";
import cn from "classnames";
import { Dropdown, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import MfeThemeProvider from "../../Root/component/MfeThemeProvider";
import StyledRoot from "./styleRoot";
import { plattenStr } from "../../packages/Analysis/utils";

interface FieldLabelProps {
  text: string;
  className?: string;
  labelWidth?: string | number;
  formWidth?: string | number;
  order?: number;
}

export const FieldLabel: FC<PropsWithChildren<FieldLabelProps>> = ({
  text,
  className = "",
  labelWidth = 0,
  formWidth = 0,
  order,
  children,
}) => {
  const thisClassName = cn("field-label", className);
  const labelStyle = labelWidth
    ? {
        width: labelWidth,
      }
    : {};
  const childStyle = formWidth ? { width: formWidth } : {};

  return (
    <MfeThemeProvider>
      <StyledRoot>
        <div className={thisClassName} style={{ order }}>
          <label className="field-label-label" style={labelStyle}>
            {text}
          </label>
          <div className="field-label-children" style={childStyle}>
            {children}
          </div>
        </div>
      </StyledRoot>
    </MfeThemeProvider>
  );
};

interface DynamickFieldLabelProps {
  config: any[];
  className?: string;
  labelWidth?: number;
  formWidth?: number;
  order?: number;
  active?: QuickSearchItemConfig;
  onChange: ({ field, label }) => void;
}
export const DynamickFieldLabel: FC<
  PropsWithChildren<DynamickFieldLabelProps>
> = ({
  config,
  className = "",
  labelWidth = 0,
  formWidth = 0,
  order,
  children,
  active,
  onChange,
}) => {
  const [label, setLabel] = useState(active?.label || config[0].label);
  const thisClassName = cn("field-label", className);
  const labelStyle = labelWidth
    ? {
        width: labelWidth,
      }
    : {};
  const childStyle = formWidth ? { width: formWidth } : {};

  const items = useMemo(() => {
    const itemOptions: ItemType[] = [];
    config.forEach((item: any) => {
      if (
        !item.disabled &&
        (!active || active.field !== item.field || active.label !== item.label)
      ) {
        itemOptions.push({
          label: item.label,
          key: `${item.field}-${item.label}`,
          className: `kp--${item.label}`,
        });
      }
    });
    return itemOptions;
  }, [config, active]);

  const changeLabel: MenuProps["onClick"] = ({ key }) => {
    const [field, label] = key.split("-");
    setLabel(label);
    onChange({ field, label });
  };

  const keyDownHander = () => {
    return null;
  };

  return (
    <MfeThemeProvider>
      <StyledRoot>
        <div
          className={thisClassName}
          style={{ order }}
          data-testid="dynamickLabel"
        >
          <Dropdown menu={{ items, onClick: changeLabel }}>
            <label
              className={`field-label-label kp--${plattenStr(label)}`}
              style={labelStyle}
            >
              <a
                onClick={(e) => e.preventDefault()}
                onKeyDown={keyDownHander}
                style={{
                  display: "flex",
                  placeContent: "end",
                  placeItems: "center",
                }}
              >
                {label}
                <DownOutlined />
              </a>
            </label>
          </Dropdown>
          <div className="field-label-children" style={childStyle}>
            {children}
          </div>
        </div>
      </StyledRoot>
    </MfeThemeProvider>
  );
};
