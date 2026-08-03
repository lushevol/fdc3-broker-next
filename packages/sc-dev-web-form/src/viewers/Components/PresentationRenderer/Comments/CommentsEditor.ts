import { html } from 'lit';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';

export class CommentsEditor extends FormBaseEditor {

  renderOtherGeneral = () => {
    const { helpText, maxFilesPerComment, acceptedFileTypes, maxRepliesdepth, maxVisibleReplies } = this.component.template;
    return html`
      <div class=row>
        <sc-label label='Description'></sc-label>
        <sc-rich-text-editor-v2
          value=${helpText}
          .toolbar=${this.simpleToolbars}
          @sc-change=${(e: CustomEvent) => {
            this.onChange(e.detail.text, 'helpText');
            this.requestUpdate();
          }}
        >
        </sc-rich-text-editor-v2>
      </div>
      <div class=row>
        <sc-text-input
          label="Max files per comment"
          value=${maxFilesPerComment}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'maxFilesPerComment')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-text-input
          label="Accepted file types"
          placeholder="e.g., '.pdf,.jpg,.png'"
          value=${acceptedFileTypes}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'acceptedFileTypes')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-number-input
          label="Max repliesdepth"
          value=${maxRepliesdepth}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'maxRepliesdepth')}
        >
        </sc-number-input>
      </div>
      <div class=row>
        <sc-number-input
          label="Max visible replies"
          value=${maxVisibleReplies}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'maxVisibleReplies')}
        >
        </sc-number-input>
      </div>
    `;
  };

  renderBehavior = () => {
    const { 
      required, 
      readonly, 
      enableLike, 
      enableEdit, 
      enableShare, 
      enableReport, 
      enableAttachments, 
      enableDownloadAttachment, 
      allowMultipleFiles, 
      hideViewCondition, 
      hideSortBy,
     } = this.component.template;
    return html`
      <div>
        <div class=w-half>
          <sc-switch
            label="Required"
            ?checked=${required}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'required')}
          >
          </sc-switch>
        </div>
        <div class=w-half>
          <sc-switch
            label="Readonly"
            ?checked=${readonly}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'readonly')}
          >
          </sc-switch>
        </div>
      </div>
      <div>
        <div class=w-half>
          <sc-switch
            label="Like"
            ?checked=${enableLike}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'enableLike')}
          >
          </sc-switch>
        </div>
        <div class=w-half>
          <sc-switch
            label="Edit"
            ?checked=${enableEdit}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'enableEdit')}
          >
          </sc-switch>
        </div>
      </div>
      <div>
      <div class=w-half>
        <sc-switch
          label="Share"
          ?checked=${enableShare}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'enableShare')}
        >
        </sc-switch>
      </div>
      <div class=w-half>
        <sc-switch
          label="Report"
          ?checked=${enableReport}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'enableReport')}
        >
        </sc-switch>
      </div>
    </div>
    <div>
      <div class=w-half>
        <sc-switch
          label="Attachments"
          ?checked=${enableAttachments}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'enableAttachments')}
        >
        </sc-switch>
      </div>
    </div>
    <div>
      <div class=w-half>
        <sc-switch
          label="Download attachment"
          ?checked=${enableDownloadAttachment}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'enableDownloadAttachment')}
        >
        </sc-switch>
      </div>
    </div>
    <div>
      <div class=w-half>
        <sc-switch
          label="Allow multiple files"
          ?checked=${allowMultipleFiles}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'allowMultipleFiles')}
        >
        </sc-switch>
      </div>
    </div>
    <div>
      <div class=w-half>
        <sc-switch
          label="Hide view condition"
          ?checked=${hideViewCondition}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'hideViewCondition')}
        >
        </sc-switch>
      </div>
  </div>
  <div>
    <div class=w-half>
      <sc-switch
        label="Hide sort by"
        ?checked=${hideSortBy}
        @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'hideSortBy')}
      >
      </sc-switch>
    </div>
  </div>
    `;
  };

  renderStyleAndLayout = () => {
    const { labelSize } = this.component.template;
    return html`
    <div class=row>
      <sc-radio-group
        columns=3
        direction=horizontal
        label="Label size"
        value=${labelSize}
        @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'labelSize')}
      >
        <sc-radio value=sm>SM</sc-radio>
        <sc-radio value=md>MD</sc-radio>
        <sc-radio value=lg>LG</sc-radio>
      </sc-radio-group>
    </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
          <form-comments .component=${this.component} .key=${this.key}>
          </form-comments>
        `;
  };
}