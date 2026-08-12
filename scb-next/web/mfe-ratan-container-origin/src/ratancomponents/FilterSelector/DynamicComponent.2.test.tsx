import { render } from '@testing-library/react';
import "../../ratanstatic";
import { BetweenPicker, Dropdown, MultiSelect, OnlyPicker, TextInput } from "./DynamicComponent";
import transaction_data from './transaction_data.json';
import Select, { Option } from "../../LazyAntd/Select";
import { message } from "antd";
import { queryFetchPortfolio } from "../../ratanutils/http/graphql";
import DatePicker from "../../LazyAntd/DatePicker";
import RangePicker from "../../LazyAntd/RangePicker";
import Input from "../../LazyAntd/Input";


afterAll(() => {
  vi.clearAllMocks();
});

let FILTER_FIELDS;
beforeAll(() => {
  FILTER_FIELDS = transaction_data.map((item) => {
    return { ...item };
  });
});

vi.mock('../../ratanutils/http/graphql', () => {
  const res1 = async () => Promise.resolve([]);
  return {
    queryFetchPortfolio: vi.fn(res1),
  };
});

vi.mock('../../LazyAntd/Select');
vi.mock('../../LazyAntd/DatePicker');
vi.mock('../../LazyAntd/RangePicker');
vi.mock('../../LazyAntd/Input');
vi.mock("lodash/debounce", () =>{
  const debounce = (fn) => {
    return fn
  }
  return {
    __esModule: true,
    default: debounce
  }
});

vi.mock('antd', async (importOriginal)=>{
  const actual = await importOriginal<typeof import('antd')>();
  return {
    ...actual,
    message: {
      info: vi.fn()
    }
  }
  
});

