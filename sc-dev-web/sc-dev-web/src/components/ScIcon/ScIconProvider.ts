import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { ScIconContext } from './ScIconContext.js';
import ScElement from '../../shared/sc-element.js';

export class ScIconProvider extends ScElement {
  @provide({ context: ScIconContext })
  @property()
    iconLibraries: any;

  render() {
    return html`
      <slot></slot>
    `;
  }
}