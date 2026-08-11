import { html, nothing, PropertyValues } from 'lit';

import ScScriberStyle from './ScScriber.style.js';
import {
  customElement,
  property,
  query,
  queryAsync,
  state,
} from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';
import {
  Color,
  ETools,
  Thickness,
  Size,
  StyleBase,
} from './ScScriber.toolbar.util.js';
import { watch } from '../utils/watch.js';
import { ScTextInput } from '@scdevkit/webkit';
import type { ScRichTextEditorV2 } from '@scdevkit/webkit-rte/dist/src/components/ScRichTextEditor/ScRichTextEditorV2.js';
import { Drawing } from '../utils/drawing.js';
import { DrawText } from '../utils/drawText.js';
import ScElement from '../utils/ScElement.js';
import { Context } from 'svgcanvas';

export type ScribbleDataSource = {
  history: Drawing[];
  textHistory: DrawText[];
};

const toolbars = [
  'fontstyle',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'subscript',
  'superscript',
  'backcolor',
  'forecolor',
  'clear',
  'alignleft',
  'aligncenter',
  'alignright',
];

@customElement('sc-scriber')
export class ScScriber extends ScElement {
  static styles = [ScScriberStyle];

  @property({ type: Number, reflect: true }) scale = 1;
  @property({ type: Number, reflect: true }) rotation = 0;
  @property({ type: Boolean, reflect: true }) active = false;
  @query('.pallete-box') pallete: HTMLDivElement;
  @query('.eraser') eraser: HTMLDivElement;
  @query('.text-maker') textMaker: HTMLDivElement;
  @query('.text-maker sc-text-input') textMakerInput: ScTextInput;
  @query('.text-maker .editor') editor?: ScRichTextEditorV2 | null;
  @query('.canvas-wrap') canvasWrap: HTMLElement;
  @query('.scriber-root') scriberRoot: HTMLDivElement;
  
  @property({ type: Object }) layers: Partial<Record<ETools, Context>> = {};

  @property({ attribute: 'active-tool', reflect: true }) activeTool?: ETools;
  @state() toolbarStyles: Set<StyleBase<any>> = new Set();
  @state() textValue = '';
  @state() isExistedTextActived = false;

  ctx = new Context({ width: 1, height: 1 });
  width = 0;
  height = 0;

  isMoveingText = false;

  isDrawing = false;
  startX = -1;
  startY = -1;
  lastX = 0;
  lastY = 0;
  _lastSvgGrp?: SVGElement;
  @state() history: Drawing[] = [];
  @state() textHistory: DrawText[] = [];
  activeDrawing?: Drawing;
  activeDrawingText?: DrawText;

  /** Temp work around for rte perf issue. Does not render rte & other elements when sleeping */
  @state() initTextMode = false;
  /** true when not in viewport */
  isSleeping = false;
  /** true when the sizes needs to be synchronized */
  dirty = false;

  @watch(['isSleeping', 'activeTool'])
  handleSleepChange() {
    if (!this.isSleeping && this.activeTool === ETools.text && !this.initTextMode) 
      this.initTextMode = true;
    this.hidden = this.isSleeping;
    Object.values(this.layers).forEach(c => {
      c.getSvg().parentElement?.toggleAttribute('hidden', this.isSleeping);
    });
  }

  @watch('rotation')
  handleRotationChange() {
    Object.values(this.layers).forEach(c => {
      const classList = c.getSvg().parentElement?.classList;
      if (classList) {
        classList.toggle('rotate-90', this.rotation === 90);
        classList.toggle('rotate-180', this.rotation === 180);
        classList.toggle('rotate-270', this.rotation === 270);
      }
    });
  }

