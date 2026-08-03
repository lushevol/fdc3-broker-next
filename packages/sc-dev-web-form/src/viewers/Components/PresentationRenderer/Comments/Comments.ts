import { PropertyValueMap, html, nothing } from 'lit';
import { query } from 'lit/decorators.js';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class Comments extends FormBaseViewer {
  @query('sc-comment') _commentElement: any;

  protected async firstUpdated() {
    await this.updateComplete;
    const commentElement = this._commentElement?.shadowRoot?.querySelector('.root-input');
    const { readonly } = this.template;
    if (commentElement) {
      if (readonly || this.readonly) {
        commentElement.style.display = 'none';
      } else {
        commentElement.style.display = '';
      }
    }
  }

  _onValueChange(e: CustomEvent) {
    if (this.onValueChange) {
      this.onValueChange(e.detail?.allComments);
    } else if (this._formAction?.onValueChange) {
      this._formAction?.onValueChange({ detail: {
        value: e.detail?.allComments,
        component: this.component,
      } });
    }
  }

  renderElement() {
    const { 
      label, 
      labelSize,
      readonly, 
      required, 
      tooltip, 
      helpText,
      enableLike,
      enableEdit,
      enableShare,
      enableReport,
      enableAttachments, 
      enableDownloadAttachment, 
      allowMultipleFiles, 
      hideViewCondition,
      hideSortBy,
      maxRepliesdepth,
      maxVisibleReplies,
      value,
      defaultValue,
    } = this.template;

    const userInfo = {
      bankdid: this._user?.id,
      name: `${this._user?.firstName} ${this._user?.lastName}`,
    };

    return html`
    <div>
        <sc-label
          label=${label}
          label-size=${labelSize}
          tooltip=${tooltip}
          ?required=${required}
        ></sc-label>
        <sc-comment
          .userInfo=${userInfo}
          .comments=${value || defaultValue || []}
          ?readonly=${readonly || this.readonly}
          ?enable-like=${enableLike}
          ?enable-edit=${enableEdit}
          ?enable-share=${enableShare}
          ?enable-report=${enableReport}
          ?enable-attachments=${enableAttachments}
          ?enable-download-attachment=${enableDownloadAttachment}
          ?allow-multiple-files=${allowMultipleFiles}
          ?hide-view-condition=${hideViewCondition}
          ?hide-sort-by=${hideSortBy}
          .maxRepliesdepth=${maxRepliesdepth}
          .maxVisibleReplies=${maxVisibleReplies}
          @sc-change=${(e: any) => {
            this._onValueChange(e);
          }}
        ></sc-comment>
        <sc-label>
          <div slot="label" >
            <div class="sc-label-wrapper">
              <div class="sc-label-text" style='font-size: 0.625rem'>${ unsafeHTML(helpText) }</div>
            </div>
          </div>
        </sc-label>
      </div>
    `;
  }
 
}