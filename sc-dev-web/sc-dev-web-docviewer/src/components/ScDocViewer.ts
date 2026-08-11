import * as docxPreview from 'docx-preview';

import * as pptxPreview from 'pptx-preview';

import xSpreadsheetStyle from '../utils/xDataSpreadsheet.style.js';
import highlightStyle from '../utils/highlight.style.js';
import highlightDarkStyle from '../utils/highlight.dark.style.js';
import ScDocViewerStyle from './ScDocViewer.style.js';

import { TemplateResult, html, nothing, render } from 'lit';
import { property, query, queryAsync, state } from 'lit/decorators.js';
import { ContextProvider } from '@lit/context';

import { extractMsg } from '../utils/msg/utils';
import { MessageHandler } from '../utils/msg/MessageHandler.js';
import './ScScriber.js';
import './ScFileTool.js';
import './ScExcelViewer.js';
// eslint-disable-next-line no-duplicate-imports
import { ScPDFViewer } from './ScPDFViewer.js';
// eslint-disable-next-line no-duplicate-imports
import { ScribbleDataSource, ScScriber } from './ScScriber.js';
// eslint-disable-next-line no-duplicate-imports
import { defaultToolConfig, ScFileTool, ToolConfig, ToolState } from './ScFileTool.js';
import {
  docxTypes,
  excelTypes,
  imgTypes,
  msgTypes,
  pdfTypes,
  pptxTypes,
  rotationAvailableTypes,
  scriberAvailableTypes,
  textLanguages,
  textTypes,
  videoTypes,
} from '../utils/filetypes.js';
import { styleMap } from 'lit/directives/style-map.js';
import { watch } from '../utils/watch.js';
import { Drawing } from '../utils/drawing.js';
import { DrawText } from '../utils/drawText.js';
import ScElement from '../utils/ScElement.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import hljs from 'highlight.js/lib/core';
// highlight language
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import go from 'highlight.js/lib/languages/go';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import xml from 'highlight.js/lib/languages/xml';
import ini from 'highlight.js/lib/languages/ini';
import plaintext from 'highlight.js/lib/languages/plaintext';
import markdown from 'highlight.js/lib/languages/markdown';

// @ts-ignore
import linenumber from 'highlightjs-line-numbers.js';
import { ref } from 'lit/directives/ref.js';
import { ETools } from './ScScriber.toolbar.util.js';
import { fileToolContext } from './contexts/file-tool-context.js';
import { debounce } from '../utils/debounce.js';

(window as any).hljs = hljs;
linenumber();

const widthSizeAdaptor = 10;
const excelWidthSizeAdaptor = 5;

const staticNames = [
  'javascript',
  'css',
  'python',
  'java',
  'go',
  'json',
  'yaml',
  'xml',
  'ini',
  'plaintext',
  'markdown',
];
[
  javascript,
  css,
  python,
  java,
  go,
  json,
  yaml,
  xml,
  ini,
  plaintext,
  markdown,
].forEach((language, index) => {
  hljs.registerLanguage(staticNames[index], language);
});

export class ScDocViewer extends ScElement {
  static styles = [
    ScDocViewerStyle,
    xSpreadsheetStyle,
    highlightStyle,
    highlightDarkStyle,
  ];

  @query('.viewer-container')
  viewerContainer: HTMLDivElement;
  @queryAsync('.real-dimension-box')
  realDimensionBox: HTMLDialogElement;
  @queryAsync('sc-pdf-viewer')
  pdfViewer: ScPDFViewer;
  @query('#viewer-root')
  viewerRoot: HTMLDivElement;
  /**
   * #viewer element
   */
  @queryAsync('#viewer') viewerBox: HTMLDivElement;
  @queryAsync('.rotation-box') rotationBox: HTMLDivElement;
  @queryAsync('sc-scriber') ScScriber: ScScriber;