  addSvgLayer(tool: ETools, container: HTMLElement) {
    if (this.layers[tool]?.getSvg().parentElement !== container) {
      const ctx = this.layers[tool] ??= new Context({
        // ctx: this.ctx,
        width: 1,
        height: 1,
      });
      const svg = ctx.getSvg();
      svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
      while (container.hasChildNodes())
        container.lastChild?.remove();
      container.appendChild(svg);
      container.style.setProperty('width', `${this.width}px`);
      container.style.setProperty('height', `${this.height}px`);
    }
  }


  resize(width: number, height: number, left = 0) {
    this.width = width;
    this.height = height;
    this.style.setProperty('--sc-scale-width', `${width}px`);
    this.style.setProperty('--sc-scale-height', `${height}px`);
    this.style.setProperty('--sc-scale-left', `${left}px`);

    [this.ctx, ...Object.values(this.layers)].forEach(c => {
      const svg = c.getSvg();
      const wrap = svg.parentElement;
      wrap?.style.setProperty('width', `${width}px`);
      wrap?.style.setProperty('height', `${height}px`);
    });

    // if (!this.isSleeping) {
      this.dirty = true;
    //   this.sync();
    // }
  }

  async sync() {
    this.hasUpdated || await this.updateComplete;
    if (!this.dirty) return;

    const { width, height } = this;
    if (width !== this.ctx.width || height !== this.ctx.height) {
      [this.ctx, ...Object.values(this.layers)].forEach(ctx => {
        ctx.width = width;
        ctx.height = height;
        const svg = ctx.getSvg();
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      });
    }
    this.dirty = false;
    this.refreshCanvas();
  }

  resetCanvas() {
    [this.ctx, ...Object.values(this.layers)].forEach(c => {
      c.fillStyle = 'transparent';
      c.strokeStyle = '#000000';
      c.lineWidth = 1;
      c.lineCap = 'round';
      c.lineJoin = 'round';
    });
  }


  public setTool(tool: ETools) {
    this.activeTool = tool;
    this.canvasWrap.classList.toggle('eraser', this.activeTool === ETools.eraser);
    this.eraser.style.display =
      this.activeTool === ETools.eraser ? 'block' : 'none';
    this.hideTextMaker();
    this.resetDrawingTextState();
  }
  public setToolStyle(toolStyle: StyleBase<any>) {
    this.toolbarStyles = new Set([...this.toolbarStyles, toolStyle]);
    this.hideTextMaker();
    this.resetDrawingTextState();
  }

  @watch(['history', 'textHistory'], { waitUntilFirstUpdate: true })
  handleHistoryChange() {
    this.emit('sc-history-change', {
      composed: true,
    });
  }

  @watch(['toolbarStyles', 'activeTool', 'active'])
  handleToolbarStylesChange() {
    if (!this.active) {
      return;
    }
    this.resetCanvas();
    this.toolbarStyles.forEach(style => {
      if (style.isActive(this.activeTool)) {
        const configuration = style.configurations.get(ETools.pen);
        const ctx = this.getCtxFor(this.activeTool);
        if (configuration) {
          if (style instanceof Color) {
            ctx.strokeStyle = configuration;
          }
          if (style instanceof Thickness) {
            ctx.lineWidth = configuration;
          }
        } else {
          if (style instanceof Color) {
            ctx.strokeStyle = style.getDefaultValue();
          }
          if (style instanceof Thickness) {
            ctx.lineWidth = style.getDefaultValue();
          }
        }
      }
    });
    
    this.canvasWrap.classList.toggle(
      'drawing',
      this.activeTool &&
        [
          ETools.pen,
          ETools.arrow,
          ETools.line,
          ETools.rectangle,
          ETools.circle,
        ].includes(this.activeTool)
    );
  }

  getCtxFor(tool?: ETools) {
    return (tool && this.layers[tool]) ?? this.ctx;
  }

