import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import "../../ratanstatic";
import { DynamicComponent } from "./DynamicComponent";
import transaction_data from './transaction_data.json';
// import { tradesCustomFields } from "../../ratanutils/config/ratantrades/fieldsConfig";

afterAll(() => {
  vi.clearAllMocks();
});

let FILTER_FIELDS;
beforeAll(() => {
  FILTER_FIELDS = transaction_data.map((item) => {
    // const customFields = Object.keys({ ...tradesCustomFields });
    // if (customFields.indexOf(item.indexedTerm) > -1) {
    //   const key = customFields[customFields.indexOf(item.indexedTerm)];
    //   return { ...item, ...(tradesCustomFields[key]) };
    // }
    return { ...item };
  });
});

vi.mock('../../ratanutils/http/graphql', () => {
  const res1 = async () => Promise.resolve([]);
  return {
    queryFetchPortfolio: res1,
  };
});


const className = '';
const waitForTime = (time = 200) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time)
});
describe('<DynamicComponent />', () => {
  test('should be show TextInput component', async () => {
    const onChange = vi.fn();
    const filterValue = { "field": ["Trade_Id"], "operator": "EQ", "values": "test", "name": "TextInput" };
    render(
      <DynamicComponent
        onChange={onChange}
        filterValue={filterValue}
        className={className}
        FILTER_FIELDS={FILTER_FIELDS}
      />
    );

    const textInput = await screen.findByTestId('textInputTrade_Id');
    fireEvent.blur(textInput);
    expect(onChange).toBeCalledWith('test');
  });

  test('should be show NumberInput component', async () => {
    const onChange = vi.fn();
    const filterValue = { "field": ["Trade_Version"], "operator": "EQ", "values": 888, "name": "NumberInput" };
    render(
      <DynamicComponent
        onChange={onChange}
        filterValue={filterValue}
        className={className}
        FILTER_FIELDS={FILTER_FIELDS}
      />
    );
    await waitForTime();
    const numberInput = await screen.findByTestId('numberInputTrade_Version');
    userEvent.type(numberInput, '999');
    fireEvent.blur(numberInput);
    await waitFor(() => expect(onChange).toBeCalledWith('888999'));
  });

  test('should be show BetweenPicker component', async () => {
    const onChange = vi.fn();
    const filterValue = { "field": ["Action_Type"], "operator": "BET", "values": ['2020-03-01', '2020-03-03'], "name": "BetweenPicker" };
    render(
      <DynamicComponent
        onChange={onChange}
        filterValue={filterValue}
        className={className}
        FILTER_FIELDS={FILTER_FIELDS}
      />
    );
    await waitForTime(300);
    const betweenPicker = screen.getByPlaceholderText('Start date');
    expect(betweenPicker).toBeInTheDocument();
  });

  test('should be show OnlyPicker component', async () => {
    const onChange = vi.fn();
    const filterValue = { "field": ["Action_Type"], "operator": "BET", "values": '2020-03-01', "name": "OnlyPicker" };
    render(
      <DynamicComponent
        onChange={onChange}
        filterValue={filterValue}
        className={className}
        FILTER_FIELDS={FILTER_FIELDS}
      />
    );
    await waitForTime();
    const onlyPicker = screen.getByPlaceholderText('Select date');
    expect(onlyPicker).toBeInTheDocument();
  });

  test('should be show Dropdown component', async () => {
    const onChange = vi.fn();
    const filterValue = { 
      field: ['Trade_Event', 'Business_Event_Type'], 
      "operator": "BET", 
      "values": [
      'Amendment',
      'Close',
      'Drawdown',
      'Expiry',
      'OptionEvent_KnockIn',
      'OptionEvent_KnockOut',
      'OptionExercise',
      'OptionExpiry',
      'RateFixing',
      'Recall',
      'Termination',
      'Trade',
      'Withdrawal',
    ], "name": "Dropdown" };
    render(
      <DynamicComponent
        onChange={onChange}
        filterValue={filterValue}
        className={className}
        FILTER_FIELDS={FILTER_FIELDS}
      />
    );
    await waitForTime();
    const dropdown = screen.queryAllByText('Amendment')[0];
    expect(dropdown).toBeInTheDocument();
  });

  test('should be show MultiSelect component', async () => {
    const onChange = vi.fn();
    const filterValue = { 
      field: ['Forward_Future_Instrument', 'Notional_Amount_Currency'],
      "operator": "BET", 
      "values": ['AUD', 'BDT'], "name": "MultiSelect" };
    render(
      <DynamicComponent
        onChange={onChange}
        filterValue={filterValue}
        className={className}
        FILTER_FIELDS={FILTER_FIELDS}
      />
    );
    await waitForTime();
    const dropdown = screen.getByText('+ 1 ...');
    expect(dropdown).toBeInTheDocument();
  });

  test('should be show search select component', async () => {
    const onChange = vi.fn();
    const filterValue = { 
      field:['Entity.Booking_Entity_SCI_FMID'],
      "operator": "BET", 
      "values": null, "name": "Dropdown" };
    render(
      <DynamicComponent
        onChange={onChange}
        filterValue={filterValue}
        className={className}
        FILTER_FIELDS={FILTER_FIELDS}
      />
    );
    await waitForTime();
    userEvent.type(screen.getByRole('combobox'), 'S2');
  });
});
