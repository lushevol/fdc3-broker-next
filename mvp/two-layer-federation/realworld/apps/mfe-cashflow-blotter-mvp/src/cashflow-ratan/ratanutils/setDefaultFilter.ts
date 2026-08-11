export function dynamicDefaultFilter(data: Filter[]) {
  const config: MapType = ratanConfig?.trades?.productSource;
  const configKeys = config ? Object.keys(config) : [];
  const newFilters: Filter[] = [];
  const productData: MapType = {};
  const maybeArr: any[] = [];
  let newDefaultFilter = "";
  let arr: any[] = [];

  data.forEach((item) => {
    if (
      ["EQ", "IN"].includes(item.operator) &&
      item.field !== "Data_Flow.Data_Source_System" &&
      configKeys.some((product) =>
        Object.keys(config[product]).includes(item.field)
      )
    ) {
      productData[item.field] = item.values;
    } else if (item.field === "PRODUCT_TYPE") {
      const newFilter: MapType = {};
      item.values.forEach((searchValue: string) => {
        const [product, field, value] = searchValue.split("-");
        if (!newFilter[product]) {
          newFilter[product] = {};
        }
        if (!newFilter[product][field]) {
          newFilter[product][field] = [];
        }

        if (value) {
          newFilter[product][field].push(value);
        } else {
          newFilter[product][field] = config[product][field];
        }
      });

      Object.keys(newFilter).forEach((product) => {
        Object.keys(newFilter[product]).forEach((field) => {
          maybeArr.push({
            product,
            filter: [
              {
                field,
                value: newFilter[product][field],
              },
            ],
          });
        });
      });
    } else {
      if (item.field == "Murex_Trade_Id") {
        item.field = "Trade_Id";
        item.label = "Murex_Trade_Id";
      }
      newFilters.push(item);
    }
  });

  configKeys.forEach((product) => {
    const productConfig = config[product];
    const filter: any = [];
    Object.keys(productConfig).forEach((field) => {
      if (Array.isArray(productData[field])) {
        const inValue = productData[field].filter((value: string) =>
          productConfig[field].includes(value)
        );
        if (inValue.length === productConfig[field].length) {
          if (inValue.length > 1) {
            filter.push({
              field: field,
              value: inValue,
            });
          } else if (inValue.length === 1) {
            filter.push({
              field: field,
              value: inValue[0],
            });
          }
          delete productData[field];
        }
      } else if (productConfig[field].includes(productData[field])) {
        filter.push({
          field: field,
          value: productData[field],
        });
        delete productData[field];
      }
    });
    if (filter.length === Object.keys(productConfig).length) {
      arr = [...arr, filter];
    } else if (filter.length > 0) {
      maybeArr.push({
        product,
        filter,
      });
    }
  });

  Object.keys(productData).forEach((field) => {
    const filter = data.find((item) => item.field === field);
    filter && newFilters.push(filter);
  });

  if (arr.length) {
    let defaultFilter = "";
    arr.forEach((subArr) => {
      let str = "";
      subArr.forEach((filter: any) => {
        if (str) {
          str += ` and `;
        }
        str += `\\"${filter.field}\\" `;
        if (Array.isArray(filter.value)) {
          str += `IN ('${filter.value.join("', '")}')`;
        } else {
          str += `= '${filter.value}'`;
        }
      });
      if (defaultFilter) {
        defaultFilter += " or ";
      }
      defaultFilter += str;
    });
    if (arr.length > 1) {
      defaultFilter = `(${defaultFilter.replace(/[ ]or[ ]/g, ") or (")})`;
    }
    newDefaultFilter = defaultFilter;
  } else if (maybeArr.length) {
    let defaultFilter = "";
    maybeArr.forEach((item) => {
      let str = "";
      const thisFitler = item.filter;
      const readyFields = item.filter.map((item: any) => item.field);
      const missFields = Object.keys(config[item.product]).filter(
        (field) => !readyFields.includes(field)
      );
      missFields.forEach((field: string) => {
        thisFitler.push({
          field,
          value: config[item.product][field],
        });
      });
      thisFitler.forEach((filter: any) => {
        if (str) {
          str += ` and `;
        }
        str += `\\"${filter.field}\\" `;
        if (Array.isArray(filter.value)) {
          str += `IN ('${filter.value.join("', '")}')`;
        } else {
          str += `= '${filter.value}'`;
        }
      });
      if (defaultFilter) {
        defaultFilter += " or ";
      }
      defaultFilter += str;
    });
    if (maybeArr.length > 1) {
      defaultFilter = `(${defaultFilter.replace(/[ ]or[ ]/g, ") or (")})`;
    }
    const finalDefalutFilter = replaceDefaultFilter(newFilters, defaultFilter);
    newDefaultFilter = finalDefalutFilter;
  } else if (ratanConfig?.trades?.defaultFilter) {
    const finalDefalutFilter = replaceDefaultFilter(
      newFilters,
      ratanConfig.trades.defaultFilter
    );
    newDefaultFilter = `(${finalDefalutFilter})`;
  } else {
    let defaultFilter = "";

    configKeys.forEach((product: string) => {
      const productConfig = config[product];
      let str = "";
      Object.keys(productConfig).forEach((field: string) => {
        if (str) {
          str += ` and `;
        }
        str += `\\"${field}\\" `;
        if (productConfig[field].length > 1) {
          str += `IN ('${productConfig[field].join("', '")}')`;
        } else {
          str += `= '${productConfig[field]}'`;
        }
      });
      if (defaultFilter) {
        defaultFilter += " or ";
      }
      defaultFilter += str;
    });

    newDefaultFilter = `(${defaultFilter.replace(/[ ]or[ ]/g, ") or (")})`;
  }

  return {
    newFilters,
    defaultFilter: `defaultFilter: "${newDefaultFilter}"`,
    onlyDefaultFilter: newDefaultFilter,
  };
}

