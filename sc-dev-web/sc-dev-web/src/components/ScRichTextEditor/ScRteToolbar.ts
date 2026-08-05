/* eslint-disable indent */
import { html, css, LitElement } from "lit";
import { property, query, state } from "lit/decorators.js";
import { customElement } from "../../shared/custom-element.js";
import * as allFormatting from "./formats.js";
import { TViewContext, TConfiguration } from "./typeUtils.js";
import { watch } from "../../shared/watch.js";
import { fontBackColor, fontTextColor } from "./constant.js";
import { rgb2hex } from "./core/utils.js";
import "../../../elements/sc-toast.js";

@customElement("sc-rte-toolbar")
export class RTEToolbar extends LitElement {
  static styles = css`
    .rte-toolbar-container {
      padding: 10px 20px;
      border-radius: 12px;
      border: 1px solid var(--sc-rte-border-color);
      background: var(--sc-rte-bg-color);
      display: flex;
      flex-wrap: wrap;
    }
  `;

  @query("#fg-color") fgColorInput!: HTMLInputElement;
  @query("#bd-color") bdColorInput!: HTMLInputElement;

  @state()
  viewContext: TViewContext = {};

  @property({ type: Object })
  range: Range | null = null;

  @property({ type: Object })
  focusedElOfViewer: HTMLElement;

  @property({ type: Array }) toolbar: (keyof typeof allFormatting)[];

  @property({ type: Object, attribute: "configuration" })
  configuration: TConfiguration = {
    toolbar: {
      maxImageSize: 1024,
    },
  };

  constructor() {
    super();
    this.toolbar = Object.keys(allFormatting) as any;
  }

  connectedCallback(): void {
    super.connectedCallback();
    try {
      this.initialiseProperties();
    } catch (error) {
      console.log({ error });
    }
  }

  initialiseProperties() {
    const { toolbar } = this.configuration;
    this.viewContext["max-image-size"] = toolbar?.maxImageSize;
  }

  private getStyleTillNull(element: Element) {
    const bgcolor = "background-color";
    const color = "color";

    let node: ParentNode | Element | null = element;
    const styleInfo = {} as Record<any, any>;

    while (
      node &&
      node instanceof Element &&
      Object.keys(styleInfo).length < 2
    ) {
      const styles = window.getComputedStyle(node as Element) as Record<
        any,
        any
      >;

      const foundBgColor = fontBackColor.find(
        defined =>
          defined.value.toLowerCase() ===
          rgb2hex(styles[bgcolor])?.toLowerCase(),
      )?.value;
      const foundTextColor = fontTextColor.find(
        defined =>
          defined.value.toLowerCase() === rgb2hex(styles[color])?.toLowerCase(),
      )?.value;
      if (!styleInfo[bgcolor] && foundBgColor) {
        styleInfo[bgcolor] = foundBgColor;
      }
      if (!styleInfo[color] && foundTextColor) {
        styleInfo[color] = foundTextColor;
      }
      node = node.parentNode;
    }
    return styleInfo;
  }

  private getStyleInfo(element: Element) {
    const properties = [
      "font-family",
      "font-size",
      "text-align",
      "list-style-type",
      "line-height",
    ];

    const styles =
      element instanceof Element
        ? (window.getComputedStyle(element) as Record<any, any>)
        : {};
    let styleInfo = {} as Record<any, any>;
    properties.forEach(pro => {
      styleInfo[pro] = styles[pro];
    });
    styleInfo = {
      ...styleInfo,
      "font-bold": document.queryCommandState("bold") ? "bold" : "normal",
      "font-italic": document.queryCommandState("italic") ? "italic" : "normal",
      "font-underline": document.queryCommandState("underline")
        ? "underline"
        : "normal",
      "font-subscript": document.queryCommandState("subscript")
        ? "subscript"
        : "normal",
      "font-superscript": document.queryCommandState("superscript")
        ? "superscript"
        : "normal",
      "font-strikethrough": document.queryCommandState("strikethrough")
        ? "strikethrough"
        : "normal",
      "font-family":
        document.queryCommandValue("fontname") || styleInfo["font-family"],
      ...this.getStyleTillNull(element),
    };
    return styleInfo;
  }

  /**
   * calculate style from conteneditable
   */
  attachStyleInfo() {
    if (this.range) {
      const { startContainer } = this.range;
      let element: Element = startContainer as Node as Element;
      if (element.nodeType === Node.TEXT_NODE) {
        element = element.parentNode as Element;
      }
      this.viewContext = {
        ...this.viewContext,
        ...this.getStyleInfo(element),
      };
    }
  }

  attachActiveTag() {
    if (this.range) {
      const tags: string[] = [];
      let parentNode: Node | ParentNode | Element | null =
        this.range.startContainer;
      const checkNode = () => {
        const tag = (parentNode as Element)?.tagName?.toLowerCase()?.trim();
        if (tag) tags.push(tag);
      };
      while (parentNode !== null) {
        checkNode();
        parentNode = parentNode?.parentNode;
      }

      this.viewContext = {
        ...this.viewContext,
        "active-tags": tags,
      };
    }
  }
  @state() showToast = false;
  @state() toastText = "";
  /**
   * show toast when don't support execCommand
   */
  notSupportLog(text: string) {
    this.toastText = text;
    this.showToast = true;
  }

  onToastHide() {
    this.toastText = "";
    this.showToast = false;
  }

  @watch("range")
  onRangeChange() {
    if (this.range) {
      // Update dependencies accroding range
      this.attachStyleInfo();
      this.attachActiveTag();
    }
  }

  render() {
    return html`<div class="rte-toolbar-container">
        ${this.toolbar?.map(t => {
          if (allFormatting[t]) {
            return allFormatting[t](this.viewContext, this.focusedElOfViewer);
          }
          return null;
        })}
      </div>
      <sc-toast
        @sc-hide=${this.onToastHide}
        .open=${this.showToast}
        type="error"
        placement="top-right"
        duration="3000"
        title=""
      >
        ${this.toastText}
      </sc-toast>`;
  }
}
