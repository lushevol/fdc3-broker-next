import { Home } from '../src/Home.js';
import { HomeContent } from '../src/components/HomeContent.js';

window.customElements.define('sb-<??= name ??>-home', Home);
if (!window.customElements.get('sb-<??= name ??>-home-content')) {
    window.customElements.define('sb-<??= name ??>-home-content', HomeContent);
}
