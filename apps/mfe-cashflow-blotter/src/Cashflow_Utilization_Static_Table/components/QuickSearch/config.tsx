export const autoUtilOptions = [
  {
    label: "YES",
    value: "YES",
  },
  {
    label: "NO",
    value: "NO",
  },
];

export const dataStatusOptions = [
  {
    label: "ADD_PENDING",
    value: "ADD_PENDING",
  },
  {
    label: "UPDATE_PENDING",
    value: "UPDATE_PENDING",
  },
  {
    label: "DELETE_PENDING",
    value: "DELETE_PENDING",
  },
  {
    label: "SAVE_CONFIRMED",
    value: "SAVE_CONFIRMED",
  },
];

const UtilizationQuickSearchConfig = {
  quickSearchLabelWidth: 175,
  quickSearchFormWidth: 240,
  quickSearchItems: [
    {
      label: "CounterParty FMID",
      field: "counterpartyFmId",
      component: "QuickSearchInput",
    },
    {
      label: "CounterParty FMCode",
      field: "counterpartyFmCode",
      component: "QuickSearchInput",
    },
    {
      label: "Entity FMID",
      field: "entityFmId",
      component: "QuickSearchInput",
    },
    {
      label: "Entity FMCode",
      field: "entityFmCode",
      component: "QuickSearchInput",
    },
    {
      label: "Auto Util",
      field: "autoUtil",
      component: "QuickSearchSelect",
      valueList: autoUtilOptions,
    },
    {
      label: "Status",
      field: "dataStatus",
      component: "QuickSearchSelect",
      valueList: dataStatusOptions,
    },
  ],
};

export default UtilizationQuickSearchConfig;
