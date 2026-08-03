import { LitElement, PropertyValueMap, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import ScTheme from '../../styles/ScTheme.js';
import ScAnnotationStyle from './Annotation.style.js';


export class Annotation extends LitElement {

  static styles = ScTheme.getStyles().concat([ScAnnotationStyle]);

  @property({ attribute: false })
    left: number;

  @property({ attribute: false })
    top: number;

  @property({ attribute: false })
    width: number;

  @property({ attribute: false })
    height: number;

  @property({ attribute: false })
    title: string;

  @query('#annotation')
    annotationDom: HTMLElement;

  protected updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    if (changedProperties.has('title')) {
      const el = this.annotationDom;
      el.setAttribute('part', '');
      el.animate && el.animate([
        { transform: 'scaleX(0)' },
        { transform: 'scaleX(1)' },
      ], {
        duration: 500,
        iterations: 1,
      });
      setTimeout(() => {
        el.setAttribute('part', 'highlight');
      }, 501);

    }
  }




  protected render() {
    return html`
    <div part="highlight" 
      style="left:${this.left}px; top:${this.top}px; width:${this.width}px; height:${this.height}px;" 
      class="annotation" id="annotation"
      title="${this.title}">
    </div>`;
  }
}