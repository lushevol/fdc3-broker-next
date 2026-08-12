import { render, screen } from '@testing-library/react';
import HistoryDetailsDialog from './index';
import { deepClone } from '../../ratanutils/utils';

jest.mock("../../ratancomponents/DataGrid", () => {
  return {
    DataGrid: ({ columnDefs, gridOptions, rowData}) => {
      return rowData?.map(item => {
        return columnDefs.map(config => {
          if (config.valueGetter) {
            return <span>{config.valueGetter({data:item})}</span>
          }
          return <span>{item[config.field]}</span>
        })
      })
    }, 
    classes: {
      baseGrid: "xxx"
    }
  }
})

jest.mock("../../ratanutils/http/graphql", () => {
  return {
    queryTradeAuditTrail: jest.fn(() => Promise.resolve({
      tradeAuditTrail:{
        "Trade_Id": "4339440496",
        "Version": "1",
        "Action_Date_Time": "2023-07-26T18:14:26Z",
        "Action_Type": "Trade",
        "User_PSID": null,
        "Source_System": "Blade",
        "Source_System_Physical_Status": "live",
        "Source_System_Validation_Status": "CHCK",
        "Trade_Status_Change": null,
        "Value_Change": null
      }
    }))
  }
})

const rowDetails ={Trade_Id: "xxx"};
const historyFields = [
  {
    headerName: 'Trade ID',
    field: 'Trade_Id',
  },
  {
    headerName: 'Version',
    field: 'Version',
  },
  {
    headerName: 'Action_Date_Time',
    field: 'Action_Date_Time',
  },
  {
    headerName: 'Business_Event_Type',
    field: 'Action_Type',
  },
  {
    headerName: 'Source_System',
    field: 'Source_System',
  },
];

test('should render history dialog', async () => {
  render(<HistoryDetailsDialog details={deepClone(rowDetails)} gridFields={historyFields} historyPageName="Trade" />);
  const element = await screen.findByText('Restore');
  expect(element).toBeInTheDocument();
});
