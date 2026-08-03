import { HTMLTemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { isTemplateResult } from 'lit/directive-helpers.js';

import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import FileIconStyles from './FileIconStyles.js';
import FileIconPaths from './FileIconPaths.js';
import { HexToHSL } from './ColorConvert.js';
import { watch } from '../../shared/watch.js';
import { ICON_SIZE } from '../ScIcon/IconBase.js';
import { sanitizeHTML } from '../../shared/trusted-types-policy.js';

type SVGResult = HTMLTemplateResult | SVGSVGElement | null;
let parser: DOMParser;

const VIEW_BOX = {
  WIDTH: 48,
  HEIGHT: 48,
};

const ICON = {
  WIDTH: 40,
  HEIGHT: VIEW_BOX.HEIGHT,
  X_OFFSET: 4,
};

const FOLD = {
  HEIGHT: 12,
};

const LABEL_HEIGHT = 14;

export class ScColorFileIcon extends ScElement {

  static styles = ScTheme.getStyles();

  @state() private svg: SVGElement | HTMLTemplateResult | null = null;

  @property({ type: String }) name = '';

  @property({ type: String }) ext = '';

  @property({ type: ICON_SIZE }) size = 'xxl';

  private initialRender = false;

  firstUpdated() {
    this.initialRender = true;
    this.setSVG();
  }

  getExtension() {
    let extension;
    if (this.ext && this.ext.toLowerCase() in FileIconStyles) {
      extension = this.ext;
    } else if (
      this.name &&
      this.name.lastIndexOf('.') > -1 &&
      this.name.lastIndexOf('.') < this.name.length - 1
    ) {
      const fileExt = this.name
        .substring(this.name.lastIndexOf('.') + 1)
        .toLowerCase();
      if (fileExt in FileIconStyles) {
        extension = fileExt;
      }
    }
    return extension;
  }

  get iconSize() {
    let size;
    switch (this.size) {
      case 'xxl':
        size = '40px';
        break;
      case 'xl':
        size = '28px';
        break;
      case 'lg':
        size = '24px';
        break;
      case 'md':
        size = '20px';
        break;
      case 'xs':
        size = '14px';
        break;
      case 'xxs':
        size = '12px';
        break;
      default:
        size = '16px';
        break;
    }
    return size;
  }

  getIconStyles(extension: any) {
    let styles = {
      color: '#F5F5F5',
      fold: true,
      foldColor: undefined,
      glyphColor: undefined,
      gradientColor: '#FFFFFF',
      gradientOpacity: 0.25,
      labelColor: undefined,
      labelTextColor: '#FFFFFF',
      labelUppercase: false,
      radius: 4,
      size: undefined,
      type: undefined,
    };
    if (extension && extension.toLowerCase() in FileIconStyles) {
      styles = {
        ...styles,
        // @ts-ignore
        ...FileIconStyles[extension.toLowerCase()],
        labelUppercase: true,
      };
    }
    return styles;
  }

  getDarkenColor(color: string, ratio: number) {
    const hslColor = HexToHSL(color);
    hslColor.l = hslColor.l * (1 - ratio);
    return `hsl(${hslColor.h}, ${hslColor.s * 100}%, ${Number(hslColor.l * 100).toFixed(1)}%)`;
  }

  /** Resulting SVG element or an appropriate error symbol. */
  resolveIcon(svgData: string): SVGResult {
    try {
      const div = document.createElement('div');
      div.innerHTML = sanitizeHTML(svgData);

      const svg = div.firstElementChild;
      if (svg?.tagName?.toLowerCase() !== 'svg') return null;

      if (!parser) parser = new DOMParser();
      const doc = parser.parseFromString(svg.outerHTML, 'text/html');

      const svgEl = doc.body.querySelector('svg');
      if (!svgEl) return null;

      svgEl.part.add('svg');
      return document.adoptNode(svgEl);
    } catch {
      return null;
    }
  }

  generateSVG() {
    const UNIQUE_ID = 1;
    const extension = this.getExtension();
    const styles = this.getIconStyles(extension);
    return `
      <svg
        viewBox='0 0 ${VIEW_BOX.WIDTH} ${VIEW_BOX.HEIGHT}'
        width='${this.iconSize}'
        height='${this.iconSize}'
      >
        <defs>
          <clipPath id='pageRadius${UNIQUE_ID}'>
            <rect
              x='${ICON.X_OFFSET}'
              y="0"
              rx='${styles.radius}'
              ry='${styles.radius}'
              width='${ICON.WIDTH}'
              height='${ICON.HEIGHT}'
            ></rect>
          </clipPath>

          <clipPath id="foldCrop">
            <rect
              width='${ICON.WIDTH}'
              height='${FOLD.HEIGHT}'
              transform='rotate(-45 0 ${FOLD.HEIGHT})'
            ></rect>
          </clipPath>
          <linearGradient
            x1="100%"
            y1="0%"
            y2="100%"
            id='pageGradient${UNIQUE_ID}'
          >
            <stop
              stop-color=${styles.gradientColor}
              stop-opacity=${styles.gradientOpacity}
              offset="0%"
            ></stop>
            <stop stop-color=${styles.gradientColor} stop-opacity="0" offset="66.67%" ></stop>
          </linearGradient>
        </defs>

        <g id="file" clip-path='url(#pageRadius${UNIQUE_ID})'>
          ${styles.fold ? (`
            <path
              d='M${ICON.X_OFFSET} 0 h ${
      ICON.WIDTH - FOLD.HEIGHT
    } L ${ICON.WIDTH + ICON.X_OFFSET} ${FOLD.HEIGHT} v ${ICON.HEIGHT - FOLD.HEIGHT} H ${ICON.X_OFFSET} Z'
              fill='${styles.color}'
            ></path>
            <path
              d='M${ICON.X_OFFSET} 0 h ${
      ICON.WIDTH - FOLD.HEIGHT
    } L ${ICON.WIDTH + ICON.X_OFFSET} ${FOLD.HEIGHT} v ${ICON.HEIGHT - FOLD.HEIGHT} H ${ICON.X_OFFSET} Z'
              fill='url(#pageGradient${UNIQUE_ID})'
            ></path>
          `) : (`
            <rect
              x='${ICON.X_OFFSET}'
              y="0"
              width='${ICON.WIDTH}'
              height='${ICON.HEIGHT}'
              fill='${styles.color}'
            ></rect>
            <rect
              x='${ICON.X_OFFSET}'
              y="0"
              width='${ICON.WIDTH}'
              height='${ICON.HEIGHT}'
              fill='url(#pageGradient${UNIQUE_ID})'
            ></rect>
            `
  )}
        </g>

        ${styles.fold ? (`
          <g transform='translate(32 ${FOLD.HEIGHT}) rotate(-90)'>
            <rect
              width='${ICON.WIDTH}'
              height='${ICON.HEIGHT}'
              fill='${styles.foldColor || this.getDarkenColor(styles.color, 0.1)}'
              rx='${styles.radius}'
              ry='${styles.radius}'
              clip-path="url(#foldCrop)"
            ></rect>
          </g>`
  ) : null}

        ${extension ? (`
          <g id="label">
            <rect
              fill='${styles.labelColor || this.getDarkenColor(styles.color, 0.3)}'
              x='${ICON.X_OFFSET}'
              y='${ICON.HEIGHT - LABEL_HEIGHT}'
              width='${ICON.WIDTH}'
              height='${LABEL_HEIGHT}'
              clip-path='url(#pageRadius${UNIQUE_ID})'
            ></rect>
          </g>
          <g id="labelText" transform='translate(${ICON.X_OFFSET} 34)'>
            <text
              x='${ICON.WIDTH / 2}'
              y="10"
              font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
              font-size="9"
              fill='${styles.labelTextColor}'
              text-anchor="middle"
              style="font-weight: bold; text-align: center; pointer-events: none; 
              text-transform: ${styles.labelUppercase ? 'uppercase' : 'none'}; user-select: none"
            >
              ${extension}
            </text>
          </g>
        `) : null}

        ${styles.type ? (`
          <g
            transform='translate(0 ${!extension ? 6 : 0})'
            fill='${styles.glyphColor || this.getDarkenColor(styles.color, 0.15)}'
          >
            ${FileIconPaths[styles.type]}
          </g>
        `) : null}
      </svg>
    `;
  }

  @watch(['name', 'ext', 'size'], { waitUntilFirstUpdate: true })
  setSVG() {
    // If haven't rendered yet, exit. This avoids unnecessary work due to watching multiple props.
    if (!this.initialRender) {
      return;
    }

    const svgData = this.generateSVG();
    const svg = this.resolveIcon(svgData);

    if (isTemplateResult(svg)) {
      this.svg = svg;
      return;
    }

    if (svg) {
      this.svg = svg.cloneNode(true) as SVGElement;
      this.svg.classList.add('sc-file-icon');
    } else {
      this.svg = null;
    }
  }

  render() {
    return this.svg;
  }
}