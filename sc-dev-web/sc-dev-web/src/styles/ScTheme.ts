// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import lightSLCSS from '@shoelace-style/shoelace/dist/themes/light.styles.js';
import Styleguide from './ScStyleguide.js';
import GDSStyleguide from './ScGDSStyleGuide.js';

export default {
  getStyles() {
    return [lightSLCSS, Styleguide, GDSStyleguide];
  },
};