  drawArrow(fromX: number, fromY: number, toX: number, toY: number) {
    const headLength = 15;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    const ctx = this.getCtxFor(ETools.arrow);
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  }
  handleDragStart = () => false;
  handlePointerDown = (e: PointerEvent) => {
    const s = this.scale;
    e.preventDefault();

    this.isDrawing = true;
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    // pen
    this.lastX = e.offsetX;
    this.lastY = e.offsetY;
    
    const ctx = this.getCtxFor(this.activeTool);

    if (
      this.activeTool &&
      [ETools.line, ETools.rectangle, ETools.circle, ETools.arrow].includes(
        this.activeTool
      )
    ) {
      // this.snapshot = this.ctx.getSvg().querySelector('g')?.cloneNode(true) as SVGElement;
      // this.snapshot = this.ctx.getImageData(
      //   0,
      //   0,
      //   this.canvas.width,
      //   this.canvas.height
      // );
    }
    if (ETools.pen === this.activeTool) {
      ctx.beginPath();
      ctx.moveTo(this.lastX, this.lastY);
      this.activeDrawing = new Drawing(ctx, this.activeTool, {
        color: ctx.strokeStyle,
        size: ctx.lineWidth,
        points: [{ x: this.lastX / s, y: this.lastY / s }],
      });
      this.activeDrawing.prepare();
    }
    if (ETools.eraser === this.activeTool) {
      this.eraseAtPosition(this.lastX, this.lastY);
    }
    if (ETools.text === this.activeTool) {
      if (this.isExistedTextActived) {
        this.makeTextInputBlur();
        this.isExistedTextActived = false;
      }
      const clickedText = this.textHistory.find(text =>
        text.contains(this.startX / s, this.startY / s)
      );
      if (clickedText) {
        this.textMaker.style.setProperty('display', 'block');
        const x =
          clickedText.x + this.textMaker.offsetWidth / 2 - 10;
        const y = clickedText.y + 3;
        this.isExistedTextActived = true;
        this.textMaker.style.setProperty('left', `${x}px`);
        this.textMaker.style.setProperty('top', `${y}px`);

        this.makeTextInputFocus();
        this.textValue = clickedText.content;
        this.activeDrawingText = clickedText;
        return;
      }

      if (!this.getIsDrawingTextReady()) {
        this.textMaker.style.setProperty('display', 'block');
        const x =
          this.startX + this.textMaker.offsetWidth / 2 - 10;
        const y = this.startY + 3;
        this.textMaker.style.setProperty('left', `${x}px`);
        this.textMaker.style.setProperty('top', `${y}px`);

        this.makeTextInputFocus();
        this.isDrawing = false;
        this.activeDrawingText = new DrawText(
          this.ctx,
          this.startX / s,
          this.startY / s,
          '',
          this.ctx.strokeStyle as string,
          // this.ctx.lineWidth
          4
        );
      } else {
        this.makeTextInputBlur();
      }
    }
  };

  handleTextBoxBlur() {
    this.handleTextBlur();
  }

  makeTextInputBlur() {
    setTimeout(() => {
      this.textMakerInput.shadowRoot?.querySelector('input')?.focus();
    }, 16);
  }
  makeTextInputFocus() {
    setTimeout(() => {
      this.editor?.editorInstance?.focus();
    }, 20);
  }

