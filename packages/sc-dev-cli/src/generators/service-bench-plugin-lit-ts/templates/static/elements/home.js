import { Home } from '../src/Home.ts';
import { HomeContent } from '../src/components/HomeContent.ts';

window.customElements.define('sb-<??= name ??>-home', Home);
if (!window.customElements.get('sb-<??= name ??>-home-content')) {
    window.customElements.define('sb-<??= name ??>-home-content', HomeContent);
}

