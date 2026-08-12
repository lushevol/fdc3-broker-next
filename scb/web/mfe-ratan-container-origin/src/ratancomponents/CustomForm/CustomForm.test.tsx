import { render } from "@testing-library/react"
import CustomForm from "./CustomForm"

it("render custom form", () => {
  const formConfig = [
    {
      component: "QuickSearchManyInOne",
      manyInOne: [
        {
          label: "Trade ID",
          field: "Trade_Id",
          component: "QuickSearchInput",
          placeholder: "Multiple searches separated by commas",
          suffix: "Multiple searches separated by commas",
          commas: true,
        },
        {
          label: "Package ID",
          field: "Package_Id",
          component: "QuickSearchInput",
        }
      ]
    },
    {
      component: "QuickSearchManyInOne",
      manyInOne: [
        {
          label: "Trader",
          field: "Entity.Person.Trader_PSID",
          component: "QuickSearchInput",
        },
        {
          label: "Source System",
          field: "Data_Flow.Data_Source_System",
          component: "QuickSearchSelect",
          selectMode: "multiple",
          valueList: [
            {
              label: "Blade",
              value: "Blade",
            },
            {
              label: "S2BX",
              value: "S2BX",
            },
            {
              label: "CFETS",
              value: "CFETS",
            },
            {
              label: "Murex",
              value: "Murex",
            },
            {
              label: "BTS",
              value: "BTS",
            },
            {
              label: "Razor FXCASH",
              value: "MX_FXCASH",
            },
            {
              label: "Razor ALMDRV",
              value: "MX_ALMDRV",
            },
          ],
        },
      ]
    }
  ];

  render(<CustomForm formConfig={formConfig} />)
})