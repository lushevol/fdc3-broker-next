import { html, css, LitElement } from 'lit';
import { state, property } from 'lit/decorators.js';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import type { RepeaterTemplate } from '../../../../models/Components/RepeaterTemplate.js';
import { watch } from '../../../utils/watch.js';
import { Component } from '../../../../models/Component.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';

type AllowedAny = any;

export type Constructor<T> = new (...args: AllowedAny[]) => T;

export type LitConstructor = Constructor<LitElement>;

export const RepeaterBaseMixin = (
  superClass: any
) => {
  class RepeaterMixinClass extends ComponentMixin(superClass) {
    static styles = css`
      .repeater-box {
        margin-bottom: 1rem;
        display: block;
        position: relative;
      }

      .delete-icon {
        color: var(--sc-color-red-500);
        position: absolute;
        top: 0.625rem;
        right: 0.625rem;
        z-index: 1;
        cursor: pointer;
      }
    `;

    @property({ type: Object }) component: Component;

    @state() _repeatTimes = 1;

    _editor = false;

    get originalComponents() {
      const { components } = this.component;
      return components?.filter((c: Component) => !c.repeatGroupIndex);
    }

    get emptyArr() {
      return new Array(this._repeatTimes).fill(null);
    }

    // @ts-ignore
    @watch('component')
    updateRepeatTimes() {
      if (this.component?.template?.repeatTimes > 1) {
        this._repeatTimes = this.component?.template?.repeatTimes;
      }
    }

    addNewGroup = () => {
      if (this._repeatTimes > 1) {
        let { components } = this.component;
        if (components && Array.isArray(components)) {
          components = components.concat(this.updateComponentsByIndex(this.originalComponents, this._repeatTimes - 1));
        }
        this.component.updateComponents(components);
      }
    };

    updateComponentsByIndex(components: Component[], index: number) {
      if (components && Array.isArray(components) && index > 0) {
        return components.map((c: Component) => {
          const _c = Component.from(c);
          _c.id = `${c.id}_${index}`;
          _c.repeatGroupIndex = index;
          return _c;
        });
      }
      return components;
    }

    getComponentsByIndex(index: number) {
      if (index === 0) return this.originalComponents;
      const { components } = this.component;
      return components?.filter((c: Component) => c.repeatGroupIndex === index);
    }

    renderDeleteIcon(index: number) {
      return index > 0 ? html`
        <span class='delete-icon' @click=${() => this.deleteGroup(index)}>
          <sc-icon name="trash--line" size="sm"></sc-icon>
        </span>
        ` : null;
    }
  }
  return RepeaterMixinClass as any;
};