  @query('sc-file-tool', true)
  fileTool: ScFileTool;
  #fileToolProvider = new ContextProvider(this, {
    context: fileToolContext,
    initialValue: undefined,
  });

  @property({ type: Object })
  file: any;
  @property({ type: Array })
  dataSource: ScribbleDataSource[];

  @property({ type: Number, attribute: 'page-number' }) pageNumber = 1;
  
  @property({ type: Object, attribute: 'tool-config' }) 
  toolConfig: ToolConfig = defaultToolConfig;

  previousRenderFile: any;

  @state() activeFileType?: string;
  @state() loadingFile = false;
  @state() excelPage = 0;

  /**
   * #viewer real size
   */
  originalDimension = { width: 0, height: 0 };

  messageHandler = new MessageHandler();

  @watch('file')
  handleFileChange() {
    if (this.file && this.file !== this.previousRenderFile) {
      this.excelPage = 0;
      this.previewFile(this.file);
    }
  }
  public getScribbleDataSource = async () => {
    const scribers = [];
    if (pdfTypes.includes(this.activeFileType ?? '')) {
      const pdfViewer = await this.pdfViewer;
      const pages = pdfViewer?.getPageInfo() ?? [];
      pages.forEach(page => {
        scribers.push(page.scriber);
      });
    } else {
      const ScScriber = await this.ScScriber;
      scribers.push(ScScriber);
    }

    return scribers.map(scriber => {
      return {
        history: scriber.history,
        textHistory: scriber.textHistory,
      };
    });
  };

  updateHistoryFor(scriber: ScScriber, dataSource: ScribbleDataSource) {
    const histories = dataSource?.history || [];
    const textHistories = dataSource?.textHistory || [];
    scriber.history = histories.map(history => {
      return new Drawing(
        scriber.getCtxFor(history.type),
        history.type,
        history.data,
        history.id
      );
    });
    scriber.textHistory = textHistories.map(text => {
      return new DrawText(
        scriber.ctx,
        text.x,
        text.y,
        text.content,
        text.color,
        text.size
      );
    });
  }
  public setScribbleDataSource = async (dataSource: ScribbleDataSource[]) => {
    const scribers = [];
    const isScribble = scriberAvailableTypes.includes(
      this.activeFileType ?? ''
    );
    if (!isScribble) {
      return;
    }

    if (pdfTypes.includes(this.activeFileType ?? '')) {
      const pdfViewer = await this.pdfViewer;
      const pages = pdfViewer?.getPageInfo() ?? [];
      pages.forEach((page, index) => {
        this.updateHistoryFor(page.scriber, dataSource[index]);
        scribers.push(page.scriber);
      });
    } else {
      const ScScriber = await this.ScScriber;
      this.updateHistoryFor(ScScriber, dataSource[0]);
      scribers.push(ScScriber);
    }
    scribers.forEach(scriber => {
      scriber.refreshCanvas();
    });
  };

  async updateOriginalDimension(width: number, height: number, force = false) {
    if (force) {
      const viewerBox = await this.viewerBox;
      viewerBox?.style?.setProperty('width', `${width}px`);
      viewerBox?.style?.setProperty('height', `${height}px`);
    }
    this.originalDimension.width = width;
    this.originalDimension.height = height;
  }

  async updateScriberScaleDimension(
    ScScriber: ScScriber,
    width: number,
    height: number,
    isPdf = false
  ) {
    const viewerRootRect = this.viewerRoot.getBoundingClientRect();
    const left = Math.max((viewerRootRect.width - width) / 2, 0);
    ScScriber.resize(width, height, isPdf ? 0 : left);
    ScScriber.sync();
  }
  async updateScriberScale(ScScriber: ScScriber, scale: number) {
    ScScriber.scale = scale;
  }
  async updateScriberRotate(rotate: number) {
    const ScScriber = await this.ScScriber;
    ScScriber.rotation = rotate;
  }
  showScriber(ScScriber: ScScriber, isActive: boolean) {
    ScScriber.active = isActive;
  }
  get getSizeAdaptor() {
    let size = widthSizeAdaptor;
    if (excelTypes.includes(this.activeFileType ?? '')) {
      size = excelWidthSizeAdaptor;
    }
    return size;
  }
  async afterRender() {
    await this.updateComplete;
    const viewerBox = await this.viewerBox;
    if (!viewerBox) {
      return;
    }
    if (this.dataSource && this.dataSource.length) {
      this.setScribbleDataSource(this.dataSource);
    }
    const isPlainFile = textTypes.includes(this.activeFileType ?? '');

    const rect = viewerBox.getBoundingClientRect();
    const viewerRootRect = this.viewerRoot.getBoundingClientRect();
    const width = this.clamp(
      rect.width - this.getSizeAdaptor,
      viewerRootRect.width - this.getSizeAdaptor,
      Infinity
    );
    const height = this.clamp(rect.height, viewerRootRect.height, Infinity);
    const ScScriber = await this.ScScriber;
    if (!isPlainFile && pdfTypes.includes(this.activeFileType ?? '')) {
      await this.updateOriginalDimension(width, height);
      await this.updateDimensionOfPdf();
      ScScriber.style.setProperty('display', 'none');
      this.showScriber(ScScriber, false);

    } else {
      await this.updateOriginalDimension(width, height, true);
      this.showScriber(ScScriber, true);
    }
    this.loadingFile = false;

    if (this.previousRenderFile !== this.file) {
      let zoom = 100;
      if (this.fileTool.initialZoom === 'auto') {
        if (docxTypes.includes(this.activeFileType ?? '')) {
          const scale = viewerRootRect.width / rect.width;
          if (scale < 1.0) {
            zoom = (scale * 100) >> 0;
            this.fileTool.setZoom(zoom, { asDefault: 'width' });
          }
        }
      }
      this.applyZoom(zoom);
      this.fileTool.reset();
      this.fileTool.setPage(this.pageNumber);
      this.previousRenderFile = this.file;
    }
    if (isPlainFile) {
      const viewer =
        this.shadowRoot?.querySelector<HTMLDivElement>('.text-wrapper');
      // @ts-ignore
      hljs.lineNumbersBlock(viewer);
    }
    this.emit('sc-doc-loaded');
  }

  async updateDimensionOfPdf() {
    const pdfViewer = await this.pdfViewer;

    const diminstionBox = await this.realDimensionBox;
    diminstionBox.style.setProperty(
      'width',
      `${pdfViewer?.offsetWidth ?? 0}px`
    );
    diminstionBox.style.setProperty(
      'height',
      `${pdfViewer?.offsetHeight ?? 0}px`
    );
  }
  clamp(v: number, min: number, max: number) {
    return Math.min(max, Math.max(min, v));
  }

  get dimension() {
    const screenWidth =
      this.viewerContainer.clientWidth || document.documentElement.clientWidth;

    const screenHeight =
      this.viewerContainer.clientHeight ||
      document.documentElement.clientHeight;

    return { height: screenHeight, width: screenWidth };
  }

  renderFallback(viewer: HTMLDivElement, content: TemplateResult<1> | string) {
    render(
      html`
        <div class="empty-content">
          ${fallbackFileIcon()}
          <div class="fallback-title">
            <slot name="empty">${content}</slot>
          </div>
          <div class="fallback-desc">
            Try uploading or selecting a document to view
          </div>
        </div>
      `,
      viewer
    );
  }

  initBaseLayout() {
    render(nothing, this.viewerContainer);

    render(
      html`
        <div
          class="real-dimension-box"
          style="position: relative; left: 50%; transform: translateX(-50%); width: calc(100% - ${this
            .getSizeAdaptor}px); height: 100%;"
        >
          <div style="min-height: 100%;" id="viewer"></div>
        </div>
        <div
          class="scriber-layer highlights"
          ${ref(async el =>
            el && ((await this.ScScriber).addSvgLayer(ETools.highlightRect, el as HTMLElement))
          )}
        ></div>
        <sc-scriber></sc-scriber>
      `,
      this.viewerContainer
    );
  }

  @watch('pageNumber')
  async handlePageChangeByProp() {
    this.hasUpdated || (await this.updateComplete);
    const fn = () =>
      this.file &&
      pdfTypes.includes(this.activeFileType ?? '') &&
      this.fileTool?.setPage(this.pageNumber);
    if (!this.loadingFile && this.previousRenderFile) {
      fn();
    }
  }

  async previewFile(file: File) {
    let buffers: ArrayBuffer;
    let reader: FileReader;
    this.initBaseLayout();
    const diminstionBox = await this.realDimensionBox;
    diminstionBox.classList.add('overflowhidden');

    const viewer = this.shadowRoot?.querySelector<HTMLDivElement>('#viewer');
    if (!viewer) {
      return;
    }
    const ScScriber = await this.ScScriber;
    this.showScriber(ScScriber, false);
    this.fileTool.isScriberToolActive = false;
    const { size, type, name } = file;

    const { width, height } = viewer.getBoundingClientRect();

    this.loadingFile = true;
    this.activeFileType = type || name.split('.').pop();
    if (!file || !size) {
      this.renderFallback(viewer, 'Current file is empty, please try others.');
      this.afterRender();
      return;
    }

    switch (this.activeFileType) {
      case docxTypes[0]:
        // case 'application/msword':
        await docxPreview.renderAsync(file, viewer, undefined, {
          ignoreLastRenderedPageBreak: false,
        });
        await this.afterRender();
        break;
      case pptxTypes[0]:
      case pptxTypes[1]:
        const pptxViewer = pptxPreview.init(viewer, {
          width,
          height,
        });
        buffers = await file.arrayBuffer();
        await pptxViewer.preview(buffers);
        this.afterRender();
        break;
      case excelTypes[0]:
      case excelTypes[1]: {
        render(
          html`
            <sc-excel-viewer
              .file=${file}
            ></sc-excel-viewer>
          `,
          viewer
        );
        this.afterRender();
        break;
      }
      case pdfTypes[0]:
        render(
          html`
            <sc-pdf-viewer
              .file=${file}
              @sc-pdf-loaded=${(
                e: CustomEvent<{ pageCount: number; maxWidth: number }>
              ) => {
                this.fileTool.setTotalPage(e.detail.pageCount);
                const pdfViewer = e.target as ScPDFViewer;
                this.addEventListener(
                  'sc-doc-loaded',
                  () => pdfViewer.scrollToPage(this.pageNumber),
                  { once: true }
                );
                this.afterRender();
              }}
              @sc-page-visible=${(e: CustomEvent<{ pageNumber: number }>) => {
                const { pageNumber: page } = e.detail;
                const { totalPage: pageSize } = this.fileTool;
                this.emit('sc-page-change', { detail: { page, pageSize } });
              }}
            ></sc-pdf-viewer>
          `,
          viewer
        );

        break;
      case msgTypes[0]:
        reader = new FileReader();
        reader.onload = () => {
          const fileBuffer = reader.result;
          const extension = file.name.toLowerCase().split('.').pop();

          let msgInfo;
          if (extension === 'msg') {
            msgInfo = extractMsg(fileBuffer);
          }

          const message = this.messageHandler.addMessage(msgInfo, file.name);

          viewer.innerHTML = this.showMessage(message);
          this.afterRender();
        };
        reader.readAsArrayBuffer(file);

        break;
      case imgTypes[0]:
      case imgTypes[1]:
      case imgTypes[2]:
      case imgTypes[3]:
        reader = new FileReader();
        reader.onload = (event: Event) => {
          const { result } = event.target as any;
          const base64 = btoa(result);
          const src = `data:${file.type};base64,${base64}`;
          const maxHeight =
            this.viewerRoot.getBoundingClientRect().height * 0.5;
          const minHeight =
            this.viewerRoot.getBoundingClientRect().height * 0.1;
          const maxWidth = this.viewerRoot.getBoundingClientRect().width * 0.5;
          const minWidth = this.viewerRoot.getBoundingClientRect().height * 0.1;

          diminstionBox.classList.remove('overflowhidden');
          render(
            html`
              <div class="image-wrapper">
                <div class="rotation-box">
                  <img
                    src="${src}"
                    style=${styleMap({
                      maxHeight: `${maxHeight}px`,
                      minHeight: `${minHeight}px`,
                      maxWidth: `${maxWidth}px`,
                      minWidth: `${minWidth}px`,
                    })}
                    alt=""
                  />
                </div>
              </div>
            `,
            viewer
          );
          this.afterRender();
        };
        reader.readAsBinaryString(file);
        break;
      case videoTypes[0]:
      case videoTypes[1]:
      case videoTypes[2]:
        reader = new FileReader();

        reader.onload = () => {
          const result = reader.result as string;

          diminstionBox.classList.remove('overflowhidden');
          render(
            html`
              <div class="video-wrapper">
                <video controls src="${result}"></video>
              </div>
            `,
            viewer
          );
          this.afterRender();
        };

        reader.readAsDataURL(file);

        break;
      case textTypes[0]:
      case textTypes[1]:
      case textTypes[2]:
      case textTypes[3]:
      case textTypes[4]:
      case textTypes[5]:
      case textTypes[6]:
      case textTypes[7]:
      case textTypes[8]:
      case textTypes[9]:
      case textTypes[10]:
      case textTypes[11]:
        reader = new FileReader();
        reader.onload = (event: Event) => {
          const { result } = event.target as any;

          const highlightedCode = hljs.highlight(result, {
            language: textLanguages[this.activeFileType as string],
          });

          render(
            html`
              <div class="text-wrapper">
                ${unsafeHTML(highlightedCode.value)}
              </div>
            `,
            viewer
          );
          this.afterRender();
        };
        reader.readAsText(file);
        break;

      default:
        this.renderFallback(
          viewer,
          'Current file is not supported. please try others.'
        );
        this.afterRender();
        this.activeFileType = '';
        break;
    }
  }

  showMessage(msgInfo: any) {
    this.messageHandler.setCurrentMessage(msgInfo);

    const toRecipients = msgInfo.recipients
      .filter((recipient: any) => recipient.recipType === 'to')
      .map((recipient: any) => `${recipient.name} &lt;${recipient.email}&gt;`)
      .join(', ');
    const ccRecipients = msgInfo.recipients
      .filter((recipient: any) => recipient.recipType === 'cc')
      .map((recipient: any) => `${recipient.name} &lt;${recipient.email}&gt;`)
      .join(', ');

    // Process email content to scope styles
    let emailContent = msgInfo.bodyContentHTML || msgInfo.bodyContent;
    // If no HTML, convert plain text to HTML with paragraphs and line breaks
    if (!msgInfo.bodyContentHTML && emailContent) {
      // Normalize line endings
      const text = emailContent.replace(/\r\n/g, '\n');
      // Split into paragraphs by double line breaks
      const paragraphs = text.split(/\n{2,}/).map((p: any) => {
        // Replace single line breaks in paragraph with <br>
        return p.replace(/\n/g, '<br>');
      });
      emailContent = `<p>${paragraphs.join('</p><p>')}</p>`;
    }
    if (emailContent) {
      // Create a temporary container to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = emailContent;

      // Find all style tags and scope them to .email-content
      const styleTags = tempDiv.getElementsByTagName('style');
      Array.from(styleTags).forEach(styleTag => {
        const cssText = styleTag.textContent;
        // Scope all CSS rules to .email-content
        const scopedCss =
          cssText?.replace(/([^{}]+){/g, '.email-content $1{') || '';
        styleTag.textContent = scopedCss;
      });

      // Update the email content
      emailContent = tempDiv.innerHTML;
    }

    const messageContent = `
        <div class="bg-white">
          <div class="message-header">
              <div class="message-title pl-6">${msgInfo.subject}</div>
          </div>
          <div class="p-6 rounded-3xl">
              <div class="mb-4">
                  <div class="text-gray-600"><strong>From:</strong> ${
                    msgInfo.senderName
                  } &lt;${msgInfo.senderEmail}&gt;</div>
                  ${
                    toRecipients
                      ? `<div class="text-gray-600"><strong>To:</strong> ${toRecipients}</div>`
                      : ''
                  }
                  ${
                    ccRecipients
                      ? `<div class="text-gray-600"><strong>CC:</strong> ${ccRecipients}</div>`
                      : ''
                  }
                  <div class="text-gray-500 text-sm mt-2">${msgInfo?.timestamp?.toLocaleString()}</div>
              </div>
              <div class="prose max-w-none">
                  <div class="email-content" style="position: relative; isolation: isolate;">
                      ${emailContent}
                  </div>
              </div>
              ${this.renderAttachments(msgInfo)}
          </div>
        </div>
    `;

    // this.messageViewer.innerHTML = messageContent;
    return messageContent;
  }

  renderAttachments(msgInfo: any) {
    if (!msgInfo.attachments?.length) return '';

    return `
        <div class="mt-6">
            <hr class="border-t border-gray-200 mb-4">
            <div class="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                </svg>
                <span class="text-gray-600">${msgInfo.attachments.length} ${
      msgInfo.attachments.length === 1 ? 'Attachment' : 'Attachments'
    }</span>
            </div>
            <div class="attachments flex flex-wrap gap-4">
                ${msgInfo.attachments
                  .map((attachment: any) => {
                    if (
                      attachment.attachMimeTag &&
                      attachment.attachMimeTag.startsWith('image/')
                    ) {
                      return `
                            <a href="${attachment.contentBase64}" download="${attachment.fileName}" style="text-decoration:none;" class="min-w-[250px] max-w-fit">
                                <div class="flex items-center space-x-2 rounded border p-2 transition-colors">
                                    <div class="border rounded w-10 h-10 flex-shrink-0">
                                        <img src="${attachment.contentBase64}" alt="Attachment" class="w-10 h-10 object-cover">
                                    </div>
                                    <div class="no-underline">
                                        <p class="no-underline text-sm text-gray-800">${attachment.fileName}</p>
                                        <p class="no-underline text-xs text-gray-400">${attachment.attachMimeTag} - ${attachment.contentLength} bytes</p>
                                    </div>
                                </div>
                            </a>
                        `;
                    } else {
                      return `
                            <a href="${attachment.contentBase64}" download="${attachment.fileName}" class="text-sm text-gray-600 no-underline min-w-[250px] max-w-fit">
                                <div class="flex items-center rounded border p-2 transition-colors">
                                    <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-400">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                    </div>
                                    <div class="ml-2">
                                        <p class="text-sm text-gray-800">${attachment.fileName}</p>
                                        <p class="text-xs text-gray-400">${attachment.attachMimeTag} - ${attachment.contentLength} bytes</p>
                                    </div>
                                </div>
                            </a>
                        `;
                    }
                  })
                  .join('')}
            </div>
        </div>
    `;
  }

  handleMouseEnter() {
    this.viewerRoot.classList.add('mouseover');
  }
  handleMouseLeaev() {
    this.viewerRoot.classList.remove('mouseover');
  }

  async renderFallbackWhenNoFile() {
    if (!this.file) {
      await this.updateComplete;
      this.initBaseLayout();
      const viewer = this.shadowRoot?.querySelector<HTMLDivElement>('#viewer');
      if (!viewer) {
        return;
      }
      this.renderFallback(viewer, 'No document to display');
      this.afterRender();
    }
  }
  handleHistoryChange = debounce(() => {
    this.getScribbleDataSource().then(dataSource => {
      this.emit('sc-scribble-change', {
        detail: {
          dataSource,
        },
      });
    });
  }, 500);
  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('mouseenter', this.handleMouseEnter);
    this.addEventListener('mouseleave', this.handleMouseLeaev);
    document.addEventListener('fullscreenchange', this.handleFullscreen);
    this.renderFallbackWhenNoFile();
    window.addEventListener(
      'sc-history-change',
      this.handleHistoryChange,
      true
    );
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('fullscreenchange', this.handleFullscreen);
    this.removeEventListener('mouseenter', this.handleMouseEnter);
    this.removeEventListener('mouseleave', this.handleMouseLeaev);
    window.removeEventListener(
      'sc-history-change',
      this.handleHistoryChange,
      true
    );
  }

  async handleScriberToolbarChange(e: CustomEvent) {
    const { type, info } = e.detail;
    const ScScriber = await this.ScScriber;
    switch (type) {
      case 'tool-change':
        if (pdfTypes.includes(this.activeFileType ?? '')) {
          const pdfViewer = await this.pdfViewer;
          const pages = pdfViewer?.getPageInfo() ?? [];
          pages.forEach(page => {
            page.scriber.setTool(info.value);
          });
        } else {
          ScScriber.setTool(info.value);
        }
        break;
      case 'tool-style-change':
        if (pdfTypes.includes(this.activeFileType ?? '')) {
          const pdfViewer = await this.pdfViewer;
          const pages = pdfViewer?.getPageInfo() ?? [];
          pages.forEach(page => {
            page.scriber.setToolStyle(info.value);
          });
        } else {
          ScScriber.setToolStyle(info.value);
        }
        break;
      case 'jump-highlight':
        const root = await this.viewerRoot;
        let { x, y } = info.value;
        const index = info.value.page;
        if (pdfTypes.includes(this.activeFileType ?? '')) {
          const pdfViewer = await this.pdfViewer;
          const pages = pdfViewer?.getPageInfo() ?? [];
          if (pages[index]) {
            const { page } = pages[index];
            x *= page.offsetScale;
            y *= page.offsetScale;
            y += page.offsetTop;
          }
        }
        root.scrollTo?.({
          top: y - 48 - 2,
          left: x - 2,
          behavior: 'smooth',
        });
        break;
    }
  }
  handleFileToolStateChange(
    e: CustomEvent<{ name: keyof ToolState; value: any }>
  ) {
    const { name, value } = e.detail;
    if (name === 'zoomRatio') {
      this.applyZoom(value);
    }
    if (name === 'rotation') {
      this.applyRotation(value);
    }
  }

  async applyRotation(rotation: number) {
    if (!rotationAvailableTypes.includes(this.activeFileType ?? '')) {
      return;
    }
    this.loadingFile = true;
    if (imgTypes.includes(this.activeFileType ?? '')) {
      const rotationBox = await this.rotationBox;
      rotationBox?.style?.setProperty('transform', `rotate(${rotation}deg)`);
      this.loadingFile = false;
      this.updateScriberRotate(rotation);
    } else
    if (pdfTypes.includes(this.activeFileType ?? '')) {
      const pdfViewer = await this.pdfViewer;
      pdfViewer.rotation = rotation % 360;

      const viewerBox = await this.viewerBox;
      const rect = viewerBox.getBoundingClientRect();
      const viewerRootRect = this.viewerRoot.getBoundingClientRect();
      const width = this.clamp(
        rect.width - this.getSizeAdaptor,
        viewerRootRect.width - this.getSizeAdaptor,
        Infinity
      );
      const height = this.clamp(rect.height, viewerRootRect.height, Infinity);
      await this.updateOriginalDimension(width, height);

      await this.updateDimensionOfPdf();
      this.loadingFile = false;
    }
  }
  async applyZoom(zoomValue: number) {
    const scaleValue = zoomValue / 100;
    if (pdfTypes.includes(this.activeFileType ?? '')) {
      await this.updateDimensionOfPdf();

    } else {
      // Sync toolbar state without re-emitting zoom events to avoid feedback recursion.
      this.fileTool.setZoom(zoomValue, { asDefault: 'width', emit: false });
      const viewerBox = await this.viewerBox;
      const diminstionBox = await this.realDimensionBox;
      const ScScriber = await this.ScScriber;

      viewerBox.style.setProperty('transform', `scale(${scaleValue})`);
      const scaledWidth = this.originalDimension.width * scaleValue;
      const scaledHeight = this.originalDimension.height * scaleValue;

      diminstionBox.style.setProperty('width', `${scaledWidth}px`);
      diminstionBox.style.setProperty('height', `${scaledHeight}px`);

      if (docxTypes.includes(this.activeFileType ?? '')) {
        const ScScriber = await this.ScScriber;
        const docWidth =
          (viewerBox.querySelector('.docx-wrapper .docx')?.clientWidth ??
            this.originalDimension.width) * scaleValue;
        this.updateScriberScaleDimension(ScScriber, docWidth, scaledHeight);
      } else {
        this.updateScriberScaleDimension(ScScriber, scaledWidth, scaledHeight);
      }
      this.updateScriberScale(ScScriber, scaleValue);

      this.viewerRoot.scrollLeft = Math.max(
        0,
        Math.floor(this.originalDimension.width * (scaleValue - 1)) / 2
      );
      await ScScriber.updateComplete;
      ScScriber.refreshCanvas();
    }
  }
  renderLoading() {
    if (!this.loadingFile) {
      return nothing;
    }
    return html` <div class="loading-masker">
      <div class="blur-masker"></div>
      <sc-spinner type="page" size="lg"> </sc-spinner>
    </div>`;
  }
  handleFullscreen = () => {
    if (document.fullscreen) {
      if (imgTypes.includes(this.activeFileType ?? '')) {
        this.viewerRoot.classList.add('fullscreen-mode-img-center');
      }
      if (videoTypes.includes(this.activeFileType ?? '')) {
        this.viewerRoot.classList.add('fullscreen-mode-video-center');
      }
      this.viewerRoot.classList.add('fullscreen-mode');
    } else {
      this.viewerRoot.classList.remove('fullscreen-mode');
      this.viewerRoot.classList.remove('fullscreen-mode-img-center');
      this.viewerRoot.classList.remove('fullscreen-mode-video-center');
    }
  };
  toggleFullscreen() {
    if (this.viewerRoot?.requestFullscreen) {
      this.viewerRoot.requestFullscreen();
    }
  }
  handleDownload() {
    const url = URL.createObjectURL(this.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.file.name;
    a.style.setProperty('display', 'none');
    document.body.appendChild(a);

    const isJsdom =
      typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent);

    !isJsdom && a.click();
    document.body.removeChild(a);

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 100);
  }
  wheelStep = 1;
  handleWheel(e: WheelEvent) {
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.fileTool.setZoom(this.fileTool.zoomRatio + this.wheelStep);
      } else {
        this.fileTool.setZoom(this.fileTool.zoomRatio - this.wheelStep);
      }
    }
  }


  firstUpdated() {
    this.#fileToolProvider.setValue(this.fileTool);
  }

  render() {
    return html`
      <div class="wrap">
        ${this.renderLoading()}
        <sc-file-tool
          .config=${this.toolConfig}
          .dataSource=${this.dataSource}
          .filename=${this.file?.name || ''}
          .hidden=${!this.activeFileType}
          @sc-file-tool-state-change=${this.handleFileToolStateChange}
          @sc-file-tool-fullscreen=${this.toggleFullscreen}
          @sc-file-tool-download=${this.handleDownload}
          @sc-file-tool-scriber-change=${this.handleScriberToolbarChange}
          .activeFileType=${this.activeFileType}
        ></sc-file-tool>

        <div id="viewer-root" @wheel=${this.handleWheel}>
          <div class="viewer-container" style="flex: 1;"></div>
        </div>
      </div>
    `;
  }
}