export const operators: MapType = {
  EQ: "=",
  NE: "<>",
  LTE: "<",
  GTE: ">",
  BET: (filter: Filter) =>
    `(\\"${filter.field}\\" >= '${filter.values[0]}' and \\"${filter.field}\\" <= '${filter.values[1]}')`,
  ONORBEFORE: "<=",
  ONORLATER: ">=",
  IN: (filter: Filter) =>
    `\\"${filter.field}\\" IN ('${filter.values.join("', '")}')`,
  NOTIN: (filter: Filter) =>
    `\\"${filter.field}\\" NOT IN ('${filter.values.join("', '")}')`,
  LIKE: "LIKE",
};

export function defaultFilter() {
  if (ratanConfig?.trades?.defaultFilter) {
    return ratanConfig.trades.defaultFilter;
  }
  const config = ratanConfig?.trades?.productSource || {};
  let defaultFilter = "";
  Object.keys(config).forEach((product: string) => {
    const productConfig = config[product];
    let str = "";
    Object.keys(productConfig).forEach((field: string) => {
      if (str) {
        str += ` and `;
      }
      str += `\\"${field}\\" `;
      if (productConfig[field].length > 1) {
        str += `IN ('${productConfig[field].join("', '")}')`;
      } else {
        str += `= '${productConfig[field]}'`;
      }
    });
    if (defaultFilter) {
      defaultFilter += " or ";
    }
    defaultFilter += str;
  });

  return `(${defaultFilter.replace(/[ ]or[ ]/g, ") or (")})`;
}

export function judgeProduct(filter: Filter) {
  const obj: MapType = {};
  filter.values.forEach((item: string) => {
    const [product, field, value] = item.split("-");
    const productFilter = ratanConfig?.trades?.productSource[product];
    if (value) {
      if (!obj[product]) {
        obj[product] = {};
      }
      if (!obj[product][field]) {
        obj[product][field] = [];
      }
      obj[product][field].push(value);
    }
    obj[product] = { ...productFilter, ...obj[product] };
  });

  let allText = "";

  Object.keys(obj).forEach((product) => {
    const productFilter = obj[product];
    let filterText = "";
    Object.keys(productFilter).forEach((field) => {
      if (filterText) {
        filterText += " and ";
      }
      filterText += `\\"${field}\\" IN ('${productFilter[field].join(
        "', '"
      )}')`;
    });

    if (allText) {
      allText += ") or (";
    }
    allText += filterText;
  });

  if (Object.keys(obj).length > 1) {
    return `((${allText}))`;
  }
  return `(${allText})`;
}

