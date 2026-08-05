import { html } from 'lit';
import { elementUpdated, fixture, expect } from '@open-wc/testing';
import { ScDropdownInput, ScDropdownOption } from '@scdevkit/webkit';
import { ScEmployeeInput } from '../../../src/components/ScEmployee/ScEmployeeInput.js';
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
// @ts-ignore
global.fetch = jest.fn(() => {
  return Promise.resolve({
    ok: true,
    status: '200',
    json: () => Promise.resolve({
      data: mockData,
    }),
  });
});

describe('ScEmployeeInput', () => {
  it('directly covers pinSuggestedPerson (custom/user and API branches)', async () => {
    const el = await fixture<ScEmployeeInput>(html`<sc-employee-input></sc-employee-input>`);
    el._user = undefined;
    el.suggestedPeople = [{ id: '1', type: 'recent', profile: { id: '1638918', name: 'John Doe' } }];
    let pinEvent;
    el.addEventListener('sc-action', (e: any) => { pinEvent = e.detail; });
    const customResult = await el.pinSuggestedPerson('1');
    expect(pinEvent).to.deep.include({ action: 'pin', id: '1', pinned: true });
    expect(customResult).to.equal(null);

    el._graphQLClient = {
      query: async () => ({
        json: async () => ({
          data: {
            _55313_128_webkit_exp_api: {
              put_pinSuggestedPeople: { id: '1', type: 'pinned', profile: { id: '1638918', name: 'John Doe' } },
            },
          },
        }),
      }),
    };
    el._user = { id: 'test-user' };
    el.suggestedPeople = [];
    await elementUpdated(el);
    const apiResult = await el.pinSuggestedPerson('1');
    expect(apiResult).to.deep.equal({ id: '1', type: 'pinned', profile: { id: '1638918', name: 'John Doe' } });

    el._graphQLClient = { query: async () => { throw new Error('fail'); } };
    expect(await el.pinSuggestedPerson('1')).to.equal(null);
  });

  it('directly covers deleteSuggestedPerson (custom/user and API branches)', async () => {
    const el = await fixture<ScEmployeeInput>(html`<sc-employee-input></sc-employee-input>`);

    el._user = undefined;
    el.suggestedPeople = [{ id: '1', type: 'recent', profile: { id: '1638918', name: 'John Doe' } }];
    let deleteEvent;
    el.addEventListener('sc-action', (e: any) => { deleteEvent = e.detail; });
    const customResult = await el.deleteSuggestedPerson('1');
    expect(deleteEvent).to.deep.include({ action: 'delete', id: '1' });
    expect(customResult).to.equal(null);

    el._graphQLClient = {
      query: async () => ({
        json: async () => ({
          data: {
            _55313_128_webkit_exp_api: {
              delete_removeRecentSearchedPeople: { id: '1', type: 'recent', profile: { id: '1638918', name: 'John Doe' } },
            },
          },
        }),
      }),
    };
    el._user = { id: 'test-user' };
    el.suggestedPeople = [];
    await elementUpdated(el);
    const apiResult = await el.deleteSuggestedPerson('1');
    expect(apiResult).to.deep.equal({ id: '1', type: 'recent', profile: { id: '1638918', name: 'John Doe' } });

    el._graphQLClient = { query: async () => { throw new Error('fail'); } };
    expect(await el.deleteSuggestedPerson('1')).to.equal(null);
  });
  it('covers all branches of fetchSuggestedPeople', async () => {
    const el = await fixture<ScEmployeeInput>(html`<sc-employee-input></sc-employee-input>`);

    el._user = undefined;
    el.suggestedPeople = [];
    await elementUpdated(el);
    expect(await el.fetchSuggestedPeople()).to.deep.equal([]);
    
    el._user = undefined;
    el.suggestedPeople = [{ id: '1', type: 'pinned', profile: { id: '1638918', name: 'John Doe' } }];
    await elementUpdated(el);
    expect(await el.fetchSuggestedPeople()).to.deep.equal([]);
    
    el._graphQLClient = {
      query: async () => ({
        json: async () => ({
          data: {
            _55313_128_webkit_exp_api: {
              get_suggestedPeople: [
                {
                  id: '5f995add-04d9-438a-b021-091da8cccf09',
                  type: 'search',
                  createdDate: '2025-12-19T04:15:25.724Z',
                  profile: {
                    id: '2013484',
                    businessTitle: 'Senior Business Development Executive',
                    category: 'Employee Workforce',
                    email: 'Carsen.Masked.9954@scbdev.com',
                    firstName: 'Archer',
                    name: 'Masked, Archer',
                    lastName: 'Masked',
                    businessFunction: {
                      businessFunction: {
                        description: 'IT-Projects-IC-T&A',
                      },
                    },
                  },
                },
                {
                  id: '9544fc43-9607-4023-a1b1-c5e798a70005',
                  type: 'search',
                  createdDate: '2025-12-19T04:15:24.493Z',
                  profile: {
                    id: '2013431',
                    businessTitle: 'Product Owner',
                    category: 'Employee Workforce',
                    email: 'Kieran.Masked.6559@scbdev.com',
                    firstName: 'Ainslee',
                    name: 'Masked, Ainslee',
                    lastName: 'Masked',
                    businessFunction: {
                      businessFunction: {
                        description: 'IT-Projects-IC-T&A',
                      },
                    },
                  },
                },
              ],
            },
          },
        }),
      }),
    };
    el._user = { id: 'test-user' };
    el.suggestedPeople = [];
    await elementUpdated(el);
    const apiResult = await el.fetchSuggestedPeople();
    expect(apiResult).to.deep.equal([
      {
        id: '5f995add-04d9-438a-b021-091da8cccf09',
        type: 'search',
        createdDate: '2025-12-19T04:15:25.724Z',
        profile: {
          id: '2013484',
          businessTitle: 'Senior Business Development Executive',
          category: 'Employee Workforce',
          email: 'Carsen.Masked.9954@scbdev.com',
          firstName: 'Archer',
          name: 'Masked, Archer',
          lastName: 'Masked',
          businessFunction: {
            businessFunction: {
              description: 'IT-Projects-IC-T&A',
            },
          },
        },
      },
      {
        id: '9544fc43-9607-4023-a1b1-c5e798a70005',
        type: 'search',
        createdDate: '2025-12-19T04:15:24.493Z',
        profile: {
          id: '2013431',
          businessTitle: 'Product Owner',
          category: 'Employee Workforce',
          email: 'Kieran.Masked.6559@scbdev.com',
          firstName: 'Ainslee',
          name: 'Masked, Ainslee',
          lastName: 'Masked',
          businessFunction: {
            businessFunction: {
              description: 'IT-Projects-IC-T&A',
            },
          },
        },
      },
    ]);

    el._graphQLClient = { query: async () => { throw new Error('fail'); } };
    expect(await el.fetchSuggestedPeople()).to.deep.equal([]);
  });

  it('covers all branches of addRecentSearchedPerson', async () => {
    const el = await fixture<ScEmployeeInput>(html`<sc-employee-input></sc-employee-input>`);

    el._user = undefined;
    el.suggestedPeople = [{ id: '1', type: 'pinned', profile: { id: '1638918', name: 'John Doe' } }];
    let eventDetail;
    el.addEventListener('sc-action', (e: any) => { eventDetail = e.detail; });
    await el.addRecentSearchedPerson('1638918');
    expect(eventDetail).to.deep.include({ action: 'addRecent', id: '1638918' });

    el._graphQLClient = {
      query: async () => ({
        json: async () => ({
          data: {
            _55313_128_webkit_exp_api: {
              post_addRecentSearchedPeople: { id: '1638918', type: 'recent', profile: { id: '1638918', name: 'John Doe' } },
            },
          },
        }),
      }),
    };
    el._user = { id: 'test-user' };
    el.suggestedPeople = [];
    await elementUpdated(el);
    const apiResult = await el.addRecentSearchedPerson('1638918');
    expect(apiResult).to.deep.equal({ id: '1638918', type: 'recent', profile: { id: '1638918', name: 'John Doe' } });
 
    el._graphQLClient = { query: async () => { throw new Error('fail'); } };
    expect(await el.addRecentSearchedPerson('1638918')).to.equal(null);
  });

  it('covers all branches of pinSuggestedPerson and deleteSuggestedPerson', async () => {
    const el = await fixture<ScEmployeeInput>(html`<sc-employee-input></sc-employee-input>`);
  
    el._user = undefined;
    el.suggestedPeople = [{ id: '1', type: 'recent', profile: { id: '1638918', name: 'John Doe' } }];
    let pinEvent;
    el.addEventListener('sc-action', (e: any) => { pinEvent = e.detail; });
    await el.pinSuggestedPerson('1');
    expect(pinEvent).to.deep.include({ action: 'pin', id: '1', pinned: true });

    el._graphQLClient = {
      query: async () => ({
        json: async () => ({
          data: {
            _55313_128_webkit_exp_api: {
              put_pinSuggestedPeople: { id: '1', type: 'pinned', profile: { id: '1638918', name: 'John Doe' } },
            },
          },
        }),
      }),
    };
    el._user = { id: 'test-user' };
    el.suggestedPeople = [];
    await elementUpdated(el);
    const pinResult = await el.pinSuggestedPerson('1');
    expect(pinResult).to.deep.equal({ id: '1', type: 'pinned', profile: { id: '1638918', name: 'John Doe' } });
   
    el._graphQLClient = { query: async () => { throw new Error('fail'); } };
    expect(await el.pinSuggestedPerson('1')).to.equal(null);


    el._user = undefined;
    el.suggestedPeople = [{ id: '1', type: 'recent', profile: { id: '1638918', name: 'John Doe' } }];
    let deleteEvent;
    el.addEventListener('sc-action', (e: any) => { deleteEvent = e.detail; });
    await el.deleteSuggestedPerson('1');
    expect(deleteEvent).to.deep.include({ action: 'delete', id: '1' });
    
    el._graphQLClient = {
      query: async () => ({
        json: async () => ({
          data: {
            _55313_128_webkit_exp_api: {
              delete_removeRecentSearchedPeople: { id: '1', type: 'recent', profile: { id: '1638918', name: 'John Doe' } },
            },
          },
        }),
      }),
    };
    el._user = { id: 'test-user' };
    el.suggestedPeople = [];
    await elementUpdated(el);
    const delResult = await el.deleteSuggestedPerson('1');
    expect(delResult).to.deep.equal({ id: '1', type: 'recent', profile: { id: '1638918', name: 'John Doe' } });
    
    el._graphQLClient = { query: async () => { throw new Error('fail'); } };
    expect(await el.deleteSuggestedPerson('1')).to.equal(null);
  });

  it('emits addRecentSearchedPerson event if user data is missing or custom suggestions are set', async () => {
    const el = await fixture<ScEmployeeInput>(html`<sc-employee-input></sc-employee-input>`);
    el._user = undefined;
    let eventDetail;
    el.addEventListener('sc-action', (e: any) => { eventDetail = e.detail; });
    await el.addRecentSearchedPerson('1638918');
    expect(eventDetail).to.deep.include({ action: 'addRecent', id: '1638918' });
    
    el._user = { id: 'test-user' };
    el.suggestedPeople = [
      { id: '1', type: 'pinned', profile: { id: '1638918', name: 'John Doe' } },
    ];
    let eventDetail2;
    el.addEventListener('sc-action', (e: any) => { eventDetail2 = e.detail; });
    await el.addRecentSearchedPerson('1638918');
    expect(eventDetail2).to.deep.include({ action: 'addRecent', id: '1638918' });
  });
  
  it('renders default employee input', async () => {
    const el = await fixture<ScEmployeeInput>(html`<sc-employee-input></sc-employee-input>`);
    expect(el.value).to.equal(undefined);
    const dropdownInputEle: ScDropdownInput | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-input');
    expect(!!dropdownInputEle).to.equal(true);
    const options: NodeListOf<ScDropdownOption> | undefined = dropdownInputEle?.querySelectorAll('sc-dropdown-option');
    expect(options && Array.from(options).length).to.equal(0);
  });

  it('renders default employee input 2', async () => {
    const el = await fixture<ScEmployeeInput>(html`<sc-employee-input .value=""></sc-employee-input>`);
    expect(el.value).to.equal(undefined);
    const dropdownInputEle: ScDropdownInput | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-input');
    expect(!!dropdownInputEle).to.equal(true);
    const options: NodeListOf<ScDropdownOption> | undefined = dropdownInputEle?.querySelectorAll('sc-dropdown-option');
    expect(options && Array.from(options).length).to.equal(0);
  });

  it('renders default employee input 3', async () => {
    const el = await fixture<ScEmployeeInput>(html`<sc-employee-input .value="1638918"></sc-employee-input>`);
    expect(el.value).to.equal(undefined);
    const dropdownInputEle: ScDropdownInput | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-input');
    expect(!!dropdownInputEle).to.equal(true);
    const options: NodeListOf<ScDropdownOption> | undefined = dropdownInputEle?.querySelectorAll('sc-dropdown-option');
    expect(options && Array.from(options).length).to.equal(0);
  });

  it('triggers on search function', async () => {
    const el = await fixture<ScEmployeeInput>(html`<sc-employee-input></sc-employee-input>`);
    el.onSearch(new CustomEvent('sc-input', {
      detail: {
        value: '1234',
      },
    }));
    
    await elementUpdated(el);
    const dropdownInputEle: ScDropdownInput | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-input');
    expect(!!dropdownInputEle).to.equal(true);
  });

  it('render employee card', async () => {
    const el = await fixture<ScEmployeeInput>(html`<sc-employee-input show-card></sc-employee-input>`);
    el.onSearch(new CustomEvent('sc-input', {
      detail: {
        value: '1574871',
      },
    }));

    el.onSelect(new CustomEvent('sc-select', {
      detail: {
        value: '1574871',
      },
    }));


    await elementUpdated(el);
    const scEmployeeCard = el.shadowRoot?.querySelector('sc-employee-card');
    expect(!!scEmployeeCard).to.equal(false);
  });

  it('handles sc-input event and triggers debounced onSearch', async () => {
    const el = await fixture<ScEmployeeInput>(html`<sc-employee-input></sc-employee-input>`);

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

    const dropdownInputEle: ScDropdownInput | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-input');
    dropdownInputEle?.dispatchEvent(
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

  it('renders sc-dropdown-input with correct event bindings', async () => {
    const el = await fixture<ScEmployeeInput>(html`<sc-employee-input></sc-employee-input>`);

    const dropdownInputEle: ScDropdownInput | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-input');
    expect(dropdownInputEle).to.exist;

    const originalHandleTextInput = el.handleTextInput;
    const handleTextInputMock = (event: CustomEvent) => {
      expect(event.detail.value).to.equal('test value');
    };
    el.handleTextInput = handleTextInputMock;

    dropdownInputEle?.dispatchEvent(
      new CustomEvent('sc-input', {
        detail: { value: 'test value' },
        bubbles: true,
        composed: true,
      })
    );

    el.handleTextInput = originalHandleTextInput;
  });

  it('handles sc-clear event and triggers onClear', async () => {
    const el = await fixture<ScEmployeeInput>(html`<sc-employee-input></sc-employee-input>`);

    el['_value'] = 'test value';
    el['_options'] = [{ id: 1, name: 'Option 1' }];

    const originalEmit = el.emit;
    el.emit = (eventName: string) => {
      expect(eventName).to.equal('sc-clear');
    };

    const dropdownInputEle: ScDropdownInput | null | undefined = el.shadowRoot?.querySelector('sc-dropdown-input');
    dropdownInputEle?.dispatchEvent(
      new CustomEvent('sc-clear', {
        bubbles: true,
        composed: true,
      })
    );

    expect(el['_value']).to.equal('');
    expect(el['_options']).to.deep.equal([]);
    el.emit = originalEmit;
  });

  it('renders readonly sc-text-input with correct placeholder and value', async () => {
    const el = await fixture<ScEmployeeInput>(html`
      <sc-employee-input readonly placeholder="Custom Placeholder" .value=${'12345'} label="Employee"></sc-employee-input>
    `);
  
    const dropdownInputEle = el.shadowRoot?.querySelector('sc-dropdown-input');
    expect(dropdownInputEle).to.be.null;
  
    const textInputEle = el.shadowRoot?.querySelector('sc-text-input');
    expect(textInputEle).to.exist;
  
    expect(textInputEle?.getAttribute('placeholder') || textInputEle?.placeholder).to.equal('Custom Placeholder');
    expect(textInputEle?.getAttribute('value') || textInputEle?.value).to.equal('12345');
  
    const labelSlot = textInputEle?.querySelector('slot[name="label"]');
    expect(labelSlot).to.exist;
  });

  it('Use export namespace api', async () => {
    const el = await fixture<ScEmployeeInput>(html`
      <sc-employee-input exp-api-namespace='_55313_128_webkit_exp_api' filter='role: admin'></sc-employee-input>
    `);
    expect(el.expAPINamespace).to.equal('_55313_128_webkit_exp_api');
  });
});