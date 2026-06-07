const conversionObj = (item) => {
  let itemResult = {};
  for (const key in item) {
    const value = item[key];
    if (value && typeof value === "object") {
      itemResult = { ...itemResult, ...conversionJson(value) };
    } else {
      itemResult[key] = value;
    }
  }
  return itemResult;
}

const conversionJson = (Json) => {
  if (Array.isArray(Json)) {
    let result = null;
    Json.forEach((item) => {
      if (Object.prototype.toString.call(item) === "[object Object]") {
        result = { ...(result || {}), ...conversionObj(item) };
      } else if (Array.isArray(item)) {
        result = [...(result || []),...[conversionJson(item)]];
      }
    });
    return result;
  } else if (Object.prototype.toString.call(Json) === "[object Object]") {
    return conversionObj(Json);
  }
  return Json;
};

const json = [
  {
    Trade_Id: '1',
    Trade_Version: '2',
    fieldA: 'a',
    fieldB: {
      fieldC: 'c',
      fieldD: {
        fieldE: ['e', 'f'],
      },
    },
    Versions: [
      {
        Trade_Id: '1',
        Trade_Version: '1',
      },
      {
        Trade_Id: '1',
        Trade_Version: '0',
      },
    ],
  },
  {
    Trade_Id: '2',
    fieldA: 'a',
    fieldB: {
      fieldC: 'c',
      fieldD: {
        fieldE: 'e',
      },
      fieldF: [
        {
          fieldG: 'g',
        },
      ],
    },
  },
];
const json2 = [json];
console.log(conversionJson(json));
console.log(conversionJson(json2));