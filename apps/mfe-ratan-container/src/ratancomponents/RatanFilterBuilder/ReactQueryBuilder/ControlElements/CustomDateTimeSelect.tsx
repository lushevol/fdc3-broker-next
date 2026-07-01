import { Button, InputNumber, Select } from "antd";
import { css, styled } from "@mui/material/styles";
import { CURRENT_TIME } from "../Function/DateVariable";
import { useEffect, useState } from "react";

const Root = styled("div")(
  () =>
    css`
      display: flex;
      flex-direction: column;
      .custom-date-button {
        display: block;
        padding: 5px;
        text-align: left;
        margin-left: -5px;
        margin-right: -5px;
      }
      .custom-date-setter {
        position: relative;
        margin-top: 10px;
        border-top: 1px solid rgba(253, 253, 253, 0.12);
        padding-top: 15px;
        padding-bottom: 10px;
      }
      .custom-date-row-one {
        margin-top: 3px;
        width: 100%;
      }
      .custom-date-row-two {
        display: flex;
        margin-top: 5px;
        gap: 3px;
      }
      .custom-date-number-input {
        flex: 1;
      }
    `
);

const options = [
  {
    label: "Hours",
    value: "hours",
  },
  {
    label: "Minutes",
    value: "minutes",
  },
];
export const CustomDateTimeSelect = ({ data, variableList, onChange }) => {
  const [time, setTime] = useState(0);
  const [unit, setUnit] = useState("hours");

  const change = (value) => {
    setTime(Math.floor(value ?? 0));
  };

  const setChange = () => {
    onChange(`${unit}(${time})`);
  };

  useEffect(() => {
    const type = data?.split("(")[0];
    const value = data?.split("(")[1]?.split(")")[0];
    if (value) {
      setUnit(type);
      setTime(parseInt(value));
    }
  }, [data]);

  return (
    variableList.includes("TIME_VAR") && (
      <Root>
        <Button
          type={data == CURRENT_TIME ? "link" : "text"}
          className="custom-date-button"
          onClick={() => onChange(CURRENT_TIME)}
        >
          Current Time
        </Button>
        <div className="custom-date-setter">
          Custom DateTime: <br />
          <Select
            value={unit}
            defaultValue="businessDay"
            size="small"
            placeholder="Select"
            className="custom-date-row-one"
            options={options}
            onChange={(value) => setUnit(value)}
            data-testid="custom-time-type-select"
          />
          <div className="custom-date-row-two">
            <InputNumber
              className="custom-date-number-input"
              value={time}
              size="small"
              onChange={change}
              data-testid="custom-time-value-input"
            />
            <Button type="primary" size="small" onClick={setChange}>
              Set
            </Button>
          </div>
        </div>
      </Root>
    )
  );
};
