import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { ScIconContext } from './ScIconContext.js';
import ScElement from '../../shared/sc-element.js';

export class ScIconConsumer extends ScElement {
  @consume({ context: ScIconContext, subscribe: true })
  @property({ attribute: false, reflect: true })
    iconLibraries: any;

  render() {
    return html`
      <slot></slot>
    `;
  }
}