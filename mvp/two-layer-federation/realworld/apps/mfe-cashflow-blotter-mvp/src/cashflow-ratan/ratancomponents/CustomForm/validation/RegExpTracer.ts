import { isEmpty } from "../../../ratanutils/utils";

const RegExpTracer = (subItem: any, rules: any[], ruleId: number) => {
  /**
   * Case1: rule has AllowEmpty then allow empty value
   * Case2: rule has AllowEmpty and has value then should follow regExp
   * Case3: rule has no AllowEmpty then field is required
   */

  const allowEmpty = rules.some((item: any) => item.name === "AllowEmpty");
  const pattern = subItem.value;
  const message = subItem.errorMsg;

  if (!allowEmpty) {
    return {
      pattern: subItem.value,
      message: subItem.errorMsg,
      ruleId,
    };
  } else {
    return {
      validator(_rule: any, value: any) {
        if (isEmpty(value)) {
          return Promise.resolve();
        } else {
          const reg = new RegExp(pattern);
          if (reg.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject(new Error(message));
        }
      },
    };
  }
};

export default RegExpTracer;
