export const NEED_TO_SET_ALL_FIELDS = [
  "Forward_Future_Instrument",
  "Cash_Financial_Instrument",
  "Option_Instrument",
  "Cashflows_Instrument",
  "Swap_Instrument",
];

export const conversionOneField = (
  results: MapType,
  field: string,
  isAllFields: boolean,
  instrumentConfig?: any
) => {
  const keyArray = field.split(".");
  if (isAllFields && NEED_TO_SET_ALL_FIELDS.includes(keyArray[0])) {
    if (
      !instrumentConfig ||
      (instrumentConfig && instrumentConfig[keyArray[0]])
    ) {
      results[keyArray[0]] = {
        ALL_FIELDS: "",
      };
    }
  } else if (keyArray.length === 1) {
    results[keyArray[0]] = "";
  } else {
    let uValue = results;
    keyArray.forEach((item: any, index: number) => {
      if (index === keyArray.length - 1) {
        uValue[item] = "";
      } else {
        if (!uValue[item]) {
          uValue[item] = {};
        }
        uValue = uValue[item];
      }
    });
  }
};