  getIsDrawingTextReady() {
    return this.activeDrawingText && this.textValue.trim();
  }
  hideTextMaker() {
    if (this.textMaker) {
      this.textMaker.style.setProperty('left', '-100px');
      this.textMaker.style.setProperty('top', '-100px');
      this.textMaker.style.setProperty('display', 'none');
    }
  }
  resetDrawingTextState() {
    this.activeDrawingText = undefined;
    this.textValue = '';
    this.editor?.editorInstance?.setContent(this.textValue);
  }
  handleTextBlur = () => {
    if (this.activeDrawingText && this.textValue.trim()) {
      this.activeDrawingText.content = this.textValue;
      if (!this.textHistory.includes(this.activeDrawingText)) {
        this.textHistory = [...this.textHistory, this.activeDrawingText];

        const textDrawing = new Drawing(this.ctx, ETools.text, {
          color: this.activeDrawingText.color,
          size: this.activeDrawingText.size,
          content: this.activeDrawingText.content,
          x: this.activeDrawingText.x,
          y: this.activeDrawingText.y,
        });
        textDrawing.id = this.activeDrawingText.id;
        this.history = [...this.history, textDrawing];
      }
      this.refreshCanvas();
    }
    if (this.isExistedTextActived) {
    } else {
      this.hideTextMaker();
      this.resetDrawingTextState();
    }
  };
  refreshCanvas() {
    if (this.isSleeping) return void(this.dirty = true);
    // scaling might miss some when scaling down
    Object.values(this.layers).forEach(c => c.__clearCanvas());
    [this.ctx, ...Object.values(this.layers)].forEach(c => {
      c.save();
      const { width, height } = c.canvas;
      c.clearRect(0, 0, width, height);
      c.resetTransform();
      // c.translate(width / 2, height / 2);
      // c.rotate((this.rotate * Math.PI) / 180);
      // if (this.rotate % 180 !== 0)
      //   c.translate(-height / 2, -width / 2);
      // else
      //   c.translate(-width / 2, -height / 2);
      c.scale(this.scale, this.scale);
    });

    this.history.forEach(drawing => drawing.draw());
    this.textHistory.forEach(drawing => drawing.draw());
    
    [this.ctx, ...Object.values(this.layers)].forEach(c => {
      c.restore();
    });
  }
  eraseAtPosition(x: number, y: number) {
    let erased = false;
    const size = this.getEraserSize();
    for (let i = this.history.length - 1; i >= 0; i--) {
      const drawing = this.history[i];
      if (drawing.isErased(x, y, size)) {
        this.history = this.history.filter((_, index) => index !== i);
        erased = true;
      }
    }
    if (erased) {
      this.refreshCanvas();
    }
  }
  eraseAlongPath(startX: number, startY: number, endX: number, endY: number) {
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const size = this.getEraserSize();
    const steps = Math.ceil(distance / (size / 2));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = startX + dx * t;
      const y = startY + dy * t;
      this.eraseAtPosition(x, y);
    }
  }
  handlePointerMove = (e: PointerEvent) => {
    const s = this.scale;
    const currentX = e.offsetX;
    const currentY = e.offsetY;
    this.updateEraser(e.offsetX, e.offsetY);
    if (!this.isDrawing) {
      return;
    }
    const ctx = this.getCtxFor(this.activeTool);
    switch (this.activeTool) {
      case ETools.pen:
      case ETools.highlightRect:
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        if (this.activeDrawing) {
          this.activeDrawing.data.points.push({ x: currentX / s, y: currentY / s });
        }
        break;
      case ETools.eraser:
        this.eraseAlongPath(this.lastX / s, this.lastY / s, currentX / s, currentY / s);
        this.lastX = currentX;
        this.lastY = currentY;
        break;
      case ETools.line:
      case ETools.rectangle:
      case ETools.circle:
      case ETools.arrow:
        if (this._lastSvgGrp) {
          this._lastSvgGrp.remove();
          this._lastSvgGrp = undefined;
          // ctx.getSvg().replaceChildren(this.snapshot);
          // ctx.__groupStack = [this.snapshot as SVGGElement];
          // ctx.__currentElement = this.snapshot as SVGElement;
        }
        ctx.save();
        // ctx.putImageData?.(this.snapshot, 0, 0);
        ctx.beginPath();
        if (this.activeTool === ETools.line) {
          ctx.moveTo(this.startX, this.startY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
          this.activeDrawing = new Drawing(ctx, ETools.line, {
            color: ctx.strokeStyle,
            size: ctx.lineWidth,
            startX: this.startX / s,
            startY: this.startY / s,
            endX: currentX / s,
            endY: currentY / s,
          });
        }
        if (this.activeTool === ETools.rectangle) {
          const width = Math.abs(currentX - this.startX);
          const height = Math.abs(currentY - this.startY);
          ctx.strokeRect(
            Math.min(this.startX, currentX),
            Math.min(this.startY, currentY),
            width,
            height
          );
          this.activeDrawing = new Drawing(ctx, ETools.rectangle, {
            color: ctx.strokeStyle,
            size: ctx.lineWidth,
            startX: Math.min(this.startX, currentX) / s,
            startY: Math.min(this.startY, currentY) / s,
            endX: Math.max(this.startX, currentX) / s,
            endY: Math.max(this.startY, currentY) / s,
          });
        }
        if (this.activeTool === ETools.arrow) {
          this.drawArrow(this.startX, this.startY, currentX, currentY);
          this.activeDrawing = new Drawing(ctx, ETools.arrow, {
            color: ctx.strokeStyle,
            size: ctx.lineWidth,
            startX: this.startX / s,
            startY: this.startY / s,
            endX: currentX / s,
            endY: currentY / s,
          });
        }
        if (this.activeTool === ETools.circle) {
          const radius = Math.sqrt(
            Math.pow(currentX - this.startX, 2) +
              Math.pow(currentY - this.startY, 2)
          );
          ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
          ctx.stroke();
          this.activeDrawing = new Drawing(ctx, ETools.circle, {
            color: ctx.strokeStyle,
            size: ctx.lineWidth,
            startX: this.startX / s,
            startY: this.startY / s,
            endX: currentX / s,
            endY: currentY / s,
          });
        }
        ctx.closePath();
        const g = (ctx as any).__closestGroupOrSvg() as SVGElement;
        if (g?.tagName === 'g') this._lastSvgGrp = g;
        ctx.restore();
        break;
    }
  };
  handlePointerup = () => {
    this.isDrawing = false;
    const ctx = this.getCtxFor(this.activeTool);
    if (ETools.pen === this.activeTool) {
      ctx.closePath();
      if (this.activeDrawing && this.activeDrawing.data.points.length > 1) {
        this.history = [...this.history, this.activeDrawing];
      }
      this.activeDrawing?.postCleanup?.();
      this.activeDrawing = undefined;
    }
    if (
      this.activeTool &&
      [ETools.arrow, ETools.circle, ETools.line, ETools.rectangle].includes(
        this.activeTool
      )
    ) {
      if (this.activeDrawing) {
        this.history = [...this.history, this.activeDrawing];
      }
      this.activeDrawing?.postCleanup?.();
      this.activeDrawing = undefined;
    }
    this._lastSvgGrp = undefined;
  };
  getEraserSize() {
    let size = 20;
    this.toolbarStyles.forEach(style => {
      if (style instanceof Size) {
        size = style.configurations.get(ETools.pen) ?? style.getDefaultValue();
      }
    });
    return size;
  }

  updateEraser(x: number, y: number) {
    if (this.activeTool !== ETools.eraser) {
      return;
    }
    const size = this.getEraserSize();
    this.eraser.style.setProperty('width', `${size}px`);
    this.eraser.style.setProperty('height', `${size}px`);
    this.eraser.style.setProperty('left', `${x}px`);
    this.eraser.style.setProperty('top', `${y}px`);
  }

  handleInput(e: CustomEvent) {
    this.textValue = e.detail.text;
  }
  handleDeleteText() {
    this.textHistory = this.textHistory.filter(
      item => item.id !== this.activeDrawingText?.id
    );
    this.history = this.history.filter(
      item => item.id !== this.activeDrawingText?.id
    );
    this.refreshCanvas();

    this.hideTextMaker();
    this.resetDrawingTextState();
  }
  handleTextDown(e: PointerEvent) {
    const target = e.target as HTMLElement;
    let isMovement = false;
    let currentElement: HTMLElement | null = target;
    while (currentElement) {
      if (currentElement.classList.contains('movement')) {
        isMovement = true;
        break;
      }
      currentElement = currentElement.parentElement;
    }
    if (this.activeTool === ETools.text && isMovement) {
      this.isMoveingText = true;
      e.stopPropagation();
      this.scriberRoot.setPointerCapture(e.pointerId);
    }
  }
  handleTextMove(e: PointerEvent) {
    if (this.activeTool === ETools.text) {
      const offsetX = e.offsetX / this.scale;
      const offsetY = e.offsetY / this.scale;
      if (this.isMoveingText && this.activeDrawingText) {
        const x =
          (offsetX + this.textMaker.offsetWidth / this.scale / 2 - 10) *
          this.scale;
        const y = (offsetY + 3) * this.scale;
        const textMakerWidth = this.textMaker.offsetWidth / this.scale / 2;
        const textMakerHeight = this.textMaker.offsetHeight / 2;
        const newX = Math.max(
          textMakerWidth,
          Math.min(x, this.scriberRoot.offsetWidth - textMakerWidth)
        );
        const newY = Math.max(
          textMakerHeight,
          Math.min(y, this.scriberRoot.offsetHeight - textMakerHeight)
        );

        const newTextX = Math.max(
          textMakerWidth,
          Math.min(offsetX + 14, this.scriberRoot.offsetWidth - textMakerWidth)
        );
        const newTextY = Math.max(
          textMakerHeight,
          Math.min(offsetY, this.scriberRoot.offsetHeight - textMakerHeight)
        );

        this.textMaker.style.setProperty('left', `${newX}px`);
        this.textMaker.style.setProperty('top', `${newY}px`);
        this.history = this.history.map(item => {
          if (item.id === this.activeDrawingText?.id) {
            item.data.x = newTextX;
            item.data.y = newTextY;
          }
          return item;
        });
        this.textHistory = this.textHistory.map(item => {
          if (item.id === this.activeDrawingText?.id) {
            item.x = newTextX;
            item.y = newTextY;
          }
          return item;
        });
        this.refreshCanvas();
      }
    }
  }
  handleTextup() {
    if (this.activeTool === ETools.text) {
      if (this.isMoveingText) {
        this.isMoveingText = false;
        this.makeTextInputFocus();
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    
    const svg = this.ctx.getSvg();
    svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);

    this.updateComplete.then(() => {
      this.canvasWrap.appendChild(svg);
    });
  }

  render() {
    return html`
      <div
        class="scriber-root"
        @pointermove=${this.handleTextMove}
        @pointerup=${this.handleTextup}
      >
        <div class="eraser"></div>
        <div
          class=${classMap({
            'text-maker': true,
            'text-maker-active': this.isExistedTextActived,
          })}
        >
          <div class="text-maker-box" @pointerdown=${this.handleTextDown}>
          ${!this.isSleeping && this.initTextMode ? html`
            <div class="movement">
              <sc-icon name="drag-handle" size="sm"></sc-icon>
            </div>
            <sc-text-input
              @focus=${this.handleTextBoxBlur}
              style="position: absolute;z-index: -1; opacity: 0;"
            >
            </sc-text-input>
            <sc-rich-text-editor-v2
              .extConfig=${{ height: '80px' }}
              class="editor"
              @sc-change=${this.handleInput}
              .value=${this.textValue}
              scrollbar-size="sm"
              .toolbar=${toolbars}
            >
            </sc-rich-text-editor-v2>

            <sc-icon
              style="color: var(--sc-color-red-500);transform: translateY(4px);"
              name="trash--line"
              size="sm"
              @click=${this.handleDeleteText}
              @pointerdown=${(e: PointerEvent) => e.stopPropagation()}
            ></sc-icon>
          ` : nothing}
          </div>
        </div>
        <div class="canvas-wrap"
          @dragstart=${this.handleDragStart}
          @pointerdown=${this.handlePointerDown}
          @pointermove=${this.handlePointerMove}
          @pointerup=${this.handlePointerup}
          @pointerout=${this.handlePointerup}
        >
        </div>
      </div>
    `;
  }
}
