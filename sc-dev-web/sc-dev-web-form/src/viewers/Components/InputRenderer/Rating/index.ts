import { Rating } from './Rating.js';
import { RatingEditor } from './RatingEditor.js';

if (!window.customElements.get('form-rating')) {
  window.customElements.define('form-rating', Rating);
}
if (!window.customElements.get('form-rating-editor')) {
  window.customElements.define('form-rating-editor', RatingEditor);
}