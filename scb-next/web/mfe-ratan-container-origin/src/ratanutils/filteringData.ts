export const convertDate = (date: any) => {
  if (typeof date === "string") {
    return new Date(date);
  }

  return date;
};

export const operating = (
  fieldValue: any,
  operator: string,
  filterValue: any
) => {
  let newFieldValue;
  switch (operator) {
    case "EQ":
      return fieldValue === filterValue;
    case "NE":
      return fieldValue !== filterValue;
    case "LIKE":
      return fieldValue.includes(filterValue);
    case "LTE":
      return fieldValue <= filterValue;
    case "GTE":
      return fieldValue >= filterValue;
    case "BET":
      newFieldValue = convertDate(fieldValue);
      return newFieldValue >= filterValue[0] && fieldValue <= filterValue[1];
    case "ONORBEFORE":
      newFieldValue = convertDate(fieldValue);
      return newFieldValue <= filterValue;
    case "ONORLATER":
      newFieldValue = convertDate(fieldValue);
      return newFieldValue >= filterValue;
    case "IN":
      return filterValue.includes(fieldValue);
    case "NOTIN":
      return !filterValue.includes(fieldValue);
    case "LIMIT":
      return true; // @Comment: Not used
  }
};

export const filtering = (data: any[], filters: any) => {
  if (filters.length) {
    const result: any[] = [];
    data.forEach((item) => {
      let isThis = true;
      for (const filter of filters) {
        if (!operating(item[filter.field], filter.operator, filter.values)) {
          isThis = false;
          break;
        }
      }
      isThis && result.push(item);
    });
    return result;
  } else {
    return data;
  }
};