describe('<DynamicComponent />', () => {
  test('Dropdown comp search isDynamic:true', ()=> {
    (Select as vi.Mock).mockImplementation((props)=>{
      return <div>Mocked Select{props.children}
        <button type='button' data-testid='search-button' onClick={props.onSearch("test")}>Search</button>
      </div>;
    });
    (Option as vi.Mock).mockImplementation((props)=>{
      return <div data-testid='option'>Mocked Option<>{props.children}</></div>;
    });
    const filterValue = {field: ["test"], operator: "=", values: "1", name: "test"}
    const onChange= vi.fn();
    const fields = [
      {indexedTerm: "test", dynamicList: true, valueList: JSON.stringify(["1","2"])}
    ]
    const {getByTestId} = render(<Dropdown className='test' filterValue={filterValue} onChange={onChange} FILTER_FIELDS={fields}/>)
    getByTestId('search-button').click();
  })

  test('Dropdown comp search -isDynamic: true - queryFetchPortfolio',async ()=> {
    const promise1 = Promise.resolve({
      fetchPortfolio: ["test"]
    });
    (queryFetchPortfolio as vi.Mock).mockReturnValue(promise1);

    (Select as vi.Mock).mockImplementation((props)=>{
      return <div>Mocked Select{props.children}
        <button type='button' data-testid='search-button' onClick={props.onSearch("test")}>Search</button>
      </div>;
    });
    (Option as vi.Mock).mockImplementation((props)=>{
      return <div data-testid='option'>Mocked Option<>{props.children}</></div>;
    });
    const filterValue = {field: ["test"], operator: "=", values: "1", name: "test"}
    const onChange= vi.fn();
    const fields = [
      {indexedTerm: "test", dynamicList: true, valueList: JSON.stringify(["1","2"])}
    ]
    const {getByTestId} = render(<Dropdown className='test' filterValue={filterValue} onChange={onChange} FILTER_FIELDS={fields}/>)
    getByTestId('search-button').click();
    await promise1;
  })

  test('Dropdown comp search- isDynamic: true - queryFetchPortfolio.length = 0',async ()=> {
    const promise1 = Promise.resolve({
      fetchPortfolio: []
    });
    (queryFetchPortfolio as vi.Mock).mockReturnValue(promise1);

    const infoFN= vi.fn();
    //@ts-ignore
    vi.spyOn(message, 'info').mockImplementation((msg) => {infoFN(msg)});

    (Select as vi.Mock).mockImplementation((props)=>{
      return <div>Mocked Select{props.children}
        <button type='button' data-testid='search-button' onClick={props.onSearch("test")}>Search</button>
      </div>;
    });
    (Option as vi.Mock).mockImplementation((props)=>{
      return <div data-testid='option'>Mocked Option<>{props.children}</></div>;
    });
    const filterValue = {field: ["test"], operator: "=", values: "1", name: "test"}
    const onChange= vi.fn();
    const fields = [
      {indexedTerm: "test", dynamicList: true, valueList: JSON.stringify(["1","2"])}
    ]
    const {getByTestId} = render(<Dropdown className='test' filterValue={filterValue} onChange={onChange} FILTER_FIELDS={fields}/>)
    getByTestId('search-button').click();
    await promise1;

    expect(infoFN).toBeCalledWith("No data found")
  })


  test('Dropdown comp search - isDynamic: true - search single word', ()=> {
    const infoFN= vi.fn();
    //@ts-ignore
    vi.spyOn(message, 'info').mockImplementation((msg) => {infoFN(msg)});
    (Select as vi.Mock).mockImplementation((props)=>{
      return <div>Mocked Select{props.children}
        <button type='button' data-testid='search-button' onClick={props.onSearch("T")}>Search</button>
      </div>;
    });
    (Option as vi.Mock).mockImplementation((props)=>{
      return <div data-testid='option'>Mocked Option<>{props.children}</></div>;
    });
    const filterValue = {field: ["test"], operator: "=", values: "1", name: "test"}
    const onChange= vi.fn();
    const fields = [
      {indexedTerm: "test", dynamicList: true, valueList: JSON.stringify(["1","2"])}
    ]
    const {getByTestId} = render(<Dropdown className='test' filterValue={filterValue} onChange={onChange} FILTER_FIELDS={fields}/>)
    getByTestId('search-button').click();

    expect(infoFN).toBeCalled()
  })

  test('Dropdown comp search - isDynamic: false - fieldOption', ()=> {
    (Select as vi.Mock).mockImplementation((props)=>{
      return <div>Mocked Select{props.children}
        <button type='button' data-testid='search-button'>Search</button>
      </div>;
    });
    (Option as vi.Mock).mockImplementation((props)=>{
      return <div data-testid='option'><span>{props.children}</span></div>;
    });
    const filterValue = {field: ["test"], operator: "=", values: "1", name: "test"}
    const onChange= vi.fn();
    const fields = [
      {indexedTerm: "test", dynamicList: false, valueList: JSON.stringify(["true","false", "test"])}
    ]
    const {getByText, debug} = render(<Dropdown className='test' filterValue={filterValue} onChange={onChange} FILTER_FIELDS={fields}/>)
    expect(getByText("Yes")).toBeDefined();
    expect(getByText("No")).toBeDefined();
    expect(getByText("test")).toBeDefined();
  });

  test('OnlyPicker, RangePicker - onChange', ()=> {
    (DatePicker as vi.Mock).mockImplementation((props)=>{
      return <div>Mocked DatePicker
        <button type='button' data-testid='change-button' onClick={() => {props.onChange("test1", "test2")}}>Change</button>
      </div>;
    });
    const filterValue = {field: ["test"], operator: "=", values: "1", name: "test"}
    const onChange= vi.fn();
    
    const {getByTestId} = render(<OnlyPicker className='test' filterValue={filterValue} onChange={onChange} FILTER_FIELDS={[]}/>)
    getByTestId('change-button').click();
    expect(onChange).toBeCalledWith("test2");

    (RangePicker as vi.Mock).mockImplementation((props)=>{
      return <div>Mocked RangePicker
        <button type='button' data-testid='change-button2' onClick={() => {props.onChange("test1", ["test2","test3"])}}>Change</button>
      </div>;
    });
    
    const onChange2= vi.fn();
    const {getByTestId: getByTestId2} = render(<BetweenPicker className='test' filterValue={filterValue} onChange={onChange2} FILTER_FIELDS={[]}/>)
    getByTestId2('change-button2').click();
    expect(onChange2).toBeCalledWith(["test2","test3"]);

  })

  test('DatePicker RangePicker - value is Array', ()=> {
    (DatePicker as vi.Mock).mockImplementation((props)=>{
      return <div>Mocked DatePicker
        <button type='button' data-testid='change-button' onClick={() => {props.onChange("test1", "test2")}}>Change</button>
      </div>;
    });
    const filterValue = {field: ["test"], operator: "=", values: ["1"], name: "test"}
    const onChange= vi.fn();
    
    const {getByTestId} = render(<OnlyPicker className='test' filterValue={filterValue} onChange={onChange} FILTER_FIELDS={[]}/>)
    getByTestId('change-button').click();
    expect(onChange).toBeCalledWith("test2");

    (RangePicker as vi.Mock).mockImplementation((props)=>{
      return <div>Mocked RangePicker
        <button type='button' data-testid='change-button2' onClick={() => {props.onChange("test1", [null])}}>Change</button>
      </div>;
    });
    
    const onChange2= vi.fn();
    const {getByTestId: getByTestId2} = render(<BetweenPicker className='test' filterValue={filterValue} onChange={onChange2} FILTER_FIELDS={[]}/>)
    getByTestId2('change-button2').click();
    expect(onChange2).toBeCalledWith(null);

  })

  test('TextInput - onChange', ()=> {
    (Input as vi.Mock).mockImplementation((props)=>{
      return <div>Mocked Input
        <span data-testid="value">{props.value}</span>
        <button type='button' data-testid='change-button' onClick={() => {props.onChange({target: {value: "test"}})}}>Change</button>
      </div>;
    });
    const filterValue = {field: ["test"], operator: "=", values: "1", name: "test"}
    const onChange= vi.fn();
    
    const {getByTestId, debug} = render(<TextInput className='test' filterValue={filterValue} onChange={onChange} FILTER_FIELDS={[]}/>)
    getByTestId('change-button').click();
  })

  test('MultiSelect- branch: myfield is none', () => {
    (Select as vi.Mock).mockImplementation((props)=>{
      return <div>Mocked Select{props.children}
        <button type='button' data-testid='search-button'>Search</button>
      </div>;
    });
    (Option as vi.Mock).mockImplementation((props)=>{
      return <div data-testid='option'>Mocked Option<>{props.children}</></div>;
    });

    const filterValue = {field: ["test1"], operator: "=", values: null, name: "test"}
    const onChange= vi.fn();
    const fields = [
      {indexedTerm: "test", dynamicList: true, valueList: JSON.stringify(["1","2"])}
    ]
    const {getByText} = render(<MultiSelect className='test' filterValue={filterValue} onChange={onChange} FILTER_FIELDS={fields}/>)

    expect(getByText("Mocked Select")).toBeDefined();

  })
});
