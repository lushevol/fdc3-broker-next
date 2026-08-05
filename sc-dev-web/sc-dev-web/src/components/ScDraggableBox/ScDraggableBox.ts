import { property, query, state } from 'lit/decorators.js';
import ScElement from '../../shared/sc-element.js';
import { html, PropertyValues } from 'lit';
import ScTheme from '../../styles/ScTheme.js';
import ScDraggableBoxStyle from './ScDraggableBoxStyle.js';
import { drag } from '../../shared/drag.js';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';

interface positionProp {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
}
export class ScDraggableBox extends ScElement {
    
    static styles = ScTheme.getStyles().concat([ScDraggableBoxStyle]);

    @property({ type: Object }) position: positionProp;

    @property({ type: Number, attribute: 'z-index' }) zIndex = 900;

    @property({ type: Boolean }) draggable = true;

    @state() _position: positionProp = {};

    @state() boxDraggable = false;

    @query('.draggable-box') base: HTMLElement;

    protected firstUpdated(_changedProperties: PropertyValues): void {
        this._position = this.position;
    }

    disconnectedCallback(): void {
        this.allEventAllow();
    }

    allEventAllow() {
        if (document.body.style.pointerEvents !== 'auto') {
            document.body.style.pointerEvents = 'auto';
        }
    }

    allEventDisallow() {
        if (document.body.style.pointerEvents !== 'none') {
            document.body.style.pointerEvents = 'none';
        }
    }
   
    dragMove = (x:number,y:number,offsetX:number,offsetY:number) => {
        const left = this.base.getBoundingClientRect().left + x  - offsetX;
        const top = this.base.getBoundingClientRect().top + y - offsetY;
        const maxX = window.innerWidth - this.base.offsetWidth;
        const maxY = window.innerHeight - this.base.offsetHeight;
        this.base.style.cursor = 'grabbing';
        this._position = {
            left: `${Math.min(Math.max(0, left), maxX)  }px`,
            top: `${Math.min(Math.max(0, top), maxY)  }px`,
            bottom: '',
            right: '',
        } as positionProp;
    };

    private handleDrag(event: PointerEvent) {
        // event.preventDefault();
        if (!this.draggable) {
            return;
        }
        this.allEventDisallow();
        this.base.style.cursor = 'grabbing';
        this.boxDraggable = true;
        const offsetX = event.clientX - this.base.getBoundingClientRect().left;
        const offsetY = event.clientY - this.base.getBoundingClientRect().top;
        drag(this.base, {
          onMove: (x,y) => {
            this.dragMove(x,y,offsetX,offsetY);
          },
          onStop: () => {
            this.base.style.cursor = 'grab';
            this.boxDraggable = false;
            this.allEventAllow();
          },
          initialEvent: event,
        });
    }
    render() {
        return html`
        <div  
            draggable=${this.boxDraggable}
            class=${classMap({
                'draggable-box': true,
            })}
            style=${styleMap({
                zIndex: Number(`${ this.zIndex }`),
                ...(this._position?.right ? { right: `${this._position.right}` } : {}),
                ...(this._position?.left ? { left: `${this._position.left}` } : {}),
                ...(this._position?.top ? { top: `${this._position.top}` } : {}),
                ...(this._position?.bottom ? { bottom: `${this._position.bottom}` } : {}),
            })}
            @mousedown=${this.handleDrag}
            @touchstart=${this.handleDrag}
        >
            <slot></slot>
        </div>
        `;
    }
}

