import { html } from 'lit';
import { property, queryAll } from 'lit/decorators.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import '../../../elements/sc-badge.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-text-input.js';
import ScRepeaterStyle from './ScRepeater.style.js';
import { generateUniqueId } from '../../shared/generate-unique-id.js';

enum POSITION {
  APPEND = 'append',
  PREPEND = 'prepend',
  STARTINGEMPTY = 'startingEmpty',
}

export class ScRepeater extends ScElement {
  static styles = ScTheme.getStyles().concat([ScRepeaterStyle]);

  private firstDivElement!: HTMLElement;
  private fieldValues = { fields: [], values: [] };
  private changeObject: any = { fields: [], values: [] };

  @property({ type: String }) position?: string;

  @property({ type: Boolean, reflect: true, attribute: 'button-expand' })
    buttonExpand?: boolean = false;

  @property({ type: Boolean, reflect: true }) disabled?: boolean = false;

  @queryAll('.icon-container') containers: any;

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('position')) {
      this.clearContent();
      changedProperties.forEach((values, keys) => {
        if (keys === 'position' && this.position === POSITION.STARTINGEMPTY) {
          this.shadowRoot?.querySelector('.icon-container')?.remove();
        }
      });
      if (this.position !== POSITION.STARTINGEMPTY) {
        this.instantiated();
      }
    }
  }

  constructor() {
    super();
  }

  renderCustomStyle() {
    const variableStyle = html` <style>
      .icon-container > sc-icon {
        display: ${this.disabled === true ? 'none' : ''};
      }
    </style>`;
    return variableStyle;
  }

  renderInput() {
    if (this.position === POSITION.PREPEND) {
      return html`<div class="icon-container">
          <div class="slot-group"><slot></slot></div>
          <sc-icon name="trash--line"></sc-icon>
        </div>
        <sc-link
          ?disabled=${this.disabled}
          @click=${this.handleOnClick}
          width=${this.buttonExpand ? '100%' : 'auto'}
          class="sc-button-top"
          >+ Add field</sc-link
        >`;
    } else if (this.position === POSITION.APPEND || !this.position) {
      return html` <sc-link
          ?disabled=${this.disabled}
          @click=${this.handleOnClick}
          width=${this.buttonExpand ? '100%' : 'auto'}
          class="sc-button-bottom"
          >+ Add field</sc-link
        >
        <div class="icon-container">
          <div class="slot-group"><slot></slot></div>
          <sc-icon name="trash--line"></sc-icon>
        </div>`;
    } else if (this.position === POSITION.STARTINGEMPTY) {
      return html`
        <sc-link
          ?disabled=${this.disabled}
          @click=${this.handleOnClick}
          width=${this.buttonExpand ? '100%' : 'auto'}
          class="sc-button-bottom"
          >+ Add field</sc-link
        >
        <div class="icon-container">
          <div class="slot-group"><slot></slot></div>
          <sc-icon name="trash--line"></sc-icon>
        </div>
      `;
    }
  }

  firstUpdated() {
    const randomString = generateUniqueId();
    const firstDiv: any = this.shadowRoot?.querySelector('.icon-container');
    firstDiv.id = randomString;
    firstDiv.setAttribute('container-index', 0);

    const iconElement = firstDiv?.querySelector('sc-icon');
    iconElement.value = randomString;

    const slot = firstDiv.querySelector('slot');
    const slottedElement = slot?.assignedElements();
    const slotGroup = firstDiv.querySelector('.slot-group');
    slottedElement?.map((element: any) => {
      slotGroup?.appendChild(element.cloneNode(true));
    });
    slot?.remove();
    firstDiv.addEventListener('sc-bubble-input', (e: any) => {
      this.handleScInputEvent(e, this.fieldValues);
    });
    this.firstDivElement = firstDiv.cloneNode(true);
    if (this.position === POSITION.STARTINGEMPTY) {
      const firstContainer: any =
        this.shadowRoot?.querySelector('.icon-container');
      if (firstContainer) {
        this.firstDivElement = firstContainer.cloneNode(true) as HTMLElement;
        firstContainer.remove();
      }
    }
  }

  instantiated() {
    const randomString = generateUniqueId();
    const firstDiv: any = this.shadowRoot?.querySelector('.icon-container');
    firstDiv.id = randomString;
    firstDiv.setAttribute('container-index', 0);

    const iconElement = firstDiv?.querySelector('sc-icon');
    iconElement.value = randomString;
    iconElement.addEventListener('click', (e: any) =>
      this.handleOnRemoved(e, randomString)
    );
    const slot = firstDiv.querySelector('slot');
    const slottedElement = slot?.assignedElements();
    const slotGroup = firstDiv.querySelector('.slot-group');
    slottedElement?.map((element: any) => {
      slotGroup?.appendChild(element.cloneNode(true));
    });
    slot?.remove();
    firstDiv.addEventListener('sc-bubble-input', (e: any) => {
      this.handleScInputEvent(e, this.fieldValues);
    });
    this.firstDivElement = firstDiv.cloneNode(true);
    if (this.position === POSITION.STARTINGEMPTY) {
      const firstContainer: any =
        this.shadowRoot?.querySelector('.icon-container');
      if (firstContainer) {
        this.firstDivElement = firstContainer.cloneNode(true) as HTMLElement;
        firstContainer.remove();
      }
    }
  }

  handleOnClick() {
    const randomString = generateUniqueId();
    const slotElement = this.shadowRoot?.querySelector('slot');
    const slottedElement = slotElement?.assignedElements();
    const textInputElement: any =
      this.shadowRoot?.querySelector('.icon-container');
    let clone: HTMLElement;
    if (textInputElement) {
      clone = textInputElement?.cloneNode(true) as HTMLElement;
    } else {
      clone = this.firstDivElement.cloneNode(true) as HTMLElement;
    }

    const iconCloneElement = clone.querySelector('sc-icon');
    const cloneScIcon = clone.querySelector('sc-icon');
    cloneScIcon?.setAttribute('value', randomString);

    const removeSlot = clone.querySelector('slot');
    const slotGroup: any = clone.querySelector('.slot-group');
    if (removeSlot) {
      removeSlot.remove();
    }

    slottedElement?.map(element => {
      slotGroup?.appendChild(element.cloneNode(true));
    });
    const parentDiv = slotGroup.parentNode;
    parentDiv.replaceChild(cloneScIcon, iconCloneElement);

    clone.id = randomString;
    clone.setAttribute('container-index', this.containers.length);

    cloneScIcon?.addEventListener('click', (e: any) =>
      this.handleOnRemoved(e, randomString)
    );
    clone.addEventListener('sc-bubble-input', (e: any) => {
      this.handleScInputEvent(e, this.fieldValues);
    });

    if (
      this.position === POSITION.APPEND ||
      this.position === POSITION.STARTINGEMPTY ||
      !this.position
    ) {
      this.shadowRoot?.append(clone as HTMLDivElement);
      this.emit('sc-duplication-add', {
        bubbles: true,
        detail: {
          element: clone.querySelector('.slot-group')?.childNodes,
          index: -2 +
          Array.prototype.findIndex.call(
            clone.parentNode?.children,
            (c: any) => c === clone
          ),
        },
      });
    }

    if (this.position === POSITION.PREPEND) {
      const scButtonElement: any = this.shadowRoot?.querySelector('sc-link');
      scButtonElement?.parentNode.insertBefore(clone, scButtonElement);
      this.emit('sc-duplication-add', {
        bubbles: true,
        detail: {
          element: clone.querySelector('.slot-group')?.childNodes,
          index: Array.prototype.findIndex.call(
            clone.parentNode?.children,
            (c: any) => c === clone
          ),
        },
      });
    }
  }

  removeFieldById(fieldId: string) {
    const fieldIndex = this.fieldValues.fields.findIndex((field: any) => {
      return field.id === fieldId;
    });

    if (fieldIndex > -1) {
      this.fieldValues.fields.splice(fieldIndex, 1);
      this.fieldValues.values.splice(fieldIndex, 1);
    }
  }

  handleOnRemoved(event: Event, randomString: any) {
    const target = event.target as HTMLElement;
    const divId = target.getAttribute('value');
    let indexToDelete: any[] = [];
    if (divId) {
      const parentDiv =
        this.shadowRoot?.getElementById(divId) ||
        this.shadowRoot?.querySelector(`[id='${divId}']`);
      if (parentDiv) {
        let deleteIndex = 0;

        if (this.position === POSITION.APPEND) {
          deleteIndex =
            Array.prototype.findIndex.call(
              parentDiv.parentNode?.children,
              (c: any) => c === parentDiv
            ) - 2;
          const slotGroup = target.parentNode?.querySelector('.slot-group');
          this.changeObject.fields = this.changeObject.fields.filter(
            (id: any, index: any) => {
              if (slotGroup?.contains(id)) {
                indexToDelete.push(index);
                delete this.changeObject.values[index];
              }
              return !slotGroup?.contains(id);
            }
          );
          indexToDelete.map(index => {
            delete this.changeObject.values[index];
          });
          this.changeObject.values = this.changeObject.values.filter(Boolean);
          indexToDelete = [];
        } else if (this.position === POSITION.PREPEND) {
          deleteIndex = Array.prototype.findIndex.call(
            parentDiv.parentNode?.children,
            (c: any) => c === parentDiv
          );
          const slotGroup = target.parentNode?.querySelector('.slot-group');
          this.changeObject.fields = this.changeObject.fields.filter(
            (id: any, index: any) => {
              if (slotGroup?.contains(id)) {
                indexToDelete.push(index);
                delete this.changeObject.values[index];
              }
              return !slotGroup?.contains(id);
            }
          );
          indexToDelete.map(index => {
            delete this.changeObject.values[index];
          });
          this.changeObject.values = this.changeObject.values.filter(Boolean);
          indexToDelete = [];
        }
        parentDiv.remove();
        this.removeFieldById(randomString);
        this.emit('sc-duplication-remove', {
          detail: {
            element: parentDiv.querySelector('.slot-group')?.childNodes,
            index: deleteIndex,
          },
          bubbles: true,
          composed: true,
        });
      }
    } else {
      const parentDiv = this.shadowRoot?.getElementById(randomString);

      let deleteIndex = 0;
      if (
        this.position === POSITION.APPEND &&
        parentDiv?.parentNode?.children
      ) {
        deleteIndex =
          Array.prototype.findIndex.call(
            parentDiv?.parentNode?.children,
            (c: any) => c === parentDiv
          ) - 1;
        const slotGroup = target.parentNode?.querySelector('.slot-group');

        this.changeObject.fields = this.changeObject.fields.filter(
          (id: any, index: any) => {
            if (slotGroup?.contains(id)) {
              indexToDelete.push(index);
              delete this.changeObject.values[index];
            }
            return !slotGroup?.contains(id);
          }
        );
        indexToDelete.map(index => {
          delete this.changeObject.values[index];
        });
        this.changeObject.values = this.changeObject.values.filter(Boolean);
        indexToDelete = [];
      } else if (
        this.position === POSITION.PREPEND &&
        parentDiv?.parentNode?.children
      ) {
        deleteIndex = Array.prototype.findIndex.call(
          parentDiv?.parentNode?.children,
          (c: any) => c === parentDiv
        );
        const slotGroup = target.parentNode?.querySelector('.slot-group');
        this.changeObject.fields = this.changeObject.fields.filter(
          (id: any, index: any) => {
            if (slotGroup?.contains(id)) {
              indexToDelete.push(index);
              delete this.changeObject.values[index];
            }
            return !slotGroup?.contains(id);
          }
        );
        indexToDelete.map(index => {
          delete this.changeObject.values[index];
        });
        this.changeObject.values = this.changeObject.values.filter(Boolean);
        indexToDelete = [];
      }
      this.removeFieldById(randomString);
      target.parentElement?.remove();
      this.emit('sc-duplication-remove', {
        detail: {
          element: parentDiv?.querySelector('.slot-group')?.childNodes,
          index: deleteIndex,
        },
        bubbles: true,
        composed: true,
      });
    }
    // Update all containers index
    this.containers.forEach((g: HTMLElement, index: number) => {
      g.setAttribute('container-index', String(index));
    });
  }

  clearContent() {
    const clearContainer: any =
      this.shadowRoot?.querySelectorAll('.icon-container');
    clearContainer.forEach((value: any, i: any) => {
      if (i !== 0) {
        value.remove();
      }
    });
  }
  
  getGroupParent(element: HTMLElement): any {
    if (element.parentElement) {
      if (element.parentElement.className.includes('icon-container')) {
        return element.parentElement;
      } else {
        return this.getGroupParent(element.parentElement);
      }
    }
    return null;
  }

  handleScInputEvent(event: any, fieldValues: any) {
    const target = event.target as HTMLInputElement;
    const inputId = target.id;
    const parentGroup = this.getGroupParent(target);
    if (parentGroup) {
      target.setAttribute('container-index', parentGroup.getAttribute('container-index'));
    }
    if (!inputId) {
      const idIndex = fieldValues.fields.findIndex((id: any) => {
        return id.id === event.currentTarget.id;
      });
      const elementIndex = this.changeObject.fields.findIndex((id: any) => {
        return id === event.target;
      });
      if (idIndex === -1) {
        fieldValues.fields.push({ id: event.currentTarget.id });
      }
      if (elementIndex === -1) {
        this.changeObject?.fields?.push(event.target);
      }
      const newIdIndex = fieldValues.fields.findIndex((id: any) => {
        return id.id === event.currentTarget.id;
      });
      const newElementIndex = this.changeObject?.fields?.findIndex(
        (id: any) => {
          return id === event.target;
        }
      );
      if (newIdIndex > -1) {
        fieldValues.values[newIdIndex] = { value: event.detail.value };
      } else {
        fieldValues.values.push({ value: event.detail.value });
      }

      if (newElementIndex > -1) {
        this.changeObject.values[newElementIndex] = {
          value: event.detail.value,
        };
      } else {
        this.changeObject.values.push({ value: event.detail.value });
      }
    }
  }

  handleScChangeEvent = () => {
    this.emit('sc-change', {
      detail: this.changeObject,
      bubbles: true,
      composed: true,
    });
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('sc-bubble-input', this.handleScChangeEvent);
  }

  disconnectedCallback() {
    this.removeEventListener('sc-bubble-input', this.handleScChangeEvent);
  }

  render() {
    return html` ${this.renderInput()} ${this.renderCustomStyle()} `;
  }
}
