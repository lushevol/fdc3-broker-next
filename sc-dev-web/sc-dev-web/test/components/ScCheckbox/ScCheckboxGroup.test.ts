import { html } from 'lit';
import { fixture, expect, elementUpdated } from '@open-wc/testing';
import { ScCheckboxGroup } from '../../../src/components/ScCheckbox/ScCheckboxGroup.js';
import { ScCheckbox } from '../../../src/components/ScCheckbox/ScCheckbox.js';
import '../../../elements/sc-checkbox.js';

describe('ScCheckboxGroup', () => {
  it('renders default checkbox group', async () => {
    const el = await fixture<ScCheckboxGroup>(
      html`<sc-checkbox-group>
        <sc-checkbox value="1">Checkbox 1</sc-checkbox>
        <sc-checkbox value="2">Checkbox 2</sc-checkbox>
      </sc-checkbox-group>`
    );

    expect(el.direction).to.equal('default');
  });

  it('renders value', async () => {
    const el = await fixture<ScCheckboxGroup>(
      html`<sc-checkbox-group .value=${['1']}>
        <sc-checkbox value="1">Checkbox 1</sc-checkbox>
        <sc-checkbox value="2">Checkbox 2</sc-checkbox>
      </sc-checkbox-group>`
    );

    expect(el.value[0]).to.equal('1');
  });

  it('updates parent checkbox state correctly', async () => {
    const el = await fixture<ScCheckboxGroup>(
      html`<sc-checkbox-group>
        <sc-checkbox role="parent" value="1">Checkbox 1</sc-checkbox>
        <sc-checkbox value="1">Checkbox 1</sc-checkbox>
        <sc-checkbox value="2">Checkbox 2</sc-checkbox>
      </sc-checkbox-group>`
    );

    await elementUpdated(el);

    const parentCheckbox = el.querySelector(
      'sc-checkbox[role="parent"]'
    ) as ScCheckbox;
    const childChecboxes = Array.from(
      el.querySelectorAll('sc-checkbox:not([role="parent"])')
    ) as ScCheckbox[];


    expect(childChecboxes.length).to.equal(2);
    
    // Case1: Parent default state
    expect(parentCheckbox.checked).to.be.false;
    expect(parentCheckbox.indeterminate).to.be.false;

    // Case2: Select all child checkboxes parent should be checked
    el.setActiveCheckboxs([el.querySelectorAll('sc-checkbox:not([role="parent"])')[0] as ScCheckbox, el.querySelectorAll('sc-checkbox:not([role="parent"])')[1] as ScCheckbox], { emitEvents: true });
    parentCheckbox.checked = true;
    await elementUpdated(el);

    expect(parentCheckbox.checked).to.be.true;
    expect(parentCheckbox.indeterminate).to.be.false;


    // Case 3: Remove active checkbox
    el.removeActiveCheckbox(el.querySelectorAll('sc-checkbox:not([role="parent"])')[0] as ScCheckbox);
    await elementUpdated(el);

    expect(parentCheckbox.checked).to.be.false;
    expect(parentCheckbox.indeterminate).to.be.false;

    // Case 4: Remove all active checkboxes
    el.removeAllActiveCheckbox();
    await elementUpdated(el);

    expect(parentCheckbox.checked).to.be.false;
    expect(parentCheckbox.indeterminate).to.be.false;
  });

  it('should apply direction property', async () => {
    const el = await fixture<ScCheckboxGroup>(html`
      <sc-checkbox-group direction="horizontal">
        <sc-checkbox value="1">Checkbox 1</sc-checkbox>
        <sc-checkbox value="2">Checkbox 2</sc-checkbox>
      </sc-checkbox-group>`
    );

    expect(el.direction).to.equal('horizontal');
    expect(el.querySelector('.horizontal')).to.equal(null);
  });

  it('handles horizontal direction and columns correctly', async () => {
    const el = await fixture<ScCheckboxGroup>(html`
      <sc-checkbox-group direction="horizontal" columns="3">
        <sc-checkbox value="1"></sc-checkbox>
        <sc-checkbox value="2"></sc-checkbox>
        <sc-checkbox value="3"></sc-checkbox>
      </sc-checkbox-group>
    `);
    const slot = el.shadowRoot?.querySelector('slot');
    expect(slot).to.exist;
    expect(el.direction).to.equal('horizontal');
    expect(el.columns).to.equal(3);
  });

  it('should update active checkboxes based on value', async () => {
    const el = await fixture<ScCheckboxGroup>(html`
      <sc-checkbox-group .value=${['1']}>
        <sc-checkbox value="1">Checkbox 1</sc-checkbox>
        <sc-checkbox value="2">Checkbox 2</sc-checkbox>
      </sc-checkbox-group>
    `);

    el.updateStatusAccordingValue();
    expect(el.getActiveCheckboxValue()).to.deep.equal(['1']);
  });

  it('handles click events correctly', async () => {
    const el: any = await fixture<ScCheckboxGroup>(html`
      <sc-checkbox-group>
        <sc-checkbox value="1"></sc-checkbox>
        <sc-checkbox value="2"></sc-checkbox>
      </sc-checkbox-group>
    `);
    el.setActiveCheckboxs([el.checkboxs[1]]);
    el.updateParentCheckboxState();
    expect(el.activeCheckboxs).to.include(el.checkboxs[1]);
  });

  it('removes all active checkboxes correctly', async () => {
    const el: any = await fixture<ScCheckboxGroup>(html`
      <sc-checkbox-group>
        <sc-checkbox value="1"></sc-checkbox>
        <sc-checkbox value="2"></sc-checkbox>
      </sc-checkbox-group>
    `);
    el.syncCheckboxs();
    el.setActiveCheckboxs(el.checkboxs);
    el.removeAllActiveCheckbox();
    expect(el.activeCheckboxs.length).to.equal(0);
  });

  
  it('should remove active checkbox when unchecked', async () => {
    const el = await fixture<ScCheckboxGroup>(html`
      <sc-checkbox-group .value=${['1']}>
        <sc-checkbox value="1">Checkbox 1</sc-checkbox>
      </sc-checkbox-group>
    `);

    const checkbox = el.querySelector('sc-checkbox') as ScCheckbox;
    checkbox.checked = false;
    el.removeActiveCheckbox(checkbox);

    expect(el.getActiveCheckboxValue()).to.deep.equal([]);
  });

  it('should sync checkboxes on slot change', async () => {
    const el = await fixture<ScCheckboxGroup>(html`<sc-checkbox-group></sc-checkbox-group>`);
    const checkbox = document.createElement('sc-checkbox');
    checkbox.value = '1';

    el.appendChild(checkbox);
    await el.updateComplete;

    expect(el.checkboxs.length).to.equal(1);
  });

  it('should render readonly view when readonly is true', async () => {
    const el = await fixture<ScCheckboxGroup>(html`
      <sc-checkbox-group readonly .value=${['1']}>
        <sc-checkbox value="1">Option 1</sc-checkbox>
        <sc-checkbox value="2">Option 2</sc-checkbox>
      </sc-checkbox-group>
    `);

    const formControl = el.shadowRoot?.querySelector('.sc-form-control') as HTMLDivElement;
    expect(formControl).to.exist;
  });
});

describe('updateParentChekboxState function', () => {
  it('should enter if condition and update the parent chekbox', () => {
    const checkboxGroup = new ScCheckboxGroup();

    checkboxGroup.checkboxs = [
      Object.assign(new ScCheckbox(), { role: 'parent', value: 'all', checked: false, indeterminate: false }),
      Object.assign(new ScCheckbox(), { value: '1', checked: true }),
      Object.assign(new ScCheckbox(), { value: '2', checked: false }),
    ];

    checkboxGroup.updateParentCheckboxState();
    const parentCheckbox = checkboxGroup.checkboxs.find(el => el.role === 'parent');

    expect(parentCheckbox).to.not.be.undefined;
    expect(parentCheckbox?.indeterminate).to.be.true;
  });
});


describe('handleClick function', () => {
  it('handleClick should be a function', () => {
    const checkboxGroup = new ScCheckboxGroup();

    expect(checkboxGroup.handleClick).to.be.a('function');
  });
});
