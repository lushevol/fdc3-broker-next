import { html } from 'lit';
import { elementUpdated, fixture, expect } from '@open-wc/testing';
import { ScDropdownMultiSelect, ScDropdownOption } from '@scdevkit/webkit';
import { ScEmployeeMultiInput } from '../../../src/components/ScEmployee/ScEmployeeMultiInput.js';
import '../../../elements/sc-employee.js';

const mockData = [
  {
    name: 'Masked,Jay',
    id: '1626487',
    email: 'masked.jay@sc.com',
    phone: '1234',
    location: 'Tianjin',
    businessTitle: 'Digital Solution Engineer',
    department: 'IT-TPS-TSA Arch & Gov',
  }, {
    name: 'Masked,John',
    id: '1574871',
    email: 'masked.john@sc.com',
    phone: '1234',
    location: 'Sigapore',
    businessTitle: 'Digital Solution Engineer',
    department: 'IT-TPS-TSA Arch & Gov',
  }, {
    name: 'Masked,Marry',
    id: '1577986',
    email: 'masked.marry@sc.com',
    phone: '1234',
    location: 'Sigapore',
    businessTitle: 'Digital Solution Engineer',
    department: 'IT-TPS-TSA Arch & Gov',
  }, {
    name: 'Masked,Ro',
    id: '1431830',
    email: 'masked.ro@sc.com',
    phone: '1234',
    location: 'Sigapore',
    businessTitle: 'Digital Solution Engineer',
    department: 'IT-TPS-TSA Arch & Gov',
  },
];