export const convertSettlemntDate = (filter: Filter) => {
  return `(\\"Settlement_Date\\" >= '${filter.values[0]}' and \\"Settlement_Date\\" <= '${filter.values[1]}' or \\"Swap_Instrument.Forward_Future_Instrument.Near_Leg.Settlement_Date\\" >= '${filter.values[0]}' and \\"Swap_Instrument.Forward_Future_Instrument.Near_Leg.Settlement_Date\\" <= '${filter.values[1]}')`;
};

export function setSearchFilter(
  filters: Filter[],
  defaultFilterString?: string,
  isCashflow?: boolean
) {
  const customFilterFields = ratanConfig.trades.customSearchFilter.map(
    (item: any) => item.field
  );
  const newFilter = filters.filter(
    (item) => !customFilterFields.includes(item.field)
  );
  let text = "";

  if (newFilter.length !== filters.length) {
    const customFilter = filters.filter((item) =>
      customFilterFields.includes(item.field)
    );
    customFilter.forEach((item) => {
      if (text) {
        text += ` and `;
      }
      text += `(${ratanConfig.trades.customSearchFilter
        .find((subItem: any) => item.field === subItem.field)
        .filterText.replace(/{value}/g, item.values)})`;
    });
  }

  let filterText = "";
  newFilter.forEach((filter) => {
    if (filterText || text) {
      filterText += ` and `;
    }

    const customConditionFilter = {
      PRODUCT_TYPE: () => judgeProduct(filter),
      SETTLEMENT_DATE: () => convertSettlemntDate(filter),
    };

    const conditionMethod = customConditionFilter[filter.field];

    if (conditionMethod) {
      filterText += conditionMethod();
    } else {
      if (typeof operators[filter.operator] === "function") {
        filterText += operators[filter.operator](filter);
      } else {
        filterText += `\\"${filter.field}\\" ${operators[filter.operator]} '${
          filter.values
        }'`;
      }
    }
  });

  if (text) {
    return `searchFilter: "${text}${filterText}"`;
  }

  if (isCashflow) {
    return `searchFilter: "${filterText}"`;
  }

  text = filterText
    ? `${filterText} and (${defaultFilterString || defaultFilter()})`
    : defaultFilterString || defaultFilter();

  return `searchFilter: "${text}"`;
}

export const handleMultiFieldsQuery = (data: Filter[]) => {
  const newFilters: Filter[] = [];

  data.forEach((item) => {
    if (item.field === "PRODUCT_TAXONOMY") {
      if (item.values instanceof Array) {
        const res = new Map<string, string[]>();
        item.values.forEach((value) => {
          const [field, ...valueArr] = value.split("/_/");
          res.set(field, (res.get(field) || []).concat(valueArr));
        });
        res.forEach((v, k) => {
          newFilters.push({
            field: k,
            operator: "IN",
            values: v,
          });
        });
      } else {
        const [field, ...valueArr] = item.values.split("/_/");
        const operator = valueArr.length > 1 ? "IN" : "EQ";
        const values = operator === "EQ" ? valueArr[0] : valueArr;
        newFilters.push({
          field,
          operator,
          values,
        });
      }
    } else {
      newFilters.push(item);
    }
  });

  return newFilters;
};

export function replaceDefaultFilter(
  newFilter: Filter[],
  defaultFilterStr: string
) {
  const data_source_system = newFilter.find((item) => {
    return item.field == "Data_Flow.Data_Source_System";
  });
  const murex_trade_id = newFilter.find((item) => {
    return item.label == "Murex_Trade_Id";
  });

  if (data_source_system) {
    let data_source_system_value = "";
    if (data_source_system.operator === "EQ") {
      data_source_system_value = `'${data_source_system.values}'`;
    } else if (data_source_system.operator === "IN") {
      data_source_system_value = data_source_system.values
        .map((item) => `'${item}'`)
        .join(", ");
    }

    const newDftFilter = defaultFilterStr.replace(
      /\\"Data_Flow\.Data_Source_System\\"\sIN\s\(['A-Za-z0-9,\s]+\)/,
      `\\\"Data_Flow.Data_Source_System\\\" IN (${data_source_system_value})`
    );
    return newDftFilter;
  }
  if (murex_trade_id) {
    return defaultFilterStr.replace(
      /\\"Data_Flow\.Data_Source_System\\"\sIN\s\(['A-Za-z0-9,\s]+\)/,
      `\\\"Data_Flow.Data_Source_System\\\" IN ('Murex')`
    );
  }
  return defaultFilterStr;
}
