import { html, nothing, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { marked } from 'marked';
import ScRteElement from '../../shared/sc-rte-element.js';
import ScTheme from '../../styles/ScTheme.js';
import ScRteAskAIModalStyle from './styles/ScRteAskAIModal.style.js';
import { classMap } from 'lit/directives/class-map.js';
import './ScRteAskInputBar.js';
import { animateTo, stopAnimations } from '../../shared/animation.js';
import { watch } from '../../shared/watch.js';
import { messagesRequestTemplateData, msgsProp } from './utils.js';
import { Editor } from 'hugerte';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

export class ScRteAskAIModal extends ScRteElement {
  static styles = ScTheme.getStyles().concat([ScRteAskAIModalStyle]);

    @property({ type: String }) prompt = '';
    @property({ type: String }) type = '';
    @property({ type: Object }) editor: Editor | null;
    @property({ type: String, attribute: 'ai-model' }) aiModel = 'YODA';
    @property({ type: String, attribute: 'ai-request-type' }) aiRequestType: 'model' | 'inline' = 'model';
    @property({ type: String, attribute: 'ai-insert-type' }) aiInsertType: 'replace' | 'insert-below' = 'replace';

    @state() inputText = '';
    @state() resendInputText = '';
    @state() content = '';
    @state() showLoading = false;
    @state() typing = false;
    @state() bodyContent = '';
    @state() timeoutOfAPI: any = null;

    _queryClient : any = null;

    firstUpdated(_changedProperties: PropertyValues): void {
      const renderer = new marked.Renderer(); // Correct usage of Renderer
      marked.setOptions({
        renderer,
        gfm: true,
        breaks: false,
        pedantic: false,
      });
    }
    
    get _content() {
      return marked.parse(this.content) as string; // Ensure marked is used correctly
    }

    get _dotAnimationTemplate() {
      return `<div><style>
              .sc-rte-ask-ai-dots {
                display: inline-flex;
                gap: 0.25rem;
                vertical-align: middle;
              }

              .sc-rte-ask-ai-dot {
                width: 0.25rem;
                height: 0.25rem;
                border-radius: 50%;
                background: var(--sc-tag-black-fill-background-color, #000000); 
                animation: dotGradient 1.5s ease-in-out infinite;
              }

              .sc-rte-ask-ai-dot:nth-child(2) {
                animation-delay: 0.5s;
              }
              .sc-rte-ask-ai-dot:nth-child(3) {
                animation-delay: 1s;
              }

              @keyframes dotGradient {
                0%, 100% {
                  opacity: 1;
                  background-position: 0 0;
                }
                50% {
                  opacity: 0.5;
                  background-position: 0 100%; 
                }
              }
            </style>
            <span>
              I’m thinking 
              <span class="sc-rte-ask-ai-dots">
                <span class="sc-rte-ask-ai-dot"></span>
                <span class="sc-rte-ask-ai-dot"></span>
                <span class="sc-rte-ask-ai-dot"></span>
              </span>
            </span></div>`;
    }

    @watch('content')
    onContentChange() {
      if (this.content) {
        this.startContentAnimation();
      }
    }

    @watch('prompt')
    onPromptChange() {
      if (this.prompt) {
        this.inputText = this.prompt;
        this.callStreamAPI();
      }
    }


    closeModal() {
      this.stop();
      this.dispatchEvent(new CustomEvent('sc-rte-ask-ai-close'));
    }

    onInput(e: CustomEvent) {
      this.inputText = e.detail.value;
      if (this.inputText) {
        this.resendInputText = this.inputText;
      }
    }

    async scroll() {
      await this.updateComplete;
      let scrollEl = this.shadowRoot?.querySelector('.modal-main-content')?.querySelector('.in') as HTMLElement | null;
      scrollEl?.scrollTo(0, 10000000);
      scrollEl = null;
    }

    clearData() {
    //   this.inputText = '';
      this.content = '';
      this.typing = false;
    }

    insertBelowContent(content: string) {
      const editor = this.editor;
      if (!editor) return;
      
      const selection = editor.selection;
      // Check if there is any selected content
      if (selection.isCollapsed()) {
        editor.insertContent(`<p>${content}</p>`);
      } else {
        const selectedNode = selection.getNode();
        const editorBody = editor.getBody();
        const newNode = editor.dom.create('p', {}, content);
        // Ensure the selectedNode is not the editor's body itself
        if (editorBody !== selectedNode) {
          editor.dom.insertAfter(newNode, selectedNode);
        }
        else {
          // Insert at the end of the body
          editorBody.appendChild(newNode);
        }
      }
      editor.focus();
    }

    replaceContent(newContent: string) {
      const editor = this.editor;
      if (!editor) return;
      
      const selection = editor.selection;
      
      if (!selection.isCollapsed()) {
        editor.execCommand('mceReplaceContent', false, newContent);
      } else {
        this.insertBelowContent(newContent);
      }
      
      editor.focus();
    }

    resetContent() {
      if (!this.editor) return;
      const body = this.editor!.getBody();
      body.innerHTML = this.bodyContent;
    }

    updateContent(type: string) {
      if (type === 'insert-below') {
        this.insertBelowContent(this._content);
      }
      else {
        this.replaceContent(this._content);
      }
      this.dispatchEvent(new CustomEvent('sc-rte-ask-ai-update', {
        detail: { content: this._content, type },
      }));
      this.clearData();
    }

    tryAgain() {
      this.inputText = this.prompt || this.resendInputText;
      this.callStreamAPI();
    }

    stop() {
      this.typing = false;
      this.showLoading = false;
      this._queryClient?.abort();
    }

    startContentAnimation() {
      this.updateComplete.then(async() => {
        const bkElement = this.shadowRoot?.querySelector('.modal-main-content')?.querySelector('.bk') as HTMLElement;
        if (!bkElement) return;
        const keyframes: Keyframe[] = [];
        for (let i = 0;i <= 360;i++) {
          if (i % 2 === 0) {
            keyframes.push({ '--sc-rte-rotation-angle': `${i}deg` });
          }
        }
        // Define animation options
        const options: KeyframeAnimationOptions = {
          duration: 10000, // 10s
          easing: 'linear', 
          iterations: Infinity,
        };
        await stopAnimations(bkElement);
        await animateTo(bkElement, keyframes, options);
      });
    }

    generateRequest(messages: msgsProp[]) {
      const formattedMessages = messages
        .map(msg => `{ role: "${msg.role}", content: "${msg.content}" }`)
        .join(', ');
      return `subscription ($content: String!) { output: get_chunk_completions (messages: [${formattedMessages}, { role: "user", content: $content }], conversationId: "", model: "${this.aiModel}", isSample: false, toolsetId: "", categoryId: "") { id choices { delta { content } } } }`;
    }

    selectAllContent() {
      if (!this.editor) return;
      this.editor.focus();
      this.editor.execCommand('selectAll');
    }

    getData(reader: any, decoder: TextDecoder) {
      reader.read().then(({ done, value }:{ done: boolean, value:any}) => {
        if (!done) {
          // Process the received chunk (value)
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split(/\r?\n/);
          lines.forEach((line: string) => {
            line.trim();
            if (line !== '') {
              if (line.startsWith('data:')) {
                let dataChunk: any = {};
                try {
                  dataChunk = JSON.parse(line.substring('data:'.length));
                  dataChunk = dataChunk?.output || dataChunk;
                } catch (e) {
                  throw { line };
                }
                if (typeof dataChunk?.choices?.[0]?.delta?.content === 'string') {
                  const data = dataChunk?.choices[0]?.delta?.content;
                  this.content += data || ' ';
                  this.typing = true;
                  this.showLoading = false;
                  this.scroll();
                  if (dataChunk?.id?.includes('STOP')) {
                    this.stop();
                    this.updateContentInInlineModel();
                    return;
                  }
                  this.getData(reader, decoder);
                } else {
                  throw { line };
                }
              } else {
                throw { line };
              }
            }
          });
        } else {
          this.showLoading = false;
          this.typing = false;
          this.updateContentInInlineModel();
        }
      });
    }
    
    async callStreamAPI() {
      if (!this.inputText) return;
      const msgs = Array.from(new Set(messagesRequestTemplateData)) || [];
      const selectedContent = this.editor?.selection.getContent({ format: 'html' }) || '';
      const htmlContent = selectedContent || this.editor?.getContent({ format: 'html' }) || '';
      if (!selectedContent) {
        this.selectAllContent();
      }
      this.clearData();
      this.showLoading = true;
      this.updateInlineInTextEditorLoading();
      
      const onSend = (client: any) => {
        this._queryClient = client;
        this.timeoutOfAPI =  setTimeout(()=>{
          if (this.showLoading) {
            this.stop();
            this.updateContentInInlineModel();
          }
        },30000);
      };
      
      try {
        const response = await this._restClient?.request(
          '55313-195-ask-sb-plugin-ask-sb-plugin-exp-api',
          'sse',
          'POST',
          JSON.stringify({
            query: this.generateRequest(msgs),
            variables: {
              content: `Question: ${this.inputText} Context: ${htmlContent}`,
            },
          }),
          {
            'Content-Type': 'application/json',
          }, {}, { onSend }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }        
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        if (this.timeoutOfAPI) {
          clearTimeout(this.timeoutOfAPI);
        }
        this.getData(reader, decoder);
      } catch (e) {
        this.showLoading = false;
        this.typing = false;
        this.stop();
        this.updateContentInInlineModel();
      }
    }

    updateContentInInlineModel() {
      if (this.aiRequestType === 'inline') {
        const selectedContent = this.editor?.selection.getContent({ format: 'html' }) || '';
        if (!selectedContent) {
          this.selectAllContent();
        }
        if (this.content) {
          this.updateContent(this.aiInsertType);
        }
        else {
          this.resetContent();
        }
        this.closeModal();
      }
    }

    updateInlineInTextEditorLoading() {
      if (this.aiRequestType === 'inline') {
        if (!this.editor) return;
        const body = this.editor!.getBody();
        this.bodyContent = body.innerHTML;
        body.innerHTML = this._dotAnimationTemplate;
      }
    }

    renderNormalModel() {
      return html`<div class="sc-rte-ask-ai-modal-container">
            <div class="sc-rte-ask-ai-modal-header">
                <div class="header-left">
                    <sc-icon class="header-left-icon" name="editor-sparks" size="md"></sc-icon>
                    <span class="header-left-text">AI Assistant</span>
                </div>
                <sc-icon class="header-right-icon" name="cross" size="sm" @click=${()=>{ this.closeModal(); }}></sc-icon>
            </div>
            <sc-divider line-width="xxs" vertical="" compact="" style="margin-top: 0rem;width: calc(100%);"></sc-divider>
            ${
  this.content ? 
    html`
                <div class="sc-rte-ask-ai-modal-main">
                    <div class="modal-main-content">
                        <div class="bk"></div>
                        <div 
                          class=${
  classMap({
    in: true,
    'in-height': this.content,
  })
}
                        >
                            <span>${unsafeHTML(this._content)}</span>
                        </div>
                    </div>
                    <div class="modal-main-footer">
                        <sc-button type="secondary" state="default" size="sm"
                        ?disabled=${this.typing}
                         id="replace"
                        @click=${()=>{ this.updateContent('replace'); }}
                        >Replace</sc-button>
                        <sc-button type="secondary" state="default" size="sm"
                        ?disabled=${this.typing}
                        id="insert-below"
                        @click=${()=>{ this.updateContent('insert-below'); }}
                        >Insert Below</sc-button>
                        <sc-button type="secondary" state="default" size="sm"
                        ?disabled=${this.typing}
                        id="try-again"
                        @click=${()=>{ this.tryAgain(); }}
                        >Try Again</sc-button>
                    </div>
                </div>
                ` : 
    html`${
      this.showLoading ?
        html`
                    <div
                    class=${classMap({
    'sc-rte-ask-ai-modal-loading': true,
  })}
                  >
                    ${html`${unsafeHTML(this._dotAnimationTemplate)}`}
                    </div>
                    ` :  nothing
    }`
}
                <div class=${classMap({
    'sc-rte-ask-ai-modal-footer': true,
  })}
                  style=${
  this.content ? 'margin-top: -1.25rem;' : ''
}
                >
                <sc-rte-ask-input-bar ?disabled=${this.typing || this.showLoading} ?typingOrLoading=${this.typing || this.showLoading} rows=${2} defaultValue=${this.inputText} @sc-input=${this.onInput} 
                @sc-rte-ask-send=${this.callStreamAPI}
                @sc-rte-ask-stop=${this.stop}
                ></sc-rte-ask-input-bar>
                </div>
                <sc-ai-agreement class="ai-agreement" ai-model=${this.aiModel}></sc-ai-agreement>
            </div>`;
    }

    render() {
      return html`${
        this.aiRequestType === 'model' ? this.renderNormalModel() : nothing
      }
      `;
    }

}
