import { Carousel } from './Carousel.js';
import { CarouselEditor } from './CarouselEditor.js';

if (!window.customElements.get('form-carousel')) {
  window.customElements.define('form-carousel', Carousel);
}
if (!window.customElements.get('form-carousel-editor')) {
  window.customElements.define('form-carousel-editor', CarouselEditor);
}
