/*
Validation current fields should ealier than rule fields
*/
const EalierOrOnTracer = (getFieldValue, subItem, convertValue) => {
  return {
    validator(_rule: any, value: any) {
      const date1 = new Date(value);
      let testRes = true;

      subItem.value.fields.forEach((subSubItem: any) => {
        const otherValue = convertValue(getFieldValue(subSubItem.field));
        const date2 = new Date(otherValue);
        if (date1 > date2) {
          testRes = false;
        }
      });

      if (testRes) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(subItem.errorMsg));
    },
  };
};
export default EalierOrOnTracer;
