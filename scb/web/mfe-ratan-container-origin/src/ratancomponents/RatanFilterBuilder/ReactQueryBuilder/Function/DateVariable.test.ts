import { currentDateName, CURRENT_DATE, CURRENT_TIME, customDateName, generateDatePickerFormat, getBusinessDay, isVariableHandlingEnabled, lastBusinessDateName, LAST_BUSINESS_DATE, nextBusinessDateName, NEXT_BUSINESS_DATE } from "./DateVariable";
import dayjs from "dayjs";

describe('generateDatePickerFormat', () => {
  test('should format valid date when format is provided', () => {
    const format = 'YYYY-MM-DD';
    const realValue = '2023-10-05';
    const value = dayjs(realValue);
    const expected = value.format(format);
    expect(generateDatePickerFormat(format)(realValue, value)).toBe(expected);
  });

  test('should return empty string when realValue is empty', () => {
    const format = 'YYYY-MM-DD';
    const realValue = '';
    const value = dayjs();
    const expected = '';
    expect(generateDatePickerFormat(format)(realValue, value)).toBe(expected);
  });

  test('should return currentDateName when CURRENT_DATE is passed', () => {
    const format = 'YYYY-MM-DD';
    const realValue = CURRENT_DATE;
    const value = dayjs();
    expect(generateDatePickerFormat(format)(realValue, value)).toBe(currentDateName);
  });

  test('should return lastBusinessDateName when LAST_BUSINESS_DATE is passed', () => {
    const format = 'YYYY-MM-DD';
    const realValue = LAST_BUSINESS_DATE;
    const value = dayjs();
    expect(generateDatePickerFormat(format)(realValue, value)).toBe(lastBusinessDateName);
  });

  test('should return nextBusinessDateName when NEXT_BUSINESS_DATE is passed', () => {
    const format = 'YYYY-MM-DD';
    const realValue = NEXT_BUSINESS_DATE;
    const value = dayjs();
    expect(generateDatePickerFormat(format)(realValue, value)).toBe(nextBusinessDateName);
  });

  test('should return customDateName when an unknown value is passed', () => {
    const format = 'YYYY-MM-DD';
    const realValue = 'UNKNOWN';
    const value = dayjs();
    expect(generateDatePickerFormat(format)(realValue, value)).toBe(customDateName);
  });

  test('should return correct day format when custom day is passed', () => {
    const format = 'YYYY-MM-DD';
    const value = dayjs();
    expect(generateDatePickerFormat(format)('businessDay(2)', value)).toBe('Business Day (+2)');
    expect(generateDatePickerFormat(format)('businessDay(5)', value)).toBe('Business Day (+5)');
    expect(generateDatePickerFormat(format)('businessDay(-2)', value)).toBe('Business Day (-2)');
    expect(generateDatePickerFormat(format)('businessDay(-5)', value)).toBe('Business Day (-5)');
    expect(generateDatePickerFormat(format)('calendarDay(2)', value)).toBe('Calendar Day (+2)');
    expect(generateDatePickerFormat(format)('calendarDay(5)', value)).toBe('Calendar Day (+5)');
    expect(generateDatePickerFormat(format)('calendarDay(-2)', value)).toBe('Calendar Day (-2)');
    expect(generateDatePickerFormat(format)('calendarDay(-5)', value)).toBe('Calendar Day (-5)');
  });

  test('should return correct time format when custom time is passed', () => {
    const format = 'YYYY-MM-DD';
    const value = dayjs();
    expect(generateDatePickerFormat(format)('hours(2)', value)).toBe('Hours (+2)');
    expect(generateDatePickerFormat(format)('minutes(-5)', value)).toBe('Minutes (-5)');
  });
});

describe('DateVariable', () => {
  it("isVariableHandlingEnabled", () => {
    const res = isVariableHandlingEnabled("date", "=");
    expect(res).toBe(true);

    const res2 = isVariableHandlingEnabled("number", "=");
    expect(res2).toBe(false);
  });
});

describe('getBusinessDay', () => {
  test('should return current date when CURRENT_DATE is passed', () => {
    const currentDate = dayjs().startOf('day').format('YYYY-MM-DD');
    expect(getBusinessDay(CURRENT_DATE)).toBe(currentDate);
  });

  test('should return last business day when LAST_BUSINESS_DATE is passed', () => {
    let lastDay = dayjs().subtract(1, 'day').startOf('day');
    while (lastDay.day() === 0 || lastDay.day() === 6) {
      lastDay = lastDay.subtract(1, 'day');
    }
    const lastBusinessDate = lastDay.format('YYYY-MM-DD');
    expect(getBusinessDay(LAST_BUSINESS_DATE)).toBe(lastBusinessDate);
  });

  test('should return next business day when NEXT_BUSINESS_DATE is passed', () => {
    let nextDay = dayjs().add(1, 'day').startOf('day');
    while (nextDay.day() === 0 || nextDay.day() === 6) {
      nextDay = nextDay.add(1, 'day');
    }
    const nextBusinessDate = nextDay.format('YYYY-MM-DD');
    expect(getBusinessDay(NEXT_BUSINESS_DATE)).toBe(nextBusinessDate);
  });

  test('should return the same value when an unknown value is passed', () => {
    const unknownValue = 'UNKNOWN';
    expect(getBusinessDay(unknownValue)).toBe(unknownValue);
  });

  test('should return current date when CURRENT_TIME is passed', () => {
    const currentTime = dayjs().utc().format("YYYY-MM-DDTHH:mm:ssZ");
    expect(getBusinessDay(CURRENT_TIME)).toBe(currentTime);
  })

  test('should return custom time when hours is passed', () => {
    const slaTime = dayjs().add(-4, 'hours').utc().format("YYYY-MM-DDTHH:mm:ssZ");
    expect(getBusinessDay('hours(-4)')).toBe(slaTime);
  })

  test('should return custom time when minutes is passed', () => {
    const slaTime = dayjs().add(-240, 'minutes').utc().format("YYYY-MM-DDTHH:mm:ssZ");
    expect(getBusinessDay('minutes(-240)')).toBe(slaTime);
  })
});
