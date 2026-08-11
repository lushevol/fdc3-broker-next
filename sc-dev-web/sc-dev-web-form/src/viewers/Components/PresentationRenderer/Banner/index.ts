import { Banner } from './Banner.js';
import { BannerEditor } from './BannerEditor.js';

if (!window.customElements.get('form-banner')) {
  window.customElements.define('form-banner', Banner);
}
if (!window.customElements.get('form-banner-editor')) {
  window.customElements.define('form-banner-editor', BannerEditor);
}
