import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScCard } from '../../../src/components/ScCard/ScCard.js';
import { mockMatchMedia } from '../../shared/mediaQuery.js';
import '../../../elements/sc-card.js';

const image = 
  '//av.sc.com/corp-en/nr/content/images/NEW-Download-PNG-derivative-sc_icon_diversity_full-colour_rgb_1600px.png';
const title = 'This is the title of card';
const subTitle = 'This is the sub title of card';
const body = 'This is the body of card';

describe('ScCard', () => {
  it('renders default card', async () => {
    const el = await fixture<ScCard>(html`<sc-card></sc-card>`);

    expect(el.title).to.equal('');
    expect(el.subTitle).to.equal('');
    expect(el.titleSize).to.equal('sm');
    expect(el.iconSize).to.equal('sm');
    expect(el.verticalAlign).to.equal('middle');
    expect(el.spaceSize).to.equal('sm');
    expect(el.body).to.equal('');
    expect(el.icon).to.equal('');
    expect(el.selected).to.equal(false);
    expect(el.width).to.equal('100%');
    expect(el.height).to.equal('auto');
  });

  it('renders by attribute', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card
          image='${image}'
          title='${title}'
          sub-title='${subTitle}'
          body='${body}'
          icon='arrow-ios-forward'
          vertical-align='top'
        >
      </sc-card>
      `
    );
    expect(el.title).to.equal(title);
    expect(el.subTitle).to.equal(subTitle);
    expect(el.body).to.equal(body);
    expect(el.icon).to.equal('arrow-ios-forward');
    expect(el.verticalAlign).to.equal('top');
  });

  it('renders by slot', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card>
          <img slot='prefix' src='${image}'/>
          <div slot='sub-title'>${subTitle}</div>
          <div slot='title'>${title}</div>
          <div slot='body'>${body}</div>
          <sc-icon slot='suffix' name='arrow-ios-forward' size='md'/>
        </sc-card>
      `
    );
    // @ts-ignore
    expect(el.renderRoot.innerHTML.includes('card-with-prefix-slot')).to.be.true;
  });

  it('renders top-container with draggable icon', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card direction="vertical" draggable>
        </sc-card>
      `
    );
    const dragButton = el.shadowRoot?.querySelector('.card-drag-button');
    expect(dragButton).to.exist;
  });

  it('renders top-container with action button', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card direction="vertical" action-button='more-vertical'>
        </sc-card>
      `
    );
    const actionButton = el.shadowRoot?.querySelector('.card-action-button');
    expect(actionButton).to.exist;
  });

  it('renders top-container with icon', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card direction="vertical" icon="test-icon">
        </sc-card>
      `
    );
    const iconButton = el.shadowRoot?.querySelector('.card-icon');
    expect(iconButton).to.exist;
  });

  it('renders top-container with draggable, action button, and icon', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card direction="vertical" draggable action-button='more-vertical' icon="test-icon">
        </sc-card>
      `
    );
    const dragButton = el.shadowRoot?.querySelector('.card-drag-button');
    const actionButton = el.shadowRoot?.querySelector('.card-action-button');
    const iconButton = el.shadowRoot?.querySelector('.card-icon');
    expect(dragButton).to.exist;
    expect(actionButton).to.exist;
    expect(iconButton).to.exist;
  });

  it('renders header slot', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card>
          <div slot="header">Header Content</div>
        </sc-card>
      `
    );
    const headerSlot = el.shadowRoot?.querySelector('.card-header-slot');
    expect(headerSlot).to.exist;
  });

  it('renders content with correct vertical alignment', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card vertical-align="top"></sc-card>
      `
    );
    const content = el.shadowRoot?.querySelector('.content');
    expect(content).to.have.class('items-start');
  });

  it('renders card-drag-button when direction is not vertical and draggable', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card direction="horizontal" draggable></sc-card>
      `
    );
    const dragButton = el.shadowRoot?.querySelector('.card-drag-button');
    expect(dragButton).to.exist;
  });

  it('renders sub-title from property', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card sub-title="Test Sub Title"></sc-card>
      `
    );
    const subTitle = el.shadowRoot?.querySelector('.card-sub-title');
    expect(subTitle).to.exist;
    expect(subTitle?.textContent?.trim()).to.equal('Test Sub Title');
  });

  it('renders sub-title from slot', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card>
          <div slot="sub-title">Slot Sub Title</div>
        </sc-card>
      `
    );
    const subTitleSlot = el.shadowRoot?.querySelector('slot[name="sub-title"]') as HTMLSlotElement;
    expect(subTitleSlot).to.exist;
    const assignedElements = subTitleSlot.assignedElements({ flatten: true });
    expect(assignedElements.length).to.be.greaterThan(0);
    expect(assignedElements[0].textContent).to.equal('Slot Sub Title');
  });

  it('renders title from property', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card title="Test Title"></sc-card>
      `
    );
    const title = el.shadowRoot?.querySelector('.card-title');
    expect(title).to.exist;
    expect(title?.textContent?.trim()).to.equal('Test Title');
  });

  it('renders title from slot', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card>
          <div slot="title">Slot Title</div>
        </sc-card>
      `
    );
    const titleSlot = el.shadowRoot?.querySelector('.card-title-slot') as HTMLSlotElement;
    expect(titleSlot).to.exist;
    expect(titleSlot?.assignedNodes()[0].textContent?.trim()).to.equal('Slot Title');
  });

  it('renders body from property', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card body="Test Body"></sc-card>
      `
    );
    const body = el.shadowRoot?.querySelector('.card-body');
    expect(body).to.exist;
    expect(body?.textContent?.trim()).to.equal('Test Body');
  });

  it('renders body from slot', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card>
          <div slot="body">Slot Body</div>
        </sc-card>
      `
    );
    const bodySlot = el.shadowRoot?.querySelector('.card-body-slot') as HTMLSlotElement;
    expect(bodySlot).to.exist;
    expect(bodySlot?.assignedNodes()[0].textContent?.trim()).to.equal('Slot Body');
  });

  it('renders tags correctly', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card .tagsGroup=${[{ type: 'primary', iconName: 'info-circle--line', content: 'Information' }]}>
        </sc-card>
      `
    );
    const tagsContainer = el.shadowRoot?.querySelector('.tags-container');
    expect(tagsContainer).to.exist;
    const tag = tagsContainer?.querySelector('sc-tag');
    expect(tag).to.exist;
    expect(tag?.textContent?.trim()).to.equal('Information');
  });

  it('renders supplementary details correctly', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card .supplementaryDetails=${[{ iconName: 'clock--line', details: '9 APIs' }]}>
        </sc-card>
      `
    );
    const supplementaryContainer = el.shadowRoot?.querySelector('.supplementary-container');
    expect(supplementaryContainer).to.exist;
    const detail = supplementaryContainer?.querySelector('.supplementary-detail');
    expect(detail).to.exist;
    expect(detail?.textContent?.trim()).to.include('9 APIs');
  });

  it('renders suffix slot', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card>
          <div slot="suffix">Suffix Content</div>
        </sc-card>
      `
    );
    const suffixSlot = el.shadowRoot?.querySelector('.card-suffix-slot');
    expect(suffixSlot).to.exist;
    const assignedElements = (suffixSlot as HTMLSlotElement).assignedElements({ flatten: true });
    expect(assignedElements.length).to.be.greaterThan(0);
    expect(assignedElements[0].textContent).to.equal('Suffix Content');
  });

  it('renders icon container when direction is not vertical and actionButton is present', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card direction="horizontal" action-button='more-vertical'>
        </sc-card>
      `
    );
    const iconContainer = el.shadowRoot?.querySelector('.icon-container');
    expect(iconContainer).to.exist;
    const actionButton = iconContainer?.querySelector('.card-action-button');
    expect(actionButton).to.exist;
  });

  it('renders icon container when direction is not vertical and icon is present', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card direction="horizontal" icon="test-icon">
        </sc-card>
      `
    ); 
    const iconContainer = el.shadowRoot?.querySelector('.icon-container');
    expect(iconContainer).to.exist;
    const iconButton = iconContainer?.querySelector('.card-icon');
    expect(iconButton).to.exist;
  });

  it('renders icon aligned to the right', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card direction="horizontal" icon="test-icon" icon-align="right">
        </sc-card>
      `
    );
    const iconContainer = el.shadowRoot?.querySelector('.icon-container');
    expect(iconContainer).to.exist;
    const iconButton = iconContainer?.querySelector('.card-icon');
    expect(iconButton).to.exist;
  });

  it('does not render icon container when neither actionButton nor icon are present', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card direction="horizontal">
        </sc-card>
      `
    );
    const iconContainer = el.shadowRoot?.querySelector('.icon-container');
    expect(iconContainer).to.not.exist;
  });

  it('renders drag button when direction is not vertical and draggable is true', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card direction="horizontal" draggable>
        </sc-card>
      `
    );
    const dragButton = el.shadowRoot?.querySelector('.card-drag-button');
    expect(dragButton).to.exist;
  });

  it('renders icon when direction is not vertical and iconAlign is left', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card direction="horizontal" icon="test-icon" icon-align="left">
        </sc-card>
      `
    );
    const iconButton = el.shadowRoot?.querySelector('.card-icon');
    expect(iconButton).to.exist;
  });

  it('renders icon when direction is not vertical and iconAlign is justify', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card direction="horizontal" icon="test-icon" icon-align="justify">
        </sc-card>
      `
    );
    const iconButton = el.shadowRoot?.querySelector('.card-icon');
    expect(iconButton).to.exist;
  });

  it('renders both drag button and icon when direction is not vertical, draggable is true, and icon is present', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card direction="horizontal" draggable icon="test-icon" icon-align="left">
        </sc-card>
      `
    );
    const dragButton = el.shadowRoot?.querySelector('.card-drag-button');
    const iconButton = el.shadowRoot?.querySelector('.card-icon');
    expect(dragButton).to.exist;
    expect(iconButton).to.exist;
  });

  it('renders left button when button-text-left is provided', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card button-text-left="Left Button">
        </sc-card>
      `
    );
    await el.updateComplete; 
    const leftButton = el.shadowRoot?.querySelector('.left-button-container sc-button');
    expect(leftButton).to.exist;
    expect(leftButton?.textContent?.trim()).to.equal('Left Button');
  });

  it('does not render left button when button-text-left is not provided', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card clickable>
        </sc-card>
      `
    );
    await el.updateComplete; 
    const leftButton = el.shadowRoot?.querySelector('.left-button-container sc-button') as HTMLElement;
    expect(leftButton).to.not.exist;
  });

  it('renders secondary button when button-text-primary and button-text-secondary are provided', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card button-text-primary="Primary Button" button-text-secondary="Secondary Button">
        </sc-card>
      `
    );
    await el.updateComplete;
    const secondaryButton = el.shadowRoot?.querySelector('.right-button-container sc-button');
    expect(secondaryButton).to.exist;
    expect(secondaryButton?.textContent?.trim()).to.equal('Secondary Button');
  });

  it('does not render secondary button when button-text-secondary are not provided', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card clickable>
        </sc-card>
      `
    );
    const secondaryButton = el.shadowRoot?.querySelector('.right-button-container sc-button[type="${el.buttonTypeSecondary}"]');
    expect(secondaryButton).to.not.exist;
  });

  it('renders primary button when button-text-primary is provided', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card button-text-primary="Primary Button">
        </sc-card>
      `
    );
    await el.updateComplete;
    const primaryButton = el.shadowRoot?.querySelector('.primary-button');
    expect(primaryButton).to.exist;
    expect(primaryButton?.textContent?.trim()).to.equal('Primary Button');
  });

  it('does not render primary button when button-text-primary is not provided', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card clickable>
        </sc-card>
      `
    );
    const primaryButton = el.shadowRoot?.querySelector('.right-button-container sc-button[type="${el.buttonTypePrimary}"]');
    expect(primaryButton).to.not.exist;
  });

  it('renders footer slot', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card>
          <div slot="footer">Footer Content</div>
        </sc-card>
      `
    );
    const footerSlot = el.shadowRoot?.querySelector('.card-footer-slot');
    expect(footerSlot).to.exist;
    const assignedElements = (footerSlot as HTMLSlotElement).assignedElements({ flatten: true });
    expect(assignedElements.length).to.be.greaterThan(0);
    expect(assignedElements[0].textContent).to.equal('Footer Content');
  });

  it('emits sc-action event with correct details on drag button click', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card draggable></sc-card>
      `
    );
    const eventSpy = new Promise(resolve => {
      el.addEventListener('sc-action', resolve);
    });

    const dragButton = el.shadowRoot?.querySelector('.card-drag-button');
    dragButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    const event = await eventSpy as CustomEvent;
    expect(event.detail).to.have.property('target', dragButton);
    expect(event.detail).to.have.property('type', 'drag-button');
  });

  it('emits sc-action event with correct details on action button click', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card action-button='more-vertical'></sc-card>
      `
    );
    await el.updateComplete;
    const eventSpy = new Promise<CustomEvent>(resolve => {
      el.addEventListener('sc-action', event => {
        resolve(event as CustomEvent);
      });
    });
  
    const actionButton = el.shadowRoot?.querySelector('.card-action-button');
    if (!actionButton) {
      throw new Error('Action button not found');
    }
    actionButton.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
  
    const event = await eventSpy;
    expect(event.detail).to.have.property('target', actionButton);
    expect(event.detail).to.have.property('type', 'action-button');
  }, 10000);

  it('emits sc-action event with correct details on icon button click', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card icon="test-icon"></sc-card>
      `
    );
    const eventSpy = new Promise(resolve => {
      el.addEventListener('sc-action', resolve);
    });

    const iconButton = el.shadowRoot?.querySelector('.card-icon');
    iconButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    const event = await eventSpy as CustomEvent;
    expect(event.detail).to.have.property('target', iconButton);
    expect(event.detail).to.have.property('type', 'icon');
  });

  it('toggles selected property on card click', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card selected-on-click></sc-card>
      `
    );

    const card = el.shadowRoot?.querySelector('.sc-card');
    card?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(el.selected).to.be.true;

    card?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(el.selected).to.be.false;
  });

  it('toggles expanded state on click', async () => {
    const el = await fixture<ScCard>(html`<sc-card expandable></sc-card>`);
  
    const expandableDiv = el.shadowRoot?.querySelector('.expandable') as HTMLElement;
    expect(el.expanded).to.be.false;
  
    expandableDiv?.click();
    expect(el.expanded).to.be.true;
  
    expandableDiv?.click();
    expect(el.expanded).to.be.false;
  });
  
  it('renders supplementary details correctly when expanded', async () => {
    const el = await fixture<ScCard>(
      html`
        <sc-card 
          expandable 
          .supplementaryDetails=${[{ iconName: 'icon1', details: 'Detail 1' }, { iconName: 'icon2', details: 'Detail 2' }]}
        ></sc-card>
      `
    );
    el.expanded = true;
    await el.updateComplete;
  
    const supplementaryContainer = el.shadowRoot?.querySelector('.supplementary-container');
    expect(supplementaryContainer).to.exist;
  
    const details = supplementaryContainer?.querySelectorAll('.supplementary-detail');
    expect(details).to.exist;
    expect(details?.length).to.equal(2);
  
    const detail1 = details?.[0];
    expect(detail1).to.exist;
    expect(detail1?.textContent?.trim()).to.include('Detail 1');
  
    const detail2 = details?.[1];
    expect(detail2).to.exist;
    expect(detail2?.textContent?.trim()).to.include('Detail 2');
  });

  it('emits sc-action event on button clicks (primary, secondary, left)', async () => {
    const el = await fixture<ScCard>(html`
      <sc-card
        button-text-primary="Primary"
        button-text-secondary="Secondary"
        button-text-left="Left"
      ></sc-card>
    `);

    // Helper to test each button type
    async function testButtonClick(buttonClass: string, expectedType: 'primary' | 'secondary' | 'left') {
      let emittedEvent: CustomEvent | null = null;
      el.addEventListener('sc-action', (event: Event) => {
        emittedEvent = event as CustomEvent;
      });
      const button = el.shadowRoot?.querySelector(buttonClass);
      expect(button).to.exist;
      (button as HTMLElement).click();
      await el.updateComplete;
      expect(emittedEvent).to.not.be.null;
      expect(emittedEvent!.detail).to.deep.equal({ type: expectedType });
    }

    await testButtonClick('.primary-button', 'primary');
    await testButtonClick('.secondary-button', 'secondary');
    await testButtonClick('.left-button', 'left');
  });

  it('renders in mobile', async () => {
    mockMatchMedia();
    const el = await fixture<ScCard>(html`
      <sc-card .tagsGroup=${[
        { type: 'primary', iconName: 'info-circle--line', content: 'Information' },
        { type: 'primary', iconName: 'info-circle--line', content: 'Information2' },
        { type: 'primary', iconName: 'info-circle--line', content: 'Information3' },
      ]}>
      </sc-card>
    `);
    await el.updateComplete;
    const tagsContainer = el.shadowRoot?.querySelector('.tags-container');
    expect(tagsContainer).to.exist;
    el.getOriginalTagsWidth();
    expect(el._originalTagsWidth.length).to.equal(3);
    const tags = tagsContainer?.querySelectorAll('sc-tag');
    expect(tags?.[tags?.length - 1]?.textContent?.trim()).to.equal('Information3');
    mockMatchMedia.toggle(el.mediaQuery.mobileSm.media);
    el.requestUpdate();
    await el.updateComplete;
    expect(el.isMobile).to.equal(true);
  });
});
