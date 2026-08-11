import { css, html } from "lit";
import { property } from "lit/decorators.js";
import { customElement } from "../../shared/custom-element.js";
import ScElement from "../../shared/sc-element.js";
import ScTheme from "../../styles/ScTheme.js";

@customElement("sc-slider-stop")
export class ScSliderStop extends ScElement {
  static styles = ScTheme.getStyles().concat([
    css`
      :host {
        display: inline-block;
        text-align: center;
        font-size: 0.75rem;
        line-height: 1rem;
        position: absolute;
        transform: translateX(-50%);
        white-space: nowrap;
        min-width: 1.25rem;
      }
      :host(:first-child) {
        text-align: left;
        transform: translateX(-0.625rem);
      }
      :host(:last-child) {
        text-align: right;
        transform: translateX(calc(-100% + 0.625rem));
      }

      .wrap {
        position: relative;
        padding-top: 1.5rem;

        :host([truncate]) & {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .divider {
        display: block;
        width: 1px;
        height: 0.25rem;
        background-color: var(--sc-divider-color);
        position: absolute;
        top: 0.825rem;
        left: 50%;
      }

      :host(:first-child) .divider {
        left: 0.625rem;
      }
      :host(:last-child) .divider {
        left: calc(100% - 0.625rem);
      }
      :host(:first-child) .divider,
      :host(.middle-child) .divider,
      :host(:last-child) .divider {
        height: 0.5rem;
      }
    `,
  ]);

  @property() value: any;

  render() {
    return html`<div class="wrap">
      <span class="divider"></span>
      <slot></slot>
    </div>`;
  }
}