function fallbackFileIcon() {
  return html` <svg
    xmlns="http://www.w3.org/2000/svg"
    width="97"
    height="96"
    viewBox="0 0 97 96"
    fill="none"
  >
    <path
      d="M44.695 43.0449H29.3534C29.0038 43.0453 28.6687 43.1836 28.4215 43.4295C28.1742 43.6754 28.0352 44.0087 28.0347 44.3564V78.2674L27.8589 78.3207L24.0954 79.467C23.917 79.5211 23.7244 79.5026 23.5597 79.4155C23.3951 79.3285 23.2719 79.18 23.2172 79.0027L12.0224 42.6349C11.9679 42.4575 11.9865 42.2658 12.074 42.102C12.1615 41.9382 12.3109 41.8157 12.4892 41.7614L18.2888 39.9952L35.102 34.8769L40.9016 33.1107C40.9898 33.0837 41.0826 33.0743 41.1745 33.083C41.2665 33.0916 41.3558 33.1183 41.4373 33.1613C41.5189 33.2043 41.5912 33.263 41.6499 33.3338C41.7087 33.4046 41.7529 33.4863 41.7799 33.5741L44.6414 42.87L44.695 43.0449Z"
      fill="white"
    />
    <path
      d="M49.667 43.6091L46.0182 31.71C45.9575 31.5118 45.8582 31.3274 45.7261 31.1675C45.594 31.0075 45.4316 30.8751 45.2483 30.7778C45.0649 30.6806 44.8641 30.6203 44.6574 30.6005C44.4507 30.5808 44.2421 30.6018 44.0436 30.6626L35.4168 33.2989L17.6295 38.7358L9.00281 41.373C8.60206 41.4959 8.2665 41.7725 8.0698 42.1421C7.87309 42.5117 7.83131 42.9441 7.95362 43.3444L20.4245 84.0104C20.5238 84.3336 20.7243 84.6164 20.9965 84.8175C21.2687 85.0185 21.5983 85.1272 21.9369 85.1275C22.0936 85.1276 22.2494 85.1041 22.3991 85.0579L28.3127 83.2508L28.4987 83.1933V82.9992L28.3127 83.0558L22.3442 84.8805C21.9905 84.9882 21.6084 84.9514 21.2818 84.7781C20.9553 84.6049 20.7108 84.3095 20.6021 83.9566L8.13224 43.2896C8.0784 43.1148 8.05963 42.931 8.07702 42.7489C8.0944 42.5668 8.1476 42.3899 8.23356 42.2283C8.31952 42.0668 8.43656 41.9237 8.57798 41.8074C8.71939 41.6911 8.8824 41.6037 9.05767 41.5504L17.6844 38.9132L35.4717 33.4772L44.0985 30.8399C44.2314 30.7994 44.3696 30.7788 44.5086 30.7787C44.8069 30.7793 45.0972 30.8753 45.3368 31.0526C45.5765 31.2299 45.753 31.4792 45.8406 31.7639L49.4726 43.6091L49.5303 43.7948H49.7237L49.667 43.6091Z"
      fill="#D4D4D4"
      stroke="#D4D4D4"
      stroke-width="3"
    />
    <path
      d="M34.3462 32.4327C34.4312 32.4068 34.5235 32.4153 34.6021 32.4571C34.6609 32.4884 34.7084 32.5368 34.7397 32.5948L34.7661 32.6563L35.9614 36.5684V36.5694C35.9874 36.655 35.9788 36.7472 35.937 36.8262C35.9055 36.8856 35.8572 36.9336 35.7993 36.9649L35.7388 36.9913L19.3979 42.001C19.3664 42.0107 19.3333 42.0147 19.3003 42.0147C19.2287 42.0145 19.1588 41.9921 19.1011 41.9493C19.0577 41.9171 19.0222 41.8754 18.9985 41.8272L18.979 41.7764L17.7827 37.8643C17.7697 37.8219 17.7658 37.7767 17.77 37.7325C17.7743 37.6885 17.7864 37.6455 17.8071 37.6065C17.8278 37.5675 17.8562 37.533 17.8901 37.505C17.9241 37.4769 17.9634 37.4554 18.0054 37.4425L34.3462 32.4327Z"
      fill="#D4D4D4"
      stroke="#D4D4D4"
    />
    <path
      d="M25.6027 34.7883C26.6087 34.7883 27.4242 33.9481 27.4242 32.9116C27.4242 31.8751 26.6087 31.0349 25.6027 31.0349C24.5968 31.0349 23.7812 31.8751 23.7812 32.9116C23.7812 33.9481 24.5968 34.7883 25.6027 34.7883Z"
      fill="#D4D4D4"
      stroke="#D4D4D4"
      stroke-width="3"
    />
    <path
      d="M25.603 34.0156C26.2431 34.0156 26.7621 33.4966 26.7621 32.8564C26.7621 32.2163 26.2431 31.6973 25.603 31.6973C24.9628 31.6973 24.4438 32.2163 24.4438 32.8564C24.4438 33.4966 24.9628 34.0156 25.603 34.0156Z"
      fill="white"
    />
    <path
      d="M62.9512 84.7721H33.8229C33.6286 84.7719 33.4425 84.6867 33.3051 84.5354C33.1678 84.384 33.0906 84.1788 33.0903 83.9647V45.4917C33.0905 45.2776 33.1678 45.0724 33.3051 44.921C33.4424 44.7696 33.6286 44.6845 33.8229 44.6842H62.9512C63.1454 44.6845 63.3316 44.7696 63.4689 44.921C63.6063 45.0724 63.6835 45.2776 63.6837 45.4917V83.9647C63.6835 84.1788 63.6063 84.384 63.4689 84.5354C63.3316 84.6867 63.1454 84.7719 62.9512 84.7721Z"
      fill="white"
    />
    <path
      d="M49.4319 43.6198H29.8861C29.4677 43.6203 29.0665 43.7869 28.7706 44.0829C28.4747 44.379 28.3082 44.7803 28.3076 45.1989V83.0802L28.4933 83.0235V45.1989C28.4938 44.8295 28.6407 44.4754 28.9018 44.2141C29.1629 43.9529 29.5169 43.806 29.8861 43.8055H49.4895L49.4319 43.6198ZM66.4706 43.6198H29.8861C29.4677 43.6203 29.0665 43.7869 28.7706 44.0829C28.4747 44.379 28.3082 44.7803 28.3076 45.1989V87.7433C28.3082 88.162 28.4747 88.5633 28.7706 88.8593C29.0665 89.1553 29.4677 89.3219 29.8861 89.3225H66.4706C66.8891 89.3219 67.2902 89.1553 67.5861 88.8593C67.882 88.5633 68.0485 88.162 68.0491 87.7433V45.1989C68.0485 44.7803 67.882 44.379 67.5861 44.0829C67.2902 43.7869 66.8891 43.6203 66.4706 43.6198ZM67.8634 87.7433C67.863 88.1127 67.7161 88.4669 67.455 88.7281C67.1939 88.9893 66.8399 89.1363 66.4706 89.1367H29.8861C29.5169 89.1363 29.1629 88.9893 28.9018 88.7281C28.6407 88.4669 28.4938 88.1127 28.4933 87.7433V45.1989C28.4938 44.8295 28.6407 44.4754 28.9018 44.2141C29.1629 43.9529 29.5169 43.806 29.8861 43.8055H66.4706C66.8399 43.806 67.1939 43.9529 67.455 44.2141C67.7161 44.4754 67.863 44.8295 67.8634 45.1989V87.7433Z"
      fill="#B2B2B2"
    />
    <path
      d="M29.8861 43.6198H49.4319L49.4895 43.8055H29.8861M29.8861 43.6198C29.4677 43.6203 29.0665 43.7869 28.7706 44.0829C28.4747 44.379 28.3082 44.7803 28.3076 45.1989M29.8861 43.6198H66.4706C66.8891 43.6203 67.2902 43.7869 67.5861 44.0829C67.882 44.379 68.0485 44.7803 68.0491 45.1989V87.7433C68.0485 88.162 67.882 88.5633 67.5861 88.8593C67.2902 89.1553 66.8891 89.3219 66.4706 89.3225H29.8861C29.4677 89.3219 29.0665 89.1553 28.7706 88.8593C28.4747 88.5633 28.3082 88.162 28.3076 87.7433V45.1989M28.3076 45.1989V83.0802L28.4933 83.0235V45.1989M28.4933 45.1989C28.4938 44.8295 28.6407 44.4754 28.9018 44.2141C29.1629 43.9529 29.5169 43.806 29.8861 43.8055M28.4933 45.1989V87.7433C28.4938 88.1127 28.6407 88.4669 28.9018 88.7281C29.1629 88.9893 29.5169 89.1363 29.8861 89.1367H66.4706C66.8399 89.1363 67.1939 88.9893 67.455 88.7281C67.7161 88.4669 67.863 88.1127 67.8634 87.7433V45.1989C67.863 44.8295 67.7161 44.4754 67.455 44.2141C67.1939 43.9529 66.8399 43.806 66.4706 43.8055H29.8861"
      stroke="#858687"
      stroke-width="3"
    />
    <path
      d="M56.5082 47.4725H39.2113C38.987 47.4723 38.7719 47.3916 38.6133 47.248C38.4547 47.1045 38.3655 46.9098 38.3652 46.7068V42.9635C38.3655 42.7605 38.4547 42.5659 38.6133 42.4223C38.7719 42.2788 38.987 42.198 39.2113 42.1978H56.5082C56.7325 42.198 56.9476 42.2788 57.1062 42.4223C57.2648 42.5659 57.354 42.7605 57.3542 42.9635V46.7068C57.354 46.9098 57.2648 47.1045 57.1062 47.248C56.9476 47.3916 56.7325 47.4723 56.5082 47.4725Z"
      fill="#858687"
    />
    <path
      d="M48.1784 42.1846C49.2149 42.1846 50.0551 41.3691 50.0551 40.3632C50.0551 39.3572 49.2149 38.5417 48.1784 38.5417C47.142 38.5417 46.3018 39.3572 46.3018 40.3632C46.3018 41.3691 47.142 42.1846 48.1784 42.1846Z"
      fill="#B2B2B2"
      stroke="#858687"
      stroke-width="3"
    />
    <path
      d="M48.1782 41.5222C48.7878 41.5222 49.2821 41.0033 49.2821 40.3631C49.2821 39.723 48.7878 39.204 48.1782 39.204C47.5685 39.204 47.0742 39.723 47.0742 40.3631C47.0742 41.0033 47.5685 41.5222 48.1782 41.5222Z"
      fill="white"
    />
    <path
      d="M75.1742 10.5169L74.0384 9.86362C73.683 9.65935 73.2271 9.78378 73.0202 10.1415L67.8278 19.1005C67.6203 19.4583 67.7404 19.9138 68.0951 20.1181L69.231 20.7715C69.5863 20.9757 70.0423 20.8513 70.2498 20.4935L75.4421 11.5346C75.649 11.1768 75.5295 10.7212 75.1742 10.5169Z"
      fill="#D4D4D4"
    />
    <path
      d="M89.4547 26.8529L80.6682 31.6845C80.3179 31.8774 80.1902 32.3172 80.3839 32.6667L81.0034 33.7847C81.1971 34.1342 81.6386 34.2612 81.9895 34.0682L90.7761 29.2367C91.127 29.0437 91.2541 28.604 91.0604 28.2544L90.4409 27.1365C90.2472 26.7869 89.8057 26.6599 89.4547 26.8529Z"
      fill="#D4D4D4"
    />
    <path
      d="M92.7699 49.3432L82.9789 47.144C82.5884 47.0562 82.1997 47.3007 82.1117 47.6902L81.8299 48.9359C81.7419 49.3254 81.9871 49.7123 82.3777 49.8001L92.1686 51.9993C92.5592 52.0871 92.9478 51.8426 93.0359 51.4531L93.3176 50.2074C93.4063 49.8179 93.1604 49.431 92.7699 49.3432Z"
      fill="#D4D4D4"
    />
    <path
      d="M29.1041 13.2732L28.162 14.1394C27.8677 14.4102 27.8494 14.8675 28.1211 15.1609L34.9285 22.5078C35.2002 22.8011 35.6593 22.8195 35.9536 22.5487L36.8957 21.6826C37.19 21.4118 37.2083 20.9544 36.9366 20.661L30.1292 13.3142C29.8575 13.0208 29.3984 13.0025 29.1041 13.2732Z"
      fill="#D4D4D4"
    />
    <path
      d="M50.5986 4.21996L49.3169 4.24516C48.9163 4.25304 48.5981 4.58302 48.6056 4.9822L48.8037 14.9785C48.8119 15.3776 49.1433 15.6948 49.5439 15.6869L50.8257 15.6617C51.2263 15.6538 51.5445 15.3239 51.5363 14.9247L51.3382 4.92847C51.3307 4.52929 50.9992 4.21208 50.5986 4.21996Z"
      fill="#D4D4D4"
    />
  </svg>`;
}
