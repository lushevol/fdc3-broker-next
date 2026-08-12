export const OPERATORS: MapType = {
  freeText: {
    EQ: {
      label: "IS",
      name: "TextInput",
    },
    NE: {
      label: "IS NOT",
      name: "TextInput",
    },
    LIKE: {
      label: "LIKE",
      name: "TextInput",
    },
  },
  dropdown: {
    EQ: {
      label: "IS",
      name: "Dropdown",
    },
    NE: {
      label: "IS NOT",
      name: "Dropdown",
    },
  },
  datePicker: {
    BET: {
      label: "IN BETWEEN",
      name: "BetweenPicker",
    },
    ONORBEFORE: {
      label: "EARLIER OR ON",
      name: "OnlyPicker",
    },
    ONORLATER: {
      label: "LATER OR ON",
      name: "OnlyPicker",
    },
  },
  numberRange: {
    LTE: {
      label: "<=",
      name: "NumberInput",
    },
    GTE: {
      label: ">=",
      name: "NumberInput",
    },
  },
  multiSelect: {
    IN: {
      label: "IN",
      name: "MultiSelect",
    },
    NOTIN: {
      label: "NOT IN",
      name: "MultiSelect",
    },
  },
};

export const OPERATORS_CN: MapType = {
  freeText: {
    EQ: {
      label: "IS",
      name: "TextInput",
    },
    NE: {
      label: "IS NOT",
      name: "TextInput",
    },
    LIKE: {
      label: "LIKE",
      name: "TextInput",
    },
    IN: {
      label: "IN",
      name: "TextInput",
    },
  },
  dropdown: {
    EQ: {
      label: "IS",
      name: "Dropdown",
    },
    NE: {
      label: "IS NOT",
      name: "Dropdown",
    },
  },
  datePicker: {
    BET: {
      label: "IN BETWEEN",
      name: "BetweenPicker",
    },
    ONORBEFORE: {
      label: "EARLIER OR ON",
      name: "OnlyPicker",
    },
    ONORLATER: {
      label: "LATER OR ON",
      name: "OnlyPicker",
    },
  },
  numberRange: {
    LTE: {
      label: "<=",
      name: "NumberInput",
    },
    GTE: {
      label: ">=",
      name: "NumberInput",
    },
  },
  multiSelect: {
    IN: {
      label: "IN",
      name: "MultiSelect",
    },
    NOTIN: {
      label: "NOT IN",
      name: "MultiSelect",
    },
  },
  multiSelectDropdown: {
    EQ: {
      label: "IS",
      name: "Dropdown",
    },
    NE: {
      label: "IS NOT",
      name: "Dropdown",
    },
    IN: {
      label: "IN",
      name: "MultiSelect",
    },
    NOTIN: {
      label: "NOT IN",
      name: "MultiSelect",
    },
  },
};

export interface GetOperatorOptionsType {
  label: string;
  value: string;
}

export const getOperatorOptions = (
  name: string,
  isCashflowSettlementCN?: boolean
) => {
  const result: GetOperatorOptionsType[] = [];

  if (name) {
    for (const key in (isCashflowSettlementCN ? OPERATORS_CN : OPERATORS)[
      name
    ]) {
      result.push({
        label: (isCashflowSettlementCN ? OPERATORS_CN : OPERATORS)[name][key]
          .label,
        value: key,
      });
    }
  }

  return result;
};
