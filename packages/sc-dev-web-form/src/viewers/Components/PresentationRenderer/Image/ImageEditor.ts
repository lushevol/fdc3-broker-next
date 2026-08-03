import { html, nothing } from 'lit';
import { BaseEditor } from '../../common/BaseEditor.js';
export class ImageEditor extends BaseEditor {

  renderLabel = () => {
    return nothing;
  };

  renderOtherGeneral = () => {
    const { src, width, height, alt, link, imageType = 'url', files } = this.component.template;
    const imageSrcFile = (src && (!files || files?.length === 0)) 
      ? this.base64ToFile(src,'image.png') 
      : null;
    return html`
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
          value=${src}
          @sc-input=${(e: CustomEvent) => {
    this.onChange(e.detail.value, 'src');
  }}
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
            this.uploadFile('src', files[0]);
          }}
          selectable=${true}
          @sc-select=${(e: CustomEvent) => {
            this.downloadFile(src, e.detail.value?.name);
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
                this.downloadFile(src, 'image.png');
              }}>
            </sc-file-item>
          ` : nothing}
      </div>`}
      <div class=row>
        <sc-text-input
          label="Width"
          value=${width || '100%'}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'width')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-text-input
          label="Height"
          value=${height}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'height')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-text-input
          label="Alt"
          value=${alt}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'alt')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-text-input
          label="Link"
          value=${link}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'link')}
        >
        </sc-text-input>
      </div>`;
  };

  renderBasicComponent = () => {
    return html`
      <form-image .component=${this.component} .key=${this.key}>
      </form-image>
    `;
  };
}