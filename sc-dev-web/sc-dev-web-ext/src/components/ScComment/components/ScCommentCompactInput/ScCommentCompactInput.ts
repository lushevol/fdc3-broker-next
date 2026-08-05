import { html, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import ScExtElement from '../../../../shared/sc-ext-element.js';
import ScCommentCompactInputStyle from './ScCommentCompactInput.style.js';
import { watch } from '../../../../shared/watch.js';
import { createComment } from '../../../../apis/comment.js';
import type { Comment } from '../../ScComment.types.js';
import { isElementVisible } from '../../utils/tools.js';

/**
 * ScCommentCompactInput - Compact reply/edit input
 *
 * @fires sc-compact-change - Emitted when input value changes
 * @fires sc-submit - Emitted when user clicks Post/Save
 * @fires sc-cancel - Emitted when user clicks Cancel
 * @fires sc-submit-success - Emitted after a successful API createComment call (allow-api mode); detail: { comment }
 * @fires sc-submit-error - Emitted when the API createComment call fails (allow-api mode); detail: { error }
 */
export class ScCommentCompactInput extends ScExtElement {
  static styles = [ScCommentCompactInputStyle];

  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: String }) primaryLabel = '';
  @property({ type: String }) cancelLabel = '';
  @property({ type: Boolean }) compact = false;
  @property({ type: Boolean }) compactReplyMode = false;
  @property({ type: Boolean, attribute: 'allow-api' }) allowAPI = false;
  @property({ type: String, attribute: 'reference-id' }) referenceId = 'sc-comment-default-reference-id';
  @property({ type: String, attribute: 'parent-id' }) parentId = '';
  @property({ type: String }) mode: 'post' | 'reply' | 'edit' = 'post';
  @property({ type: Object }) comment?: Comment;

  @state() private currentValue = '';
  @state() private _mentions: Array<{ id: string; name: string }> = [];
  @state() private _onDocumentClick?: (e: MouseEvent) => void;
  @state() private _submitting = false;

  @watch('compactReplyMode')
  updateCompactReplyMode() {
    if (this.compactReplyMode) {
      this.addInputListener(type=>{
        if (type === 'inside') {
          return;
        }
        this.handleCancel();
      });
    }
    else {
      this.removeInputListener();
    }
  }

  /**
   * Listen for clicks inside or outside the comment input. Triggers the callback when clicking outside.
   */
  addInputListener(callback: (type: 'inside' | 'outside') => void) {
    // Remove first to avoid duplicate listeners
    this.removeInputListener();
    this._onDocumentClick = (e: MouseEvent) => {
      const scRteMentionMenu = document?.querySelector('#sc-rte-mention-menu');
      const inputRoot = this.shadowRoot?.querySelector('.compact-input');
      if (!inputRoot || !callback) return;

      const mentionVisible = isElementVisible(scRteMentionMenu);
      if (mentionVisible) {
        setTimeout(() => callback('inside'), 0);
        return;
      }
      const path = e.composedPath();
      const isInside = path.includes(inputRoot as EventTarget);
      if (!isInside) {
        setTimeout(() => {
          callback('outside');
        }, 0);
      }
      else {
        setTimeout(() => {
          callback('inside');
        }, 0);
      }
    };
    document.addEventListener('mousedown', this._onDocumentClick, true);
  }

  removeInputListener() {
    if (this._onDocumentClick) {
      document.removeEventListener('mousedown', this._onDocumentClick, true);
      this._onDocumentClick = undefined;
    }
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.startFirstMediaQuery();
  }

  connectedCallback() {
    super.connectedCallback();
    this.currentValue = this.value;
    this._mentions = this.comment?.mentions || [];
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeInputListener();
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('value')) {
      this.currentValue = this.value;
    }
  }

  handleInputChange(e: CustomEvent) {
    e.stopPropagation();
    const nextValue = e.detail?.text ?? e.detail?.value ?? '';
    this._mentions = e.detail.mentions || [];
    this.currentValue = nextValue;

    this.emit('sc-compact-change', {
      detail: {
        value: nextValue,
        mentions: this._mentions,
      },
    });
  }

  async handleSubmit() {
    if (!this.currentValue.trim() || this._submitting) return;

    this.emit('sc-submit', {
      detail: {
        value: this.currentValue,
        mentions: this._mentions,
      },
    });

    if (!this.allowAPI) {
      return;
    }

    if (!this.referenceId) {
      this.emit('sc-submit-error', {
        detail: { error: new Error('reference-id is required when allow-api is true') },
      });
      return;
    }

    const textToSubmit = this.currentValue;
    this._submitting = true;
    this.currentValue = '';

    try {
      const comment = await createComment((this as any)._graphQLClient?.query, {
        referenceId: this.referenceId,
        parentId: this.parentId || undefined,
        text: textToSubmit,
        mentions: this._mentions.map(m => m.id),
      });
      this.emit('sc-submit-success', { detail: { comment } });
    } catch (error) {
      this.currentValue = textToSubmit;
      this.emit('sc-submit-error', { detail: { error } });
    } finally {
      this._submitting = false;
    }
  }

  handleCancel() {
    this.emit('sc-cancel', {
      detail: {
        value: this.currentValue,
      },
    });
  }

  render() {
    const canSubmit = !!this.currentValue.trim();

    return html`
      <div class="compact-input">
        <sc-rich-text-editor-v2
          .value=${this.currentValue}
          .placeholder=${this.placeholder}
          .toolbar=${[] as any}
          .extConfig=${{ 
            height: '2.25rem',
            content_style: 'body::-webkit-scrollbar { width: 0 !important; height: 0 !important; } body { scrollbar-width: none; -ms-overflow-style: none; overflow-y: auto; }',
          }}
          @sc-change=${this.handleInputChange}
          @sc-mention=${(e: any) => { this._mentions = e.detail.mentions || []; }}
        ></sc-rich-text-editor-v2>
        <div class="compact-input-actions">
          <!-- <sc-button size="sm" type="secondary" @click=${this.handleCancel}>
            <div class="left-icon-right-text">
              <span>${this.cancelLabel}</span>
            </div>
          </sc-button> -->
          ${
            this.compact || this.isMobile ? html`
              <sc-icon-button
                ?disabled=${!canSubmit || this._submitting}
                size="sm"
                name=send--fill
                @click=${this.handleSubmit}
              ></sc-icon-button>
            ` : html`
              <sc-button ?disabled=${!canSubmit || this._submitting} size="sm" @click=${this.handleSubmit}>
                <div class="left-icon-right-text">
                  <sc-icon name="send--fill" size="sm"></sc-icon>
                  <span>${this.primaryLabel}</span>
                </div>
              </sc-button>
            `
          }
        </div>
      </div>
    `;
  }
}
