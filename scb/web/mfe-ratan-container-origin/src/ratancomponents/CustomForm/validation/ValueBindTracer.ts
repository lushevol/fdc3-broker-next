export const isRegExp = (text: string) => {
  return /^\/(.*?)\/([gimsuy]*)$/.test(text);
};

// string should match format of isRegExp.
export const string2RegExp = (regexp: string) => {
  const lastSlash = regexp.lastIndexOf("/");
  return new RegExp(regexp.slice(1, lastSlash), regexp.slice(lastSlash + 1));
};

const ValueBindTracer = (
  getFieldValue,
  subItem,
  convertValue,
  item,
  setAutoInputValues
) => {
  return {
    validator(_rule: any, value: any) {
      let testRes = true;

      subItem.value.fields.forEach((subSubItem: any) => {
        const otherValue = convertValue(getFieldValue(subSubItem.field));
        subSubItem.rules.forEach((subRule: any) => {
          if (subRule.name === "RegExp") {
            if (!new RegExp(subRule.value).test(otherValue)) {
              testRes = false;
            }
          }
        });
      });

      if (testRes) {
        if (isRegExp(subItem.value.bindValue)) {
          if (string2RegExp(subItem.value.bindValue).test(value)) {
            return Promise.resolve();
          } else {
            return Promise.reject(new Error(subItem.errorMsg));
          }
        } else {
          setAutoInputValues((values) => {
            const newValue = { [item.field]: subItem.value.bindValue };
            return { ...values, ...newValue };
          });
        }
      }

      return Promise.resolve();
    },
  };
};
export default ValueBindTracer;
