import React, { FC } from "react";
import { Row, Col } from "antd";

import { deepClone, isEmpty } from "../../ratanutils/utils";
import { Loading } from "../../ratancomponents/Loading";

import "./style.less";

const getValue = (config: any, data: any) => {
  return config.map((item: any) => {
    if (Array.isArray(item.sameLine)) {
      item.sameLine = getValue(item.sameLine, data);
    } else {
      if (item.valueGetter && typeof item.valueGetter === "function") {
        let value = deepClone(data);
        value = item.valueGetter(value);
        return { ...item, value };
      } else if (item.field && typeof item.field === "string") {
        const fieldArray = item.field.split(".");
        let value = deepClone(data);
        fieldArray.forEach((field: string) => {
          if (value) {
            value = value[field];
          }
        });
        return { ...item, value };
      } else if (item.field && Array.isArray(item.field)) {
        const value: any = [];
        item.field.forEach((a: any) => {
          const fieldArray = a.split(".");
          let newData = deepClone(data);
          fieldArray.forEach((field: string) => {
            if (newData) {
              newData = newData[field];
            }
          });
          value.push(newData);
        });
        return { ...item, value };
      }
    }

    return item;
  });
};

const loadingValue = (value: any, config: any, allData: any) => {
  if (typeof value === "undefined") {
    return <Loading loading={true} size={12} />;
  } else if (typeof config.render === "function") {
    return config.render(value, allData);
  } else if (typeof config.valueFormatter === "function") {
    return config.valueFormatter(allData);
  }
  return value && value !== "" ? value : "---";
};

const handleColon = (label: string) => {
  if (label.includes(":")) {
    return (
      <div className="colon">
        <span>{label.split(":")[0]}</span>
        <span>:</span>
      </div>
    );
  }
  return label;
};

const createColl = (item, data, spans, flex) => {
  const cols = [];
  if (!(item.deleteOnceValueEmpty && isEmpty(item.value))) {
    if (Array.isArray(item.value)) {
      const newSpan = spans ? spans[1] / item.value.length : undefined;
      item.value.forEach((subItem: string, subIndex: number) => {
        cols.push(
          //@ts-ignore
          <Col
            span={newSpan}
            flex={flex ? flex[1] : undefined}
            className="value"
            key={`${item.label}Col${subIndex}`}
          >
            {loadingValue(subItem, item, data)}
          </Col>
        );
      });
    } else {
      cols.push(
        //@ts-ignore
        <Col
          span={spans ? spans[1] : undefined}
          flex={flex ? flex[1] : undefined}
          className="value"
          key={`${item.label}Col`}
        >
          {loadingValue(item.value, item, data)}
        </Col>
      );
    }
  }

  return cols;
};

interface CustomRowProps {
  config: any;
  data: any;
  spans?: number[];
  flex?: string[];
}
export const CustomRow: FC<CustomRowProps> = ({
  config,
  data,
  spans,
  flex,
}) => {
  const thisConfig = getValue(config, data);
  return thisConfig.map((item: any, index: number) => {
    let cols: any[] = [];

    if (Array.isArray(item.sameLine)) {
      item.sameLine.forEach((subItem) => {
        cols.push(
          <Col
            span={subItem.spans ? subItem.spans[0] : undefined}
            flex={subItem.flex ? subItem.flex[0] : undefined}
            className="label"
            key={`${subItem.label}`}
          >
            {handleColon(subItem.label)}
          </Col>
        );
        cols = [
          ...cols,
          ...createColl(subItem, data, subItem.spans, subItem.flex),
        ];
      });
    } else {
      cols.push(
        <Col
          span={spans ? spans[0] : undefined}
          flex={flex ? flex[0] : undefined}
          className="label"
        >
          {handleColon(item.label)}
        </Col>
      );
      cols = [...cols, ...createColl(item, data, spans, flex)];
    }

    return !item.deleteField ? (
      <Row className="custom-row" key={`${item.label}Label${index}`}>
        {cols}
      </Row>
    ) : null;
  });
};
