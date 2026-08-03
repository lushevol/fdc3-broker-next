
const AMPM_VALUES = ['am', 'pm'];

export interface VALUE_OPTION {
  value: number | string,
  label: number | string,
  disabled?: boolean,
  selected?: boolean
}

export interface TIME_DEFAULT_VALUE {
  hour: number,
  minute: number,
  second: number
}

export interface TYPES_MAPPING_TYPE {
  [key: string]: string
}

export const TYPES_MAPPING: TYPES_MAPPING_TYPE = {
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
};

export const generateValues = (
  min: number, 
  max: number, 
  step: number | string, 
  disabledValues: number[] = [], 
  is2DigitalNumber = false,
  selectedValue: number | undefined
) => {
  const arr = [];
  for (let i = min; i <= max; i = i + Number(step)) {
    arr.push({
      value: i,
      label: is2DigitalNumber && i < 10 ? `0${i}` : i,
      disabled: disabledValues.includes(i),
      selected: i === selectedValue,
    });
  }
  return arr;
};

export const generateAMPM = (isUpperCase = false, selectedValue: string) => {
  return AMPM_VALUES.map((v: string) => (
    {
      value: isUpperCase ? v.toUpperCase() : v,
      label: isUpperCase ? v.toUpperCase() : v,
      selected: v.toUpperCase() === selectedValue.toUpperCase(),
    }
  ));
};

export const generateDateTimeString = (hour: number, minute: number, second: number) => {
  const timeString = `${transTime(hour)}:${transTime(minute)}:${transTime(second)}`;
  return generateTestData(timeString);
};

export const generateTestData = (timeString: string) => `1970-01-01T ${timeString}`;

const transTime = (v: number) => v < 10 ? `0${  v}` : v;