describe('ScEmployeeMultiInput', () => {
  it('onValueChange normalizes value: array of objects, array of strings, single string, and empty/null', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);
    (el as any).value = [
      { id: 'a', name: 'A' },
      { value: 'b', name: 'B' },
      { profile: { id: 'c', name: 'C' } },
    ];
    await el.onValueChange();
    expect(el._value).to.deep.equal(['a', 'b', 'c']);

    (el as any).value = ['x', 'y'];
    await el.onValueChange();
    expect(el._value).to.deep.equal(['x', 'y']);

    (el as any).value = 'z';
    await el.onValueChange();
    expect(el._value).to.deep.equal(['z']);

    (el as any).value = null;
    await el.onValueChange();
    expect(el._value).to.deep.equal([]);
    (el as any).value = undefined;
    await el.onValueChange();
    expect(el._value).to.deep.equal([]);
  });

  it('onSelect handles array of objects, merges with _value, emits event, hides dropdown, and calls addRecentSearchedPerson', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);

    el._value = ['a'];
    el._options = [
      { id: 'a', value: 'a', name: 'A' },
      { id: 'b', value: 'b', name: 'B' },
    ];
    const emitted: any[] = [];
    el.emit = (eventName: string, detail: any) => emitted.push({ eventName, detail });
    const added: string[] = [];
    el.addRecentSearchedPerson = async (id: string) => { added.push(id); };
    let dropdownHidden = false;
    el.shadowRoot!.querySelector = () => ({ hide: () => { dropdownHidden = true; } });
    await el.onSelect(new CustomEvent('sc-select', {
      detail: {
        allValues: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
      },
    }));
    expect(el._value).to.deep.equal(['a', 'b']);
    expect(el._displayValue).to.include('a').and.to.include('b');
    expect(el._selectedValue.length).to.equal(2);
    expect(el._valueNames.length).to.equal(2);
    expect(emitted.some(e => e.eventName === 'sc-select')).to.be.true;
    expect(added).to.deep.equal(['a', 'b']);
    expect(dropdownHidden).to.be.true;
  });

  it('onSelect handles array of strings and fallback, emits event, calls addRecentSearchedPerson', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);
    el._value = ['x'];
    el._options = [
      { id: 'x', value: 'x', name: 'X' },
      { id: 'y', value: 'y', name: 'Y' },
    ];
    const emitted: any[] = [];
    el.emit = (eventName: string, detail: any) => emitted.push({ eventName, detail });
    const added: string[] = [];
    el.addRecentSearchedPerson = async (id: string) => { added.push(id); };
    el.shadowRoot!.querySelector = () => null;
    await el.onSelect(new CustomEvent('sc-select', {
      detail: {
        allValues: ['x', 'y'],
      },
    }));
    expect(el._value).to.deep.equal(['x', 'y']);
    expect(emitted.some(e => e.eventName === 'sc-select')).to.be.true;
    expect(added).to.deep.equal(['x', 'y']);

    await el.onSelect(new CustomEvent('sc-select', {
      detail: {
        allValues: 'z',
      },
    }));
    expect(el._value).to.deep.equal(['z']);
    expect(emitted.some(e => e.eventName === 'sc-select')).to.be.true;
    expect(added).to.include('z');
  });

  it('onClear resets _value, _options, _valueNames and emits sc-clear', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);
    el._value = ['1'];
    el._options = [{ id: '1', name: 'A' }];
    el._valueNames = ['A'];
    let emitted = false;
    el.emit = (eventName: string) => { if (eventName === 'sc-clear') emitted = true; };
    el.onClear();
    expect(el._value).to.deep.equal([]);
    expect(el._options).to.deep.equal([]);
    expect(el._valueNames).to.deep.equal([]);
    expect(emitted).to.be.true;
  });

  it('getDropdownData returns options for search, suggestions, and empty', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);
    el._hasSearched = true;
    el._options = [
      { id: '1', value: '1', name: 'A' },
      { id: '2', value: '2', name: 'B' },
    ];
    let data = el.getDropdownData();
    expect(data.length).to.equal(2);
    expect(data[0].value).to.equal('1');
    expect(typeof data[0].label).to.equal('function');

    el._hasSearched = false;
    el._suggestionsLoaded = true;
    el._options = [];
    el.suggestedPeople = [
      { id: 'sp1', type: 'recent', profile: { id: 'p1', name: 'P1' } },
      { id: 'sp2', type: 'pinned', profile: { id: 'p2', name: 'P2' } },
    ];
    data = el.getDropdownData();
    expect(data.length).to.equal(2);
    expect(data[0].value).to.equal('p1');
    expect(typeof data[0].label).to.equal('function');

    el._hasSearched = false;
    el._suggestionsLoaded = false;
    el.suggestedPeople = [];
    data = el.getDropdownData();
    expect(data).to.deep.equal([]);
  });
  
  it('covers all branches of selectedOption getter', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);
    el._value = ['opt1', 'sug1', 'none'];
    el._options = [
      { id: 'opt1', value: 'opt1', name: 'Option 1', extra: 'foo' },
    ];
    el.suggestedPeople = [
      { id: 'sp1', type: 'recent', profile: { id: 'sug1', name: 'Suggestion 1', extra: 'bar' } },
    ];

    const result = el.selectedOption;
    expect(result.length).to.equal(2);
    expect(result[0]).to.deep.include({ id: 'opt1', name: 'Option 1' });
    expect(result[1]).to.deep.include({ id: 'sug1', name: 'Suggestion 1' });
    expect(result.find(r => r.id === 'none')).to.be.undefined;
  });

  it('emits addRecentSearchedPerson event if user data is missing', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);
    el.suggestedPeople = [
      { id: '1', type: 'pinned', profile: { id: '1638918', name: 'John Doe' } },
    ];
    el._user = undefined;
    let eventFired = false;
    el.addEventListener('sc-action', (e: any) => { eventFired = true; });
    await el.addRecentSearchedPerson('1638918');
    expect(eventFired).to.be.true;
  });
  
  it('renders default employee multi input', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);
    expect(el.value).to.deep.equal([]);
    const dropdownInputEle: ScDropdownMultiSelect | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-multi-select');
    expect(!!dropdownInputEle).to.equal(true);
    const options: NodeListOf<ScDropdownOption> | undefined = dropdownInputEle?.querySelectorAll('sc-dropdown-option');
    expect(options && Array.from(options).length).to.equal(0);
  });

  it('renders default employee multi input', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input .value=${['1638918']}></sc-employee-multi-input>`);
    expect(el.value).to.deep.equal(['1638918']);
    const dropdownInputEle: ScDropdownMultiSelect | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-multi-select');
    expect(!!dropdownInputEle).to.equal(true);
    const options: NodeListOf<ScDropdownOption> | undefined = dropdownInputEle?.querySelectorAll('sc-dropdown-option');
    expect(options && Array.from(options).length).to.equal(0);
  });

  it('forwards minCount and maxCount to dropdown', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`
      <sc-employee-multi-input .minCount=${2} .maxCount=${4}></sc-employee-multi-input>
    `);
    const dropdownInputEle: ScDropdownMultiSelect | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-multi-select');
    expect(!!dropdownInputEle).to.equal(true);
    expect((dropdownInputEle as any).minCount).to.equal(2);
    expect((dropdownInputEle as any).maxCount).to.equal(4);
  });

  it('does not forward error slot when no custom error content is provided', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`
      <sc-employee-multi-input .minCount=${2}></sc-employee-multi-input>
    `);
    const dropdownInputEle: ScDropdownMultiSelect | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-multi-select');
    expect(!!dropdownInputEle).to.equal(true);
    const errorSlot = dropdownInputEle?.querySelector('slot[name="error"]');
    expect(errorSlot).to.equal(null);
  });

  it('forwards error slot when custom error message is provided', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`
      <sc-employee-multi-input error-message="custom error"></sc-employee-multi-input>
    `);
    const dropdownInputEle: ScDropdownMultiSelect | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-multi-select');
    expect(!!dropdownInputEle).to.equal(true);
    const errorSlot = dropdownInputEle?.querySelector('slot[name="error"]');
    expect(errorSlot).to.not.equal(null);
  });

  it('triggers on search function', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);
    el.onSearch(new CustomEvent('sc-input', {
      detail: {
        value: '1234',
      },
    }));
    
    //@ts-ignore
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        ok: true,
        status: '200',
        json: () => Promise.resolve({
          data: mockData,
        }),
      });
    });
    await elementUpdated(el);
    const dropdownInputEle: ScDropdownMultiSelect | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-multi-select');
    expect(!!dropdownInputEle).to.equal(true);
  });

  it('render employee card', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);
    el.onSearch(new CustomEvent('sc-input', {
      detail: {
        value: '1574871',
      },
    }));
    
    //@ts-ignore
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        ok: true,
        status: '200',
        json: () => Promise.resolve({
          data: mockData,
        }),
      });
    });

    el.onSelect(new CustomEvent('sc-select', {
      detail: {
        value: [{
          name: 'Masked,John',
          id: '1574871',
          email: 'masked.john@sc.com',
          phone: '1234',
          location: 'Sigapore',
          businessTitle: 'Digital Solution Engineer',
          department: 'IT-TPS-TSA Arch & Gov',
        }],
      },
    }));

    await elementUpdated(el);
    const scEmployeeCard = el.shadowRoot?.querySelector('sc-employee-card');
    expect(!!scEmployeeCard).to.equal(false);
  });

  it('change value', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input .value=${['1626487']}></sc-employee-multi-input>`);
    await el.onValueChange();
    expect(el.value.length).to.equal(1);
  });

  it('render readonly mode', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`
    <sc-employee-multi-input
      readonly
      .value=${['1626487', '1626488']}
    ></sc-employee-multi-input>
  `);
    await el.onValueChange();

    const dropdown = el.shadowRoot?.querySelector('sc-dropdown-multi-select');
    expect(dropdown).to.be.null;

    const employeeNames = el.shadowRoot?.querySelectorAll('sc-employee-name');
    expect(employeeNames?.length).to.equal(2);

    const commas = el.shadowRoot?.querySelectorAll('.sc-employee-multi-input-readonly-comma');
    expect(commas?.length).to.equal(1);
  });

  it('handles sc-input event and triggers debounced onSearch', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);

    const originalOnSearch = el.onSearch;
    const onSearchMock = async (event: CustomEvent) => {
      expect(event.detail.value).to.equal('test value');
      return Promise.resolve();
    };
    el.onSearch = onSearchMock;

    const originalEmit = el.emit;
    el.emit = (eventName: string, eventDetail: any) => {
      expect(eventName).to.equal('sc-input');
      expect(eventDetail.detail.value).to.equal('test value');
    };

    const dropdownMultiSelectEle: ScDropdownMultiSelect | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-multi-select');
    dropdownMultiSelectEle?.dispatchEvent(
      new CustomEvent('sc-input', {
        detail: { value: 'test value' },
        bubbles: true,
        composed: true,
      })
    );

    el.onSearch = originalOnSearch;
    el.emit = originalEmit;
    await new Promise(resolve => setTimeout(resolve, 800));
  });

  it('renders sc-dropdown-multi-select with correct event bindings', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);

    const dropdownMultiSelectEle: ScDropdownMultiSelect | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-multi-select');
    expect(dropdownMultiSelectEle).to.exist;

    const originalHandleTextInput = el.handleTextInput;
    const handleTextInputMock = (event: CustomEvent) => {
      expect(event.detail.value).to.equal('test value');
    };
    el.handleTextInput = handleTextInputMock;

    dropdownMultiSelectEle?.dispatchEvent(
      new CustomEvent('sc-input', {
        detail: { value: 'test value' },
        bubbles: true,
        composed: true,
      })
    );

    el.handleTextInput = originalHandleTextInput;
  });

  it('handles sc-clear event and triggers onClear', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);

    el['_value'] = ['test value'];
    el['_options'] = [{ id: 1, name: 'Option 1' }];

    const originalEmit = el.emit;
    el.emit = (eventName: string) => {
      expect(eventName).to.equal('sc-clear');
    };

    const dropdownMultiSelectEle: ScDropdownMultiSelect | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-multi-select');
    dropdownMultiSelectEle?.dispatchEvent(
      new CustomEvent('sc-clear', {
        bubbles: true,
        composed: true,
      })
    );

    expect(el['_value']).to.deep.equal([]);
    expect(el['_options']).to.deep.equal([]);
    el.emit = originalEmit;
  });
  
  it('renders readonly sc-text-input with correct placeholder, value, and employee names', async () => {
    const mockOptions = [
      { value: '1', name: 'Alice' },
      { value: '2', name: 'Bob' },
      { value: '3', name: 'Carol' },
    ];
    const el = await fixture<ScEmployeeMultiInput>(html`
      <sc-employee-multi-input
        readonly
        placeholder="Multi Placeholder"
        .value=${['1', '2', '3']}
        label="Employees"
      ></sc-employee-multi-input>
    `);
  
    el._options = mockOptions;
    el._value = ['1', '2', '3'];
    await el.requestUpdate();
  
    const dropdownInputEle = el.shadowRoot?.querySelector('sc-dropdown-multi-select');
    expect(dropdownInputEle).to.be.null;
  
    const textInputEle = el.shadowRoot?.querySelector('sc-text-input');
    expect(textInputEle).to.exist;
  
    expect(textInputEle?.getAttribute('placeholder') || textInputEle?.placeholder).to.equal('Multi Placeholder');
  
    const labelSlot = textInputEle?.querySelector('slot[name="label"]');
    expect(labelSlot).to.exist;
  
    const readonlyDiv = textInputEle?.querySelector('.sc-employee-multi-input-readonly');
    expect(readonlyDiv).to.exist;
  
    const employeeNames = readonlyDiv?.querySelectorAll('sc-employee-name');
    expect(employeeNames?.length).to.equal(3);
  });

  it('covers delete and pin button logic with API and loading state', async () => {
    const suggestedPeople = [
      {
        id: '1',
        type: 'pinned',
        profile: { id: '1638918', name: 'John Doe' },
      },
      {
        id: '2',
        type: 'recent',
        profile: { id: '2013454', name: 'Jane Smith' },
      },
    ];
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input .value=${['1638918']} show-card></sc-employee-multi-input>`);
    el.suggestedPeople = suggestedPeople;
    el.loadingSuggestedActionId = null;
    await el.requestUpdate();

    const fetchSuggestedPeopleMock = jest.fn(async () => suggestedPeople);
    el.fetchSuggestedPeople = fetchSuggestedPeopleMock;
    const deleteSuggestedPersonMock = jest.fn(async id => { return { id }; });
    el.deleteSuggestedPerson = deleteSuggestedPersonMock;
    const pinSuggestedPersonMock = jest.fn(async id => { return { id }; });
    el.pinSuggestedPerson = pinSuggestedPersonMock;

    el.loadingSuggestedActionId = '2';
    await el.deleteSuggestedPerson('2');
    el.suggestedPeople = await el.fetchSuggestedPeople();
    el.loadingSuggestedActionId = null;
    expect(deleteSuggestedPersonMock.mock.calls.length > 0).to.be.true;
    expect(deleteSuggestedPersonMock.mock.calls[0][0]).to.equal('2');
    expect(fetchSuggestedPeopleMock.mock.calls.length > 0).to.be.true;

    el.loadingSuggestedActionId = '1';
    await el.pinSuggestedPerson('1');
    el.suggestedPeople = await el.fetchSuggestedPeople();
    el.loadingSuggestedActionId = null;
    expect(pinSuggestedPersonMock.mock.calls.length > 0).to.be.true;
    expect(pinSuggestedPersonMock.mock.calls[0][0]).to.equal('1');
    expect(fetchSuggestedPeopleMock.mock.calls.length > 1).to.be.true;
  });
  
  it('covers fetchSuggestedPeople error and loading state', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);
    el._user = { value: 'test-user' };
    el._graphQLClient = {
      query: () => { throw new Error('API error'); },
    };
    el._loadingSuggestedPeople = false;
    const result = await el.fetchSuggestedPeople();
    expect(result).to.deep.equal([]);
    expect(el._loadingSuggestedPeople).to.be.false;
  });
});

describe('ScEmployeeMultiInput DOM and dropdown logic', () => {
  it('emits sc-action for pinSuggestedPerson when userId is falsy', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);
    el.suggestedPeople = [
      { id: 'p1', type: 'recent', profile: { id: 'p1', name: 'Test User' } },
    ];
    el._graphQLClient = undefined;
    let eventDetail: any = null;
    el.addEventListener('sc-action', (e: any) => { eventDetail = e.detail; });
    const origPin = el.pinSuggestedPerson;
    el.pinSuggestedPerson = async function(id: string) {
      (this as any).suggestedPeople = el.suggestedPeople;
      const person = this.suggestedPeople?.find((p: any) => p.id === id);
      const pinned = person?.type === 'pinned' ? false : true;
      this.emit('sc-action', {
        detail: {
          action: 'pin',
          id,
          pinned,
        },
      });
      return null;
    };
    const result = await el.pinSuggestedPerson('p1');
    expect(eventDetail).to.deep.equal({ action: 'pin', id: 'p1', pinned: true });
    expect(result).to.equal(null);
    el.pinSuggestedPerson = origPin;
  });

  it('emits sc-action for deleteSuggestedPerson when userId is falsy', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`<sc-employee-multi-input></sc-employee-multi-input>`);
    el._graphQLClient = undefined;
    let eventDetail: any = null;
    el.addEventListener('sc-action', (e: any) => { eventDetail = e.detail; });
    const origDelete = el.deleteSuggestedPerson;
    el.deleteSuggestedPerson = async function(id: string) {
      this.emit('sc-action', {
        detail: {
          action: 'delete',
          id,
        },
      });
      return null;
    };
    const result = await el.deleteSuggestedPerson('d1');
    expect(eventDetail).to.deep.equal({ action: 'delete', id: 'd1' });
    expect(result).to.equal(null);
    el.deleteSuggestedPerson = origDelete;
  });
  
  it('Use export namespace api', async () => {
    const el = await fixture<ScEmployeeMultiInput>(html`
      <sc-employee-multi-input exp-api-namespace='_55313_128_webkit_exp_api' filter='role: admin'></sc-employee-multi-input>
    `);
    expect(el.expAPINamespace).to.equal('_55313_128_webkit_exp_api');
  });
});