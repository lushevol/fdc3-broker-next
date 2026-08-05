import { html } from 'lit';
import { elementUpdated, fixture, expect } from '@open-wc/testing';
import { ScModal } from '../../src/components/ScModal/ScModal.js';
import '../../elements/sc-modal.js';

function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

describe('ScModal', () => {
  it('renders alert modal', async () => {
    const el = await fixture<ScModal>(html`<sc-modal></sc-modal>`);
    await fixture<ScModal>(
      html`<sc-modal
        open
        no-close-icon
        no-header
        size="sm"
        icon
      ></sc-modal>`
    );
    await fixture<ScModal>(
      html`<sc-modal
        color='blue'
        open
        no-close-icon
        no-header
        size="sm"
        icon
      ></sc-modal>`
    );
    await fixture<ScModal>(
      html`<sc-modal
        color='green'
        open
        no-close-icon
        no-header
        size="sm"
        icon
      ></sc-modal>`
    );
    await fixture<ScModal>(
      html`<sc-modal
        color='amber'
        open
        no-close-icon
        no-header
        size="sm"
        icon
      ></sc-modal>`
    );
    await fixture<ScModal>(
      html`<sc-modal
        color='red'
        open
        no-close-icon
        no-header
        size="sm"
        icon
      ></sc-modal>`
    );
    await fixture<ScModal>(
      html`<sc-modal
        open
        no-close-icon
        no-header
        size="md"
      ></sc-modal>`
    );
    await fixture<ScModal>(
      html`<sc-modal
        open
        no-close-icon
        no-header
        no-padding
        disable-outside-click
        size="lg"
        footer="test"
      ></sc-modal>`
    );

    expect(el.open).to.equal(false);
  });

  it('renders alert modal and checks icon name based on color', async () => {
    const colors = [
      { color: 'blue', expectedIcon: 'info-circle--fill' },
      { color: 'amber', expectedIcon: 'alert-triangle--fill' },
      { color: 'red', expectedIcon: 'alert-circle--fill' },
      { color: 'green', expectedIcon: 'checkmark-circle--fill' },
      { color: 'default', expectedIcon: 'checkmark-circle--fill' },
    ];

    for (const { color, expectedIcon } of colors) {
      const el = await fixture<ScModal>(html`
        <sc-modal
          color=${color}
          open
          no-close-icon
          size="sm"
          icon
        ></sc-modal>
      `);
      el.icon = true;
      await elementUpdated(el);
      const icon = el.shadowRoot?.querySelector('sc-icon') as HTMLElement;
      expect(icon.getAttribute('name')).to.equal(expectedIcon);
    }
  });

  it('test event', async () => {
    const el = await fixture<ScModal>(html`<sc-modal></sc-modal>`);
    await fixture<ScModal>(
      html`<sc-modal
        open
        disable-outside-click
        no-close-icon
        no-header
        size="sm"
      ></sc-modal>`
    );
      
    const eventShow = new CustomEvent('sl-show');
    el.dispatchEvent(eventShow);

    const eventHide = new CustomEvent('sl-hide');
    el.dispatchEvent(eventHide);

    const eventClose = new CustomEvent('sl-request-close', {
      detail: {
        source: 'overlay',
      },
    });
    
    el.dispatchEvent(eventClose);

    await el.updateComplete;

    expect(el.open).to.equal(false);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScModal>(html`<sc-modal></sc-modal>`);

    await expect(el).shadowDom.to.be.accessible();
  });

  it('passes button disabled', async () => {
    const el = await fixture<ScModal>(html`<sc-modal 
    button-disable-primary
    button-disable-secondary
    ></sc-modal>`);
    await el.updateComplete;
    await expect(el.buttonDisablePrimary).to.be.true;
    await expect(el.buttonDisableSecondary).to.be.true;
  });

  it('trigger sl-hide events', async () => {
    const el = await fixture<ScModal>(html`<sc-modal></sc-modal>`);
    await elementUpdated(el);
    const slDialog: any = el.renderRoot?.querySelector('sl-dialog');
    const slCloseIcon: any = slDialog.renderRoot?.querySelector('.dialog__close');
    if (slCloseIcon) {
      slCloseIcon.click();
      expect(slDialog.open).to.equal(false);
    }
  });

  it('should set margin-left for sc-button elements in the footer slot', async () => {
    const el = await fixture<ScModal>(html`<sc-modal></sc-modal>`);
    const footerSlot = document.createElement('div');
    footerSlot.setAttribute('slot', 'footer');
    const button1 = document.createElement('sc-button');
    const button2 = document.createElement('sc-button');
    footerSlot.appendChild(button1);
    footerSlot.appendChild(button2);
    el.appendChild(footerSlot);

    el.connectedCallback();

    expect(button1.style.marginLeft).to.equal('');
    expect(button2.style.marginLeft).to.equal('.5rem');
  });

  it('should set open to false when close icon is clicked', async () => {
    const el = await fixture<ScModal>(html`<sc-modal></sc-modal>`);
    el.noCloseIcon = false;
    await el.updateComplete;

    const closeIcon = el.shadowRoot?.querySelector('.close-icon') as HTMLElement;
    closeIcon.click();

    expect(el.open).to.be.false;
  });

  it('should apply margin to sc-button elements in the footer slot', async () => {
    const el = await fixture<ScModal>(html`
      <sc-modal>
        <div slot="footer">
          <sc-button>Button 1</sc-button>
          <sc-button>Button 2</sc-button>
        </div>
      </sc-modal>
    `);
    await elementUpdated(el);

    const buttons = el.querySelectorAll('sc-button');
    expect(buttons[1].style.marginLeft).to.equal('.5rem');
  });

  it('should update title text visibility based on title-text property', async () => {
    const el = await fixture<ScModal>(html`
      <sc-modal title="Initial Title"></sc-modal>
    `);
    await elementUpdated(el);
  
    const titleTextElement = el.shadowRoot?.querySelector('.title-text') as HTMLElement;
    expect(getComputedStyle(titleTextElement).marginTop).to.equal('.5rem');
  
    el.title = '';
    await elementUpdated(el);
    expect(getComputedStyle(titleTextElement).marginTop).to.equal('0px');
  
    el.title = 'Updated Title';
    await elementUpdated(el);
    expect(getComputedStyle(titleTextElement).marginTop).to.equal('.5rem');
  });

  it('should update hasSlotContent based on default slot content', async () => {
    const el = await fixture<ScModal>(html`
      <sc-modal>
        Some content
      </sc-modal>
    `);

    await elementUpdated(el);
    (el as any).handleDefaultSlotChange();
    expect((el as any).hasSlotContent).to.be.true;

    const slot = el.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    slot.dispatchEvent(new Event('slotchange'));

    el.innerHTML = '';
    await elementUpdated(el);
    (el as any).handleDefaultSlotChange();
    expect((el as any).hasSlotContent).to.be.false;
    slot.dispatchEvent(new Event('slotchange'));
  });

  it('should render pagination footer when footer-type is "pagination"', async () => {
    const el = await fixture<ScModal>(html`
      <sc-modal footer-type="pagination" pagination-total="100" pagination-current-page="1" pagination-page-size="10">
      </sc-modal>
    `);
    await elementUpdated(el);

    const paginationFooter = el.shadowRoot?.querySelector('.pagination-footer');
    expect(paginationFooter).to.exist;
    const scPagination = paginationFooter?.querySelector('sc-pagination');
    expect(scPagination).to.exist;
    expect(scPagination?.getAttribute('total')).to.equal('100');
    expect(scPagination?.getAttribute('current-page')).to.equal('1');
    expect(scPagination?.getAttribute('page-size')).to.equal('10');
  });

  it('should render alternative footer when footer-type is "alternative"', async () => {
    const el = await fixture<ScModal>(html`
      <sc-modal footer-type="alternative">
        <div slot="alternative-footer">Alternative Footer Content</div>
      </sc-modal>
    `);
    await elementUpdated(el);

    const alternativeFooter = el.shadowRoot?.querySelector('.alternative-footer');
    expect(alternativeFooter).to.exist;
    const slotContent = alternativeFooter?.querySelector('slot[name="alternative-footer"]');
    expect(slotContent).to.exist;
  });

  it('should not render any footer when footer-type is not specified', async () => {
    const el = await fixture<ScModal>(html`
      <sc-modal button-text-left="Left Button" button-text-primary="Primary Button" button-text-secondary="Secondary Button" button-text-tertiary="Tertiary Button">
      </sc-modal>
    `);
    await elementUpdated(el);
  
    const buttonFooter = el.shadowRoot?.querySelector('.button-footer');
    expect(buttonFooter).to.not.exist;
  
    const paginationFooter = el.shadowRoot?.querySelector('.pagination-footer');
    expect(paginationFooter).to.not.exist;
  
    const alternativeFooter = el.shadowRoot?.querySelector('.alternative-footer');
    expect(alternativeFooter).to.not.exist;
  });

  it('should not render footer when noFooter is true', async () => {
    const el = await fixture<ScModal>(html`
      <sc-modal no-footer>
      </sc-modal>
    `);
    await elementUpdated(el);

    const footer = el.shadowRoot?.querySelector('.footer');
    expect(footer).to.not.exist;
  });

  it('should disconnect buttonFooterObserver on disconnectedCallback', async () => {
    const el = await fixture<ScModal>(html`<sc-modal></sc-modal>`);
    // @ts-ignore
    el.buttonFooterObserver = new ResizeObserver(() => {});
    const buttonElement = document.createElement('div');
    buttonElement.classList.add('button-footer');
    el.shadowRoot?.appendChild(buttonElement);
    // @ts-ignore
    el.buttonFooterObserver.observe(buttonElement);

    el.disconnectedCallback();

    // @ts-ignore
    expect(el.buttonFooterObserver).to.be.undefined;
  });

  it('should observe button footer on observeButtonFooter', async () => {
    const el = await fixture<ScModal>(html`<sc-modal></sc-modal>`);
    const buttonElement = document.createElement('div');
    buttonElement.classList.add('button-footer');
    el.shadowRoot?.appendChild(buttonElement);

    el.observeButtonFooter();
    await el.updateComplete;

    // @ts-ignore
    expect(el.buttonFooterObserver).to.not.be.undefined;
    // @ts-ignore
    expect(el.buttonFooterObserver).to.be.instanceOf(ResizeObserver);
  });

  it('should update button footer layout on updateButtonFooterLayout original', async () => {
    const el = await fixture<ScModal>(html`<sc-modal></sc-modal>`);
    const buttonFooter = document.createElement('div');
    buttonFooter.classList.add('button-footer');
    const leftButtonContainer = document.createElement('div');
    leftButtonContainer.classList.add('left-button-container');
    const rightButtonContainer = document.createElement('div');
    rightButtonContainer.classList.add('right-button-container');
    el.shadowRoot?.appendChild(buttonFooter);
    el.shadowRoot?.appendChild(leftButtonContainer);
    el.shadowRoot?.appendChild(rightButtonContainer);

    leftButtonContainer.getBoundingClientRect = () => ({ width: 50 } as DOMRect);
    rightButtonContainer.getBoundingClientRect = () => ({ width: 100 } as DOMRect);
    buttonFooter.getBoundingClientRect = () => ({ width: 200 } as DOMRect);

    // @ts-ignore
    el.updateButtonFooterLayout();
    await nextFrame();
    await elementUpdated(el);

    // @ts-ignore
    expect(el.isStacked).to.be.true;
    expect(buttonFooter.classList.contains('stacked')).to.be.true;
  });

  it('should update button footer layout correctly on updateButtonFooterLayout', async () => {
    const el = await fixture<ScModal>(html`<sc-modal 
      footer-type="button" 
      button-text-left="Left" 
      button-text-primary="Primary" 
      button-text-secondary="Secondary" 
      button-text-tertiary="Tertiary">
    </sc-modal>`);
    const buttonFooter = el.shadowRoot?.querySelector('.button-footer') as HTMLElement;
    const leftButtonContainer = el.shadowRoot?.querySelector('.left-button-container') as HTMLElement;
    const rightButtonContainer = el.shadowRoot?.querySelector('.right-button-container') as HTMLElement;
  
    leftButtonContainer.getBoundingClientRect = () => ({ width: 50 } as DOMRect);
    rightButtonContainer.getBoundingClientRect = () => ({ width: 150 } as DOMRect);
    buttonFooter.getBoundingClientRect = () => ({ width: 200 } as DOMRect);
  
    el.buttonTextPrimary = 'Primary';
    el.buttonTextSecondary = 'Secondary';
    el.buttonTextTertiary = 'Tertiary';
    el.buttonTextLeft = 'Left';
  
    // @ts-ignore
    el.updateButtonFooterLayout();
    await nextFrame();
    await elementUpdated(el);
  
    // @ts-ignore
    expect(el.isStacked).to.be.true;
    expect(buttonFooter.classList.contains('stacked')).to.be.true;
  });

  it('renders footer when footer-type is defined and noFooter is false', async () => {
    const el = await fixture(html`<sc-modal footer-type="pagination"></sc-modal>`);
    const footer = el.shadowRoot?.querySelector('.footer');
    expect(footer).to.exist;
  });

  it('renders pagination footer when footer-type is pagination', async () => {
    const el = await fixture(html`<sc-modal footer-type="pagination"></sc-modal>`);
    const paginationFooter = el.shadowRoot?.querySelector('.pagination-footer');
    expect(paginationFooter).to.exist;
  });

  it('renders alternative footer when footer-type is alternative', async () => {
    const el = await fixture(html`<sc-modal footer-type="alternative"></sc-modal>`);
    const alternativeFooter = el.shadowRoot?.querySelector('.alternative-footer');
    expect(alternativeFooter).to.exist;
  });

  it('renders button footer when footer-type is neither pagination nor alternative', async () => {
    const el = await fixture(html`<sc-modal footer-type="button"></sc-modal>`);
    const buttonFooter = el.shadowRoot?.querySelector('.button-footer');
    expect(buttonFooter).to.exist;
  });

  it('button visibility and styles based on properties', async () => {
    const el = await fixture(html`
      <sc-modal 
        footer-type="button" 
        button-text-left="Left" 
        button-text-primary="Primary" 
        button-text-secondary="Secondary" 
        button-text-tertiary="Tertiary">
      </sc-modal>
    `);
    await elementUpdated(el);

    const leftButton = el.shadowRoot?.querySelector('.left-button-container sc-button');
    const tertiaryButton = el.shadowRoot?.querySelector('.right-button-container sc-button:nth-child(1)');
    const secondaryButton = el.shadowRoot?.querySelector('.right-button-container sc-button:nth-child(2)');
    const primaryButton = el.shadowRoot?.querySelector('.right-button-container sc-button:nth-child(3)');

    expect(leftButton).to.be.visible;
    expect(leftButton).to.have.style('display', 'inline-block');
    expect(primaryButton).to.be.visible;
    expect(primaryButton).to.have.style('display', 'inline-block');
    expect(secondaryButton).to.be.visible;
    expect(secondaryButton).to.have.style('display', 'inline-block');
    expect(tertiaryButton).to.be.visible;
    expect(tertiaryButton).to.have.style('display', 'inline-block');
  });
});
