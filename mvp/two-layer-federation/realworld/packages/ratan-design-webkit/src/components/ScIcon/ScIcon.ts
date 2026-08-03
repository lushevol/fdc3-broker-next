import { html, HTMLTemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { isTemplateResult } from 'lit/directive-helpers.js';
import { ContextConsumer } from '@lit/context';

import { ScIconContext } from './ScIconContext.js';
import { watch } from '../../shared/watch.js';
import ScTheme from '../../styles/ScTheme.js';
import SystemIconLibrary from '../../assets/icons/SystemIconLibrary.js';
import FileIconLibrary from '../../assets/icons/FileIconLibrary.js';
import EditorIconLibrary from '../../assets/icons/EditorIconLibrary.js';
import DataGridIconLibrary from '../../assets/icons/DataGridIconLibrary.js';
import { IconBase } from './IconBase.js';
import { iconCache, libraryCache } from '../../shared/util.js';
import { sanitizeHTML, trustHTML } from '../../shared/trusted-types-policy.js';

const CATCHABLE_ERROR = Symbol();
const RETRYABLE_ERROR = Symbol();
export type SVGResult = HTMLTemplateResult | SVGSVGElement | typeof RETRYABLE_ERROR | typeof CATCHABLE_ERROR;
type IconLibraryResolver = (name: string) => string;
type IconLibraryMutator = (svg: SVGElement) => void;

interface IconLibrary {
  name: string;
  resolver: IconLibraryResolver;
  mutator?: IconLibraryMutator;
  spriteSheet?: boolean;
}

interface IconSource {
  url?: string;
  fromLibrary: boolean;
  library?: any;
}

export class ScIcon extends IconBase {

  static styles = ScTheme.getStyles();

  private initialRender = false;


  static parser: DOMParser;

  private iconConsumer: any;
  // @ts-ignore
  @state() private registry: IconLibrary[] = [SystemIconLibrary, FileIconLibrary, EditorIconLibrary, DataGridIconLibrary];

  @state() private svg: SVGElement | HTMLTemplateResult | null = null;

  /** The name of the icon to draw. Available names depend on the icon library being used. */
  @property({ type: String }) name = '';

  /** The name of a registered icon library. */
  @property({ type: String }) library = '';

  /** An alternate description to use for assistive devices.  */
  @property({ type: String }) label = '';

  /**
   * An external URL of an SVG file. Be sure you trust the content you are including, as it will be executed as code and
   * can result in XSS attacks.
   */
  @property() src?: string;

  @property({ attribute: false })
    iconLibraries: any;

  @property({ attribute: false })
    customSize: string;

  @watch('iconLibraries')
  registerLibrary() {
    if (this.iconLibraries) {
      this.iconLibraries.forEach((library: { name: any; resolver: any; mutator: any; }) => {
        this.registerIconLibrary({
          name: library.name,
          resolver: library.resolver,
          mutator: library.mutator,
        });
      });
    }
  }

  firstUpdated() {
    this.initialRender = true;
    this.setIcon();
    this.iconConsumer = new ContextConsumer(this,
      {
        context: ScIconContext,
        callback: value => {
          this.iconLibraries = value;
        },
        subscribe: true,
      }
    );
  }

  /** Returns a library from the registry. */
  getIconLibrary(param: any) {
    if (param.libraryName) {
      return this.registry.find(lib => lib.name === param.libraryName);
    } else if (param.iconName) {
      return this.registry.find(lib => lib.resolver(param.iconName));
    }
    return undefined;
  }

  /** Adds an icon library to the registry, or overrides an existing one. */
  registerIconLibrary(options: any) {
    const name = options.name || 'other';
    this.unregisterIconLibrary(name);
    this.registry.push({
      name,
      resolver: options.resolver,
      mutator: options.mutator,
      spriteSheet: options.spriteSheet,
    });

    if (this.library === options.name || !this.library) {
      this.setIcon();
    }
  }

  /** Removes an icon library from the registry. */
  unregisterIconLibrary(name: string) {
    this.registry = this.registry.filter(lib => lib.name !== name);
  }

  /** Resulting SVG element or an appropriate error symbol. */
  private static async resolveIcon(url: string, library?: IconLibrary): Promise<SVGResult> {
    let fileData: Response;

    if (library?.spriteSheet) {
      return html`<svg part="svg">
        <use part="use" href="${url}"></use>
      </svg>`;
    }

    let svgPromise = null;
    if (url.indexOf('data:image/svg+xml,') === 0) {
      const svgText = decodeURIComponent(url.substring('data:image/svg+xml,'.length));
      svgPromise = Promise.resolve(svgText);
    } else {
      try {
        fileData = await fetch(url, { mode: 'cors' });
        if (!fileData.ok) return fileData.status === 410 ? CATCHABLE_ERROR : RETRYABLE_ERROR;
        svgPromise = fileData.text();
      } catch {
        return RETRYABLE_ERROR;
      }
  
    }

    try {
      const div = document.createElement('div');
      div.innerHTML = sanitizeHTML(await svgPromise);

      const svg = div.firstElementChild;
      if (svg?.tagName?.toLowerCase() !== 'svg') return CATCHABLE_ERROR;

      if (!this.parser) this.parser = new DOMParser();
      const doc = this.parser.parseFromString(sanitizeHTML(svg.outerHTML), 'text/html');

      const svgEl = doc.body.querySelector('svg');
      if (!svgEl) return CATCHABLE_ERROR;

      svgEl.part.add('svg');
      return document.adoptNode(svgEl);
    } catch {
      return CATCHABLE_ERROR;
    }
  }

  private getIconSource(): IconSource {
    const key = this.library || this.name;
    const library = libraryCache.get(key) || this.getIconLibrary({ libraryName: this.library, iconName: this.name });
    if (!libraryCache.has(key)) {
      libraryCache.set(key, library);
    }
    if (this.name && library) {
      return {
        url: library.resolver(this.name),
        fromLibrary: true,
        library,
      };
    }

    return {
      url: this.src,
      fromLibrary: false,
    };
  }

  @watch('label')
  handleLabelChange() {
    const hasLabel = this.label.length > 0;

    if (hasLabel) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', this.label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }
  }

  @watch(['name', 'src', 'library'])
  async setIcon() {
    // If haven't rendered yet, exit. This avoids unnecessary work due to watching multiple props.
    if (!this.initialRender) {
      return;
    }
    const { url, library } = this.getIconSource();

    if (!url) {
      this.svg = null;
      return;
    }
    let iconResolver:any = iconCache.get(url);
    if (!iconResolver) {
      iconResolver = ScIcon.resolveIcon(url, library);
      iconCache.set(url, iconResolver);
    }

    const svg = await iconResolver;

    if (svg === RETRYABLE_ERROR) {
      iconCache.delete(url);
    }

    if (url !== this.getIconSource().url) {
      // If the url changed while fetching the icon, ignore this request
      return;
    }

    if (isTemplateResult(svg)) {
      this.svg = svg as any;
      return;
    }

    switch (svg) {
      case RETRYABLE_ERROR:
      case CATCHABLE_ERROR:
        this.svg = null;
        this.emit('sc-error');
        break;
      default:
        this.svg = svg.cloneNode(true) as SVGElement;
        library?.mutator?.(this.svg);
        this.emit('sc-load');
    }
  }

  renderIconStyle() {
    const size = this.getIconSize();

    const iconStyle = html`
      <style>
        :host {
          display: inline-flex;
        }
        .sc-icon::part(svg) {
          fill: currentColor;
        }
        .sc-icon svg .icon-main-shape {
          fill: currentColor;
        }
        .sc-icon svg .icon-secondary-shape {
          fill: var(--sc-icon-secondary-color, currentColor);
        }
      </style>
    `;

    const sizeStyle = html`
      <style>
        .sc-icon {
          display: inline-flex;
          align-items: center;
        }
        .sc-icon svg {
          width: ${this.customSize || size};
          height: ${this.customSize || size};
          padding: 0;
        }
      </style>
    `;
    return html` ${iconStyle} ${sizeStyle} `;
  }

  render() {
    return html`
      ${this.renderIconStyle()}
        <span class='sc-icon'>${this.svg}</span>
    `;
  }
}
