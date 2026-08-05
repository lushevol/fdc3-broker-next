import { html, nothing } from 'lit';
import { BaseEditor } from '../../common/BaseEditor.js';
import { CompactSize } from '../../../../shared/utils.js';
export class BannerEditor extends BaseEditor {
  renderOtherGeneral = () => {
    const { body, imageSrc, imageType, files } = this.component.template;
    const imageSrcFile = (imageSrc && (!files || files?.length === 0)) 
      ? this.base64ToFile(imageSrc,'image.png') 
      : null;
      
    return html`
      <div class=row>
        <sc-label label='Body'></sc-label>
        <sc-rich-text-editor-v2
          value=${body}
          .toolbar=${[
    'undo',
    'redo',
    'separate',
    'fontstyle',
    'separate',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'backcolor',
    'forecolor',
    'clear',
    'separate',
    'alignleft',
    'aligncenter',
    'alignright',
    'separate',
    'addlink',
    'unlink',
  ]}
          @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.text, 'body');
    this.requestUpdate();
  }}
        >
        </sc-rich-text-editor-v2>
      </div>
      <div class=row>
        <sc-dropdown-input
          label="Image"
          hoist
          value=${imageType}
          @sc-select=${(e: CustomEvent) => {
    this.onChange(e.detail.value, 'imageType');
    this.requestUpdate();
  }}
        >
          <sc-dropdown-option value='upload'>Upload</sc-dropdown-option>
          <sc-dropdown-option value='url'>URL</sc-dropdown-option>
        </sc-dropdown-input>
      </div>
      ${imageType === 'url' ? html`
        <div class=row>
          <sc-text-input
            value=${imageSrc}
            @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'imageSrc')}
          >
          </sc-text-input>
        </div>` : html`
        <div class=row>
          <sc-file-input
            deletable
            placeholder= "Click or drop file here"
            .value=${files}
            @sc-change= ${(e: CustomEvent) => {
              const files = e.detail.value;
              this.uploadFile('imageSrc', files[0]);
            }}
            selectable=${true}
            @sc-select=${(e: CustomEvent) => {
              if (files[0]) {
                this.downloadFile(imageSrc, e.detail.value?.name);
              }
            }}
          >
          </sc-file-input>
          ${imageSrcFile?.id && !files ? html`
            <sc-file-item  width=auto 
              selectable
              no-border
              file-id=${imageSrcFile?.id} 
              name=${imageSrcFile?.file?.name} 
              size=${imageSrcFile?.file?.size}
              @sc-select=${(e: CustomEvent) => {
                this.downloadFile(imageSrc, 'image.png');
              }}>
            </sc-file-item>
          ` : nothing}
        </div>`}
      
    `;
  };

  renderStyleAndLayout = () => {
    const { titleSize = 'xl', bodySize = 'sm', spaceSize = 'md', backgroundColor = 'gradient-blue', textAlignment = 'left', imagePosition = 'right' } = this.component.template;
    return html`
      <div  class=row>
        <sc-radio-group
          columns=3
          label="Title size"
          direction=horizontal
          value=${titleSize}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'titleSize')}
        >
          ${
  CompactSize.concat('xl').map((size: string) => html`<sc-radio value=${size}>${size.toUpperCase()}</sc-radio>`)
}
        </sc-radio-group>
      </div>
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Body size"
          value=${bodySize}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'bodySize')}
        >
          ${
  CompactSize.concat('xl').map((size: string) => html`<sc-radio value=${size}>${size.toUpperCase()}</sc-radio>`)
}
        </sc-radio-group>
      </div>
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Space size"
          value=${spaceSize}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'spaceSize')}
        >
          ${
  CompactSize.concat('xl').map((size: string) => html`<sc-radio value=${size}>${size.toUpperCase()}</sc-radio>`)
}
        </sc-radio-group>
      </div>
      <div class=row>
        <sc-radio-group
          columns=2
          direction=horizontal
          label="Background color"
          value=${backgroundColor}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'backgroundColor')}
        >
          <sc-radio value=gradient-blue>Gradient</sc-radio>
          <sc-radio value=alt-blue>Alternate</sc-radio>
          <sc-radio value=light-blue>Light</sc-radio>
          <sc-radio value=dark-blue>Dark</sc-radio>
          <sc-radio value=white>White</sc-radio>
        </sc-radio-group>
      </div>
      <div class=row>
        <sc-radio-group
          columns=2
          direction=horizontal
          label="Text alignment"
          value=${textAlignment}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'textAlignment')}
        >
          <sc-radio value=left>Left</sc-radio>
          <sc-radio value=center>Center</sc-radio>
          <sc-radio value=right>Right</sc-radio>
          <sc-radio value=justify>Justify</sc-radio>
        </sc-radio-group>
      </div>
      <div class=row>
        <sc-radio-group
          columns=2
          direction=horizontal
          label="Image position"
          value=${imagePosition}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'imagePosition')}
        >
          <sc-radio value=left>Left</sc-radio>
          <sc-radio value=right>Right</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
          <form-banner .component=${this.component} .key=${this.key}>
          </form-banner>
        `;
  };
}