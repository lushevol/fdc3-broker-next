import { registerCustomElement } from '@scdevkit/service-bench-core/react';

import { Home } from '../src/Home.jsx';
import homeCss from '../src/home.css';

registerCustomElement(Home, 'sb-<??= name ??>-home', [homeCss]);
