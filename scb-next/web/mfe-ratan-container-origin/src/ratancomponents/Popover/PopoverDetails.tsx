import React, { FC, memo, PropsWithChildren, useMemo } from "react";
import { deepClone } from "../../ratanutils/utils";

import { Time } from "../../Root/import/index";

import "./PopoverDetails.less";

interface PopoverDetailsProps {
  fieldsList?: {
    name: string;
    title?: string;
    fields: {
      label: string;
      field: string | number;
      type?: string;
      handle?: Function;
      render?: JSX.IntrinsicElements;
    }[];
  }[];
  details?: any;
}

const initInterComp = (item, details) => {
  let itemValue: any = "";
  let Component: any;

  if (item.handle) {
    itemValue = item.handle(details);
  } else if (item.render) {
    Component = item.render;
  } else {
    itemValue = item.field ? details[item.field] : "";
  }

  return {
    itemValue,
    Component,
  };
};

const getTimeComp = (item, itemValue) => {
  let comp;
  if (item.type === "time") {
    comp = (
      <td>
        <Time value={itemValue} field={item.field} />
      </td>
    );
  }
  return comp;
};

const getItemValueComp = (itemValue) => {
  let itemValueComponent = <td>{itemValue}</td>;
  if (itemValue && itemValue.$$typeof === Symbol.for("react.element")) {
    itemValueComponent = itemValue;
  }
  return itemValueComponent;
};

export const PopoverDetails: FC<PropsWithChildren<PopoverDetailsProps>> = memo(
  ({ fieldsList, details, children }) => {
    const setItem = (fields: any) => {
      if (details) {
        return fields.map((item: any) => {
          let { itemValue, Component } = initInterComp(item, details);

          itemValue = getTimeComp(item, itemValue);

          if (item.handle) {
            itemValue = item.handle(details);
          } else if (item.render) {
            Component = item.render;
          } else if (item.field && typeof item.field === "string") {
            const fieldArray = item.field.split(".");
            let value = deepClone(details);
            fieldArray.forEach((fieldItem: string) => {
              if (value) {
                value = value[fieldItem];
              }
            });
            itemValue = value;
          } else itemValue = "";

          const itemValueComponent = getItemValueComp(itemValue);

          return (
            <tr className="popover-item" key={item.label}>
              <td className="popover-label">{item.label}</td>
              {Component ? <Component data={details} /> : itemValueComponent}
            </tr>
          );
        });
      }
      return "";
    };

    const mapFields = useMemo(() => {
      if (fieldsList) {
        return fieldsList.map((item: any) => {
          return (
            <div key={item.name}>
              <div className="popover-name">{item.name}</div>
              {item.title && (
                <h2 className="popover-title-main">{item.title}</h2>
              )}
              <table>
                <tbody>{setItem(item.fields)}</tbody>
              </table>
            </div>
          );
        });
      }
      return "";
    }, [fieldsList]);

    return (
      <div className="popover-body" data-testid="popover-body">
        {children || mapFields}
      </div>
    );
  }
);
