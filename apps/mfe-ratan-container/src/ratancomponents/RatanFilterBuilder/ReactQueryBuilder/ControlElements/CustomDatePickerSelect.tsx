import { Button, InputNumber, Select } from "antd";
import { useMap } from "react-use";
import { css, styled } from "@mui/material/styles";
import {
  CURRENT_DATE,
  LAST_BUSINESS_DATE,
  NEXT_BUSINESS_DATE,
} from "../Function/DateVariable";
import { useEffect } from "react";

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
      }
      .custom-date-number-input {
        flex: 1;
        margin-right: 5px;
      }
    `
);

const options = [
  {
    label: "Business Day",
    value: "businessDay",
  },
  {
    label: "Calendar Day",
    value: "calendarDay",
  },
];
export const CustomDatePickerSelect = ({ data, variableList, onChange }) => {
  const [customDate, { set, setAll }] = useMap({
    type: "businessDay",
    value: 1,
  });
  const min = -1000;
  const max = 1000;

  const change = (value) => {
    if (value === 0) {
      if (value > customDate.value) {
        value++;
      } else {
        value--;
      }
    }
    set("value", Math.floor(value ?? 1));
  };

  const setChange = () => {
    onChange(`${customDate.type}(${customDate.value})`);
  };

  useEffect(() => {
    const type = data?.split("(")[0];
    const value = data?.split("(")[1]?.split(")")[0];
    if (type && value) {
      setAll({
        type,
        value: parseInt(value),
      });
    }
  }, [data]);

  return (
    <Root>
      {variableList.includes("DATE_VAR") && (
        <>
          <Button
            type={data == CURRENT_DATE ? "link" : "text"}
            className="custom-date-button"
            onClick={() => onChange(CURRENT_DATE)}
          >
            Current Date
          </Button>
          <Button
            type={data === LAST_BUSINESS_DATE ? "link" : "text"}
            className="custom-date-button"
            onClick={() => onChange(LAST_BUSINESS_DATE)}
          >
            Last Business Day
          </Button>
          <Button
            type={data === NEXT_BUSINESS_DATE ? "link" : "text"}
            className="custom-date-button"
            onClick={() => onChange(NEXT_BUSINESS_DATE)}
          >
            Next Business Day
          </Button>
        </>
      )}
      {variableList.includes("CUSTOM_DATE") && (
        <div className="custom-date-setter">
          Custom Day:
          <Select
            value={customDate.type}
            defaultValue="businessDay"
            size="small"
            placeholder="Select"
            className="custom-date-row-one"
            options={options}
            onChange={(value) => set("type", value)}
            data-testid="custom-day-type-select"
          />
          <div className="custom-date-row-two">
            <InputNumber
              className="custom-date-number-input"
              value={customDate.value}
              defaultValue={1}
              type="number"
              size="small"
              onChange={change}
              data-testid="custom-day-value-select"
              max={max}
              min={min}
              onBlur={(e) => {
                const value = Number(e.target.value);
                if (value < min) {
                  set("value", min);
                } else if (value > max) {
                  set("value", max);
                }
              }}
            />
            <Button type="primary" size="small" onClick={setChange}>
              Set
            </Button>
          </div>
        </div>
      )}
    </Root>
  );
};
