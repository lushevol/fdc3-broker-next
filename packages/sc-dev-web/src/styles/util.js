import { css } from 'lit';

export default css`
:root {
  --sc-color-white: #ffffff;
  --sc-color-black: #000000;
  --sc-color-white-rgb: 255, 255, 255;
  --sc-color-black-rgb: 0, 0, 0;
  /* grey start */
  --sc-color-grey-50: #F2F2F2;
  --sc-color-grey-100: #E5E5E5;
  --sc-color-grey-150: #D9D9D9;
  --sc-color-grey-200: #CCCCCC;
  --sc-color-grey-250: #BFBFBF;
  --sc-color-grey-300: #B2B2B2;
  --sc-color-grey-350: #A6A6A6;
  --sc-color-grey-400: #999999;
  --sc-color-grey-450: #8C8C8C;
  --sc-color-grey-500: #808080;
  --sc-color-grey-550: #737373;
  --sc-color-grey-600: #666666;
  --sc-color-grey-650: #595959;
  --sc-color-grey-700: #4D4D4D;
  --sc-color-grey-750: #404040;
  --sc-color-grey-800: #333333;
  --sc-color-grey-850: #262626;
  --sc-color-grey-900: #1A1A1A;
  --sc-color-grey-950: #0D0D0D;
  --sc-color-grey-50-dark: #0D0D0D;
  --sc-color-grey-100-dark: #1A1A1A;
  --sc-color-grey-150-dark: #262626;
  --sc-color-grey-200-dark: #333333;
  --sc-color-grey-250-dark: #404040;
  --sc-color-grey-300-dark: #4D4D4D;
  --sc-color-grey-350-dark: #595959;
  --sc-color-grey-400-dark: #666666;
  --sc-color-grey-450-dark: #737373;
  --sc-color-grey-500-dark: #808080;
  --sc-color-grey-550-dark: #8C8C8C;
  --sc-color-grey-600-dark: #999999;
  --sc-color-grey-650-dark: #A6A6A6;
  --sc-color-grey-700-dark: #B2B2B2;
  --sc-color-grey-750-dark: #BFBFBF;
  --sc-color-grey-800-dark: #CCCCCC;
  --sc-color-grey-850-dark: #D9D9D9;
  --sc-color-grey-900-dark: #E5E5E5;
  --sc-color-grey-950-dark: #F2F2F2;
  /* grey rgb version with same HEX value */
  --sc-color-grey-50-rgb: 242, 242, 242;
  /* grey end */
  /* blue start */
  --sc-color-blue-50: #E5F1FC;
  --sc-color-blue-100: #CCE3FA;
  --sc-color-blue-150: #B3D5F8;
  --sc-color-blue-200: #9AC7F6;
  --sc-color-blue-250: #81B9F4;
  --sc-color-blue-300: #68ABF2;
  --sc-color-blue-350: #4F9DF0;
  --sc-color-blue-400: #368FEE;
  --sc-color-blue-450: #1D81EC;
  --sc-color-blue-460: #007AFF;
  --sc-color-blue-500: #0473EA;
  --sc-color-blue-550: #0367D2;
  --sc-color-blue-600: #035CBB;
  --sc-color-blue-650: #0250A3;
  --sc-color-blue-700: #02458C;
  --sc-color-blue-750: #023975;
  --sc-color-blue-800: #012E5D;
  --sc-color-blue-850: #012246;
  --sc-color-blue-900: #00172E;
  --sc-color-blue-950: #000B17;
  --sc-color-blue-50-dark: #000B17;
  --sc-color-blue-100-dark: #00172E;
  --sc-color-blue-150-dark: #012246;
  --sc-color-blue-200-dark: #012E5D;
  --sc-color-blue-250-dark: #023975;
  --sc-color-blue-300-dark: #02458C;
  --sc-color-blue-350-dark: #0250A3;
  --sc-color-blue-400-dark: #035CBB;
  --sc-color-blue-450-dark: #0367D2;
  --sc-color-blue-500-dark: #0473EA;
  --sc-color-blue-550-dark: #1D81EC;
  --sc-color-blue-600-dark: #368FEE;
  --sc-color-blue-650-dark: #4F9DF0;
  --sc-color-blue-700-dark: #68ABF2;
  --sc-color-blue-750-dark: #81B9F4;
  --sc-color-blue-800-dark: #9AC7F6;
  --sc-color-blue-850-dark: #B3D5F8;
  --sc-color-blue-900-dark: #CCE3FA;
  --sc-color-blue-950-dark: #E5F1FC;
  /* blue rgb version with same HEX value */
  --sc-color-blue-900-rgb: 0, 23, 46;
  --sc-color-blue-gradient-alt: #254498;
  /* blue end */
  /* green start */
  --sc-color-green-50: #EBFBE6;
  --sc-color-green-100: #D7F7CD;
  --sc-color-green-150: #C3F3B4;
  --sc-color-green-200: #AFEF9B;
  --sc-color-green-250: #9BEB82;
  --sc-color-green-300: #87E769;
  --sc-color-green-350: #73E350;
  --sc-color-green-400: #5FDF37;
  --sc-color-green-450: #4BDB1E;
  --sc-color-green-500: #38D200;
  --sc-color-green-550: #32BD00;
  --sc-color-green-600: #2CA800;
  --sc-color-green-650: #269300;
  --sc-color-green-700: #207E00;
  --sc-color-green-750: #1A6900;
  --sc-color-green-800: #145400;
  --sc-color-green-850: #0E3F00;
  --sc-color-green-900: #082A00;
  --sc-color-green-950: #021500;
  --sc-color-green-50-dark: #021500;
  --sc-color-green-100-dark: #082A00;
  --sc-color-green-150-dark: #0E3F00;
  --sc-color-green-200-dark: #145400;
  --sc-color-green-250-dark: #1A6900;
  --sc-color-green-300-dark: #207E00;
  --sc-color-green-350-dark: #269300;
  --sc-color-green-400-dark: #2CA800;
  --sc-color-green-450-dark: #32BD00;
  --sc-color-green-500-dark: #38D200;
  --sc-color-green-550-dark: #4BDB1E;
  --sc-color-green-600-dark: #5FDF37;
  --sc-color-green-650-dark: #73E350;
  --sc-color-green-700-dark: #87E769;
  --sc-color-green-750-dark: #9BEB82;
  --sc-color-green-800-dark: #AFEF9B;
  --sc-color-green-850-dark: #C3F3B4;
  --sc-color-green-900-dark: #D7F7CD;
  --sc-color-green-950-dark: #EBFBE6;
  /* green end */
  /* amber start */
  --sc-color-amber-50: #FEF6E7;
  --sc-color-amber-100: #FEEFD0;
  --sc-color-amber-150: #FDE6B8;
  --sc-color-amber-200: #FDDEA1;
  --sc-color-amber-250: #FDD689;
  --sc-color-amber-300: #FCCE72;
  --sc-color-amber-350: #FCC65B;
  --sc-color-amber-400: #FBBD43;
  --sc-color-amber-450: #FAB52C;
  --sc-color-amber-500: #FAAD14;
  --sc-color-amber-550: #E19C12;
  --sc-color-amber-600: #C88A10;
  --sc-color-amber-650: #AF790E;
  --sc-color-amber-700: #96680C;
  --sc-color-amber-750: #7D570A;
  --sc-color-amber-800: #644508;
  --sc-color-amber-850: #4B3406;
  --sc-color-amber-900: #322304;
  --sc-color-amber-950: #191102;
  --sc-color-amber-50-dark: #191102;
  --sc-color-amber-100-dark: #322304;
  --sc-color-amber-150-dark: #4B3406;
  --sc-color-amber-200-dark: #644508;
  --sc-color-amber-250-dark: #7D570A;
  --sc-color-amber-300-dark: #96680C;
  --sc-color-amber-350-dark: #AF790E;
  --sc-color-amber-400-dark: #C88A10;
  --sc-color-amber-450-dark: #E19C12;
  --sc-color-amber-500-dark: #FAAD14;
  --sc-color-amber-550-dark: #FAB52C;
  --sc-color-amber-600-dark: #FBBD43;
  --sc-color-amber-650-dark: #FCC65B;
  --sc-color-amber-700-dark: #FCCE72;
  --sc-color-amber-750-dark: #FDD689;
  --sc-color-amber-800-dark: #FDDEA1;
  --sc-color-amber-850-dark: #FDE6B8;
  --sc-color-amber-900-dark: #FEEFD0;
  --sc-color-amber-950-dark: #FEF6E7;
  /* amber end */
  /* orange start */
  --sc-color-orange-50: #FFF0E8;
  --sc-color-orange-100: #FFEFE6;
  --sc-color-orange-150: #FFDECD;
  --sc-color-orange-200: #FFCEB4;
  --sc-color-orange-250: #FFBE9C;
  --sc-color-orange-300: #FFAD84;
  --sc-color-orange-350: #FD9D6C;
  --sc-color-orange-400: #F98C55;
  --sc-color-orange-450: #F47B3D;
  --sc-color-orange-500: #EF6923;
  --sc-color-orange-550: #D65E1F;
  --sc-color-orange-600: #B9511B;
  --sc-color-orange-650: #974216;
  --sc-color-orange-700: #6B2F10;
  /* orange end */
  /* teal start */
  --sc-color-teal-50: #E8FAFC;
  --sc-color-teal-100: #D1F6F9;
  --sc-color-teal-150: #BAF1F7;
  --sc-color-teal-200: #A3EDF4;
  --sc-color-teal-250: #8CE9F2;
  --sc-color-teal-300: #75E4EF;
  --sc-color-teal-350: #5EE0EC;
  --sc-color-teal-400: #47DBEA;
  --sc-color-teal-450: #30D7E7;
  --sc-color-teal-500: #1AD3E5;
  --sc-color-teal-550: #17BDCE;
  --sc-color-teal-600: #14A8B7;
  --sc-color-teal-650: #1293A0;
  --sc-color-teal-700: #0F7E89;
  --sc-color-teal-750: #0D6972;
  --sc-color-teal-800: #0A545B;
  --sc-color-teal-850: #073F44;
  --sc-color-teal-900: #052A2D;
  --sc-color-teal-950: #021516;
  /* teal end */
  /* red start */
  --sc-color-red-50: #FCE6E7;
  --sc-color-red-100: #F9CED0;
  --sc-color-red-150: #F6B5B8;
  --sc-color-red-200: #F39DA1;
  --sc-color-red-250: #EF848A;
  --sc-color-red-300: #EC6C73;
  --sc-color-red-350: #E9545B;
  --sc-color-red-400: #E63B44;
  --sc-color-red-450: #E3232C;
  --sc-color-red-500: #E00A15;
  --sc-color-red-550: #CA0913;
  --sc-color-red-600: #B30811;
  --sc-color-red-650: #9D070F;
  --sc-color-red-700: #86060D;
  --sc-color-red-750: #70050B;
  --sc-color-red-800: #5A0408;
  --sc-color-red-850: #430306;
  --sc-color-red-900: #2D0204;
  --sc-color-red-950: #160102;
  --sc-color-red-50-dark: #160102;
  --sc-color-red-100-dark: #2D0204;
  --sc-color-red-150-dark: #430306;
  --sc-color-red-200-dark: #5A0408;
  --sc-color-red-250-dark: #70050B;
  --sc-color-red-300-dark: #86060D;
  --sc-color-red-350-dark: #9D070F;
  --sc-color-red-400-dark: #B30811;
  --sc-color-red-450-dark: #CA0913;
  --sc-color-red-500-dark: #E00A15;
  --sc-color-red-550-dark: #E3232C;
  --sc-color-red-600-dark: #E63B44;
  --sc-color-red-650-dark: #E9545B;
  --sc-color-red-700-dark: #EC6C73;
  --sc-color-red-750-dark: #EF848A;
  --sc-color-red-800-dark: #F39DA1;
  --sc-color-red-850-dark: #F6B5B8;
  --sc-color-red-900-dark: #F9CED0;
  --sc-color-red-950-dark: #FCE6E7;
  /* red end */
  /* purple start */
  --sc-color-purple-50: #F2E8FE;
  --sc-color-purple-100: #E5D1FE;
  --sc-color-purple-150: #D8BBFD;
  --sc-color-purple-200: #CBA4FD;
  --sc-color-purple-250: #BE8EFD;
  --sc-color-purple-300: #B177FC;
  --sc-color-purple-350: #A460FC;
  --sc-color-purple-400: #974AFB;
  --sc-color-purple-450: #8A33FB;
  --sc-color-purple-500: #7E1DFB;
  --sc-color-purple-550: #711AE1;
  --sc-color-purple-600: #6417C8;
  --sc-color-purple-650: #5814AF;
  --sc-color-purple-700: #4B1196;
  --sc-color-purple-750: #3F0E7D;
  --sc-color-purple-800: #320B64;
  --sc-color-purple-850: #25084B;
  --sc-color-purple-900: #190532;
  --sc-color-purple-950: #0C0219;
  --sc-color-purple-50-dark: #0C0219;
  --sc-color-purple-100-dark: #190532;
  --sc-color-purple-150-dark: #25084B;
  --sc-color-purple-200-dark: #320B64;
  --sc-color-purple-250-dark: #3F0E7D;
  --sc-color-purple-300-dark: #4B1196;
  --sc-color-purple-350-dark: #5814AF;
  --sc-color-purple-400-dark: #6417C8;
  --sc-color-purple-450-dark: #711AE1;
  --sc-color-purple-550-dark: #8A33FB;
  --sc-color-purple-600-dark: #974AFB;
  --sc-color-purple-650-dark: #A460FC;
  --sc-color-purple-700-dark: #B177FC;
  --sc-color-purple-750-dark: #BE8EFD;
  --sc-color-purple-800-dark: #CBA4FD;
  --sc-color-purple-850-dark: #D8BBFD;
  --sc-color-purple-900-dark: #E5D1FE;
  --sc-color-purple-950-dark: #F2E8FE;
  /* purple end */
  /* violet start */
  --sc-color-violet-50: #F3F3F9;
  --sc-color-violet-100: #EFEFF7;
  --sc-color-violet-150: #DEDEEF;
  --sc-color-violet-200: #CBCBE7;
  --sc-color-violet-250: #B6B6DE;
  --sc-color-violet-300: #ABABE1;
  --sc-color-violet-350: #9F9FD5;
  --sc-color-violet-400: #8383CC;
  --sc-color-violet-450: #6D6DCA;
  --sc-color-violet-500: #4848BD;
  --sc-color-violet-550: #4646B7;
  --sc-color-violet-600: #4040A9;
  --sc-color-violet-650: #3B3B9A;
  --sc-color-violet-700: #35358A;
  --sc-color-violet-750: #2E2E78;
  --sc-color-violet-800: #252561;
  --sc-color-violet-850: #1E1E4F;
  --sc-color-violet-900: #1A1A45;
  /* violet end */
  /* magenta start */
  --sc-color-magenta-50: #FDE7F1;
  --sc-color-magenta-100: #FBCFE4;
  --sc-color-magenta-150: #F9B7D7;
  --sc-color-magenta-200: #F89FCA;
  --sc-color-magenta-250: #F688BD;
  --sc-color-magenta-300: #F470AF;
  --sc-color-magenta-350: #F358A2;
  --sc-color-magenta-400: #F14095;
  --sc-color-magenta-450: #EF2888;
  --sc-color-magenta-500: #EE117B;
  --sc-color-magenta-550: #D60F6E;
  --sc-color-magenta-600: #BE0D62;
  --sc-color-magenta-650: #A60B56;
  --sc-color-magenta-700: #8E0A49;
  --sc-color-magenta-750: #77083D;
  --sc-color-magenta-800: #5F0631;
  --sc-color-magenta-850: #470524;
  --sc-color-magenta-900: #2F0318;
  --sc-color-magenta-950: #17010C;
  /* magenta end */
  /* olive start */
  --sc-color-olive-50: #F7F9EB;
  --sc-color-olive-100: #F0F3D7;
  --sc-color-olive-150: #E8EEC3;
  --sc-color-olive-200: #E1E8AF;
  --sc-color-olive-250: #DAE39B;
  --sc-color-olive-300: #D2DD87;
  --sc-color-olive-350: #CBD773;
  --sc-color-olive-400: #C3D25F;
  --sc-color-olive-450: #BCCC4B;
  --sc-color-olive-500: #B5C738;
  --sc-color-olive-550: #A2B332;
  --sc-color-olive-600: #909F2C;
  --sc-color-olive-650: #7E8B27;
  --sc-color-olive-700: #6C7721;
  --sc-color-olive-750: #5A631C;
  --sc-color-olive-800: #484F16;
  --sc-color-olive-850: #363B10;
  --sc-color-olive-900: #24270B;
  --sc-color-olive-950: #121305;
  /* olive end */
  /* brand colour start */
  --sc-brand-gradient: linear-gradient(90deg, #2C3A88 0%, #0061C8 99.74%);
  --sc-brand-grey: #525355;
  /* brand colour end */
  /* system test shades start */
  --sc-shades-orange-500: #EF6923;
  --sc-shades-teal-500: #0F7E89;
  --sc-shades-purple-500: #4848BD;
  /* system test shades end */
  /* spacing start */
  --sc-spacing-0: 0px;
  --sc-spacing-4: 0.25rem;
  --sc-spacing-8: 0.5rem;
  --sc-spacing-12: 0.75rem;
  --sc-spacing-16: 1rem;
  --sc-spacing-20: 1.25rem;
  --sc-spacing-24: 1.5rem;
  --sc-spacing-32: 2rem;
  --sc-spacing-40: 2.5rem;
  --sc-spacing-48: 3rem;
  --sc-spacing-56: 3.5rem;
  --sc-spacing-64: 4rem;
  /* spacing end */
  /* Screens */
  --sc-screen-xs: 0;
  --sc-screen-sm: 540px;
  --sc-screen-md: 720px;
  --sc-screen-lg: 960px;
  --sc-screen-xl: 1140px;
  --sc-screen-xxl: 1736px;
  /* Radius */
  --sc-radius-none: 0;
  --sc-radius-sm: 0.25rem;
  --sc-radius-md: 0.5rem;
  --sc-radius-lg: 1rem;
  --sc-radius-xl: 2rem;
  --sc-radius-2xl: 8rem;
  --sc-radius-3xl: 22.5rem;
}

*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(147 197 253 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(147 197 253 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
}

.container {
  width: 100%;
}

@media (min-width: var(--sc-screen-xs)) {
  .container {
    max-width: var(--sc-screen-xs);
  }
}

@media (min-width: var(--sc-screen-sm)) {
  .container {
    max-width: var(--sc-screen-sm);
  }
}

@media (min-width: var(--sc-screen-md)) {
  .container {
    max-width: var(--sc-screen-md);
  }
}

@media (min-width: var(--sc-screen-lg)) {
  .container {
    max-width: var(--sc-screen-lg);
  }
}

@media (min-width: var(--sc-screen-xl)) {
  .container {
    max-width: var(--sc-screen-xl);
  }
}

@media (min-width: var(--sc-screen-xxl)) {
  .container {
    max-width: var(--sc-screen-xxl);
  }
}

/* text style start */

h1,
.h1 {
  line-height: 1.6;
  font-size: 2.5rem;
}

h2,
.h2 {
  line-height: 1.25;
  font-size: 2rem;
}

h3,
.h3 {
  line-height: 1.33;
  font-size: 1.5rem;
}

h4,
.h4 {
  line-height: 1.4;
  font-weight: 700;
  font-size: 1.25rem;
}

h5,
.h5 {
  line-height: 1.4;
  font-size: 1.25rem;
}

h6,
.h6 {
  font-size: 1rem;
}

small {
  font-size: 0.75rem;
  line-height: 1.33;
}

a {
  font-weight: 600;
}

.font-weight {
  font-weight: 600;
}

.font-hero-numerals {
  font-feature-settings: "ss01" on;
}

.hero {
  font-size: 3.75rem;
  font-weight: 600;
  line-height: 1.33;
}

.lead {
  line-height: 1.4;
}

.subtitle {
  font-size: 0.875rem;
  line-height: 1.4;
}

.header-1200 {
  font-size: 3.5rem;
  line-height: 1.2857;
}

.header-1000 {
  font-size: 3rem;
  line-height: 1.3333;
}

.header-800 {
  font-size: 2.5rem;
  line-height: 1.4;
}

.header-600 {
  font-size: 2rem;
  line-height: 1.5;
}

.header-500 {
  font-size: 1.75rem;
  line-height: 1.5714;
}

.header-350 {
  font-size: 1.375rem;
  line-height: 1.7272;
}

.header-250 {
  font-size: 1.125rem;
  line-height: 1.8888;
}

.body-250 {
  font-size: 1.125rem;
  line-height: 1.4444;
}

.body-200 {
  font-size: 1rem;
  line-height: 1.5;
}

.body-150 {
  font-size: 0.875rem;
  line-height: 1.5714;
}

.body-100 {
  font-size: 0.75rem;
  line-height: 1.6666;
}

.body-50 {
  font-size: 0.625rem;
  line-height: 1.8;
}

pre,
code,
kbd,
samp {
  white-space: pre-wrap;
  /* Since CSS 2.1 */
  white-space: -moz-pre-wrap;
  /* Mozilla, since 1999 */
  white-space: -pre-wrap;
  /* Opera 4-6 */
  white-space: -o-pre-wrap;
  /* Opera 7 */
  word-wrap: break-word;
  /* Internet Explorer 5.5+ */
  line-height: 1.33;
}

/* Bootstrap 4.4 classes */

.text-break {
  word-break: break-word !important;
  overflow-wrap: break-word !important;
}

.text-medium {
  font-size: 0.85em;
}

/* text style end */

.-inset-0 {
  inset: calc(var(--sc-spacing-0) * -1);
}

.-inset-1\/2 {
  inset: -50%;
}

.-inset-1\/3 {
  inset: -33.333333%;
}

.-inset-1\/4 {
  inset: -25%;
}

.-inset-12 {
  inset: calc(var(--sc-spacing-12) * -1);
}

.-inset-16 {
  inset: calc(var(--sc-spacing-16) * -1);
}

.-inset-2\/3 {
  inset: -66.666667%;
}

.-inset-2\/4 {
  inset: -50%;
}

.-inset-20 {
  inset: calc(var(--sc-spacing-20) * -1);
}

.-inset-24 {
  inset: calc(var(--sc-spacing-24) * -1);
}

.-inset-3\/4 {
  inset: -75%;
}

.-inset-32 {
  inset: calc(var(--sc-spacing-32) * -1);
}

.-inset-4 {
  inset: calc(var(--sc-spacing-4) * -1);
}

.-inset-40 {
  inset: calc(var(--sc-spacing-40) * -1);
}

.-inset-48 {
  inset: calc(var(--sc-spacing-48) * -1);
}

.-inset-56 {
  inset: calc(var(--sc-spacing-56) * -1);
}

.-inset-64 {
  inset: calc(var(--sc-spacing-64) * -1);
}

.-inset-8 {
  inset: calc(var(--sc-spacing-8) * -1);
}

.-inset-full {
  inset: -100%;
}

.inset-0 {
  inset: var(--sc-spacing-0);
}

.inset-1\/2 {
  inset: 50%;
}

.inset-1\/3 {
  inset: 33.333333%;
}

.inset-1\/4 {
  inset: 25%;
}

.inset-12 {
  inset: var(--sc-spacing-12);
}

.inset-16 {
  inset: var(--sc-spacing-16);
}

.inset-2\/3 {
  inset: 66.666667%;
}

.inset-2\/4 {
  inset: 50%;
}

.inset-20 {
  inset: var(--sc-spacing-20);
}

.inset-24 {
  inset: var(--sc-spacing-24);
}

.inset-3\/4 {
  inset: 75%;
}

.inset-32 {
  inset: var(--sc-spacing-32);
}

.inset-4 {
  inset: var(--sc-spacing-4);
}

.inset-40 {
  inset: var(--sc-spacing-40);
}

.inset-48 {
  inset: var(--sc-spacing-48);
}

.inset-56 {
  inset: var(--sc-spacing-56);
}

.inset-64 {
  inset: var(--sc-spacing-64);
}

.inset-8 {
  inset: var(--sc-spacing-8);
}

.inset-auto {
  inset: auto;
}

.inset-full {
  inset: 100%;
}

.-inset-x-0 {
  left: calc(var(--sc-spacing-0) * -1);
  right: calc(var(--sc-spacing-0) * -1);
}

.-inset-x-1\/2 {
  left: -50%;
  right: -50%;
}

.-inset-x-1\/3 {
  left: -33.333333%;
  right: -33.333333%;
}

.-inset-x-1\/4 {
  left: -25%;
  right: -25%;
}

.-inset-x-12 {
  left: calc(var(--sc-spacing-12) * -1);
  right: calc(var(--sc-spacing-12) * -1);
}

.-inset-x-16 {
  left: calc(var(--sc-spacing-16) * -1);
  right: calc(var(--sc-spacing-16) * -1);
}

.-inset-x-2\/3 {
  left: -66.666667%;
  right: -66.666667%;
}

.-inset-x-2\/4 {
  left: -50%;
  right: -50%;
}

.-inset-x-20 {
  left: calc(var(--sc-spacing-20) * -1);
  right: calc(var(--sc-spacing-20) * -1);
}

.-inset-x-24 {
  left: calc(var(--sc-spacing-24) * -1);
  right: calc(var(--sc-spacing-24) * -1);
}

.-inset-x-3\/4 {
  left: -75%;
  right: -75%;
}

.-inset-x-32 {
  left: calc(var(--sc-spacing-32) * -1);
  right: calc(var(--sc-spacing-32) * -1);
}

.-inset-x-4 {
  left: calc(var(--sc-spacing-4) * -1);
  right: calc(var(--sc-spacing-4) * -1);
}

.-inset-x-40 {
  left: calc(var(--sc-spacing-40) * -1);
  right: calc(var(--sc-spacing-40) * -1);
}

.-inset-x-48 {
  left: calc(var(--sc-spacing-48) * -1);
  right: calc(var(--sc-spacing-48) * -1);
}

.-inset-x-56 {
  left: calc(var(--sc-spacing-56) * -1);
  right: calc(var(--sc-spacing-56) * -1);
}

.-inset-x-64 {
  left: calc(var(--sc-spacing-64) * -1);
  right: calc(var(--sc-spacing-64) * -1);
}

.-inset-x-8 {
  left: calc(var(--sc-spacing-8) * -1);
  right: calc(var(--sc-spacing-8) * -1);
}

.-inset-x-full {
  left: -100%;
  right: -100%;
}

.-inset-y-0 {
  top: calc(var(--sc-spacing-0) * -1);
  bottom: calc(var(--sc-spacing-0) * -1);
}

.-inset-y-1\/2 {
  top: -50%;
  bottom: -50%;
}

.-inset-y-1\/3 {
  top: -33.333333%;
  bottom: -33.333333%;
}

.-inset-y-1\/4 {
  top: -25%;
  bottom: -25%;
}

.-inset-y-12 {
  top: calc(var(--sc-spacing-12) * -1);
  bottom: calc(var(--sc-spacing-12) * -1);
}

.-inset-y-16 {
  top: calc(var(--sc-spacing-16) * -1);
  bottom: calc(var(--sc-spacing-16) * -1);
}

.-inset-y-2\/3 {
  top: -66.666667%;
  bottom: -66.666667%;
}

.-inset-y-2\/4 {
  top: -50%;
  bottom: -50%;
}

.-inset-y-20 {
  top: calc(var(--sc-spacing-20) * -1);
  bottom: calc(var(--sc-spacing-20) * -1);
}

.-inset-y-24 {
  top: calc(var(--sc-spacing-24) * -1);
  bottom: calc(var(--sc-spacing-24) * -1);
}

.-inset-y-3\/4 {
  top: -75%;
  bottom: -75%;
}

.-inset-y-32 {
  top: calc(var(--sc-spacing-32) * -1);
  bottom: calc(var(--sc-spacing-32) * -1);
}

.-inset-y-4 {
  top: calc(var(--sc-spacing-4) * -1);
  bottom: calc(var(--sc-spacing-4) * -1);
}

.-inset-y-40 {
  top: calc(var(--sc-spacing-40) * -1);
  bottom: calc(var(--sc-spacing-40) * -1);
}

.-inset-y-48 {
  top: calc(var(--sc-spacing-48) * -1);
  bottom: calc(var(--sc-spacing-48) * -1);
}

.-inset-y-56 {
  top: calc(var(--sc-spacing-56) * -1);
  bottom: calc(var(--sc-spacing-56) * -1);
}

.-inset-y-64 {
  top: calc(var(--sc-spacing-64) * -1);
  bottom: calc(var(--sc-spacing-64) * -1);
}

.-inset-y-8 {
  top: calc(var(--sc-spacing-8) * -1);
  bottom: calc(var(--sc-spacing-8) * -1);
}

.-inset-y-full {
  top: -100%;
  bottom: -100%;
}

.inset-x-0 {
  left: var(--sc-spacing-0);
  right: var(--sc-spacing-0);
}

.inset-x-1\/2 {
  left: 50%;
  right: 50%;
}

.inset-x-1\/3 {
  left: 33.333333%;
  right: 33.333333%;
}

.inset-x-1\/4 {
  left: 25%;
  right: 25%;
}

.inset-x-12 {
  left: var(--sc-spacing-12);
  right: var(--sc-spacing-12);
}

.inset-x-16 {
  left: var(--sc-spacing-16);
  right: var(--sc-spacing-16);
}

.inset-x-2\/3 {
  left: 66.666667%;
  right: 66.666667%;
}

.inset-x-2\/4 {
  left: 50%;
  right: 50%;
}

.inset-x-20 {
  left: var(--sc-spacing-20);
  right: var(--sc-spacing-20);
}

.inset-x-24 {
  left: var(--sc-spacing-24);
  right: var(--sc-spacing-24);
}

.inset-x-3\/4 {
  left: 75%;
  right: 75%;
}

.inset-x-32 {
  left: var(--sc-spacing-32);
  right: var(--sc-spacing-32);
}

.inset-x-4 {
  left: var(--sc-spacing-4);
  right: var(--sc-spacing-4);
}

.inset-x-40 {
  left: var(--sc-spacing-40);
  right: var(--sc-spacing-40);
}

.inset-x-48 {
  left: var(--sc-spacing-48);
  right: var(--sc-spacing-48);
}

.inset-x-56 {
  left: var(--sc-spacing-56);
  right: var(--sc-spacing-56);
}

.inset-x-64 {
  left: var(--sc-spacing-64);
  right: var(--sc-spacing-64);
}

.inset-x-8 {
  left: var(--sc-spacing-8);
  right: var(--sc-spacing-8);
}

.inset-x-auto {
  left: auto;
  right: auto;
}

.inset-x-full {
  left: 100%;
  right: 100%;
}

.inset-y-0 {
  top: var(--sc-spacing-0);
  bottom: var(--sc-spacing-0);
}

.inset-y-1\/2 {
  top: 50%;
  bottom: 50%;
}

.inset-y-1\/3 {
  top: 33.333333%;
  bottom: 33.333333%;
}

.inset-y-1\/4 {
  top: 25%;
  bottom: 25%;
}

.inset-y-12 {
  top: var(--sc-spacing-12);
  bottom: var(--sc-spacing-12);
}

.inset-y-16 {
  top: var(--sc-spacing-16);
  bottom: var(--sc-spacing-16);
}

.inset-y-2\/3 {
  top: 66.666667%;
  bottom: 66.666667%;
}

.inset-y-2\/4 {
  top: 50%;
  bottom: 50%;
}

.inset-y-20 {
  top: var(--sc-spacing-20);
  bottom: var(--sc-spacing-20);
}

.inset-y-24 {
  top: var(--sc-spacing-24);
  bottom: var(--sc-spacing-24);
}

.inset-y-3\/4 {
  top: 75%;
  bottom: 75%;
}

.inset-y-32 {
  top: var(--sc-spacing-32);
  bottom: var(--sc-spacing-32);
}

.inset-y-4 {
  top: var(--sc-spacing-4);
  bottom: var(--sc-spacing-4);
}

.inset-y-40 {
  top: var(--sc-spacing-40);
  bottom: var(--sc-spacing-40);
}

.inset-y-48 {
  top: var(--sc-spacing-48);
  bottom: var(--sc-spacing-48);
}

.inset-y-56 {
  top: var(--sc-spacing-56);
  bottom: var(--sc-spacing-56);
}

.inset-y-64 {
  top: var(--sc-spacing-64);
  bottom: var(--sc-spacing-64);
}

.inset-y-8 {
  top: var(--sc-spacing-8);
  bottom: var(--sc-spacing-8);
}

.inset-y-auto {
  top: auto;
  bottom: auto;
}

.inset-y-full {
  top: 100%;
  bottom: 100%;
}

.-bottom-0 {
  bottom: calc(var(--sc-spacing-0) * -1);
}

.-bottom-1\/2 {
  bottom: -50%;
}

.-bottom-1\/3 {
  bottom: -33.333333%;
}

.-bottom-1\/4 {
  bottom: -25%;
}

.-bottom-12 {
  bottom: calc(var(--sc-spacing-12) * -1);
}

.-bottom-16 {
  bottom: calc(var(--sc-spacing-16) * -1);
}

.-bottom-2\/3 {
  bottom: -66.666667%;
}

.-bottom-2\/4 {
  bottom: -50%;
}

.-bottom-20 {
  bottom: calc(var(--sc-spacing-20) * -1);
}

.-bottom-24 {
  bottom: calc(var(--sc-spacing-24) * -1);
}

.-bottom-3\/4 {
  bottom: -75%;
}

.-bottom-32 {
  bottom: calc(var(--sc-spacing-32) * -1);
}

.-bottom-4 {
  bottom: calc(var(--sc-spacing-4) * -1);
}

.-bottom-40 {
  bottom: calc(var(--sc-spacing-40) * -1);
}

.-bottom-48 {
  bottom: calc(var(--sc-spacing-48) * -1);
}

.-bottom-56 {
  bottom: calc(var(--sc-spacing-56) * -1);
}

.-bottom-64 {
  bottom: calc(var(--sc-spacing-64) * -1);
}

.-bottom-8 {
  bottom: calc(var(--sc-spacing-8) * -1);
}

.-bottom-full {
  bottom: -100%;
}

.-end-0 {
  inset-inline-end: calc(var(--sc-spacing-0) * -1);
}

.-end-1\/2 {
  inset-inline-end: -50%;
}

.-end-1\/3 {
  inset-inline-end: -33.333333%;
}

.-end-1\/4 {
  inset-inline-end: -25%;
}

.-end-12 {
  inset-inline-end: calc(var(--sc-spacing-12) * -1);
}

.-end-16 {
  inset-inline-end: calc(var(--sc-spacing-16) * -1);
}

.-end-2\/3 {
  inset-inline-end: -66.666667%;
}

.-end-2\/4 {
  inset-inline-end: -50%;
}

.-end-20 {
  inset-inline-end: calc(var(--sc-spacing-20) * -1);
}

.-end-24 {
  inset-inline-end: calc(var(--sc-spacing-24) * -1);
}

.-end-3\/4 {
  inset-inline-end: -75%;
}

.-end-32 {
  inset-inline-end: calc(var(--sc-spacing-32) * -1);
}

.-end-4 {
  inset-inline-end: calc(var(--sc-spacing-4) * -1);
}

.-end-40 {
  inset-inline-end: calc(var(--sc-spacing-40) * -1);
}

.-end-48 {
  inset-inline-end: calc(var(--sc-spacing-48) * -1);
}

.-end-56 {
  inset-inline-end: calc(var(--sc-spacing-56) * -1);
}

.-end-64 {
  inset-inline-end: calc(var(--sc-spacing-64) * -1);
}

.-end-8 {
  inset-inline-end: calc(var(--sc-spacing-8) * -1);
}

.-end-full {
  inset-inline-end: -100%;
}

.-left-0 {
  left: calc(var(--sc-spacing-0) * -1);
}

.-left-1\/2 {
  left: -50%;
}

.-left-1\/3 {
  left: -33.333333%;
}

.-left-1\/4 {
  left: -25%;
}

.-left-12 {
  left: calc(var(--sc-spacing-12) * -1);
}

.-left-16 {
  left: calc(var(--sc-spacing-16) * -1);
}

.-left-2\/3 {
  left: -66.666667%;
}

.-left-2\/4 {
  left: -50%;
}

.-left-20 {
  left: calc(var(--sc-spacing-20) * -1);
}

.-left-24 {
  left: calc(var(--sc-spacing-24) * -1);
}

.-left-3\/4 {
  left: -75%;
}

.-left-32 {
  left: calc(var(--sc-spacing-32) * -1);
}

.-left-4 {
  left: calc(var(--sc-spacing-4) * -1);
}

.-left-40 {
  left: calc(var(--sc-spacing-40) * -1);
}

.-left-48 {
  left: calc(var(--sc-spacing-48) * -1);
}

.-left-56 {
  left: calc(var(--sc-spacing-56) * -1);
}

.-left-64 {
  left: calc(var(--sc-spacing-64) * -1);
}

.-left-8 {
  left: calc(var(--sc-spacing-8) * -1);
}

.-left-full {
  left: -100%;
}

.-right-0 {
  right: calc(var(--sc-spacing-0) * -1);
}

.-right-1\/2 {
  right: -50%;
}

.-right-1\/3 {
  right: -33.333333%;
}

.-right-1\/4 {
  right: -25%;
}

.-right-12 {
  right: calc(var(--sc-spacing-12) * -1);
}

.-right-16 {
  right: calc(var(--sc-spacing-16) * -1);
}

.-right-2\/3 {
  right: -66.666667%;
}

.-right-2\/4 {
  right: -50%;
}

.-right-20 {
  right: calc(var(--sc-spacing-20) * -1);
}

.-right-24 {
  right: calc(var(--sc-spacing-24) * -1);
}

.-right-3\/4 {
  right: -75%;
}

.-right-32 {
  right: calc(var(--sc-spacing-32) * -1);
}

.-right-4 {
  right: calc(var(--sc-spacing-4) * -1);
}

.-right-40 {
  right: calc(var(--sc-spacing-40) * -1);
}

.-right-48 {
  right: calc(var(--sc-spacing-48) * -1);
}

.-right-56 {
  right: calc(var(--sc-spacing-56) * -1);
}

.-right-64 {
  right: calc(var(--sc-spacing-64) * -1);
}

.-right-8 {
  right: calc(var(--sc-spacing-8) * -1);
}

.-right-full {
  right: -100%;
}

.-start-0 {
  inset-inline-start: calc(var(--sc-spacing-0) * -1);
}

.-start-1\/2 {
  inset-inline-start: -50%;
}

.-start-1\/3 {
  inset-inline-start: -33.333333%;
}

.-start-1\/4 {
  inset-inline-start: -25%;
}

.-start-12 {
  inset-inline-start: calc(var(--sc-spacing-12) * -1);
}

.-start-16 {
  inset-inline-start: calc(var(--sc-spacing-16) * -1);
}

.-start-2\/3 {
  inset-inline-start: -66.666667%;
}

.-start-2\/4 {
  inset-inline-start: -50%;
}

.-start-20 {
  inset-inline-start: calc(var(--sc-spacing-20) * -1);
}

.-start-24 {
  inset-inline-start: calc(var(--sc-spacing-24) * -1);
}

.-start-3\/4 {
  inset-inline-start: -75%;
}

.-start-32 {
  inset-inline-start: calc(var(--sc-spacing-32) * -1);
}

.-start-4 {
  inset-inline-start: calc(var(--sc-spacing-4) * -1);
}

.-start-40 {
  inset-inline-start: calc(var(--sc-spacing-40) * -1);
}

.-start-48 {
  inset-inline-start: calc(var(--sc-spacing-48) * -1);
}

.-start-56 {
  inset-inline-start: calc(var(--sc-spacing-56) * -1);
}

.-start-64 {
  inset-inline-start: calc(var(--sc-spacing-64) * -1);
}

.-start-8 {
  inset-inline-start: calc(var(--sc-spacing-8) * -1);
}

.-start-full {
  inset-inline-start: -100%;
}

.-top-0 {
  top: calc(var(--sc-spacing-0) * -1);
}

.-top-1\/2 {
  top: -50%;
}

.-top-1\/3 {
  top: -33.333333%;
}

.-top-1\/4 {
  top: -25%;
}

.-top-12 {
  top: calc(var(--sc-spacing-12) * -1);
}

.-top-16 {
  top: calc(var(--sc-spacing-16) * -1);
}

.-top-2\/3 {
  top: -66.666667%;
}

.-top-2\/4 {
  top: -50%;
}

.-top-20 {
  top: calc(var(--sc-spacing-20) * -1);
}

.-top-24 {
  top: calc(var(--sc-spacing-24) * -1);
}

.-top-3\/4 {
  top: -75%;
}

.-top-32 {
  top: calc(var(--sc-spacing-32) * -1);
}

.-top-4 {
  top: calc(var(--sc-spacing-4) * -1);
}

.-top-40 {
  top: calc(var(--sc-spacing-40) * -1);
}

.-top-48 {
  top: calc(var(--sc-spacing-48) * -1);
}

.-top-56 {
  top: calc(var(--sc-spacing-56) * -1);
}

.-top-64 {
  top: calc(var(--sc-spacing-64) * -1);
}

.-top-8 {
  top: calc(var(--sc-spacing-8) * -1);
}

.-top-full {
  top: -100%;
}

.bottom-0 {
  bottom: var(--sc-spacing-0);
}

.bottom-1\/2 {
  bottom: 50%;
}

.bottom-1\/3 {
  bottom: 33.333333%;
}

.bottom-1\/4 {
  bottom: 25%;
}

.bottom-12 {
  bottom: var(--sc-spacing-12);
}

.bottom-16 {
  bottom: var(--sc-spacing-16);
}

.bottom-2\/3 {
  bottom: 66.666667%;
}

.bottom-2\/4 {
  bottom: 50%;
}

.bottom-20 {
  bottom: var(--sc-spacing-20);
}

.bottom-24 {
  bottom: var(--sc-spacing-24);
}

.bottom-3\/4 {
  bottom: 75%;
}

.bottom-32 {
  bottom: var(--sc-spacing-32);
}

.bottom-4 {
  bottom: var(--sc-spacing-4);
}

.bottom-40 {
  bottom: var(--sc-spacing-40);
}

.bottom-48 {
  bottom: var(--sc-spacing-48);
}

.bottom-56 {
  bottom: var(--sc-spacing-56);
}

.bottom-64 {
  bottom: var(--sc-spacing-64);
}

.bottom-8 {
  bottom: var(--sc-spacing-8);
}

.bottom-auto {
  bottom: auto;
}

.bottom-full {
  bottom: 100%;
}

.end-0 {
  inset-inline-end: var(--sc-spacing-0);
}

.end-1\/2 {
  inset-inline-end: 50%;
}

.end-1\/3 {
  inset-inline-end: 33.333333%;
}

.end-1\/4 {
  inset-inline-end: 25%;
}

.end-12 {
  inset-inline-end: var(--sc-spacing-12);
}

.end-16 {
  inset-inline-end: var(--sc-spacing-16);
}

.end-2\/3 {
  inset-inline-end: 66.666667%;
}

.end-2\/4 {
  inset-inline-end: 50%;
}

.end-20 {
  inset-inline-end: var(--sc-spacing-20);
}

.end-24 {
  inset-inline-end: var(--sc-spacing-24);
}

.end-3\/4 {
  inset-inline-end: 75%;
}

.end-32 {
  inset-inline-end: var(--sc-spacing-32);
}

.end-4 {
  inset-inline-end: var(--sc-spacing-4);
}

.end-40 {
  inset-inline-end: var(--sc-spacing-40);
}

.end-48 {
  inset-inline-end: var(--sc-spacing-48);
}

.end-56 {
  inset-inline-end: var(--sc-spacing-56);
}

.end-64 {
  inset-inline-end: var(--sc-spacing-64);
}

.end-8 {
  inset-inline-end: var(--sc-spacing-8);
}

.end-auto {
  inset-inline-end: auto;
}

.end-full {
  inset-inline-end: 100%;
}

.left-0 {
  left: var(--sc-spacing-0);
}

.left-1\/2 {
  left: 50%;
}

.left-1\/3 {
  left: 33.333333%;
}

.left-1\/4 {
  left: 25%;
}

.left-12 {
  left: var(--sc-spacing-12);
}

.left-16 {
  left: var(--sc-spacing-16);
}

.left-2\/3 {
  left: 66.666667%;
}

.left-2\/4 {
  left: 50%;
}

.left-20 {
  left: var(--sc-spacing-20);
}

.left-24 {
  left: var(--sc-spacing-24);
}

.left-3\/4 {
  left: 75%;
}

.left-32 {
  left: var(--sc-spacing-32);
}

.left-4 {
  left: var(--sc-spacing-4);
}

.left-40 {
  left: var(--sc-spacing-40);
}

.left-48 {
  left: var(--sc-spacing-48);
}

.left-56 {
  left: var(--sc-spacing-56);
}

.left-64 {
  left: var(--sc-spacing-64);
}

.left-8 {
  left: var(--sc-spacing-8);
}

.left-auto {
  left: auto;
}

.left-full {
  left: 100%;
}

.right-0 {
  right: var(--sc-spacing-0);
}

.right-1\/2 {
  right: 50%;
}

.right-1\/3 {
  right: 33.333333%;
}

.right-1\/4 {
  right: 25%;
}

.right-12 {
  right: var(--sc-spacing-12);
}

.right-16 {
  right: var(--sc-spacing-16);
}

.right-2\/3 {
  right: 66.666667%;
}

.right-2\/4 {
  right: 50%;
}

.right-20 {
  right: var(--sc-spacing-20);
}

.right-24 {
  right: var(--sc-spacing-24);
}

.right-3\/4 {
  right: 75%;
}

.right-32 {
  right: var(--sc-spacing-32);
}

.right-4 {
  right: var(--sc-spacing-4);
}

.right-40 {
  right: var(--sc-spacing-40);
}

.right-48 {
  right: var(--sc-spacing-48);
}

.right-56 {
  right: var(--sc-spacing-56);
}

.right-64 {
  right: var(--sc-spacing-64);
}

.right-8 {
  right: var(--sc-spacing-8);
}

.right-auto {
  right: auto;
}

.right-full {
  right: 100%;
}

.start-0 {
  inset-inline-start: var(--sc-spacing-0);
}

.start-1\/2 {
  inset-inline-start: 50%;
}

.start-1\/3 {
  inset-inline-start: 33.333333%;
}

.start-1\/4 {
  inset-inline-start: 25%;
}

.start-12 {
  inset-inline-start: var(--sc-spacing-12);
}

.start-16 {
  inset-inline-start: var(--sc-spacing-16);
}

.start-2\/3 {
  inset-inline-start: 66.666667%;
}

.start-2\/4 {
  inset-inline-start: 50%;
}

.start-20 {
  inset-inline-start: var(--sc-spacing-20);
}

.start-24 {
  inset-inline-start: var(--sc-spacing-24);
}

.start-3\/4 {
  inset-inline-start: 75%;
}

.start-32 {
  inset-inline-start: var(--sc-spacing-32);
}

.start-4 {
  inset-inline-start: var(--sc-spacing-4);
}

.start-40 {
  inset-inline-start: var(--sc-spacing-40);
}

.start-48 {
  inset-inline-start: var(--sc-spacing-48);
}

.start-56 {
  inset-inline-start: var(--sc-spacing-56);
}

.start-64 {
  inset-inline-start: var(--sc-spacing-64);
}

.start-8 {
  inset-inline-start: var(--sc-spacing-8);
}

.start-auto {
  inset-inline-start: auto;
}

.start-full {
  inset-inline-start: 100%;
}

.top-0 {
  top: var(--sc-spacing-0);
}

.top-1\/2 {
  top: 50%;
}

.top-1\/3 {
  top: 33.333333%;
}

.top-1\/4 {
  top: 25%;
}

.top-12 {
  top: var(--sc-spacing-12);
}

.top-16 {
  top: var(--sc-spacing-16);
}

.top-2\/3 {
  top: 66.666667%;
}

.top-2\/4 {
  top: 50%;
}

.top-20 {
  top: var(--sc-spacing-20);
}

.top-24 {
  top: var(--sc-spacing-24);
}

.top-3\/4 {
  top: 75%;
}

.top-32 {
  top: var(--sc-spacing-32);
}

.top-4 {
  top: var(--sc-spacing-4);
}

.top-40 {
  top: var(--sc-spacing-40);
}

.top-48 {
  top: var(--sc-spacing-48);
}

.top-56 {
  top: var(--sc-spacing-56);
}

.top-64 {
  top: var(--sc-spacing-64);
}

.top-8 {
  top: var(--sc-spacing-8);
}

.top-auto {
  top: auto;
}

.top-full {
  top: 100%;
}

.-z-0 {
  z-index: 0;
}

.-z-10 {
  z-index: -10;
}

.-z-20 {
  z-index: -20;
}

.-z-30 {
  z-index: -30;
}

.-z-40 {
  z-index: -40;
}

.-z-50 {
  z-index: -50;
}

.z-0 {
  z-index: 0;
}

.z-10 {
  z-index: 10;
}

.z-20 {
  z-index: 20;
}

.z-30 {
  z-index: 30;
}

.z-40 {
  z-index: 40;
}

.z-50 {
  z-index: 50;
}

.z-auto {
  z-index: auto;
}

.-order-1 {
  order: -1;
}

.-order-10 {
  order: -10;
}

.-order-11 {
  order: -11;
}

.-order-12 {
  order: -12;
}

.-order-2 {
  order: -2;
}

.-order-3 {
  order: -3;
}

.-order-4 {
  order: -4;
}

.-order-5 {
  order: -5;
}

.-order-6 {
  order: -6;
}

.-order-7 {
  order: -7;
}

.-order-8 {
  order: -8;
}

.-order-9 {
  order: -9;
}

.-order-first {
  order: 9999;
}

.-order-last {
  order: -9999;
}

.-order-none {
  order: 0;
}

.order-1 {
  order: 1;
}

.order-10 {
  order: 10;
}

.order-11 {
  order: 11;
}

.order-12 {
  order: 12;
}

.order-2 {
  order: 2;
}

.order-3 {
  order: 3;
}

.order-4 {
  order: 4;
}

.order-5 {
  order: 5;
}

.order-6 {
  order: 6;
}

.order-7 {
  order: 7;
}

.order-8 {
  order: 8;
}

.order-9 {
  order: 9;
}

.order-first {
  order: -9999;
}

.order-last {
  order: 9999;
}

.order-none {
  order: 0;
}

.col-auto {
  grid-column: auto;
}

.col-span-1 {
  grid-column: span 1 / span 1;
}

.col-span-10 {
  grid-column: span 10 / span 10;
}

.col-span-11 {
  grid-column: span 11 / span 11;
}

.col-span-12 {
  grid-column: span 12 / span 12;
}

.col-span-2 {
  grid-column: span 2 / span 2;
}

.col-span-3 {
  grid-column: span 3 / span 3;
}

.col-span-4 {
  grid-column: span 4 / span 4;
}

.col-span-5 {
  grid-column: span 5 / span 5;
}

.col-span-6 {
  grid-column: span 6 / span 6;
}

.col-span-7 {
  grid-column: span 7 / span 7;
}

.col-span-8 {
  grid-column: span 8 / span 8;
}

.col-span-9 {
  grid-column: span 9 / span 9;
}

.col-span-full {
  grid-column: 1 / -1;
}

.col-start-1 {
  grid-column-start: 1;
}

.col-start-10 {
  grid-column-start: 10;
}

.col-start-11 {
  grid-column-start: 11;
}

.col-start-12 {
  grid-column-start: 12;
}

.col-start-13 {
  grid-column-start: 13;
}

.col-start-2 {
  grid-column-start: 2;
}

.col-start-3 {
  grid-column-start: 3;
}

.col-start-4 {
  grid-column-start: 4;
}

.col-start-5 {
  grid-column-start: 5;
}

.col-start-6 {
  grid-column-start: 6;
}

.col-start-7 {
  grid-column-start: 7;
}

.col-start-8 {
  grid-column-start: 8;
}

.col-start-9 {
  grid-column-start: 9;
}

.col-start-auto {
  grid-column-start: auto;
}

.col-end-1 {
  grid-column-end: 1;
}

.col-end-10 {
  grid-column-end: 10;
}

.col-end-11 {
  grid-column-end: 11;
}

.col-end-12 {
  grid-column-end: 12;
}

.col-end-13 {
  grid-column-end: 13;
}

.col-end-2 {
  grid-column-end: 2;
}

.col-end-3 {
  grid-column-end: 3;
}

.col-end-4 {
  grid-column-end: 4;
}

.col-end-5 {
  grid-column-end: 5;
}

.col-end-6 {
  grid-column-end: 6;
}

.col-end-7 {
  grid-column-end: 7;
}

.col-end-8 {
  grid-column-end: 8;
}

.col-end-9 {
  grid-column-end: 9;
}

.col-end-auto {
  grid-column-end: auto;
}

.row-auto {
  grid-row: auto;
}

.row-span-1 {
  grid-row: span 1 / span 1;
}

.row-span-10 {
  grid-row: span 10 / span 10;
}

.row-span-11 {
  grid-row: span 11 / span 11;
}

.row-span-12 {
  grid-row: span 12 / span 12;
}

.row-span-2 {
  grid-row: span 2 / span 2;
}

.row-span-3 {
  grid-row: span 3 / span 3;
}

.row-span-4 {
  grid-row: span 4 / span 4;
}

.row-span-5 {
  grid-row: span 5 / span 5;
}

.row-span-6 {
  grid-row: span 6 / span 6;
}

.row-span-7 {
  grid-row: span 7 / span 7;
}

.row-span-8 {
  grid-row: span 8 / span 8;
}

.row-span-9 {
  grid-row: span 9 / span 9;
}

.row-span-full {
  grid-row: 1 / -1;
}

.row-start-1 {
  grid-row-start: 1;
}

.row-start-10 {
  grid-row-start: 10;
}

.row-start-11 {
  grid-row-start: 11;
}

.row-start-12 {
  grid-row-start: 12;
}

.row-start-13 {
  grid-row-start: 13;
}

.row-start-2 {
  grid-row-start: 2;
}

.row-start-3 {
  grid-row-start: 3;
}

.row-start-4 {
  grid-row-start: 4;
}

.row-start-5 {
  grid-row-start: 5;
}

.row-start-6 {
  grid-row-start: 6;
}

.row-start-7 {
  grid-row-start: 7;
}

.row-start-8 {
  grid-row-start: 8;
}

.row-start-9 {
  grid-row-start: 9;
}

.row-start-auto {
  grid-row-start: auto;
}

.row-end-1 {
  grid-row-end: 1;
}

.row-end-10 {
  grid-row-end: 10;
}

.row-end-11 {
  grid-row-end: 11;
}

.row-end-12 {
  grid-row-end: 12;
}

.row-end-13 {
  grid-row-end: 13;
}

.row-end-2 {
  grid-row-end: 2;
}

.row-end-3 {
  grid-row-end: 3;
}

.row-end-4 {
  grid-row-end: 4;
}

.row-end-5 {
  grid-row-end: 5;
}

.row-end-6 {
  grid-row-end: 6;
}

.row-end-7 {
  grid-row-end: 7;
}

.row-end-8 {
  grid-row-end: 8;
}

.row-end-9 {
  grid-row-end: 9;
}

.row-end-auto {
  grid-row-end: auto;
}

.-m-0 {
  margin: calc(var(--sc-spacing-0) * -1);
}

.-m-12 {
  margin: calc(var(--sc-spacing-12) * -1);
}

.-m-16 {
  margin: calc(var(--sc-spacing-16) * -1);
}

.-m-20 {
  margin: calc(var(--sc-spacing-20) * -1);
}

.-m-24 {
  margin: calc(var(--sc-spacing-24) * -1);
}

.-m-32 {
  margin: calc(var(--sc-spacing-32) * -1);
}

.-m-4 {
  margin: calc(var(--sc-spacing-4) * -1);
}

.-m-40 {
  margin: calc(var(--sc-spacing-40) * -1);
}

.-m-48 {
  margin: calc(var(--sc-spacing-48) * -1);
}

.-m-56 {
  margin: calc(var(--sc-spacing-56) * -1);
}

.-m-64 {
  margin: calc(var(--sc-spacing-64) * -1);
}

.-m-8 {
  margin: calc(var(--sc-spacing-8) * -1);
}

.m-0 {
  margin: var(--sc-spacing-0);
}

.m-12 {
  margin: var(--sc-spacing-12);
}

.m-16 {
  margin: var(--sc-spacing-16);
}

.m-20 {
  margin: var(--sc-spacing-20);
}

.m-24 {
  margin: var(--sc-spacing-24);
}

.m-32 {
  margin: var(--sc-spacing-32);
}

.m-4 {
  margin: var(--sc-spacing-4);
}

.m-40 {
  margin: var(--sc-spacing-40);
}

.m-48 {
  margin: var(--sc-spacing-48);
}

.m-56 {
  margin: var(--sc-spacing-56);
}

.m-64 {
  margin: var(--sc-spacing-64);
}

.m-8 {
  margin: var(--sc-spacing-8);
}

.m-auto {
  margin: auto;
}

.-mx-0 {
  margin-left: calc(var(--sc-spacing-0) * -1);
  margin-right: calc(var(--sc-spacing-0) * -1);
}

.-mx-12 {
  margin-left: calc(var(--sc-spacing-12) * -1);
  margin-right: calc(var(--sc-spacing-12) * -1);
}

.-mx-16 {
  margin-left: calc(var(--sc-spacing-16) * -1);
  margin-right: calc(var(--sc-spacing-16) * -1);
}

.-mx-20 {
  margin-left: calc(var(--sc-spacing-20) * -1);
  margin-right: calc(var(--sc-spacing-20) * -1);
}

.-mx-24 {
  margin-left: calc(var(--sc-spacing-24) * -1);
  margin-right: calc(var(--sc-spacing-24) * -1);
}

.-mx-32 {
  margin-left: calc(var(--sc-spacing-32) * -1);
  margin-right: calc(var(--sc-spacing-32) * -1);
}

.-mx-4 {
  margin-left: calc(var(--sc-spacing-4) * -1);
  margin-right: calc(var(--sc-spacing-4) * -1);
}

.-mx-40 {
  margin-left: calc(var(--sc-spacing-40) * -1);
  margin-right: calc(var(--sc-spacing-40) * -1);
}

.-mx-48 {
  margin-left: calc(var(--sc-spacing-48) * -1);
  margin-right: calc(var(--sc-spacing-48) * -1);
}

.-mx-56 {
  margin-left: calc(var(--sc-spacing-56) * -1);
  margin-right: calc(var(--sc-spacing-56) * -1);
}

.-mx-64 {
  margin-left: calc(var(--sc-spacing-64) * -1);
  margin-right: calc(var(--sc-spacing-64) * -1);
}

.-mx-8 {
  margin-left: calc(var(--sc-spacing-8) * -1);
  margin-right: calc(var(--sc-spacing-8) * -1);
}

.-my-0 {
  margin-top: calc(var(--sc-spacing-0) * -1);
  margin-bottom: calc(var(--sc-spacing-0) * -1);
}

.-my-12 {
  margin-top: calc(var(--sc-spacing-12) * -1);
  margin-bottom: calc(var(--sc-spacing-12) * -1);
}

.-my-16 {
  margin-top: calc(var(--sc-spacing-16) * -1);
  margin-bottom: calc(var(--sc-spacing-16) * -1);
}

.-my-20 {
  margin-top: calc(var(--sc-spacing-20) * -1);
  margin-bottom: calc(var(--sc-spacing-20) * -1);
}

.-my-24 {
  margin-top: calc(var(--sc-spacing-24) * -1);
  margin-bottom: calc(var(--sc-spacing-24) * -1);
}

.-my-32 {
  margin-top: calc(var(--sc-spacing-32) * -1);
  margin-bottom: calc(var(--sc-spacing-32) * -1);
}

.-my-4 {
  margin-top: calc(var(--sc-spacing-4) * -1);
  margin-bottom: calc(var(--sc-spacing-4) * -1);
}

.-my-40 {
  margin-top: calc(var(--sc-spacing-40) * -1);
  margin-bottom: calc(var(--sc-spacing-40) * -1);
}

.-my-48 {
  margin-top: calc(var(--sc-spacing-48) * -1);
  margin-bottom: calc(var(--sc-spacing-48) * -1);
}

.-my-56 {
  margin-top: calc(var(--sc-spacing-56) * -1);
  margin-bottom: calc(var(--sc-spacing-56) * -1);
}

.-my-64 {
  margin-top: calc(var(--sc-spacing-64) * -1);
  margin-bottom: calc(var(--sc-spacing-64) * -1);
}

.-my-8 {
  margin-top: calc(var(--sc-spacing-8) * -1);
  margin-bottom: calc(var(--sc-spacing-8) * -1);
}

.mx-0 {
  margin-left: var(--sc-spacing-0);
  margin-right: var(--sc-spacing-0);
}

.mx-12 {
  margin-left: var(--sc-spacing-12);
  margin-right: var(--sc-spacing-12);
}

.mx-16 {
  margin-left: var(--sc-spacing-16);
  margin-right: var(--sc-spacing-16);
}

.mx-20 {
  margin-left: var(--sc-spacing-20);
  margin-right: var(--sc-spacing-20);
}

.mx-24 {
  margin-left: var(--sc-spacing-24);
  margin-right: var(--sc-spacing-24);
}

.mx-32 {
  margin-left: var(--sc-spacing-32);
  margin-right: var(--sc-spacing-32);
}

.mx-4 {
  margin-left: var(--sc-spacing-4);
  margin-right: var(--sc-spacing-4);
}

.mx-40 {
  margin-left: var(--sc-spacing-40);
  margin-right: var(--sc-spacing-40);
}

.mx-48 {
  margin-left: var(--sc-spacing-48);
  margin-right: var(--sc-spacing-48);
}

.mx-56 {
  margin-left: var(--sc-spacing-56);
  margin-right: var(--sc-spacing-56);
}

.mx-64 {
  margin-left: var(--sc-spacing-64);
  margin-right: var(--sc-spacing-64);
}

.mx-8 {
  margin-left: var(--sc-spacing-8);
  margin-right: var(--sc-spacing-8);
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.my-0 {
  margin-top: var(--sc-spacing-0);
  margin-bottom: var(--sc-spacing-0);
}

.my-12 {
  margin-top: var(--sc-spacing-12);
  margin-bottom: var(--sc-spacing-12);
}

.my-16 {
  margin-top: var(--sc-spacing-16);
  margin-bottom: var(--sc-spacing-16);
}

.my-20 {
  margin-top: var(--sc-spacing-20);
  margin-bottom: var(--sc-spacing-20);
}

.my-24 {
  margin-top: var(--sc-spacing-24);
  margin-bottom: var(--sc-spacing-24);
}

.my-32 {
  margin-top: var(--sc-spacing-32);
  margin-bottom: var(--sc-spacing-32);
}

.my-4 {
  margin-top: var(--sc-spacing-4);
  margin-bottom: var(--sc-spacing-4);
}

.my-40 {
  margin-top: var(--sc-spacing-40);
  margin-bottom: var(--sc-spacing-40);
}

.my-48 {
  margin-top: var(--sc-spacing-48);
  margin-bottom: var(--sc-spacing-48);
}

.my-56 {
  margin-top: var(--sc-spacing-56);
  margin-bottom: var(--sc-spacing-56);
}

.my-64 {
  margin-top: var(--sc-spacing-64);
  margin-bottom: var(--sc-spacing-64);
}

.my-8 {
  margin-top: var(--sc-spacing-8);
  margin-bottom: var(--sc-spacing-8);
}

.my-auto {
  margin-top: auto;
  margin-bottom: auto;
}

.-mb-0 {
  margin-bottom: calc(var(--sc-spacing-0) * -1);
}

.-mb-12 {
  margin-bottom: calc(var(--sc-spacing-12) * -1);
}

.-mb-16 {
  margin-bottom: calc(var(--sc-spacing-16) * -1);
}

.-mb-20 {
  margin-bottom: calc(var(--sc-spacing-20) * -1);
}

.-mb-24 {
  margin-bottom: calc(var(--sc-spacing-24) * -1);
}

.-mb-32 {
  margin-bottom: calc(var(--sc-spacing-32) * -1);
}

.-mb-4 {
  margin-bottom: calc(var(--sc-spacing-4) * -1);
}

.-mb-40 {
  margin-bottom: calc(var(--sc-spacing-40) * -1);
}

.-mb-48 {
  margin-bottom: calc(var(--sc-spacing-48) * -1);
}

.-mb-56 {
  margin-bottom: calc(var(--sc-spacing-56) * -1);
}

.-mb-64 {
  margin-bottom: calc(var(--sc-spacing-64) * -1);
}

.-mb-8 {
  margin-bottom: calc(var(--sc-spacing-8) * -1);
}

.-me-0 {
  margin-inline-end: calc(var(--sc-spacing-0) * -1);
}

.-me-12 {
  margin-inline-end: calc(var(--sc-spacing-12) * -1);
}

.-me-16 {
  margin-inline-end: calc(var(--sc-spacing-16) * -1);
}

.-me-20 {
  margin-inline-end: calc(var(--sc-spacing-20) * -1);
}

.-me-24 {
  margin-inline-end: calc(var(--sc-spacing-24) * -1);
}

.-me-32 {
  margin-inline-end: calc(var(--sc-spacing-32) * -1);
}

.-me-4 {
  margin-inline-end: calc(var(--sc-spacing-4) * -1);
}

.-me-40 {
  margin-inline-end: calc(var(--sc-spacing-40) * -1);
}

.-me-48 {
  margin-inline-end: calc(var(--sc-spacing-48) * -1);
}

.-me-56 {
  margin-inline-end: calc(var(--sc-spacing-56) * -1);
}

.-me-64 {
  margin-inline-end: calc(var(--sc-spacing-64) * -1);
}

.-me-8 {
  margin-inline-end: calc(var(--sc-spacing-8) * -1);
}

.-ml-0 {
  margin-left: calc(var(--sc-spacing-0) * -1);
}

.-ml-12 {
  margin-left: calc(var(--sc-spacing-12) * -1);
}

.-ml-16 {
  margin-left: calc(var(--sc-spacing-16) * -1);
}

.-ml-20 {
  margin-left: calc(var(--sc-spacing-20) * -1);
}

.-ml-24 {
  margin-left: calc(var(--sc-spacing-24) * -1);
}

.-ml-32 {
  margin-left: calc(var(--sc-spacing-32) * -1);
}

.-ml-4 {
  margin-left: calc(var(--sc-spacing-4) * -1);
}

.-ml-40 {
  margin-left: calc(var(--sc-spacing-40) * -1);
}

.-ml-48 {
  margin-left: calc(var(--sc-spacing-48) * -1);
}

.-ml-56 {
  margin-left: calc(var(--sc-spacing-56) * -1);
}

.-ml-64 {
  margin-left: calc(var(--sc-spacing-64) * -1);
}

.-ml-8 {
  margin-left: calc(var(--sc-spacing-8) * -1);
}

.-mr-0 {
  margin-right: calc(var(--sc-spacing-0) * -1);
}

.-mr-12 {
  margin-right: calc(var(--sc-spacing-12) * -1);
}

.-mr-16 {
  margin-right: calc(var(--sc-spacing-16) * -1);
}

.-mr-20 {
  margin-right: calc(var(--sc-spacing-20) * -1);
}

.-mr-24 {
  margin-right: calc(var(--sc-spacing-24) * -1);
}

.-mr-32 {
  margin-right: calc(var(--sc-spacing-32) * -1);
}

.-mr-4 {
  margin-right: calc(var(--sc-spacing-4) * -1);
}

.-mr-40 {
  margin-right: calc(var(--sc-spacing-40) * -1);
}

.-mr-48 {
  margin-right: calc(var(--sc-spacing-48) * -1);
}

.-mr-56 {
  margin-right: calc(var(--sc-spacing-56) * -1);
}

.-mr-64 {
  margin-right: calc(var(--sc-spacing-64) * -1);
}

.-mr-8 {
  margin-right: calc(var(--sc-spacing-8) * -1);
}

.-ms-0 {
  margin-inline-start: calc(var(--sc-spacing-0) * -1);
}

.-ms-12 {
  margin-inline-start: calc(var(--sc-spacing-12) * -1);
}

.-ms-16 {
  margin-inline-start: calc(var(--sc-spacing-16) * -1);
}

.-ms-20 {
  margin-inline-start: calc(var(--sc-spacing-20) * -1);
}

.-ms-24 {
  margin-inline-start: calc(var(--sc-spacing-24) * -1);
}

.-ms-32 {
  margin-inline-start: calc(var(--sc-spacing-32) * -1);
}

.-ms-4 {
  margin-inline-start: calc(var(--sc-spacing-4) * -1);
}

.-ms-40 {
  margin-inline-start: calc(var(--sc-spacing-40) * -1);
}

.-ms-48 {
  margin-inline-start: calc(var(--sc-spacing-48) * -1);
}

.-ms-56 {
  margin-inline-start: calc(var(--sc-spacing-56) * -1);
}

.-ms-64 {
  margin-inline-start: calc(var(--sc-spacing-64) * -1);
}

.-ms-8 {
  margin-inline-start: calc(var(--sc-spacing-8) * -1);
}

.-mt-0 {
  margin-top: calc(var(--sc-spacing-0) * -1);
}

.-mt-12 {
  margin-top: calc(var(--sc-spacing-12) * -1);
}

.-mt-16 {
  margin-top: calc(var(--sc-spacing-16) * -1);
}

.-mt-20 {
  margin-top: calc(var(--sc-spacing-20) * -1);
}

.-mt-24 {
  margin-top: calc(var(--sc-spacing-24) * -1);
}

.-mt-32 {
  margin-top: calc(var(--sc-spacing-32) * -1);
}

.-mt-4 {
  margin-top: calc(var(--sc-spacing-4) * -1);
}

.-mt-40 {
  margin-top: calc(var(--sc-spacing-40) * -1);
}

.-mt-48 {
  margin-top: calc(var(--sc-spacing-48) * -1);
}

.-mt-56 {
  margin-top: calc(var(--sc-spacing-56) * -1);
}

.-mt-64 {
  margin-top: calc(var(--sc-spacing-64) * -1);
}

.-mt-8 {
  margin-top: calc(var(--sc-spacing-8) * -1);
}

.mb-0 {
  margin-bottom: var(--sc-spacing-0);
}

.mb-12 {
  margin-bottom: var(--sc-spacing-12);
}

.mb-16 {
  margin-bottom: var(--sc-spacing-16);
}

.mb-20 {
  margin-bottom: var(--sc-spacing-20);
}

.mb-24 {
  margin-bottom: var(--sc-spacing-24);
}

.mb-32 {
  margin-bottom: var(--sc-spacing-32);
}

.mb-4 {
  margin-bottom: var(--sc-spacing-4);
}

.mb-40 {
  margin-bottom: var(--sc-spacing-40);
}

.mb-48 {
  margin-bottom: var(--sc-spacing-48);
}

.mb-56 {
  margin-bottom: var(--sc-spacing-56);
}

.mb-64 {
  margin-bottom: var(--sc-spacing-64);
}

.mb-8 {
  margin-bottom: var(--sc-spacing-8);
}

.mb-auto {
  margin-bottom: auto;
}

.me-0 {
  margin-inline-end: var(--sc-spacing-0);
}

.me-12 {
  margin-inline-end: var(--sc-spacing-12);
}

.me-16 {
  margin-inline-end: var(--sc-spacing-16);
}

.me-20 {
  margin-inline-end: var(--sc-spacing-20);
}

.me-24 {
  margin-inline-end: var(--sc-spacing-24);
}

.me-32 {
  margin-inline-end: var(--sc-spacing-32);
}

.me-4 {
  margin-inline-end: var(--sc-spacing-4);
}

.me-40 {
  margin-inline-end: var(--sc-spacing-40);
}

.me-48 {
  margin-inline-end: var(--sc-spacing-48);
}

.me-56 {
  margin-inline-end: var(--sc-spacing-56);
}

.me-64 {
  margin-inline-end: var(--sc-spacing-64);
}

.me-8 {
  margin-inline-end: var(--sc-spacing-8);
}

.me-auto {
  margin-inline-end: auto;
}

.ml-0 {
  margin-left: var(--sc-spacing-0);
}

.ml-12 {
  margin-left: var(--sc-spacing-12);
}

.ml-16 {
  margin-left: var(--sc-spacing-16);
}

.ml-20 {
  margin-left: var(--sc-spacing-20);
}

.ml-24 {
  margin-left: var(--sc-spacing-24);
}

.ml-32 {
  margin-left: var(--sc-spacing-32);
}

.ml-4 {
  margin-left: var(--sc-spacing-4);
}

.ml-40 {
  margin-left: var(--sc-spacing-40);
}

.ml-48 {
  margin-left: var(--sc-spacing-48);
}

.ml-56 {
  margin-left: var(--sc-spacing-56);
}

.ml-64 {
  margin-left: var(--sc-spacing-64);
}

.ml-8 {
  margin-left: var(--sc-spacing-8);
}

.ml-auto {
  margin-left: auto;
}

.mr-0 {
  margin-right: var(--sc-spacing-0);
}

.mr-12 {
  margin-right: var(--sc-spacing-12);
}

.mr-16 {
  margin-right: var(--sc-spacing-16);
}

.mr-20 {
  margin-right: var(--sc-spacing-20);
}

.mr-24 {
  margin-right: var(--sc-spacing-24);
}

.mr-32 {
  margin-right: var(--sc-spacing-32);
}

.mr-4 {
  margin-right: var(--sc-spacing-4);
}

.mr-40 {
  margin-right: var(--sc-spacing-40);
}

.mr-48 {
  margin-right: var(--sc-spacing-48);
}

.mr-56 {
  margin-right: var(--sc-spacing-56);
}

.mr-64 {
  margin-right: var(--sc-spacing-64);
}

.mr-8 {
  margin-right: var(--sc-spacing-8);
}

.mr-auto {
  margin-right: auto;
}

.ms-0 {
  margin-inline-start: var(--sc-spacing-0);
}

.ms-12 {
  margin-inline-start: var(--sc-spacing-12);
}

.ms-16 {
  margin-inline-start: var(--sc-spacing-16);
}

.ms-20 {
  margin-inline-start: var(--sc-spacing-20);
}

.ms-24 {
  margin-inline-start: var(--sc-spacing-24);
}

.ms-32 {
  margin-inline-start: var(--sc-spacing-32);
}

.ms-4 {
  margin-inline-start: var(--sc-spacing-4);
}

.ms-40 {
  margin-inline-start: var(--sc-spacing-40);
}

.ms-48 {
  margin-inline-start: var(--sc-spacing-48);
}

.ms-56 {
  margin-inline-start: var(--sc-spacing-56);
}

.ms-64 {
  margin-inline-start: var(--sc-spacing-64);
}

.ms-8 {
  margin-inline-start: var(--sc-spacing-8);
}

.ms-auto {
  margin-inline-start: auto;
}

.mt-0 {
  margin-top: var(--sc-spacing-0);
}

.mt-12 {
  margin-top: var(--sc-spacing-12);
}

.mt-16 {
  margin-top: var(--sc-spacing-16);
}

.mt-20 {
  margin-top: var(--sc-spacing-20);
}

.mt-24 {
  margin-top: var(--sc-spacing-24);
}

.mt-32 {
  margin-top: var(--sc-spacing-32);
}

.mt-4 {
  margin-top: var(--sc-spacing-4);
}

.mt-40 {
  margin-top: var(--sc-spacing-40);
}

.mt-48 {
  margin-top: var(--sc-spacing-48);
}

.mt-56 {
  margin-top: var(--sc-spacing-56);
}

.mt-64 {
  margin-top: var(--sc-spacing-64);
}

.mt-8 {
  margin-top: var(--sc-spacing-8);
}

.mt-auto {
  margin-top: auto;
}

.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.line-clamp-4 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.line-clamp-5 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
}

.line-clamp-6 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
}

.line-clamp-none {
  overflow: visible;
  display: block;
  -webkit-box-orient: horizontal;
  -webkit-line-clamp: none;
}

.aspect-auto {
  aspect-ratio: auto;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}

.aspect-video {
  aspect-ratio: 16 / 9;
}

.size-0 {
  width: var(--sc-spacing-0);
  height: var(--sc-spacing-0);
}

.size-1\/12 {
  width: 8.333333%;
  height: 8.333333%;
}

.size-1\/2 {
  width: 50%;
  height: 50%;
}

.size-1\/3 {
  width: 33.333333%;
  height: 33.333333%;
}

.size-1\/4 {
  width: 25%;
  height: 25%;
}

.size-1\/5 {
  width: 20%;
  height: 20%;
}

.size-1\/6 {
  width: 16.666667%;
  height: 16.666667%;
}

.size-10\/12 {
  width: 83.333333%;
  height: 83.333333%;
}

.size-11\/12 {
  width: 91.666667%;
  height: 91.666667%;
}

.size-12 {
  width: var(--sc-spacing-12);
  height: var(--sc-spacing-12);
}

.size-16 {
  width: var(--sc-spacing-16);
  height: var(--sc-spacing-16);
}

.size-2\/12 {
  width: 16.666667%;
  height: 16.666667%;
}

.size-2\/3 {
  width: 66.666667%;
  height: 66.666667%;
}

.size-2\/4 {
  width: 50%;
  height: 50%;
}

.size-2\/5 {
  width: 40%;
  height: 40%;
}

.size-2\/6 {
  width: 33.333333%;
  height: 33.333333%;
}

.size-20 {
  width: var(--sc-spacing-20);
  height: var(--sc-spacing-20);
}

.size-24 {
  width: var(--sc-spacing-24);
  height: var(--sc-spacing-24);
}

.size-3\/12 {
  width: 25%;
  height: 25%;
}

.size-3\/4 {
  width: 75%;
  height: 75%;
}

.size-3\/5 {
  width: 60%;
  height: 60%;
}

.size-3\/6 {
  width: 50%;
  height: 50%;
}

.size-32 {
  width: var(--sc-spacing-32);
  height: var(--sc-spacing-32);
}

.size-4 {
  width: var(--sc-spacing-4);
  height: var(--sc-spacing-4);
}

.size-4\/12 {
  width: 33.333333%;
  height: 33.333333%;
}

.size-4\/5 {
  width: 80%;
  height: 80%;
}

.size-4\/6 {
  width: 66.666667%;
  height: 66.666667%;
}

.size-40 {
  width: var(--sc-spacing-40);
  height: var(--sc-spacing-40);
}

.size-48 {
  width: var(--sc-spacing-48);
  height: var(--sc-spacing-48);
}

.size-5\/12 {
  width: 41.666667%;
  height: 41.666667%;
}

.size-5\/6 {
  width: 83.333333%;
  height: 83.333333%;
}

.size-56 {
  width: var(--sc-spacing-56);
  height: var(--sc-spacing-56);
}

.size-6\/12 {
  width: 50%;
  height: 50%;
}

.size-64 {
  width: var(--sc-spacing-64);
  height: var(--sc-spacing-64);
}

.size-7\/12 {
  width: 58.333333%;
  height: 58.333333%;
}

.size-8 {
  width: var(--sc-spacing-8);
  height: var(--sc-spacing-8);
}

.size-8\/12 {
  width: 66.666667%;
  height: 66.666667%;
}

.size-9\/12 {
  width: 75%;
  height: 75%;
}

.size-auto {
  width: auto;
  height: auto;
}

.size-fit {
  width: -moz-fit-content;
  width: fit-content;
  height: -moz-fit-content;
  height: fit-content;
}

.size-full {
  width: 100%;
  height: 100%;
}

.size-max {
  width: -moz-max-content;
  width: max-content;
  height: -moz-max-content;
  height: max-content;
}

.size-min {
  width: -moz-min-content;
  width: min-content;
  height: -moz-min-content;
  height: min-content;
}

.h-0 {
  height: var(--sc-spacing-0);
}

.h-1\/2 {
  height: 50%;
}

.h-1\/3 {
  height: 33.333333%;
}

.h-1\/4 {
  height: 25%;
}

.h-1\/5 {
  height: 20%;
}

.h-1\/6 {
  height: 16.666667%;
}

.h-12 {
  height: var(--sc-spacing-12);
}

.h-16 {
  height: var(--sc-spacing-16);
}

.h-2\/3 {
  height: 66.666667%;
}

.h-2\/4 {
  height: 50%;
}

.h-2\/5 {
  height: 40%;
}

.h-2\/6 {
  height: 33.333333%;
}

.h-20 {
  height: var(--sc-spacing-20);
}

.h-24 {
  height: var(--sc-spacing-24);
}

.h-3\/4 {
  height: 75%;
}

.h-3\/5 {
  height: 60%;
}

.h-3\/6 {
  height: 50%;
}

.h-32 {
  height: var(--sc-spacing-32);
}

.h-4 {
  height: var(--sc-spacing-4);
}

.h-4\/5 {
  height: 80%;
}

.h-4\/6 {
  height: 66.666667%;
}

.h-40 {
  height: var(--sc-spacing-40);
}

.h-48 {
  height: var(--sc-spacing-48);
}

.h-5\/6 {
  height: 83.333333%;
}

.h-56 {
  height: var(--sc-spacing-56);
}

.h-64 {
  height: var(--sc-spacing-64);
}

.h-8 {
  height: var(--sc-spacing-8);
}

.h-auto {
  height: auto;
}

.h-dvh {
  height: 100dvh;
}

.h-fit {
  height: -moz-fit-content;
  height: fit-content;
}

.h-full {
  height: 100%;
}

.h-lvh {
  height: 100lvh;
}

.h-max {
  height: -moz-max-content;
  height: max-content;
}

.h-min {
  height: -moz-min-content;
  height: min-content;
}

.h-screen {
  height: 100vh;
}

.h-svh {
  height: 100svh;
}

.max-h-0 {
  max-height: var(--sc-spacing-0);
}

.max-h-12 {
  max-height: var(--sc-spacing-12);
}

.max-h-16 {
  max-height: var(--sc-spacing-16);
}

.max-h-20 {
  max-height: var(--sc-spacing-20);
}

.max-h-24 {
  max-height: var(--sc-spacing-24);
}

.max-h-32 {
  max-height: var(--sc-spacing-32);
}

.max-h-4 {
  max-height: var(--sc-spacing-4);
}

.max-h-40 {
  max-height: var(--sc-spacing-40);
}

.max-h-48 {
  max-height: var(--sc-spacing-48);
}

.max-h-56 {
  max-height: var(--sc-spacing-56);
}

.max-h-64 {
  max-height: var(--sc-spacing-64);
}

.max-h-8 {
  max-height: var(--sc-spacing-8);
}

.max-h-dvh {
  max-height: 100dvh;
}

.max-h-fit {
  max-height: -moz-fit-content;
  max-height: fit-content;
}

.max-h-full {
  max-height: 100%;
}

.max-h-lvh {
  max-height: 100lvh;
}

.max-h-max {
  max-height: -moz-max-content;
  max-height: max-content;
}

.max-h-min {
  max-height: -moz-min-content;
  max-height: min-content;
}

.max-h-none {
  max-height: none;
}

.max-h-screen {
  max-height: 100vh;
}

.max-h-svh {
  max-height: 100svh;
}

.min-h-0 {
  min-height: var(--sc-spacing-0);
}

.min-h-12 {
  min-height: var(--sc-spacing-12);
}

.min-h-16 {
  min-height: var(--sc-spacing-16);
}

.min-h-20 {
  min-height: var(--sc-spacing-20);
}

.min-h-24 {
  min-height: var(--sc-spacing-24);
}

.min-h-32 {
  min-height: var(--sc-spacing-32);
}

.min-h-4 {
  min-height: var(--sc-spacing-4);
}

.min-h-40 {
  min-height: var(--sc-spacing-40);
}

.min-h-48 {
  min-height: var(--sc-spacing-48);
}

.min-h-56 {
  min-height: var(--sc-spacing-56);
}

.min-h-64 {
  min-height: var(--sc-spacing-64);
}

.min-h-8 {
  min-height: var(--sc-spacing-8);
}

.min-h-dvh {
  min-height: 100dvh;
}

.min-h-fit {
  min-height: -moz-fit-content;
  min-height: fit-content;
}

.min-h-full {
  min-height: 100%;
}

.min-h-lvh {
  min-height: 100lvh;
}

.min-h-max {
  min-height: -moz-max-content;
  min-height: max-content;
}

.min-h-min {
  min-height: -moz-min-content;
  min-height: min-content;
}

.min-h-screen {
  min-height: 100vh;
}

.min-h-svh {
  min-height: 100svh;
}

.w-0 {
  width: var(--sc-spacing-0);
}

.w-1\/12 {
  width: 8.333333%;
}

.w-1\/2 {
  width: 50%;
}

.w-1\/3 {
  width: 33.333333%;
}

.w-1\/4 {
  width: 25%;
}

.w-1\/5 {
  width: 20%;
}

.w-1\/6 {
  width: 16.666667%;
}

.w-10\/12 {
  width: 83.333333%;
}

.w-11\/12 {
  width: 91.666667%;
}

.w-12 {
  width: var(--sc-spacing-12);
}

.w-16 {
  width: var(--sc-spacing-16);
}

.w-2\/12 {
  width: 16.666667%;
}

.w-2\/3 {
  width: 66.666667%;
}

.w-2\/4 {
  width: 50%;
}

.w-2\/5 {
  width: 40%;
}

.w-2\/6 {
  width: 33.333333%;
}

.w-20 {
  width: var(--sc-spacing-20);
}

.w-24 {
  width: var(--sc-spacing-24);
}

.w-3\/12 {
  width: 25%;
}

.w-3\/4 {
  width: 75%;
}

.w-3\/5 {
  width: 60%;
}

.w-3\/6 {
  width: 50%;
}

.w-32 {
  width: var(--sc-spacing-32);
}

.w-4 {
  width: var(--sc-spacing-4);
}

.w-4\/12 {
  width: 33.333333%;
}

.w-4\/5 {
  width: 80%;
}

.w-4\/6 {
  width: 66.666667%;
}

.w-40 {
  width: var(--sc-spacing-40);
}

.w-48 {
  width: var(--sc-spacing-48);
}

.w-5\/12 {
  width: 41.666667%;
}

.w-5\/6 {
  width: 83.333333%;
}

.w-56 {
  width: var(--sc-spacing-56);
}

.w-6\/12 {
  width: 50%;
}

.w-64 {
  width: var(--sc-spacing-64);
}

.w-7\/12 {
  width: 58.333333%;
}

.w-8 {
  width: var(--sc-spacing-8);
}

.w-8\/12 {
  width: 66.666667%;
}

.w-9\/12 {
  width: 75%;
}

.w-auto {
  width: auto;
}

.w-dvw {
  width: 100dvw;
}

.w-fit {
  width: -moz-fit-content;
  width: fit-content;
}

.w-full {
  width: 100%;
}

.w-lvw {
  width: 100lvw;
}

.w-max {
  width: -moz-max-content;
  width: max-content;
}

.w-min {
  width: -moz-min-content;
  width: min-content;
}

.w-screen {
  width: 100vw;
}

.w-svw {
  width: 100svw;
}

.min-w-0 {
  min-width: var(--sc-spacing-0);
}

.min-w-12 {
  min-width: var(--sc-spacing-12);
}

.min-w-16 {
  min-width: var(--sc-spacing-16);
}

.min-w-20 {
  min-width: var(--sc-spacing-20);
}

.min-w-24 {
  min-width: var(--sc-spacing-24);
}

.min-w-32 {
  min-width: var(--sc-spacing-32);
}

.min-w-4 {
  min-width: var(--sc-spacing-4);
}

.min-w-40 {
  min-width: var(--sc-spacing-40);
}

.min-w-48 {
  min-width: var(--sc-spacing-48);
}

.min-w-56 {
  min-width: var(--sc-spacing-56);
}

.min-w-64 {
  min-width: var(--sc-spacing-64);
}

.min-w-8 {
  min-width: var(--sc-spacing-8);
}

.min-w-fit {
  min-width: -moz-fit-content;
  min-width: fit-content;
}

.min-w-full {
  min-width: 100%;
}

.min-w-max {
  min-width: -moz-max-content;
  min-width: max-content;
}

.min-w-min {
  min-width: -moz-min-content;
  min-width: min-content;
}

.max-w-0 {
  max-width: var(--sc-spacing-0);
}

.max-w-12 {
  max-width: var(--sc-spacing-12);
}

.max-w-16 {
  max-width: var(--sc-spacing-16);
}

.max-w-20 {
  max-width: var(--sc-spacing-20);
}

.max-w-24 {
  max-width: var(--sc-spacing-24);
}

.max-w-2xl {
  max-width: 42rem;
}

.max-w-32 {
  max-width: var(--sc-spacing-32);
}

.max-w-3xl {
  max-width: 48rem;
}

.max-w-4 {
  max-width: var(--sc-spacing-4);
}

.max-w-40 {
  max-width: var(--sc-spacing-40);
}

.max-w-48 {
  max-width: var(--sc-spacing-48);
}

.max-w-4xl {
  max-width: 56rem;
}

.max-w-56 {
  max-width: var(--sc-spacing-56);
}

.max-w-5xl {
  max-width: 64rem;
}

.max-w-64 {
  max-width: var(--sc-spacing-64);
}

.max-w-6xl {
  max-width: 72rem;
}

.max-w-7xl {
  max-width: 80rem;
}

.max-w-8 {
  max-width: var(--sc-spacing-8);
}

.max-w-fit {
  max-width: -moz-fit-content;
  max-width: fit-content;
}

.max-w-full {
  max-width: 100%;
}

.max-w-lg {
  max-width: 32rem;
}

.max-w-max {
  max-width: -moz-max-content;
  max-width: max-content;
}

.max-w-md {
  max-width: 28rem;
}

.max-w-min {
  max-width: -moz-min-content;
  max-width: min-content;
}

.max-w-none {
  max-width: none;
}

.max-w-prose {
  max-width: 65ch;
}

.max-w-screen-2xl {
  max-width: var(--sc-screen-xxl);
}

.max-w-screen-lg {
  max-width: var(--sc-screen-lg);
}

.max-w-screen-md {
  max-width: var(--sc-screen-md);
}

.max-w-screen-sm {
  max-width: var(--sc-screen-sm);
}

.max-w-screen-xl {
  max-width: var(--sc-screen-xl);
}

.max-w-screen-xs {
  max-width: var(--sc-screen-xs);
}

.max-w-screen-xxl {
  max-width: var(--sc-screen-xxl);
}

.max-w-sm {
  max-width: 24rem;
}

.max-w-xl {
  max-width: 36rem;
}

.max-w-xs {
  max-width: 20rem;
}

.flex-1 {
  flex: 1 1 0%;
}

.flex-auto {
  flex: 1 1 auto;
}

.flex-initial {
  flex: 0 1 auto;
}

.flex-none {
  flex: none;
}

.flex-shrink {
  flex-shrink: 1;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.shrink {
  flex-shrink: 1;
}

.shrink-0 {
  flex-shrink: 0;
}

.flex-grow {
  flex-grow: 1;
}

.flex-grow-0 {
  flex-grow: 0;
}

.grow {
  flex-grow: 1;
}

.grow-0 {
  flex-grow: 0;
}

.basis-0 {
  flex-basis: var(--sc-spacing-0);
}

.basis-1\/12 {
  flex-basis: 8.333333%;
}

.basis-1\/2 {
  flex-basis: 50%;
}

.basis-1\/3 {
  flex-basis: 33.333333%;
}

.basis-1\/4 {
  flex-basis: 25%;
}

.basis-1\/5 {
  flex-basis: 20%;
}

.basis-1\/6 {
  flex-basis: 16.666667%;
}

.basis-10\/12 {
  flex-basis: 83.333333%;
}

.basis-11\/12 {
  flex-basis: 91.666667%;
}

.basis-12 {
  flex-basis: var(--sc-spacing-12);
}

.basis-16 {
  flex-basis: var(--sc-spacing-16);
}

.basis-2\/12 {
  flex-basis: 16.666667%;
}

.basis-2\/3 {
  flex-basis: 66.666667%;
}

.basis-2\/4 {
  flex-basis: 50%;
}

.basis-2\/5 {
  flex-basis: 40%;
}

.basis-2\/6 {
  flex-basis: 33.333333%;
}

.basis-20 {
  flex-basis: var(--sc-spacing-20);
}

.basis-24 {
  flex-basis: var(--sc-spacing-24);
}

.basis-3\/12 {
  flex-basis: 25%;
}

.basis-3\/4 {
  flex-basis: 75%;
}

.basis-3\/5 {
  flex-basis: 60%;
}

.basis-3\/6 {
  flex-basis: 50%;
}

.basis-32 {
  flex-basis: var(--sc-spacing-32);
}

.basis-4 {
  flex-basis: var(--sc-spacing-4);
}

.basis-4\/12 {
  flex-basis: 33.333333%;
}

.basis-4\/5 {
  flex-basis: 80%;
}

.basis-4\/6 {
  flex-basis: 66.666667%;
}

.basis-40 {
  flex-basis: var(--sc-spacing-40);
}

.basis-48 {
  flex-basis: var(--sc-spacing-48);
}

.basis-5\/12 {
  flex-basis: 41.666667%;
}

.basis-5\/6 {
  flex-basis: 83.333333%;
}

.basis-56 {
  flex-basis: var(--sc-spacing-56);
}

.basis-6\/12 {
  flex-basis: 50%;
}

.basis-64 {
  flex-basis: var(--sc-spacing-64);
}

.basis-7\/12 {
  flex-basis: 58.333333%;
}

.basis-8 {
  flex-basis: var(--sc-spacing-8);
}

.basis-8\/12 {
  flex-basis: 66.666667%;
}

.basis-9\/12 {
  flex-basis: 75%;
}

.basis-auto {
  flex-basis: auto;
}

.basis-full {
  flex-basis: 100%;
}

.border-spacing-0 {
  --tw-border-spacing-x: var(--sc-spacing-0);
  --tw-border-spacing-y: var(--sc-spacing-0);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-12 {
  --tw-border-spacing-x: var(--sc-spacing-12);
  --tw-border-spacing-y: var(--sc-spacing-12);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-16 {
  --tw-border-spacing-x: var(--sc-spacing-16);
  --tw-border-spacing-y: var(--sc-spacing-16);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-20 {
  --tw-border-spacing-x: var(--sc-spacing-20);
  --tw-border-spacing-y: var(--sc-spacing-20);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-24 {
  --tw-border-spacing-x: var(--sc-spacing-24);
  --tw-border-spacing-y: var(--sc-spacing-24);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-32 {
  --tw-border-spacing-x: var(--sc-spacing-32);
  --tw-border-spacing-y: var(--sc-spacing-32);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-4 {
  --tw-border-spacing-x: var(--sc-spacing-4);
  --tw-border-spacing-y: var(--sc-spacing-4);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-40 {
  --tw-border-spacing-x: var(--sc-spacing-40);
  --tw-border-spacing-y: var(--sc-spacing-40);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-48 {
  --tw-border-spacing-x: var(--sc-spacing-48);
  --tw-border-spacing-y: var(--sc-spacing-48);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-56 {
  --tw-border-spacing-x: var(--sc-spacing-56);
  --tw-border-spacing-y: var(--sc-spacing-56);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-64 {
  --tw-border-spacing-x: var(--sc-spacing-64);
  --tw-border-spacing-y: var(--sc-spacing-64);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-8 {
  --tw-border-spacing-x: var(--sc-spacing-8);
  --tw-border-spacing-y: var(--sc-spacing-8);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-x-0 {
  --tw-border-spacing-x: var(--sc-spacing-0);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-x-12 {
  --tw-border-spacing-x: var(--sc-spacing-12);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-x-16 {
  --tw-border-spacing-x: var(--sc-spacing-16);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-x-20 {
  --tw-border-spacing-x: var(--sc-spacing-20);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-x-24 {
  --tw-border-spacing-x: var(--sc-spacing-24);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-x-32 {
  --tw-border-spacing-x: var(--sc-spacing-32);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-x-4 {
  --tw-border-spacing-x: var(--sc-spacing-4);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-x-40 {
  --tw-border-spacing-x: var(--sc-spacing-40);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-x-48 {
  --tw-border-spacing-x: var(--sc-spacing-48);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-x-56 {
  --tw-border-spacing-x: var(--sc-spacing-56);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-x-64 {
  --tw-border-spacing-x: var(--sc-spacing-64);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-x-8 {
  --tw-border-spacing-x: var(--sc-spacing-8);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-y-0 {
  --tw-border-spacing-y: var(--sc-spacing-0);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-y-12 {
  --tw-border-spacing-y: var(--sc-spacing-12);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-y-16 {
  --tw-border-spacing-y: var(--sc-spacing-16);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-y-20 {
  --tw-border-spacing-y: var(--sc-spacing-20);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-y-24 {
  --tw-border-spacing-y: var(--sc-spacing-24);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-y-32 {
  --tw-border-spacing-y: var(--sc-spacing-32);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-y-4 {
  --tw-border-spacing-y: var(--sc-spacing-4);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-y-40 {
  --tw-border-spacing-y: var(--sc-spacing-40);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-y-48 {
  --tw-border-spacing-y: var(--sc-spacing-48);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-y-56 {
  --tw-border-spacing-y: var(--sc-spacing-56);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-y-64 {
  --tw-border-spacing-y: var(--sc-spacing-64);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.border-spacing-y-8 {
  --tw-border-spacing-y: var(--sc-spacing-8);
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}

.origin-bottom {
  transform-origin: bottom;
}

.origin-bottom-left {
  transform-origin: bottom left;
}

.origin-bottom-right {
  transform-origin: bottom right;
}

.origin-center {
  transform-origin: center;
}

.origin-left {
  transform-origin: left;
}

.origin-right {
  transform-origin: right;
}

.origin-top {
  transform-origin: top;
}

.origin-top-left {
  transform-origin: top left;
}

.origin-top-right {
  transform-origin: top right;
}

.-translate-x-0 {
  --tw-translate-x: calc(var(--sc-spacing-0) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-1\/2 {
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-1\/3 {
  --tw-translate-x: -33.333333%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-1\/4 {
  --tw-translate-x: -25%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-12 {
  --tw-translate-x: calc(var(--sc-spacing-12) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-16 {
  --tw-translate-x: calc(var(--sc-spacing-16) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-2\/3 {
  --tw-translate-x: -66.666667%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-2\/4 {
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-20 {
  --tw-translate-x: calc(var(--sc-spacing-20) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-24 {
  --tw-translate-x: calc(var(--sc-spacing-24) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-3\/4 {
  --tw-translate-x: -75%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-32 {
  --tw-translate-x: calc(var(--sc-spacing-32) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-4 {
  --tw-translate-x: calc(var(--sc-spacing-4) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-40 {
  --tw-translate-x: calc(var(--sc-spacing-40) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-48 {
  --tw-translate-x: calc(var(--sc-spacing-48) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-56 {
  --tw-translate-x: calc(var(--sc-spacing-56) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-64 {
  --tw-translate-x: calc(var(--sc-spacing-64) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-8 {
  --tw-translate-x: calc(var(--sc-spacing-8) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-full {
  --tw-translate-x: -100%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-0 {
  --tw-translate-y: calc(var(--sc-spacing-0) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-1\/2 {
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-1\/3 {
  --tw-translate-y: -33.333333%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-1\/4 {
  --tw-translate-y: -25%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-12 {
  --tw-translate-y: calc(var(--sc-spacing-12) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-16 {
  --tw-translate-y: calc(var(--sc-spacing-16) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-2\/3 {
  --tw-translate-y: -66.666667%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-2\/4 {
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-20 {
  --tw-translate-y: calc(var(--sc-spacing-20) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-24 {
  --tw-translate-y: calc(var(--sc-spacing-24) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-3\/4 {
  --tw-translate-y: -75%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-32 {
  --tw-translate-y: calc(var(--sc-spacing-32) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-4 {
  --tw-translate-y: calc(var(--sc-spacing-4) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-40 {
  --tw-translate-y: calc(var(--sc-spacing-40) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-48 {
  --tw-translate-y: calc(var(--sc-spacing-48) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-56 {
  --tw-translate-y: calc(var(--sc-spacing-56) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-64 {
  --tw-translate-y: calc(var(--sc-spacing-64) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-8 {
  --tw-translate-y: calc(var(--sc-spacing-8) * -1);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-full {
  --tw-translate-y: -100%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-0 {
  --tw-translate-x: var(--sc-spacing-0);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-1\/2 {
  --tw-translate-x: 50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-1\/3 {
  --tw-translate-x: 33.333333%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-1\/4 {
  --tw-translate-x: 25%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-12 {
  --tw-translate-x: var(--sc-spacing-12);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-16 {
  --tw-translate-x: var(--sc-spacing-16);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-2\/3 {
  --tw-translate-x: 66.666667%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-2\/4 {
  --tw-translate-x: 50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-20 {
  --tw-translate-x: var(--sc-spacing-20);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-24 {
  --tw-translate-x: var(--sc-spacing-24);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-3\/4 {
  --tw-translate-x: 75%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-32 {
  --tw-translate-x: var(--sc-spacing-32);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-4 {
  --tw-translate-x: var(--sc-spacing-4);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-40 {
  --tw-translate-x: var(--sc-spacing-40);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-48 {
  --tw-translate-x: var(--sc-spacing-48);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-56 {
  --tw-translate-x: var(--sc-spacing-56);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-64 {
  --tw-translate-x: var(--sc-spacing-64);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-8 {
  --tw-translate-x: var(--sc-spacing-8);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-full {
  --tw-translate-x: 100%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-0 {
  --tw-translate-y: var(--sc-spacing-0);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-1\/2 {
  --tw-translate-y: 50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-1\/3 {
  --tw-translate-y: 33.333333%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-1\/4 {
  --tw-translate-y: 25%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-12 {
  --tw-translate-y: var(--sc-spacing-12);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-16 {
  --tw-translate-y: var(--sc-spacing-16);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-2\/3 {
  --tw-translate-y: 66.666667%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-2\/4 {
  --tw-translate-y: 50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-20 {
  --tw-translate-y: var(--sc-spacing-20);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-24 {
  --tw-translate-y: var(--sc-spacing-24);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-3\/4 {
  --tw-translate-y: 75%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-32 {
  --tw-translate-y: var(--sc-spacing-32);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-4 {
  --tw-translate-y: var(--sc-spacing-4);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-40 {
  --tw-translate-y: var(--sc-spacing-40);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-48 {
  --tw-translate-y: var(--sc-spacing-48);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-56 {
  --tw-translate-y: var(--sc-spacing-56);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-64 {
  --tw-translate-y: var(--sc-spacing-64);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-8 {
  --tw-translate-y: var(--sc-spacing-8);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-full {
  --tw-translate-y: 100%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-rotate-0 {
  --tw-rotate: -0deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-rotate-1 {
  --tw-rotate: -1deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-rotate-12 {
  --tw-rotate: -12deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-rotate-180 {
  --tw-rotate: -180deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-rotate-2 {
  --tw-rotate: -2deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-rotate-3 {
  --tw-rotate: -3deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-rotate-45 {
  --tw-rotate: -45deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-rotate-6 {
  --tw-rotate: -6deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-rotate-90 {
  --tw-rotate: -90deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.rotate-0 {
  --tw-rotate: 0deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.rotate-1 {
  --tw-rotate: 1deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.rotate-12 {
  --tw-rotate: 12deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.rotate-180 {
  --tw-rotate: 180deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.rotate-2 {
  --tw-rotate: 2deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.rotate-3 {
  --tw-rotate: 3deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.rotate-45 {
  --tw-rotate: 45deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.rotate-6 {
  --tw-rotate: 6deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.rotate-90 {
  --tw-rotate: 90deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-skew-x-0 {
  --tw-skew-x: -0deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-skew-x-1 {
  --tw-skew-x: -1deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-skew-x-12 {
  --tw-skew-x: -12deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-skew-x-2 {
  --tw-skew-x: -2deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-skew-x-3 {
  --tw-skew-x: -3deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-skew-x-6 {
  --tw-skew-x: -6deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-skew-y-0 {
  --tw-skew-y: -0deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-skew-y-1 {
  --tw-skew-y: -1deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-skew-y-12 {
  --tw-skew-y: -12deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-skew-y-2 {
  --tw-skew-y: -2deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-skew-y-3 {
  --tw-skew-y: -3deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-skew-y-6 {
  --tw-skew-y: -6deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.skew-x-0 {
  --tw-skew-x: 0deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.skew-x-1 {
  --tw-skew-x: 1deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.skew-x-12 {
  --tw-skew-x: 12deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.skew-x-2 {
  --tw-skew-x: 2deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.skew-x-3 {
  --tw-skew-x: 3deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.skew-x-6 {
  --tw-skew-x: 6deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.skew-y-0 {
  --tw-skew-y: 0deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.skew-y-1 {
  --tw-skew-y: 1deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.skew-y-12 {
  --tw-skew-y: 12deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.skew-y-2 {
  --tw-skew-y: 2deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.skew-y-3 {
  --tw-skew-y: 3deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.skew-y-6 {
  --tw-skew-y: 6deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-0 {
  --tw-scale-x: 0;
  --tw-scale-y: 0;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-100 {
  --tw-scale-x: -1;
  --tw-scale-y: -1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-105 {
  --tw-scale-x: -1.05;
  --tw-scale-y: -1.05;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-110 {
  --tw-scale-x: -1.1;
  --tw-scale-y: -1.1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-125 {
  --tw-scale-x: -1.25;
  --tw-scale-y: -1.25;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-150 {
  --tw-scale-x: -1.5;
  --tw-scale-y: -1.5;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-50 {
  --tw-scale-x: -.5;
  --tw-scale-y: -.5;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-75 {
  --tw-scale-x: -.75;
  --tw-scale-y: -.75;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-90 {
  --tw-scale-x: -.9;
  --tw-scale-y: -.9;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-95 {
  --tw-scale-x: -.95;
  --tw-scale-y: -.95;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-0 {
  --tw-scale-x: 0;
  --tw-scale-y: 0;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-100 {
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-105 {
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-110 {
  --tw-scale-x: 1.1;
  --tw-scale-y: 1.1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-125 {
  --tw-scale-x: 1.25;
  --tw-scale-y: 1.25;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-150 {
  --tw-scale-x: 1.5;
  --tw-scale-y: 1.5;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-50 {
  --tw-scale-x: .5;
  --tw-scale-y: .5;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-75 {
  --tw-scale-x: .75;
  --tw-scale-y: .75;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-90 {
  --tw-scale-x: .9;
  --tw-scale-y: .9;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-95 {
  --tw-scale-x: .95;
  --tw-scale-y: .95;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-x-0 {
  --tw-scale-x: 0;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-x-100 {
  --tw-scale-x: -1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-x-105 {
  --tw-scale-x: -1.05;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-x-110 {
  --tw-scale-x: -1.1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-x-125 {
  --tw-scale-x: -1.25;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-x-150 {
  --tw-scale-x: -1.5;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-x-50 {
  --tw-scale-x: -.5;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-x-75 {
  --tw-scale-x: -.75;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-x-90 {
  --tw-scale-x: -.9;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-x-95 {
  --tw-scale-x: -.95;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-y-0 {
  --tw-scale-y: 0;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-y-100 {
  --tw-scale-y: -1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-y-105 {
  --tw-scale-y: -1.05;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-y-110 {
  --tw-scale-y: -1.1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-y-125 {
  --tw-scale-y: -1.25;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-y-150 {
  --tw-scale-y: -1.5;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-y-50 {
  --tw-scale-y: -.5;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-y-75 {
  --tw-scale-y: -.75;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-y-90 {
  --tw-scale-y: -.9;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-scale-y-95 {
  --tw-scale-y: -.95;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-x-0 {
  --tw-scale-x: 0;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-x-100 {
  --tw-scale-x: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-x-105 {
  --tw-scale-x: 1.05;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-x-110 {
  --tw-scale-x: 1.1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-x-125 {
  --tw-scale-x: 1.25;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-x-150 {
  --tw-scale-x: 1.5;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-x-50 {
  --tw-scale-x: .5;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-x-75 {
  --tw-scale-x: .75;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-x-90 {
  --tw-scale-x: .9;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-x-95 {
  --tw-scale-x: .95;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-y-0 {
  --tw-scale-y: 0;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-y-100 {
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-y-105 {
  --tw-scale-y: 1.05;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-y-110 {
  --tw-scale-y: 1.1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-y-125 {
  --tw-scale-y: 1.25;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-y-150 {
  --tw-scale-y: 1.5;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-y-50 {
  --tw-scale-y: .5;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-y-75 {
  --tw-scale-y: .75;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-y-90 {
  --tw-scale-y: .9;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-y-95 {
  --tw-scale-y: .95;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8,0,1,1);
  }

  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0,0,0.2,1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

.animate-none {
  animation: none;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes pulse {
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.cursor-alias {
  cursor: alias;
}

.cursor-all-scroll {
  cursor: all-scroll;
}

.cursor-auto {
  cursor: auto;
}

.cursor-cell {
  cursor: cell;
}

.cursor-col-resize {
  cursor: col-resize;
}

.cursor-context-menu {
  cursor: context-menu;
}

.cursor-copy {
  cursor: copy;
}

.cursor-crosshair {
  cursor: crosshair;
}

.cursor-default {
  cursor: default;
}

.cursor-e-resize {
  cursor: e-resize;
}

.cursor-ew-resize {
  cursor: ew-resize;
}

.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing;
}

.cursor-help {
  cursor: help;
}

.cursor-move {
  cursor: move;
}

.cursor-n-resize {
  cursor: n-resize;
}

.cursor-ne-resize {
  cursor: ne-resize;
}

.cursor-nesw-resize {
  cursor: nesw-resize;
}

.cursor-no-drop {
  cursor: no-drop;
}

.cursor-none {
  cursor: none;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

.cursor-ns-resize {
  cursor: ns-resize;
}

.cursor-nw-resize {
  cursor: nw-resize;
}

.cursor-nwse-resize {
  cursor: nwse-resize;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-progress {
  cursor: progress;
}

.cursor-row-resize {
  cursor: row-resize;
}

.cursor-s-resize {
  cursor: s-resize;
}

.cursor-se-resize {
  cursor: se-resize;
}

.cursor-sw-resize {
  cursor: sw-resize;
}

.cursor-text {
  cursor: text;
}

.cursor-vertical-text {
  cursor: vertical-text;
}

.cursor-w-resize {
  cursor: w-resize;
}

.cursor-wait {
  cursor: wait;
}

.cursor-zoom-in {
  cursor: zoom-in;
}

.cursor-zoom-out {
  cursor: zoom-out;
}

.-scroll-m-0 {
  scroll-margin: calc(var(--sc-spacing-0) * -1);
}

.-scroll-m-12 {
  scroll-margin: calc(var(--sc-spacing-12) * -1);
}

.-scroll-m-16 {
  scroll-margin: calc(var(--sc-spacing-16) * -1);
}

.-scroll-m-20 {
  scroll-margin: calc(var(--sc-spacing-20) * -1);
}

.-scroll-m-24 {
  scroll-margin: calc(var(--sc-spacing-24) * -1);
}

.-scroll-m-32 {
  scroll-margin: calc(var(--sc-spacing-32) * -1);
}

.-scroll-m-4 {
  scroll-margin: calc(var(--sc-spacing-4) * -1);
}

.-scroll-m-40 {
  scroll-margin: calc(var(--sc-spacing-40) * -1);
}

.-scroll-m-48 {
  scroll-margin: calc(var(--sc-spacing-48) * -1);
}

.-scroll-m-56 {
  scroll-margin: calc(var(--sc-spacing-56) * -1);
}

.-scroll-m-64 {
  scroll-margin: calc(var(--sc-spacing-64) * -1);
}

.-scroll-m-8 {
  scroll-margin: calc(var(--sc-spacing-8) * -1);
}

.scroll-m-0 {
  scroll-margin: var(--sc-spacing-0);
}

.scroll-m-12 {
  scroll-margin: var(--sc-spacing-12);
}

.scroll-m-16 {
  scroll-margin: var(--sc-spacing-16);
}

.scroll-m-20 {
  scroll-margin: var(--sc-spacing-20);
}

.scroll-m-24 {
  scroll-margin: var(--sc-spacing-24);
}

.scroll-m-32 {
  scroll-margin: var(--sc-spacing-32);
}

.scroll-m-4 {
  scroll-margin: var(--sc-spacing-4);
}

.scroll-m-40 {
  scroll-margin: var(--sc-spacing-40);
}

.scroll-m-48 {
  scroll-margin: var(--sc-spacing-48);
}

.scroll-m-56 {
  scroll-margin: var(--sc-spacing-56);
}

.scroll-m-64 {
  scroll-margin: var(--sc-spacing-64);
}

.scroll-m-8 {
  scroll-margin: var(--sc-spacing-8);
}

.-scroll-mx-0 {
  scroll-margin-left: calc(var(--sc-spacing-0) * -1);
  scroll-margin-right: calc(var(--sc-spacing-0) * -1);
}

.-scroll-mx-12 {
  scroll-margin-left: calc(var(--sc-spacing-12) * -1);
  scroll-margin-right: calc(var(--sc-spacing-12) * -1);
}

.-scroll-mx-16 {
  scroll-margin-left: calc(var(--sc-spacing-16) * -1);
  scroll-margin-right: calc(var(--sc-spacing-16) * -1);
}

.-scroll-mx-20 {
  scroll-margin-left: calc(var(--sc-spacing-20) * -1);
  scroll-margin-right: calc(var(--sc-spacing-20) * -1);
}

.-scroll-mx-24 {
  scroll-margin-left: calc(var(--sc-spacing-24) * -1);
  scroll-margin-right: calc(var(--sc-spacing-24) * -1);
}

.-scroll-mx-32 {
  scroll-margin-left: calc(var(--sc-spacing-32) * -1);
  scroll-margin-right: calc(var(--sc-spacing-32) * -1);
}

.-scroll-mx-4 {
  scroll-margin-left: calc(var(--sc-spacing-4) * -1);
  scroll-margin-right: calc(var(--sc-spacing-4) * -1);
}

.-scroll-mx-40 {
  scroll-margin-left: calc(var(--sc-spacing-40) * -1);
  scroll-margin-right: calc(var(--sc-spacing-40) * -1);
}

.-scroll-mx-48 {
  scroll-margin-left: calc(var(--sc-spacing-48) * -1);
  scroll-margin-right: calc(var(--sc-spacing-48) * -1);
}

.-scroll-mx-56 {
  scroll-margin-left: calc(var(--sc-spacing-56) * -1);
  scroll-margin-right: calc(var(--sc-spacing-56) * -1);
}

.-scroll-mx-64 {
  scroll-margin-left: calc(var(--sc-spacing-64) * -1);
  scroll-margin-right: calc(var(--sc-spacing-64) * -1);
}

.-scroll-mx-8 {
  scroll-margin-left: calc(var(--sc-spacing-8) * -1);
  scroll-margin-right: calc(var(--sc-spacing-8) * -1);
}

.-scroll-my-0 {
  scroll-margin-top: calc(var(--sc-spacing-0) * -1);
  scroll-margin-bottom: calc(var(--sc-spacing-0) * -1);
}

.-scroll-my-12 {
  scroll-margin-top: calc(var(--sc-spacing-12) * -1);
  scroll-margin-bottom: calc(var(--sc-spacing-12) * -1);
}

.-scroll-my-16 {
  scroll-margin-top: calc(var(--sc-spacing-16) * -1);
  scroll-margin-bottom: calc(var(--sc-spacing-16) * -1);
}

.-scroll-my-20 {
  scroll-margin-top: calc(var(--sc-spacing-20) * -1);
  scroll-margin-bottom: calc(var(--sc-spacing-20) * -1);
}

.-scroll-my-24 {
  scroll-margin-top: calc(var(--sc-spacing-24) * -1);
  scroll-margin-bottom: calc(var(--sc-spacing-24) * -1);
}

.-scroll-my-32 {
  scroll-margin-top: calc(var(--sc-spacing-32) * -1);
  scroll-margin-bottom: calc(var(--sc-spacing-32) * -1);
}

.-scroll-my-4 {
  scroll-margin-top: calc(var(--sc-spacing-4) * -1);
  scroll-margin-bottom: calc(var(--sc-spacing-4) * -1);
}

.-scroll-my-40 {
  scroll-margin-top: calc(var(--sc-spacing-40) * -1);
  scroll-margin-bottom: calc(var(--sc-spacing-40) * -1);
}

.-scroll-my-48 {
  scroll-margin-top: calc(var(--sc-spacing-48) * -1);
  scroll-margin-bottom: calc(var(--sc-spacing-48) * -1);
}

.-scroll-my-56 {
  scroll-margin-top: calc(var(--sc-spacing-56) * -1);
  scroll-margin-bottom: calc(var(--sc-spacing-56) * -1);
}

.-scroll-my-64 {
  scroll-margin-top: calc(var(--sc-spacing-64) * -1);
  scroll-margin-bottom: calc(var(--sc-spacing-64) * -1);
}

.-scroll-my-8 {
  scroll-margin-top: calc(var(--sc-spacing-8) * -1);
  scroll-margin-bottom: calc(var(--sc-spacing-8) * -1);
}

.scroll-mx-0 {
  scroll-margin-left: var(--sc-spacing-0);
  scroll-margin-right: var(--sc-spacing-0);
}

.scroll-mx-12 {
  scroll-margin-left: var(--sc-spacing-12);
  scroll-margin-right: var(--sc-spacing-12);
}

.scroll-mx-16 {
  scroll-margin-left: var(--sc-spacing-16);
  scroll-margin-right: var(--sc-spacing-16);
}

.scroll-mx-20 {
  scroll-margin-left: var(--sc-spacing-20);
  scroll-margin-right: var(--sc-spacing-20);
}

.scroll-mx-24 {
  scroll-margin-left: var(--sc-spacing-24);
  scroll-margin-right: var(--sc-spacing-24);
}

.scroll-mx-32 {
  scroll-margin-left: var(--sc-spacing-32);
  scroll-margin-right: var(--sc-spacing-32);
}

.scroll-mx-4 {
  scroll-margin-left: var(--sc-spacing-4);
  scroll-margin-right: var(--sc-spacing-4);
}

.scroll-mx-40 {
  scroll-margin-left: var(--sc-spacing-40);
  scroll-margin-right: var(--sc-spacing-40);
}

.scroll-mx-48 {
  scroll-margin-left: var(--sc-spacing-48);
  scroll-margin-right: var(--sc-spacing-48);
}

.scroll-mx-56 {
  scroll-margin-left: var(--sc-spacing-56);
  scroll-margin-right: var(--sc-spacing-56);
}

.scroll-mx-64 {
  scroll-margin-left: var(--sc-spacing-64);
  scroll-margin-right: var(--sc-spacing-64);
}

.scroll-mx-8 {
  scroll-margin-left: var(--sc-spacing-8);
  scroll-margin-right: var(--sc-spacing-8);
}

.scroll-my-0 {
  scroll-margin-top: var(--sc-spacing-0);
  scroll-margin-bottom: var(--sc-spacing-0);
}

.scroll-my-12 {
  scroll-margin-top: var(--sc-spacing-12);
  scroll-margin-bottom: var(--sc-spacing-12);
}

.scroll-my-16 {
  scroll-margin-top: var(--sc-spacing-16);
  scroll-margin-bottom: var(--sc-spacing-16);
}

.scroll-my-20 {
  scroll-margin-top: var(--sc-spacing-20);
  scroll-margin-bottom: var(--sc-spacing-20);
}

.scroll-my-24 {
  scroll-margin-top: var(--sc-spacing-24);
  scroll-margin-bottom: var(--sc-spacing-24);
}

.scroll-my-32 {
  scroll-margin-top: var(--sc-spacing-32);
  scroll-margin-bottom: var(--sc-spacing-32);
}

.scroll-my-4 {
  scroll-margin-top: var(--sc-spacing-4);
  scroll-margin-bottom: var(--sc-spacing-4);
}

.scroll-my-40 {
  scroll-margin-top: var(--sc-spacing-40);
  scroll-margin-bottom: var(--sc-spacing-40);
}

.scroll-my-48 {
  scroll-margin-top: var(--sc-spacing-48);
  scroll-margin-bottom: var(--sc-spacing-48);
}

.scroll-my-56 {
  scroll-margin-top: var(--sc-spacing-56);
  scroll-margin-bottom: var(--sc-spacing-56);
}

.scroll-my-64 {
  scroll-margin-top: var(--sc-spacing-64);
  scroll-margin-bottom: var(--sc-spacing-64);
}

.scroll-my-8 {
  scroll-margin-top: var(--sc-spacing-8);
  scroll-margin-bottom: var(--sc-spacing-8);
}

.-scroll-mb-0 {
  scroll-margin-bottom: calc(var(--sc-spacing-0) * -1);
}

.-scroll-mb-12 {
  scroll-margin-bottom: calc(var(--sc-spacing-12) * -1);
}

.-scroll-mb-16 {
  scroll-margin-bottom: calc(var(--sc-spacing-16) * -1);
}

.-scroll-mb-20 {
  scroll-margin-bottom: calc(var(--sc-spacing-20) * -1);
}

.-scroll-mb-24 {
  scroll-margin-bottom: calc(var(--sc-spacing-24) * -1);
}

.-scroll-mb-32 {
  scroll-margin-bottom: calc(var(--sc-spacing-32) * -1);
}

.-scroll-mb-4 {
  scroll-margin-bottom: calc(var(--sc-spacing-4) * -1);
}

.-scroll-mb-40 {
  scroll-margin-bottom: calc(var(--sc-spacing-40) * -1);
}

.-scroll-mb-48 {
  scroll-margin-bottom: calc(var(--sc-spacing-48) * -1);
}

.-scroll-mb-56 {
  scroll-margin-bottom: calc(var(--sc-spacing-56) * -1);
}

.-scroll-mb-64 {
  scroll-margin-bottom: calc(var(--sc-spacing-64) * -1);
}

.-scroll-mb-8 {
  scroll-margin-bottom: calc(var(--sc-spacing-8) * -1);
}

.-scroll-me-0 {
  scroll-margin-inline-end: calc(var(--sc-spacing-0) * -1);
}

.-scroll-me-12 {
  scroll-margin-inline-end: calc(var(--sc-spacing-12) * -1);
}

.-scroll-me-16 {
  scroll-margin-inline-end: calc(var(--sc-spacing-16) * -1);
}

.-scroll-me-20 {
  scroll-margin-inline-end: calc(var(--sc-spacing-20) * -1);
}

.-scroll-me-24 {
  scroll-margin-inline-end: calc(var(--sc-spacing-24) * -1);
}

.-scroll-me-32 {
  scroll-margin-inline-end: calc(var(--sc-spacing-32) * -1);
}

.-scroll-me-4 {
  scroll-margin-inline-end: calc(var(--sc-spacing-4) * -1);
}

.-scroll-me-40 {
  scroll-margin-inline-end: calc(var(--sc-spacing-40) * -1);
}

.-scroll-me-48 {
  scroll-margin-inline-end: calc(var(--sc-spacing-48) * -1);
}

.-scroll-me-56 {
  scroll-margin-inline-end: calc(var(--sc-spacing-56) * -1);
}

.-scroll-me-64 {
  scroll-margin-inline-end: calc(var(--sc-spacing-64) * -1);
}

.-scroll-me-8 {
  scroll-margin-inline-end: calc(var(--sc-spacing-8) * -1);
}

.-scroll-ml-0 {
  scroll-margin-left: calc(var(--sc-spacing-0) * -1);
}

.-scroll-ml-12 {
  scroll-margin-left: calc(var(--sc-spacing-12) * -1);
}

.-scroll-ml-16 {
  scroll-margin-left: calc(var(--sc-spacing-16) * -1);
}

.-scroll-ml-20 {
  scroll-margin-left: calc(var(--sc-spacing-20) * -1);
}

.-scroll-ml-24 {
  scroll-margin-left: calc(var(--sc-spacing-24) * -1);
}

.-scroll-ml-32 {
  scroll-margin-left: calc(var(--sc-spacing-32) * -1);
}

.-scroll-ml-4 {
  scroll-margin-left: calc(var(--sc-spacing-4) * -1);
}

.-scroll-ml-40 {
  scroll-margin-left: calc(var(--sc-spacing-40) * -1);
}

.-scroll-ml-48 {
  scroll-margin-left: calc(var(--sc-spacing-48) * -1);
}

.-scroll-ml-56 {
  scroll-margin-left: calc(var(--sc-spacing-56) * -1);
}

.-scroll-ml-64 {
  scroll-margin-left: calc(var(--sc-spacing-64) * -1);
}

.-scroll-ml-8 {
  scroll-margin-left: calc(var(--sc-spacing-8) * -1);
}

.-scroll-mr-0 {
  scroll-margin-right: calc(var(--sc-spacing-0) * -1);
}

.-scroll-mr-12 {
  scroll-margin-right: calc(var(--sc-spacing-12) * -1);
}

.-scroll-mr-16 {
  scroll-margin-right: calc(var(--sc-spacing-16) * -1);
}

.-scroll-mr-20 {
  scroll-margin-right: calc(var(--sc-spacing-20) * -1);
}

.-scroll-mr-24 {
  scroll-margin-right: calc(var(--sc-spacing-24) * -1);
}

.-scroll-mr-32 {
  scroll-margin-right: calc(var(--sc-spacing-32) * -1);
}

.-scroll-mr-4 {
  scroll-margin-right: calc(var(--sc-spacing-4) * -1);
}

.-scroll-mr-40 {
  scroll-margin-right: calc(var(--sc-spacing-40) * -1);
}

.-scroll-mr-48 {
  scroll-margin-right: calc(var(--sc-spacing-48) * -1);
}

.-scroll-mr-56 {
  scroll-margin-right: calc(var(--sc-spacing-56) * -1);
}

.-scroll-mr-64 {
  scroll-margin-right: calc(var(--sc-spacing-64) * -1);
}

.-scroll-mr-8 {
  scroll-margin-right: calc(var(--sc-spacing-8) * -1);
}

.-scroll-ms-0 {
  scroll-margin-inline-start: calc(var(--sc-spacing-0) * -1);
}

.-scroll-ms-12 {
  scroll-margin-inline-start: calc(var(--sc-spacing-12) * -1);
}

.-scroll-ms-16 {
  scroll-margin-inline-start: calc(var(--sc-spacing-16) * -1);
}

.-scroll-ms-20 {
  scroll-margin-inline-start: calc(var(--sc-spacing-20) * -1);
}

.-scroll-ms-24 {
  scroll-margin-inline-start: calc(var(--sc-spacing-24) * -1);
}

.-scroll-ms-32 {
  scroll-margin-inline-start: calc(var(--sc-spacing-32) * -1);
}

.-scroll-ms-4 {
  scroll-margin-inline-start: calc(var(--sc-spacing-4) * -1);
}

.-scroll-ms-40 {
  scroll-margin-inline-start: calc(var(--sc-spacing-40) * -1);
}

.-scroll-ms-48 {
  scroll-margin-inline-start: calc(var(--sc-spacing-48) * -1);
}

.-scroll-ms-56 {
  scroll-margin-inline-start: calc(var(--sc-spacing-56) * -1);
}

.-scroll-ms-64 {
  scroll-margin-inline-start: calc(var(--sc-spacing-64) * -1);
}

.-scroll-ms-8 {
  scroll-margin-inline-start: calc(var(--sc-spacing-8) * -1);
}

.-scroll-mt-0 {
  scroll-margin-top: calc(var(--sc-spacing-0) * -1);
}

.-scroll-mt-12 {
  scroll-margin-top: calc(var(--sc-spacing-12) * -1);
}

.-scroll-mt-16 {
  scroll-margin-top: calc(var(--sc-spacing-16) * -1);
}

.-scroll-mt-20 {
  scroll-margin-top: calc(var(--sc-spacing-20) * -1);
}

.-scroll-mt-24 {
  scroll-margin-top: calc(var(--sc-spacing-24) * -1);
}

.-scroll-mt-32 {
  scroll-margin-top: calc(var(--sc-spacing-32) * -1);
}

.-scroll-mt-4 {
  scroll-margin-top: calc(var(--sc-spacing-4) * -1);
}

.-scroll-mt-40 {
  scroll-margin-top: calc(var(--sc-spacing-40) * -1);
}

.-scroll-mt-48 {
  scroll-margin-top: calc(var(--sc-spacing-48) * -1);
}

.-scroll-mt-56 {
  scroll-margin-top: calc(var(--sc-spacing-56) * -1);
}

.-scroll-mt-64 {
  scroll-margin-top: calc(var(--sc-spacing-64) * -1);
}

.-scroll-mt-8 {
  scroll-margin-top: calc(var(--sc-spacing-8) * -1);
}

.scroll-mb-0 {
  scroll-margin-bottom: var(--sc-spacing-0);
}

.scroll-mb-12 {
  scroll-margin-bottom: var(--sc-spacing-12);
}

.scroll-mb-16 {
  scroll-margin-bottom: var(--sc-spacing-16);
}

.scroll-mb-20 {
  scroll-margin-bottom: var(--sc-spacing-20);
}

.scroll-mb-24 {
  scroll-margin-bottom: var(--sc-spacing-24);
}

.scroll-mb-32 {
  scroll-margin-bottom: var(--sc-spacing-32);
}

.scroll-mb-4 {
  scroll-margin-bottom: var(--sc-spacing-4);
}

.scroll-mb-40 {
  scroll-margin-bottom: var(--sc-spacing-40);
}

.scroll-mb-48 {
  scroll-margin-bottom: var(--sc-spacing-48);
}

.scroll-mb-56 {
  scroll-margin-bottom: var(--sc-spacing-56);
}

.scroll-mb-64 {
  scroll-margin-bottom: var(--sc-spacing-64);
}

.scroll-mb-8 {
  scroll-margin-bottom: var(--sc-spacing-8);
}

.scroll-me-0 {
  scroll-margin-inline-end: var(--sc-spacing-0);
}

.scroll-me-12 {
  scroll-margin-inline-end: var(--sc-spacing-12);
}

.scroll-me-16 {
  scroll-margin-inline-end: var(--sc-spacing-16);
}

.scroll-me-20 {
  scroll-margin-inline-end: var(--sc-spacing-20);
}

.scroll-me-24 {
  scroll-margin-inline-end: var(--sc-spacing-24);
}

.scroll-me-32 {
  scroll-margin-inline-end: var(--sc-spacing-32);
}

.scroll-me-4 {
  scroll-margin-inline-end: var(--sc-spacing-4);
}

.scroll-me-40 {
  scroll-margin-inline-end: var(--sc-spacing-40);
}

.scroll-me-48 {
  scroll-margin-inline-end: var(--sc-spacing-48);
}

.scroll-me-56 {
  scroll-margin-inline-end: var(--sc-spacing-56);
}

.scroll-me-64 {
  scroll-margin-inline-end: var(--sc-spacing-64);
}

.scroll-me-8 {
  scroll-margin-inline-end: var(--sc-spacing-8);
}

.scroll-ml-0 {
  scroll-margin-left: var(--sc-spacing-0);
}

.scroll-ml-12 {
  scroll-margin-left: var(--sc-spacing-12);
}

.scroll-ml-16 {
  scroll-margin-left: var(--sc-spacing-16);
}

.scroll-ml-20 {
  scroll-margin-left: var(--sc-spacing-20);
}

.scroll-ml-24 {
  scroll-margin-left: var(--sc-spacing-24);
}

.scroll-ml-32 {
  scroll-margin-left: var(--sc-spacing-32);
}

.scroll-ml-4 {
  scroll-margin-left: var(--sc-spacing-4);
}

.scroll-ml-40 {
  scroll-margin-left: var(--sc-spacing-40);
}

.scroll-ml-48 {
  scroll-margin-left: var(--sc-spacing-48);
}

.scroll-ml-56 {
  scroll-margin-left: var(--sc-spacing-56);
}

.scroll-ml-64 {
  scroll-margin-left: var(--sc-spacing-64);
}

.scroll-ml-8 {
  scroll-margin-left: var(--sc-spacing-8);
}

.scroll-mr-0 {
  scroll-margin-right: var(--sc-spacing-0);
}

.scroll-mr-12 {
  scroll-margin-right: var(--sc-spacing-12);
}

.scroll-mr-16 {
  scroll-margin-right: var(--sc-spacing-16);
}

.scroll-mr-20 {
  scroll-margin-right: var(--sc-spacing-20);
}

.scroll-mr-24 {
  scroll-margin-right: var(--sc-spacing-24);
}

.scroll-mr-32 {
  scroll-margin-right: var(--sc-spacing-32);
}

.scroll-mr-4 {
  scroll-margin-right: var(--sc-spacing-4);
}

.scroll-mr-40 {
  scroll-margin-right: var(--sc-spacing-40);
}

.scroll-mr-48 {
  scroll-margin-right: var(--sc-spacing-48);
}

.scroll-mr-56 {
  scroll-margin-right: var(--sc-spacing-56);
}

.scroll-mr-64 {
  scroll-margin-right: var(--sc-spacing-64);
}

.scroll-mr-8 {
  scroll-margin-right: var(--sc-spacing-8);
}

.scroll-ms-0 {
  scroll-margin-inline-start: var(--sc-spacing-0);
}

.scroll-ms-12 {
  scroll-margin-inline-start: var(--sc-spacing-12);
}

.scroll-ms-16 {
  scroll-margin-inline-start: var(--sc-spacing-16);
}

.scroll-ms-20 {
  scroll-margin-inline-start: var(--sc-spacing-20);
}

.scroll-ms-24 {
  scroll-margin-inline-start: var(--sc-spacing-24);
}

.scroll-ms-32 {
  scroll-margin-inline-start: var(--sc-spacing-32);
}

.scroll-ms-4 {
  scroll-margin-inline-start: var(--sc-spacing-4);
}

.scroll-ms-40 {
  scroll-margin-inline-start: var(--sc-spacing-40);
}

.scroll-ms-48 {
  scroll-margin-inline-start: var(--sc-spacing-48);
}

.scroll-ms-56 {
  scroll-margin-inline-start: var(--sc-spacing-56);
}

.scroll-ms-64 {
  scroll-margin-inline-start: var(--sc-spacing-64);
}

.scroll-ms-8 {
  scroll-margin-inline-start: var(--sc-spacing-8);
}

.scroll-mt-0 {
  scroll-margin-top: var(--sc-spacing-0);
}

.scroll-mt-12 {
  scroll-margin-top: var(--sc-spacing-12);
}

.scroll-mt-16 {
  scroll-margin-top: var(--sc-spacing-16);
}

.scroll-mt-20 {
  scroll-margin-top: var(--sc-spacing-20);
}

.scroll-mt-24 {
  scroll-margin-top: var(--sc-spacing-24);
}

.scroll-mt-32 {
  scroll-margin-top: var(--sc-spacing-32);
}

.scroll-mt-4 {
  scroll-margin-top: var(--sc-spacing-4);
}

.scroll-mt-40 {
  scroll-margin-top: var(--sc-spacing-40);
}

.scroll-mt-48 {
  scroll-margin-top: var(--sc-spacing-48);
}

.scroll-mt-56 {
  scroll-margin-top: var(--sc-spacing-56);
}

.scroll-mt-64 {
  scroll-margin-top: var(--sc-spacing-64);
}

.scroll-mt-8 {
  scroll-margin-top: var(--sc-spacing-8);
}

.scroll-p-0 {
  scroll-padding: var(--sc-spacing-0);
}

.scroll-p-12 {
  scroll-padding: var(--sc-spacing-12);
}

.scroll-p-16 {
  scroll-padding: var(--sc-spacing-16);
}

.scroll-p-20 {
  scroll-padding: var(--sc-spacing-20);
}

.scroll-p-24 {
  scroll-padding: var(--sc-spacing-24);
}

.scroll-p-32 {
  scroll-padding: var(--sc-spacing-32);
}

.scroll-p-4 {
  scroll-padding: var(--sc-spacing-4);
}

.scroll-p-40 {
  scroll-padding: var(--sc-spacing-40);
}

.scroll-p-48 {
  scroll-padding: var(--sc-spacing-48);
}

.scroll-p-56 {
  scroll-padding: var(--sc-spacing-56);
}

.scroll-p-64 {
  scroll-padding: var(--sc-spacing-64);
}

.scroll-p-8 {
  scroll-padding: var(--sc-spacing-8);
}

.scroll-px-0 {
  scroll-padding-left: var(--sc-spacing-0);
  scroll-padding-right: var(--sc-spacing-0);
}

.scroll-px-12 {
  scroll-padding-left: var(--sc-spacing-12);
  scroll-padding-right: var(--sc-spacing-12);
}

.scroll-px-16 {
  scroll-padding-left: var(--sc-spacing-16);
  scroll-padding-right: var(--sc-spacing-16);
}

.scroll-px-20 {
  scroll-padding-left: var(--sc-spacing-20);
  scroll-padding-right: var(--sc-spacing-20);
}

.scroll-px-24 {
  scroll-padding-left: var(--sc-spacing-24);
  scroll-padding-right: var(--sc-spacing-24);
}

.scroll-px-32 {
  scroll-padding-left: var(--sc-spacing-32);
  scroll-padding-right: var(--sc-spacing-32);
}

.scroll-px-4 {
  scroll-padding-left: var(--sc-spacing-4);
  scroll-padding-right: var(--sc-spacing-4);
}

.scroll-px-40 {
  scroll-padding-left: var(--sc-spacing-40);
  scroll-padding-right: var(--sc-spacing-40);
}

.scroll-px-48 {
  scroll-padding-left: var(--sc-spacing-48);
  scroll-padding-right: var(--sc-spacing-48);
}

.scroll-px-56 {
  scroll-padding-left: var(--sc-spacing-56);
  scroll-padding-right: var(--sc-spacing-56);
}

.scroll-px-64 {
  scroll-padding-left: var(--sc-spacing-64);
  scroll-padding-right: var(--sc-spacing-64);
}

.scroll-px-8 {
  scroll-padding-left: var(--sc-spacing-8);
  scroll-padding-right: var(--sc-spacing-8);
}

.scroll-py-0 {
  scroll-padding-top: var(--sc-spacing-0);
  scroll-padding-bottom: var(--sc-spacing-0);
}

.scroll-py-12 {
  scroll-padding-top: var(--sc-spacing-12);
  scroll-padding-bottom: var(--sc-spacing-12);
}

.scroll-py-16 {
  scroll-padding-top: var(--sc-spacing-16);
  scroll-padding-bottom: var(--sc-spacing-16);
}

.scroll-py-20 {
  scroll-padding-top: var(--sc-spacing-20);
  scroll-padding-bottom: var(--sc-spacing-20);
}

.scroll-py-24 {
  scroll-padding-top: var(--sc-spacing-24);
  scroll-padding-bottom: var(--sc-spacing-24);
}

.scroll-py-32 {
  scroll-padding-top: var(--sc-spacing-32);
  scroll-padding-bottom: var(--sc-spacing-32);
}

.scroll-py-4 {
  scroll-padding-top: var(--sc-spacing-4);
  scroll-padding-bottom: var(--sc-spacing-4);
}

.scroll-py-40 {
  scroll-padding-top: var(--sc-spacing-40);
  scroll-padding-bottom: var(--sc-spacing-40);
}

.scroll-py-48 {
  scroll-padding-top: var(--sc-spacing-48);
  scroll-padding-bottom: var(--sc-spacing-48);
}

.scroll-py-56 {
  scroll-padding-top: var(--sc-spacing-56);
  scroll-padding-bottom: var(--sc-spacing-56);
}

.scroll-py-64 {
  scroll-padding-top: var(--sc-spacing-64);
  scroll-padding-bottom: var(--sc-spacing-64);
}

.scroll-py-8 {
  scroll-padding-top: var(--sc-spacing-8);
  scroll-padding-bottom: var(--sc-spacing-8);
}

.scroll-pb-0 {
  scroll-padding-bottom: var(--sc-spacing-0);
}

.scroll-pb-12 {
  scroll-padding-bottom: var(--sc-spacing-12);
}

.scroll-pb-16 {
  scroll-padding-bottom: var(--sc-spacing-16);
}

.scroll-pb-20 {
  scroll-padding-bottom: var(--sc-spacing-20);
}

.scroll-pb-24 {
  scroll-padding-bottom: var(--sc-spacing-24);
}

.scroll-pb-32 {
  scroll-padding-bottom: var(--sc-spacing-32);
}

.scroll-pb-4 {
  scroll-padding-bottom: var(--sc-spacing-4);
}

.scroll-pb-40 {
  scroll-padding-bottom: var(--sc-spacing-40);
}

.scroll-pb-48 {
  scroll-padding-bottom: var(--sc-spacing-48);
}

.scroll-pb-56 {
  scroll-padding-bottom: var(--sc-spacing-56);
}

.scroll-pb-64 {
  scroll-padding-bottom: var(--sc-spacing-64);
}

.scroll-pb-8 {
  scroll-padding-bottom: var(--sc-spacing-8);
}

.scroll-pe-0 {
  scroll-padding-inline-end: var(--sc-spacing-0);
}

.scroll-pe-12 {
  scroll-padding-inline-end: var(--sc-spacing-12);
}

.scroll-pe-16 {
  scroll-padding-inline-end: var(--sc-spacing-16);
}

.scroll-pe-20 {
  scroll-padding-inline-end: var(--sc-spacing-20);
}

.scroll-pe-24 {
  scroll-padding-inline-end: var(--sc-spacing-24);
}

.scroll-pe-32 {
  scroll-padding-inline-end: var(--sc-spacing-32);
}

.scroll-pe-4 {
  scroll-padding-inline-end: var(--sc-spacing-4);
}

.scroll-pe-40 {
  scroll-padding-inline-end: var(--sc-spacing-40);
}

.scroll-pe-48 {
  scroll-padding-inline-end: var(--sc-spacing-48);
}

.scroll-pe-56 {
  scroll-padding-inline-end: var(--sc-spacing-56);
}

.scroll-pe-64 {
  scroll-padding-inline-end: var(--sc-spacing-64);
}

.scroll-pe-8 {
  scroll-padding-inline-end: var(--sc-spacing-8);
}

.scroll-pl-0 {
  scroll-padding-left: var(--sc-spacing-0);
}

.scroll-pl-12 {
  scroll-padding-left: var(--sc-spacing-12);
}

.scroll-pl-16 {
  scroll-padding-left: var(--sc-spacing-16);
}

.scroll-pl-20 {
  scroll-padding-left: var(--sc-spacing-20);
}

.scroll-pl-24 {
  scroll-padding-left: var(--sc-spacing-24);
}

.scroll-pl-32 {
  scroll-padding-left: var(--sc-spacing-32);
}

.scroll-pl-4 {
  scroll-padding-left: var(--sc-spacing-4);
}

.scroll-pl-40 {
  scroll-padding-left: var(--sc-spacing-40);
}

.scroll-pl-48 {
  scroll-padding-left: var(--sc-spacing-48);
}

.scroll-pl-56 {
  scroll-padding-left: var(--sc-spacing-56);
}

.scroll-pl-64 {
  scroll-padding-left: var(--sc-spacing-64);
}

.scroll-pl-8 {
  scroll-padding-left: var(--sc-spacing-8);
}

.scroll-pr-0 {
  scroll-padding-right: var(--sc-spacing-0);
}

.scroll-pr-12 {
  scroll-padding-right: var(--sc-spacing-12);
}

.scroll-pr-16 {
  scroll-padding-right: var(--sc-spacing-16);
}

.scroll-pr-20 {
  scroll-padding-right: var(--sc-spacing-20);
}

.scroll-pr-24 {
  scroll-padding-right: var(--sc-spacing-24);
}

.scroll-pr-32 {
  scroll-padding-right: var(--sc-spacing-32);
}

.scroll-pr-4 {
  scroll-padding-right: var(--sc-spacing-4);
}

.scroll-pr-40 {
  scroll-padding-right: var(--sc-spacing-40);
}

.scroll-pr-48 {
  scroll-padding-right: var(--sc-spacing-48);
}

.scroll-pr-56 {
  scroll-padding-right: var(--sc-spacing-56);
}

.scroll-pr-64 {
  scroll-padding-right: var(--sc-spacing-64);
}

.scroll-pr-8 {
  scroll-padding-right: var(--sc-spacing-8);
}

.scroll-ps-0 {
  scroll-padding-inline-start: var(--sc-spacing-0);
}

.scroll-ps-12 {
  scroll-padding-inline-start: var(--sc-spacing-12);
}

.scroll-ps-16 {
  scroll-padding-inline-start: var(--sc-spacing-16);
}

.scroll-ps-20 {
  scroll-padding-inline-start: var(--sc-spacing-20);
}

.scroll-ps-24 {
  scroll-padding-inline-start: var(--sc-spacing-24);
}

.scroll-ps-32 {
  scroll-padding-inline-start: var(--sc-spacing-32);
}

.scroll-ps-4 {
  scroll-padding-inline-start: var(--sc-spacing-4);
}

.scroll-ps-40 {
  scroll-padding-inline-start: var(--sc-spacing-40);
}

.scroll-ps-48 {
  scroll-padding-inline-start: var(--sc-spacing-48);
}

.scroll-ps-56 {
  scroll-padding-inline-start: var(--sc-spacing-56);
}

.scroll-ps-64 {
  scroll-padding-inline-start: var(--sc-spacing-64);
}

.scroll-ps-8 {
  scroll-padding-inline-start: var(--sc-spacing-8);
}

.scroll-pt-0 {
  scroll-padding-top: var(--sc-spacing-0);
}

.scroll-pt-12 {
  scroll-padding-top: var(--sc-spacing-12);
}

.scroll-pt-16 {
  scroll-padding-top: var(--sc-spacing-16);
}

.scroll-pt-20 {
  scroll-padding-top: var(--sc-spacing-20);
}

.scroll-pt-24 {
  scroll-padding-top: var(--sc-spacing-24);
}

.scroll-pt-32 {
  scroll-padding-top: var(--sc-spacing-32);
}

.scroll-pt-4 {
  scroll-padding-top: var(--sc-spacing-4);
}

.scroll-pt-40 {
  scroll-padding-top: var(--sc-spacing-40);
}

.scroll-pt-48 {
  scroll-padding-top: var(--sc-spacing-48);
}

.scroll-pt-56 {
  scroll-padding-top: var(--sc-spacing-56);
}

.scroll-pt-64 {
  scroll-padding-top: var(--sc-spacing-64);
}

.scroll-pt-8 {
  scroll-padding-top: var(--sc-spacing-8);
}

.list-decimal {
  list-style-type: decimal;
}

.list-disc {
  list-style-type: disc;
}

.list-none {
  list-style-type: none;
}

.list-image-none {
  list-style-image: none;
}

.columns-1 {
  -moz-columns: 1;
       columns: 1;
}

.columns-10 {
  -moz-columns: 10;
       columns: 10;
}

.columns-11 {
  -moz-columns: 11;
       columns: 11;
}

.columns-12 {
  -moz-columns: 12;
       columns: 12;
}

.columns-2 {
  -moz-columns: 2;
       columns: 2;
}

.columns-2xl {
  -moz-columns: 42rem;
       columns: 42rem;
}

.columns-2xs {
  -moz-columns: 18rem;
       columns: 18rem;
}

.columns-3 {
  -moz-columns: 3;
       columns: 3;
}

.columns-3xl {
  -moz-columns: 48rem;
       columns: 48rem;
}

.columns-3xs {
  -moz-columns: 16rem;
       columns: 16rem;
}

.columns-4 {
  -moz-columns: 4;
       columns: 4;
}

.columns-4xl {
  -moz-columns: 56rem;
       columns: 56rem;
}

.columns-5 {
  -moz-columns: 5;
       columns: 5;
}

.columns-5xl {
  -moz-columns: 64rem;
       columns: 64rem;
}

.columns-6 {
  -moz-columns: 6;
       columns: 6;
}

.columns-6xl {
  -moz-columns: 72rem;
       columns: 72rem;
}

.columns-7 {
  -moz-columns: 7;
       columns: 7;
}

.columns-7xl {
  -moz-columns: 80rem;
       columns: 80rem;
}

.columns-8 {
  -moz-columns: 8;
       columns: 8;
}

.columns-9 {
  -moz-columns: 9;
       columns: 9;
}

.columns-auto {
  -moz-columns: auto;
       columns: auto;
}

.columns-lg {
  -moz-columns: 32rem;
       columns: 32rem;
}

.columns-md {
  -moz-columns: 28rem;
       columns: 28rem;
}

.columns-sm {
  -moz-columns: 24rem;
       columns: 24rem;
}

.columns-xl {
  -moz-columns: 36rem;
       columns: 36rem;
}

.columns-xs {
  -moz-columns: 20rem;
       columns: 20rem;
}

.auto-cols-auto {
  grid-auto-columns: auto;
}

.auto-cols-fr {
  grid-auto-columns: minmax(0, 1fr);
}

.auto-cols-max {
  grid-auto-columns: max-content;
}

.auto-cols-min {
  grid-auto-columns: min-content;
}

.auto-rows-auto {
  grid-auto-rows: auto;
}

.auto-rows-fr {
  grid-auto-rows: minmax(0, 1fr);
}

.auto-rows-max {
  grid-auto-rows: max-content;
}

.auto-rows-min {
  grid-auto-rows: min-content;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-10 {
  grid-template-columns: repeat(10, minmax(0, 1fr));
}

.grid-cols-11 {
  grid-template-columns: repeat(11, minmax(0, 1fr));
}

.grid-cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.grid-cols-5 {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.grid-cols-6 {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.grid-cols-7 {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.grid-cols-8 {
  grid-template-columns: repeat(8, minmax(0, 1fr));
}

.grid-cols-9 {
  grid-template-columns: repeat(9, minmax(0, 1fr));
}

.grid-cols-none {
  grid-template-columns: none;
}

.grid-cols-subgrid {
  grid-template-columns: subgrid;
}

.grid-rows-1 {
  grid-template-rows: repeat(1, minmax(0, 1fr));
}

.grid-rows-10 {
  grid-template-rows: repeat(10, minmax(0, 1fr));
}

.grid-rows-11 {
  grid-template-rows: repeat(11, minmax(0, 1fr));
}

.grid-rows-12 {
  grid-template-rows: repeat(12, minmax(0, 1fr));
}

.grid-rows-2 {
  grid-template-rows: repeat(2, minmax(0, 1fr));
}

.grid-rows-3 {
  grid-template-rows: repeat(3, minmax(0, 1fr));
}

.grid-rows-4 {
  grid-template-rows: repeat(4, minmax(0, 1fr));
}

.grid-rows-5 {
  grid-template-rows: repeat(5, minmax(0, 1fr));
}

.grid-rows-6 {
  grid-template-rows: repeat(6, minmax(0, 1fr));
}

.grid-rows-7 {
  grid-template-rows: repeat(7, minmax(0, 1fr));
}

.grid-rows-8 {
  grid-template-rows: repeat(8, minmax(0, 1fr));
}

.grid-rows-9 {
  grid-template-rows: repeat(9, minmax(0, 1fr));
}

.grid-rows-none {
  grid-template-rows: none;
}

.grid-rows-subgrid {
  grid-template-rows: subgrid;
}

.gap-0 {
  gap: var(--sc-spacing-0);
}

.gap-12 {
  gap: var(--sc-spacing-12);
}

.gap-16 {
  gap: var(--sc-spacing-16);
}

.gap-20 {
  gap: var(--sc-spacing-20);
}

.gap-24 {
  gap: var(--sc-spacing-24);
}

.gap-32 {
  gap: var(--sc-spacing-32);
}

.gap-4 {
  gap: var(--sc-spacing-4);
}

.gap-40 {
  gap: var(--sc-spacing-40);
}

.gap-48 {
  gap: var(--sc-spacing-48);
}

.gap-56 {
  gap: var(--sc-spacing-56);
}

.gap-64 {
  gap: var(--sc-spacing-64);
}

.gap-8 {
  gap: var(--sc-spacing-8);
}

.gap-x-0 {
  -moz-column-gap: var(--sc-spacing-0);
       column-gap: var(--sc-spacing-0);
}

.gap-x-12 {
  -moz-column-gap: var(--sc-spacing-12);
       column-gap: var(--sc-spacing-12);
}

.gap-x-16 {
  -moz-column-gap: var(--sc-spacing-16);
       column-gap: var(--sc-spacing-16);
}

.gap-x-20 {
  -moz-column-gap: var(--sc-spacing-20);
       column-gap: var(--sc-spacing-20);
}

.gap-x-24 {
  -moz-column-gap: var(--sc-spacing-24);
       column-gap: var(--sc-spacing-24);
}

.gap-x-32 {
  -moz-column-gap: var(--sc-spacing-32);
       column-gap: var(--sc-spacing-32);
}

.gap-x-4 {
  -moz-column-gap: var(--sc-spacing-4);
       column-gap: var(--sc-spacing-4);
}

.gap-x-40 {
  -moz-column-gap: var(--sc-spacing-40);
       column-gap: var(--sc-spacing-40);
}

.gap-x-48 {
  -moz-column-gap: var(--sc-spacing-48);
       column-gap: var(--sc-spacing-48);
}

.gap-x-56 {
  -moz-column-gap: var(--sc-spacing-56);
       column-gap: var(--sc-spacing-56);
}

.gap-x-64 {
  -moz-column-gap: var(--sc-spacing-64);
       column-gap: var(--sc-spacing-64);
}

.gap-x-8 {
  -moz-column-gap: var(--sc-spacing-8);
       column-gap: var(--sc-spacing-8);
}

.gap-y-0 {
  row-gap: var(--sc-spacing-0);
}

.gap-y-12 {
  row-gap: var(--sc-spacing-12);
}

.gap-y-16 {
  row-gap: var(--sc-spacing-16);
}

.gap-y-20 {
  row-gap: var(--sc-spacing-20);
}

.gap-y-24 {
  row-gap: var(--sc-spacing-24);
}

.gap-y-32 {
  row-gap: var(--sc-spacing-32);
}

.gap-y-4 {
  row-gap: var(--sc-spacing-4);
}

.gap-y-40 {
  row-gap: var(--sc-spacing-40);
}

.gap-y-48 {
  row-gap: var(--sc-spacing-48);
}

.gap-y-56 {
  row-gap: var(--sc-spacing-56);
}

.gap-y-64 {
  row-gap: var(--sc-spacing-64);
}

.gap-y-8 {
  row-gap: var(--sc-spacing-8);
}

.-space-x-0 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(calc(var(--sc-spacing-0) * -1) * var(--tw-space-x-reverse));
  margin-left: calc(calc(var(--sc-spacing-0) * -1) * calc(1 - var(--tw-space-x-reverse)));
}

.-space-x-12 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(calc(var(--sc-spacing-12) * -1) * var(--tw-space-x-reverse));
  margin-left: calc(calc(var(--sc-spacing-12) * -1) * calc(1 - var(--tw-space-x-reverse)));
}

.-space-x-16 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(calc(var(--sc-spacing-16) * -1) * var(--tw-space-x-reverse));
  margin-left: calc(calc(var(--sc-spacing-16) * -1) * calc(1 - var(--tw-space-x-reverse)));
}

.-space-x-20 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(calc(var(--sc-spacing-20) * -1) * var(--tw-space-x-reverse));
  margin-left: calc(calc(var(--sc-spacing-20) * -1) * calc(1 - var(--tw-space-x-reverse)));
}

.-space-x-24 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(calc(var(--sc-spacing-24) * -1) * var(--tw-space-x-reverse));
  margin-left: calc(calc(var(--sc-spacing-24) * -1) * calc(1 - var(--tw-space-x-reverse)));
}

.-space-x-32 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(calc(var(--sc-spacing-32) * -1) * var(--tw-space-x-reverse));
  margin-left: calc(calc(var(--sc-spacing-32) * -1) * calc(1 - var(--tw-space-x-reverse)));
}

.-space-x-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(calc(var(--sc-spacing-4) * -1) * var(--tw-space-x-reverse));
  margin-left: calc(calc(var(--sc-spacing-4) * -1) * calc(1 - var(--tw-space-x-reverse)));
}

.-space-x-40 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(calc(var(--sc-spacing-40) * -1) * var(--tw-space-x-reverse));
  margin-left: calc(calc(var(--sc-spacing-40) * -1) * calc(1 - var(--tw-space-x-reverse)));
}

.-space-x-48 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(calc(var(--sc-spacing-48) * -1) * var(--tw-space-x-reverse));
  margin-left: calc(calc(var(--sc-spacing-48) * -1) * calc(1 - var(--tw-space-x-reverse)));
}

.-space-x-56 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(calc(var(--sc-spacing-56) * -1) * var(--tw-space-x-reverse));
  margin-left: calc(calc(var(--sc-spacing-56) * -1) * calc(1 - var(--tw-space-x-reverse)));
}

.-space-x-64 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(calc(var(--sc-spacing-64) * -1) * var(--tw-space-x-reverse));
  margin-left: calc(calc(var(--sc-spacing-64) * -1) * calc(1 - var(--tw-space-x-reverse)));
}

.-space-x-8 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(calc(var(--sc-spacing-8) * -1) * var(--tw-space-x-reverse));
  margin-left: calc(calc(var(--sc-spacing-8) * -1) * calc(1 - var(--tw-space-x-reverse)));
}

.-space-y-0 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(calc(var(--sc-spacing-0) * -1) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(calc(var(--sc-spacing-0) * -1) * var(--tw-space-y-reverse));
}

.-space-y-12 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(calc(var(--sc-spacing-12) * -1) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(calc(var(--sc-spacing-12) * -1) * var(--tw-space-y-reverse));
}

.-space-y-16 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(calc(var(--sc-spacing-16) * -1) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(calc(var(--sc-spacing-16) * -1) * var(--tw-space-y-reverse));
}

.-space-y-20 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(calc(var(--sc-spacing-20) * -1) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(calc(var(--sc-spacing-20) * -1) * var(--tw-space-y-reverse));
}

.-space-y-24 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(calc(var(--sc-spacing-24) * -1) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(calc(var(--sc-spacing-24) * -1) * var(--tw-space-y-reverse));
}

.-space-y-32 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(calc(var(--sc-spacing-32) * -1) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(calc(var(--sc-spacing-32) * -1) * var(--tw-space-y-reverse));
}

.-space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(calc(var(--sc-spacing-4) * -1) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(calc(var(--sc-spacing-4) * -1) * var(--tw-space-y-reverse));
}

.-space-y-40 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(calc(var(--sc-spacing-40) * -1) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(calc(var(--sc-spacing-40) * -1) * var(--tw-space-y-reverse));
}

.-space-y-48 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(calc(var(--sc-spacing-48) * -1) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(calc(var(--sc-spacing-48) * -1) * var(--tw-space-y-reverse));
}

.-space-y-56 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(calc(var(--sc-spacing-56) * -1) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(calc(var(--sc-spacing-56) * -1) * var(--tw-space-y-reverse));
}

.-space-y-64 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(calc(var(--sc-spacing-64) * -1) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(calc(var(--sc-spacing-64) * -1) * var(--tw-space-y-reverse));
}

.-space-y-8 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(calc(var(--sc-spacing-8) * -1) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(calc(var(--sc-spacing-8) * -1) * var(--tw-space-y-reverse));
}

.space-x-0 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(var(--sc-spacing-0) * var(--tw-space-x-reverse));
  margin-left: calc(var(--sc-spacing-0) * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-12 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(var(--sc-spacing-12) * var(--tw-space-x-reverse));
  margin-left: calc(var(--sc-spacing-12) * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-16 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(var(--sc-spacing-16) * var(--tw-space-x-reverse));
  margin-left: calc(var(--sc-spacing-16) * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-20 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(var(--sc-spacing-20) * var(--tw-space-x-reverse));
  margin-left: calc(var(--sc-spacing-20) * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-24 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(var(--sc-spacing-24) * var(--tw-space-x-reverse));
  margin-left: calc(var(--sc-spacing-24) * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-32 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(var(--sc-spacing-32) * var(--tw-space-x-reverse));
  margin-left: calc(var(--sc-spacing-32) * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(var(--sc-spacing-4) * var(--tw-space-x-reverse));
  margin-left: calc(var(--sc-spacing-4) * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-40 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(var(--sc-spacing-40) * var(--tw-space-x-reverse));
  margin-left: calc(var(--sc-spacing-40) * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-48 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(var(--sc-spacing-48) * var(--tw-space-x-reverse));
  margin-left: calc(var(--sc-spacing-48) * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-56 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(var(--sc-spacing-56) * var(--tw-space-x-reverse));
  margin-left: calc(var(--sc-spacing-56) * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-64 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(var(--sc-spacing-64) * var(--tw-space-x-reverse));
  margin-left: calc(var(--sc-spacing-64) * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-8 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(var(--sc-spacing-8) * var(--tw-space-x-reverse));
  margin-left: calc(var(--sc-spacing-8) * calc(1 - var(--tw-space-x-reverse)));
}

.space-y-0 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(var(--sc-spacing-0) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(var(--sc-spacing-0) * var(--tw-space-y-reverse));
}

.space-y-12 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(var(--sc-spacing-12) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(var(--sc-spacing-12) * var(--tw-space-y-reverse));
}

.space-y-16 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(var(--sc-spacing-16) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(var(--sc-spacing-16) * var(--tw-space-y-reverse));
}

.space-y-20 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(var(--sc-spacing-20) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(var(--sc-spacing-20) * var(--tw-space-y-reverse));
}

.space-y-24 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(var(--sc-spacing-24) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(var(--sc-spacing-24) * var(--tw-space-y-reverse));
}

.space-y-32 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(var(--sc-spacing-32) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(var(--sc-spacing-32) * var(--tw-space-y-reverse));
}

.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(var(--sc-spacing-4) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(var(--sc-spacing-4) * var(--tw-space-y-reverse));
}

.space-y-40 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(var(--sc-spacing-40) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(var(--sc-spacing-40) * var(--tw-space-y-reverse));
}

.space-y-48 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(var(--sc-spacing-48) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(var(--sc-spacing-48) * var(--tw-space-y-reverse));
}

.space-y-56 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(var(--sc-spacing-56) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(var(--sc-spacing-56) * var(--tw-space-y-reverse));
}

.space-y-64 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(var(--sc-spacing-64) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(var(--sc-spacing-64) * var(--tw-space-y-reverse));
}

.space-y-8 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(var(--sc-spacing-8) * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(var(--sc-spacing-8) * var(--tw-space-y-reverse));
}

.space-y-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 1;
}

.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

.divide-x > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-x-reverse: 0;
  border-right-width: calc(1px * var(--tw-divide-x-reverse));
  border-left-width: calc(1px * calc(1 - var(--tw-divide-x-reverse)));
}

.divide-x-0 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-x-reverse: 0;
  border-right-width: calc(0px * var(--tw-divide-x-reverse));
  border-left-width: calc(0px * calc(1 - var(--tw-divide-x-reverse)));
}

.divide-x-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-x-reverse: 0;
  border-right-width: calc(2px * var(--tw-divide-x-reverse));
  border-left-width: calc(2px * calc(1 - var(--tw-divide-x-reverse)));
}

.divide-x-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-x-reverse: 0;
  border-right-width: calc(4px * var(--tw-divide-x-reverse));
  border-left-width: calc(4px * calc(1 - var(--tw-divide-x-reverse)));
}

.divide-x-8 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-x-reverse: 0;
  border-right-width: calc(8px * var(--tw-divide-x-reverse));
  border-left-width: calc(8px * calc(1 - var(--tw-divide-x-reverse)));
}

.divide-y > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}

.divide-y-0 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(0px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(0px * var(--tw-divide-y-reverse));
}

.divide-y-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(2px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(2px * var(--tw-divide-y-reverse));
}

.divide-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(4px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(4px * var(--tw-divide-y-reverse));
}

.divide-y-8 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(8px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(8px * var(--tw-divide-y-reverse));
}

.divide-y-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 1;
}

.divide-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-x-reverse: 1;
}

.divide-amber-100 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-100);
}

.divide-amber-100-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-100-dark);
}

.divide-amber-150 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-150);
}

.divide-amber-150-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-150-dark);
}

.divide-amber-200 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-200);
}

.divide-amber-200-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-200-dark);
}

.divide-amber-250 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-250);
}

.divide-amber-250-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-250-dark);
}

.divide-amber-300 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-300);
}

.divide-amber-300-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-300-dark);
}

.divide-amber-350 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-350);
}

.divide-amber-350-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-350-dark);
}

.divide-amber-400 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-400);
}

.divide-amber-400-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-400-dark);
}

.divide-amber-450 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-450);
}

.divide-amber-450-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-450-dark);
}

.divide-amber-50 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-50);
}

.divide-amber-50-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-50-dark);
}

.divide-amber-500 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-500);
}

.divide-amber-500-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-500-dark);
}

.divide-amber-550 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-550);
}

.divide-amber-550-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-550-dark);
}

.divide-amber-600 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-600);
}

.divide-amber-600-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-600-dark);
}

.divide-amber-650 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-650);
}

.divide-amber-650-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-650-dark);
}

.divide-amber-700 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-700);
}

.divide-amber-700-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-700-dark);
}

.divide-amber-750 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-750);
}

.divide-amber-750-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-750-dark);
}

.divide-amber-800 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-800);
}

.divide-amber-800-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-800-dark);
}

.divide-amber-850 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-850);
}

.divide-amber-850-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-850-dark);
}

.divide-amber-900 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-900);
}

.divide-amber-900-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-900-dark);
}

.divide-amber-950 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-950);
}

.divide-amber-950-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-amber-950-dark);
}

.divide-blue-100 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-100);
}

.divide-blue-100-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-100-dark);
}

.divide-blue-150 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-150);
}

.divide-blue-150-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-150-dark);
}

.divide-blue-200 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-200);
}

.divide-blue-200-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-200-dark);
}

.divide-blue-250 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-250);
}

.divide-blue-250-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-250-dark);
}

.divide-blue-300 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-300);
}

.divide-blue-300-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-300-dark);
}

.divide-blue-350 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-350);
}

.divide-blue-350-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-350-dark);
}

.divide-blue-400 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-400);
}

.divide-blue-400-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-400-dark);
}

.divide-blue-450 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-450);
}

.divide-blue-450-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-450-dark);
}

.divide-blue-50 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-50);
}

.divide-blue-50-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-50-dark);
}

.divide-blue-500 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-500);
}

.divide-blue-500-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-500-dark);
}

.divide-blue-550 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-550);
}

.divide-blue-550-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-550-dark);
}

.divide-blue-600 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-600);
}

.divide-blue-600-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-600-dark);
}

.divide-blue-650 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-650);
}

.divide-blue-650-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-650-dark);
}

.divide-blue-700 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-700);
}

.divide-blue-700-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-700-dark);
}

.divide-blue-750 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-750);
}

.divide-blue-750-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-750-dark);
}

.divide-blue-800 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-800);
}

.divide-blue-800-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-800-dark);
}

.divide-blue-850 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-850);
}

.divide-blue-850-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-850-dark);
}

.divide-blue-900 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-900);
}

.divide-blue-900-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-900-dark);
}

.divide-blue-950 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-950);
}

.divide-blue-950-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-950-dark);
}

.divide-current > :not([hidden]) ~ :not([hidden]) {
  border-color: currentColor;
}

.divide-green-100 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-100);
}

.divide-green-100-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-100-dark);
}

.divide-green-150 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-150);
}

.divide-green-150-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-150-dark);
}

.divide-green-200 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-200);
}

.divide-green-200-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-200-dark);
}

.divide-green-250 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-250);
}

.divide-green-250-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-250-dark);
}

.divide-green-300 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-300);
}

.divide-green-300-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-300-dark);
}

.divide-green-350 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-350);
}

.divide-green-350-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-350-dark);
}

.divide-green-400 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-400);
}

.divide-green-400-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-400-dark);
}

.divide-green-450 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-450);
}

.divide-green-450-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-450-dark);
}

.divide-green-50 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-50);
}

.divide-green-50-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-50-dark);
}

.divide-green-500 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-500);
}

.divide-green-500-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-500-dark);
}

.divide-green-550 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-550);
}

.divide-green-550-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-550-dark);
}

.divide-green-600 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-600);
}

.divide-green-600-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-600-dark);
}

.divide-green-650 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-650);
}

.divide-green-650-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-650-dark);
}

.divide-green-700 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-700);
}

.divide-green-700-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-700-dark);
}

.divide-green-750 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-750);
}

.divide-green-750-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-750-dark);
}

.divide-green-800 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-800);
}

.divide-green-800-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-800-dark);
}

.divide-green-850 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-850);
}

.divide-green-850-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-850-dark);
}

.divide-green-900 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-900);
}

.divide-green-900-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-900-dark);
}

.divide-green-950 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-950);
}

.divide-green-950-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-green-950-dark);
}

.divide-grey-100 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-100);
}

.divide-grey-100-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-100-dark);
}

.divide-grey-150 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-150);
}

.divide-grey-150-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-150-dark);
}

.divide-grey-200 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-200);
}

.divide-grey-200-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-200-dark);
}

.divide-grey-250 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-250);
}

.divide-grey-250-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-250-dark);
}

.divide-grey-300 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-300);
}

.divide-grey-300-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-300-dark);
}

.divide-grey-350 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-350);
}

.divide-grey-350-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-350-dark);
}

.divide-grey-400 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-400);
}

.divide-grey-400-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-400-dark);
}

.divide-grey-450 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-450);
}

.divide-grey-450-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-450-dark);
}

.divide-grey-50 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-50);
}

.divide-grey-50-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-50-dark);
}

.divide-grey-500 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-500);
}

.divide-grey-500-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-500-dark);
}

.divide-grey-550 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-550);
}

.divide-grey-550-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-550-dark);
}

.divide-grey-600 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-600);
}

.divide-grey-600-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-600-dark);
}

.divide-grey-650 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-650);
}

.divide-grey-650-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-650-dark);
}

.divide-grey-700 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-700);
}

.divide-grey-700-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-700-dark);
}

.divide-grey-750 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-750);
}

.divide-grey-750-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-750-dark);
}

.divide-grey-800 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-800);
}

.divide-grey-800-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-800-dark);
}

.divide-grey-850 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-850);
}

.divide-grey-850-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-850-dark);
}

.divide-grey-900 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-900);
}

.divide-grey-900-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-900-dark);
}

.divide-grey-950 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-950);
}

.divide-grey-950-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-grey-950-dark);
}

.divide-grey-black > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-black);
}

.divide-muted > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue-900);
}

.divide-orange-500 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-orange-500);
}

.divide-primary > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-blue);
}

.divide-purple-100 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-100);
}

.divide-purple-100-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-100-dark);
}

.divide-purple-150 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-150);
}

.divide-purple-150-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-150-dark);
}

.divide-purple-200 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-200);
}

.divide-purple-200-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-200-dark);
}

.divide-purple-250 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-250);
}

.divide-purple-250-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-250-dark);
}

.divide-purple-300 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-300);
}

.divide-purple-300-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-300-dark);
}

.divide-purple-350 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-350);
}

.divide-purple-350-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-350-dark);
}

.divide-purple-400 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-400);
}

.divide-purple-400-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-400-dark);
}

.divide-purple-450 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-450);
}

.divide-purple-450-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-450-dark);
}

.divide-purple-50 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-50);
}

.divide-purple-50-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-50-dark);
}

.divide-purple-500 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-500);
}

.divide-purple-500-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-500-dark);
}

.divide-purple-550 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-550);
}

.divide-purple-550-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-550-dark);
}

.divide-purple-600 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-600);
}

.divide-purple-600-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-600-dark);
}

.divide-purple-650 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-650);
}

.divide-purple-650-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-650-dark);
}

.divide-purple-700 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-700);
}

.divide-purple-700-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-700-dark);
}

.divide-purple-750 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-750);
}

.divide-purple-750-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-750-dark);
}

.divide-purple-800 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-800);
}

.divide-purple-800-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-800-dark);
}

.divide-purple-850 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-850);
}

.divide-purple-850-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-850-dark);
}

.divide-purple-900 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-900);
}

.divide-purple-900-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-900-dark);
}

.divide-purple-950 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-950);
}

.divide-purple-950-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-purple-950-dark);
}

.divide-red-100 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-100);
}

.divide-red-100-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-100-dark);
}

.divide-red-150 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-150);
}

.divide-red-150-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-150-dark);
}

.divide-red-200 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-200);
}

.divide-red-200-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-200-dark);
}

.divide-red-250 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-250);
}

.divide-red-250-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-250-dark);
}

.divide-red-300 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-300);
}

.divide-red-300-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-300-dark);
}

.divide-red-350 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-350);
}

.divide-red-350-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-350-dark);
}

.divide-red-400 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-400);
}

.divide-red-400-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-400-dark);
}

.divide-red-450 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-450);
}

.divide-red-450-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-450-dark);
}

.divide-red-50 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-50);
}

.divide-red-50-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-50-dark);
}

.divide-red-500 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-500);
}

.divide-red-500-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-500-dark);
}

.divide-red-550 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-550);
}

.divide-red-550-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-550-dark);
}

.divide-red-600 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-600);
}

.divide-red-600-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-600-dark);
}

.divide-red-650 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-650);
}

.divide-red-650-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-650-dark);
}

.divide-red-700 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-700);
}

.divide-red-700-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-700-dark);
}

.divide-red-750 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-750);
}

.divide-red-750-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-750-dark);
}

.divide-red-800 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-800);
}

.divide-red-800-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-800-dark);
}

.divide-red-850 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-850);
}

.divide-red-850-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-850-dark);
}

.divide-red-900 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-900);
}

.divide-red-900-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-900-dark);
}

.divide-red-950 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-950);
}

.divide-red-950-dark > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-red-950-dark);
}

.divide-teal-100 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-teal-100);
}

.divide-teal-500 > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-teal-500);
}

.divide-transparent > :not([hidden]) ~ :not([hidden]) {
  border-color: transparent;
}

.divide-transparent\/0 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0);
}

.divide-transparent\/10 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.1);
}

.divide-transparent\/100 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 1);
}

.divide-transparent\/15 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.15);
}

.divide-transparent\/20 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.2);
}

.divide-transparent\/25 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.25);
}

.divide-transparent\/30 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.3);
}

.divide-transparent\/35 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.35);
}

.divide-transparent\/40 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.4);
}

.divide-transparent\/45 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.45);
}

.divide-transparent\/5 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.05);
}

.divide-transparent\/50 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.5);
}

.divide-transparent\/55 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.55);
}

.divide-transparent\/60 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.6);
}

.divide-transparent\/65 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.65);
}

.divide-transparent\/70 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.7);
}

.divide-transparent\/75 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.75);
}

.divide-transparent\/80 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.8);
}

.divide-transparent\/85 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.85);
}

.divide-transparent\/90 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.9);
}

.divide-transparent\/95 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgb(0 0 0 / 0.95);
}

.divide-white > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--sc-color-white);
}

.divide-opacity-0 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0;
}

.divide-opacity-10 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.1;
}

.divide-opacity-100 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 1;
}

.divide-opacity-15 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.15;
}

.divide-opacity-20 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.2;
}

.divide-opacity-25 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.25;
}

.divide-opacity-30 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.3;
}

.divide-opacity-35 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.35;
}

.divide-opacity-40 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.4;
}

.divide-opacity-45 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.45;
}

.divide-opacity-5 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.05;
}

.divide-opacity-50 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.5;
}

.divide-opacity-55 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.55;
}

.divide-opacity-60 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.6;
}

.divide-opacity-65 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.65;
}

.divide-opacity-70 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.7;
}

.divide-opacity-75 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.75;
}

.divide-opacity-80 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.8;
}

.divide-opacity-85 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.85;
}

.divide-opacity-90 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.9;
}

.divide-opacity-95 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 0.95;
}

.rounded-2xl {
  border-radius: var(--sc-radius-2xl);
}

.rounded-3xl {
  border-radius: var(--sc-radius-3xl);
}

.rounded-lg {
  border-radius: var(--sc-radius-lg);
}

.rounded-md {
  border-radius: var(--sc-radius-md);
}

.rounded-none {
  border-radius: var(--sc-radius-none);
}

.rounded-sm {
  border-radius: var(--sc-radius-sm);
}

.rounded-xl {
  border-radius: var(--sc-radius-xl);
}

.rounded-b-2xl {
  border-bottom-right-radius: var(--sc-radius-2xl);
  border-bottom-left-radius: var(--sc-radius-2xl);
}

.rounded-b-3xl {
  border-bottom-right-radius: var(--sc-radius-3xl);
  border-bottom-left-radius: var(--sc-radius-3xl);
}

.rounded-b-lg {
  border-bottom-right-radius: var(--sc-radius-lg);
  border-bottom-left-radius: var(--sc-radius-lg);
}

.rounded-b-md {
  border-bottom-right-radius: var(--sc-radius-md);
  border-bottom-left-radius: var(--sc-radius-md);
}

.rounded-b-none {
  border-bottom-right-radius: var(--sc-radius-none);
  border-bottom-left-radius: var(--sc-radius-none);
}

.rounded-b-sm {
  border-bottom-right-radius: var(--sc-radius-sm);
  border-bottom-left-radius: var(--sc-radius-sm);
}

.rounded-b-xl {
  border-bottom-right-radius: var(--sc-radius-xl);
  border-bottom-left-radius: var(--sc-radius-xl);
}

.rounded-e-2xl {
  border-start-end-radius: var(--sc-radius-2xl);
  border-end-end-radius: var(--sc-radius-2xl);
}

.rounded-e-3xl {
  border-start-end-radius: var(--sc-radius-3xl);
  border-end-end-radius: var(--sc-radius-3xl);
}

.rounded-e-lg {
  border-start-end-radius: var(--sc-radius-lg);
  border-end-end-radius: var(--sc-radius-lg);
}

.rounded-e-md {
  border-start-end-radius: var(--sc-radius-md);
  border-end-end-radius: var(--sc-radius-md);
}

.rounded-e-none {
  border-start-end-radius: var(--sc-radius-none);
  border-end-end-radius: var(--sc-radius-none);
}

.rounded-e-sm {
  border-start-end-radius: var(--sc-radius-sm);
  border-end-end-radius: var(--sc-radius-sm);
}

.rounded-e-xl {
  border-start-end-radius: var(--sc-radius-xl);
  border-end-end-radius: var(--sc-radius-xl);
}

.rounded-l-2xl {
  border-top-left-radius: var(--sc-radius-2xl);
  border-bottom-left-radius: var(--sc-radius-2xl);
}

.rounded-l-3xl {
  border-top-left-radius: var(--sc-radius-3xl);
  border-bottom-left-radius: var(--sc-radius-3xl);
}

.rounded-l-lg {
  border-top-left-radius: var(--sc-radius-lg);
  border-bottom-left-radius: var(--sc-radius-lg);
}

.rounded-l-md {
  border-top-left-radius: var(--sc-radius-md);
  border-bottom-left-radius: var(--sc-radius-md);
}

.rounded-l-none {
  border-top-left-radius: var(--sc-radius-none);
  border-bottom-left-radius: var(--sc-radius-none);
}

.rounded-l-sm {
  border-top-left-radius: var(--sc-radius-sm);
  border-bottom-left-radius: var(--sc-radius-sm);
}

.rounded-l-xl {
  border-top-left-radius: var(--sc-radius-xl);
  border-bottom-left-radius: var(--sc-radius-xl);
}

.rounded-r-2xl {
  border-top-right-radius: var(--sc-radius-2xl);
  border-bottom-right-radius: var(--sc-radius-2xl);
}

.rounded-r-3xl {
  border-top-right-radius: var(--sc-radius-3xl);
  border-bottom-right-radius: var(--sc-radius-3xl);
}

.rounded-r-lg {
  border-top-right-radius: var(--sc-radius-lg);
  border-bottom-right-radius: var(--sc-radius-lg);
}

.rounded-r-md {
  border-top-right-radius: var(--sc-radius-md);
  border-bottom-right-radius: var(--sc-radius-md);
}

.rounded-r-none {
  border-top-right-radius: var(--sc-radius-none);
  border-bottom-right-radius: var(--sc-radius-none);
}

.rounded-r-sm {
  border-top-right-radius: var(--sc-radius-sm);
  border-bottom-right-radius: var(--sc-radius-sm);
}

.rounded-r-xl {
  border-top-right-radius: var(--sc-radius-xl);
  border-bottom-right-radius: var(--sc-radius-xl);
}

.rounded-s-2xl {
  border-start-start-radius: var(--sc-radius-2xl);
  border-end-start-radius: var(--sc-radius-2xl);
}

.rounded-s-3xl {
  border-start-start-radius: var(--sc-radius-3xl);
  border-end-start-radius: var(--sc-radius-3xl);
}

.rounded-s-lg {
  border-start-start-radius: var(--sc-radius-lg);
  border-end-start-radius: var(--sc-radius-lg);
}

.rounded-s-md {
  border-start-start-radius: var(--sc-radius-md);
  border-end-start-radius: var(--sc-radius-md);
}

.rounded-s-none {
  border-start-start-radius: var(--sc-radius-none);
  border-end-start-radius: var(--sc-radius-none);
}

.rounded-s-sm {
  border-start-start-radius: var(--sc-radius-sm);
  border-end-start-radius: var(--sc-radius-sm);
}

.rounded-s-xl {
  border-start-start-radius: var(--sc-radius-xl);
  border-end-start-radius: var(--sc-radius-xl);
}

.rounded-t-2xl {
  border-top-left-radius: var(--sc-radius-2xl);
  border-top-right-radius: var(--sc-radius-2xl);
}

.rounded-t-3xl {
  border-top-left-radius: var(--sc-radius-3xl);
  border-top-right-radius: var(--sc-radius-3xl);
}

.rounded-t-lg {
  border-top-left-radius: var(--sc-radius-lg);
  border-top-right-radius: var(--sc-radius-lg);
}

.rounded-t-md {
  border-top-left-radius: var(--sc-radius-md);
  border-top-right-radius: var(--sc-radius-md);
}

.rounded-t-none {
  border-top-left-radius: var(--sc-radius-none);
  border-top-right-radius: var(--sc-radius-none);
}

.rounded-t-sm {
  border-top-left-radius: var(--sc-radius-sm);
  border-top-right-radius: var(--sc-radius-sm);
}

.rounded-t-xl {
  border-top-left-radius: var(--sc-radius-xl);
  border-top-right-radius: var(--sc-radius-xl);
}

.rounded-bl-2xl {
  border-bottom-left-radius: var(--sc-radius-2xl);
}

.rounded-bl-3xl {
  border-bottom-left-radius: var(--sc-radius-3xl);
}

.rounded-bl-lg {
  border-bottom-left-radius: var(--sc-radius-lg);
}

.rounded-bl-md {
  border-bottom-left-radius: var(--sc-radius-md);
}

.rounded-bl-none {
  border-bottom-left-radius: var(--sc-radius-none);
}

.rounded-bl-sm {
  border-bottom-left-radius: var(--sc-radius-sm);
}

.rounded-bl-xl {
  border-bottom-left-radius: var(--sc-radius-xl);
}

.rounded-br-2xl {
  border-bottom-right-radius: var(--sc-radius-2xl);
}

.rounded-br-3xl {
  border-bottom-right-radius: var(--sc-radius-3xl);
}

.rounded-br-lg {
  border-bottom-right-radius: var(--sc-radius-lg);
}

.rounded-br-md {
  border-bottom-right-radius: var(--sc-radius-md);
}

.rounded-br-none {
  border-bottom-right-radius: var(--sc-radius-none);
}

.rounded-br-sm {
  border-bottom-right-radius: var(--sc-radius-sm);
}

.rounded-br-xl {
  border-bottom-right-radius: var(--sc-radius-xl);
}

.rounded-ee-2xl {
  border-end-end-radius: var(--sc-radius-2xl);
}

.rounded-ee-3xl {
  border-end-end-radius: var(--sc-radius-3xl);
}

.rounded-ee-lg {
  border-end-end-radius: var(--sc-radius-lg);
}

.rounded-ee-md {
  border-end-end-radius: var(--sc-radius-md);
}

.rounded-ee-none {
  border-end-end-radius: var(--sc-radius-none);
}

.rounded-ee-sm {
  border-end-end-radius: var(--sc-radius-sm);
}

.rounded-ee-xl {
  border-end-end-radius: var(--sc-radius-xl);
}

.rounded-es-2xl {
  border-end-start-radius: var(--sc-radius-2xl);
}

.rounded-es-3xl {
  border-end-start-radius: var(--sc-radius-3xl);
}

.rounded-es-lg {
  border-end-start-radius: var(--sc-radius-lg);
}

.rounded-es-md {
  border-end-start-radius: var(--sc-radius-md);
}

.rounded-es-none {
  border-end-start-radius: var(--sc-radius-none);
}

.rounded-es-sm {
  border-end-start-radius: var(--sc-radius-sm);
}

.rounded-es-xl {
  border-end-start-radius: var(--sc-radius-xl);
}

.rounded-se-2xl {
  border-start-end-radius: var(--sc-radius-2xl);
}

.rounded-se-3xl {
  border-start-end-radius: var(--sc-radius-3xl);
}

.rounded-se-lg {
  border-start-end-radius: var(--sc-radius-lg);
}

.rounded-se-md {
  border-start-end-radius: var(--sc-radius-md);
}

.rounded-se-none {
  border-start-end-radius: var(--sc-radius-none);
}

.rounded-se-sm {
  border-start-end-radius: var(--sc-radius-sm);
}

.rounded-se-xl {
  border-start-end-radius: var(--sc-radius-xl);
}

.rounded-ss-2xl {
  border-start-start-radius: var(--sc-radius-2xl);
}

.rounded-ss-3xl {
  border-start-start-radius: var(--sc-radius-3xl);
}

.rounded-ss-lg {
  border-start-start-radius: var(--sc-radius-lg);
}

.rounded-ss-md {
  border-start-start-radius: var(--sc-radius-md);
}

.rounded-ss-none {
  border-start-start-radius: var(--sc-radius-none);
}

.rounded-ss-sm {
  border-start-start-radius: var(--sc-radius-sm);
}

.rounded-ss-xl {
  border-start-start-radius: var(--sc-radius-xl);
}

.rounded-tl-2xl {
  border-top-left-radius: var(--sc-radius-2xl);
}

.rounded-tl-3xl {
  border-top-left-radius: var(--sc-radius-3xl);
}

.rounded-tl-lg {
  border-top-left-radius: var(--sc-radius-lg);
}

.rounded-tl-md {
  border-top-left-radius: var(--sc-radius-md);
}

.rounded-tl-none {
  border-top-left-radius: var(--sc-radius-none);
}

.rounded-tl-sm {
  border-top-left-radius: var(--sc-radius-sm);
}

.rounded-tl-xl {
  border-top-left-radius: var(--sc-radius-xl);
}

.rounded-tr-2xl {
  border-top-right-radius: var(--sc-radius-2xl);
}

.rounded-tr-3xl {
  border-top-right-radius: var(--sc-radius-3xl);
}

.rounded-tr-lg {
  border-top-right-radius: var(--sc-radius-lg);
}

.rounded-tr-md {
  border-top-right-radius: var(--sc-radius-md);
}

.rounded-tr-none {
  border-top-right-radius: var(--sc-radius-none);
}

.rounded-tr-sm {
  border-top-right-radius: var(--sc-radius-sm);
}

.rounded-tr-xl {
  border-top-right-radius: var(--sc-radius-xl);
}

.border {
  border-width: 1px;
}

.border-0 {
  border-width: 0px;
}

.border-2 {
  border-width: 2px;
}

.border-4 {
  border-width: 4px;
}

.border-8 {
  border-width: 8px;
}

.border-x {
  border-left-width: 1px;
  border-right-width: 1px;
}

.border-x-0 {
  border-left-width: 0px;
  border-right-width: 0px;
}

.border-x-2 {
  border-left-width: 2px;
  border-right-width: 2px;
}

.border-x-4 {
  border-left-width: 4px;
  border-right-width: 4px;
}

.border-x-8 {
  border-left-width: 8px;
  border-right-width: 8px;
}

.border-y {
  border-top-width: 1px;
  border-bottom-width: 1px;
}

.border-y-0 {
  border-top-width: 0px;
  border-bottom-width: 0px;
}

.border-y-2 {
  border-top-width: 2px;
  border-bottom-width: 2px;
}

.border-y-4 {
  border-top-width: 4px;
  border-bottom-width: 4px;
}

.border-y-8 {
  border-top-width: 8px;
  border-bottom-width: 8px;
}

.border-b {
  border-bottom-width: 1px;
}

.border-b-0 {
  border-bottom-width: 0px;
}

.border-b-2 {
  border-bottom-width: 2px;
}

.border-b-4 {
  border-bottom-width: 4px;
}

.border-b-8 {
  border-bottom-width: 8px;
}

.border-e {
  border-inline-end-width: 1px;
}

.border-e-0 {
  border-inline-end-width: 0px;
}

.border-e-2 {
  border-inline-end-width: 2px;
}

.border-e-4 {
  border-inline-end-width: 4px;
}

.border-e-8 {
  border-inline-end-width: 8px;
}

.border-l {
  border-left-width: 1px;
}

.border-l-0 {
  border-left-width: 0px;
}

.border-l-2 {
  border-left-width: 2px;
}

.border-l-4 {
  border-left-width: 4px;
}

.border-l-8 {
  border-left-width: 8px;
}

.border-r {
  border-right-width: 1px;
}

.border-r-0 {
  border-right-width: 0px;
}

.border-r-2 {
  border-right-width: 2px;
}

.border-r-4 {
  border-right-width: 4px;
}

.border-r-8 {
  border-right-width: 8px;
}

.border-s {
  border-inline-start-width: 1px;
}

.border-s-0 {
  border-inline-start-width: 0px;
}

.border-s-2 {
  border-inline-start-width: 2px;
}

.border-s-4 {
  border-inline-start-width: 4px;
}

.border-s-8 {
  border-inline-start-width: 8px;
}

.border-t {
  border-top-width: 1px;
}

.border-t-0 {
  border-top-width: 0px;
}

.border-t-2 {
  border-top-width: 2px;
}

.border-t-4 {
  border-top-width: 4px;
}

.border-t-8 {
  border-top-width: 8px;
}

.border-amber-100 {
  border-color: var(--sc-color-amber-100);
}

.border-amber-100-dark {
  border-color: var(--sc-color-amber-100-dark);
}

.border-amber-150 {
  border-color: var(--sc-color-amber-150);
}

.border-amber-150-dark {
  border-color: var(--sc-color-amber-150-dark);
}

.border-amber-200 {
  border-color: var(--sc-color-amber-200);
}

.border-amber-200-dark {
  border-color: var(--sc-color-amber-200-dark);
}

.border-amber-250 {
  border-color: var(--sc-color-amber-250);
}

.border-amber-250-dark {
  border-color: var(--sc-color-amber-250-dark);
}

.border-amber-300 {
  border-color: var(--sc-color-amber-300);
}

.border-amber-300-dark {
  border-color: var(--sc-color-amber-300-dark);
}

.border-amber-350 {
  border-color: var(--sc-color-amber-350);
}

.border-amber-350-dark {
  border-color: var(--sc-color-amber-350-dark);
}

.border-amber-400 {
  border-color: var(--sc-color-amber-400);
}

.border-amber-400-dark {
  border-color: var(--sc-color-amber-400-dark);
}

.border-amber-450 {
  border-color: var(--sc-color-amber-450);
}

.border-amber-450-dark {
  border-color: var(--sc-color-amber-450-dark);
}

.border-amber-50 {
  border-color: var(--sc-color-amber-50);
}

.border-amber-50-dark {
  border-color: var(--sc-color-amber-50-dark);
}

.border-amber-500 {
  border-color: var(--sc-color-amber-500);
}

.border-amber-500-dark {
  border-color: var(--sc-color-amber-500-dark);
}

.border-amber-550 {
  border-color: var(--sc-color-amber-550);
}

.border-amber-550-dark {
  border-color: var(--sc-color-amber-550-dark);
}

.border-amber-600 {
  border-color: var(--sc-color-amber-600);
}

.border-amber-600-dark {
  border-color: var(--sc-color-amber-600-dark);
}

.border-amber-650 {
  border-color: var(--sc-color-amber-650);
}

.border-amber-650-dark {
  border-color: var(--sc-color-amber-650-dark);
}

.border-amber-700 {
  border-color: var(--sc-color-amber-700);
}

.border-amber-700-dark {
  border-color: var(--sc-color-amber-700-dark);
}

.border-amber-750 {
  border-color: var(--sc-color-amber-750);
}

.border-amber-750-dark {
  border-color: var(--sc-color-amber-750-dark);
}

.border-amber-800 {
  border-color: var(--sc-color-amber-800);
}

.border-amber-800-dark {
  border-color: var(--sc-color-amber-800-dark);
}

.border-amber-850 {
  border-color: var(--sc-color-amber-850);
}

.border-amber-850-dark {
  border-color: var(--sc-color-amber-850-dark);
}

.border-amber-900 {
  border-color: var(--sc-color-amber-900);
}

.border-amber-900-dark {
  border-color: var(--sc-color-amber-900-dark);
}

.border-amber-950 {
  border-color: var(--sc-color-amber-950);
}

.border-amber-950-dark {
  border-color: var(--sc-color-amber-950-dark);
}

.border-blue-100 {
  border-color: var(--sc-color-blue-100);
}

.border-blue-100-dark {
  border-color: var(--sc-color-blue-100-dark);
}

.border-blue-150 {
  border-color: var(--sc-color-blue-150);
}

.border-blue-150-dark {
  border-color: var(--sc-color-blue-150-dark);
}

.border-blue-200 {
  border-color: var(--sc-color-blue-200);
}

.border-blue-200-dark {
  border-color: var(--sc-color-blue-200-dark);
}

.border-blue-250 {
  border-color: var(--sc-color-blue-250);
}

.border-blue-250-dark {
  border-color: var(--sc-color-blue-250-dark);
}

.border-blue-300 {
  border-color: var(--sc-color-blue-300);
}

.border-blue-300-dark {
  border-color: var(--sc-color-blue-300-dark);
}

.border-blue-350 {
  border-color: var(--sc-color-blue-350);
}

.border-blue-350-dark {
  border-color: var(--sc-color-blue-350-dark);
}

.border-blue-400 {
  border-color: var(--sc-color-blue-400);
}

.border-blue-400-dark {
  border-color: var(--sc-color-blue-400-dark);
}

.border-blue-450 {
  border-color: var(--sc-color-blue-450);
}

.border-blue-450-dark {
  border-color: var(--sc-color-blue-450-dark);
}

.border-blue-50 {
  border-color: var(--sc-color-blue-50);
}

.border-blue-50-dark {
  border-color: var(--sc-color-blue-50-dark);
}

.border-blue-500 {
  border-color: var(--sc-color-blue-500);
}

.border-blue-500-dark {
  border-color: var(--sc-color-blue-500-dark);
}

.border-blue-550 {
  border-color: var(--sc-color-blue-550);
}

.border-blue-550-dark {
  border-color: var(--sc-color-blue-550-dark);
}

.border-blue-600 {
  border-color: var(--sc-color-blue-600);
}

.border-blue-600-dark {
  border-color: var(--sc-color-blue-600-dark);
}

.border-blue-650 {
  border-color: var(--sc-color-blue-650);
}

.border-blue-650-dark {
  border-color: var(--sc-color-blue-650-dark);
}

.border-blue-700 {
  border-color: var(--sc-color-blue-700);
}

.border-blue-700-dark {
  border-color: var(--sc-color-blue-700-dark);
}

.border-blue-750 {
  border-color: var(--sc-color-blue-750);
}

.border-blue-750-dark {
  border-color: var(--sc-color-blue-750-dark);
}

.border-blue-800 {
  border-color: var(--sc-color-blue-800);
}

.border-blue-800-dark {
  border-color: var(--sc-color-blue-800-dark);
}

.border-blue-850 {
  border-color: var(--sc-color-blue-850);
}

.border-blue-850-dark {
  border-color: var(--sc-color-blue-850-dark);
}

.border-blue-900 {
  border-color: var(--sc-color-blue-900);
}

.border-blue-900-dark {
  border-color: var(--sc-color-blue-900-dark);
}

.border-blue-950 {
  border-color: var(--sc-color-blue-950);
}

.border-blue-950-dark {
  border-color: var(--sc-color-blue-950-dark);
}

.border-current {
  border-color: currentColor;
}

.border-green-100 {
  border-color: var(--sc-color-green-100);
}

.border-green-100-dark {
  border-color: var(--sc-color-green-100-dark);
}

.border-green-150 {
  border-color: var(--sc-color-green-150);
}

.border-green-150-dark {
  border-color: var(--sc-color-green-150-dark);
}

.border-green-200 {
  border-color: var(--sc-color-green-200);
}

.border-green-200-dark {
  border-color: var(--sc-color-green-200-dark);
}

.border-green-250 {
  border-color: var(--sc-color-green-250);
}

.border-green-250-dark {
  border-color: var(--sc-color-green-250-dark);
}

.border-green-300 {
  border-color: var(--sc-color-green-300);
}

.border-green-300-dark {
  border-color: var(--sc-color-green-300-dark);
}

.border-green-350 {
  border-color: var(--sc-color-green-350);
}

.border-green-350-dark {
  border-color: var(--sc-color-green-350-dark);
}

.border-green-400 {
  border-color: var(--sc-color-green-400);
}

.border-green-400-dark {
  border-color: var(--sc-color-green-400-dark);
}

.border-green-450 {
  border-color: var(--sc-color-green-450);
}

.border-green-450-dark {
  border-color: var(--sc-color-green-450-dark);
}

.border-green-50 {
  border-color: var(--sc-color-green-50);
}

.border-green-50-dark {
  border-color: var(--sc-color-green-50-dark);
}

.border-green-500 {
  border-color: var(--sc-color-green-500);
}

.border-green-500-dark {
  border-color: var(--sc-color-green-500-dark);
}

.border-green-550 {
  border-color: var(--sc-color-green-550);
}

.border-green-550-dark {
  border-color: var(--sc-color-green-550-dark);
}

.border-green-600 {
  border-color: var(--sc-color-green-600);
}

.border-green-600-dark {
  border-color: var(--sc-color-green-600-dark);
}

.border-green-650 {
  border-color: var(--sc-color-green-650);
}

.border-green-650-dark {
  border-color: var(--sc-color-green-650-dark);
}

.border-green-700 {
  border-color: var(--sc-color-green-700);
}

.border-green-700-dark {
  border-color: var(--sc-color-green-700-dark);
}

.border-green-750 {
  border-color: var(--sc-color-green-750);
}

.border-green-750-dark {
  border-color: var(--sc-color-green-750-dark);
}

.border-green-800 {
  border-color: var(--sc-color-green-800);
}

.border-green-800-dark {
  border-color: var(--sc-color-green-800-dark);
}

.border-green-850 {
  border-color: var(--sc-color-green-850);
}

.border-green-850-dark {
  border-color: var(--sc-color-green-850-dark);
}

.border-green-900 {
  border-color: var(--sc-color-green-900);
}

.border-green-900-dark {
  border-color: var(--sc-color-green-900-dark);
}

.border-green-950 {
  border-color: var(--sc-color-green-950);
}

.border-green-950-dark {
  border-color: var(--sc-color-green-950-dark);
}

.border-grey-100 {
  border-color: var(--sc-color-grey-100);
}

.border-grey-100-dark {
  border-color: var(--sc-color-grey-100-dark);
}

.border-grey-150 {
  border-color: var(--sc-color-grey-150);
}

.border-grey-150-dark {
  border-color: var(--sc-color-grey-150-dark);
}

.border-grey-200 {
  border-color: var(--sc-color-grey-200);
}

.border-grey-200-dark {
  border-color: var(--sc-color-grey-200-dark);
}

.border-grey-250 {
  border-color: var(--sc-color-grey-250);
}

.border-grey-250-dark {
  border-color: var(--sc-color-grey-250-dark);
}

.border-grey-300 {
  border-color: var(--sc-color-grey-300);
}

.border-grey-300-dark {
  border-color: var(--sc-color-grey-300-dark);
}

.border-grey-350 {
  border-color: var(--sc-color-grey-350);
}

.border-grey-350-dark {
  border-color: var(--sc-color-grey-350-dark);
}

.border-grey-400 {
  border-color: var(--sc-color-grey-400);
}

.border-grey-400-dark {
  border-color: var(--sc-color-grey-400-dark);
}

.border-grey-450 {
  border-color: var(--sc-color-grey-450);
}

.border-grey-450-dark {
  border-color: var(--sc-color-grey-450-dark);
}

.border-grey-50 {
  border-color: var(--sc-color-grey-50);
}

.border-grey-50-dark {
  border-color: var(--sc-color-grey-50-dark);
}

.border-grey-500 {
  border-color: var(--sc-color-grey-500);
}

.border-grey-500-dark {
  border-color: var(--sc-color-grey-500-dark);
}

.border-grey-550 {
  border-color: var(--sc-color-grey-550);
}

.border-grey-550-dark {
  border-color: var(--sc-color-grey-550-dark);
}

.border-grey-600 {
  border-color: var(--sc-color-grey-600);
}

.border-grey-600-dark {
  border-color: var(--sc-color-grey-600-dark);
}

.border-grey-650 {
  border-color: var(--sc-color-grey-650);
}

.border-grey-650-dark {
  border-color: var(--sc-color-grey-650-dark);
}

.border-grey-700 {
  border-color: var(--sc-color-grey-700);
}

.border-grey-700-dark {
  border-color: var(--sc-color-grey-700-dark);
}

.border-grey-750 {
  border-color: var(--sc-color-grey-750);
}

.border-grey-750-dark {
  border-color: var(--sc-color-grey-750-dark);
}

.border-grey-800 {
  border-color: var(--sc-color-grey-800);
}

.border-grey-800-dark {
  border-color: var(--sc-color-grey-800-dark);
}

.border-grey-850 {
  border-color: var(--sc-color-grey-850);
}

.border-grey-850-dark {
  border-color: var(--sc-color-grey-850-dark);
}

.border-grey-900 {
  border-color: var(--sc-color-grey-900);
}

.border-grey-900-dark {
  border-color: var(--sc-color-grey-900-dark);
}

.border-grey-950 {
  border-color: var(--sc-color-grey-950);
}

.border-grey-950-dark {
  border-color: var(--sc-color-grey-950-dark);
}

.border-grey-black {
  border-color: var(--sc-color-black);
}

.border-muted {
  border-color: var(--sc-color-blue-900);
}

.border-orange-500 {
  border-color: var(--sc-color-orange-500);
}

.border-primary {
  border-color: var(--sc-color-blue);
}

.border-purple-100 {
  border-color: var(--sc-color-purple-100);
}

.border-purple-100-dark {
  border-color: var(--sc-color-purple-100-dark);
}

.border-purple-150 {
  border-color: var(--sc-color-purple-150);
}

.border-purple-150-dark {
  border-color: var(--sc-color-purple-150-dark);
}

.border-purple-200 {
  border-color: var(--sc-color-purple-200);
}

.border-purple-200-dark {
  border-color: var(--sc-color-purple-200-dark);
}

.border-purple-250 {
  border-color: var(--sc-color-purple-250);
}

.border-purple-250-dark {
  border-color: var(--sc-color-purple-250-dark);
}

.border-purple-300 {
  border-color: var(--sc-color-purple-300);
}

.border-purple-300-dark {
  border-color: var(--sc-color-purple-300-dark);
}

.border-purple-350 {
  border-color: var(--sc-color-purple-350);
}

.border-purple-350-dark {
  border-color: var(--sc-color-purple-350-dark);
}

.border-purple-400 {
  border-color: var(--sc-color-purple-400);
}

.border-purple-400-dark {
  border-color: var(--sc-color-purple-400-dark);
}

.border-purple-450 {
  border-color: var(--sc-color-purple-450);
}

.border-purple-450-dark {
  border-color: var(--sc-color-purple-450-dark);
}

.border-purple-50 {
  border-color: var(--sc-color-purple-50);
}

.border-purple-50-dark {
  border-color: var(--sc-color-purple-50-dark);
}

.border-purple-500 {
  border-color: var(--sc-color-purple-500);
}

.border-purple-500-dark {
  border-color: var(--sc-color-purple-500-dark);
}

.border-purple-550 {
  border-color: var(--sc-color-purple-550);
}

.border-purple-550-dark {
  border-color: var(--sc-color-purple-550-dark);
}

.border-purple-600 {
  border-color: var(--sc-color-purple-600);
}

.border-purple-600-dark {
  border-color: var(--sc-color-purple-600-dark);
}

.border-purple-650 {
  border-color: var(--sc-color-purple-650);
}

.border-purple-650-dark {
  border-color: var(--sc-color-purple-650-dark);
}

.border-purple-700 {
  border-color: var(--sc-color-purple-700);
}

.border-purple-700-dark {
  border-color: var(--sc-color-purple-700-dark);
}

.border-purple-750 {
  border-color: var(--sc-color-purple-750);
}

.border-purple-750-dark {
  border-color: var(--sc-color-purple-750-dark);
}

.border-purple-800 {
  border-color: var(--sc-color-purple-800);
}

.border-purple-800-dark {
  border-color: var(--sc-color-purple-800-dark);
}

.border-purple-850 {
  border-color: var(--sc-color-purple-850);
}

.border-purple-850-dark {
  border-color: var(--sc-color-purple-850-dark);
}

.border-purple-900 {
  border-color: var(--sc-color-purple-900);
}

.border-purple-900-dark {
  border-color: var(--sc-color-purple-900-dark);
}

.border-purple-950 {
  border-color: var(--sc-color-purple-950);
}

.border-purple-950-dark {
  border-color: var(--sc-color-purple-950-dark);
}

.border-red-100 {
  border-color: var(--sc-color-red-100);
}

.border-red-100-dark {
  border-color: var(--sc-color-red-100-dark);
}

.border-red-150 {
  border-color: var(--sc-color-red-150);
}

.border-red-150-dark {
  border-color: var(--sc-color-red-150-dark);
}

.border-red-200 {
  border-color: var(--sc-color-red-200);
}

.border-red-200-dark {
  border-color: var(--sc-color-red-200-dark);
}

.border-red-250 {
  border-color: var(--sc-color-red-250);
}

.border-red-250-dark {
  border-color: var(--sc-color-red-250-dark);
}

.border-red-300 {
  border-color: var(--sc-color-red-300);
}

.border-red-300-dark {
  border-color: var(--sc-color-red-300-dark);
}

.border-red-350 {
  border-color: var(--sc-color-red-350);
}

.border-red-350-dark {
  border-color: var(--sc-color-red-350-dark);
}

.border-red-400 {
  border-color: var(--sc-color-red-400);
}

.border-red-400-dark {
  border-color: var(--sc-color-red-400-dark);
}

.border-red-450 {
  border-color: var(--sc-color-red-450);
}

.border-red-450-dark {
  border-color: var(--sc-color-red-450-dark);
}

.border-red-50 {
  border-color: var(--sc-color-red-50);
}

.border-red-50-dark {
  border-color: var(--sc-color-red-50-dark);
}

.border-red-500 {
  border-color: var(--sc-color-red-500);
}

.border-red-500-dark {
  border-color: var(--sc-color-red-500-dark);
}

.border-red-550 {
  border-color: var(--sc-color-red-550);
}

.border-red-550-dark {
  border-color: var(--sc-color-red-550-dark);
}

.border-red-600 {
  border-color: var(--sc-color-red-600);
}

.border-red-600-dark {
  border-color: var(--sc-color-red-600-dark);
}

.border-red-650 {
  border-color: var(--sc-color-red-650);
}

.border-red-650-dark {
  border-color: var(--sc-color-red-650-dark);
}

.border-red-700 {
  border-color: var(--sc-color-red-700);
}

.border-red-700-dark {
  border-color: var(--sc-color-red-700-dark);
}

.border-red-750 {
  border-color: var(--sc-color-red-750);
}

.border-red-750-dark {
  border-color: var(--sc-color-red-750-dark);
}

.border-red-800 {
  border-color: var(--sc-color-red-800);
}

.border-red-800-dark {
  border-color: var(--sc-color-red-800-dark);
}

.border-red-850 {
  border-color: var(--sc-color-red-850);
}

.border-red-850-dark {
  border-color: var(--sc-color-red-850-dark);
}

.border-red-900 {
  border-color: var(--sc-color-red-900);
}

.border-red-900-dark {
  border-color: var(--sc-color-red-900-dark);
}

.border-red-950 {
  border-color: var(--sc-color-red-950);
}

.border-red-950-dark {
  border-color: var(--sc-color-red-950-dark);
}

.border-teal-100 {
  border-color: var(--sc-color-teal-100);
}

.border-teal-500 {
  border-color: var(--sc-color-teal-500);
}

.border-transparent {
  border-color: transparent;
}

.border-transparent\/0 {
  border-color: rgb(0 0 0 / 0);
}

.border-transparent\/10 {
  border-color: rgb(0 0 0 / 0.1);
}

.border-transparent\/100 {
  border-color: rgb(0 0 0 / 1);
}

.border-transparent\/15 {
  border-color: rgb(0 0 0 / 0.15);
}

.border-transparent\/20 {
  border-color: rgb(0 0 0 / 0.2);
}

.border-transparent\/25 {
  border-color: rgb(0 0 0 / 0.25);
}

.border-transparent\/30 {
  border-color: rgb(0 0 0 / 0.3);
}

.border-transparent\/35 {
  border-color: rgb(0 0 0 / 0.35);
}

.border-transparent\/40 {
  border-color: rgb(0 0 0 / 0.4);
}

.border-transparent\/45 {
  border-color: rgb(0 0 0 / 0.45);
}

.border-transparent\/5 {
  border-color: rgb(0 0 0 / 0.05);
}

.border-transparent\/50 {
  border-color: rgb(0 0 0 / 0.5);
}

.border-transparent\/55 {
  border-color: rgb(0 0 0 / 0.55);
}

.border-transparent\/60 {
  border-color: rgb(0 0 0 / 0.6);
}

.border-transparent\/65 {
  border-color: rgb(0 0 0 / 0.65);
}

.border-transparent\/70 {
  border-color: rgb(0 0 0 / 0.7);
}

.border-transparent\/75 {
  border-color: rgb(0 0 0 / 0.75);
}

.border-transparent\/80 {
  border-color: rgb(0 0 0 / 0.8);
}

.border-transparent\/85 {
  border-color: rgb(0 0 0 / 0.85);
}

.border-transparent\/90 {
  border-color: rgb(0 0 0 / 0.9);
}

.border-transparent\/95 {
  border-color: rgb(0 0 0 / 0.95);
}

.border-white {
  border-color: var(--sc-color-white);
}

.border-x-amber-100 {
  border-left-color: var(--sc-color-amber-100);
  border-right-color: var(--sc-color-amber-100);
}

.border-x-amber-100-dark {
  border-left-color: var(--sc-color-amber-100-dark);
  border-right-color: var(--sc-color-amber-100-dark);
}

.border-x-amber-150 {
  border-left-color: var(--sc-color-amber-150);
  border-right-color: var(--sc-color-amber-150);
}

.border-x-amber-150-dark {
  border-left-color: var(--sc-color-amber-150-dark);
  border-right-color: var(--sc-color-amber-150-dark);
}

.border-x-amber-200 {
  border-left-color: var(--sc-color-amber-200);
  border-right-color: var(--sc-color-amber-200);
}

.border-x-amber-200-dark {
  border-left-color: var(--sc-color-amber-200-dark);
  border-right-color: var(--sc-color-amber-200-dark);
}

.border-x-amber-250 {
  border-left-color: var(--sc-color-amber-250);
  border-right-color: var(--sc-color-amber-250);
}

.border-x-amber-250-dark {
  border-left-color: var(--sc-color-amber-250-dark);
  border-right-color: var(--sc-color-amber-250-dark);
}

.border-x-amber-300 {
  border-left-color: var(--sc-color-amber-300);
  border-right-color: var(--sc-color-amber-300);
}

.border-x-amber-300-dark {
  border-left-color: var(--sc-color-amber-300-dark);
  border-right-color: var(--sc-color-amber-300-dark);
}

.border-x-amber-350 {
  border-left-color: var(--sc-color-amber-350);
  border-right-color: var(--sc-color-amber-350);
}

.border-x-amber-350-dark {
  border-left-color: var(--sc-color-amber-350-dark);
  border-right-color: var(--sc-color-amber-350-dark);
}

.border-x-amber-400 {
  border-left-color: var(--sc-color-amber-400);
  border-right-color: var(--sc-color-amber-400);
}

.border-x-amber-400-dark {
  border-left-color: var(--sc-color-amber-400-dark);
  border-right-color: var(--sc-color-amber-400-dark);
}

.border-x-amber-450 {
  border-left-color: var(--sc-color-amber-450);
  border-right-color: var(--sc-color-amber-450);
}

.border-x-amber-450-dark {
  border-left-color: var(--sc-color-amber-450-dark);
  border-right-color: var(--sc-color-amber-450-dark);
}

.border-x-amber-50 {
  border-left-color: var(--sc-color-amber-50);
  border-right-color: var(--sc-color-amber-50);
}

.border-x-amber-50-dark {
  border-left-color: var(--sc-color-amber-50-dark);
  border-right-color: var(--sc-color-amber-50-dark);
}

.border-x-amber-500 {
  border-left-color: var(--sc-color-amber-500);
  border-right-color: var(--sc-color-amber-500);
}

.border-x-amber-500-dark {
  border-left-color: var(--sc-color-amber-500-dark);
  border-right-color: var(--sc-color-amber-500-dark);
}

.border-x-amber-550 {
  border-left-color: var(--sc-color-amber-550);
  border-right-color: var(--sc-color-amber-550);
}

.border-x-amber-550-dark {
  border-left-color: var(--sc-color-amber-550-dark);
  border-right-color: var(--sc-color-amber-550-dark);
}

.border-x-amber-600 {
  border-left-color: var(--sc-color-amber-600);
  border-right-color: var(--sc-color-amber-600);
}

.border-x-amber-600-dark {
  border-left-color: var(--sc-color-amber-600-dark);
  border-right-color: var(--sc-color-amber-600-dark);
}

.border-x-amber-650 {
  border-left-color: var(--sc-color-amber-650);
  border-right-color: var(--sc-color-amber-650);
}

.border-x-amber-650-dark {
  border-left-color: var(--sc-color-amber-650-dark);
  border-right-color: var(--sc-color-amber-650-dark);
}

.border-x-amber-700 {
  border-left-color: var(--sc-color-amber-700);
  border-right-color: var(--sc-color-amber-700);
}

.border-x-amber-700-dark {
  border-left-color: var(--sc-color-amber-700-dark);
  border-right-color: var(--sc-color-amber-700-dark);
}

.border-x-amber-750 {
  border-left-color: var(--sc-color-amber-750);
  border-right-color: var(--sc-color-amber-750);
}

.border-x-amber-750-dark {
  border-left-color: var(--sc-color-amber-750-dark);
  border-right-color: var(--sc-color-amber-750-dark);
}

.border-x-amber-800 {
  border-left-color: var(--sc-color-amber-800);
  border-right-color: var(--sc-color-amber-800);
}

.border-x-amber-800-dark {
  border-left-color: var(--sc-color-amber-800-dark);
  border-right-color: var(--sc-color-amber-800-dark);
}

.border-x-amber-850 {
  border-left-color: var(--sc-color-amber-850);
  border-right-color: var(--sc-color-amber-850);
}

.border-x-amber-850-dark {
  border-left-color: var(--sc-color-amber-850-dark);
  border-right-color: var(--sc-color-amber-850-dark);
}

.border-x-amber-900 {
  border-left-color: var(--sc-color-amber-900);
  border-right-color: var(--sc-color-amber-900);
}

.border-x-amber-900-dark {
  border-left-color: var(--sc-color-amber-900-dark);
  border-right-color: var(--sc-color-amber-900-dark);
}

.border-x-amber-950 {
  border-left-color: var(--sc-color-amber-950);
  border-right-color: var(--sc-color-amber-950);
}

.border-x-amber-950-dark {
  border-left-color: var(--sc-color-amber-950-dark);
  border-right-color: var(--sc-color-amber-950-dark);
}

.border-x-blue-100 {
  border-left-color: var(--sc-color-blue-100);
  border-right-color: var(--sc-color-blue-100);
}

.border-x-blue-100-dark {
  border-left-color: var(--sc-color-blue-100-dark);
  border-right-color: var(--sc-color-blue-100-dark);
}

.border-x-blue-150 {
  border-left-color: var(--sc-color-blue-150);
  border-right-color: var(--sc-color-blue-150);
}

.border-x-blue-150-dark {
  border-left-color: var(--sc-color-blue-150-dark);
  border-right-color: var(--sc-color-blue-150-dark);
}

.border-x-blue-200 {
  border-left-color: var(--sc-color-blue-200);
  border-right-color: var(--sc-color-blue-200);
}

.border-x-blue-200-dark {
  border-left-color: var(--sc-color-blue-200-dark);
  border-right-color: var(--sc-color-blue-200-dark);
}

.border-x-blue-250 {
  border-left-color: var(--sc-color-blue-250);
  border-right-color: var(--sc-color-blue-250);
}

.border-x-blue-250-dark {
  border-left-color: var(--sc-color-blue-250-dark);
  border-right-color: var(--sc-color-blue-250-dark);
}

.border-x-blue-300 {
  border-left-color: var(--sc-color-blue-300);
  border-right-color: var(--sc-color-blue-300);
}

.border-x-blue-300-dark {
  border-left-color: var(--sc-color-blue-300-dark);
  border-right-color: var(--sc-color-blue-300-dark);
}

.border-x-blue-350 {
  border-left-color: var(--sc-color-blue-350);
  border-right-color: var(--sc-color-blue-350);
}

.border-x-blue-350-dark {
  border-left-color: var(--sc-color-blue-350-dark);
  border-right-color: var(--sc-color-blue-350-dark);
}

.border-x-blue-400 {
  border-left-color: var(--sc-color-blue-400);
  border-right-color: var(--sc-color-blue-400);
}

.border-x-blue-400-dark {
  border-left-color: var(--sc-color-blue-400-dark);
  border-right-color: var(--sc-color-blue-400-dark);
}

.border-x-blue-450 {
  border-left-color: var(--sc-color-blue-450);
  border-right-color: var(--sc-color-blue-450);
}

.border-x-blue-450-dark {
  border-left-color: var(--sc-color-blue-450-dark);
  border-right-color: var(--sc-color-blue-450-dark);
}

.border-x-blue-50 {
  border-left-color: var(--sc-color-blue-50);
  border-right-color: var(--sc-color-blue-50);
}

.border-x-blue-50-dark {
  border-left-color: var(--sc-color-blue-50-dark);
  border-right-color: var(--sc-color-blue-50-dark);
}

.border-x-blue-500 {
  border-left-color: var(--sc-color-blue-500);
  border-right-color: var(--sc-color-blue-500);
}

.border-x-blue-500-dark {
  border-left-color: var(--sc-color-blue-500-dark);
  border-right-color: var(--sc-color-blue-500-dark);
}

.border-x-blue-550 {
  border-left-color: var(--sc-color-blue-550);
  border-right-color: var(--sc-color-blue-550);
}

.border-x-blue-550-dark {
  border-left-color: var(--sc-color-blue-550-dark);
  border-right-color: var(--sc-color-blue-550-dark);
}

.border-x-blue-600 {
  border-left-color: var(--sc-color-blue-600);
  border-right-color: var(--sc-color-blue-600);
}

.border-x-blue-600-dark {
  border-left-color: var(--sc-color-blue-600-dark);
  border-right-color: var(--sc-color-blue-600-dark);
}

.border-x-blue-650 {
  border-left-color: var(--sc-color-blue-650);
  border-right-color: var(--sc-color-blue-650);
}

.border-x-blue-650-dark {
  border-left-color: var(--sc-color-blue-650-dark);
  border-right-color: var(--sc-color-blue-650-dark);
}

.border-x-blue-700 {
  border-left-color: var(--sc-color-blue-700);
  border-right-color: var(--sc-color-blue-700);
}

.border-x-blue-700-dark {
  border-left-color: var(--sc-color-blue-700-dark);
  border-right-color: var(--sc-color-blue-700-dark);
}

.border-x-blue-750 {
  border-left-color: var(--sc-color-blue-750);
  border-right-color: var(--sc-color-blue-750);
}

.border-x-blue-750-dark {
  border-left-color: var(--sc-color-blue-750-dark);
  border-right-color: var(--sc-color-blue-750-dark);
}

.border-x-blue-800 {
  border-left-color: var(--sc-color-blue-800);
  border-right-color: var(--sc-color-blue-800);
}

.border-x-blue-800-dark {
  border-left-color: var(--sc-color-blue-800-dark);
  border-right-color: var(--sc-color-blue-800-dark);
}

.border-x-blue-850 {
  border-left-color: var(--sc-color-blue-850);
  border-right-color: var(--sc-color-blue-850);
}

.border-x-blue-850-dark {
  border-left-color: var(--sc-color-blue-850-dark);
  border-right-color: var(--sc-color-blue-850-dark);
}

.border-x-blue-900 {
  border-left-color: var(--sc-color-blue-900);
  border-right-color: var(--sc-color-blue-900);
}

.border-x-blue-900-dark {
  border-left-color: var(--sc-color-blue-900-dark);
  border-right-color: var(--sc-color-blue-900-dark);
}

.border-x-blue-950 {
  border-left-color: var(--sc-color-blue-950);
  border-right-color: var(--sc-color-blue-950);
}

.border-x-blue-950-dark {
  border-left-color: var(--sc-color-blue-950-dark);
  border-right-color: var(--sc-color-blue-950-dark);
}

.border-x-current {
  border-left-color: currentColor;
  border-right-color: currentColor;
}

.border-x-green-100 {
  border-left-color: var(--sc-color-green-100);
  border-right-color: var(--sc-color-green-100);
}

.border-x-green-100-dark {
  border-left-color: var(--sc-color-green-100-dark);
  border-right-color: var(--sc-color-green-100-dark);
}

.border-x-green-150 {
  border-left-color: var(--sc-color-green-150);
  border-right-color: var(--sc-color-green-150);
}

.border-x-green-150-dark {
  border-left-color: var(--sc-color-green-150-dark);
  border-right-color: var(--sc-color-green-150-dark);
}

.border-x-green-200 {
  border-left-color: var(--sc-color-green-200);
  border-right-color: var(--sc-color-green-200);
}

.border-x-green-200-dark {
  border-left-color: var(--sc-color-green-200-dark);
  border-right-color: var(--sc-color-green-200-dark);
}

.border-x-green-250 {
  border-left-color: var(--sc-color-green-250);
  border-right-color: var(--sc-color-green-250);
}

.border-x-green-250-dark {
  border-left-color: var(--sc-color-green-250-dark);
  border-right-color: var(--sc-color-green-250-dark);
}

.border-x-green-300 {
  border-left-color: var(--sc-color-green-300);
  border-right-color: var(--sc-color-green-300);
}

.border-x-green-300-dark {
  border-left-color: var(--sc-color-green-300-dark);
  border-right-color: var(--sc-color-green-300-dark);
}

.border-x-green-350 {
  border-left-color: var(--sc-color-green-350);
  border-right-color: var(--sc-color-green-350);
}

.border-x-green-350-dark {
  border-left-color: var(--sc-color-green-350-dark);
  border-right-color: var(--sc-color-green-350-dark);
}

.border-x-green-400 {
  border-left-color: var(--sc-color-green-400);
  border-right-color: var(--sc-color-green-400);
}

.border-x-green-400-dark {
  border-left-color: var(--sc-color-green-400-dark);
  border-right-color: var(--sc-color-green-400-dark);
}

.border-x-green-450 {
  border-left-color: var(--sc-color-green-450);
  border-right-color: var(--sc-color-green-450);
}

.border-x-green-450-dark {
  border-left-color: var(--sc-color-green-450-dark);
  border-right-color: var(--sc-color-green-450-dark);
}

.border-x-green-50 {
  border-left-color: var(--sc-color-green-50);
  border-right-color: var(--sc-color-green-50);
}

.border-x-green-50-dark {
  border-left-color: var(--sc-color-green-50-dark);
  border-right-color: var(--sc-color-green-50-dark);
}

.border-x-green-500 {
  border-left-color: var(--sc-color-green-500);
  border-right-color: var(--sc-color-green-500);
}

.border-x-green-500-dark {
  border-left-color: var(--sc-color-green-500-dark);
  border-right-color: var(--sc-color-green-500-dark);
}

.border-x-green-550 {
  border-left-color: var(--sc-color-green-550);
  border-right-color: var(--sc-color-green-550);
}

.border-x-green-550-dark {
  border-left-color: var(--sc-color-green-550-dark);
  border-right-color: var(--sc-color-green-550-dark);
}

.border-x-green-600 {
  border-left-color: var(--sc-color-green-600);
  border-right-color: var(--sc-color-green-600);
}

.border-x-green-600-dark {
  border-left-color: var(--sc-color-green-600-dark);
  border-right-color: var(--sc-color-green-600-dark);
}

.border-x-green-650 {
  border-left-color: var(--sc-color-green-650);
  border-right-color: var(--sc-color-green-650);
}

.border-x-green-650-dark {
  border-left-color: var(--sc-color-green-650-dark);
  border-right-color: var(--sc-color-green-650-dark);
}

.border-x-green-700 {
  border-left-color: var(--sc-color-green-700);
  border-right-color: var(--sc-color-green-700);
}

.border-x-green-700-dark {
  border-left-color: var(--sc-color-green-700-dark);
  border-right-color: var(--sc-color-green-700-dark);
}

.border-x-green-750 {
  border-left-color: var(--sc-color-green-750);
  border-right-color: var(--sc-color-green-750);
}

.border-x-green-750-dark {
  border-left-color: var(--sc-color-green-750-dark);
  border-right-color: var(--sc-color-green-750-dark);
}

.border-x-green-800 {
  border-left-color: var(--sc-color-green-800);
  border-right-color: var(--sc-color-green-800);
}

.border-x-green-800-dark {
  border-left-color: var(--sc-color-green-800-dark);
  border-right-color: var(--sc-color-green-800-dark);
}

.border-x-green-850 {
  border-left-color: var(--sc-color-green-850);
  border-right-color: var(--sc-color-green-850);
}

.border-x-green-850-dark {
  border-left-color: var(--sc-color-green-850-dark);
  border-right-color: var(--sc-color-green-850-dark);
}

.border-x-green-900 {
  border-left-color: var(--sc-color-green-900);
  border-right-color: var(--sc-color-green-900);
}

.border-x-green-900-dark {
  border-left-color: var(--sc-color-green-900-dark);
  border-right-color: var(--sc-color-green-900-dark);
}

.border-x-green-950 {
  border-left-color: var(--sc-color-green-950);
  border-right-color: var(--sc-color-green-950);
}

.border-x-green-950-dark {
  border-left-color: var(--sc-color-green-950-dark);
  border-right-color: var(--sc-color-green-950-dark);
}

.border-x-grey-100 {
  border-left-color: var(--sc-color-grey-100);
  border-right-color: var(--sc-color-grey-100);
}

.border-x-grey-100-dark {
  border-left-color: var(--sc-color-grey-100-dark);
  border-right-color: var(--sc-color-grey-100-dark);
}

.border-x-grey-150 {
  border-left-color: var(--sc-color-grey-150);
  border-right-color: var(--sc-color-grey-150);
}

.border-x-grey-150-dark {
  border-left-color: var(--sc-color-grey-150-dark);
  border-right-color: var(--sc-color-grey-150-dark);
}

.border-x-grey-200 {
  border-left-color: var(--sc-color-grey-200);
  border-right-color: var(--sc-color-grey-200);
}

.border-x-grey-200-dark {
  border-left-color: var(--sc-color-grey-200-dark);
  border-right-color: var(--sc-color-grey-200-dark);
}

.border-x-grey-250 {
  border-left-color: var(--sc-color-grey-250);
  border-right-color: var(--sc-color-grey-250);
}

.border-x-grey-250-dark {
  border-left-color: var(--sc-color-grey-250-dark);
  border-right-color: var(--sc-color-grey-250-dark);
}

.border-x-grey-300 {
  border-left-color: var(--sc-color-grey-300);
  border-right-color: var(--sc-color-grey-300);
}

.border-x-grey-300-dark {
  border-left-color: var(--sc-color-grey-300-dark);
  border-right-color: var(--sc-color-grey-300-dark);
}

.border-x-grey-350 {
  border-left-color: var(--sc-color-grey-350);
  border-right-color: var(--sc-color-grey-350);
}

.border-x-grey-350-dark {
  border-left-color: var(--sc-color-grey-350-dark);
  border-right-color: var(--sc-color-grey-350-dark);
}

.border-x-grey-400 {
  border-left-color: var(--sc-color-grey-400);
  border-right-color: var(--sc-color-grey-400);
}

.border-x-grey-400-dark {
  border-left-color: var(--sc-color-grey-400-dark);
  border-right-color: var(--sc-color-grey-400-dark);
}

.border-x-grey-450 {
  border-left-color: var(--sc-color-grey-450);
  border-right-color: var(--sc-color-grey-450);
}

.border-x-grey-450-dark {
  border-left-color: var(--sc-color-grey-450-dark);
  border-right-color: var(--sc-color-grey-450-dark);
}

.border-x-grey-50 {
  border-left-color: var(--sc-color-grey-50);
  border-right-color: var(--sc-color-grey-50);
}

.border-x-grey-50-dark {
  border-left-color: var(--sc-color-grey-50-dark);
  border-right-color: var(--sc-color-grey-50-dark);
}

.border-x-grey-500 {
  border-left-color: var(--sc-color-grey-500);
  border-right-color: var(--sc-color-grey-500);
}

.border-x-grey-500-dark {
  border-left-color: var(--sc-color-grey-500-dark);
  border-right-color: var(--sc-color-grey-500-dark);
}

.border-x-grey-550 {
  border-left-color: var(--sc-color-grey-550);
  border-right-color: var(--sc-color-grey-550);
}

.border-x-grey-550-dark {
  border-left-color: var(--sc-color-grey-550-dark);
  border-right-color: var(--sc-color-grey-550-dark);
}

.border-x-grey-600 {
  border-left-color: var(--sc-color-grey-600);
  border-right-color: var(--sc-color-grey-600);
}

.border-x-grey-600-dark {
  border-left-color: var(--sc-color-grey-600-dark);
  border-right-color: var(--sc-color-grey-600-dark);
}

.border-x-grey-650 {
  border-left-color: var(--sc-color-grey-650);
  border-right-color: var(--sc-color-grey-650);
}

.border-x-grey-650-dark {
  border-left-color: var(--sc-color-grey-650-dark);
  border-right-color: var(--sc-color-grey-650-dark);
}

.border-x-grey-700 {
  border-left-color: var(--sc-color-grey-700);
  border-right-color: var(--sc-color-grey-700);
}

.border-x-grey-700-dark {
  border-left-color: var(--sc-color-grey-700-dark);
  border-right-color: var(--sc-color-grey-700-dark);
}

.border-x-grey-750 {
  border-left-color: var(--sc-color-grey-750);
  border-right-color: var(--sc-color-grey-750);
}

.border-x-grey-750-dark {
  border-left-color: var(--sc-color-grey-750-dark);
  border-right-color: var(--sc-color-grey-750-dark);
}

.border-x-grey-800 {
  border-left-color: var(--sc-color-grey-800);
  border-right-color: var(--sc-color-grey-800);
}

.border-x-grey-800-dark {
  border-left-color: var(--sc-color-grey-800-dark);
  border-right-color: var(--sc-color-grey-800-dark);
}

.border-x-grey-850 {
  border-left-color: var(--sc-color-grey-850);
  border-right-color: var(--sc-color-grey-850);
}

.border-x-grey-850-dark {
  border-left-color: var(--sc-color-grey-850-dark);
  border-right-color: var(--sc-color-grey-850-dark);
}

.border-x-grey-900 {
  border-left-color: var(--sc-color-grey-900);
  border-right-color: var(--sc-color-grey-900);
}

.border-x-grey-900-dark {
  border-left-color: var(--sc-color-grey-900-dark);
  border-right-color: var(--sc-color-grey-900-dark);
}

.border-x-grey-950 {
  border-left-color: var(--sc-color-grey-950);
  border-right-color: var(--sc-color-grey-950);
}

.border-x-grey-950-dark {
  border-left-color: var(--sc-color-grey-950-dark);
  border-right-color: var(--sc-color-grey-950-dark);
}

.border-x-grey-black {
  border-left-color: var(--sc-color-black);
  border-right-color: var(--sc-color-black);
}

.border-x-muted {
  border-left-color: var(--sc-color-blue-900);
  border-right-color: var(--sc-color-blue-900);
}

.border-x-orange-500 {
  border-left-color: var(--sc-color-orange-500);
  border-right-color: var(--sc-color-orange-500);
}

.border-x-primary {
  border-left-color: var(--sc-color-blue);
  border-right-color: var(--sc-color-blue);
}

.border-x-purple-100 {
  border-left-color: var(--sc-color-purple-100);
  border-right-color: var(--sc-color-purple-100);
}

.border-x-purple-100-dark {
  border-left-color: var(--sc-color-purple-100-dark);
  border-right-color: var(--sc-color-purple-100-dark);
}

.border-x-purple-150 {
  border-left-color: var(--sc-color-purple-150);
  border-right-color: var(--sc-color-purple-150);
}

.border-x-purple-150-dark {
  border-left-color: var(--sc-color-purple-150-dark);
  border-right-color: var(--sc-color-purple-150-dark);
}

.border-x-purple-200 {
  border-left-color: var(--sc-color-purple-200);
  border-right-color: var(--sc-color-purple-200);
}

.border-x-purple-200-dark {
  border-left-color: var(--sc-color-purple-200-dark);
  border-right-color: var(--sc-color-purple-200-dark);
}

.border-x-purple-250 {
  border-left-color: var(--sc-color-purple-250);
  border-right-color: var(--sc-color-purple-250);
}

.border-x-purple-250-dark {
  border-left-color: var(--sc-color-purple-250-dark);
  border-right-color: var(--sc-color-purple-250-dark);
}

.border-x-purple-300 {
  border-left-color: var(--sc-color-purple-300);
  border-right-color: var(--sc-color-purple-300);
}

.border-x-purple-300-dark {
  border-left-color: var(--sc-color-purple-300-dark);
  border-right-color: var(--sc-color-purple-300-dark);
}

.border-x-purple-350 {
  border-left-color: var(--sc-color-purple-350);
  border-right-color: var(--sc-color-purple-350);
}

.border-x-purple-350-dark {
  border-left-color: var(--sc-color-purple-350-dark);
  border-right-color: var(--sc-color-purple-350-dark);
}

.border-x-purple-400 {
  border-left-color: var(--sc-color-purple-400);
  border-right-color: var(--sc-color-purple-400);
}

.border-x-purple-400-dark {
  border-left-color: var(--sc-color-purple-400-dark);
  border-right-color: var(--sc-color-purple-400-dark);
}

.border-x-purple-450 {
  border-left-color: var(--sc-color-purple-450);
  border-right-color: var(--sc-color-purple-450);
}

.border-x-purple-450-dark {
  border-left-color: var(--sc-color-purple-450-dark);
  border-right-color: var(--sc-color-purple-450-dark);
}

.border-x-purple-50 {
  border-left-color: var(--sc-color-purple-50);
  border-right-color: var(--sc-color-purple-50);
}

.border-x-purple-50-dark {
  border-left-color: var(--sc-color-purple-50-dark);
  border-right-color: var(--sc-color-purple-50-dark);
}

.border-x-purple-500 {
  border-left-color: var(--sc-color-purple-500);
  border-right-color: var(--sc-color-purple-500);
}

.border-x-purple-500-dark {
  border-left-color: var(--sc-color-purple-500-dark);
  border-right-color: var(--sc-color-purple-500-dark);
}

.border-x-purple-550 {
  border-left-color: var(--sc-color-purple-550);
  border-right-color: var(--sc-color-purple-550);
}

.border-x-purple-550-dark {
  border-left-color: var(--sc-color-purple-550-dark);
  border-right-color: var(--sc-color-purple-550-dark);
}

.border-x-purple-600 {
  border-left-color: var(--sc-color-purple-600);
  border-right-color: var(--sc-color-purple-600);
}

.border-x-purple-600-dark {
  border-left-color: var(--sc-color-purple-600-dark);
  border-right-color: var(--sc-color-purple-600-dark);
}

.border-x-purple-650 {
  border-left-color: var(--sc-color-purple-650);
  border-right-color: var(--sc-color-purple-650);
}

.border-x-purple-650-dark {
  border-left-color: var(--sc-color-purple-650-dark);
  border-right-color: var(--sc-color-purple-650-dark);
}

.border-x-purple-700 {
  border-left-color: var(--sc-color-purple-700);
  border-right-color: var(--sc-color-purple-700);
}

.border-x-purple-700-dark {
  border-left-color: var(--sc-color-purple-700-dark);
  border-right-color: var(--sc-color-purple-700-dark);
}

.border-x-purple-750 {
  border-left-color: var(--sc-color-purple-750);
  border-right-color: var(--sc-color-purple-750);
}

.border-x-purple-750-dark {
  border-left-color: var(--sc-color-purple-750-dark);
  border-right-color: var(--sc-color-purple-750-dark);
}

.border-x-purple-800 {
  border-left-color: var(--sc-color-purple-800);
  border-right-color: var(--sc-color-purple-800);
}

.border-x-purple-800-dark {
  border-left-color: var(--sc-color-purple-800-dark);
  border-right-color: var(--sc-color-purple-800-dark);
}

.border-x-purple-850 {
  border-left-color: var(--sc-color-purple-850);
  border-right-color: var(--sc-color-purple-850);
}

.border-x-purple-850-dark {
  border-left-color: var(--sc-color-purple-850-dark);
  border-right-color: var(--sc-color-purple-850-dark);
}

.border-x-purple-900 {
  border-left-color: var(--sc-color-purple-900);
  border-right-color: var(--sc-color-purple-900);
}

.border-x-purple-900-dark {
  border-left-color: var(--sc-color-purple-900-dark);
  border-right-color: var(--sc-color-purple-900-dark);
}

.border-x-purple-950 {
  border-left-color: var(--sc-color-purple-950);
  border-right-color: var(--sc-color-purple-950);
}

.border-x-purple-950-dark {
  border-left-color: var(--sc-color-purple-950-dark);
  border-right-color: var(--sc-color-purple-950-dark);
}

.border-x-red-100 {
  border-left-color: var(--sc-color-red-100);
  border-right-color: var(--sc-color-red-100);
}

.border-x-red-100-dark {
  border-left-color: var(--sc-color-red-100-dark);
  border-right-color: var(--sc-color-red-100-dark);
}

.border-x-red-150 {
  border-left-color: var(--sc-color-red-150);
  border-right-color: var(--sc-color-red-150);
}

.border-x-red-150-dark {
  border-left-color: var(--sc-color-red-150-dark);
  border-right-color: var(--sc-color-red-150-dark);
}

.border-x-red-200 {
  border-left-color: var(--sc-color-red-200);
  border-right-color: var(--sc-color-red-200);
}

.border-x-red-200-dark {
  border-left-color: var(--sc-color-red-200-dark);
  border-right-color: var(--sc-color-red-200-dark);
}

.border-x-red-250 {
  border-left-color: var(--sc-color-red-250);
  border-right-color: var(--sc-color-red-250);
}

.border-x-red-250-dark {
  border-left-color: var(--sc-color-red-250-dark);
  border-right-color: var(--sc-color-red-250-dark);
}

.border-x-red-300 {
  border-left-color: var(--sc-color-red-300);
  border-right-color: var(--sc-color-red-300);
}

.border-x-red-300-dark {
  border-left-color: var(--sc-color-red-300-dark);
  border-right-color: var(--sc-color-red-300-dark);
}

.border-x-red-350 {
  border-left-color: var(--sc-color-red-350);
  border-right-color: var(--sc-color-red-350);
}

.border-x-red-350-dark {
  border-left-color: var(--sc-color-red-350-dark);
  border-right-color: var(--sc-color-red-350-dark);
}

.border-x-red-400 {
  border-left-color: var(--sc-color-red-400);
  border-right-color: var(--sc-color-red-400);
}

.border-x-red-400-dark {
  border-left-color: var(--sc-color-red-400-dark);
  border-right-color: var(--sc-color-red-400-dark);
}

.border-x-red-450 {
  border-left-color: var(--sc-color-red-450);
  border-right-color: var(--sc-color-red-450);
}

.border-x-red-450-dark {
  border-left-color: var(--sc-color-red-450-dark);
  border-right-color: var(--sc-color-red-450-dark);
}

.border-x-red-50 {
  border-left-color: var(--sc-color-red-50);
  border-right-color: var(--sc-color-red-50);
}

.border-x-red-50-dark {
  border-left-color: var(--sc-color-red-50-dark);
  border-right-color: var(--sc-color-red-50-dark);
}

.border-x-red-500 {
  border-left-color: var(--sc-color-red-500);
  border-right-color: var(--sc-color-red-500);
}

.border-x-red-500-dark {
  border-left-color: var(--sc-color-red-500-dark);
  border-right-color: var(--sc-color-red-500-dark);
}

.border-x-red-550 {
  border-left-color: var(--sc-color-red-550);
  border-right-color: var(--sc-color-red-550);
}

.border-x-red-550-dark {
  border-left-color: var(--sc-color-red-550-dark);
  border-right-color: var(--sc-color-red-550-dark);
}

.border-x-red-600 {
  border-left-color: var(--sc-color-red-600);
  border-right-color: var(--sc-color-red-600);
}

.border-x-red-600-dark {
  border-left-color: var(--sc-color-red-600-dark);
  border-right-color: var(--sc-color-red-600-dark);
}

.border-x-red-650 {
  border-left-color: var(--sc-color-red-650);
  border-right-color: var(--sc-color-red-650);
}

.border-x-red-650-dark {
  border-left-color: var(--sc-color-red-650-dark);
  border-right-color: var(--sc-color-red-650-dark);
}

.border-x-red-700 {
  border-left-color: var(--sc-color-red-700);
  border-right-color: var(--sc-color-red-700);
}

.border-x-red-700-dark {
  border-left-color: var(--sc-color-red-700-dark);
  border-right-color: var(--sc-color-red-700-dark);
}

.border-x-red-750 {
  border-left-color: var(--sc-color-red-750);
  border-right-color: var(--sc-color-red-750);
}

.border-x-red-750-dark {
  border-left-color: var(--sc-color-red-750-dark);
  border-right-color: var(--sc-color-red-750-dark);
}

.border-x-red-800 {
  border-left-color: var(--sc-color-red-800);
  border-right-color: var(--sc-color-red-800);
}

.border-x-red-800-dark {
  border-left-color: var(--sc-color-red-800-dark);
  border-right-color: var(--sc-color-red-800-dark);
}

.border-x-red-850 {
  border-left-color: var(--sc-color-red-850);
  border-right-color: var(--sc-color-red-850);
}

.border-x-red-850-dark {
  border-left-color: var(--sc-color-red-850-dark);
  border-right-color: var(--sc-color-red-850-dark);
}

.border-x-red-900 {
  border-left-color: var(--sc-color-red-900);
  border-right-color: var(--sc-color-red-900);
}

.border-x-red-900-dark {
  border-left-color: var(--sc-color-red-900-dark);
  border-right-color: var(--sc-color-red-900-dark);
}

.border-x-red-950 {
  border-left-color: var(--sc-color-red-950);
  border-right-color: var(--sc-color-red-950);
}

.border-x-red-950-dark {
  border-left-color: var(--sc-color-red-950-dark);
  border-right-color: var(--sc-color-red-950-dark);
}

.border-x-teal-100 {
  border-left-color: var(--sc-color-teal-100);
  border-right-color: var(--sc-color-teal-100);
}

.border-x-teal-500 {
  border-left-color: var(--sc-color-teal-500);
  border-right-color: var(--sc-color-teal-500);
}

.border-x-transparent {
  border-left-color: transparent;
  border-right-color: transparent;
}

.border-x-transparent\/0 {
  border-left-color: rgb(0 0 0 / 0);
  border-right-color: rgb(0 0 0 / 0);
}

.border-x-transparent\/10 {
  border-left-color: rgb(0 0 0 / 0.1);
  border-right-color: rgb(0 0 0 / 0.1);
}

.border-x-transparent\/100 {
  border-left-color: rgb(0 0 0 / 1);
  border-right-color: rgb(0 0 0 / 1);
}

.border-x-transparent\/15 {
  border-left-color: rgb(0 0 0 / 0.15);
  border-right-color: rgb(0 0 0 / 0.15);
}

.border-x-transparent\/20 {
  border-left-color: rgb(0 0 0 / 0.2);
  border-right-color: rgb(0 0 0 / 0.2);
}

.border-x-transparent\/25 {
  border-left-color: rgb(0 0 0 / 0.25);
  border-right-color: rgb(0 0 0 / 0.25);
}

.border-x-transparent\/30 {
  border-left-color: rgb(0 0 0 / 0.3);
  border-right-color: rgb(0 0 0 / 0.3);
}

.border-x-transparent\/35 {
  border-left-color: rgb(0 0 0 / 0.35);
  border-right-color: rgb(0 0 0 / 0.35);
}

.border-x-transparent\/40 {
  border-left-color: rgb(0 0 0 / 0.4);
  border-right-color: rgb(0 0 0 / 0.4);
}

.border-x-transparent\/45 {
  border-left-color: rgb(0 0 0 / 0.45);
  border-right-color: rgb(0 0 0 / 0.45);
}

.border-x-transparent\/5 {
  border-left-color: rgb(0 0 0 / 0.05);
  border-right-color: rgb(0 0 0 / 0.05);
}

.border-x-transparent\/50 {
  border-left-color: rgb(0 0 0 / 0.5);
  border-right-color: rgb(0 0 0 / 0.5);
}

.border-x-transparent\/55 {
  border-left-color: rgb(0 0 0 / 0.55);
  border-right-color: rgb(0 0 0 / 0.55);
}

.border-x-transparent\/60 {
  border-left-color: rgb(0 0 0 / 0.6);
  border-right-color: rgb(0 0 0 / 0.6);
}

.border-x-transparent\/65 {
  border-left-color: rgb(0 0 0 / 0.65);
  border-right-color: rgb(0 0 0 / 0.65);
}

.border-x-transparent\/70 {
  border-left-color: rgb(0 0 0 / 0.7);
  border-right-color: rgb(0 0 0 / 0.7);
}

.border-x-transparent\/75 {
  border-left-color: rgb(0 0 0 / 0.75);
  border-right-color: rgb(0 0 0 / 0.75);
}

.border-x-transparent\/80 {
  border-left-color: rgb(0 0 0 / 0.8);
  border-right-color: rgb(0 0 0 / 0.8);
}

.border-x-transparent\/85 {
  border-left-color: rgb(0 0 0 / 0.85);
  border-right-color: rgb(0 0 0 / 0.85);
}

.border-x-transparent\/90 {
  border-left-color: rgb(0 0 0 / 0.9);
  border-right-color: rgb(0 0 0 / 0.9);
}

.border-x-transparent\/95 {
  border-left-color: rgb(0 0 0 / 0.95);
  border-right-color: rgb(0 0 0 / 0.95);
}

.border-x-white {
  border-left-color: var(--sc-color-white);
  border-right-color: var(--sc-color-white);
}

.border-y-amber-100 {
  border-top-color: var(--sc-color-amber-100);
  border-bottom-color: var(--sc-color-amber-100);
}

.border-y-amber-100-dark {
  border-top-color: var(--sc-color-amber-100-dark);
  border-bottom-color: var(--sc-color-amber-100-dark);
}

.border-y-amber-150 {
  border-top-color: var(--sc-color-amber-150);
  border-bottom-color: var(--sc-color-amber-150);
}

.border-y-amber-150-dark {
  border-top-color: var(--sc-color-amber-150-dark);
  border-bottom-color: var(--sc-color-amber-150-dark);
}

.border-y-amber-200 {
  border-top-color: var(--sc-color-amber-200);
  border-bottom-color: var(--sc-color-amber-200);
}

.border-y-amber-200-dark {
  border-top-color: var(--sc-color-amber-200-dark);
  border-bottom-color: var(--sc-color-amber-200-dark);
}

.border-y-amber-250 {
  border-top-color: var(--sc-color-amber-250);
  border-bottom-color: var(--sc-color-amber-250);
}

.border-y-amber-250-dark {
  border-top-color: var(--sc-color-amber-250-dark);
  border-bottom-color: var(--sc-color-amber-250-dark);
}

.border-y-amber-300 {
  border-top-color: var(--sc-color-amber-300);
  border-bottom-color: var(--sc-color-amber-300);
}

.border-y-amber-300-dark {
  border-top-color: var(--sc-color-amber-300-dark);
  border-bottom-color: var(--sc-color-amber-300-dark);
}

.border-y-amber-350 {
  border-top-color: var(--sc-color-amber-350);
  border-bottom-color: var(--sc-color-amber-350);
}

.border-y-amber-350-dark {
  border-top-color: var(--sc-color-amber-350-dark);
  border-bottom-color: var(--sc-color-amber-350-dark);
}

.border-y-amber-400 {
  border-top-color: var(--sc-color-amber-400);
  border-bottom-color: var(--sc-color-amber-400);
}

.border-y-amber-400-dark {
  border-top-color: var(--sc-color-amber-400-dark);
  border-bottom-color: var(--sc-color-amber-400-dark);
}

.border-y-amber-450 {
  border-top-color: var(--sc-color-amber-450);
  border-bottom-color: var(--sc-color-amber-450);
}

.border-y-amber-450-dark {
  border-top-color: var(--sc-color-amber-450-dark);
  border-bottom-color: var(--sc-color-amber-450-dark);
}

.border-y-amber-50 {
  border-top-color: var(--sc-color-amber-50);
  border-bottom-color: var(--sc-color-amber-50);
}

.border-y-amber-50-dark {
  border-top-color: var(--sc-color-amber-50-dark);
  border-bottom-color: var(--sc-color-amber-50-dark);
}

.border-y-amber-500 {
  border-top-color: var(--sc-color-amber-500);
  border-bottom-color: var(--sc-color-amber-500);
}

.border-y-amber-500-dark {
  border-top-color: var(--sc-color-amber-500-dark);
  border-bottom-color: var(--sc-color-amber-500-dark);
}

.border-y-amber-550 {
  border-top-color: var(--sc-color-amber-550);
  border-bottom-color: var(--sc-color-amber-550);
}

.border-y-amber-550-dark {
  border-top-color: var(--sc-color-amber-550-dark);
  border-bottom-color: var(--sc-color-amber-550-dark);
}

.border-y-amber-600 {
  border-top-color: var(--sc-color-amber-600);
  border-bottom-color: var(--sc-color-amber-600);
}

.border-y-amber-600-dark {
  border-top-color: var(--sc-color-amber-600-dark);
  border-bottom-color: var(--sc-color-amber-600-dark);
}

.border-y-amber-650 {
  border-top-color: var(--sc-color-amber-650);
  border-bottom-color: var(--sc-color-amber-650);
}

.border-y-amber-650-dark {
  border-top-color: var(--sc-color-amber-650-dark);
  border-bottom-color: var(--sc-color-amber-650-dark);
}

.border-y-amber-700 {
  border-top-color: var(--sc-color-amber-700);
  border-bottom-color: var(--sc-color-amber-700);
}

.border-y-amber-700-dark {
  border-top-color: var(--sc-color-amber-700-dark);
  border-bottom-color: var(--sc-color-amber-700-dark);
}

.border-y-amber-750 {
  border-top-color: var(--sc-color-amber-750);
  border-bottom-color: var(--sc-color-amber-750);
}

.border-y-amber-750-dark {
  border-top-color: var(--sc-color-amber-750-dark);
  border-bottom-color: var(--sc-color-amber-750-dark);
}

.border-y-amber-800 {
  border-top-color: var(--sc-color-amber-800);
  border-bottom-color: var(--sc-color-amber-800);
}

.border-y-amber-800-dark {
  border-top-color: var(--sc-color-amber-800-dark);
  border-bottom-color: var(--sc-color-amber-800-dark);
}

.border-y-amber-850 {
  border-top-color: var(--sc-color-amber-850);
  border-bottom-color: var(--sc-color-amber-850);
}

.border-y-amber-850-dark {
  border-top-color: var(--sc-color-amber-850-dark);
  border-bottom-color: var(--sc-color-amber-850-dark);
}

.border-y-amber-900 {
  border-top-color: var(--sc-color-amber-900);
  border-bottom-color: var(--sc-color-amber-900);
}

.border-y-amber-900-dark {
  border-top-color: var(--sc-color-amber-900-dark);
  border-bottom-color: var(--sc-color-amber-900-dark);
}

.border-y-amber-950 {
  border-top-color: var(--sc-color-amber-950);
  border-bottom-color: var(--sc-color-amber-950);
}

.border-y-amber-950-dark {
  border-top-color: var(--sc-color-amber-950-dark);
  border-bottom-color: var(--sc-color-amber-950-dark);
}

.border-y-blue-100 {
  border-top-color: var(--sc-color-blue-100);
  border-bottom-color: var(--sc-color-blue-100);
}

.border-y-blue-100-dark {
  border-top-color: var(--sc-color-blue-100-dark);
  border-bottom-color: var(--sc-color-blue-100-dark);
}

.border-y-blue-150 {
  border-top-color: var(--sc-color-blue-150);
  border-bottom-color: var(--sc-color-blue-150);
}

.border-y-blue-150-dark {
  border-top-color: var(--sc-color-blue-150-dark);
  border-bottom-color: var(--sc-color-blue-150-dark);
}

.border-y-blue-200 {
  border-top-color: var(--sc-color-blue-200);
  border-bottom-color: var(--sc-color-blue-200);
}

.border-y-blue-200-dark {
  border-top-color: var(--sc-color-blue-200-dark);
  border-bottom-color: var(--sc-color-blue-200-dark);
}

.border-y-blue-250 {
  border-top-color: var(--sc-color-blue-250);
  border-bottom-color: var(--sc-color-blue-250);
}

.border-y-blue-250-dark {
  border-top-color: var(--sc-color-blue-250-dark);
  border-bottom-color: var(--sc-color-blue-250-dark);
}

.border-y-blue-300 {
  border-top-color: var(--sc-color-blue-300);
  border-bottom-color: var(--sc-color-blue-300);
}

.border-y-blue-300-dark {
  border-top-color: var(--sc-color-blue-300-dark);
  border-bottom-color: var(--sc-color-blue-300-dark);
}

.border-y-blue-350 {
  border-top-color: var(--sc-color-blue-350);
  border-bottom-color: var(--sc-color-blue-350);
}

.border-y-blue-350-dark {
  border-top-color: var(--sc-color-blue-350-dark);
  border-bottom-color: var(--sc-color-blue-350-dark);
}

.border-y-blue-400 {
  border-top-color: var(--sc-color-blue-400);
  border-bottom-color: var(--sc-color-blue-400);
}

.border-y-blue-400-dark {
  border-top-color: var(--sc-color-blue-400-dark);
  border-bottom-color: var(--sc-color-blue-400-dark);
}

.border-y-blue-450 {
  border-top-color: var(--sc-color-blue-450);
  border-bottom-color: var(--sc-color-blue-450);
}

.border-y-blue-450-dark {
  border-top-color: var(--sc-color-blue-450-dark);
  border-bottom-color: var(--sc-color-blue-450-dark);
}

.border-y-blue-50 {
  border-top-color: var(--sc-color-blue-50);
  border-bottom-color: var(--sc-color-blue-50);
}

.border-y-blue-50-dark {
  border-top-color: var(--sc-color-blue-50-dark);
  border-bottom-color: var(--sc-color-blue-50-dark);
}

.border-y-blue-500 {
  border-top-color: var(--sc-color-blue-500);
  border-bottom-color: var(--sc-color-blue-500);
}

.border-y-blue-500-dark {
  border-top-color: var(--sc-color-blue-500-dark);
  border-bottom-color: var(--sc-color-blue-500-dark);
}

.border-y-blue-550 {
  border-top-color: var(--sc-color-blue-550);
  border-bottom-color: var(--sc-color-blue-550);
}

.border-y-blue-550-dark {
  border-top-color: var(--sc-color-blue-550-dark);
  border-bottom-color: var(--sc-color-blue-550-dark);
}

.border-y-blue-600 {
  border-top-color: var(--sc-color-blue-600);
  border-bottom-color: var(--sc-color-blue-600);
}

.border-y-blue-600-dark {
  border-top-color: var(--sc-color-blue-600-dark);
  border-bottom-color: var(--sc-color-blue-600-dark);
}

.border-y-blue-650 {
  border-top-color: var(--sc-color-blue-650);
  border-bottom-color: var(--sc-color-blue-650);
}

.border-y-blue-650-dark {
  border-top-color: var(--sc-color-blue-650-dark);
  border-bottom-color: var(--sc-color-blue-650-dark);
}

.border-y-blue-700 {
  border-top-color: var(--sc-color-blue-700);
  border-bottom-color: var(--sc-color-blue-700);
}

.border-y-blue-700-dark {
  border-top-color: var(--sc-color-blue-700-dark);
  border-bottom-color: var(--sc-color-blue-700-dark);
}

.border-y-blue-750 {
  border-top-color: var(--sc-color-blue-750);
  border-bottom-color: var(--sc-color-blue-750);
}

.border-y-blue-750-dark {
  border-top-color: var(--sc-color-blue-750-dark);
  border-bottom-color: var(--sc-color-blue-750-dark);
}

.border-y-blue-800 {
  border-top-color: var(--sc-color-blue-800);
  border-bottom-color: var(--sc-color-blue-800);
}

.border-y-blue-800-dark {
  border-top-color: var(--sc-color-blue-800-dark);
  border-bottom-color: var(--sc-color-blue-800-dark);
}

.border-y-blue-850 {
  border-top-color: var(--sc-color-blue-850);
  border-bottom-color: var(--sc-color-blue-850);
}

.border-y-blue-850-dark {
  border-top-color: var(--sc-color-blue-850-dark);
  border-bottom-color: var(--sc-color-blue-850-dark);
}

.border-y-blue-900 {
  border-top-color: var(--sc-color-blue-900);
  border-bottom-color: var(--sc-color-blue-900);
}

.border-y-blue-900-dark {
  border-top-color: var(--sc-color-blue-900-dark);
  border-bottom-color: var(--sc-color-blue-900-dark);
}

.border-y-blue-950 {
  border-top-color: var(--sc-color-blue-950);
  border-bottom-color: var(--sc-color-blue-950);
}

.border-y-blue-950-dark {
  border-top-color: var(--sc-color-blue-950-dark);
  border-bottom-color: var(--sc-color-blue-950-dark);
}

.border-y-current {
  border-top-color: currentColor;
  border-bottom-color: currentColor;
}

.border-y-green-100 {
  border-top-color: var(--sc-color-green-100);
  border-bottom-color: var(--sc-color-green-100);
}

.border-y-green-100-dark {
  border-top-color: var(--sc-color-green-100-dark);
  border-bottom-color: var(--sc-color-green-100-dark);
}

.border-y-green-150 {
  border-top-color: var(--sc-color-green-150);
  border-bottom-color: var(--sc-color-green-150);
}

.border-y-green-150-dark {
  border-top-color: var(--sc-color-green-150-dark);
  border-bottom-color: var(--sc-color-green-150-dark);
}

.border-y-green-200 {
  border-top-color: var(--sc-color-green-200);
  border-bottom-color: var(--sc-color-green-200);
}

.border-y-green-200-dark {
  border-top-color: var(--sc-color-green-200-dark);
  border-bottom-color: var(--sc-color-green-200-dark);
}

.border-y-green-250 {
  border-top-color: var(--sc-color-green-250);
  border-bottom-color: var(--sc-color-green-250);
}

.border-y-green-250-dark {
  border-top-color: var(--sc-color-green-250-dark);
  border-bottom-color: var(--sc-color-green-250-dark);
}

.border-y-green-300 {
  border-top-color: var(--sc-color-green-300);
  border-bottom-color: var(--sc-color-green-300);
}

.border-y-green-300-dark {
  border-top-color: var(--sc-color-green-300-dark);
  border-bottom-color: var(--sc-color-green-300-dark);
}

.border-y-green-350 {
  border-top-color: var(--sc-color-green-350);
  border-bottom-color: var(--sc-color-green-350);
}

.border-y-green-350-dark {
  border-top-color: var(--sc-color-green-350-dark);
  border-bottom-color: var(--sc-color-green-350-dark);
}

.border-y-green-400 {
  border-top-color: var(--sc-color-green-400);
  border-bottom-color: var(--sc-color-green-400);
}

.border-y-green-400-dark {
  border-top-color: var(--sc-color-green-400-dark);
  border-bottom-color: var(--sc-color-green-400-dark);
}

.border-y-green-450 {
  border-top-color: var(--sc-color-green-450);
  border-bottom-color: var(--sc-color-green-450);
}

.border-y-green-450-dark {
  border-top-color: var(--sc-color-green-450-dark);
  border-bottom-color: var(--sc-color-green-450-dark);
}

.border-y-green-50 {
  border-top-color: var(--sc-color-green-50);
  border-bottom-color: var(--sc-color-green-50);
}

.border-y-green-50-dark {
  border-top-color: var(--sc-color-green-50-dark);
  border-bottom-color: var(--sc-color-green-50-dark);
}

.border-y-green-500 {
  border-top-color: var(--sc-color-green-500);
  border-bottom-color: var(--sc-color-green-500);
}

.border-y-green-500-dark {
  border-top-color: var(--sc-color-green-500-dark);
  border-bottom-color: var(--sc-color-green-500-dark);
}

.border-y-green-550 {
  border-top-color: var(--sc-color-green-550);
  border-bottom-color: var(--sc-color-green-550);
}

.border-y-green-550-dark {
  border-top-color: var(--sc-color-green-550-dark);
  border-bottom-color: var(--sc-color-green-550-dark);
}

.border-y-green-600 {
  border-top-color: var(--sc-color-green-600);
  border-bottom-color: var(--sc-color-green-600);
}

.border-y-green-600-dark {
  border-top-color: var(--sc-color-green-600-dark);
  border-bottom-color: var(--sc-color-green-600-dark);
}

.border-y-green-650 {
  border-top-color: var(--sc-color-green-650);
  border-bottom-color: var(--sc-color-green-650);
}

.border-y-green-650-dark {
  border-top-color: var(--sc-color-green-650-dark);
  border-bottom-color: var(--sc-color-green-650-dark);
}

.border-y-green-700 {
  border-top-color: var(--sc-color-green-700);
  border-bottom-color: var(--sc-color-green-700);
}

.border-y-green-700-dark {
  border-top-color: var(--sc-color-green-700-dark);
  border-bottom-color: var(--sc-color-green-700-dark);
}

.border-y-green-750 {
  border-top-color: var(--sc-color-green-750);
  border-bottom-color: var(--sc-color-green-750);
}

.border-y-green-750-dark {
  border-top-color: var(--sc-color-green-750-dark);
  border-bottom-color: var(--sc-color-green-750-dark);
}

.border-y-green-800 {
  border-top-color: var(--sc-color-green-800);
  border-bottom-color: var(--sc-color-green-800);
}

.border-y-green-800-dark {
  border-top-color: var(--sc-color-green-800-dark);
  border-bottom-color: var(--sc-color-green-800-dark);
}

.border-y-green-850 {
  border-top-color: var(--sc-color-green-850);
  border-bottom-color: var(--sc-color-green-850);
}

.border-y-green-850-dark {
  border-top-color: var(--sc-color-green-850-dark);
  border-bottom-color: var(--sc-color-green-850-dark);
}

.border-y-green-900 {
  border-top-color: var(--sc-color-green-900);
  border-bottom-color: var(--sc-color-green-900);
}

.border-y-green-900-dark {
  border-top-color: var(--sc-color-green-900-dark);
  border-bottom-color: var(--sc-color-green-900-dark);
}

.border-y-green-950 {
  border-top-color: var(--sc-color-green-950);
  border-bottom-color: var(--sc-color-green-950);
}

.border-y-green-950-dark {
  border-top-color: var(--sc-color-green-950-dark);
  border-bottom-color: var(--sc-color-green-950-dark);
}

.border-y-grey-100 {
  border-top-color: var(--sc-color-grey-100);
  border-bottom-color: var(--sc-color-grey-100);
}

.border-y-grey-100-dark {
  border-top-color: var(--sc-color-grey-100-dark);
  border-bottom-color: var(--sc-color-grey-100-dark);
}

.border-y-grey-150 {
  border-top-color: var(--sc-color-grey-150);
  border-bottom-color: var(--sc-color-grey-150);
}

.border-y-grey-150-dark {
  border-top-color: var(--sc-color-grey-150-dark);
  border-bottom-color: var(--sc-color-grey-150-dark);
}

.border-y-grey-200 {
  border-top-color: var(--sc-color-grey-200);
  border-bottom-color: var(--sc-color-grey-200);
}

.border-y-grey-200-dark {
  border-top-color: var(--sc-color-grey-200-dark);
  border-bottom-color: var(--sc-color-grey-200-dark);
}

.border-y-grey-250 {
  border-top-color: var(--sc-color-grey-250);
  border-bottom-color: var(--sc-color-grey-250);
}

.border-y-grey-250-dark {
  border-top-color: var(--sc-color-grey-250-dark);
  border-bottom-color: var(--sc-color-grey-250-dark);
}

.border-y-grey-300 {
  border-top-color: var(--sc-color-grey-300);
  border-bottom-color: var(--sc-color-grey-300);
}

.border-y-grey-300-dark {
  border-top-color: var(--sc-color-grey-300-dark);
  border-bottom-color: var(--sc-color-grey-300-dark);
}

.border-y-grey-350 {
  border-top-color: var(--sc-color-grey-350);
  border-bottom-color: var(--sc-color-grey-350);
}

.border-y-grey-350-dark {
  border-top-color: var(--sc-color-grey-350-dark);
  border-bottom-color: var(--sc-color-grey-350-dark);
}

.border-y-grey-400 {
  border-top-color: var(--sc-color-grey-400);
  border-bottom-color: var(--sc-color-grey-400);
}

.border-y-grey-400-dark {
  border-top-color: var(--sc-color-grey-400-dark);
  border-bottom-color: var(--sc-color-grey-400-dark);
}

.border-y-grey-450 {
  border-top-color: var(--sc-color-grey-450);
  border-bottom-color: var(--sc-color-grey-450);
}

.border-y-grey-450-dark {
  border-top-color: var(--sc-color-grey-450-dark);
  border-bottom-color: var(--sc-color-grey-450-dark);
}

.border-y-grey-50 {
  border-top-color: var(--sc-color-grey-50);
  border-bottom-color: var(--sc-color-grey-50);
}

.border-y-grey-50-dark {
  border-top-color: var(--sc-color-grey-50-dark);
  border-bottom-color: var(--sc-color-grey-50-dark);
}

.border-y-grey-500 {
  border-top-color: var(--sc-color-grey-500);
  border-bottom-color: var(--sc-color-grey-500);
}

.border-y-grey-500-dark {
  border-top-color: var(--sc-color-grey-500-dark);
  border-bottom-color: var(--sc-color-grey-500-dark);
}

.border-y-grey-550 {
  border-top-color: var(--sc-color-grey-550);
  border-bottom-color: var(--sc-color-grey-550);
}

.border-y-grey-550-dark {
  border-top-color: var(--sc-color-grey-550-dark);
  border-bottom-color: var(--sc-color-grey-550-dark);
}

.border-y-grey-600 {
  border-top-color: var(--sc-color-grey-600);
  border-bottom-color: var(--sc-color-grey-600);
}

.border-y-grey-600-dark {
  border-top-color: var(--sc-color-grey-600-dark);
  border-bottom-color: var(--sc-color-grey-600-dark);
}

.border-y-grey-650 {
  border-top-color: var(--sc-color-grey-650);
  border-bottom-color: var(--sc-color-grey-650);
}

.border-y-grey-650-dark {
  border-top-color: var(--sc-color-grey-650-dark);
  border-bottom-color: var(--sc-color-grey-650-dark);
}

.border-y-grey-700 {
  border-top-color: var(--sc-color-grey-700);
  border-bottom-color: var(--sc-color-grey-700);
}

.border-y-grey-700-dark {
  border-top-color: var(--sc-color-grey-700-dark);
  border-bottom-color: var(--sc-color-grey-700-dark);
}

.border-y-grey-750 {
  border-top-color: var(--sc-color-grey-750);
  border-bottom-color: var(--sc-color-grey-750);
}

.border-y-grey-750-dark {
  border-top-color: var(--sc-color-grey-750-dark);
  border-bottom-color: var(--sc-color-grey-750-dark);
}

.border-y-grey-800 {
  border-top-color: var(--sc-color-grey-800);
  border-bottom-color: var(--sc-color-grey-800);
}

.border-y-grey-800-dark {
  border-top-color: var(--sc-color-grey-800-dark);
  border-bottom-color: var(--sc-color-grey-800-dark);
}

.border-y-grey-850 {
  border-top-color: var(--sc-color-grey-850);
  border-bottom-color: var(--sc-color-grey-850);
}

.border-y-grey-850-dark {
  border-top-color: var(--sc-color-grey-850-dark);
  border-bottom-color: var(--sc-color-grey-850-dark);
}

.border-y-grey-900 {
  border-top-color: var(--sc-color-grey-900);
  border-bottom-color: var(--sc-color-grey-900);
}

.border-y-grey-900-dark {
  border-top-color: var(--sc-color-grey-900-dark);
  border-bottom-color: var(--sc-color-grey-900-dark);
}

.border-y-grey-950 {
  border-top-color: var(--sc-color-grey-950);
  border-bottom-color: var(--sc-color-grey-950);
}

.border-y-grey-950-dark {
  border-top-color: var(--sc-color-grey-950-dark);
  border-bottom-color: var(--sc-color-grey-950-dark);
}

.border-y-grey-black {
  border-top-color: var(--sc-color-black);
  border-bottom-color: var(--sc-color-black);
}

.border-y-muted {
  border-top-color: var(--sc-color-blue-900);
  border-bottom-color: var(--sc-color-blue-900);
}

.border-y-orange-500 {
  border-top-color: var(--sc-color-orange-500);
  border-bottom-color: var(--sc-color-orange-500);
}

.border-y-primary {
  border-top-color: var(--sc-color-blue);
  border-bottom-color: var(--sc-color-blue);
}

.border-y-purple-100 {
  border-top-color: var(--sc-color-purple-100);
  border-bottom-color: var(--sc-color-purple-100);
}

.border-y-purple-100-dark {
  border-top-color: var(--sc-color-purple-100-dark);
  border-bottom-color: var(--sc-color-purple-100-dark);
}

.border-y-purple-150 {
  border-top-color: var(--sc-color-purple-150);
  border-bottom-color: var(--sc-color-purple-150);
}

.border-y-purple-150-dark {
  border-top-color: var(--sc-color-purple-150-dark);
  border-bottom-color: var(--sc-color-purple-150-dark);
}

.border-y-purple-200 {
  border-top-color: var(--sc-color-purple-200);
  border-bottom-color: var(--sc-color-purple-200);
}

.border-y-purple-200-dark {
  border-top-color: var(--sc-color-purple-200-dark);
  border-bottom-color: var(--sc-color-purple-200-dark);
}

.border-y-purple-250 {
  border-top-color: var(--sc-color-purple-250);
  border-bottom-color: var(--sc-color-purple-250);
}

.border-y-purple-250-dark {
  border-top-color: var(--sc-color-purple-250-dark);
  border-bottom-color: var(--sc-color-purple-250-dark);
}

.border-y-purple-300 {
  border-top-color: var(--sc-color-purple-300);
  border-bottom-color: var(--sc-color-purple-300);
}

.border-y-purple-300-dark {
  border-top-color: var(--sc-color-purple-300-dark);
  border-bottom-color: var(--sc-color-purple-300-dark);
}

.border-y-purple-350 {
  border-top-color: var(--sc-color-purple-350);
  border-bottom-color: var(--sc-color-purple-350);
}

.border-y-purple-350-dark {
  border-top-color: var(--sc-color-purple-350-dark);
  border-bottom-color: var(--sc-color-purple-350-dark);
}

.border-y-purple-400 {
  border-top-color: var(--sc-color-purple-400);
  border-bottom-color: var(--sc-color-purple-400);
}

.border-y-purple-400-dark {
  border-top-color: var(--sc-color-purple-400-dark);
  border-bottom-color: var(--sc-color-purple-400-dark);
}

.border-y-purple-450 {
  border-top-color: var(--sc-color-purple-450);
  border-bottom-color: var(--sc-color-purple-450);
}

.border-y-purple-450-dark {
  border-top-color: var(--sc-color-purple-450-dark);
  border-bottom-color: var(--sc-color-purple-450-dark);
}

.border-y-purple-50 {
  border-top-color: var(--sc-color-purple-50);
  border-bottom-color: var(--sc-color-purple-50);
}

.border-y-purple-50-dark {
  border-top-color: var(--sc-color-purple-50-dark);
  border-bottom-color: var(--sc-color-purple-50-dark);
}

.border-y-purple-500 {
  border-top-color: var(--sc-color-purple-500);
  border-bottom-color: var(--sc-color-purple-500);
}

.border-y-purple-500-dark {
  border-top-color: var(--sc-color-purple-500-dark);
  border-bottom-color: var(--sc-color-purple-500-dark);
}

.border-y-purple-550 {
  border-top-color: var(--sc-color-purple-550);
  border-bottom-color: var(--sc-color-purple-550);
}

.border-y-purple-550-dark {
  border-top-color: var(--sc-color-purple-550-dark);
  border-bottom-color: var(--sc-color-purple-550-dark);
}

.border-y-purple-600 {
  border-top-color: var(--sc-color-purple-600);
  border-bottom-color: var(--sc-color-purple-600);
}

.border-y-purple-600-dark {
  border-top-color: var(--sc-color-purple-600-dark);
  border-bottom-color: var(--sc-color-purple-600-dark);
}

.border-y-purple-650 {
  border-top-color: var(--sc-color-purple-650);
  border-bottom-color: var(--sc-color-purple-650);
}

.border-y-purple-650-dark {
  border-top-color: var(--sc-color-purple-650-dark);
  border-bottom-color: var(--sc-color-purple-650-dark);
}

.border-y-purple-700 {
  border-top-color: var(--sc-color-purple-700);
  border-bottom-color: var(--sc-color-purple-700);
}

.border-y-purple-700-dark {
  border-top-color: var(--sc-color-purple-700-dark);
  border-bottom-color: var(--sc-color-purple-700-dark);
}

.border-y-purple-750 {
  border-top-color: var(--sc-color-purple-750);
  border-bottom-color: var(--sc-color-purple-750);
}

.border-y-purple-750-dark {
  border-top-color: var(--sc-color-purple-750-dark);
  border-bottom-color: var(--sc-color-purple-750-dark);
}

.border-y-purple-800 {
  border-top-color: var(--sc-color-purple-800);
  border-bottom-color: var(--sc-color-purple-800);
}

.border-y-purple-800-dark {
  border-top-color: var(--sc-color-purple-800-dark);
  border-bottom-color: var(--sc-color-purple-800-dark);
}

.border-y-purple-850 {
  border-top-color: var(--sc-color-purple-850);
  border-bottom-color: var(--sc-color-purple-850);
}

.border-y-purple-850-dark {
  border-top-color: var(--sc-color-purple-850-dark);
  border-bottom-color: var(--sc-color-purple-850-dark);
}

.border-y-purple-900 {
  border-top-color: var(--sc-color-purple-900);
  border-bottom-color: var(--sc-color-purple-900);
}

.border-y-purple-900-dark {
  border-top-color: var(--sc-color-purple-900-dark);
  border-bottom-color: var(--sc-color-purple-900-dark);
}

.border-y-purple-950 {
  border-top-color: var(--sc-color-purple-950);
  border-bottom-color: var(--sc-color-purple-950);
}

.border-y-purple-950-dark {
  border-top-color: var(--sc-color-purple-950-dark);
  border-bottom-color: var(--sc-color-purple-950-dark);
}

.border-y-red-100 {
  border-top-color: var(--sc-color-red-100);
  border-bottom-color: var(--sc-color-red-100);
}

.border-y-red-100-dark {
  border-top-color: var(--sc-color-red-100-dark);
  border-bottom-color: var(--sc-color-red-100-dark);
}

.border-y-red-150 {
  border-top-color: var(--sc-color-red-150);
  border-bottom-color: var(--sc-color-red-150);
}

.border-y-red-150-dark {
  border-top-color: var(--sc-color-red-150-dark);
  border-bottom-color: var(--sc-color-red-150-dark);
}

.border-y-red-200 {
  border-top-color: var(--sc-color-red-200);
  border-bottom-color: var(--sc-color-red-200);
}

.border-y-red-200-dark {
  border-top-color: var(--sc-color-red-200-dark);
  border-bottom-color: var(--sc-color-red-200-dark);
}

.border-y-red-250 {
  border-top-color: var(--sc-color-red-250);
  border-bottom-color: var(--sc-color-red-250);
}

.border-y-red-250-dark {
  border-top-color: var(--sc-color-red-250-dark);
  border-bottom-color: var(--sc-color-red-250-dark);
}

.border-y-red-300 {
  border-top-color: var(--sc-color-red-300);
  border-bottom-color: var(--sc-color-red-300);
}

.border-y-red-300-dark {
  border-top-color: var(--sc-color-red-300-dark);
  border-bottom-color: var(--sc-color-red-300-dark);
}

.border-y-red-350 {
  border-top-color: var(--sc-color-red-350);
  border-bottom-color: var(--sc-color-red-350);
}

.border-y-red-350-dark {
  border-top-color: var(--sc-color-red-350-dark);
  border-bottom-color: var(--sc-color-red-350-dark);
}

.border-y-red-400 {
  border-top-color: var(--sc-color-red-400);
  border-bottom-color: var(--sc-color-red-400);
}

.border-y-red-400-dark {
  border-top-color: var(--sc-color-red-400-dark);
  border-bottom-color: var(--sc-color-red-400-dark);
}

.border-y-red-450 {
  border-top-color: var(--sc-color-red-450);
  border-bottom-color: var(--sc-color-red-450);
}

.border-y-red-450-dark {
  border-top-color: var(--sc-color-red-450-dark);
  border-bottom-color: var(--sc-color-red-450-dark);
}

.border-y-red-50 {
  border-top-color: var(--sc-color-red-50);
  border-bottom-color: var(--sc-color-red-50);
}

.border-y-red-50-dark {
  border-top-color: var(--sc-color-red-50-dark);
  border-bottom-color: var(--sc-color-red-50-dark);
}

.border-y-red-500 {
  border-top-color: var(--sc-color-red-500);
  border-bottom-color: var(--sc-color-red-500);
}

.border-y-red-500-dark {
  border-top-color: var(--sc-color-red-500-dark);
  border-bottom-color: var(--sc-color-red-500-dark);
}

.border-y-red-550 {
  border-top-color: var(--sc-color-red-550);
  border-bottom-color: var(--sc-color-red-550);
}

.border-y-red-550-dark {
  border-top-color: var(--sc-color-red-550-dark);
  border-bottom-color: var(--sc-color-red-550-dark);
}

.border-y-red-600 {
  border-top-color: var(--sc-color-red-600);
  border-bottom-color: var(--sc-color-red-600);
}

.border-y-red-600-dark {
  border-top-color: var(--sc-color-red-600-dark);
  border-bottom-color: var(--sc-color-red-600-dark);
}

.border-y-red-650 {
  border-top-color: var(--sc-color-red-650);
  border-bottom-color: var(--sc-color-red-650);
}

.border-y-red-650-dark {
  border-top-color: var(--sc-color-red-650-dark);
  border-bottom-color: var(--sc-color-red-650-dark);
}

.border-y-red-700 {
  border-top-color: var(--sc-color-red-700);
  border-bottom-color: var(--sc-color-red-700);
}

.border-y-red-700-dark {
  border-top-color: var(--sc-color-red-700-dark);
  border-bottom-color: var(--sc-color-red-700-dark);
}

.border-y-red-750 {
  border-top-color: var(--sc-color-red-750);
  border-bottom-color: var(--sc-color-red-750);
}

.border-y-red-750-dark {
  border-top-color: var(--sc-color-red-750-dark);
  border-bottom-color: var(--sc-color-red-750-dark);
}

.border-y-red-800 {
  border-top-color: var(--sc-color-red-800);
  border-bottom-color: var(--sc-color-red-800);
}

.border-y-red-800-dark {
  border-top-color: var(--sc-color-red-800-dark);
  border-bottom-color: var(--sc-color-red-800-dark);
}

.border-y-red-850 {
  border-top-color: var(--sc-color-red-850);
  border-bottom-color: var(--sc-color-red-850);
}

.border-y-red-850-dark {
  border-top-color: var(--sc-color-red-850-dark);
  border-bottom-color: var(--sc-color-red-850-dark);
}

.border-y-red-900 {
  border-top-color: var(--sc-color-red-900);
  border-bottom-color: var(--sc-color-red-900);
}

.border-y-red-900-dark {
  border-top-color: var(--sc-color-red-900-dark);
  border-bottom-color: var(--sc-color-red-900-dark);
}

.border-y-red-950 {
  border-top-color: var(--sc-color-red-950);
  border-bottom-color: var(--sc-color-red-950);
}

.border-y-red-950-dark {
  border-top-color: var(--sc-color-red-950-dark);
  border-bottom-color: var(--sc-color-red-950-dark);
}

.border-y-teal-100 {
  border-top-color: var(--sc-color-teal-100);
  border-bottom-color: var(--sc-color-teal-100);
}

.border-y-teal-500 {
  border-top-color: var(--sc-color-teal-500);
  border-bottom-color: var(--sc-color-teal-500);
}

.border-y-transparent {
  border-top-color: transparent;
  border-bottom-color: transparent;
}

.border-y-transparent\/0 {
  border-top-color: rgb(0 0 0 / 0);
  border-bottom-color: rgb(0 0 0 / 0);
}

.border-y-transparent\/10 {
  border-top-color: rgb(0 0 0 / 0.1);
  border-bottom-color: rgb(0 0 0 / 0.1);
}

.border-y-transparent\/100 {
  border-top-color: rgb(0 0 0 / 1);
  border-bottom-color: rgb(0 0 0 / 1);
}

.border-y-transparent\/15 {
  border-top-color: rgb(0 0 0 / 0.15);
  border-bottom-color: rgb(0 0 0 / 0.15);
}

.border-y-transparent\/20 {
  border-top-color: rgb(0 0 0 / 0.2);
  border-bottom-color: rgb(0 0 0 / 0.2);
}

.border-y-transparent\/25 {
  border-top-color: rgb(0 0 0 / 0.25);
  border-bottom-color: rgb(0 0 0 / 0.25);
}

.border-y-transparent\/30 {
  border-top-color: rgb(0 0 0 / 0.3);
  border-bottom-color: rgb(0 0 0 / 0.3);
}

.border-y-transparent\/35 {
  border-top-color: rgb(0 0 0 / 0.35);
  border-bottom-color: rgb(0 0 0 / 0.35);
}

.border-y-transparent\/40 {
  border-top-color: rgb(0 0 0 / 0.4);
  border-bottom-color: rgb(0 0 0 / 0.4);
}

.border-y-transparent\/45 {
  border-top-color: rgb(0 0 0 / 0.45);
  border-bottom-color: rgb(0 0 0 / 0.45);
}

.border-y-transparent\/5 {
  border-top-color: rgb(0 0 0 / 0.05);
  border-bottom-color: rgb(0 0 0 / 0.05);
}

.border-y-transparent\/50 {
  border-top-color: rgb(0 0 0 / 0.5);
  border-bottom-color: rgb(0 0 0 / 0.5);
}

.border-y-transparent\/55 {
  border-top-color: rgb(0 0 0 / 0.55);
  border-bottom-color: rgb(0 0 0 / 0.55);
}

.border-y-transparent\/60 {
  border-top-color: rgb(0 0 0 / 0.6);
  border-bottom-color: rgb(0 0 0 / 0.6);
}

.border-y-transparent\/65 {
  border-top-color: rgb(0 0 0 / 0.65);
  border-bottom-color: rgb(0 0 0 / 0.65);
}

.border-y-transparent\/70 {
  border-top-color: rgb(0 0 0 / 0.7);
  border-bottom-color: rgb(0 0 0 / 0.7);
}

.border-y-transparent\/75 {
  border-top-color: rgb(0 0 0 / 0.75);
  border-bottom-color: rgb(0 0 0 / 0.75);
}

.border-y-transparent\/80 {
  border-top-color: rgb(0 0 0 / 0.8);
  border-bottom-color: rgb(0 0 0 / 0.8);
}

.border-y-transparent\/85 {
  border-top-color: rgb(0 0 0 / 0.85);
  border-bottom-color: rgb(0 0 0 / 0.85);
}

.border-y-transparent\/90 {
  border-top-color: rgb(0 0 0 / 0.9);
  border-bottom-color: rgb(0 0 0 / 0.9);
}

.border-y-transparent\/95 {
  border-top-color: rgb(0 0 0 / 0.95);
  border-bottom-color: rgb(0 0 0 / 0.95);
}

.border-y-white {
  border-top-color: var(--sc-color-white);
  border-bottom-color: var(--sc-color-white);
}

.border-b-amber-100 {
  border-bottom-color: var(--sc-color-amber-100);
}

.border-b-amber-100-dark {
  border-bottom-color: var(--sc-color-amber-100-dark);
}

.border-b-amber-150 {
  border-bottom-color: var(--sc-color-amber-150);
}

.border-b-amber-150-dark {
  border-bottom-color: var(--sc-color-amber-150-dark);
}

.border-b-amber-200 {
  border-bottom-color: var(--sc-color-amber-200);
}

.border-b-amber-200-dark {
  border-bottom-color: var(--sc-color-amber-200-dark);
}

.border-b-amber-250 {
  border-bottom-color: var(--sc-color-amber-250);
}

.border-b-amber-250-dark {
  border-bottom-color: var(--sc-color-amber-250-dark);
}

.border-b-amber-300 {
  border-bottom-color: var(--sc-color-amber-300);
}

.border-b-amber-300-dark {
  border-bottom-color: var(--sc-color-amber-300-dark);
}

.border-b-amber-350 {
  border-bottom-color: var(--sc-color-amber-350);
}

.border-b-amber-350-dark {
  border-bottom-color: var(--sc-color-amber-350-dark);
}

.border-b-amber-400 {
  border-bottom-color: var(--sc-color-amber-400);
}

.border-b-amber-400-dark {
  border-bottom-color: var(--sc-color-amber-400-dark);
}

.border-b-amber-450 {
  border-bottom-color: var(--sc-color-amber-450);
}

.border-b-amber-450-dark {
  border-bottom-color: var(--sc-color-amber-450-dark);
}

.border-b-amber-50 {
  border-bottom-color: var(--sc-color-amber-50);
}

.border-b-amber-50-dark {
  border-bottom-color: var(--sc-color-amber-50-dark);
}

.border-b-amber-500 {
  border-bottom-color: var(--sc-color-amber-500);
}

.border-b-amber-500-dark {
  border-bottom-color: var(--sc-color-amber-500-dark);
}

.border-b-amber-550 {
  border-bottom-color: var(--sc-color-amber-550);
}

.border-b-amber-550-dark {
  border-bottom-color: var(--sc-color-amber-550-dark);
}

.border-b-amber-600 {
  border-bottom-color: var(--sc-color-amber-600);
}

.border-b-amber-600-dark {
  border-bottom-color: var(--sc-color-amber-600-dark);
}

.border-b-amber-650 {
  border-bottom-color: var(--sc-color-amber-650);
}

.border-b-amber-650-dark {
  border-bottom-color: var(--sc-color-amber-650-dark);
}

.border-b-amber-700 {
  border-bottom-color: var(--sc-color-amber-700);
}

.border-b-amber-700-dark {
  border-bottom-color: var(--sc-color-amber-700-dark);
}

.border-b-amber-750 {
  border-bottom-color: var(--sc-color-amber-750);
}

.border-b-amber-750-dark {
  border-bottom-color: var(--sc-color-amber-750-dark);
}

.border-b-amber-800 {
  border-bottom-color: var(--sc-color-amber-800);
}

.border-b-amber-800-dark {
  border-bottom-color: var(--sc-color-amber-800-dark);
}

.border-b-amber-850 {
  border-bottom-color: var(--sc-color-amber-850);
}

.border-b-amber-850-dark {
  border-bottom-color: var(--sc-color-amber-850-dark);
}

.border-b-amber-900 {
  border-bottom-color: var(--sc-color-amber-900);
}

.border-b-amber-900-dark {
  border-bottom-color: var(--sc-color-amber-900-dark);
}

.border-b-amber-950 {
  border-bottom-color: var(--sc-color-amber-950);
}

.border-b-amber-950-dark {
  border-bottom-color: var(--sc-color-amber-950-dark);
}

.border-b-blue-100 {
  border-bottom-color: var(--sc-color-blue-100);
}

.border-b-blue-100-dark {
  border-bottom-color: var(--sc-color-blue-100-dark);
}

.border-b-blue-150 {
  border-bottom-color: var(--sc-color-blue-150);
}

.border-b-blue-150-dark {
  border-bottom-color: var(--sc-color-blue-150-dark);
}

.border-b-blue-200 {
  border-bottom-color: var(--sc-color-blue-200);
}

.border-b-blue-200-dark {
  border-bottom-color: var(--sc-color-blue-200-dark);
}

.border-b-blue-250 {
  border-bottom-color: var(--sc-color-blue-250);
}

.border-b-blue-250-dark {
  border-bottom-color: var(--sc-color-blue-250-dark);
}

.border-b-blue-300 {
  border-bottom-color: var(--sc-color-blue-300);
}

.border-b-blue-300-dark {
  border-bottom-color: var(--sc-color-blue-300-dark);
}

.border-b-blue-350 {
  border-bottom-color: var(--sc-color-blue-350);
}

.border-b-blue-350-dark {
  border-bottom-color: var(--sc-color-blue-350-dark);
}

.border-b-blue-400 {
  border-bottom-color: var(--sc-color-blue-400);
}

.border-b-blue-400-dark {
  border-bottom-color: var(--sc-color-blue-400-dark);
}

.border-b-blue-450 {
  border-bottom-color: var(--sc-color-blue-450);
}

.border-b-blue-450-dark {
  border-bottom-color: var(--sc-color-blue-450-dark);
}

.border-b-blue-50 {
  border-bottom-color: var(--sc-color-blue-50);
}

.border-b-blue-50-dark {
  border-bottom-color: var(--sc-color-blue-50-dark);
}

.border-b-blue-500 {
  border-bottom-color: var(--sc-color-blue-500);
}

.border-b-blue-500-dark {
  border-bottom-color: var(--sc-color-blue-500-dark);
}

.border-b-blue-550 {
  border-bottom-color: var(--sc-color-blue-550);
}

.border-b-blue-550-dark {
  border-bottom-color: var(--sc-color-blue-550-dark);
}

.border-b-blue-600 {
  border-bottom-color: var(--sc-color-blue-600);
}

.border-b-blue-600-dark {
  border-bottom-color: var(--sc-color-blue-600-dark);
}

.border-b-blue-650 {
  border-bottom-color: var(--sc-color-blue-650);
}

.border-b-blue-650-dark {
  border-bottom-color: var(--sc-color-blue-650-dark);
}

.border-b-blue-700 {
  border-bottom-color: var(--sc-color-blue-700);
}

.border-b-blue-700-dark {
  border-bottom-color: var(--sc-color-blue-700-dark);
}

.border-b-blue-750 {
  border-bottom-color: var(--sc-color-blue-750);
}

.border-b-blue-750-dark {
  border-bottom-color: var(--sc-color-blue-750-dark);
}

.border-b-blue-800 {
  border-bottom-color: var(--sc-color-blue-800);
}

.border-b-blue-800-dark {
  border-bottom-color: var(--sc-color-blue-800-dark);
}

.border-b-blue-850 {
  border-bottom-color: var(--sc-color-blue-850);
}

.border-b-blue-850-dark {
  border-bottom-color: var(--sc-color-blue-850-dark);
}

.border-b-blue-900 {
  border-bottom-color: var(--sc-color-blue-900);
}

.border-b-blue-900-dark {
  border-bottom-color: var(--sc-color-blue-900-dark);
}

.border-b-blue-950 {
  border-bottom-color: var(--sc-color-blue-950);
}

.border-b-blue-950-dark {
  border-bottom-color: var(--sc-color-blue-950-dark);
}

.border-b-current {
  border-bottom-color: currentColor;
}

.border-b-green-100 {
  border-bottom-color: var(--sc-color-green-100);
}

.border-b-green-100-dark {
  border-bottom-color: var(--sc-color-green-100-dark);
}

.border-b-green-150 {
  border-bottom-color: var(--sc-color-green-150);
}

.border-b-green-150-dark {
  border-bottom-color: var(--sc-color-green-150-dark);
}

.border-b-green-200 {
  border-bottom-color: var(--sc-color-green-200);
}

.border-b-green-200-dark {
  border-bottom-color: var(--sc-color-green-200-dark);
}

.border-b-green-250 {
  border-bottom-color: var(--sc-color-green-250);
}

.border-b-green-250-dark {
  border-bottom-color: var(--sc-color-green-250-dark);
}

.border-b-green-300 {
  border-bottom-color: var(--sc-color-green-300);
}

.border-b-green-300-dark {
  border-bottom-color: var(--sc-color-green-300-dark);
}

.border-b-green-350 {
  border-bottom-color: var(--sc-color-green-350);
}

.border-b-green-350-dark {
  border-bottom-color: var(--sc-color-green-350-dark);
}

.border-b-green-400 {
  border-bottom-color: var(--sc-color-green-400);
}

.border-b-green-400-dark {
  border-bottom-color: var(--sc-color-green-400-dark);
}

.border-b-green-450 {
  border-bottom-color: var(--sc-color-green-450);
}

.border-b-green-450-dark {
  border-bottom-color: var(--sc-color-green-450-dark);
}

.border-b-green-50 {
  border-bottom-color: var(--sc-color-green-50);
}

.border-b-green-50-dark {
  border-bottom-color: var(--sc-color-green-50-dark);
}

.border-b-green-500 {
  border-bottom-color: var(--sc-color-green-500);
}

.border-b-green-500-dark {
  border-bottom-color: var(--sc-color-green-500-dark);
}

.border-b-green-550 {
  border-bottom-color: var(--sc-color-green-550);
}

.border-b-green-550-dark {
  border-bottom-color: var(--sc-color-green-550-dark);
}

.border-b-green-600 {
  border-bottom-color: var(--sc-color-green-600);
}

.border-b-green-600-dark {
  border-bottom-color: var(--sc-color-green-600-dark);
}

.border-b-green-650 {
  border-bottom-color: var(--sc-color-green-650);
}

.border-b-green-650-dark {
  border-bottom-color: var(--sc-color-green-650-dark);
}

.border-b-green-700 {
  border-bottom-color: var(--sc-color-green-700);
}

.border-b-green-700-dark {
  border-bottom-color: var(--sc-color-green-700-dark);
}

.border-b-green-750 {
  border-bottom-color: var(--sc-color-green-750);
}

.border-b-green-750-dark {
  border-bottom-color: var(--sc-color-green-750-dark);
}

.border-b-green-800 {
  border-bottom-color: var(--sc-color-green-800);
}

.border-b-green-800-dark {
  border-bottom-color: var(--sc-color-green-800-dark);
}

.border-b-green-850 {
  border-bottom-color: var(--sc-color-green-850);
}

.border-b-green-850-dark {
  border-bottom-color: var(--sc-color-green-850-dark);
}

.border-b-green-900 {
  border-bottom-color: var(--sc-color-green-900);
}

.border-b-green-900-dark {
  border-bottom-color: var(--sc-color-green-900-dark);
}

.border-b-green-950 {
  border-bottom-color: var(--sc-color-green-950);
}

.border-b-green-950-dark {
  border-bottom-color: var(--sc-color-green-950-dark);
}

.border-b-grey-100 {
  border-bottom-color: var(--sc-color-grey-100);
}

.border-b-grey-100-dark {
  border-bottom-color: var(--sc-color-grey-100-dark);
}

.border-b-grey-150 {
  border-bottom-color: var(--sc-color-grey-150);
}

.border-b-grey-150-dark {
  border-bottom-color: var(--sc-color-grey-150-dark);
}

.border-b-grey-200 {
  border-bottom-color: var(--sc-color-grey-200);
}

.border-b-grey-200-dark {
  border-bottom-color: var(--sc-color-grey-200-dark);
}

.border-b-grey-250 {
  border-bottom-color: var(--sc-color-grey-250);
}

.border-b-grey-250-dark {
  border-bottom-color: var(--sc-color-grey-250-dark);
}

.border-b-grey-300 {
  border-bottom-color: var(--sc-color-grey-300);
}

.border-b-grey-300-dark {
  border-bottom-color: var(--sc-color-grey-300-dark);
}

.border-b-grey-350 {
  border-bottom-color: var(--sc-color-grey-350);
}

.border-b-grey-350-dark {
  border-bottom-color: var(--sc-color-grey-350-dark);
}

.border-b-grey-400 {
  border-bottom-color: var(--sc-color-grey-400);
}

.border-b-grey-400-dark {
  border-bottom-color: var(--sc-color-grey-400-dark);
}

.border-b-grey-450 {
  border-bottom-color: var(--sc-color-grey-450);
}

.border-b-grey-450-dark {
  border-bottom-color: var(--sc-color-grey-450-dark);
}

.border-b-grey-50 {
  border-bottom-color: var(--sc-color-grey-50);
}

.border-b-grey-50-dark {
  border-bottom-color: var(--sc-color-grey-50-dark);
}

.border-b-grey-500 {
  border-bottom-color: var(--sc-color-grey-500);
}

.border-b-grey-500-dark {
  border-bottom-color: var(--sc-color-grey-500-dark);
}

.border-b-grey-550 {
  border-bottom-color: var(--sc-color-grey-550);
}

.border-b-grey-550-dark {
  border-bottom-color: var(--sc-color-grey-550-dark);
}

.border-b-grey-600 {
  border-bottom-color: var(--sc-color-grey-600);
}

.border-b-grey-600-dark {
  border-bottom-color: var(--sc-color-grey-600-dark);
}

.border-b-grey-650 {
  border-bottom-color: var(--sc-color-grey-650);
}

.border-b-grey-650-dark {
  border-bottom-color: var(--sc-color-grey-650-dark);
}

.border-b-grey-700 {
  border-bottom-color: var(--sc-color-grey-700);
}

.border-b-grey-700-dark {
  border-bottom-color: var(--sc-color-grey-700-dark);
}

.border-b-grey-750 {
  border-bottom-color: var(--sc-color-grey-750);
}

.border-b-grey-750-dark {
  border-bottom-color: var(--sc-color-grey-750-dark);
}

.border-b-grey-800 {
  border-bottom-color: var(--sc-color-grey-800);
}

.border-b-grey-800-dark {
  border-bottom-color: var(--sc-color-grey-800-dark);
}

.border-b-grey-850 {
  border-bottom-color: var(--sc-color-grey-850);
}

.border-b-grey-850-dark {
  border-bottom-color: var(--sc-color-grey-850-dark);
}

.border-b-grey-900 {
  border-bottom-color: var(--sc-color-grey-900);
}

.border-b-grey-900-dark {
  border-bottom-color: var(--sc-color-grey-900-dark);
}

.border-b-grey-950 {
  border-bottom-color: var(--sc-color-grey-950);
}

.border-b-grey-950-dark {
  border-bottom-color: var(--sc-color-grey-950-dark);
}

.border-b-grey-black {
  border-bottom-color: var(--sc-color-black);
}

.border-b-muted {
  border-bottom-color: var(--sc-color-blue-900);
}

.border-b-orange-500 {
  border-bottom-color: var(--sc-color-orange-500);
}

.border-b-primary {
  border-bottom-color: var(--sc-color-blue);
}

.border-b-purple-100 {
  border-bottom-color: var(--sc-color-purple-100);
}

.border-b-purple-100-dark {
  border-bottom-color: var(--sc-color-purple-100-dark);
}

.border-b-purple-150 {
  border-bottom-color: var(--sc-color-purple-150);
}

.border-b-purple-150-dark {
  border-bottom-color: var(--sc-color-purple-150-dark);
}

.border-b-purple-200 {
  border-bottom-color: var(--sc-color-purple-200);
}

.border-b-purple-200-dark {
  border-bottom-color: var(--sc-color-purple-200-dark);
}

.border-b-purple-250 {
  border-bottom-color: var(--sc-color-purple-250);
}

.border-b-purple-250-dark {
  border-bottom-color: var(--sc-color-purple-250-dark);
}

.border-b-purple-300 {
  border-bottom-color: var(--sc-color-purple-300);
}

.border-b-purple-300-dark {
  border-bottom-color: var(--sc-color-purple-300-dark);
}

.border-b-purple-350 {
  border-bottom-color: var(--sc-color-purple-350);
}

.border-b-purple-350-dark {
  border-bottom-color: var(--sc-color-purple-350-dark);
}

.border-b-purple-400 {
  border-bottom-color: var(--sc-color-purple-400);
}

.border-b-purple-400-dark {
  border-bottom-color: var(--sc-color-purple-400-dark);
}

.border-b-purple-450 {
  border-bottom-color: var(--sc-color-purple-450);
}

.border-b-purple-450-dark {
  border-bottom-color: var(--sc-color-purple-450-dark);
}

.border-b-purple-50 {
  border-bottom-color: var(--sc-color-purple-50);
}

.border-b-purple-50-dark {
  border-bottom-color: var(--sc-color-purple-50-dark);
}

.border-b-purple-500 {
  border-bottom-color: var(--sc-color-purple-500);
}

.border-b-purple-500-dark {
  border-bottom-color: var(--sc-color-purple-500-dark);
}

.border-b-purple-550 {
  border-bottom-color: var(--sc-color-purple-550);
}

.border-b-purple-550-dark {
  border-bottom-color: var(--sc-color-purple-550-dark);
}

.border-b-purple-600 {
  border-bottom-color: var(--sc-color-purple-600);
}

.border-b-purple-600-dark {
  border-bottom-color: var(--sc-color-purple-600-dark);
}

.border-b-purple-650 {
  border-bottom-color: var(--sc-color-purple-650);
}

.border-b-purple-650-dark {
  border-bottom-color: var(--sc-color-purple-650-dark);
}

.border-b-purple-700 {
  border-bottom-color: var(--sc-color-purple-700);
}

.border-b-purple-700-dark {
  border-bottom-color: var(--sc-color-purple-700-dark);
}

.border-b-purple-750 {
  border-bottom-color: var(--sc-color-purple-750);
}

.border-b-purple-750-dark {
  border-bottom-color: var(--sc-color-purple-750-dark);
}

.border-b-purple-800 {
  border-bottom-color: var(--sc-color-purple-800);
}

.border-b-purple-800-dark {
  border-bottom-color: var(--sc-color-purple-800-dark);
}

.border-b-purple-850 {
  border-bottom-color: var(--sc-color-purple-850);
}

.border-b-purple-850-dark {
  border-bottom-color: var(--sc-color-purple-850-dark);
}

.border-b-purple-900 {
  border-bottom-color: var(--sc-color-purple-900);
}

.border-b-purple-900-dark {
  border-bottom-color: var(--sc-color-purple-900-dark);
}

.border-b-purple-950 {
  border-bottom-color: var(--sc-color-purple-950);
}

.border-b-purple-950-dark {
  border-bottom-color: var(--sc-color-purple-950-dark);
}

.border-b-red-100 {
  border-bottom-color: var(--sc-color-red-100);
}

.border-b-red-100-dark {
  border-bottom-color: var(--sc-color-red-100-dark);
}

.border-b-red-150 {
  border-bottom-color: var(--sc-color-red-150);
}

.border-b-red-150-dark {
  border-bottom-color: var(--sc-color-red-150-dark);
}

.border-b-red-200 {
  border-bottom-color: var(--sc-color-red-200);
}

.border-b-red-200-dark {
  border-bottom-color: var(--sc-color-red-200-dark);
}

.border-b-red-250 {
  border-bottom-color: var(--sc-color-red-250);
}

.border-b-red-250-dark {
  border-bottom-color: var(--sc-color-red-250-dark);
}

.border-b-red-300 {
  border-bottom-color: var(--sc-color-red-300);
}

.border-b-red-300-dark {
  border-bottom-color: var(--sc-color-red-300-dark);
}

.border-b-red-350 {
  border-bottom-color: var(--sc-color-red-350);
}

.border-b-red-350-dark {
  border-bottom-color: var(--sc-color-red-350-dark);
}

.border-b-red-400 {
  border-bottom-color: var(--sc-color-red-400);
}

.border-b-red-400-dark {
  border-bottom-color: var(--sc-color-red-400-dark);
}

.border-b-red-450 {
  border-bottom-color: var(--sc-color-red-450);
}

.border-b-red-450-dark {
  border-bottom-color: var(--sc-color-red-450-dark);
}

.border-b-red-50 {
  border-bottom-color: var(--sc-color-red-50);
}

.border-b-red-50-dark {
  border-bottom-color: var(--sc-color-red-50-dark);
}

.border-b-red-500 {
  border-bottom-color: var(--sc-color-red-500);
}

.border-b-red-500-dark {
  border-bottom-color: var(--sc-color-red-500-dark);
}

.border-b-red-550 {
  border-bottom-color: var(--sc-color-red-550);
}

.border-b-red-550-dark {
  border-bottom-color: var(--sc-color-red-550-dark);
}

.border-b-red-600 {
  border-bottom-color: var(--sc-color-red-600);
}

.border-b-red-600-dark {
  border-bottom-color: var(--sc-color-red-600-dark);
}

.border-b-red-650 {
  border-bottom-color: var(--sc-color-red-650);
}

.border-b-red-650-dark {
  border-bottom-color: var(--sc-color-red-650-dark);
}

.border-b-red-700 {
  border-bottom-color: var(--sc-color-red-700);
}

.border-b-red-700-dark {
  border-bottom-color: var(--sc-color-red-700-dark);
}

.border-b-red-750 {
  border-bottom-color: var(--sc-color-red-750);
}

.border-b-red-750-dark {
  border-bottom-color: var(--sc-color-red-750-dark);
}

.border-b-red-800 {
  border-bottom-color: var(--sc-color-red-800);
}

.border-b-red-800-dark {
  border-bottom-color: var(--sc-color-red-800-dark);
}

.border-b-red-850 {
  border-bottom-color: var(--sc-color-red-850);
}

.border-b-red-850-dark {
  border-bottom-color: var(--sc-color-red-850-dark);
}

.border-b-red-900 {
  border-bottom-color: var(--sc-color-red-900);
}

.border-b-red-900-dark {
  border-bottom-color: var(--sc-color-red-900-dark);
}

.border-b-red-950 {
  border-bottom-color: var(--sc-color-red-950);
}

.border-b-red-950-dark {
  border-bottom-color: var(--sc-color-red-950-dark);
}

.border-b-teal-100 {
  border-bottom-color: var(--sc-color-teal-100);
}

.border-b-teal-500 {
  border-bottom-color: var(--sc-color-teal-500);
}

.border-b-transparent {
  border-bottom-color: transparent;
}

.border-b-transparent\/0 {
  border-bottom-color: rgb(0 0 0 / 0);
}

.border-b-transparent\/10 {
  border-bottom-color: rgb(0 0 0 / 0.1);
}

.border-b-transparent\/100 {
  border-bottom-color: rgb(0 0 0 / 1);
}

.border-b-transparent\/15 {
  border-bottom-color: rgb(0 0 0 / 0.15);
}

.border-b-transparent\/20 {
  border-bottom-color: rgb(0 0 0 / 0.2);
}

.border-b-transparent\/25 {
  border-bottom-color: rgb(0 0 0 / 0.25);
}

.border-b-transparent\/30 {
  border-bottom-color: rgb(0 0 0 / 0.3);
}

.border-b-transparent\/35 {
  border-bottom-color: rgb(0 0 0 / 0.35);
}

.border-b-transparent\/40 {
  border-bottom-color: rgb(0 0 0 / 0.4);
}

.border-b-transparent\/45 {
  border-bottom-color: rgb(0 0 0 / 0.45);
}

.border-b-transparent\/5 {
  border-bottom-color: rgb(0 0 0 / 0.05);
}

.border-b-transparent\/50 {
  border-bottom-color: rgb(0 0 0 / 0.5);
}

.border-b-transparent\/55 {
  border-bottom-color: rgb(0 0 0 / 0.55);
}

.border-b-transparent\/60 {
  border-bottom-color: rgb(0 0 0 / 0.6);
}

.border-b-transparent\/65 {
  border-bottom-color: rgb(0 0 0 / 0.65);
}

.border-b-transparent\/70 {
  border-bottom-color: rgb(0 0 0 / 0.7);
}

.border-b-transparent\/75 {
  border-bottom-color: rgb(0 0 0 / 0.75);
}

.border-b-transparent\/80 {
  border-bottom-color: rgb(0 0 0 / 0.8);
}

.border-b-transparent\/85 {
  border-bottom-color: rgb(0 0 0 / 0.85);
}

.border-b-transparent\/90 {
  border-bottom-color: rgb(0 0 0 / 0.9);
}

.border-b-transparent\/95 {
  border-bottom-color: rgb(0 0 0 / 0.95);
}

.border-b-white {
  border-bottom-color: var(--sc-color-white);
}

.border-e-amber-100 {
  border-inline-end-color: var(--sc-color-amber-100);
}

.border-e-amber-100-dark {
  border-inline-end-color: var(--sc-color-amber-100-dark);
}

.border-e-amber-150 {
  border-inline-end-color: var(--sc-color-amber-150);
}

.border-e-amber-150-dark {
  border-inline-end-color: var(--sc-color-amber-150-dark);
}

.border-e-amber-200 {
  border-inline-end-color: var(--sc-color-amber-200);
}

.border-e-amber-200-dark {
  border-inline-end-color: var(--sc-color-amber-200-dark);
}

.border-e-amber-250 {
  border-inline-end-color: var(--sc-color-amber-250);
}

.border-e-amber-250-dark {
  border-inline-end-color: var(--sc-color-amber-250-dark);
}

.border-e-amber-300 {
  border-inline-end-color: var(--sc-color-amber-300);
}

.border-e-amber-300-dark {
  border-inline-end-color: var(--sc-color-amber-300-dark);
}

.border-e-amber-350 {
  border-inline-end-color: var(--sc-color-amber-350);
}

.border-e-amber-350-dark {
  border-inline-end-color: var(--sc-color-amber-350-dark);
}

.border-e-amber-400 {
  border-inline-end-color: var(--sc-color-amber-400);
}

.border-e-amber-400-dark {
  border-inline-end-color: var(--sc-color-amber-400-dark);
}

.border-e-amber-450 {
  border-inline-end-color: var(--sc-color-amber-450);
}

.border-e-amber-450-dark {
  border-inline-end-color: var(--sc-color-amber-450-dark);
}

.border-e-amber-50 {
  border-inline-end-color: var(--sc-color-amber-50);
}

.border-e-amber-50-dark {
  border-inline-end-color: var(--sc-color-amber-50-dark);
}

.border-e-amber-500 {
  border-inline-end-color: var(--sc-color-amber-500);
}

.border-e-amber-500-dark {
  border-inline-end-color: var(--sc-color-amber-500-dark);
}

.border-e-amber-550 {
  border-inline-end-color: var(--sc-color-amber-550);
}

.border-e-amber-550-dark {
  border-inline-end-color: var(--sc-color-amber-550-dark);
}

.border-e-amber-600 {
  border-inline-end-color: var(--sc-color-amber-600);
}

.border-e-amber-600-dark {
  border-inline-end-color: var(--sc-color-amber-600-dark);
}

.border-e-amber-650 {
  border-inline-end-color: var(--sc-color-amber-650);
}

.border-e-amber-650-dark {
  border-inline-end-color: var(--sc-color-amber-650-dark);
}

.border-e-amber-700 {
  border-inline-end-color: var(--sc-color-amber-700);
}

.border-e-amber-700-dark {
  border-inline-end-color: var(--sc-color-amber-700-dark);
}

.border-e-amber-750 {
  border-inline-end-color: var(--sc-color-amber-750);
}

.border-e-amber-750-dark {
  border-inline-end-color: var(--sc-color-amber-750-dark);
}

.border-e-amber-800 {
  border-inline-end-color: var(--sc-color-amber-800);
}

.border-e-amber-800-dark {
  border-inline-end-color: var(--sc-color-amber-800-dark);
}

.border-e-amber-850 {
  border-inline-end-color: var(--sc-color-amber-850);
}

.border-e-amber-850-dark {
  border-inline-end-color: var(--sc-color-amber-850-dark);
}

.border-e-amber-900 {
  border-inline-end-color: var(--sc-color-amber-900);
}

.border-e-amber-900-dark {
  border-inline-end-color: var(--sc-color-amber-900-dark);
}

.border-e-amber-950 {
  border-inline-end-color: var(--sc-color-amber-950);
}

.border-e-amber-950-dark {
  border-inline-end-color: var(--sc-color-amber-950-dark);
}

.border-e-blue-100 {
  border-inline-end-color: var(--sc-color-blue-100);
}

.border-e-blue-100-dark {
  border-inline-end-color: var(--sc-color-blue-100-dark);
}

.border-e-blue-150 {
  border-inline-end-color: var(--sc-color-blue-150);
}

.border-e-blue-150-dark {
  border-inline-end-color: var(--sc-color-blue-150-dark);
}

.border-e-blue-200 {
  border-inline-end-color: var(--sc-color-blue-200);
}

.border-e-blue-200-dark {
  border-inline-end-color: var(--sc-color-blue-200-dark);
}

.border-e-blue-250 {
  border-inline-end-color: var(--sc-color-blue-250);
}

.border-e-blue-250-dark {
  border-inline-end-color: var(--sc-color-blue-250-dark);
}

.border-e-blue-300 {
  border-inline-end-color: var(--sc-color-blue-300);
}

.border-e-blue-300-dark {
  border-inline-end-color: var(--sc-color-blue-300-dark);
}

.border-e-blue-350 {
  border-inline-end-color: var(--sc-color-blue-350);
}

.border-e-blue-350-dark {
  border-inline-end-color: var(--sc-color-blue-350-dark);
}

.border-e-blue-400 {
  border-inline-end-color: var(--sc-color-blue-400);
}

.border-e-blue-400-dark {
  border-inline-end-color: var(--sc-color-blue-400-dark);
}

.border-e-blue-450 {
  border-inline-end-color: var(--sc-color-blue-450);
}

.border-e-blue-450-dark {
  border-inline-end-color: var(--sc-color-blue-450-dark);
}

.border-e-blue-50 {
  border-inline-end-color: var(--sc-color-blue-50);
}

.border-e-blue-50-dark {
  border-inline-end-color: var(--sc-color-blue-50-dark);
}

.border-e-blue-500 {
  border-inline-end-color: var(--sc-color-blue-500);
}

.border-e-blue-500-dark {
  border-inline-end-color: var(--sc-color-blue-500-dark);
}

.border-e-blue-550 {
  border-inline-end-color: var(--sc-color-blue-550);
}

.border-e-blue-550-dark {
  border-inline-end-color: var(--sc-color-blue-550-dark);
}

.border-e-blue-600 {
  border-inline-end-color: var(--sc-color-blue-600);
}

.border-e-blue-600-dark {
  border-inline-end-color: var(--sc-color-blue-600-dark);
}

.border-e-blue-650 {
  border-inline-end-color: var(--sc-color-blue-650);
}

.border-e-blue-650-dark {
  border-inline-end-color: var(--sc-color-blue-650-dark);
}

.border-e-blue-700 {
  border-inline-end-color: var(--sc-color-blue-700);
}

.border-e-blue-700-dark {
  border-inline-end-color: var(--sc-color-blue-700-dark);
}

.border-e-blue-750 {
  border-inline-end-color: var(--sc-color-blue-750);
}

.border-e-blue-750-dark {
  border-inline-end-color: var(--sc-color-blue-750-dark);
}

.border-e-blue-800 {
  border-inline-end-color: var(--sc-color-blue-800);
}

.border-e-blue-800-dark {
  border-inline-end-color: var(--sc-color-blue-800-dark);
}

.border-e-blue-850 {
  border-inline-end-color: var(--sc-color-blue-850);
}

.border-e-blue-850-dark {
  border-inline-end-color: var(--sc-color-blue-850-dark);
}

.border-e-blue-900 {
  border-inline-end-color: var(--sc-color-blue-900);
}

.border-e-blue-900-dark {
  border-inline-end-color: var(--sc-color-blue-900-dark);
}

.border-e-blue-950 {
  border-inline-end-color: var(--sc-color-blue-950);
}

.border-e-blue-950-dark {
  border-inline-end-color: var(--sc-color-blue-950-dark);
}

.border-e-current {
  border-inline-end-color: currentColor;
}

.border-e-green-100 {
  border-inline-end-color: var(--sc-color-green-100);
}

.border-e-green-100-dark {
  border-inline-end-color: var(--sc-color-green-100-dark);
}

.border-e-green-150 {
  border-inline-end-color: var(--sc-color-green-150);
}

.border-e-green-150-dark {
  border-inline-end-color: var(--sc-color-green-150-dark);
}

.border-e-green-200 {
  border-inline-end-color: var(--sc-color-green-200);
}

.border-e-green-200-dark {
  border-inline-end-color: var(--sc-color-green-200-dark);
}

.border-e-green-250 {
  border-inline-end-color: var(--sc-color-green-250);
}

.border-e-green-250-dark {
  border-inline-end-color: var(--sc-color-green-250-dark);
}

.border-e-green-300 {
  border-inline-end-color: var(--sc-color-green-300);
}

.border-e-green-300-dark {
  border-inline-end-color: var(--sc-color-green-300-dark);
}

.border-e-green-350 {
  border-inline-end-color: var(--sc-color-green-350);
}

.border-e-green-350-dark {
  border-inline-end-color: var(--sc-color-green-350-dark);
}

.border-e-green-400 {
  border-inline-end-color: var(--sc-color-green-400);
}

.border-e-green-400-dark {
  border-inline-end-color: var(--sc-color-green-400-dark);
}

.border-e-green-450 {
  border-inline-end-color: var(--sc-color-green-450);
}

.border-e-green-450-dark {
  border-inline-end-color: var(--sc-color-green-450-dark);
}

.border-e-green-50 {
  border-inline-end-color: var(--sc-color-green-50);
}

.border-e-green-50-dark {
  border-inline-end-color: var(--sc-color-green-50-dark);
}

.border-e-green-500 {
  border-inline-end-color: var(--sc-color-green-500);
}

.border-e-green-500-dark {
  border-inline-end-color: var(--sc-color-green-500-dark);
}

.border-e-green-550 {
  border-inline-end-color: var(--sc-color-green-550);
}

.border-e-green-550-dark {
  border-inline-end-color: var(--sc-color-green-550-dark);
}

.border-e-green-600 {
  border-inline-end-color: var(--sc-color-green-600);
}

.border-e-green-600-dark {
  border-inline-end-color: var(--sc-color-green-600-dark);
}

.border-e-green-650 {
  border-inline-end-color: var(--sc-color-green-650);
}

.border-e-green-650-dark {
  border-inline-end-color: var(--sc-color-green-650-dark);
}

.border-e-green-700 {
  border-inline-end-color: var(--sc-color-green-700);
}

.border-e-green-700-dark {
  border-inline-end-color: var(--sc-color-green-700-dark);
}

.border-e-green-750 {
  border-inline-end-color: var(--sc-color-green-750);
}

.border-e-green-750-dark {
  border-inline-end-color: var(--sc-color-green-750-dark);
}

.border-e-green-800 {
  border-inline-end-color: var(--sc-color-green-800);
}

.border-e-green-800-dark {
  border-inline-end-color: var(--sc-color-green-800-dark);
}

.border-e-green-850 {
  border-inline-end-color: var(--sc-color-green-850);
}

.border-e-green-850-dark {
  border-inline-end-color: var(--sc-color-green-850-dark);
}

.border-e-green-900 {
  border-inline-end-color: var(--sc-color-green-900);
}

.border-e-green-900-dark {
  border-inline-end-color: var(--sc-color-green-900-dark);
}

.border-e-green-950 {
  border-inline-end-color: var(--sc-color-green-950);
}

.border-e-green-950-dark {
  border-inline-end-color: var(--sc-color-green-950-dark);
}

.border-e-grey-100 {
  border-inline-end-color: var(--sc-color-grey-100);
}

.border-e-grey-100-dark {
  border-inline-end-color: var(--sc-color-grey-100-dark);
}

.border-e-grey-150 {
  border-inline-end-color: var(--sc-color-grey-150);
}

.border-e-grey-150-dark {
  border-inline-end-color: var(--sc-color-grey-150-dark);
}

.border-e-grey-200 {
  border-inline-end-color: var(--sc-color-grey-200);
}

.border-e-grey-200-dark {
  border-inline-end-color: var(--sc-color-grey-200-dark);
}

.border-e-grey-250 {
  border-inline-end-color: var(--sc-color-grey-250);
}

.border-e-grey-250-dark {
  border-inline-end-color: var(--sc-color-grey-250-dark);
}

.border-e-grey-300 {
  border-inline-end-color: var(--sc-color-grey-300);
}

.border-e-grey-300-dark {
  border-inline-end-color: var(--sc-color-grey-300-dark);
}

.border-e-grey-350 {
  border-inline-end-color: var(--sc-color-grey-350);
}

.border-e-grey-350-dark {
  border-inline-end-color: var(--sc-color-grey-350-dark);
}

.border-e-grey-400 {
  border-inline-end-color: var(--sc-color-grey-400);
}

.border-e-grey-400-dark {
  border-inline-end-color: var(--sc-color-grey-400-dark);
}

.border-e-grey-450 {
  border-inline-end-color: var(--sc-color-grey-450);
}

.border-e-grey-450-dark {
  border-inline-end-color: var(--sc-color-grey-450-dark);
}

.border-e-grey-50 {
  border-inline-end-color: var(--sc-color-grey-50);
}

.border-e-grey-50-dark {
  border-inline-end-color: var(--sc-color-grey-50-dark);
}

.border-e-grey-500 {
  border-inline-end-color: var(--sc-color-grey-500);
}

.border-e-grey-500-dark {
  border-inline-end-color: var(--sc-color-grey-500-dark);
}

.border-e-grey-550 {
  border-inline-end-color: var(--sc-color-grey-550);
}

.border-e-grey-550-dark {
  border-inline-end-color: var(--sc-color-grey-550-dark);
}

.border-e-grey-600 {
  border-inline-end-color: var(--sc-color-grey-600);
}

.border-e-grey-600-dark {
  border-inline-end-color: var(--sc-color-grey-600-dark);
}

.border-e-grey-650 {
  border-inline-end-color: var(--sc-color-grey-650);
}

.border-e-grey-650-dark {
  border-inline-end-color: var(--sc-color-grey-650-dark);
}

.border-e-grey-700 {
  border-inline-end-color: var(--sc-color-grey-700);
}

.border-e-grey-700-dark {
  border-inline-end-color: var(--sc-color-grey-700-dark);
}

.border-e-grey-750 {
  border-inline-end-color: var(--sc-color-grey-750);
}

.border-e-grey-750-dark {
  border-inline-end-color: var(--sc-color-grey-750-dark);
}

.border-e-grey-800 {
  border-inline-end-color: var(--sc-color-grey-800);
}

.border-e-grey-800-dark {
  border-inline-end-color: var(--sc-color-grey-800-dark);
}

.border-e-grey-850 {
  border-inline-end-color: var(--sc-color-grey-850);
}

.border-e-grey-850-dark {
  border-inline-end-color: var(--sc-color-grey-850-dark);
}

.border-e-grey-900 {
  border-inline-end-color: var(--sc-color-grey-900);
}

.border-e-grey-900-dark {
  border-inline-end-color: var(--sc-color-grey-900-dark);
}

.border-e-grey-950 {
  border-inline-end-color: var(--sc-color-grey-950);
}

.border-e-grey-950-dark {
  border-inline-end-color: var(--sc-color-grey-950-dark);
}

.border-e-grey-black {
  border-inline-end-color: var(--sc-color-black);
}

.border-e-muted {
  border-inline-end-color: var(--sc-color-blue-900);
}

.border-e-orange-500 {
  border-inline-end-color: var(--sc-color-orange-500);
}

.border-e-primary {
  border-inline-end-color: var(--sc-color-blue);
}

.border-e-purple-100 {
  border-inline-end-color: var(--sc-color-purple-100);
}

.border-e-purple-100-dark {
  border-inline-end-color: var(--sc-color-purple-100-dark);
}

.border-e-purple-150 {
  border-inline-end-color: var(--sc-color-purple-150);
}

.border-e-purple-150-dark {
  border-inline-end-color: var(--sc-color-purple-150-dark);
}

.border-e-purple-200 {
  border-inline-end-color: var(--sc-color-purple-200);
}

.border-e-purple-200-dark {
  border-inline-end-color: var(--sc-color-purple-200-dark);
}

.border-e-purple-250 {
  border-inline-end-color: var(--sc-color-purple-250);
}

.border-e-purple-250-dark {
  border-inline-end-color: var(--sc-color-purple-250-dark);
}

.border-e-purple-300 {
  border-inline-end-color: var(--sc-color-purple-300);
}

.border-e-purple-300-dark {
  border-inline-end-color: var(--sc-color-purple-300-dark);
}

.border-e-purple-350 {
  border-inline-end-color: var(--sc-color-purple-350);
}

.border-e-purple-350-dark {
  border-inline-end-color: var(--sc-color-purple-350-dark);
}

.border-e-purple-400 {
  border-inline-end-color: var(--sc-color-purple-400);
}

.border-e-purple-400-dark {
  border-inline-end-color: var(--sc-color-purple-400-dark);
}

.border-e-purple-450 {
  border-inline-end-color: var(--sc-color-purple-450);
}

.border-e-purple-450-dark {
  border-inline-end-color: var(--sc-color-purple-450-dark);
}

.border-e-purple-50 {
  border-inline-end-color: var(--sc-color-purple-50);
}

.border-e-purple-50-dark {
  border-inline-end-color: var(--sc-color-purple-50-dark);
}

.border-e-purple-500 {
  border-inline-end-color: var(--sc-color-purple-500);
}

.border-e-purple-500-dark {
  border-inline-end-color: var(--sc-color-purple-500-dark);
}

.border-e-purple-550 {
  border-inline-end-color: var(--sc-color-purple-550);
}

.border-e-purple-550-dark {
  border-inline-end-color: var(--sc-color-purple-550-dark);
}

.border-e-purple-600 {
  border-inline-end-color: var(--sc-color-purple-600);
}

.border-e-purple-600-dark {
  border-inline-end-color: var(--sc-color-purple-600-dark);
}

.border-e-purple-650 {
  border-inline-end-color: var(--sc-color-purple-650);
}

.border-e-purple-650-dark {
  border-inline-end-color: var(--sc-color-purple-650-dark);
}

.border-e-purple-700 {
  border-inline-end-color: var(--sc-color-purple-700);
}

.border-e-purple-700-dark {
  border-inline-end-color: var(--sc-color-purple-700-dark);
}

.border-e-purple-750 {
  border-inline-end-color: var(--sc-color-purple-750);
}

.border-e-purple-750-dark {
  border-inline-end-color: var(--sc-color-purple-750-dark);
}

.border-e-purple-800 {
  border-inline-end-color: var(--sc-color-purple-800);
}

.border-e-purple-800-dark {
  border-inline-end-color: var(--sc-color-purple-800-dark);
}

.border-e-purple-850 {
  border-inline-end-color: var(--sc-color-purple-850);
}

.border-e-purple-850-dark {
  border-inline-end-color: var(--sc-color-purple-850-dark);
}

.border-e-purple-900 {
  border-inline-end-color: var(--sc-color-purple-900);
}

.border-e-purple-900-dark {
  border-inline-end-color: var(--sc-color-purple-900-dark);
}

.border-e-purple-950 {
  border-inline-end-color: var(--sc-color-purple-950);
}

.border-e-purple-950-dark {
  border-inline-end-color: var(--sc-color-purple-950-dark);
}

.border-e-red-100 {
  border-inline-end-color: var(--sc-color-red-100);
}

.border-e-red-100-dark {
  border-inline-end-color: var(--sc-color-red-100-dark);
}

.border-e-red-150 {
  border-inline-end-color: var(--sc-color-red-150);
}

.border-e-red-150-dark {
  border-inline-end-color: var(--sc-color-red-150-dark);
}

.border-e-red-200 {
  border-inline-end-color: var(--sc-color-red-200);
}

.border-e-red-200-dark {
  border-inline-end-color: var(--sc-color-red-200-dark);
}

.border-e-red-250 {
  border-inline-end-color: var(--sc-color-red-250);
}

.border-e-red-250-dark {
  border-inline-end-color: var(--sc-color-red-250-dark);
}

.border-e-red-300 {
  border-inline-end-color: var(--sc-color-red-300);
}

.border-e-red-300-dark {
  border-inline-end-color: var(--sc-color-red-300-dark);
}

.border-e-red-350 {
  border-inline-end-color: var(--sc-color-red-350);
}

.border-e-red-350-dark {
  border-inline-end-color: var(--sc-color-red-350-dark);
}

.border-e-red-400 {
  border-inline-end-color: var(--sc-color-red-400);
}

.border-e-red-400-dark {
  border-inline-end-color: var(--sc-color-red-400-dark);
}

.border-e-red-450 {
  border-inline-end-color: var(--sc-color-red-450);
}

.border-e-red-450-dark {
  border-inline-end-color: var(--sc-color-red-450-dark);
}

.border-e-red-50 {
  border-inline-end-color: var(--sc-color-red-50);
}

.border-e-red-50-dark {
  border-inline-end-color: var(--sc-color-red-50-dark);
}

.border-e-red-500 {
  border-inline-end-color: var(--sc-color-red-500);
}

.border-e-red-500-dark {
  border-inline-end-color: var(--sc-color-red-500-dark);
}

.border-e-red-550 {
  border-inline-end-color: var(--sc-color-red-550);
}

.border-e-red-550-dark {
  border-inline-end-color: var(--sc-color-red-550-dark);
}

.border-e-red-600 {
  border-inline-end-color: var(--sc-color-red-600);
}

.border-e-red-600-dark {
  border-inline-end-color: var(--sc-color-red-600-dark);
}

.border-e-red-650 {
  border-inline-end-color: var(--sc-color-red-650);
}

.border-e-red-650-dark {
  border-inline-end-color: var(--sc-color-red-650-dark);
}

.border-e-red-700 {
  border-inline-end-color: var(--sc-color-red-700);
}

.border-e-red-700-dark {
  border-inline-end-color: var(--sc-color-red-700-dark);
}

.border-e-red-750 {
  border-inline-end-color: var(--sc-color-red-750);
}

.border-e-red-750-dark {
  border-inline-end-color: var(--sc-color-red-750-dark);
}

.border-e-red-800 {
  border-inline-end-color: var(--sc-color-red-800);
}

.border-e-red-800-dark {
  border-inline-end-color: var(--sc-color-red-800-dark);
}

.border-e-red-850 {
  border-inline-end-color: var(--sc-color-red-850);
}

.border-e-red-850-dark {
  border-inline-end-color: var(--sc-color-red-850-dark);
}

.border-e-red-900 {
  border-inline-end-color: var(--sc-color-red-900);
}

.border-e-red-900-dark {
  border-inline-end-color: var(--sc-color-red-900-dark);
}

.border-e-red-950 {
  border-inline-end-color: var(--sc-color-red-950);
}

.border-e-red-950-dark {
  border-inline-end-color: var(--sc-color-red-950-dark);
}

.border-e-teal-100 {
  border-inline-end-color: var(--sc-color-teal-100);
}

.border-e-teal-500 {
  border-inline-end-color: var(--sc-color-teal-500);
}

.border-e-transparent {
  border-inline-end-color: transparent;
}

.border-e-transparent\/0 {
  border-inline-end-color: rgb(0 0 0 / 0);
}

.border-e-transparent\/10 {
  border-inline-end-color: rgb(0 0 0 / 0.1);
}

.border-e-transparent\/100 {
  border-inline-end-color: rgb(0 0 0 / 1);
}

.border-e-transparent\/15 {
  border-inline-end-color: rgb(0 0 0 / 0.15);
}

.border-e-transparent\/20 {
  border-inline-end-color: rgb(0 0 0 / 0.2);
}

.border-e-transparent\/25 {
  border-inline-end-color: rgb(0 0 0 / 0.25);
}

.border-e-transparent\/30 {
  border-inline-end-color: rgb(0 0 0 / 0.3);
}

.border-e-transparent\/35 {
  border-inline-end-color: rgb(0 0 0 / 0.35);
}

.border-e-transparent\/40 {
  border-inline-end-color: rgb(0 0 0 / 0.4);
}

.border-e-transparent\/45 {
  border-inline-end-color: rgb(0 0 0 / 0.45);
}

.border-e-transparent\/5 {
  border-inline-end-color: rgb(0 0 0 / 0.05);
}

.border-e-transparent\/50 {
  border-inline-end-color: rgb(0 0 0 / 0.5);
}

.border-e-transparent\/55 {
  border-inline-end-color: rgb(0 0 0 / 0.55);
}

.border-e-transparent\/60 {
  border-inline-end-color: rgb(0 0 0 / 0.6);
}

.border-e-transparent\/65 {
  border-inline-end-color: rgb(0 0 0 / 0.65);
}

.border-e-transparent\/70 {
  border-inline-end-color: rgb(0 0 0 / 0.7);
}

.border-e-transparent\/75 {
  border-inline-end-color: rgb(0 0 0 / 0.75);
}

.border-e-transparent\/80 {
  border-inline-end-color: rgb(0 0 0 / 0.8);
}

.border-e-transparent\/85 {
  border-inline-end-color: rgb(0 0 0 / 0.85);
}

.border-e-transparent\/90 {
  border-inline-end-color: rgb(0 0 0 / 0.9);
}

.border-e-transparent\/95 {
  border-inline-end-color: rgb(0 0 0 / 0.95);
}

.border-e-white {
  border-inline-end-color: var(--sc-color-white);
}

.border-l-amber-100 {
  border-left-color: var(--sc-color-amber-100);
}

.border-l-amber-100-dark {
  border-left-color: var(--sc-color-amber-100-dark);
}

.border-l-amber-150 {
  border-left-color: var(--sc-color-amber-150);
}

.border-l-amber-150-dark {
  border-left-color: var(--sc-color-amber-150-dark);
}

.border-l-amber-200 {
  border-left-color: var(--sc-color-amber-200);
}

.border-l-amber-200-dark {
  border-left-color: var(--sc-color-amber-200-dark);
}

.border-l-amber-250 {
  border-left-color: var(--sc-color-amber-250);
}

.border-l-amber-250-dark {
  border-left-color: var(--sc-color-amber-250-dark);
}

.border-l-amber-300 {
  border-left-color: var(--sc-color-amber-300);
}

.border-l-amber-300-dark {
  border-left-color: var(--sc-color-amber-300-dark);
}

.border-l-amber-350 {
  border-left-color: var(--sc-color-amber-350);
}

.border-l-amber-350-dark {
  border-left-color: var(--sc-color-amber-350-dark);
}

.border-l-amber-400 {
  border-left-color: var(--sc-color-amber-400);
}

.border-l-amber-400-dark {
  border-left-color: var(--sc-color-amber-400-dark);
}

.border-l-amber-450 {
  border-left-color: var(--sc-color-amber-450);
}

.border-l-amber-450-dark {
  border-left-color: var(--sc-color-amber-450-dark);
}

.border-l-amber-50 {
  border-left-color: var(--sc-color-amber-50);
}

.border-l-amber-50-dark {
  border-left-color: var(--sc-color-amber-50-dark);
}

.border-l-amber-500 {
  border-left-color: var(--sc-color-amber-500);
}

.border-l-amber-500-dark {
  border-left-color: var(--sc-color-amber-500-dark);
}

.border-l-amber-550 {
  border-left-color: var(--sc-color-amber-550);
}

.border-l-amber-550-dark {
  border-left-color: var(--sc-color-amber-550-dark);
}

.border-l-amber-600 {
  border-left-color: var(--sc-color-amber-600);
}

.border-l-amber-600-dark {
  border-left-color: var(--sc-color-amber-600-dark);
}

.border-l-amber-650 {
  border-left-color: var(--sc-color-amber-650);
}

.border-l-amber-650-dark {
  border-left-color: var(--sc-color-amber-650-dark);
}

.border-l-amber-700 {
  border-left-color: var(--sc-color-amber-700);
}

.border-l-amber-700-dark {
  border-left-color: var(--sc-color-amber-700-dark);
}

.border-l-amber-750 {
  border-left-color: var(--sc-color-amber-750);
}

.border-l-amber-750-dark {
  border-left-color: var(--sc-color-amber-750-dark);
}

.border-l-amber-800 {
  border-left-color: var(--sc-color-amber-800);
}

.border-l-amber-800-dark {
  border-left-color: var(--sc-color-amber-800-dark);
}

.border-l-amber-850 {
  border-left-color: var(--sc-color-amber-850);
}

.border-l-amber-850-dark {
  border-left-color: var(--sc-color-amber-850-dark);
}

.border-l-amber-900 {
  border-left-color: var(--sc-color-amber-900);
}

.border-l-amber-900-dark {
  border-left-color: var(--sc-color-amber-900-dark);
}

.border-l-amber-950 {
  border-left-color: var(--sc-color-amber-950);
}

.border-l-amber-950-dark {
  border-left-color: var(--sc-color-amber-950-dark);
}

.border-l-blue-100 {
  border-left-color: var(--sc-color-blue-100);
}

.border-l-blue-100-dark {
  border-left-color: var(--sc-color-blue-100-dark);
}

.border-l-blue-150 {
  border-left-color: var(--sc-color-blue-150);
}

.border-l-blue-150-dark {
  border-left-color: var(--sc-color-blue-150-dark);
}

.border-l-blue-200 {
  border-left-color: var(--sc-color-blue-200);
}

.border-l-blue-200-dark {
  border-left-color: var(--sc-color-blue-200-dark);
}

.border-l-blue-250 {
  border-left-color: var(--sc-color-blue-250);
}

.border-l-blue-250-dark {
  border-left-color: var(--sc-color-blue-250-dark);
}

.border-l-blue-300 {
  border-left-color: var(--sc-color-blue-300);
}

.border-l-blue-300-dark {
  border-left-color: var(--sc-color-blue-300-dark);
}

.border-l-blue-350 {
  border-left-color: var(--sc-color-blue-350);
}

.border-l-blue-350-dark {
  border-left-color: var(--sc-color-blue-350-dark);
}

.border-l-blue-400 {
  border-left-color: var(--sc-color-blue-400);
}

.border-l-blue-400-dark {
  border-left-color: var(--sc-color-blue-400-dark);
}

.border-l-blue-450 {
  border-left-color: var(--sc-color-blue-450);
}

.border-l-blue-450-dark {
  border-left-color: var(--sc-color-blue-450-dark);
}

.border-l-blue-50 {
  border-left-color: var(--sc-color-blue-50);
}

.border-l-blue-50-dark {
  border-left-color: var(--sc-color-blue-50-dark);
}

.border-l-blue-500 {
  border-left-color: var(--sc-color-blue-500);
}

.border-l-blue-500-dark {
  border-left-color: var(--sc-color-blue-500-dark);
}

.border-l-blue-550 {
  border-left-color: var(--sc-color-blue-550);
}

.border-l-blue-550-dark {
  border-left-color: var(--sc-color-blue-550-dark);
}

.border-l-blue-600 {
  border-left-color: var(--sc-color-blue-600);
}

.border-l-blue-600-dark {
  border-left-color: var(--sc-color-blue-600-dark);
}

.border-l-blue-650 {
  border-left-color: var(--sc-color-blue-650);
}

.border-l-blue-650-dark {
  border-left-color: var(--sc-color-blue-650-dark);
}

.border-l-blue-700 {
  border-left-color: var(--sc-color-blue-700);
}

.border-l-blue-700-dark {
  border-left-color: var(--sc-color-blue-700-dark);
}

.border-l-blue-750 {
  border-left-color: var(--sc-color-blue-750);
}

.border-l-blue-750-dark {
  border-left-color: var(--sc-color-blue-750-dark);
}

.border-l-blue-800 {
  border-left-color: var(--sc-color-blue-800);
}

.border-l-blue-800-dark {
  border-left-color: var(--sc-color-blue-800-dark);
}

.border-l-blue-850 {
  border-left-color: var(--sc-color-blue-850);
}

.border-l-blue-850-dark {
  border-left-color: var(--sc-color-blue-850-dark);
}

.border-l-blue-900 {
  border-left-color: var(--sc-color-blue-900);
}

.border-l-blue-900-dark {
  border-left-color: var(--sc-color-blue-900-dark);
}

.border-l-blue-950 {
  border-left-color: var(--sc-color-blue-950);
}

.border-l-blue-950-dark {
  border-left-color: var(--sc-color-blue-950-dark);
}

.border-l-current {
  border-left-color: currentColor;
}

.border-l-green-100 {
  border-left-color: var(--sc-color-green-100);
}

.border-l-green-100-dark {
  border-left-color: var(--sc-color-green-100-dark);
}

.border-l-green-150 {
  border-left-color: var(--sc-color-green-150);
}

.border-l-green-150-dark {
  border-left-color: var(--sc-color-green-150-dark);
}

.border-l-green-200 {
  border-left-color: var(--sc-color-green-200);
}

.border-l-green-200-dark {
  border-left-color: var(--sc-color-green-200-dark);
}

.border-l-green-250 {
  border-left-color: var(--sc-color-green-250);
}

.border-l-green-250-dark {
  border-left-color: var(--sc-color-green-250-dark);
}

.border-l-green-300 {
  border-left-color: var(--sc-color-green-300);
}

.border-l-green-300-dark {
  border-left-color: var(--sc-color-green-300-dark);
}

.border-l-green-350 {
  border-left-color: var(--sc-color-green-350);
}

.border-l-green-350-dark {
  border-left-color: var(--sc-color-green-350-dark);
}

.border-l-green-400 {
  border-left-color: var(--sc-color-green-400);
}

.border-l-green-400-dark {
  border-left-color: var(--sc-color-green-400-dark);
}

.border-l-green-450 {
  border-left-color: var(--sc-color-green-450);
}

.border-l-green-450-dark {
  border-left-color: var(--sc-color-green-450-dark);
}

.border-l-green-50 {
  border-left-color: var(--sc-color-green-50);
}

.border-l-green-50-dark {
  border-left-color: var(--sc-color-green-50-dark);
}

.border-l-green-500 {
  border-left-color: var(--sc-color-green-500);
}

.border-l-green-500-dark {
  border-left-color: var(--sc-color-green-500-dark);
}

.border-l-green-550 {
  border-left-color: var(--sc-color-green-550);
}

.border-l-green-550-dark {
  border-left-color: var(--sc-color-green-550-dark);
}

.border-l-green-600 {
  border-left-color: var(--sc-color-green-600);
}

.border-l-green-600-dark {
  border-left-color: var(--sc-color-green-600-dark);
}

.border-l-green-650 {
  border-left-color: var(--sc-color-green-650);
}

.border-l-green-650-dark {
  border-left-color: var(--sc-color-green-650-dark);
}

.border-l-green-700 {
  border-left-color: var(--sc-color-green-700);
}

.border-l-green-700-dark {
  border-left-color: var(--sc-color-green-700-dark);
}

.border-l-green-750 {
  border-left-color: var(--sc-color-green-750);
}

.border-l-green-750-dark {
  border-left-color: var(--sc-color-green-750-dark);
}

.border-l-green-800 {
  border-left-color: var(--sc-color-green-800);
}

.border-l-green-800-dark {
  border-left-color: var(--sc-color-green-800-dark);
}

.border-l-green-850 {
  border-left-color: var(--sc-color-green-850);
}

.border-l-green-850-dark {
  border-left-color: var(--sc-color-green-850-dark);
}

.border-l-green-900 {
  border-left-color: var(--sc-color-green-900);
}

.border-l-green-900-dark {
  border-left-color: var(--sc-color-green-900-dark);
}

.border-l-green-950 {
  border-left-color: var(--sc-color-green-950);
}

.border-l-green-950-dark {
  border-left-color: var(--sc-color-green-950-dark);
}

.border-l-grey-100 {
  border-left-color: var(--sc-color-grey-100);
}

.border-l-grey-100-dark {
  border-left-color: var(--sc-color-grey-100-dark);
}

.border-l-grey-150 {
  border-left-color: var(--sc-color-grey-150);
}

.border-l-grey-150-dark {
  border-left-color: var(--sc-color-grey-150-dark);
}

.border-l-grey-200 {
  border-left-color: var(--sc-color-grey-200);
}

.border-l-grey-200-dark {
  border-left-color: var(--sc-color-grey-200-dark);
}

.border-l-grey-250 {
  border-left-color: var(--sc-color-grey-250);
}

.border-l-grey-250-dark {
  border-left-color: var(--sc-color-grey-250-dark);
}

.border-l-grey-300 {
  border-left-color: var(--sc-color-grey-300);
}

.border-l-grey-300-dark {
  border-left-color: var(--sc-color-grey-300-dark);
}

.border-l-grey-350 {
  border-left-color: var(--sc-color-grey-350);
}

.border-l-grey-350-dark {
  border-left-color: var(--sc-color-grey-350-dark);
}

.border-l-grey-400 {
  border-left-color: var(--sc-color-grey-400);
}

.border-l-grey-400-dark {
  border-left-color: var(--sc-color-grey-400-dark);
}

.border-l-grey-450 {
  border-left-color: var(--sc-color-grey-450);
}

.border-l-grey-450-dark {
  border-left-color: var(--sc-color-grey-450-dark);
}

.border-l-grey-50 {
  border-left-color: var(--sc-color-grey-50);
}

.border-l-grey-50-dark {
  border-left-color: var(--sc-color-grey-50-dark);
}

.border-l-grey-500 {
  border-left-color: var(--sc-color-grey-500);
}

.border-l-grey-500-dark {
  border-left-color: var(--sc-color-grey-500-dark);
}

.border-l-grey-550 {
  border-left-color: var(--sc-color-grey-550);
}

.border-l-grey-550-dark {
  border-left-color: var(--sc-color-grey-550-dark);
}

.border-l-grey-600 {
  border-left-color: var(--sc-color-grey-600);
}

.border-l-grey-600-dark {
  border-left-color: var(--sc-color-grey-600-dark);
}

.border-l-grey-650 {
  border-left-color: var(--sc-color-grey-650);
}

.border-l-grey-650-dark {
  border-left-color: var(--sc-color-grey-650-dark);
}

.border-l-grey-700 {
  border-left-color: var(--sc-color-grey-700);
}

.border-l-grey-700-dark {
  border-left-color: var(--sc-color-grey-700-dark);
}

.border-l-grey-750 {
  border-left-color: var(--sc-color-grey-750);
}

.border-l-grey-750-dark {
  border-left-color: var(--sc-color-grey-750-dark);
}

.border-l-grey-800 {
  border-left-color: var(--sc-color-grey-800);
}

.border-l-grey-800-dark {
  border-left-color: var(--sc-color-grey-800-dark);
}

.border-l-grey-850 {
  border-left-color: var(--sc-color-grey-850);
}

.border-l-grey-850-dark {
  border-left-color: var(--sc-color-grey-850-dark);
}

.border-l-grey-900 {
  border-left-color: var(--sc-color-grey-900);
}

.border-l-grey-900-dark {
  border-left-color: var(--sc-color-grey-900-dark);
}

.border-l-grey-950 {
  border-left-color: var(--sc-color-grey-950);
}

.border-l-grey-950-dark {
  border-left-color: var(--sc-color-grey-950-dark);
}

.border-l-grey-black {
  border-left-color: var(--sc-color-black);
}

.border-l-muted {
  border-left-color: var(--sc-color-blue-900);
}

.border-l-orange-500 {
  border-left-color: var(--sc-color-orange-500);
}

.border-l-primary {
  border-left-color: var(--sc-color-blue);
}

.border-l-purple-100 {
  border-left-color: var(--sc-color-purple-100);
}

.border-l-purple-100-dark {
  border-left-color: var(--sc-color-purple-100-dark);
}

.border-l-purple-150 {
  border-left-color: var(--sc-color-purple-150);
}

.border-l-purple-150-dark {
  border-left-color: var(--sc-color-purple-150-dark);
}

.border-l-purple-200 {
  border-left-color: var(--sc-color-purple-200);
}

.border-l-purple-200-dark {
  border-left-color: var(--sc-color-purple-200-dark);
}

.border-l-purple-250 {
  border-left-color: var(--sc-color-purple-250);
}

.border-l-purple-250-dark {
  border-left-color: var(--sc-color-purple-250-dark);
}

.border-l-purple-300 {
  border-left-color: var(--sc-color-purple-300);
}

.border-l-purple-300-dark {
  border-left-color: var(--sc-color-purple-300-dark);
}

.border-l-purple-350 {
  border-left-color: var(--sc-color-purple-350);
}

.border-l-purple-350-dark {
  border-left-color: var(--sc-color-purple-350-dark);
}

.border-l-purple-400 {
  border-left-color: var(--sc-color-purple-400);
}

.border-l-purple-400-dark {
  border-left-color: var(--sc-color-purple-400-dark);
}

.border-l-purple-450 {
  border-left-color: var(--sc-color-purple-450);
}

.border-l-purple-450-dark {
  border-left-color: var(--sc-color-purple-450-dark);
}

.border-l-purple-50 {
  border-left-color: var(--sc-color-purple-50);
}

.border-l-purple-50-dark {
  border-left-color: var(--sc-color-purple-50-dark);
}

.border-l-purple-500 {
  border-left-color: var(--sc-color-purple-500);
}

.border-l-purple-500-dark {
  border-left-color: var(--sc-color-purple-500-dark);
}

.border-l-purple-550 {
  border-left-color: var(--sc-color-purple-550);
}

.border-l-purple-550-dark {
  border-left-color: var(--sc-color-purple-550-dark);
}

.border-l-purple-600 {
  border-left-color: var(--sc-color-purple-600);
}

.border-l-purple-600-dark {
  border-left-color: var(--sc-color-purple-600-dark);
}

.border-l-purple-650 {
  border-left-color: var(--sc-color-purple-650);
}

.border-l-purple-650-dark {
  border-left-color: var(--sc-color-purple-650-dark);
}

.border-l-purple-700 {
  border-left-color: var(--sc-color-purple-700);
}

.border-l-purple-700-dark {
  border-left-color: var(--sc-color-purple-700-dark);
}

.border-l-purple-750 {
  border-left-color: var(--sc-color-purple-750);
}

.border-l-purple-750-dark {
  border-left-color: var(--sc-color-purple-750-dark);
}

.border-l-purple-800 {
  border-left-color: var(--sc-color-purple-800);
}

.border-l-purple-800-dark {
  border-left-color: var(--sc-color-purple-800-dark);
}

.border-l-purple-850 {
  border-left-color: var(--sc-color-purple-850);
}

.border-l-purple-850-dark {
  border-left-color: var(--sc-color-purple-850-dark);
}

.border-l-purple-900 {
  border-left-color: var(--sc-color-purple-900);
}

.border-l-purple-900-dark {
  border-left-color: var(--sc-color-purple-900-dark);
}

.border-l-purple-950 {
  border-left-color: var(--sc-color-purple-950);
}

.border-l-purple-950-dark {
  border-left-color: var(--sc-color-purple-950-dark);
}

.border-l-red-100 {
  border-left-color: var(--sc-color-red-100);
}

.border-l-red-100-dark {
  border-left-color: var(--sc-color-red-100-dark);
}

.border-l-red-150 {
  border-left-color: var(--sc-color-red-150);
}

.border-l-red-150-dark {
  border-left-color: var(--sc-color-red-150-dark);
}

.border-l-red-200 {
  border-left-color: var(--sc-color-red-200);
}

.border-l-red-200-dark {
  border-left-color: var(--sc-color-red-200-dark);
}

.border-l-red-250 {
  border-left-color: var(--sc-color-red-250);
}

.border-l-red-250-dark {
  border-left-color: var(--sc-color-red-250-dark);
}

.border-l-red-300 {
  border-left-color: var(--sc-color-red-300);
}

.border-l-red-300-dark {
  border-left-color: var(--sc-color-red-300-dark);
}

.border-l-red-350 {
  border-left-color: var(--sc-color-red-350);
}

.border-l-red-350-dark {
  border-left-color: var(--sc-color-red-350-dark);
}

.border-l-red-400 {
  border-left-color: var(--sc-color-red-400);
}

.border-l-red-400-dark {
  border-left-color: var(--sc-color-red-400-dark);
}

.border-l-red-450 {
  border-left-color: var(--sc-color-red-450);
}

.border-l-red-450-dark {
  border-left-color: var(--sc-color-red-450-dark);
}

.border-l-red-50 {
  border-left-color: var(--sc-color-red-50);
}

.border-l-red-50-dark {
  border-left-color: var(--sc-color-red-50-dark);
}

.border-l-red-500 {
  border-left-color: var(--sc-color-red-500);
}

.border-l-red-500-dark {
  border-left-color: var(--sc-color-red-500-dark);
}

.border-l-red-550 {
  border-left-color: var(--sc-color-red-550);
}

.border-l-red-550-dark {
  border-left-color: var(--sc-color-red-550-dark);
}

.border-l-red-600 {
  border-left-color: var(--sc-color-red-600);
}

.border-l-red-600-dark {
  border-left-color: var(--sc-color-red-600-dark);
}

.border-l-red-650 {
  border-left-color: var(--sc-color-red-650);
}

.border-l-red-650-dark {
  border-left-color: var(--sc-color-red-650-dark);
}

.border-l-red-700 {
  border-left-color: var(--sc-color-red-700);
}

.border-l-red-700-dark {
  border-left-color: var(--sc-color-red-700-dark);
}

.border-l-red-750 {
  border-left-color: var(--sc-color-red-750);
}

.border-l-red-750-dark {
  border-left-color: var(--sc-color-red-750-dark);
}

.border-l-red-800 {
  border-left-color: var(--sc-color-red-800);
}

.border-l-red-800-dark {
  border-left-color: var(--sc-color-red-800-dark);
}

.border-l-red-850 {
  border-left-color: var(--sc-color-red-850);
}

.border-l-red-850-dark {
  border-left-color: var(--sc-color-red-850-dark);
}

.border-l-red-900 {
  border-left-color: var(--sc-color-red-900);
}

.border-l-red-900-dark {
  border-left-color: var(--sc-color-red-900-dark);
}

.border-l-red-950 {
  border-left-color: var(--sc-color-red-950);
}

.border-l-red-950-dark {
  border-left-color: var(--sc-color-red-950-dark);
}

.border-l-teal-100 {
  border-left-color: var(--sc-color-teal-100);
}

.border-l-teal-500 {
  border-left-color: var(--sc-color-teal-500);
}

.border-l-transparent {
  border-left-color: transparent;
}

.border-l-transparent\/0 {
  border-left-color: rgb(0 0 0 / 0);
}

.border-l-transparent\/10 {
  border-left-color: rgb(0 0 0 / 0.1);
}

.border-l-transparent\/100 {
  border-left-color: rgb(0 0 0 / 1);
}

.border-l-transparent\/15 {
  border-left-color: rgb(0 0 0 / 0.15);
}

.border-l-transparent\/20 {
  border-left-color: rgb(0 0 0 / 0.2);
}

.border-l-transparent\/25 {
  border-left-color: rgb(0 0 0 / 0.25);
}

.border-l-transparent\/30 {
  border-left-color: rgb(0 0 0 / 0.3);
}

.border-l-transparent\/35 {
  border-left-color: rgb(0 0 0 / 0.35);
}

.border-l-transparent\/40 {
  border-left-color: rgb(0 0 0 / 0.4);
}

.border-l-transparent\/45 {
  border-left-color: rgb(0 0 0 / 0.45);
}

.border-l-transparent\/5 {
  border-left-color: rgb(0 0 0 / 0.05);
}

.border-l-transparent\/50 {
  border-left-color: rgb(0 0 0 / 0.5);
}

.border-l-transparent\/55 {
  border-left-color: rgb(0 0 0 / 0.55);
}

.border-l-transparent\/60 {
  border-left-color: rgb(0 0 0 / 0.6);
}

.border-l-transparent\/65 {
  border-left-color: rgb(0 0 0 / 0.65);
}

.border-l-transparent\/70 {
  border-left-color: rgb(0 0 0 / 0.7);
}

.border-l-transparent\/75 {
  border-left-color: rgb(0 0 0 / 0.75);
}

.border-l-transparent\/80 {
  border-left-color: rgb(0 0 0 / 0.8);
}

.border-l-transparent\/85 {
  border-left-color: rgb(0 0 0 / 0.85);
}

.border-l-transparent\/90 {
  border-left-color: rgb(0 0 0 / 0.9);
}

.border-l-transparent\/95 {
  border-left-color: rgb(0 0 0 / 0.95);
}

.border-l-white {
  border-left-color: var(--sc-color-white);
}

.border-r-amber-100 {
  border-right-color: var(--sc-color-amber-100);
}

.border-r-amber-100-dark {
  border-right-color: var(--sc-color-amber-100-dark);
}

.border-r-amber-150 {
  border-right-color: var(--sc-color-amber-150);
}

.border-r-amber-150-dark {
  border-right-color: var(--sc-color-amber-150-dark);
}

.border-r-amber-200 {
  border-right-color: var(--sc-color-amber-200);
}

.border-r-amber-200-dark {
  border-right-color: var(--sc-color-amber-200-dark);
}

.border-r-amber-250 {
  border-right-color: var(--sc-color-amber-250);
}

.border-r-amber-250-dark {
  border-right-color: var(--sc-color-amber-250-dark);
}

.border-r-amber-300 {
  border-right-color: var(--sc-color-amber-300);
}

.border-r-amber-300-dark {
  border-right-color: var(--sc-color-amber-300-dark);
}

.border-r-amber-350 {
  border-right-color: var(--sc-color-amber-350);
}

.border-r-amber-350-dark {
  border-right-color: var(--sc-color-amber-350-dark);
}

.border-r-amber-400 {
  border-right-color: var(--sc-color-amber-400);
}

.border-r-amber-400-dark {
  border-right-color: var(--sc-color-amber-400-dark);
}

.border-r-amber-450 {
  border-right-color: var(--sc-color-amber-450);
}

.border-r-amber-450-dark {
  border-right-color: var(--sc-color-amber-450-dark);
}

.border-r-amber-50 {
  border-right-color: var(--sc-color-amber-50);
}

.border-r-amber-50-dark {
  border-right-color: var(--sc-color-amber-50-dark);
}

.border-r-amber-500 {
  border-right-color: var(--sc-color-amber-500);
}

.border-r-amber-500-dark {
  border-right-color: var(--sc-color-amber-500-dark);
}

.border-r-amber-550 {
  border-right-color: var(--sc-color-amber-550);
}

.border-r-amber-550-dark {
  border-right-color: var(--sc-color-amber-550-dark);
}

.border-r-amber-600 {
  border-right-color: var(--sc-color-amber-600);
}

.border-r-amber-600-dark {
  border-right-color: var(--sc-color-amber-600-dark);
}

.border-r-amber-650 {
  border-right-color: var(--sc-color-amber-650);
}

.border-r-amber-650-dark {
  border-right-color: var(--sc-color-amber-650-dark);
}

.border-r-amber-700 {
  border-right-color: var(--sc-color-amber-700);
}

.border-r-amber-700-dark {
  border-right-color: var(--sc-color-amber-700-dark);
}

.border-r-amber-750 {
  border-right-color: var(--sc-color-amber-750);
}

.border-r-amber-750-dark {
  border-right-color: var(--sc-color-amber-750-dark);
}

.border-r-amber-800 {
  border-right-color: var(--sc-color-amber-800);
}

.border-r-amber-800-dark {
  border-right-color: var(--sc-color-amber-800-dark);
}

.border-r-amber-850 {
  border-right-color: var(--sc-color-amber-850);
}

.border-r-amber-850-dark {
  border-right-color: var(--sc-color-amber-850-dark);
}

.border-r-amber-900 {
  border-right-color: var(--sc-color-amber-900);
}

.border-r-amber-900-dark {
  border-right-color: var(--sc-color-amber-900-dark);
}

.border-r-amber-950 {
  border-right-color: var(--sc-color-amber-950);
}

.border-r-amber-950-dark {
  border-right-color: var(--sc-color-amber-950-dark);
}

.border-r-blue-100 {
  border-right-color: var(--sc-color-blue-100);
}

.border-r-blue-100-dark {
  border-right-color: var(--sc-color-blue-100-dark);
}

.border-r-blue-150 {
  border-right-color: var(--sc-color-blue-150);
}

.border-r-blue-150-dark {
  border-right-color: var(--sc-color-blue-150-dark);
}

.border-r-blue-200 {
  border-right-color: var(--sc-color-blue-200);
}

.border-r-blue-200-dark {
  border-right-color: var(--sc-color-blue-200-dark);
}

.border-r-blue-250 {
  border-right-color: var(--sc-color-blue-250);
}

.border-r-blue-250-dark {
  border-right-color: var(--sc-color-blue-250-dark);
}

.border-r-blue-300 {
  border-right-color: var(--sc-color-blue-300);
}

.border-r-blue-300-dark {
  border-right-color: var(--sc-color-blue-300-dark);
}

.border-r-blue-350 {
  border-right-color: var(--sc-color-blue-350);
}

.border-r-blue-350-dark {
  border-right-color: var(--sc-color-blue-350-dark);
}

.border-r-blue-400 {
  border-right-color: var(--sc-color-blue-400);
}

.border-r-blue-400-dark {
  border-right-color: var(--sc-color-blue-400-dark);
}

.border-r-blue-450 {
  border-right-color: var(--sc-color-blue-450);
}

.border-r-blue-450-dark {
  border-right-color: var(--sc-color-blue-450-dark);
}

.border-r-blue-50 {
  border-right-color: var(--sc-color-blue-50);
}

.border-r-blue-50-dark {
  border-right-color: var(--sc-color-blue-50-dark);
}

.border-r-blue-500 {
  border-right-color: var(--sc-color-blue-500);
}

.border-r-blue-500-dark {
  border-right-color: var(--sc-color-blue-500-dark);
}

.border-r-blue-550 {
  border-right-color: var(--sc-color-blue-550);
}

.border-r-blue-550-dark {
  border-right-color: var(--sc-color-blue-550-dark);
}

.border-r-blue-600 {
  border-right-color: var(--sc-color-blue-600);
}

.border-r-blue-600-dark {
  border-right-color: var(--sc-color-blue-600-dark);
}

.border-r-blue-650 {
  border-right-color: var(--sc-color-blue-650);
}

.border-r-blue-650-dark {
  border-right-color: var(--sc-color-blue-650-dark);
}

.border-r-blue-700 {
  border-right-color: var(--sc-color-blue-700);
}

.border-r-blue-700-dark {
  border-right-color: var(--sc-color-blue-700-dark);
}

.border-r-blue-750 {
  border-right-color: var(--sc-color-blue-750);
}

.border-r-blue-750-dark {
  border-right-color: var(--sc-color-blue-750-dark);
}

.border-r-blue-800 {
  border-right-color: var(--sc-color-blue-800);
}

.border-r-blue-800-dark {
  border-right-color: var(--sc-color-blue-800-dark);
}

.border-r-blue-850 {
  border-right-color: var(--sc-color-blue-850);
}

.border-r-blue-850-dark {
  border-right-color: var(--sc-color-blue-850-dark);
}

.border-r-blue-900 {
  border-right-color: var(--sc-color-blue-900);
}

.border-r-blue-900-dark {
  border-right-color: var(--sc-color-blue-900-dark);
}

.border-r-blue-950 {
  border-right-color: var(--sc-color-blue-950);
}

.border-r-blue-950-dark {
  border-right-color: var(--sc-color-blue-950-dark);
}

.border-r-current {
  border-right-color: currentColor;
}

.border-r-green-100 {
  border-right-color: var(--sc-color-green-100);
}

.border-r-green-100-dark {
  border-right-color: var(--sc-color-green-100-dark);
}

.border-r-green-150 {
  border-right-color: var(--sc-color-green-150);
}

.border-r-green-150-dark {
  border-right-color: var(--sc-color-green-150-dark);
}

.border-r-green-200 {
  border-right-color: var(--sc-color-green-200);
}

.border-r-green-200-dark {
  border-right-color: var(--sc-color-green-200-dark);
}

.border-r-green-250 {
  border-right-color: var(--sc-color-green-250);
}

.border-r-green-250-dark {
  border-right-color: var(--sc-color-green-250-dark);
}

.border-r-green-300 {
  border-right-color: var(--sc-color-green-300);
}

.border-r-green-300-dark {
  border-right-color: var(--sc-color-green-300-dark);
}

.border-r-green-350 {
  border-right-color: var(--sc-color-green-350);
}

.border-r-green-350-dark {
  border-right-color: var(--sc-color-green-350-dark);
}

.border-r-green-400 {
  border-right-color: var(--sc-color-green-400);
}

.border-r-green-400-dark {
  border-right-color: var(--sc-color-green-400-dark);
}

.border-r-green-450 {
  border-right-color: var(--sc-color-green-450);
}

.border-r-green-450-dark {
  border-right-color: var(--sc-color-green-450-dark);
}

.border-r-green-50 {
  border-right-color: var(--sc-color-green-50);
}

.border-r-green-50-dark {
  border-right-color: var(--sc-color-green-50-dark);
}

.border-r-green-500 {
  border-right-color: var(--sc-color-green-500);
}

.border-r-green-500-dark {
  border-right-color: var(--sc-color-green-500-dark);
}

.border-r-green-550 {
  border-right-color: var(--sc-color-green-550);
}

.border-r-green-550-dark {
  border-right-color: var(--sc-color-green-550-dark);
}

.border-r-green-600 {
  border-right-color: var(--sc-color-green-600);
}

.border-r-green-600-dark {
  border-right-color: var(--sc-color-green-600-dark);
}

.border-r-green-650 {
  border-right-color: var(--sc-color-green-650);
}

.border-r-green-650-dark {
  border-right-color: var(--sc-color-green-650-dark);
}

.border-r-green-700 {
  border-right-color: var(--sc-color-green-700);
}

.border-r-green-700-dark {
  border-right-color: var(--sc-color-green-700-dark);
}

.border-r-green-750 {
  border-right-color: var(--sc-color-green-750);
}

.border-r-green-750-dark {
  border-right-color: var(--sc-color-green-750-dark);
}

.border-r-green-800 {
  border-right-color: var(--sc-color-green-800);
}

.border-r-green-800-dark {
  border-right-color: var(--sc-color-green-800-dark);
}

.border-r-green-850 {
  border-right-color: var(--sc-color-green-850);
}

.border-r-green-850-dark {
  border-right-color: var(--sc-color-green-850-dark);
}

.border-r-green-900 {
  border-right-color: var(--sc-color-green-900);
}

.border-r-green-900-dark {
  border-right-color: var(--sc-color-green-900-dark);
}

.border-r-green-950 {
  border-right-color: var(--sc-color-green-950);
}

.border-r-green-950-dark {
  border-right-color: var(--sc-color-green-950-dark);
}

.border-r-grey-100 {
  border-right-color: var(--sc-color-grey-100);
}

.border-r-grey-100-dark {
  border-right-color: var(--sc-color-grey-100-dark);
}

.border-r-grey-150 {
  border-right-color: var(--sc-color-grey-150);
}

.border-r-grey-150-dark {
  border-right-color: var(--sc-color-grey-150-dark);
}

.border-r-grey-200 {
  border-right-color: var(--sc-color-grey-200);
}

.border-r-grey-200-dark {
  border-right-color: var(--sc-color-grey-200-dark);
}

.border-r-grey-250 {
  border-right-color: var(--sc-color-grey-250);
}

.border-r-grey-250-dark {
  border-right-color: var(--sc-color-grey-250-dark);
}

.border-r-grey-300 {
  border-right-color: var(--sc-color-grey-300);
}

.border-r-grey-300-dark {
  border-right-color: var(--sc-color-grey-300-dark);
}

.border-r-grey-350 {
  border-right-color: var(--sc-color-grey-350);
}

.border-r-grey-350-dark {
  border-right-color: var(--sc-color-grey-350-dark);
}

.border-r-grey-400 {
  border-right-color: var(--sc-color-grey-400);
}

.border-r-grey-400-dark {
  border-right-color: var(--sc-color-grey-400-dark);
}

.border-r-grey-450 {
  border-right-color: var(--sc-color-grey-450);
}

.border-r-grey-450-dark {
  border-right-color: var(--sc-color-grey-450-dark);
}

.border-r-grey-50 {
  border-right-color: var(--sc-color-grey-50);
}

.border-r-grey-50-dark {
  border-right-color: var(--sc-color-grey-50-dark);
}

.border-r-grey-500 {
  border-right-color: var(--sc-color-grey-500);
}

.border-r-grey-500-dark {
  border-right-color: var(--sc-color-grey-500-dark);
}

.border-r-grey-550 {
  border-right-color: var(--sc-color-grey-550);
}

.border-r-grey-550-dark {
  border-right-color: var(--sc-color-grey-550-dark);
}

.border-r-grey-600 {
  border-right-color: var(--sc-color-grey-600);
}

.border-r-grey-600-dark {
  border-right-color: var(--sc-color-grey-600-dark);
}

.border-r-grey-650 {
  border-right-color: var(--sc-color-grey-650);
}

.border-r-grey-650-dark {
  border-right-color: var(--sc-color-grey-650-dark);
}

.border-r-grey-700 {
  border-right-color: var(--sc-color-grey-700);
}

.border-r-grey-700-dark {
  border-right-color: var(--sc-color-grey-700-dark);
}

.border-r-grey-750 {
  border-right-color: var(--sc-color-grey-750);
}

.border-r-grey-750-dark {
  border-right-color: var(--sc-color-grey-750-dark);
}

.border-r-grey-800 {
  border-right-color: var(--sc-color-grey-800);
}

.border-r-grey-800-dark {
  border-right-color: var(--sc-color-grey-800-dark);
}

.border-r-grey-850 {
  border-right-color: var(--sc-color-grey-850);
}

.border-r-grey-850-dark {
  border-right-color: var(--sc-color-grey-850-dark);
}

.border-r-grey-900 {
  border-right-color: var(--sc-color-grey-900);
}

.border-r-grey-900-dark {
  border-right-color: var(--sc-color-grey-900-dark);
}

.border-r-grey-950 {
  border-right-color: var(--sc-color-grey-950);
}

.border-r-grey-950-dark {
  border-right-color: var(--sc-color-grey-950-dark);
}

.border-r-grey-black {
  border-right-color: var(--sc-color-black);
}

.border-r-muted {
  border-right-color: var(--sc-color-blue-900);
}

.border-r-orange-500 {
  border-right-color: var(--sc-color-orange-500);
}

.border-r-primary {
  border-right-color: var(--sc-color-blue);
}

.border-r-purple-100 {
  border-right-color: var(--sc-color-purple-100);
}

.border-r-purple-100-dark {
  border-right-color: var(--sc-color-purple-100-dark);
}

.border-r-purple-150 {
  border-right-color: var(--sc-color-purple-150);
}

.border-r-purple-150-dark {
  border-right-color: var(--sc-color-purple-150-dark);
}

.border-r-purple-200 {
  border-right-color: var(--sc-color-purple-200);
}

.border-r-purple-200-dark {
  border-right-color: var(--sc-color-purple-200-dark);
}

.border-r-purple-250 {
  border-right-color: var(--sc-color-purple-250);
}

.border-r-purple-250-dark {
  border-right-color: var(--sc-color-purple-250-dark);
}

.border-r-purple-300 {
  border-right-color: var(--sc-color-purple-300);
}

.border-r-purple-300-dark {
  border-right-color: var(--sc-color-purple-300-dark);
}

.border-r-purple-350 {
  border-right-color: var(--sc-color-purple-350);
}

.border-r-purple-350-dark {
  border-right-color: var(--sc-color-purple-350-dark);
}

.border-r-purple-400 {
  border-right-color: var(--sc-color-purple-400);
}

.border-r-purple-400-dark {
  border-right-color: var(--sc-color-purple-400-dark);
}

.border-r-purple-450 {
  border-right-color: var(--sc-color-purple-450);
}

.border-r-purple-450-dark {
  border-right-color: var(--sc-color-purple-450-dark);
}

.border-r-purple-50 {
  border-right-color: var(--sc-color-purple-50);
}

.border-r-purple-50-dark {
  border-right-color: var(--sc-color-purple-50-dark);
}

.border-r-purple-500 {
  border-right-color: var(--sc-color-purple-500);
}

.border-r-purple-500-dark {
  border-right-color: var(--sc-color-purple-500-dark);
}

.border-r-purple-550 {
  border-right-color: var(--sc-color-purple-550);
}

.border-r-purple-550-dark {
  border-right-color: var(--sc-color-purple-550-dark);
}

.border-r-purple-600 {
  border-right-color: var(--sc-color-purple-600);
}

.border-r-purple-600-dark {
  border-right-color: var(--sc-color-purple-600-dark);
}

.border-r-purple-650 {
  border-right-color: var(--sc-color-purple-650);
}

.border-r-purple-650-dark {
  border-right-color: var(--sc-color-purple-650-dark);
}

.border-r-purple-700 {
  border-right-color: var(--sc-color-purple-700);
}

.border-r-purple-700-dark {
  border-right-color: var(--sc-color-purple-700-dark);
}

.border-r-purple-750 {
  border-right-color: var(--sc-color-purple-750);
}

.border-r-purple-750-dark {
  border-right-color: var(--sc-color-purple-750-dark);
}

.border-r-purple-800 {
  border-right-color: var(--sc-color-purple-800);
}

.border-r-purple-800-dark {
  border-right-color: var(--sc-color-purple-800-dark);
}

.border-r-purple-850 {
  border-right-color: var(--sc-color-purple-850);
}

.border-r-purple-850-dark {
  border-right-color: var(--sc-color-purple-850-dark);
}

.border-r-purple-900 {
  border-right-color: var(--sc-color-purple-900);
}

.border-r-purple-900-dark {
  border-right-color: var(--sc-color-purple-900-dark);
}

.border-r-purple-950 {
  border-right-color: var(--sc-color-purple-950);
}

.border-r-purple-950-dark {
  border-right-color: var(--sc-color-purple-950-dark);
}

.border-r-red-100 {
  border-right-color: var(--sc-color-red-100);
}

.border-r-red-100-dark {
  border-right-color: var(--sc-color-red-100-dark);
}

.border-r-red-150 {
  border-right-color: var(--sc-color-red-150);
}

.border-r-red-150-dark {
  border-right-color: var(--sc-color-red-150-dark);
}

.border-r-red-200 {
  border-right-color: var(--sc-color-red-200);
}

.border-r-red-200-dark {
  border-right-color: var(--sc-color-red-200-dark);
}

.border-r-red-250 {
  border-right-color: var(--sc-color-red-250);
}

.border-r-red-250-dark {
  border-right-color: var(--sc-color-red-250-dark);
}

.border-r-red-300 {
  border-right-color: var(--sc-color-red-300);
}

.border-r-red-300-dark {
  border-right-color: var(--sc-color-red-300-dark);
}

.border-r-red-350 {
  border-right-color: var(--sc-color-red-350);
}

.border-r-red-350-dark {
  border-right-color: var(--sc-color-red-350-dark);
}

.border-r-red-400 {
  border-right-color: var(--sc-color-red-400);
}

.border-r-red-400-dark {
  border-right-color: var(--sc-color-red-400-dark);
}

.border-r-red-450 {
  border-right-color: var(--sc-color-red-450);
}

.border-r-red-450-dark {
  border-right-color: var(--sc-color-red-450-dark);
}

.border-r-red-50 {
  border-right-color: var(--sc-color-red-50);
}

.border-r-red-50-dark {
  border-right-color: var(--sc-color-red-50-dark);
}

.border-r-red-500 {
  border-right-color: var(--sc-color-red-500);
}

.border-r-red-500-dark {
  border-right-color: var(--sc-color-red-500-dark);
}

.border-r-red-550 {
  border-right-color: var(--sc-color-red-550);
}

.border-r-red-550-dark {
  border-right-color: var(--sc-color-red-550-dark);
}

.border-r-red-600 {
  border-right-color: var(--sc-color-red-600);
}

.border-r-red-600-dark {
  border-right-color: var(--sc-color-red-600-dark);
}

.border-r-red-650 {
  border-right-color: var(--sc-color-red-650);
}

.border-r-red-650-dark {
  border-right-color: var(--sc-color-red-650-dark);
}

.border-r-red-700 {
  border-right-color: var(--sc-color-red-700);
}

.border-r-red-700-dark {
  border-right-color: var(--sc-color-red-700-dark);
}

.border-r-red-750 {
  border-right-color: var(--sc-color-red-750);
}

.border-r-red-750-dark {
  border-right-color: var(--sc-color-red-750-dark);
}

.border-r-red-800 {
  border-right-color: var(--sc-color-red-800);
}

.border-r-red-800-dark {
  border-right-color: var(--sc-color-red-800-dark);
}

.border-r-red-850 {
  border-right-color: var(--sc-color-red-850);
}

.border-r-red-850-dark {
  border-right-color: var(--sc-color-red-850-dark);
}

.border-r-red-900 {
  border-right-color: var(--sc-color-red-900);
}

.border-r-red-900-dark {
  border-right-color: var(--sc-color-red-900-dark);
}

.border-r-red-950 {
  border-right-color: var(--sc-color-red-950);
}

.border-r-red-950-dark {
  border-right-color: var(--sc-color-red-950-dark);
}

.border-r-teal-100 {
  border-right-color: var(--sc-color-teal-100);
}

.border-r-teal-500 {
  border-right-color: var(--sc-color-teal-500);
}

.border-r-transparent {
  border-right-color: transparent;
}

.border-r-transparent\/0 {
  border-right-color: rgb(0 0 0 / 0);
}

.border-r-transparent\/10 {
  border-right-color: rgb(0 0 0 / 0.1);
}

.border-r-transparent\/100 {
  border-right-color: rgb(0 0 0 / 1);
}

.border-r-transparent\/15 {
  border-right-color: rgb(0 0 0 / 0.15);
}

.border-r-transparent\/20 {
  border-right-color: rgb(0 0 0 / 0.2);
}

.border-r-transparent\/25 {
  border-right-color: rgb(0 0 0 / 0.25);
}

.border-r-transparent\/30 {
  border-right-color: rgb(0 0 0 / 0.3);
}

.border-r-transparent\/35 {
  border-right-color: rgb(0 0 0 / 0.35);
}

.border-r-transparent\/40 {
  border-right-color: rgb(0 0 0 / 0.4);
}

.border-r-transparent\/45 {
  border-right-color: rgb(0 0 0 / 0.45);
}

.border-r-transparent\/5 {
  border-right-color: rgb(0 0 0 / 0.05);
}

.border-r-transparent\/50 {
  border-right-color: rgb(0 0 0 / 0.5);
}

.border-r-transparent\/55 {
  border-right-color: rgb(0 0 0 / 0.55);
}

.border-r-transparent\/60 {
  border-right-color: rgb(0 0 0 / 0.6);
}

.border-r-transparent\/65 {
  border-right-color: rgb(0 0 0 / 0.65);
}

.border-r-transparent\/70 {
  border-right-color: rgb(0 0 0 / 0.7);
}

.border-r-transparent\/75 {
  border-right-color: rgb(0 0 0 / 0.75);
}

.border-r-transparent\/80 {
  border-right-color: rgb(0 0 0 / 0.8);
}

.border-r-transparent\/85 {
  border-right-color: rgb(0 0 0 / 0.85);
}

.border-r-transparent\/90 {
  border-right-color: rgb(0 0 0 / 0.9);
}

.border-r-transparent\/95 {
  border-right-color: rgb(0 0 0 / 0.95);
}

.border-r-white {
  border-right-color: var(--sc-color-white);
}

.border-s-amber-100 {
  border-inline-start-color: var(--sc-color-amber-100);
}

.border-s-amber-100-dark {
  border-inline-start-color: var(--sc-color-amber-100-dark);
}

.border-s-amber-150 {
  border-inline-start-color: var(--sc-color-amber-150);
}

.border-s-amber-150-dark {
  border-inline-start-color: var(--sc-color-amber-150-dark);
}

.border-s-amber-200 {
  border-inline-start-color: var(--sc-color-amber-200);
}

.border-s-amber-200-dark {
  border-inline-start-color: var(--sc-color-amber-200-dark);
}

.border-s-amber-250 {
  border-inline-start-color: var(--sc-color-amber-250);
}

.border-s-amber-250-dark {
  border-inline-start-color: var(--sc-color-amber-250-dark);
}

.border-s-amber-300 {
  border-inline-start-color: var(--sc-color-amber-300);
}

.border-s-amber-300-dark {
  border-inline-start-color: var(--sc-color-amber-300-dark);
}

.border-s-amber-350 {
  border-inline-start-color: var(--sc-color-amber-350);
}

.border-s-amber-350-dark {
  border-inline-start-color: var(--sc-color-amber-350-dark);
}

.border-s-amber-400 {
  border-inline-start-color: var(--sc-color-amber-400);
}

.border-s-amber-400-dark {
  border-inline-start-color: var(--sc-color-amber-400-dark);
}

.border-s-amber-450 {
  border-inline-start-color: var(--sc-color-amber-450);
}

.border-s-amber-450-dark {
  border-inline-start-color: var(--sc-color-amber-450-dark);
}

.border-s-amber-50 {
  border-inline-start-color: var(--sc-color-amber-50);
}

.border-s-amber-50-dark {
  border-inline-start-color: var(--sc-color-amber-50-dark);
}

.border-s-amber-500 {
  border-inline-start-color: var(--sc-color-amber-500);
}

.border-s-amber-500-dark {
  border-inline-start-color: var(--sc-color-amber-500-dark);
}

.border-s-amber-550 {
  border-inline-start-color: var(--sc-color-amber-550);
}

.border-s-amber-550-dark {
  border-inline-start-color: var(--sc-color-amber-550-dark);
}

.border-s-amber-600 {
  border-inline-start-color: var(--sc-color-amber-600);
}

.border-s-amber-600-dark {
  border-inline-start-color: var(--sc-color-amber-600-dark);
}

.border-s-amber-650 {
  border-inline-start-color: var(--sc-color-amber-650);
}

.border-s-amber-650-dark {
  border-inline-start-color: var(--sc-color-amber-650-dark);
}

.border-s-amber-700 {
  border-inline-start-color: var(--sc-color-amber-700);
}

.border-s-amber-700-dark {
  border-inline-start-color: var(--sc-color-amber-700-dark);
}

.border-s-amber-750 {
  border-inline-start-color: var(--sc-color-amber-750);
}

.border-s-amber-750-dark {
  border-inline-start-color: var(--sc-color-amber-750-dark);
}

.border-s-amber-800 {
  border-inline-start-color: var(--sc-color-amber-800);
}

.border-s-amber-800-dark {
  border-inline-start-color: var(--sc-color-amber-800-dark);
}

.border-s-amber-850 {
  border-inline-start-color: var(--sc-color-amber-850);
}

.border-s-amber-850-dark {
  border-inline-start-color: var(--sc-color-amber-850-dark);
}

.border-s-amber-900 {
  border-inline-start-color: var(--sc-color-amber-900);
}

.border-s-amber-900-dark {
  border-inline-start-color: var(--sc-color-amber-900-dark);
}

.border-s-amber-950 {
  border-inline-start-color: var(--sc-color-amber-950);
}

.border-s-amber-950-dark {
  border-inline-start-color: var(--sc-color-amber-950-dark);
}

.border-s-blue-100 {
  border-inline-start-color: var(--sc-color-blue-100);
}

.border-s-blue-100-dark {
  border-inline-start-color: var(--sc-color-blue-100-dark);
}

.border-s-blue-150 {
  border-inline-start-color: var(--sc-color-blue-150);
}

.border-s-blue-150-dark {
  border-inline-start-color: var(--sc-color-blue-150-dark);
}

.border-s-blue-200 {
  border-inline-start-color: var(--sc-color-blue-200);
}

.border-s-blue-200-dark {
  border-inline-start-color: var(--sc-color-blue-200-dark);
}

.border-s-blue-250 {
  border-inline-start-color: var(--sc-color-blue-250);
}

.border-s-blue-250-dark {
  border-inline-start-color: var(--sc-color-blue-250-dark);
}

.border-s-blue-300 {
  border-inline-start-color: var(--sc-color-blue-300);
}

.border-s-blue-300-dark {
  border-inline-start-color: var(--sc-color-blue-300-dark);
}

.border-s-blue-350 {
  border-inline-start-color: var(--sc-color-blue-350);
}

.border-s-blue-350-dark {
  border-inline-start-color: var(--sc-color-blue-350-dark);
}

.border-s-blue-400 {
  border-inline-start-color: var(--sc-color-blue-400);
}

.border-s-blue-400-dark {
  border-inline-start-color: var(--sc-color-blue-400-dark);
}

.border-s-blue-450 {
  border-inline-start-color: var(--sc-color-blue-450);
}

.border-s-blue-450-dark {
  border-inline-start-color: var(--sc-color-blue-450-dark);
}

.border-s-blue-50 {
  border-inline-start-color: var(--sc-color-blue-50);
}

.border-s-blue-50-dark {
  border-inline-start-color: var(--sc-color-blue-50-dark);
}

.border-s-blue-500 {
  border-inline-start-color: var(--sc-color-blue-500);
}

.border-s-blue-500-dark {
  border-inline-start-color: var(--sc-color-blue-500-dark);
}

.border-s-blue-550 {
  border-inline-start-color: var(--sc-color-blue-550);
}

.border-s-blue-550-dark {
  border-inline-start-color: var(--sc-color-blue-550-dark);
}

.border-s-blue-600 {
  border-inline-start-color: var(--sc-color-blue-600);
}

.border-s-blue-600-dark {
  border-inline-start-color: var(--sc-color-blue-600-dark);
}

.border-s-blue-650 {
  border-inline-start-color: var(--sc-color-blue-650);
}

.border-s-blue-650-dark {
  border-inline-start-color: var(--sc-color-blue-650-dark);
}

.border-s-blue-700 {
  border-inline-start-color: var(--sc-color-blue-700);
}

.border-s-blue-700-dark {
  border-inline-start-color: var(--sc-color-blue-700-dark);
}

.border-s-blue-750 {
  border-inline-start-color: var(--sc-color-blue-750);
}

.border-s-blue-750-dark {
  border-inline-start-color: var(--sc-color-blue-750-dark);
}

.border-s-blue-800 {
  border-inline-start-color: var(--sc-color-blue-800);
}

.border-s-blue-800-dark {
  border-inline-start-color: var(--sc-color-blue-800-dark);
}

.border-s-blue-850 {
  border-inline-start-color: var(--sc-color-blue-850);
}

.border-s-blue-850-dark {
  border-inline-start-color: var(--sc-color-blue-850-dark);
}

.border-s-blue-900 {
  border-inline-start-color: var(--sc-color-blue-900);
}

.border-s-blue-900-dark {
  border-inline-start-color: var(--sc-color-blue-900-dark);
}

.border-s-blue-950 {
  border-inline-start-color: var(--sc-color-blue-950);
}

.border-s-blue-950-dark {
  border-inline-start-color: var(--sc-color-blue-950-dark);
}

.border-s-current {
  border-inline-start-color: currentColor;
}

.border-s-green-100 {
  border-inline-start-color: var(--sc-color-green-100);
}

.border-s-green-100-dark {
  border-inline-start-color: var(--sc-color-green-100-dark);
}

.border-s-green-150 {
  border-inline-start-color: var(--sc-color-green-150);
}

.border-s-green-150-dark {
  border-inline-start-color: var(--sc-color-green-150-dark);
}

.border-s-green-200 {
  border-inline-start-color: var(--sc-color-green-200);
}

.border-s-green-200-dark {
  border-inline-start-color: var(--sc-color-green-200-dark);
}

.border-s-green-250 {
  border-inline-start-color: var(--sc-color-green-250);
}

.border-s-green-250-dark {
  border-inline-start-color: var(--sc-color-green-250-dark);
}

.border-s-green-300 {
  border-inline-start-color: var(--sc-color-green-300);
}

.border-s-green-300-dark {
  border-inline-start-color: var(--sc-color-green-300-dark);
}

.border-s-green-350 {
  border-inline-start-color: var(--sc-color-green-350);
}

.border-s-green-350-dark {
  border-inline-start-color: var(--sc-color-green-350-dark);
}

.border-s-green-400 {
  border-inline-start-color: var(--sc-color-green-400);
}

.border-s-green-400-dark {
  border-inline-start-color: var(--sc-color-green-400-dark);
}

.border-s-green-450 {
  border-inline-start-color: var(--sc-color-green-450);
}

.border-s-green-450-dark {
  border-inline-start-color: var(--sc-color-green-450-dark);
}

.border-s-green-50 {
  border-inline-start-color: var(--sc-color-green-50);
}

.border-s-green-50-dark {
  border-inline-start-color: var(--sc-color-green-50-dark);
}

.border-s-green-500 {
  border-inline-start-color: var(--sc-color-green-500);
}

.border-s-green-500-dark {
  border-inline-start-color: var(--sc-color-green-500-dark);
}

.border-s-green-550 {
  border-inline-start-color: var(--sc-color-green-550);
}

.border-s-green-550-dark {
  border-inline-start-color: var(--sc-color-green-550-dark);
}

.border-s-green-600 {
  border-inline-start-color: var(--sc-color-green-600);
}

.border-s-green-600-dark {
  border-inline-start-color: var(--sc-color-green-600-dark);
}

.border-s-green-650 {
  border-inline-start-color: var(--sc-color-green-650);
}

.border-s-green-650-dark {
  border-inline-start-color: var(--sc-color-green-650-dark);
}

.border-s-green-700 {
  border-inline-start-color: var(--sc-color-green-700);
}

.border-s-green-700-dark {
  border-inline-start-color: var(--sc-color-green-700-dark);
}

.border-s-green-750 {
  border-inline-start-color: var(--sc-color-green-750);
}

.border-s-green-750-dark {
  border-inline-start-color: var(--sc-color-green-750-dark);
}

.border-s-green-800 {
  border-inline-start-color: var(--sc-color-green-800);
}

.border-s-green-800-dark {
  border-inline-start-color: var(--sc-color-green-800-dark);
}

.border-s-green-850 {
  border-inline-start-color: var(--sc-color-green-850);
}

.border-s-green-850-dark {
  border-inline-start-color: var(--sc-color-green-850-dark);
}

.border-s-green-900 {
  border-inline-start-color: var(--sc-color-green-900);
}

.border-s-green-900-dark {
  border-inline-start-color: var(--sc-color-green-900-dark);
}

.border-s-green-950 {
  border-inline-start-color: var(--sc-color-green-950);
}

.border-s-green-950-dark {
  border-inline-start-color: var(--sc-color-green-950-dark);
}

.border-s-grey-100 {
  border-inline-start-color: var(--sc-color-grey-100);
}

.border-s-grey-100-dark {
  border-inline-start-color: var(--sc-color-grey-100-dark);
}

.border-s-grey-150 {
  border-inline-start-color: var(--sc-color-grey-150);
}

.border-s-grey-150-dark {
  border-inline-start-color: var(--sc-color-grey-150-dark);
}

.border-s-grey-200 {
  border-inline-start-color: var(--sc-color-grey-200);
}

.border-s-grey-200-dark {
  border-inline-start-color: var(--sc-color-grey-200-dark);
}

.border-s-grey-250 {
  border-inline-start-color: var(--sc-color-grey-250);
}

.border-s-grey-250-dark {
  border-inline-start-color: var(--sc-color-grey-250-dark);
}

.border-s-grey-300 {
  border-inline-start-color: var(--sc-color-grey-300);
}

.border-s-grey-300-dark {
  border-inline-start-color: var(--sc-color-grey-300-dark);
}

.border-s-grey-350 {
  border-inline-start-color: var(--sc-color-grey-350);
}

.border-s-grey-350-dark {
  border-inline-start-color: var(--sc-color-grey-350-dark);
}

.border-s-grey-400 {
  border-inline-start-color: var(--sc-color-grey-400);
}

.border-s-grey-400-dark {
  border-inline-start-color: var(--sc-color-grey-400-dark);
}

.border-s-grey-450 {
  border-inline-start-color: var(--sc-color-grey-450);
}

.border-s-grey-450-dark {
  border-inline-start-color: var(--sc-color-grey-450-dark);
}

.border-s-grey-50 {
  border-inline-start-color: var(--sc-color-grey-50);
}

.border-s-grey-50-dark {
  border-inline-start-color: var(--sc-color-grey-50-dark);
}

.border-s-grey-500 {
  border-inline-start-color: var(--sc-color-grey-500);
}

.border-s-grey-500-dark {
  border-inline-start-color: var(--sc-color-grey-500-dark);
}

.border-s-grey-550 {
  border-inline-start-color: var(--sc-color-grey-550);
}

.border-s-grey-550-dark {
  border-inline-start-color: var(--sc-color-grey-550-dark);
}

.border-s-grey-600 {
  border-inline-start-color: var(--sc-color-grey-600);
}

.border-s-grey-600-dark {
  border-inline-start-color: var(--sc-color-grey-600-dark);
}

.border-s-grey-650 {
  border-inline-start-color: var(--sc-color-grey-650);
}

.border-s-grey-650-dark {
  border-inline-start-color: var(--sc-color-grey-650-dark);
}

.border-s-grey-700 {
  border-inline-start-color: var(--sc-color-grey-700);
}

.border-s-grey-700-dark {
  border-inline-start-color: var(--sc-color-grey-700-dark);
}

.border-s-grey-750 {
  border-inline-start-color: var(--sc-color-grey-750);
}

.border-s-grey-750-dark {
  border-inline-start-color: var(--sc-color-grey-750-dark);
}

.border-s-grey-800 {
  border-inline-start-color: var(--sc-color-grey-800);
}

.border-s-grey-800-dark {
  border-inline-start-color: var(--sc-color-grey-800-dark);
}

.border-s-grey-850 {
  border-inline-start-color: var(--sc-color-grey-850);
}

.border-s-grey-850-dark {
  border-inline-start-color: var(--sc-color-grey-850-dark);
}

.border-s-grey-900 {
  border-inline-start-color: var(--sc-color-grey-900);
}

.border-s-grey-900-dark {
  border-inline-start-color: var(--sc-color-grey-900-dark);
}

.border-s-grey-950 {
  border-inline-start-color: var(--sc-color-grey-950);
}

.border-s-grey-950-dark {
  border-inline-start-color: var(--sc-color-grey-950-dark);
}

.border-s-grey-black {
  border-inline-start-color: var(--sc-color-black);
}

.border-s-muted {
  border-inline-start-color: var(--sc-color-blue-900);
}

.border-s-orange-500 {
  border-inline-start-color: var(--sc-color-orange-500);
}

.border-s-primary {
  border-inline-start-color: var(--sc-color-blue);
}

.border-s-purple-100 {
  border-inline-start-color: var(--sc-color-purple-100);
}

.border-s-purple-100-dark {
  border-inline-start-color: var(--sc-color-purple-100-dark);
}

.border-s-purple-150 {
  border-inline-start-color: var(--sc-color-purple-150);
}

.border-s-purple-150-dark {
  border-inline-start-color: var(--sc-color-purple-150-dark);
}

.border-s-purple-200 {
  border-inline-start-color: var(--sc-color-purple-200);
}

.border-s-purple-200-dark {
  border-inline-start-color: var(--sc-color-purple-200-dark);
}

.border-s-purple-250 {
  border-inline-start-color: var(--sc-color-purple-250);
}

.border-s-purple-250-dark {
  border-inline-start-color: var(--sc-color-purple-250-dark);
}

.border-s-purple-300 {
  border-inline-start-color: var(--sc-color-purple-300);
}

.border-s-purple-300-dark {
  border-inline-start-color: var(--sc-color-purple-300-dark);
}

.border-s-purple-350 {
  border-inline-start-color: var(--sc-color-purple-350);
}

.border-s-purple-350-dark {
  border-inline-start-color: var(--sc-color-purple-350-dark);
}

.border-s-purple-400 {
  border-inline-start-color: var(--sc-color-purple-400);
}

.border-s-purple-400-dark {
  border-inline-start-color: var(--sc-color-purple-400-dark);
}

.border-s-purple-450 {
  border-inline-start-color: var(--sc-color-purple-450);
}

.border-s-purple-450-dark {
  border-inline-start-color: var(--sc-color-purple-450-dark);
}

.border-s-purple-50 {
  border-inline-start-color: var(--sc-color-purple-50);
}

.border-s-purple-50-dark {
  border-inline-start-color: var(--sc-color-purple-50-dark);
}

.border-s-purple-500 {
  border-inline-start-color: var(--sc-color-purple-500);
}

.border-s-purple-500-dark {
  border-inline-start-color: var(--sc-color-purple-500-dark);
}

.border-s-purple-550 {
  border-inline-start-color: var(--sc-color-purple-550);
}

.border-s-purple-550-dark {
  border-inline-start-color: var(--sc-color-purple-550-dark);
}

.border-s-purple-600 {
  border-inline-start-color: var(--sc-color-purple-600);
}

.border-s-purple-600-dark {
  border-inline-start-color: var(--sc-color-purple-600-dark);
}

.border-s-purple-650 {
  border-inline-start-color: var(--sc-color-purple-650);
}

.border-s-purple-650-dark {
  border-inline-start-color: var(--sc-color-purple-650-dark);
}

.border-s-purple-700 {
  border-inline-start-color: var(--sc-color-purple-700);
}

.border-s-purple-700-dark {
  border-inline-start-color: var(--sc-color-purple-700-dark);
}

.border-s-purple-750 {
  border-inline-start-color: var(--sc-color-purple-750);
}

.border-s-purple-750-dark {
  border-inline-start-color: var(--sc-color-purple-750-dark);
}

.border-s-purple-800 {
  border-inline-start-color: var(--sc-color-purple-800);
}

.border-s-purple-800-dark {
  border-inline-start-color: var(--sc-color-purple-800-dark);
}

.border-s-purple-850 {
  border-inline-start-color: var(--sc-color-purple-850);
}

.border-s-purple-850-dark {
  border-inline-start-color: var(--sc-color-purple-850-dark);
}

.border-s-purple-900 {
  border-inline-start-color: var(--sc-color-purple-900);
}

.border-s-purple-900-dark {
  border-inline-start-color: var(--sc-color-purple-900-dark);
}

.border-s-purple-950 {
  border-inline-start-color: var(--sc-color-purple-950);
}

.border-s-purple-950-dark {
  border-inline-start-color: var(--sc-color-purple-950-dark);
}

.border-s-red-100 {
  border-inline-start-color: var(--sc-color-red-100);
}

.border-s-red-100-dark {
  border-inline-start-color: var(--sc-color-red-100-dark);
}

.border-s-red-150 {
  border-inline-start-color: var(--sc-color-red-150);
}

.border-s-red-150-dark {
  border-inline-start-color: var(--sc-color-red-150-dark);
}

.border-s-red-200 {
  border-inline-start-color: var(--sc-color-red-200);
}

.border-s-red-200-dark {
  border-inline-start-color: var(--sc-color-red-200-dark);
}

.border-s-red-250 {
  border-inline-start-color: var(--sc-color-red-250);
}

.border-s-red-250-dark {
  border-inline-start-color: var(--sc-color-red-250-dark);
}

.border-s-red-300 {
  border-inline-start-color: var(--sc-color-red-300);
}

.border-s-red-300-dark {
  border-inline-start-color: var(--sc-color-red-300-dark);
}

.border-s-red-350 {
  border-inline-start-color: var(--sc-color-red-350);
}

.border-s-red-350-dark {
  border-inline-start-color: var(--sc-color-red-350-dark);
}

.border-s-red-400 {
  border-inline-start-color: var(--sc-color-red-400);
}

.border-s-red-400-dark {
  border-inline-start-color: var(--sc-color-red-400-dark);
}

.border-s-red-450 {
  border-inline-start-color: var(--sc-color-red-450);
}

.border-s-red-450-dark {
  border-inline-start-color: var(--sc-color-red-450-dark);
}

.border-s-red-50 {
  border-inline-start-color: var(--sc-color-red-50);
}

.border-s-red-50-dark {
  border-inline-start-color: var(--sc-color-red-50-dark);
}

.border-s-red-500 {
  border-inline-start-color: var(--sc-color-red-500);
}

.border-s-red-500-dark {
  border-inline-start-color: var(--sc-color-red-500-dark);
}

.border-s-red-550 {
  border-inline-start-color: var(--sc-color-red-550);
}

.border-s-red-550-dark {
  border-inline-start-color: var(--sc-color-red-550-dark);
}

.border-s-red-600 {
  border-inline-start-color: var(--sc-color-red-600);
}

.border-s-red-600-dark {
  border-inline-start-color: var(--sc-color-red-600-dark);
}

.border-s-red-650 {
  border-inline-start-color: var(--sc-color-red-650);
}

.border-s-red-650-dark {
  border-inline-start-color: var(--sc-color-red-650-dark);
}

.border-s-red-700 {
  border-inline-start-color: var(--sc-color-red-700);
}

.border-s-red-700-dark {
  border-inline-start-color: var(--sc-color-red-700-dark);
}

.border-s-red-750 {
  border-inline-start-color: var(--sc-color-red-750);
}

.border-s-red-750-dark {
  border-inline-start-color: var(--sc-color-red-750-dark);
}

.border-s-red-800 {
  border-inline-start-color: var(--sc-color-red-800);
}

.border-s-red-800-dark {
  border-inline-start-color: var(--sc-color-red-800-dark);
}

.border-s-red-850 {
  border-inline-start-color: var(--sc-color-red-850);
}

.border-s-red-850-dark {
  border-inline-start-color: var(--sc-color-red-850-dark);
}

.border-s-red-900 {
  border-inline-start-color: var(--sc-color-red-900);
}

.border-s-red-900-dark {
  border-inline-start-color: var(--sc-color-red-900-dark);
}

.border-s-red-950 {
  border-inline-start-color: var(--sc-color-red-950);
}

.border-s-red-950-dark {
  border-inline-start-color: var(--sc-color-red-950-dark);
}

.border-s-teal-100 {
  border-inline-start-color: var(--sc-color-teal-100);
}

.border-s-teal-500 {
  border-inline-start-color: var(--sc-color-teal-500);
}

.border-s-transparent {
  border-inline-start-color: transparent;
}

.border-s-transparent\/0 {
  border-inline-start-color: rgb(0 0 0 / 0);
}

.border-s-transparent\/10 {
  border-inline-start-color: rgb(0 0 0 / 0.1);
}

.border-s-transparent\/100 {
  border-inline-start-color: rgb(0 0 0 / 1);
}

.border-s-transparent\/15 {
  border-inline-start-color: rgb(0 0 0 / 0.15);
}

.border-s-transparent\/20 {
  border-inline-start-color: rgb(0 0 0 / 0.2);
}

.border-s-transparent\/25 {
  border-inline-start-color: rgb(0 0 0 / 0.25);
}

.border-s-transparent\/30 {
  border-inline-start-color: rgb(0 0 0 / 0.3);
}

.border-s-transparent\/35 {
  border-inline-start-color: rgb(0 0 0 / 0.35);
}

.border-s-transparent\/40 {
  border-inline-start-color: rgb(0 0 0 / 0.4);
}

.border-s-transparent\/45 {
  border-inline-start-color: rgb(0 0 0 / 0.45);
}

.border-s-transparent\/5 {
  border-inline-start-color: rgb(0 0 0 / 0.05);
}

.border-s-transparent\/50 {
  border-inline-start-color: rgb(0 0 0 / 0.5);
}

.border-s-transparent\/55 {
  border-inline-start-color: rgb(0 0 0 / 0.55);
}

.border-s-transparent\/60 {
  border-inline-start-color: rgb(0 0 0 / 0.6);
}

.border-s-transparent\/65 {
  border-inline-start-color: rgb(0 0 0 / 0.65);
}

.border-s-transparent\/70 {
  border-inline-start-color: rgb(0 0 0 / 0.7);
}

.border-s-transparent\/75 {
  border-inline-start-color: rgb(0 0 0 / 0.75);
}

.border-s-transparent\/80 {
  border-inline-start-color: rgb(0 0 0 / 0.8);
}

.border-s-transparent\/85 {
  border-inline-start-color: rgb(0 0 0 / 0.85);
}

.border-s-transparent\/90 {
  border-inline-start-color: rgb(0 0 0 / 0.9);
}

.border-s-transparent\/95 {
  border-inline-start-color: rgb(0 0 0 / 0.95);
}

.border-s-white {
  border-inline-start-color: var(--sc-color-white);
}

.border-t-amber-100 {
  border-top-color: var(--sc-color-amber-100);
}

.border-t-amber-100-dark {
  border-top-color: var(--sc-color-amber-100-dark);
}

.border-t-amber-150 {
  border-top-color: var(--sc-color-amber-150);
}

.border-t-amber-150-dark {
  border-top-color: var(--sc-color-amber-150-dark);
}

.border-t-amber-200 {
  border-top-color: var(--sc-color-amber-200);
}

.border-t-amber-200-dark {
  border-top-color: var(--sc-color-amber-200-dark);
}

.border-t-amber-250 {
  border-top-color: var(--sc-color-amber-250);
}

.border-t-amber-250-dark {
  border-top-color: var(--sc-color-amber-250-dark);
}

.border-t-amber-300 {
  border-top-color: var(--sc-color-amber-300);
}

.border-t-amber-300-dark {
  border-top-color: var(--sc-color-amber-300-dark);
}

.border-t-amber-350 {
  border-top-color: var(--sc-color-amber-350);
}

.border-t-amber-350-dark {
  border-top-color: var(--sc-color-amber-350-dark);
}

.border-t-amber-400 {
  border-top-color: var(--sc-color-amber-400);
}

.border-t-amber-400-dark {
  border-top-color: var(--sc-color-amber-400-dark);
}

.border-t-amber-450 {
  border-top-color: var(--sc-color-amber-450);
}

.border-t-amber-450-dark {
  border-top-color: var(--sc-color-amber-450-dark);
}

.border-t-amber-50 {
  border-top-color: var(--sc-color-amber-50);
}

.border-t-amber-50-dark {
  border-top-color: var(--sc-color-amber-50-dark);
}

.border-t-amber-500 {
  border-top-color: var(--sc-color-amber-500);
}

.border-t-amber-500-dark {
  border-top-color: var(--sc-color-amber-500-dark);
}

.border-t-amber-550 {
  border-top-color: var(--sc-color-amber-550);
}

.border-t-amber-550-dark {
  border-top-color: var(--sc-color-amber-550-dark);
}

.border-t-amber-600 {
  border-top-color: var(--sc-color-amber-600);
}

.border-t-amber-600-dark {
  border-top-color: var(--sc-color-amber-600-dark);
}

.border-t-amber-650 {
  border-top-color: var(--sc-color-amber-650);
}

.border-t-amber-650-dark {
  border-top-color: var(--sc-color-amber-650-dark);
}

.border-t-amber-700 {
  border-top-color: var(--sc-color-amber-700);
}

.border-t-amber-700-dark {
  border-top-color: var(--sc-color-amber-700-dark);
}

.border-t-amber-750 {
  border-top-color: var(--sc-color-amber-750);
}

.border-t-amber-750-dark {
  border-top-color: var(--sc-color-amber-750-dark);
}

.border-t-amber-800 {
  border-top-color: var(--sc-color-amber-800);
}

.border-t-amber-800-dark {
  border-top-color: var(--sc-color-amber-800-dark);
}

.border-t-amber-850 {
  border-top-color: var(--sc-color-amber-850);
}

.border-t-amber-850-dark {
  border-top-color: var(--sc-color-amber-850-dark);
}

.border-t-amber-900 {
  border-top-color: var(--sc-color-amber-900);
}

.border-t-amber-900-dark {
  border-top-color: var(--sc-color-amber-900-dark);
}

.border-t-amber-950 {
  border-top-color: var(--sc-color-amber-950);
}

.border-t-amber-950-dark {
  border-top-color: var(--sc-color-amber-950-dark);
}

.border-t-blue-100 {
  border-top-color: var(--sc-color-blue-100);
}

.border-t-blue-100-dark {
  border-top-color: var(--sc-color-blue-100-dark);
}

.border-t-blue-150 {
  border-top-color: var(--sc-color-blue-150);
}

.border-t-blue-150-dark {
  border-top-color: var(--sc-color-blue-150-dark);
}

.border-t-blue-200 {
  border-top-color: var(--sc-color-blue-200);
}

.border-t-blue-200-dark {
  border-top-color: var(--sc-color-blue-200-dark);
}

.border-t-blue-250 {
  border-top-color: var(--sc-color-blue-250);
}

.border-t-blue-250-dark {
  border-top-color: var(--sc-color-blue-250-dark);
}

.border-t-blue-300 {
  border-top-color: var(--sc-color-blue-300);
}

.border-t-blue-300-dark {
  border-top-color: var(--sc-color-blue-300-dark);
}

.border-t-blue-350 {
  border-top-color: var(--sc-color-blue-350);
}

.border-t-blue-350-dark {
  border-top-color: var(--sc-color-blue-350-dark);
}

.border-t-blue-400 {
  border-top-color: var(--sc-color-blue-400);
}

.border-t-blue-400-dark {
  border-top-color: var(--sc-color-blue-400-dark);
}

.border-t-blue-450 {
  border-top-color: var(--sc-color-blue-450);
}

.border-t-blue-450-dark {
  border-top-color: var(--sc-color-blue-450-dark);
}

.border-t-blue-50 {
  border-top-color: var(--sc-color-blue-50);
}

.border-t-blue-50-dark {
  border-top-color: var(--sc-color-blue-50-dark);
}

.border-t-blue-500 {
  border-top-color: var(--sc-color-blue-500);
}

.border-t-blue-500-dark {
  border-top-color: var(--sc-color-blue-500-dark);
}

.border-t-blue-550 {
  border-top-color: var(--sc-color-blue-550);
}

.border-t-blue-550-dark {
  border-top-color: var(--sc-color-blue-550-dark);
}

.border-t-blue-600 {
  border-top-color: var(--sc-color-blue-600);
}

.border-t-blue-600-dark {
  border-top-color: var(--sc-color-blue-600-dark);
}

.border-t-blue-650 {
  border-top-color: var(--sc-color-blue-650);
}

.border-t-blue-650-dark {
  border-top-color: var(--sc-color-blue-650-dark);
}

.border-t-blue-700 {
  border-top-color: var(--sc-color-blue-700);
}

.border-t-blue-700-dark {
  border-top-color: var(--sc-color-blue-700-dark);
}

.border-t-blue-750 {
  border-top-color: var(--sc-color-blue-750);
}

.border-t-blue-750-dark {
  border-top-color: var(--sc-color-blue-750-dark);
}

.border-t-blue-800 {
  border-top-color: var(--sc-color-blue-800);
}

.border-t-blue-800-dark {
  border-top-color: var(--sc-color-blue-800-dark);
}

.border-t-blue-850 {
  border-top-color: var(--sc-color-blue-850);
}

.border-t-blue-850-dark {
  border-top-color: var(--sc-color-blue-850-dark);
}

.border-t-blue-900 {
  border-top-color: var(--sc-color-blue-900);
}

.border-t-blue-900-dark {
  border-top-color: var(--sc-color-blue-900-dark);
}

.border-t-blue-950 {
  border-top-color: var(--sc-color-blue-950);
}

.border-t-blue-950-dark {
  border-top-color: var(--sc-color-blue-950-dark);
}

.border-t-current {
  border-top-color: currentColor;
}

.border-t-green-100 {
  border-top-color: var(--sc-color-green-100);
}

.border-t-green-100-dark {
  border-top-color: var(--sc-color-green-100-dark);
}

.border-t-green-150 {
  border-top-color: var(--sc-color-green-150);
}

.border-t-green-150-dark {
  border-top-color: var(--sc-color-green-150-dark);
}

.border-t-green-200 {
  border-top-color: var(--sc-color-green-200);
}

.border-t-green-200-dark {
  border-top-color: var(--sc-color-green-200-dark);
}

.border-t-green-250 {
  border-top-color: var(--sc-color-green-250);
}

.border-t-green-250-dark {
  border-top-color: var(--sc-color-green-250-dark);
}

.border-t-green-300 {
  border-top-color: var(--sc-color-green-300);
}

.border-t-green-300-dark {
  border-top-color: var(--sc-color-green-300-dark);
}

.border-t-green-350 {
  border-top-color: var(--sc-color-green-350);
}

.border-t-green-350-dark {
  border-top-color: var(--sc-color-green-350-dark);
}

.border-t-green-400 {
  border-top-color: var(--sc-color-green-400);
}

.border-t-green-400-dark {
  border-top-color: var(--sc-color-green-400-dark);
}

.border-t-green-450 {
  border-top-color: var(--sc-color-green-450);
}

.border-t-green-450-dark {
  border-top-color: var(--sc-color-green-450-dark);
}

.border-t-green-50 {
  border-top-color: var(--sc-color-green-50);
}

.border-t-green-50-dark {
  border-top-color: var(--sc-color-green-50-dark);
}

.border-t-green-500 {
  border-top-color: var(--sc-color-green-500);
}

.border-t-green-500-dark {
  border-top-color: var(--sc-color-green-500-dark);
}

.border-t-green-550 {
  border-top-color: var(--sc-color-green-550);
}

.border-t-green-550-dark {
  border-top-color: var(--sc-color-green-550-dark);
}

.border-t-green-600 {
  border-top-color: var(--sc-color-green-600);
}

.border-t-green-600-dark {
  border-top-color: var(--sc-color-green-600-dark);
}

.border-t-green-650 {
  border-top-color: var(--sc-color-green-650);
}

.border-t-green-650-dark {
  border-top-color: var(--sc-color-green-650-dark);
}

.border-t-green-700 {
  border-top-color: var(--sc-color-green-700);
}

.border-t-green-700-dark {
  border-top-color: var(--sc-color-green-700-dark);
}

.border-t-green-750 {
  border-top-color: var(--sc-color-green-750);
}

.border-t-green-750-dark {
  border-top-color: var(--sc-color-green-750-dark);
}

.border-t-green-800 {
  border-top-color: var(--sc-color-green-800);
}

.border-t-green-800-dark {
  border-top-color: var(--sc-color-green-800-dark);
}

.border-t-green-850 {
  border-top-color: var(--sc-color-green-850);
}

.border-t-green-850-dark {
  border-top-color: var(--sc-color-green-850-dark);
}

.border-t-green-900 {
  border-top-color: var(--sc-color-green-900);
}

.border-t-green-900-dark {
  border-top-color: var(--sc-color-green-900-dark);
}

.border-t-green-950 {
  border-top-color: var(--sc-color-green-950);
}

.border-t-green-950-dark {
  border-top-color: var(--sc-color-green-950-dark);
}

.border-t-grey-100 {
  border-top-color: var(--sc-color-grey-100);
}

.border-t-grey-100-dark {
  border-top-color: var(--sc-color-grey-100-dark);
}

.border-t-grey-150 {
  border-top-color: var(--sc-color-grey-150);
}

.border-t-grey-150-dark {
  border-top-color: var(--sc-color-grey-150-dark);
}

.border-t-grey-200 {
  border-top-color: var(--sc-color-grey-200);
}

.border-t-grey-200-dark {
  border-top-color: var(--sc-color-grey-200-dark);
}

.border-t-grey-250 {
  border-top-color: var(--sc-color-grey-250);
}

.border-t-grey-250-dark {
  border-top-color: var(--sc-color-grey-250-dark);
}

.border-t-grey-300 {
  border-top-color: var(--sc-color-grey-300);
}

.border-t-grey-300-dark {
  border-top-color: var(--sc-color-grey-300-dark);
}

.border-t-grey-350 {
  border-top-color: var(--sc-color-grey-350);
}

.border-t-grey-350-dark {
  border-top-color: var(--sc-color-grey-350-dark);
}

.border-t-grey-400 {
  border-top-color: var(--sc-color-grey-400);
}

.border-t-grey-400-dark {
  border-top-color: var(--sc-color-grey-400-dark);
}

.border-t-grey-450 {
  border-top-color: var(--sc-color-grey-450);
}

.border-t-grey-450-dark {
  border-top-color: var(--sc-color-grey-450-dark);
}

.border-t-grey-50 {
  border-top-color: var(--sc-color-grey-50);
}

.border-t-grey-50-dark {
  border-top-color: var(--sc-color-grey-50-dark);
}

.border-t-grey-500 {
  border-top-color: var(--sc-color-grey-500);
}

.border-t-grey-500-dark {
  border-top-color: var(--sc-color-grey-500-dark);
}

.border-t-grey-550 {
  border-top-color: var(--sc-color-grey-550);
}

.border-t-grey-550-dark {
  border-top-color: var(--sc-color-grey-550-dark);
}

.border-t-grey-600 {
  border-top-color: var(--sc-color-grey-600);
}

.border-t-grey-600-dark {
  border-top-color: var(--sc-color-grey-600-dark);
}

.border-t-grey-650 {
  border-top-color: var(--sc-color-grey-650);
}

.border-t-grey-650-dark {
  border-top-color: var(--sc-color-grey-650-dark);
}

.border-t-grey-700 {
  border-top-color: var(--sc-color-grey-700);
}

.border-t-grey-700-dark {
  border-top-color: var(--sc-color-grey-700-dark);
}

.border-t-grey-750 {
  border-top-color: var(--sc-color-grey-750);
}

.border-t-grey-750-dark {
  border-top-color: var(--sc-color-grey-750-dark);
}

.border-t-grey-800 {
  border-top-color: var(--sc-color-grey-800);
}

.border-t-grey-800-dark {
  border-top-color: var(--sc-color-grey-800-dark);
}

.border-t-grey-850 {
  border-top-color: var(--sc-color-grey-850);
}

.border-t-grey-850-dark {
  border-top-color: var(--sc-color-grey-850-dark);
}

.border-t-grey-900 {
  border-top-color: var(--sc-color-grey-900);
}

.border-t-grey-900-dark {
  border-top-color: var(--sc-color-grey-900-dark);
}

.border-t-grey-950 {
  border-top-color: var(--sc-color-grey-950);
}

.border-t-grey-950-dark {
  border-top-color: var(--sc-color-grey-950-dark);
}

.border-t-grey-black {
  border-top-color: var(--sc-color-black);
}

.border-t-muted {
  border-top-color: var(--sc-color-blue-900);
}

.border-t-orange-500 {
  border-top-color: var(--sc-color-orange-500);
}

.border-t-primary {
  border-top-color: var(--sc-color-blue);
}

.border-t-purple-100 {
  border-top-color: var(--sc-color-purple-100);
}

.border-t-purple-100-dark {
  border-top-color: var(--sc-color-purple-100-dark);
}

.border-t-purple-150 {
  border-top-color: var(--sc-color-purple-150);
}

.border-t-purple-150-dark {
  border-top-color: var(--sc-color-purple-150-dark);
}

.border-t-purple-200 {
  border-top-color: var(--sc-color-purple-200);
}

.border-t-purple-200-dark {
  border-top-color: var(--sc-color-purple-200-dark);
}

.border-t-purple-250 {
  border-top-color: var(--sc-color-purple-250);
}

.border-t-purple-250-dark {
  border-top-color: var(--sc-color-purple-250-dark);
}

.border-t-purple-300 {
  border-top-color: var(--sc-color-purple-300);
}

.border-t-purple-300-dark {
  border-top-color: var(--sc-color-purple-300-dark);
}

.border-t-purple-350 {
  border-top-color: var(--sc-color-purple-350);
}

.border-t-purple-350-dark {
  border-top-color: var(--sc-color-purple-350-dark);
}

.border-t-purple-400 {
  border-top-color: var(--sc-color-purple-400);
}

.border-t-purple-400-dark {
  border-top-color: var(--sc-color-purple-400-dark);
}

.border-t-purple-450 {
  border-top-color: var(--sc-color-purple-450);
}

.border-t-purple-450-dark {
  border-top-color: var(--sc-color-purple-450-dark);
}

.border-t-purple-50 {
  border-top-color: var(--sc-color-purple-50);
}

.border-t-purple-50-dark {
  border-top-color: var(--sc-color-purple-50-dark);
}

.border-t-purple-500 {
  border-top-color: var(--sc-color-purple-500);
}

.border-t-purple-500-dark {
  border-top-color: var(--sc-color-purple-500-dark);
}

.border-t-purple-550 {
  border-top-color: var(--sc-color-purple-550);
}

.border-t-purple-550-dark {
  border-top-color: var(--sc-color-purple-550-dark);
}

.border-t-purple-600 {
  border-top-color: var(--sc-color-purple-600);
}

.border-t-purple-600-dark {
  border-top-color: var(--sc-color-purple-600-dark);
}

.border-t-purple-650 {
  border-top-color: var(--sc-color-purple-650);
}

.border-t-purple-650-dark {
  border-top-color: var(--sc-color-purple-650-dark);
}

.border-t-purple-700 {
  border-top-color: var(--sc-color-purple-700);
}

.border-t-purple-700-dark {
  border-top-color: var(--sc-color-purple-700-dark);
}

.border-t-purple-750 {
  border-top-color: var(--sc-color-purple-750);
}

.border-t-purple-750-dark {
  border-top-color: var(--sc-color-purple-750-dark);
}

.border-t-purple-800 {
  border-top-color: var(--sc-color-purple-800);
}

.border-t-purple-800-dark {
  border-top-color: var(--sc-color-purple-800-dark);
}

.border-t-purple-850 {
  border-top-color: var(--sc-color-purple-850);
}

.border-t-purple-850-dark {
  border-top-color: var(--sc-color-purple-850-dark);
}

.border-t-purple-900 {
  border-top-color: var(--sc-color-purple-900);
}

.border-t-purple-900-dark {
  border-top-color: var(--sc-color-purple-900-dark);
}

.border-t-purple-950 {
  border-top-color: var(--sc-color-purple-950);
}

.border-t-purple-950-dark {
  border-top-color: var(--sc-color-purple-950-dark);
}

.border-t-red-100 {
  border-top-color: var(--sc-color-red-100);
}

.border-t-red-100-dark {
  border-top-color: var(--sc-color-red-100-dark);
}

.border-t-red-150 {
  border-top-color: var(--sc-color-red-150);
}

.border-t-red-150-dark {
  border-top-color: var(--sc-color-red-150-dark);
}

.border-t-red-200 {
  border-top-color: var(--sc-color-red-200);
}

.border-t-red-200-dark {
  border-top-color: var(--sc-color-red-200-dark);
}

.border-t-red-250 {
  border-top-color: var(--sc-color-red-250);
}

.border-t-red-250-dark {
  border-top-color: var(--sc-color-red-250-dark);
}

.border-t-red-300 {
  border-top-color: var(--sc-color-red-300);
}

.border-t-red-300-dark {
  border-top-color: var(--sc-color-red-300-dark);
}

.border-t-red-350 {
  border-top-color: var(--sc-color-red-350);
}

.border-t-red-350-dark {
  border-top-color: var(--sc-color-red-350-dark);
}

.border-t-red-400 {
  border-top-color: var(--sc-color-red-400);
}

.border-t-red-400-dark {
  border-top-color: var(--sc-color-red-400-dark);
}

.border-t-red-450 {
  border-top-color: var(--sc-color-red-450);
}

.border-t-red-450-dark {
  border-top-color: var(--sc-color-red-450-dark);
}

.border-t-red-50 {
  border-top-color: var(--sc-color-red-50);
}

.border-t-red-50-dark {
  border-top-color: var(--sc-color-red-50-dark);
}

.border-t-red-500 {
  border-top-color: var(--sc-color-red-500);
}

.border-t-red-500-dark {
  border-top-color: var(--sc-color-red-500-dark);
}

.border-t-red-550 {
  border-top-color: var(--sc-color-red-550);
}

.border-t-red-550-dark {
  border-top-color: var(--sc-color-red-550-dark);
}

.border-t-red-600 {
  border-top-color: var(--sc-color-red-600);
}

.border-t-red-600-dark {
  border-top-color: var(--sc-color-red-600-dark);
}

.border-t-red-650 {
  border-top-color: var(--sc-color-red-650);
}

.border-t-red-650-dark {
  border-top-color: var(--sc-color-red-650-dark);
}

.border-t-red-700 {
  border-top-color: var(--sc-color-red-700);
}

.border-t-red-700-dark {
  border-top-color: var(--sc-color-red-700-dark);
}

.border-t-red-750 {
  border-top-color: var(--sc-color-red-750);
}

.border-t-red-750-dark {
  border-top-color: var(--sc-color-red-750-dark);
}

.border-t-red-800 {
  border-top-color: var(--sc-color-red-800);
}

.border-t-red-800-dark {
  border-top-color: var(--sc-color-red-800-dark);
}

.border-t-red-850 {
  border-top-color: var(--sc-color-red-850);
}

.border-t-red-850-dark {
  border-top-color: var(--sc-color-red-850-dark);
}

.border-t-red-900 {
  border-top-color: var(--sc-color-red-900);
}

.border-t-red-900-dark {
  border-top-color: var(--sc-color-red-900-dark);
}

.border-t-red-950 {
  border-top-color: var(--sc-color-red-950);
}

.border-t-red-950-dark {
  border-top-color: var(--sc-color-red-950-dark);
}

.border-t-teal-100 {
  border-top-color: var(--sc-color-teal-100);
}

.border-t-teal-500 {
  border-top-color: var(--sc-color-teal-500);
}

.border-t-transparent {
  border-top-color: transparent;
}

.border-t-transparent\/0 {
  border-top-color: rgb(0 0 0 / 0);
}

.border-t-transparent\/10 {
  border-top-color: rgb(0 0 0 / 0.1);
}

.border-t-transparent\/100 {
  border-top-color: rgb(0 0 0 / 1);
}

.border-t-transparent\/15 {
  border-top-color: rgb(0 0 0 / 0.15);
}

.border-t-transparent\/20 {
  border-top-color: rgb(0 0 0 / 0.2);
}

.border-t-transparent\/25 {
  border-top-color: rgb(0 0 0 / 0.25);
}

.border-t-transparent\/30 {
  border-top-color: rgb(0 0 0 / 0.3);
}

.border-t-transparent\/35 {
  border-top-color: rgb(0 0 0 / 0.35);
}

.border-t-transparent\/40 {
  border-top-color: rgb(0 0 0 / 0.4);
}

.border-t-transparent\/45 {
  border-top-color: rgb(0 0 0 / 0.45);
}

.border-t-transparent\/5 {
  border-top-color: rgb(0 0 0 / 0.05);
}

.border-t-transparent\/50 {
  border-top-color: rgb(0 0 0 / 0.5);
}

.border-t-transparent\/55 {
  border-top-color: rgb(0 0 0 / 0.55);
}

.border-t-transparent\/60 {
  border-top-color: rgb(0 0 0 / 0.6);
}

.border-t-transparent\/65 {
  border-top-color: rgb(0 0 0 / 0.65);
}

.border-t-transparent\/70 {
  border-top-color: rgb(0 0 0 / 0.7);
}

.border-t-transparent\/75 {
  border-top-color: rgb(0 0 0 / 0.75);
}

.border-t-transparent\/80 {
  border-top-color: rgb(0 0 0 / 0.8);
}

.border-t-transparent\/85 {
  border-top-color: rgb(0 0 0 / 0.85);
}

.border-t-transparent\/90 {
  border-top-color: rgb(0 0 0 / 0.9);
}

.border-t-transparent\/95 {
  border-top-color: rgb(0 0 0 / 0.95);
}

.border-t-white {
  border-top-color: var(--sc-color-white);
}

.border-opacity-0 {
  --tw-border-opacity: 0;
}

.border-opacity-10 {
  --tw-border-opacity: 0.1;
}

.border-opacity-100 {
  --tw-border-opacity: 1;
}

.border-opacity-15 {
  --tw-border-opacity: 0.15;
}

.border-opacity-20 {
  --tw-border-opacity: 0.2;
}

.border-opacity-25 {
  --tw-border-opacity: 0.25;
}

.border-opacity-30 {
  --tw-border-opacity: 0.3;
}

.border-opacity-35 {
  --tw-border-opacity: 0.35;
}

.border-opacity-40 {
  --tw-border-opacity: 0.4;
}

.border-opacity-45 {
  --tw-border-opacity: 0.45;
}

.border-opacity-5 {
  --tw-border-opacity: 0.05;
}

.border-opacity-50 {
  --tw-border-opacity: 0.5;
}

.border-opacity-55 {
  --tw-border-opacity: 0.55;
}

.border-opacity-60 {
  --tw-border-opacity: 0.6;
}

.border-opacity-65 {
  --tw-border-opacity: 0.65;
}

.border-opacity-70 {
  --tw-border-opacity: 0.7;
}

.border-opacity-75 {
  --tw-border-opacity: 0.75;
}

.border-opacity-80 {
  --tw-border-opacity: 0.8;
}

.border-opacity-85 {
  --tw-border-opacity: 0.85;
}

.border-opacity-90 {
  --tw-border-opacity: 0.9;
}

.border-opacity-95 {
  --tw-border-opacity: 0.95;
}

.bg-amber-100 {
  background-color: var(--sc-color-amber-100);
}

.bg-amber-100-dark {
  background-color: var(--sc-color-amber-100-dark);
}

.bg-amber-150 {
  background-color: var(--sc-color-amber-150);
}

.bg-amber-150-dark {
  background-color: var(--sc-color-amber-150-dark);
}

.bg-amber-200 {
  background-color: var(--sc-color-amber-200);
}

.bg-amber-200-dark {
  background-color: var(--sc-color-amber-200-dark);
}

.bg-amber-250 {
  background-color: var(--sc-color-amber-250);
}

.bg-amber-250-dark {
  background-color: var(--sc-color-amber-250-dark);
}

.bg-amber-300 {
  background-color: var(--sc-color-amber-300);
}

.bg-amber-300-dark {
  background-color: var(--sc-color-amber-300-dark);
}

.bg-amber-350 {
  background-color: var(--sc-color-amber-350);
}

.bg-amber-350-dark {
  background-color: var(--sc-color-amber-350-dark);
}

.bg-amber-400 {
  background-color: var(--sc-color-amber-400);
}

.bg-amber-400-dark {
  background-color: var(--sc-color-amber-400-dark);
}

.bg-amber-450 {
  background-color: var(--sc-color-amber-450);
}

.bg-amber-450-dark {
  background-color: var(--sc-color-amber-450-dark);
}

.bg-amber-50 {
  background-color: var(--sc-color-amber-50);
}

.bg-amber-50-dark {
  background-color: var(--sc-color-amber-50-dark);
}

.bg-amber-500 {
  background-color: var(--sc-color-amber-500);
}

.bg-amber-500-dark {
  background-color: var(--sc-color-amber-500-dark);
}

.bg-amber-550 {
  background-color: var(--sc-color-amber-550);
}

.bg-amber-550-dark {
  background-color: var(--sc-color-amber-550-dark);
}

.bg-amber-600 {
  background-color: var(--sc-color-amber-600);
}

.bg-amber-600-dark {
  background-color: var(--sc-color-amber-600-dark);
}

.bg-amber-650 {
  background-color: var(--sc-color-amber-650);
}

.bg-amber-650-dark {
  background-color: var(--sc-color-amber-650-dark);
}

.bg-amber-700 {
  background-color: var(--sc-color-amber-700);
}

.bg-amber-700-dark {
  background-color: var(--sc-color-amber-700-dark);
}

.bg-amber-750 {
  background-color: var(--sc-color-amber-750);
}

.bg-amber-750-dark {
  background-color: var(--sc-color-amber-750-dark);
}

.bg-amber-800 {
  background-color: var(--sc-color-amber-800);
}

.bg-amber-800-dark {
  background-color: var(--sc-color-amber-800-dark);
}

.bg-amber-850 {
  background-color: var(--sc-color-amber-850);
}

.bg-amber-850-dark {
  background-color: var(--sc-color-amber-850-dark);
}

.bg-amber-900 {
  background-color: var(--sc-color-amber-900);
}

.bg-amber-900-dark {
  background-color: var(--sc-color-amber-900-dark);
}

.bg-amber-950 {
  background-color: var(--sc-color-amber-950);
}

.bg-amber-950-dark {
  background-color: var(--sc-color-amber-950-dark);
}

.bg-blue-100 {
  background-color: var(--sc-color-blue-100);
}

.bg-blue-100-dark {
  background-color: var(--sc-color-blue-100-dark);
}

.bg-blue-150 {
  background-color: var(--sc-color-blue-150);
}

.bg-blue-150-dark {
  background-color: var(--sc-color-blue-150-dark);
}

.bg-blue-200 {
  background-color: var(--sc-color-blue-200);
}

.bg-blue-200-dark {
  background-color: var(--sc-color-blue-200-dark);
}

.bg-blue-250 {
  background-color: var(--sc-color-blue-250);
}

.bg-blue-250-dark {
  background-color: var(--sc-color-blue-250-dark);
}

.bg-blue-300 {
  background-color: var(--sc-color-blue-300);
}

.bg-blue-300-dark {
  background-color: var(--sc-color-blue-300-dark);
}

.bg-blue-350 {
  background-color: var(--sc-color-blue-350);
}

.bg-blue-350-dark {
  background-color: var(--sc-color-blue-350-dark);
}

.bg-blue-400 {
  background-color: var(--sc-color-blue-400);
}

.bg-blue-400-dark {
  background-color: var(--sc-color-blue-400-dark);
}

.bg-blue-450 {
  background-color: var(--sc-color-blue-450);
}

.bg-blue-450-dark {
  background-color: var(--sc-color-blue-450-dark);
}

.bg-blue-50 {
  background-color: var(--sc-color-blue-50);
}

.bg-blue-50-dark {
  background-color: var(--sc-color-blue-50-dark);
}

.bg-blue-500 {
  background-color: var(--sc-color-blue-500);
}

.bg-blue-500-dark {
  background-color: var(--sc-color-blue-500-dark);
}

.bg-blue-550 {
  background-color: var(--sc-color-blue-550);
}

.bg-blue-550-dark {
  background-color: var(--sc-color-blue-550-dark);
}

.bg-blue-600 {
  background-color: var(--sc-color-blue-600);
}

.bg-blue-600-dark {
  background-color: var(--sc-color-blue-600-dark);
}

.bg-blue-650 {
  background-color: var(--sc-color-blue-650);
}

.bg-blue-650-dark {
  background-color: var(--sc-color-blue-650-dark);
}

.bg-blue-700 {
  background-color: var(--sc-color-blue-700);
}

.bg-blue-700-dark {
  background-color: var(--sc-color-blue-700-dark);
}

.bg-blue-750 {
  background-color: var(--sc-color-blue-750);
}

.bg-blue-750-dark {
  background-color: var(--sc-color-blue-750-dark);
}

.bg-blue-800 {
  background-color: var(--sc-color-blue-800);
}

.bg-blue-800-dark {
  background-color: var(--sc-color-blue-800-dark);
}

.bg-blue-850 {
  background-color: var(--sc-color-blue-850);
}

.bg-blue-850-dark {
  background-color: var(--sc-color-blue-850-dark);
}

.bg-blue-900 {
  background-color: var(--sc-color-blue-900);
}

.bg-blue-900-dark {
  background-color: var(--sc-color-blue-900-dark);
}

.bg-blue-950 {
  background-color: var(--sc-color-blue-950);
}

.bg-blue-950-dark {
  background-color: var(--sc-color-blue-950-dark);
}

.bg-current {
  background-color: currentColor;
}

.bg-green-100 {
  background-color: var(--sc-color-green-100);
}

.bg-green-100-dark {
  background-color: var(--sc-color-green-100-dark);
}

.bg-green-150 {
  background-color: var(--sc-color-green-150);
}

.bg-green-150-dark {
  background-color: var(--sc-color-green-150-dark);
}

.bg-green-200 {
  background-color: var(--sc-color-green-200);
}

.bg-green-200-dark {
  background-color: var(--sc-color-green-200-dark);
}

.bg-green-250 {
  background-color: var(--sc-color-green-250);
}

.bg-green-250-dark {
  background-color: var(--sc-color-green-250-dark);
}

.bg-green-300 {
  background-color: var(--sc-color-green-300);
}

.bg-green-300-dark {
  background-color: var(--sc-color-green-300-dark);
}

.bg-green-350 {
  background-color: var(--sc-color-green-350);
}

.bg-green-350-dark {
  background-color: var(--sc-color-green-350-dark);
}

.bg-green-400 {
  background-color: var(--sc-color-green-400);
}

.bg-green-400-dark {
  background-color: var(--sc-color-green-400-dark);
}

.bg-green-450 {
  background-color: var(--sc-color-green-450);
}

.bg-green-450-dark {
  background-color: var(--sc-color-green-450-dark);
}

.bg-green-50 {
  background-color: var(--sc-color-green-50);
}

.bg-green-50-dark {
  background-color: var(--sc-color-green-50-dark);
}

.bg-green-500 {
  background-color: var(--sc-color-green-500);
}

.bg-green-500-dark {
  background-color: var(--sc-color-green-500-dark);
}

.bg-green-550 {
  background-color: var(--sc-color-green-550);
}

.bg-green-550-dark {
  background-color: var(--sc-color-green-550-dark);
}

.bg-green-600 {
  background-color: var(--sc-color-green-600);
}

.bg-green-600-dark {
  background-color: var(--sc-color-green-600-dark);
}

.bg-green-650 {
  background-color: var(--sc-color-green-650);
}

.bg-green-650-dark {
  background-color: var(--sc-color-green-650-dark);
}

.bg-green-700 {
  background-color: var(--sc-color-green-700);
}

.bg-green-700-dark {
  background-color: var(--sc-color-green-700-dark);
}

.bg-green-750 {
  background-color: var(--sc-color-green-750);
}

.bg-green-750-dark {
  background-color: var(--sc-color-green-750-dark);
}

.bg-green-800 {
  background-color: var(--sc-color-green-800);
}

.bg-green-800-dark {
  background-color: var(--sc-color-green-800-dark);
}

.bg-green-850 {
  background-color: var(--sc-color-green-850);
}

.bg-green-850-dark {
  background-color: var(--sc-color-green-850-dark);
}

.bg-green-900 {
  background-color: var(--sc-color-green-900);
}

.bg-green-900-dark {
  background-color: var(--sc-color-green-900-dark);
}

.bg-green-950 {
  background-color: var(--sc-color-green-950);
}

.bg-green-950-dark {
  background-color: var(--sc-color-green-950-dark);
}

.bg-grey-100 {
  background-color: var(--sc-color-grey-100);
}

.bg-grey-100-dark {
  background-color: var(--sc-color-grey-100-dark);
}

.bg-grey-150 {
  background-color: var(--sc-color-grey-150);
}

.bg-grey-150-dark {
  background-color: var(--sc-color-grey-150-dark);
}

.bg-grey-200 {
  background-color: var(--sc-color-grey-200);
}

.bg-grey-200-dark {
  background-color: var(--sc-color-grey-200-dark);
}

.bg-grey-250 {
  background-color: var(--sc-color-grey-250);
}

.bg-grey-250-dark {
  background-color: var(--sc-color-grey-250-dark);
}

.bg-grey-300 {
  background-color: var(--sc-color-grey-300);
}

.bg-grey-300-dark {
  background-color: var(--sc-color-grey-300-dark);
}

.bg-grey-350 {
  background-color: var(--sc-color-grey-350);
}

.bg-grey-350-dark {
  background-color: var(--sc-color-grey-350-dark);
}

.bg-grey-400 {
  background-color: var(--sc-color-grey-400);
}

.bg-grey-400-dark {
  background-color: var(--sc-color-grey-400-dark);
}

.bg-grey-450 {
  background-color: var(--sc-color-grey-450);
}

.bg-grey-450-dark {
  background-color: var(--sc-color-grey-450-dark);
}

.bg-grey-50 {
  background-color: var(--sc-color-grey-50);
}

.bg-grey-50-dark {
  background-color: var(--sc-color-grey-50-dark);
}

.bg-grey-500 {
  background-color: var(--sc-color-grey-500);
}

.bg-grey-500-dark {
  background-color: var(--sc-color-grey-500-dark);
}

.bg-grey-550 {
  background-color: var(--sc-color-grey-550);
}

.bg-grey-550-dark {
  background-color: var(--sc-color-grey-550-dark);
}

.bg-grey-600 {
  background-color: var(--sc-color-grey-600);
}

.bg-grey-600-dark {
  background-color: var(--sc-color-grey-600-dark);
}

.bg-grey-650 {
  background-color: var(--sc-color-grey-650);
}

.bg-grey-650-dark {
  background-color: var(--sc-color-grey-650-dark);
}

.bg-grey-700 {
  background-color: var(--sc-color-grey-700);
}

.bg-grey-700-dark {
  background-color: var(--sc-color-grey-700-dark);
}

.bg-grey-750 {
  background-color: var(--sc-color-grey-750);
}

.bg-grey-750-dark {
  background-color: var(--sc-color-grey-750-dark);
}

.bg-grey-800 {
  background-color: var(--sc-color-grey-800);
}

.bg-grey-800-dark {
  background-color: var(--sc-color-grey-800-dark);
}

.bg-grey-850 {
  background-color: var(--sc-color-grey-850);
}

.bg-grey-850-dark {
  background-color: var(--sc-color-grey-850-dark);
}

.bg-grey-900 {
  background-color: var(--sc-color-grey-900);
}

.bg-grey-900-dark {
  background-color: var(--sc-color-grey-900-dark);
}

.bg-grey-950 {
  background-color: var(--sc-color-grey-950);
}

.bg-grey-950-dark {
  background-color: var(--sc-color-grey-950-dark);
}

.bg-grey-black {
  background-color: var(--sc-color-black);
}

.bg-muted {
  background-color: var(--sc-color-blue-900);
}

.bg-orange-500 {
  background-color: var(--sc-color-orange-500);
}

.bg-primary {
  background-color: var(--sc-color-blue);
}

.bg-purple-100 {
  background-color: var(--sc-color-purple-100);
}

.bg-purple-100-dark {
  background-color: var(--sc-color-purple-100-dark);
}

.bg-purple-150 {
  background-color: var(--sc-color-purple-150);
}

.bg-purple-150-dark {
  background-color: var(--sc-color-purple-150-dark);
}

.bg-purple-200 {
  background-color: var(--sc-color-purple-200);
}

.bg-purple-200-dark {
  background-color: var(--sc-color-purple-200-dark);
}

.bg-purple-250 {
  background-color: var(--sc-color-purple-250);
}

.bg-purple-250-dark {
  background-color: var(--sc-color-purple-250-dark);
}

.bg-purple-300 {
  background-color: var(--sc-color-purple-300);
}

.bg-purple-300-dark {
  background-color: var(--sc-color-purple-300-dark);
}

.bg-purple-350 {
  background-color: var(--sc-color-purple-350);
}

.bg-purple-350-dark {
  background-color: var(--sc-color-purple-350-dark);
}

.bg-purple-400 {
  background-color: var(--sc-color-purple-400);
}

.bg-purple-400-dark {
  background-color: var(--sc-color-purple-400-dark);
}

.bg-purple-450 {
  background-color: var(--sc-color-purple-450);
}

.bg-purple-450-dark {
  background-color: var(--sc-color-purple-450-dark);
}

.bg-purple-50 {
  background-color: var(--sc-color-purple-50);
}

.bg-purple-50-dark {
  background-color: var(--sc-color-purple-50-dark);
}

.bg-purple-500 {
  background-color: var(--sc-color-purple-500);
}

.bg-purple-500-dark {
  background-color: var(--sc-color-purple-500-dark);
}

.bg-purple-550 {
  background-color: var(--sc-color-purple-550);
}

.bg-purple-550-dark {
  background-color: var(--sc-color-purple-550-dark);
}

.bg-purple-600 {
  background-color: var(--sc-color-purple-600);
}

.bg-purple-600-dark {
  background-color: var(--sc-color-purple-600-dark);
}

.bg-purple-650 {
  background-color: var(--sc-color-purple-650);
}

.bg-purple-650-dark {
  background-color: var(--sc-color-purple-650-dark);
}

.bg-purple-700 {
  background-color: var(--sc-color-purple-700);
}

.bg-purple-700-dark {
  background-color: var(--sc-color-purple-700-dark);
}

.bg-purple-750 {
  background-color: var(--sc-color-purple-750);
}

.bg-purple-750-dark {
  background-color: var(--sc-color-purple-750-dark);
}

.bg-purple-800 {
  background-color: var(--sc-color-purple-800);
}

.bg-purple-800-dark {
  background-color: var(--sc-color-purple-800-dark);
}

.bg-purple-850 {
  background-color: var(--sc-color-purple-850);
}

.bg-purple-850-dark {
  background-color: var(--sc-color-purple-850-dark);
}

.bg-purple-900 {
  background-color: var(--sc-color-purple-900);
}

.bg-purple-900-dark {
  background-color: var(--sc-color-purple-900-dark);
}

.bg-purple-950 {
  background-color: var(--sc-color-purple-950);
}

.bg-purple-950-dark {
  background-color: var(--sc-color-purple-950-dark);
}

.bg-red-100 {
  background-color: var(--sc-color-red-100);
}

.bg-red-100-dark {
  background-color: var(--sc-color-red-100-dark);
}

.bg-red-150 {
  background-color: var(--sc-color-red-150);
}

.bg-red-150-dark {
  background-color: var(--sc-color-red-150-dark);
}

.bg-red-200 {
  background-color: var(--sc-color-red-200);
}

.bg-red-200-dark {
  background-color: var(--sc-color-red-200-dark);
}

.bg-red-250 {
  background-color: var(--sc-color-red-250);
}

.bg-red-250-dark {
  background-color: var(--sc-color-red-250-dark);
}

.bg-red-300 {
  background-color: var(--sc-color-red-300);
}

.bg-red-300-dark {
  background-color: var(--sc-color-red-300-dark);
}

.bg-red-350 {
  background-color: var(--sc-color-red-350);
}

.bg-red-350-dark {
  background-color: var(--sc-color-red-350-dark);
}

.bg-red-400 {
  background-color: var(--sc-color-red-400);
}

.bg-red-400-dark {
  background-color: var(--sc-color-red-400-dark);
}

.bg-red-450 {
  background-color: var(--sc-color-red-450);
}

.bg-red-450-dark {
  background-color: var(--sc-color-red-450-dark);
}

.bg-red-50 {
  background-color: var(--sc-color-red-50);
}

.bg-red-50-dark {
  background-color: var(--sc-color-red-50-dark);
}

.bg-red-500 {
  background-color: var(--sc-color-red-500);
}

.bg-red-500-dark {
  background-color: var(--sc-color-red-500-dark);
}

.bg-red-550 {
  background-color: var(--sc-color-red-550);
}

.bg-red-550-dark {
  background-color: var(--sc-color-red-550-dark);
}

.bg-red-600 {
  background-color: var(--sc-color-red-600);
}

.bg-red-600-dark {
  background-color: var(--sc-color-red-600-dark);
}

.bg-red-650 {
  background-color: var(--sc-color-red-650);
}

.bg-red-650-dark {
  background-color: var(--sc-color-red-650-dark);
}

.bg-red-700 {
  background-color: var(--sc-color-red-700);
}

.bg-red-700-dark {
  background-color: var(--sc-color-red-700-dark);
}

.bg-red-750 {
  background-color: var(--sc-color-red-750);
}

.bg-red-750-dark {
  background-color: var(--sc-color-red-750-dark);
}

.bg-red-800 {
  background-color: var(--sc-color-red-800);
}

.bg-red-800-dark {
  background-color: var(--sc-color-red-800-dark);
}

.bg-red-850 {
  background-color: var(--sc-color-red-850);
}

.bg-red-850-dark {
  background-color: var(--sc-color-red-850-dark);
}

.bg-red-900 {
  background-color: var(--sc-color-red-900);
}

.bg-red-900-dark {
  background-color: var(--sc-color-red-900-dark);
}

.bg-red-950 {
  background-color: var(--sc-color-red-950);
}

.bg-red-950-dark {
  background-color: var(--sc-color-red-950-dark);
}

.bg-teal-100 {
  background-color: var(--sc-color-teal-100);
}

.bg-teal-500 {
  background-color: var(--sc-color-teal-500);
}

.bg-transparent {
  background-color: transparent;
}

.bg-transparent\/0 {
  background-color: rgb(0 0 0 / 0);
}

.bg-transparent\/10 {
  background-color: rgb(0 0 0 / 0.1);
}

.bg-transparent\/100 {
  background-color: rgb(0 0 0 / 1);
}

.bg-transparent\/15 {
  background-color: rgb(0 0 0 / 0.15);
}

.bg-transparent\/20 {
  background-color: rgb(0 0 0 / 0.2);
}

.bg-transparent\/25 {
  background-color: rgb(0 0 0 / 0.25);
}

.bg-transparent\/30 {
  background-color: rgb(0 0 0 / 0.3);
}

.bg-transparent\/35 {
  background-color: rgb(0 0 0 / 0.35);
}

.bg-transparent\/40 {
  background-color: rgb(0 0 0 / 0.4);
}

.bg-transparent\/45 {
  background-color: rgb(0 0 0 / 0.45);
}

.bg-transparent\/5 {
  background-color: rgb(0 0 0 / 0.05);
}

.bg-transparent\/50 {
  background-color: rgb(0 0 0 / 0.5);
}

.bg-transparent\/55 {
  background-color: rgb(0 0 0 / 0.55);
}

.bg-transparent\/60 {
  background-color: rgb(0 0 0 / 0.6);
}

.bg-transparent\/65 {
  background-color: rgb(0 0 0 / 0.65);
}

.bg-transparent\/70 {
  background-color: rgb(0 0 0 / 0.7);
}

.bg-transparent\/75 {
  background-color: rgb(0 0 0 / 0.75);
}

.bg-transparent\/80 {
  background-color: rgb(0 0 0 / 0.8);
}

.bg-transparent\/85 {
  background-color: rgb(0 0 0 / 0.85);
}

.bg-transparent\/90 {
  background-color: rgb(0 0 0 / 0.9);
}

.bg-transparent\/95 {
  background-color: rgb(0 0 0 / 0.95);
}

.bg-white {
  background-color: var(--sc-color-white);
}

.bg-opacity-0 {
  --tw-bg-opacity: 0;
}

.bg-opacity-10 {
  --tw-bg-opacity: 0.1;
}

.bg-opacity-100 {
  --tw-bg-opacity: 1;
}

.bg-opacity-15 {
  --tw-bg-opacity: 0.15;
}

.bg-opacity-20 {
  --tw-bg-opacity: 0.2;
}

.bg-opacity-25 {
  --tw-bg-opacity: 0.25;
}

.bg-opacity-30 {
  --tw-bg-opacity: 0.3;
}

.bg-opacity-35 {
  --tw-bg-opacity: 0.35;
}

.bg-opacity-40 {
  --tw-bg-opacity: 0.4;
}

.bg-opacity-45 {
  --tw-bg-opacity: 0.45;
}

.bg-opacity-5 {
  --tw-bg-opacity: 0.05;
}

.bg-opacity-50 {
  --tw-bg-opacity: 0.5;
}

.bg-opacity-55 {
  --tw-bg-opacity: 0.55;
}

.bg-opacity-60 {
  --tw-bg-opacity: 0.6;
}

.bg-opacity-65 {
  --tw-bg-opacity: 0.65;
}

.bg-opacity-70 {
  --tw-bg-opacity: 0.7;
}

.bg-opacity-75 {
  --tw-bg-opacity: 0.75;
}

.bg-opacity-80 {
  --tw-bg-opacity: 0.8;
}

.bg-opacity-85 {
  --tw-bg-opacity: 0.85;
}

.bg-opacity-90 {
  --tw-bg-opacity: 0.9;
}

.bg-opacity-95 {
  --tw-bg-opacity: 0.95;
}

.bg-gradient-to-b {
  background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}

.bg-gradient-to-bl {
  background-image: linear-gradient(to bottom left, var(--tw-gradient-stops));
}

.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-l {
  background-image: linear-gradient(to left, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-t {
  background-image: linear-gradient(to top, var(--tw-gradient-stops));
}

.bg-gradient-to-tl {
  background-image: linear-gradient(to top left, var(--tw-gradient-stops));
}

.bg-gradient-to-tr {
  background-image: linear-gradient(to top right, var(--tw-gradient-stops));
}

.bg-none {
  background-image: none;
}

.from-amber-100 {
  --tw-gradient-from: var(--sc-color-amber-100) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-100-dark {
  --tw-gradient-from: var(--sc-color-amber-100-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-150 {
  --tw-gradient-from: var(--sc-color-amber-150) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-150-dark {
  --tw-gradient-from: var(--sc-color-amber-150-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-200 {
  --tw-gradient-from: var(--sc-color-amber-200) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-200-dark {
  --tw-gradient-from: var(--sc-color-amber-200-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-250 {
  --tw-gradient-from: var(--sc-color-amber-250) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-250-dark {
  --tw-gradient-from: var(--sc-color-amber-250-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-300 {
  --tw-gradient-from: var(--sc-color-amber-300) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-300-dark {
  --tw-gradient-from: var(--sc-color-amber-300-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-350 {
  --tw-gradient-from: var(--sc-color-amber-350) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-350-dark {
  --tw-gradient-from: var(--sc-color-amber-350-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-400 {
  --tw-gradient-from: var(--sc-color-amber-400) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-400-dark {
  --tw-gradient-from: var(--sc-color-amber-400-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-450 {
  --tw-gradient-from: var(--sc-color-amber-450) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-450-dark {
  --tw-gradient-from: var(--sc-color-amber-450-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-50 {
  --tw-gradient-from: var(--sc-color-amber-50) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-50-dark {
  --tw-gradient-from: var(--sc-color-amber-50-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-500 {
  --tw-gradient-from: var(--sc-color-amber-500) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-500-dark {
  --tw-gradient-from: var(--sc-color-amber-500-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-550 {
  --tw-gradient-from: var(--sc-color-amber-550) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-550-dark {
  --tw-gradient-from: var(--sc-color-amber-550-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-600 {
  --tw-gradient-from: var(--sc-color-amber-600) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-600-dark {
  --tw-gradient-from: var(--sc-color-amber-600-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-650 {
  --tw-gradient-from: var(--sc-color-amber-650) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-650-dark {
  --tw-gradient-from: var(--sc-color-amber-650-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-700 {
  --tw-gradient-from: var(--sc-color-amber-700) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-700-dark {
  --tw-gradient-from: var(--sc-color-amber-700-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-750 {
  --tw-gradient-from: var(--sc-color-amber-750) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-750-dark {
  --tw-gradient-from: var(--sc-color-amber-750-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-800 {
  --tw-gradient-from: var(--sc-color-amber-800) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-800-dark {
  --tw-gradient-from: var(--sc-color-amber-800-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-850 {
  --tw-gradient-from: var(--sc-color-amber-850) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-850-dark {
  --tw-gradient-from: var(--sc-color-amber-850-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-900 {
  --tw-gradient-from: var(--sc-color-amber-900) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-900-dark {
  --tw-gradient-from: var(--sc-color-amber-900-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-950 {
  --tw-gradient-from: var(--sc-color-amber-950) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-950-dark {
  --tw-gradient-from: var(--sc-color-amber-950-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-100 {
  --tw-gradient-from: var(--sc-color-blue-100) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-100-dark {
  --tw-gradient-from: var(--sc-color-blue-100-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-150 {
  --tw-gradient-from: var(--sc-color-blue-150) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-150-dark {
  --tw-gradient-from: var(--sc-color-blue-150-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-200 {
  --tw-gradient-from: var(--sc-color-blue-200) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-200-dark {
  --tw-gradient-from: var(--sc-color-blue-200-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-250 {
  --tw-gradient-from: var(--sc-color-blue-250) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-250-dark {
  --tw-gradient-from: var(--sc-color-blue-250-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-300 {
  --tw-gradient-from: var(--sc-color-blue-300) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-300-dark {
  --tw-gradient-from: var(--sc-color-blue-300-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-350 {
  --tw-gradient-from: var(--sc-color-blue-350) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-350-dark {
  --tw-gradient-from: var(--sc-color-blue-350-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-400 {
  --tw-gradient-from: var(--sc-color-blue-400) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-400-dark {
  --tw-gradient-from: var(--sc-color-blue-400-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-450 {
  --tw-gradient-from: var(--sc-color-blue-450) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-450-dark {
  --tw-gradient-from: var(--sc-color-blue-450-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-50 {
  --tw-gradient-from: var(--sc-color-blue-50) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-50-dark {
  --tw-gradient-from: var(--sc-color-blue-50-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-500 {
  --tw-gradient-from: var(--sc-color-blue-500) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-500-dark {
  --tw-gradient-from: var(--sc-color-blue-500-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-550 {
  --tw-gradient-from: var(--sc-color-blue-550) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-550-dark {
  --tw-gradient-from: var(--sc-color-blue-550-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-600 {
  --tw-gradient-from: var(--sc-color-blue-600) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-600-dark {
  --tw-gradient-from: var(--sc-color-blue-600-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-650 {
  --tw-gradient-from: var(--sc-color-blue-650) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-650-dark {
  --tw-gradient-from: var(--sc-color-blue-650-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-700 {
  --tw-gradient-from: var(--sc-color-blue-700) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-700-dark {
  --tw-gradient-from: var(--sc-color-blue-700-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-750 {
  --tw-gradient-from: var(--sc-color-blue-750) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-750-dark {
  --tw-gradient-from: var(--sc-color-blue-750-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-800 {
  --tw-gradient-from: var(--sc-color-blue-800) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-800-dark {
  --tw-gradient-from: var(--sc-color-blue-800-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-850 {
  --tw-gradient-from: var(--sc-color-blue-850) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-850-dark {
  --tw-gradient-from: var(--sc-color-blue-850-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-900 {
  --tw-gradient-from: var(--sc-color-blue-900) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-900-dark {
  --tw-gradient-from: var(--sc-color-blue-900-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-950 {
  --tw-gradient-from: var(--sc-color-blue-950) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-950-dark {
  --tw-gradient-from: var(--sc-color-blue-950-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-current {
  --tw-gradient-from: currentColor var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-100 {
  --tw-gradient-from: var(--sc-color-green-100) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-100-dark {
  --tw-gradient-from: var(--sc-color-green-100-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-150 {
  --tw-gradient-from: var(--sc-color-green-150) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-150-dark {
  --tw-gradient-from: var(--sc-color-green-150-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-200 {
  --tw-gradient-from: var(--sc-color-green-200) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-200-dark {
  --tw-gradient-from: var(--sc-color-green-200-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-250 {
  --tw-gradient-from: var(--sc-color-green-250) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-250-dark {
  --tw-gradient-from: var(--sc-color-green-250-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-300 {
  --tw-gradient-from: var(--sc-color-green-300) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-300-dark {
  --tw-gradient-from: var(--sc-color-green-300-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-350 {
  --tw-gradient-from: var(--sc-color-green-350) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-350-dark {
  --tw-gradient-from: var(--sc-color-green-350-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-400 {
  --tw-gradient-from: var(--sc-color-green-400) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-400-dark {
  --tw-gradient-from: var(--sc-color-green-400-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-450 {
  --tw-gradient-from: var(--sc-color-green-450) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-450-dark {
  --tw-gradient-from: var(--sc-color-green-450-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-50 {
  --tw-gradient-from: var(--sc-color-green-50) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-50-dark {
  --tw-gradient-from: var(--sc-color-green-50-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-500 {
  --tw-gradient-from: var(--sc-color-green-500) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-500-dark {
  --tw-gradient-from: var(--sc-color-green-500-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-550 {
  --tw-gradient-from: var(--sc-color-green-550) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-550-dark {
  --tw-gradient-from: var(--sc-color-green-550-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-600 {
  --tw-gradient-from: var(--sc-color-green-600) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-600-dark {
  --tw-gradient-from: var(--sc-color-green-600-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-650 {
  --tw-gradient-from: var(--sc-color-green-650) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-650-dark {
  --tw-gradient-from: var(--sc-color-green-650-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-700 {
  --tw-gradient-from: var(--sc-color-green-700) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-700-dark {
  --tw-gradient-from: var(--sc-color-green-700-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-750 {
  --tw-gradient-from: var(--sc-color-green-750) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-750-dark {
  --tw-gradient-from: var(--sc-color-green-750-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-800 {
  --tw-gradient-from: var(--sc-color-green-800) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-800-dark {
  --tw-gradient-from: var(--sc-color-green-800-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-850 {
  --tw-gradient-from: var(--sc-color-green-850) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-850-dark {
  --tw-gradient-from: var(--sc-color-green-850-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-900 {
  --tw-gradient-from: var(--sc-color-green-900) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-900-dark {
  --tw-gradient-from: var(--sc-color-green-900-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-950 {
  --tw-gradient-from: var(--sc-color-green-950) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-950-dark {
  --tw-gradient-from: var(--sc-color-green-950-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-100 {
  --tw-gradient-from: var(--sc-color-grey-100) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-100-dark {
  --tw-gradient-from: var(--sc-color-grey-100-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-150 {
  --tw-gradient-from: var(--sc-color-grey-150) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-150-dark {
  --tw-gradient-from: var(--sc-color-grey-150-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-200 {
  --tw-gradient-from: var(--sc-color-grey-200) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-200-dark {
  --tw-gradient-from: var(--sc-color-grey-200-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-250 {
  --tw-gradient-from: var(--sc-color-grey-250) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-250-dark {
  --tw-gradient-from: var(--sc-color-grey-250-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-300 {
  --tw-gradient-from: var(--sc-color-grey-300) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-300-dark {
  --tw-gradient-from: var(--sc-color-grey-300-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-350 {
  --tw-gradient-from: var(--sc-color-grey-350) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-350-dark {
  --tw-gradient-from: var(--sc-color-grey-350-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-400 {
  --tw-gradient-from: var(--sc-color-grey-400) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-400-dark {
  --tw-gradient-from: var(--sc-color-grey-400-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-450 {
  --tw-gradient-from: var(--sc-color-grey-450) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-450-dark {
  --tw-gradient-from: var(--sc-color-grey-450-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-50 {
  --tw-gradient-from: var(--sc-color-grey-50) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-50-dark {
  --tw-gradient-from: var(--sc-color-grey-50-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-500 {
  --tw-gradient-from: var(--sc-color-grey-500) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-500-dark {
  --tw-gradient-from: var(--sc-color-grey-500-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-550 {
  --tw-gradient-from: var(--sc-color-grey-550) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-550-dark {
  --tw-gradient-from: var(--sc-color-grey-550-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-600 {
  --tw-gradient-from: var(--sc-color-grey-600) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-600-dark {
  --tw-gradient-from: var(--sc-color-grey-600-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-650 {
  --tw-gradient-from: var(--sc-color-grey-650) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-650-dark {
  --tw-gradient-from: var(--sc-color-grey-650-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-700 {
  --tw-gradient-from: var(--sc-color-grey-700) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-700-dark {
  --tw-gradient-from: var(--sc-color-grey-700-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-750 {
  --tw-gradient-from: var(--sc-color-grey-750) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-750-dark {
  --tw-gradient-from: var(--sc-color-grey-750-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-800 {
  --tw-gradient-from: var(--sc-color-grey-800) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-800-dark {
  --tw-gradient-from: var(--sc-color-grey-800-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-850 {
  --tw-gradient-from: var(--sc-color-grey-850) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-850-dark {
  --tw-gradient-from: var(--sc-color-grey-850-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-900 {
  --tw-gradient-from: var(--sc-color-grey-900) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-900-dark {
  --tw-gradient-from: var(--sc-color-grey-900-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-950 {
  --tw-gradient-from: var(--sc-color-grey-950) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-950-dark {
  --tw-gradient-from: var(--sc-color-grey-950-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-grey-black {
  --tw-gradient-from: var(--sc-color-black) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-muted {
  --tw-gradient-from: var(--sc-color-blue-900) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-orange-500 {
  --tw-gradient-from: var(--sc-color-orange-500) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-primary {
  --tw-gradient-from: var(--sc-color-blue) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-100 {
  --tw-gradient-from: var(--sc-color-purple-100) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-100-dark {
  --tw-gradient-from: var(--sc-color-purple-100-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-150 {
  --tw-gradient-from: var(--sc-color-purple-150) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-150-dark {
  --tw-gradient-from: var(--sc-color-purple-150-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-200 {
  --tw-gradient-from: var(--sc-color-purple-200) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-200-dark {
  --tw-gradient-from: var(--sc-color-purple-200-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-250 {
  --tw-gradient-from: var(--sc-color-purple-250) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-250-dark {
  --tw-gradient-from: var(--sc-color-purple-250-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-300 {
  --tw-gradient-from: var(--sc-color-purple-300) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-300-dark {
  --tw-gradient-from: var(--sc-color-purple-300-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-350 {
  --tw-gradient-from: var(--sc-color-purple-350) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-350-dark {
  --tw-gradient-from: var(--sc-color-purple-350-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-400 {
  --tw-gradient-from: var(--sc-color-purple-400) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-400-dark {
  --tw-gradient-from: var(--sc-color-purple-400-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-450 {
  --tw-gradient-from: var(--sc-color-purple-450) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-450-dark {
  --tw-gradient-from: var(--sc-color-purple-450-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-50 {
  --tw-gradient-from: var(--sc-color-purple-50) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-50-dark {
  --tw-gradient-from: var(--sc-color-purple-50-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-500 {
  --tw-gradient-from: var(--sc-color-purple-500) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-500-dark {
  --tw-gradient-from: var(--sc-color-purple-500-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-550 {
  --tw-gradient-from: var(--sc-color-purple-550) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-550-dark {
  --tw-gradient-from: var(--sc-color-purple-550-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-600 {
  --tw-gradient-from: var(--sc-color-purple-600) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-600-dark {
  --tw-gradient-from: var(--sc-color-purple-600-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-650 {
  --tw-gradient-from: var(--sc-color-purple-650) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-650-dark {
  --tw-gradient-from: var(--sc-color-purple-650-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-700 {
  --tw-gradient-from: var(--sc-color-purple-700) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-700-dark {
  --tw-gradient-from: var(--sc-color-purple-700-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-750 {
  --tw-gradient-from: var(--sc-color-purple-750) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-750-dark {
  --tw-gradient-from: var(--sc-color-purple-750-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-800 {
  --tw-gradient-from: var(--sc-color-purple-800) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-800-dark {
  --tw-gradient-from: var(--sc-color-purple-800-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-850 {
  --tw-gradient-from: var(--sc-color-purple-850) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-850-dark {
  --tw-gradient-from: var(--sc-color-purple-850-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-900 {
  --tw-gradient-from: var(--sc-color-purple-900) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-900-dark {
  --tw-gradient-from: var(--sc-color-purple-900-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-950 {
  --tw-gradient-from: var(--sc-color-purple-950) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-950-dark {
  --tw-gradient-from: var(--sc-color-purple-950-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-100 {
  --tw-gradient-from: var(--sc-color-red-100) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-100-dark {
  --tw-gradient-from: var(--sc-color-red-100-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-150 {
  --tw-gradient-from: var(--sc-color-red-150) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-150-dark {
  --tw-gradient-from: var(--sc-color-red-150-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-200 {
  --tw-gradient-from: var(--sc-color-red-200) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-200-dark {
  --tw-gradient-from: var(--sc-color-red-200-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-250 {
  --tw-gradient-from: var(--sc-color-red-250) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-250-dark {
  --tw-gradient-from: var(--sc-color-red-250-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-300 {
  --tw-gradient-from: var(--sc-color-red-300) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-300-dark {
  --tw-gradient-from: var(--sc-color-red-300-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-350 {
  --tw-gradient-from: var(--sc-color-red-350) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-350-dark {
  --tw-gradient-from: var(--sc-color-red-350-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-400 {
  --tw-gradient-from: var(--sc-color-red-400) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-400-dark {
  --tw-gradient-from: var(--sc-color-red-400-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-450 {
  --tw-gradient-from: var(--sc-color-red-450) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-450-dark {
  --tw-gradient-from: var(--sc-color-red-450-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-50 {
  --tw-gradient-from: var(--sc-color-red-50) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-50-dark {
  --tw-gradient-from: var(--sc-color-red-50-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-500 {
  --tw-gradient-from: var(--sc-color-red-500) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-500-dark {
  --tw-gradient-from: var(--sc-color-red-500-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-550 {
  --tw-gradient-from: var(--sc-color-red-550) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-550-dark {
  --tw-gradient-from: var(--sc-color-red-550-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-600 {
  --tw-gradient-from: var(--sc-color-red-600) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-600-dark {
  --tw-gradient-from: var(--sc-color-red-600-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-650 {
  --tw-gradient-from: var(--sc-color-red-650) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-650-dark {
  --tw-gradient-from: var(--sc-color-red-650-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-700 {
  --tw-gradient-from: var(--sc-color-red-700) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-700-dark {
  --tw-gradient-from: var(--sc-color-red-700-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-750 {
  --tw-gradient-from: var(--sc-color-red-750) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-750-dark {
  --tw-gradient-from: var(--sc-color-red-750-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-800 {
  --tw-gradient-from: var(--sc-color-red-800) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-800-dark {
  --tw-gradient-from: var(--sc-color-red-800-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-850 {
  --tw-gradient-from: var(--sc-color-red-850) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-850-dark {
  --tw-gradient-from: var(--sc-color-red-850-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-900 {
  --tw-gradient-from: var(--sc-color-red-900) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-900-dark {
  --tw-gradient-from: var(--sc-color-red-900-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-950 {
  --tw-gradient-from: var(--sc-color-red-950) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-950-dark {
  --tw-gradient-from: var(--sc-color-red-950-dark) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-teal-100 {
  --tw-gradient-from: var(--sc-color-teal-100) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-teal-500 {
  --tw-gradient-from: var(--sc-color-teal-500) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent {
  --tw-gradient-from: transparent var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/0 {
  --tw-gradient-from: rgb(0 0 0 / 0) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/10 {
  --tw-gradient-from: rgb(0 0 0 / 0.1) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/100 {
  --tw-gradient-from: rgb(0 0 0 / 1) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/15 {
  --tw-gradient-from: rgb(0 0 0 / 0.15) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/20 {
  --tw-gradient-from: rgb(0 0 0 / 0.2) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/25 {
  --tw-gradient-from: rgb(0 0 0 / 0.25) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/30 {
  --tw-gradient-from: rgb(0 0 0 / 0.3) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/35 {
  --tw-gradient-from: rgb(0 0 0 / 0.35) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/40 {
  --tw-gradient-from: rgb(0 0 0 / 0.4) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/45 {
  --tw-gradient-from: rgb(0 0 0 / 0.45) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/5 {
  --tw-gradient-from: rgb(0 0 0 / 0.05) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/50 {
  --tw-gradient-from: rgb(0 0 0 / 0.5) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/55 {
  --tw-gradient-from: rgb(0 0 0 / 0.55) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/60 {
  --tw-gradient-from: rgb(0 0 0 / 0.6) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/65 {
  --tw-gradient-from: rgb(0 0 0 / 0.65) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/70 {
  --tw-gradient-from: rgb(0 0 0 / 0.7) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/75 {
  --tw-gradient-from: rgb(0 0 0 / 0.75) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/80 {
  --tw-gradient-from: rgb(0 0 0 / 0.8) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/85 {
  --tw-gradient-from: rgb(0 0 0 / 0.85) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/90 {
  --tw-gradient-from: rgb(0 0 0 / 0.9) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent\/95 {
  --tw-gradient-from: rgb(0 0 0 / 0.95) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-white {
  --tw-gradient-from: var(--sc-color-white) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-0\% {
  --tw-gradient-from-position: 0%;
}

.from-10\% {
  --tw-gradient-from-position: 10%;
}

.from-100\% {
  --tw-gradient-from-position: 100%;
}

.from-15\% {
  --tw-gradient-from-position: 15%;
}

.from-20\% {
  --tw-gradient-from-position: 20%;
}

.from-25\% {
  --tw-gradient-from-position: 25%;
}

.from-30\% {
  --tw-gradient-from-position: 30%;
}

.from-35\% {
  --tw-gradient-from-position: 35%;
}

.from-40\% {
  --tw-gradient-from-position: 40%;
}

.from-45\% {
  --tw-gradient-from-position: 45%;
}

.from-5\% {
  --tw-gradient-from-position: 5%;
}

.from-50\% {
  --tw-gradient-from-position: 50%;
}

.from-55\% {
  --tw-gradient-from-position: 55%;
}

.from-60\% {
  --tw-gradient-from-position: 60%;
}

.from-65\% {
  --tw-gradient-from-position: 65%;
}

.from-70\% {
  --tw-gradient-from-position: 70%;
}

.from-75\% {
  --tw-gradient-from-position: 75%;
}

.from-80\% {
  --tw-gradient-from-position: 80%;
}

.from-85\% {
  --tw-gradient-from-position: 85%;
}

.from-90\% {
  --tw-gradient-from-position: 90%;
}

.from-95\% {
  --tw-gradient-from-position: 95%;
}

.via-amber-100 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-100) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-100-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-100-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-150 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-150) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-150-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-150-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-200 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-200) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-200-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-200-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-250 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-250) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-250-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-250-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-300 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-300) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-300-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-300-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-350 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-350) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-350-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-350-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-400 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-400) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-400-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-400-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-450 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-450) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-450-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-450-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-50 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-50) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-50-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-50-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-500 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-500) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-500-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-500-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-550 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-550) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-550-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-550-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-600 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-600) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-600-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-600-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-650 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-650) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-650-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-650-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-700 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-700) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-700-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-700-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-750 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-750) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-750-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-750-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-800 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-800) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-800-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-800-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-850 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-850) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-850-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-850-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-900 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-900) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-900-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-900-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-950 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-950) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-amber-950-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-amber-950-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-100 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-100) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-100-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-100-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-150 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-150) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-150-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-150-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-200 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-200) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-200-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-200-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-250 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-250) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-250-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-250-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-300 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-300) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-300-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-300-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-350 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-350) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-350-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-350-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-400 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-400) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-400-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-400-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-450 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-450) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-450-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-450-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-50 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-50) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-50-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-50-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-500 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-500) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-500-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-500-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-550 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-550) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-550-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-550-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-600 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-600) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-600-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-600-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-650 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-650) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-650-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-650-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-700 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-700) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-700-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-700-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-750 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-750) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-750-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-750-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-800 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-800) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-800-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-800-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-850 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-850) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-850-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-850-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-900 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-900) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-900-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-900-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-950 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-950) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-blue-950-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-950-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-current {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), currentColor var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-100 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-100) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-100-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-100-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-150 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-150) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-150-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-150-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-200 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-200) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-200-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-200-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-250 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-250) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-250-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-250-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-300 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-300) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-300-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-300-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-350 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-350) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-350-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-350-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-400 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-400) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-400-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-400-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-450 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-450) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-450-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-450-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-50 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-50) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-50-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-50-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-500 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-500) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-500-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-500-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-550 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-550) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-550-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-550-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-600 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-600) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-600-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-600-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-650 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-650) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-650-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-650-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-700 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-700) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-700-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-700-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-750 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-750) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-750-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-750-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-800 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-800) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-800-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-800-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-850 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-850) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-850-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-850-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-900 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-900) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-900-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-900-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-950 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-950) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-green-950-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-green-950-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-100 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-100) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-100-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-100-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-150 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-150) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-150-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-150-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-200 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-200) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-200-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-200-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-250 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-250) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-250-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-250-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-300 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-300) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-300-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-300-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-350 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-350) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-350-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-350-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-400 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-400) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-400-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-400-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-450 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-450) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-450-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-450-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-50 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-50) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-50-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-50-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-500 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-500) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-500-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-500-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-550 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-550) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-550-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-550-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-600 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-600) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-600-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-600-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-650 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-650) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-650-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-650-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-700 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-700) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-700-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-700-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-750 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-750) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-750-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-750-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-800 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-800) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-800-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-800-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-850 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-850) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-850-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-850-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-900 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-900) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-900-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-900-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-950 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-950) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-950-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-grey-950-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-grey-black {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-black) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-muted {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue-900) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-orange-500 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-orange-500) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-primary {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-blue) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-100 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-100) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-100-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-100-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-150 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-150) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-150-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-150-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-200 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-200) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-200-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-200-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-250 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-250) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-250-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-250-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-300 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-300) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-300-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-300-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-350 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-350) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-350-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-350-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-400 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-400) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-400-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-400-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-450 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-450) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-450-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-450-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-50 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-50) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-50-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-50-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-500 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-500) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-500-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-500-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-550 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-550) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-550-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-550-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-600 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-600) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-600-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-600-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-650 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-650) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-650-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-650-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-700 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-700) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-700-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-700-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-750 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-750) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-750-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-750-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-800 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-800) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-800-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-800-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-850 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-850) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-850-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-850-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-900 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-900) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-900-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-900-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-950 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-950) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-purple-950-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-purple-950-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-100 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-100) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-100-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-100-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-150 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-150) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-150-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-150-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-200 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-200) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-200-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-200-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-250 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-250) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-250-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-250-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-300 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-300) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-300-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-300-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-350 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-350) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-350-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-350-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-400 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-400) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-400-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-400-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-450 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-450) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-450-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-450-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-50 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-50) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-50-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-50-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-500 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-500) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-500-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-500-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-550 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-550) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-550-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-550-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-600 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-600) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-600-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-600-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-650 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-650) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-650-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-650-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-700 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-700) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-700-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-700-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-750 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-750) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-750-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-750-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-800 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-800) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-800-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-800-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-850 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-850) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-850-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-850-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-900 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-900) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-900-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-900-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-950 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-950) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-red-950-dark {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-red-950-dark) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-teal-100 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-teal-100) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-teal-500 {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-teal-500) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), transparent var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/0 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/10 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.1) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/100 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 1) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/15 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.15) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/20 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.2) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/25 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.25) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/30 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.3) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/35 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.35) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/40 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.4) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/45 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.45) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/5 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.05) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/50 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.5) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/55 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.55) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/60 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.6) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/65 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.65) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/70 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.7) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/75 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.75) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/80 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.8) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/85 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.85) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/90 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.9) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent\/95 {
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.95) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-white {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--sc-color-white) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-0\% {
  --tw-gradient-via-position: 0%;
}

.via-10\% {
  --tw-gradient-via-position: 10%;
}

.via-100\% {
  --tw-gradient-via-position: 100%;
}

.via-15\% {
  --tw-gradient-via-position: 15%;
}

.via-20\% {
  --tw-gradient-via-position: 20%;
}

.via-25\% {
  --tw-gradient-via-position: 25%;
}

.via-30\% {
  --tw-gradient-via-position: 30%;
}

.via-35\% {
  --tw-gradient-via-position: 35%;
}

.via-40\% {
  --tw-gradient-via-position: 40%;
}

.via-45\% {
  --tw-gradient-via-position: 45%;
}

.via-5\% {
  --tw-gradient-via-position: 5%;
}

.via-50\% {
  --tw-gradient-via-position: 50%;
}

.via-55\% {
  --tw-gradient-via-position: 55%;
}

.via-60\% {
  --tw-gradient-via-position: 60%;
}

.via-65\% {
  --tw-gradient-via-position: 65%;
}

.via-70\% {
  --tw-gradient-via-position: 70%;
}

.via-75\% {
  --tw-gradient-via-position: 75%;
}

.via-80\% {
  --tw-gradient-via-position: 80%;
}

.via-85\% {
  --tw-gradient-via-position: 85%;
}

.via-90\% {
  --tw-gradient-via-position: 90%;
}

.via-95\% {
  --tw-gradient-via-position: 95%;
}

.to-amber-100 {
  --tw-gradient-to: var(--sc-color-amber-100) var(--tw-gradient-to-position);
}

.to-amber-100-dark {
  --tw-gradient-to: var(--sc-color-amber-100-dark) var(--tw-gradient-to-position);
}

.to-amber-150 {
  --tw-gradient-to: var(--sc-color-amber-150) var(--tw-gradient-to-position);
}

.to-amber-150-dark {
  --tw-gradient-to: var(--sc-color-amber-150-dark) var(--tw-gradient-to-position);
}

.to-amber-200 {
  --tw-gradient-to: var(--sc-color-amber-200) var(--tw-gradient-to-position);
}

.to-amber-200-dark {
  --tw-gradient-to: var(--sc-color-amber-200-dark) var(--tw-gradient-to-position);
}

.to-amber-250 {
  --tw-gradient-to: var(--sc-color-amber-250) var(--tw-gradient-to-position);
}

.to-amber-250-dark {
  --tw-gradient-to: var(--sc-color-amber-250-dark) var(--tw-gradient-to-position);
}

.to-amber-300 {
  --tw-gradient-to: var(--sc-color-amber-300) var(--tw-gradient-to-position);
}

.to-amber-300-dark {
  --tw-gradient-to: var(--sc-color-amber-300-dark) var(--tw-gradient-to-position);
}

.to-amber-350 {
  --tw-gradient-to: var(--sc-color-amber-350) var(--tw-gradient-to-position);
}

.to-amber-350-dark {
  --tw-gradient-to: var(--sc-color-amber-350-dark) var(--tw-gradient-to-position);
}

.to-amber-400 {
  --tw-gradient-to: var(--sc-color-amber-400) var(--tw-gradient-to-position);
}

.to-amber-400-dark {
  --tw-gradient-to: var(--sc-color-amber-400-dark) var(--tw-gradient-to-position);
}

.to-amber-450 {
  --tw-gradient-to: var(--sc-color-amber-450) var(--tw-gradient-to-position);
}

.to-amber-450-dark {
  --tw-gradient-to: var(--sc-color-amber-450-dark) var(--tw-gradient-to-position);
}

.to-amber-50 {
  --tw-gradient-to: var(--sc-color-amber-50) var(--tw-gradient-to-position);
}

.to-amber-50-dark {
  --tw-gradient-to: var(--sc-color-amber-50-dark) var(--tw-gradient-to-position);
}

.to-amber-500 {
  --tw-gradient-to: var(--sc-color-amber-500) var(--tw-gradient-to-position);
}

.to-amber-500-dark {
  --tw-gradient-to: var(--sc-color-amber-500-dark) var(--tw-gradient-to-position);
}

.to-amber-550 {
  --tw-gradient-to: var(--sc-color-amber-550) var(--tw-gradient-to-position);
}

.to-amber-550-dark {
  --tw-gradient-to: var(--sc-color-amber-550-dark) var(--tw-gradient-to-position);
}

.to-amber-600 {
  --tw-gradient-to: var(--sc-color-amber-600) var(--tw-gradient-to-position);
}

.to-amber-600-dark {
  --tw-gradient-to: var(--sc-color-amber-600-dark) var(--tw-gradient-to-position);
}

.to-amber-650 {
  --tw-gradient-to: var(--sc-color-amber-650) var(--tw-gradient-to-position);
}

.to-amber-650-dark {
  --tw-gradient-to: var(--sc-color-amber-650-dark) var(--tw-gradient-to-position);
}

.to-amber-700 {
  --tw-gradient-to: var(--sc-color-amber-700) var(--tw-gradient-to-position);
}

.to-amber-700-dark {
  --tw-gradient-to: var(--sc-color-amber-700-dark) var(--tw-gradient-to-position);
}

.to-amber-750 {
  --tw-gradient-to: var(--sc-color-amber-750) var(--tw-gradient-to-position);
}

.to-amber-750-dark {
  --tw-gradient-to: var(--sc-color-amber-750-dark) var(--tw-gradient-to-position);
}

.to-amber-800 {
  --tw-gradient-to: var(--sc-color-amber-800) var(--tw-gradient-to-position);
}

.to-amber-800-dark {
  --tw-gradient-to: var(--sc-color-amber-800-dark) var(--tw-gradient-to-position);
}

.to-amber-850 {
  --tw-gradient-to: var(--sc-color-amber-850) var(--tw-gradient-to-position);
}

.to-amber-850-dark {
  --tw-gradient-to: var(--sc-color-amber-850-dark) var(--tw-gradient-to-position);
}

.to-amber-900 {
  --tw-gradient-to: var(--sc-color-amber-900) var(--tw-gradient-to-position);
}

.to-amber-900-dark {
  --tw-gradient-to: var(--sc-color-amber-900-dark) var(--tw-gradient-to-position);
}

.to-amber-950 {
  --tw-gradient-to: var(--sc-color-amber-950) var(--tw-gradient-to-position);
}

.to-amber-950-dark {
  --tw-gradient-to: var(--sc-color-amber-950-dark) var(--tw-gradient-to-position);
}

.to-blue-100 {
  --tw-gradient-to: var(--sc-color-blue-100) var(--tw-gradient-to-position);
}

.to-blue-100-dark {
  --tw-gradient-to: var(--sc-color-blue-100-dark) var(--tw-gradient-to-position);
}

.to-blue-150 {
  --tw-gradient-to: var(--sc-color-blue-150) var(--tw-gradient-to-position);
}

.to-blue-150-dark {
  --tw-gradient-to: var(--sc-color-blue-150-dark) var(--tw-gradient-to-position);
}

.to-blue-200 {
  --tw-gradient-to: var(--sc-color-blue-200) var(--tw-gradient-to-position);
}

.to-blue-200-dark {
  --tw-gradient-to: var(--sc-color-blue-200-dark) var(--tw-gradient-to-position);
}

.to-blue-250 {
  --tw-gradient-to: var(--sc-color-blue-250) var(--tw-gradient-to-position);
}

.to-blue-250-dark {
  --tw-gradient-to: var(--sc-color-blue-250-dark) var(--tw-gradient-to-position);
}

.to-blue-300 {
  --tw-gradient-to: var(--sc-color-blue-300) var(--tw-gradient-to-position);
}

.to-blue-300-dark {
  --tw-gradient-to: var(--sc-color-blue-300-dark) var(--tw-gradient-to-position);
}

.to-blue-350 {
  --tw-gradient-to: var(--sc-color-blue-350) var(--tw-gradient-to-position);
}

.to-blue-350-dark {
  --tw-gradient-to: var(--sc-color-blue-350-dark) var(--tw-gradient-to-position);
}

.to-blue-400 {
  --tw-gradient-to: var(--sc-color-blue-400) var(--tw-gradient-to-position);
}

.to-blue-400-dark {
  --tw-gradient-to: var(--sc-color-blue-400-dark) var(--tw-gradient-to-position);
}

.to-blue-450 {
  --tw-gradient-to: var(--sc-color-blue-450) var(--tw-gradient-to-position);
}

.to-blue-450-dark {
  --tw-gradient-to: var(--sc-color-blue-450-dark) var(--tw-gradient-to-position);
}

.to-blue-50 {
  --tw-gradient-to: var(--sc-color-blue-50) var(--tw-gradient-to-position);
}

.to-blue-50-dark {
  --tw-gradient-to: var(--sc-color-blue-50-dark) var(--tw-gradient-to-position);
}

.to-blue-500 {
  --tw-gradient-to: var(--sc-color-blue-500) var(--tw-gradient-to-position);
}

.to-blue-500-dark {
  --tw-gradient-to: var(--sc-color-blue-500-dark) var(--tw-gradient-to-position);
}

.to-blue-550 {
  --tw-gradient-to: var(--sc-color-blue-550) var(--tw-gradient-to-position);
}

.to-blue-550-dark {
  --tw-gradient-to: var(--sc-color-blue-550-dark) var(--tw-gradient-to-position);
}

.to-blue-600 {
  --tw-gradient-to: var(--sc-color-blue-600) var(--tw-gradient-to-position);
}

.to-blue-600-dark {
  --tw-gradient-to: var(--sc-color-blue-600-dark) var(--tw-gradient-to-position);
}

.to-blue-650 {
  --tw-gradient-to: var(--sc-color-blue-650) var(--tw-gradient-to-position);
}

.to-blue-650-dark {
  --tw-gradient-to: var(--sc-color-blue-650-dark) var(--tw-gradient-to-position);
}

.to-blue-700 {
  --tw-gradient-to: var(--sc-color-blue-700) var(--tw-gradient-to-position);
}

.to-blue-700-dark {
  --tw-gradient-to: var(--sc-color-blue-700-dark) var(--tw-gradient-to-position);
}

.to-blue-750 {
  --tw-gradient-to: var(--sc-color-blue-750) var(--tw-gradient-to-position);
}

.to-blue-750-dark {
  --tw-gradient-to: var(--sc-color-blue-750-dark) var(--tw-gradient-to-position);
}

.to-blue-800 {
  --tw-gradient-to: var(--sc-color-blue-800) var(--tw-gradient-to-position);
}

.to-blue-800-dark {
  --tw-gradient-to: var(--sc-color-blue-800-dark) var(--tw-gradient-to-position);
}

.to-blue-850 {
  --tw-gradient-to: var(--sc-color-blue-850) var(--tw-gradient-to-position);
}

.to-blue-850-dark {
  --tw-gradient-to: var(--sc-color-blue-850-dark) var(--tw-gradient-to-position);
}

.to-blue-900 {
  --tw-gradient-to: var(--sc-color-blue-900) var(--tw-gradient-to-position);
}

.to-blue-900-dark {
  --tw-gradient-to: var(--sc-color-blue-900-dark) var(--tw-gradient-to-position);
}

.to-blue-950 {
  --tw-gradient-to: var(--sc-color-blue-950) var(--tw-gradient-to-position);
}

.to-blue-950-dark {
  --tw-gradient-to: var(--sc-color-blue-950-dark) var(--tw-gradient-to-position);
}

.to-current {
  --tw-gradient-to: currentColor var(--tw-gradient-to-position);
}

.to-green-100 {
  --tw-gradient-to: var(--sc-color-green-100) var(--tw-gradient-to-position);
}

.to-green-100-dark {
  --tw-gradient-to: var(--sc-color-green-100-dark) var(--tw-gradient-to-position);
}

.to-green-150 {
  --tw-gradient-to: var(--sc-color-green-150) var(--tw-gradient-to-position);
}

.to-green-150-dark {
  --tw-gradient-to: var(--sc-color-green-150-dark) var(--tw-gradient-to-position);
}

.to-green-200 {
  --tw-gradient-to: var(--sc-color-green-200) var(--tw-gradient-to-position);
}

.to-green-200-dark {
  --tw-gradient-to: var(--sc-color-green-200-dark) var(--tw-gradient-to-position);
}

.to-green-250 {
  --tw-gradient-to: var(--sc-color-green-250) var(--tw-gradient-to-position);
}

.to-green-250-dark {
  --tw-gradient-to: var(--sc-color-green-250-dark) var(--tw-gradient-to-position);
}

.to-green-300 {
  --tw-gradient-to: var(--sc-color-green-300) var(--tw-gradient-to-position);
}

.to-green-300-dark {
  --tw-gradient-to: var(--sc-color-green-300-dark) var(--tw-gradient-to-position);
}

.to-green-350 {
  --tw-gradient-to: var(--sc-color-green-350) var(--tw-gradient-to-position);
}

.to-green-350-dark {
  --tw-gradient-to: var(--sc-color-green-350-dark) var(--tw-gradient-to-position);
}

.to-green-400 {
  --tw-gradient-to: var(--sc-color-green-400) var(--tw-gradient-to-position);
}

.to-green-400-dark {
  --tw-gradient-to: var(--sc-color-green-400-dark) var(--tw-gradient-to-position);
}

.to-green-450 {
  --tw-gradient-to: var(--sc-color-green-450) var(--tw-gradient-to-position);
}

.to-green-450-dark {
  --tw-gradient-to: var(--sc-color-green-450-dark) var(--tw-gradient-to-position);
}

.to-green-50 {
  --tw-gradient-to: var(--sc-color-green-50) var(--tw-gradient-to-position);
}

.to-green-50-dark {
  --tw-gradient-to: var(--sc-color-green-50-dark) var(--tw-gradient-to-position);
}

.to-green-500 {
  --tw-gradient-to: var(--sc-color-green-500) var(--tw-gradient-to-position);
}

.to-green-500-dark {
  --tw-gradient-to: var(--sc-color-green-500-dark) var(--tw-gradient-to-position);
}

.to-green-550 {
  --tw-gradient-to: var(--sc-color-green-550) var(--tw-gradient-to-position);
}

.to-green-550-dark {
  --tw-gradient-to: var(--sc-color-green-550-dark) var(--tw-gradient-to-position);
}

.to-green-600 {
  --tw-gradient-to: var(--sc-color-green-600) var(--tw-gradient-to-position);
}

.to-green-600-dark {
  --tw-gradient-to: var(--sc-color-green-600-dark) var(--tw-gradient-to-position);
}

.to-green-650 {
  --tw-gradient-to: var(--sc-color-green-650) var(--tw-gradient-to-position);
}

.to-green-650-dark {
  --tw-gradient-to: var(--sc-color-green-650-dark) var(--tw-gradient-to-position);
}

.to-green-700 {
  --tw-gradient-to: var(--sc-color-green-700) var(--tw-gradient-to-position);
}

.to-green-700-dark {
  --tw-gradient-to: var(--sc-color-green-700-dark) var(--tw-gradient-to-position);
}

.to-green-750 {
  --tw-gradient-to: var(--sc-color-green-750) var(--tw-gradient-to-position);
}

.to-green-750-dark {
  --tw-gradient-to: var(--sc-color-green-750-dark) var(--tw-gradient-to-position);
}

.to-green-800 {
  --tw-gradient-to: var(--sc-color-green-800) var(--tw-gradient-to-position);
}

.to-green-800-dark {
  --tw-gradient-to: var(--sc-color-green-800-dark) var(--tw-gradient-to-position);
}

.to-green-850 {
  --tw-gradient-to: var(--sc-color-green-850) var(--tw-gradient-to-position);
}

.to-green-850-dark {
  --tw-gradient-to: var(--sc-color-green-850-dark) var(--tw-gradient-to-position);
}

.to-green-900 {
  --tw-gradient-to: var(--sc-color-green-900) var(--tw-gradient-to-position);
}

.to-green-900-dark {
  --tw-gradient-to: var(--sc-color-green-900-dark) var(--tw-gradient-to-position);
}

.to-green-950 {
  --tw-gradient-to: var(--sc-color-green-950) var(--tw-gradient-to-position);
}

.to-green-950-dark {
  --tw-gradient-to: var(--sc-color-green-950-dark) var(--tw-gradient-to-position);
}

.to-grey-100 {
  --tw-gradient-to: var(--sc-color-grey-100) var(--tw-gradient-to-position);
}

.to-grey-100-dark {
  --tw-gradient-to: var(--sc-color-grey-100-dark) var(--tw-gradient-to-position);
}

.to-grey-150 {
  --tw-gradient-to: var(--sc-color-grey-150) var(--tw-gradient-to-position);
}

.to-grey-150-dark {
  --tw-gradient-to: var(--sc-color-grey-150-dark) var(--tw-gradient-to-position);
}

.to-grey-200 {
  --tw-gradient-to: var(--sc-color-grey-200) var(--tw-gradient-to-position);
}

.to-grey-200-dark {
  --tw-gradient-to: var(--sc-color-grey-200-dark) var(--tw-gradient-to-position);
}

.to-grey-250 {
  --tw-gradient-to: var(--sc-color-grey-250) var(--tw-gradient-to-position);
}

.to-grey-250-dark {
  --tw-gradient-to: var(--sc-color-grey-250-dark) var(--tw-gradient-to-position);
}

.to-grey-300 {
  --tw-gradient-to: var(--sc-color-grey-300) var(--tw-gradient-to-position);
}

.to-grey-300-dark {
  --tw-gradient-to: var(--sc-color-grey-300-dark) var(--tw-gradient-to-position);
}

.to-grey-350 {
  --tw-gradient-to: var(--sc-color-grey-350) var(--tw-gradient-to-position);
}

.to-grey-350-dark {
  --tw-gradient-to: var(--sc-color-grey-350-dark) var(--tw-gradient-to-position);
}

.to-grey-400 {
  --tw-gradient-to: var(--sc-color-grey-400) var(--tw-gradient-to-position);
}

.to-grey-400-dark {
  --tw-gradient-to: var(--sc-color-grey-400-dark) var(--tw-gradient-to-position);
}

.to-grey-450 {
  --tw-gradient-to: var(--sc-color-grey-450) var(--tw-gradient-to-position);
}

.to-grey-450-dark {
  --tw-gradient-to: var(--sc-color-grey-450-dark) var(--tw-gradient-to-position);
}

.to-grey-50 {
  --tw-gradient-to: var(--sc-color-grey-50) var(--tw-gradient-to-position);
}

.to-grey-50-dark {
  --tw-gradient-to: var(--sc-color-grey-50-dark) var(--tw-gradient-to-position);
}

.to-grey-500 {
  --tw-gradient-to: var(--sc-color-grey-500) var(--tw-gradient-to-position);
}

.to-grey-500-dark {
  --tw-gradient-to: var(--sc-color-grey-500-dark) var(--tw-gradient-to-position);
}

.to-grey-550 {
  --tw-gradient-to: var(--sc-color-grey-550) var(--tw-gradient-to-position);
}

.to-grey-550-dark {
  --tw-gradient-to: var(--sc-color-grey-550-dark) var(--tw-gradient-to-position);
}

.to-grey-600 {
  --tw-gradient-to: var(--sc-color-grey-600) var(--tw-gradient-to-position);
}

.to-grey-600-dark {
  --tw-gradient-to: var(--sc-color-grey-600-dark) var(--tw-gradient-to-position);
}

.to-grey-650 {
  --tw-gradient-to: var(--sc-color-grey-650) var(--tw-gradient-to-position);
}

.to-grey-650-dark {
  --tw-gradient-to: var(--sc-color-grey-650-dark) var(--tw-gradient-to-position);
}

.to-grey-700 {
  --tw-gradient-to: var(--sc-color-grey-700) var(--tw-gradient-to-position);
}

.to-grey-700-dark {
  --tw-gradient-to: var(--sc-color-grey-700-dark) var(--tw-gradient-to-position);
}

.to-grey-750 {
  --tw-gradient-to: var(--sc-color-grey-750) var(--tw-gradient-to-position);
}

.to-grey-750-dark {
  --tw-gradient-to: var(--sc-color-grey-750-dark) var(--tw-gradient-to-position);
}

.to-grey-800 {
  --tw-gradient-to: var(--sc-color-grey-800) var(--tw-gradient-to-position);
}

.to-grey-800-dark {
  --tw-gradient-to: var(--sc-color-grey-800-dark) var(--tw-gradient-to-position);
}

.to-grey-850 {
  --tw-gradient-to: var(--sc-color-grey-850) var(--tw-gradient-to-position);
}

.to-grey-850-dark {
  --tw-gradient-to: var(--sc-color-grey-850-dark) var(--tw-gradient-to-position);
}

.to-grey-900 {
  --tw-gradient-to: var(--sc-color-grey-900) var(--tw-gradient-to-position);
}

.to-grey-900-dark {
  --tw-gradient-to: var(--sc-color-grey-900-dark) var(--tw-gradient-to-position);
}

.to-grey-950 {
  --tw-gradient-to: var(--sc-color-grey-950) var(--tw-gradient-to-position);
}

.to-grey-950-dark {
  --tw-gradient-to: var(--sc-color-grey-950-dark) var(--tw-gradient-to-position);
}

.to-grey-black {
  --tw-gradient-to: var(--sc-color-black) var(--tw-gradient-to-position);
}

.to-muted {
  --tw-gradient-to: var(--sc-color-blue-900) var(--tw-gradient-to-position);
}

.to-orange-500 {
  --tw-gradient-to: var(--sc-color-orange-500) var(--tw-gradient-to-position);
}

.to-primary {
  --tw-gradient-to: var(--sc-color-blue) var(--tw-gradient-to-position);
}

.to-purple-100 {
  --tw-gradient-to: var(--sc-color-purple-100) var(--tw-gradient-to-position);
}

.to-purple-100-dark {
  --tw-gradient-to: var(--sc-color-purple-100-dark) var(--tw-gradient-to-position);
}

.to-purple-150 {
  --tw-gradient-to: var(--sc-color-purple-150) var(--tw-gradient-to-position);
}

.to-purple-150-dark {
  --tw-gradient-to: var(--sc-color-purple-150-dark) var(--tw-gradient-to-position);
}

.to-purple-200 {
  --tw-gradient-to: var(--sc-color-purple-200) var(--tw-gradient-to-position);
}

.to-purple-200-dark {
  --tw-gradient-to: var(--sc-color-purple-200-dark) var(--tw-gradient-to-position);
}

.to-purple-250 {
  --tw-gradient-to: var(--sc-color-purple-250) var(--tw-gradient-to-position);
}

.to-purple-250-dark {
  --tw-gradient-to: var(--sc-color-purple-250-dark) var(--tw-gradient-to-position);
}

.to-purple-300 {
  --tw-gradient-to: var(--sc-color-purple-300) var(--tw-gradient-to-position);
}

.to-purple-300-dark {
  --tw-gradient-to: var(--sc-color-purple-300-dark) var(--tw-gradient-to-position);
}

.to-purple-350 {
  --tw-gradient-to: var(--sc-color-purple-350) var(--tw-gradient-to-position);
}

.to-purple-350-dark {
  --tw-gradient-to: var(--sc-color-purple-350-dark) var(--tw-gradient-to-position);
}

.to-purple-400 {
  --tw-gradient-to: var(--sc-color-purple-400) var(--tw-gradient-to-position);
}

.to-purple-400-dark {
  --tw-gradient-to: var(--sc-color-purple-400-dark) var(--tw-gradient-to-position);
}

.to-purple-450 {
  --tw-gradient-to: var(--sc-color-purple-450) var(--tw-gradient-to-position);
}

.to-purple-450-dark {
  --tw-gradient-to: var(--sc-color-purple-450-dark) var(--tw-gradient-to-position);
}

.to-purple-50 {
  --tw-gradient-to: var(--sc-color-purple-50) var(--tw-gradient-to-position);
}

.to-purple-50-dark {
  --tw-gradient-to: var(--sc-color-purple-50-dark) var(--tw-gradient-to-position);
}

.to-purple-500 {
  --tw-gradient-to: var(--sc-color-purple-500) var(--tw-gradient-to-position);
}

.to-purple-500-dark {
  --tw-gradient-to: var(--sc-color-purple-500-dark) var(--tw-gradient-to-position);
}

.to-purple-550 {
  --tw-gradient-to: var(--sc-color-purple-550) var(--tw-gradient-to-position);
}

.to-purple-550-dark {
  --tw-gradient-to: var(--sc-color-purple-550-dark) var(--tw-gradient-to-position);
}

.to-purple-600 {
  --tw-gradient-to: var(--sc-color-purple-600) var(--tw-gradient-to-position);
}

.to-purple-600-dark {
  --tw-gradient-to: var(--sc-color-purple-600-dark) var(--tw-gradient-to-position);
}

.to-purple-650 {
  --tw-gradient-to: var(--sc-color-purple-650) var(--tw-gradient-to-position);
}

.to-purple-650-dark {
  --tw-gradient-to: var(--sc-color-purple-650-dark) var(--tw-gradient-to-position);
}

.to-purple-700 {
  --tw-gradient-to: var(--sc-color-purple-700) var(--tw-gradient-to-position);
}

.to-purple-700-dark {
  --tw-gradient-to: var(--sc-color-purple-700-dark) var(--tw-gradient-to-position);
}

.to-purple-750 {
  --tw-gradient-to: var(--sc-color-purple-750) var(--tw-gradient-to-position);
}

.to-purple-750-dark {
  --tw-gradient-to: var(--sc-color-purple-750-dark) var(--tw-gradient-to-position);
}

.to-purple-800 {
  --tw-gradient-to: var(--sc-color-purple-800) var(--tw-gradient-to-position);
}

.to-purple-800-dark {
  --tw-gradient-to: var(--sc-color-purple-800-dark) var(--tw-gradient-to-position);
}

.to-purple-850 {
  --tw-gradient-to: var(--sc-color-purple-850) var(--tw-gradient-to-position);
}

.to-purple-850-dark {
  --tw-gradient-to: var(--sc-color-purple-850-dark) var(--tw-gradient-to-position);
}

.to-purple-900 {
  --tw-gradient-to: var(--sc-color-purple-900) var(--tw-gradient-to-position);
}

.to-purple-900-dark {
  --tw-gradient-to: var(--sc-color-purple-900-dark) var(--tw-gradient-to-position);
}

.to-purple-950 {
  --tw-gradient-to: var(--sc-color-purple-950) var(--tw-gradient-to-position);
}

.to-purple-950-dark {
  --tw-gradient-to: var(--sc-color-purple-950-dark) var(--tw-gradient-to-position);
}

.to-red-100 {
  --tw-gradient-to: var(--sc-color-red-100) var(--tw-gradient-to-position);
}

.to-red-100-dark {
  --tw-gradient-to: var(--sc-color-red-100-dark) var(--tw-gradient-to-position);
}

.to-red-150 {
  --tw-gradient-to: var(--sc-color-red-150) var(--tw-gradient-to-position);
}

.to-red-150-dark {
  --tw-gradient-to: var(--sc-color-red-150-dark) var(--tw-gradient-to-position);
}

.to-red-200 {
  --tw-gradient-to: var(--sc-color-red-200) var(--tw-gradient-to-position);
}

.to-red-200-dark {
  --tw-gradient-to: var(--sc-color-red-200-dark) var(--tw-gradient-to-position);
}

.to-red-250 {
  --tw-gradient-to: var(--sc-color-red-250) var(--tw-gradient-to-position);
}

.to-red-250-dark {
  --tw-gradient-to: var(--sc-color-red-250-dark) var(--tw-gradient-to-position);
}

.to-red-300 {
  --tw-gradient-to: var(--sc-color-red-300) var(--tw-gradient-to-position);
}

.to-red-300-dark {
  --tw-gradient-to: var(--sc-color-red-300-dark) var(--tw-gradient-to-position);
}

.to-red-350 {
  --tw-gradient-to: var(--sc-color-red-350) var(--tw-gradient-to-position);
}

.to-red-350-dark {
  --tw-gradient-to: var(--sc-color-red-350-dark) var(--tw-gradient-to-position);
}

.to-red-400 {
  --tw-gradient-to: var(--sc-color-red-400) var(--tw-gradient-to-position);
}

.to-red-400-dark {
  --tw-gradient-to: var(--sc-color-red-400-dark) var(--tw-gradient-to-position);
}

.to-red-450 {
  --tw-gradient-to: var(--sc-color-red-450) var(--tw-gradient-to-position);
}

.to-red-450-dark {
  --tw-gradient-to: var(--sc-color-red-450-dark) var(--tw-gradient-to-position);
}

.to-red-50 {
  --tw-gradient-to: var(--sc-color-red-50) var(--tw-gradient-to-position);
}

.to-red-50-dark {
  --tw-gradient-to: var(--sc-color-red-50-dark) var(--tw-gradient-to-position);
}

.to-red-500 {
  --tw-gradient-to: var(--sc-color-red-500) var(--tw-gradient-to-position);
}

.to-red-500-dark {
  --tw-gradient-to: var(--sc-color-red-500-dark) var(--tw-gradient-to-position);
}

.to-red-550 {
  --tw-gradient-to: var(--sc-color-red-550) var(--tw-gradient-to-position);
}

.to-red-550-dark {
  --tw-gradient-to: var(--sc-color-red-550-dark) var(--tw-gradient-to-position);
}

.to-red-600 {
  --tw-gradient-to: var(--sc-color-red-600) var(--tw-gradient-to-position);
}

.to-red-600-dark {
  --tw-gradient-to: var(--sc-color-red-600-dark) var(--tw-gradient-to-position);
}

.to-red-650 {
  --tw-gradient-to: var(--sc-color-red-650) var(--tw-gradient-to-position);
}

.to-red-650-dark {
  --tw-gradient-to: var(--sc-color-red-650-dark) var(--tw-gradient-to-position);
}

.to-red-700 {
  --tw-gradient-to: var(--sc-color-red-700) var(--tw-gradient-to-position);
}

.to-red-700-dark {
  --tw-gradient-to: var(--sc-color-red-700-dark) var(--tw-gradient-to-position);
}

.to-red-750 {
  --tw-gradient-to: var(--sc-color-red-750) var(--tw-gradient-to-position);
}

.to-red-750-dark {
  --tw-gradient-to: var(--sc-color-red-750-dark) var(--tw-gradient-to-position);
}

.to-red-800 {
  --tw-gradient-to: var(--sc-color-red-800) var(--tw-gradient-to-position);
}

.to-red-800-dark {
  --tw-gradient-to: var(--sc-color-red-800-dark) var(--tw-gradient-to-position);
}

.to-red-850 {
  --tw-gradient-to: var(--sc-color-red-850) var(--tw-gradient-to-position);
}

.to-red-850-dark {
  --tw-gradient-to: var(--sc-color-red-850-dark) var(--tw-gradient-to-position);
}

.to-red-900 {
  --tw-gradient-to: var(--sc-color-red-900) var(--tw-gradient-to-position);
}

.to-red-900-dark {
  --tw-gradient-to: var(--sc-color-red-900-dark) var(--tw-gradient-to-position);
}

.to-red-950 {
  --tw-gradient-to: var(--sc-color-red-950) var(--tw-gradient-to-position);
}

.to-red-950-dark {
  --tw-gradient-to: var(--sc-color-red-950-dark) var(--tw-gradient-to-position);
}

.to-teal-100 {
  --tw-gradient-to: var(--sc-color-teal-100) var(--tw-gradient-to-position);
}

.to-teal-500 {
  --tw-gradient-to: var(--sc-color-teal-500) var(--tw-gradient-to-position);
}

.to-transparent {
  --tw-gradient-to: transparent var(--tw-gradient-to-position);
}

.to-transparent\/0 {
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
}

.to-transparent\/10 {
  --tw-gradient-to: rgb(0 0 0 / 0.1) var(--tw-gradient-to-position);
}

.to-transparent\/100 {
  --tw-gradient-to: rgb(0 0 0 / 1) var(--tw-gradient-to-position);
}

.to-transparent\/15 {
  --tw-gradient-to: rgb(0 0 0 / 0.15) var(--tw-gradient-to-position);
}

.to-transparent\/20 {
  --tw-gradient-to: rgb(0 0 0 / 0.2) var(--tw-gradient-to-position);
}

.to-transparent\/25 {
  --tw-gradient-to: rgb(0 0 0 / 0.25) var(--tw-gradient-to-position);
}

.to-transparent\/30 {
  --tw-gradient-to: rgb(0 0 0 / 0.3) var(--tw-gradient-to-position);
}

.to-transparent\/35 {
  --tw-gradient-to: rgb(0 0 0 / 0.35) var(--tw-gradient-to-position);
}

.to-transparent\/40 {
  --tw-gradient-to: rgb(0 0 0 / 0.4) var(--tw-gradient-to-position);
}

.to-transparent\/45 {
  --tw-gradient-to: rgb(0 0 0 / 0.45) var(--tw-gradient-to-position);
}

.to-transparent\/5 {
  --tw-gradient-to: rgb(0 0 0 / 0.05) var(--tw-gradient-to-position);
}

.to-transparent\/50 {
  --tw-gradient-to: rgb(0 0 0 / 0.5) var(--tw-gradient-to-position);
}

.to-transparent\/55 {
  --tw-gradient-to: rgb(0 0 0 / 0.55) var(--tw-gradient-to-position);
}

.to-transparent\/60 {
  --tw-gradient-to: rgb(0 0 0 / 0.6) var(--tw-gradient-to-position);
}

.to-transparent\/65 {
  --tw-gradient-to: rgb(0 0 0 / 0.65) var(--tw-gradient-to-position);
}

.to-transparent\/70 {
  --tw-gradient-to: rgb(0 0 0 / 0.7) var(--tw-gradient-to-position);
}

.to-transparent\/75 {
  --tw-gradient-to: rgb(0 0 0 / 0.75) var(--tw-gradient-to-position);
}

.to-transparent\/80 {
  --tw-gradient-to: rgb(0 0 0 / 0.8) var(--tw-gradient-to-position);
}

.to-transparent\/85 {
  --tw-gradient-to: rgb(0 0 0 / 0.85) var(--tw-gradient-to-position);
}

.to-transparent\/90 {
  --tw-gradient-to: rgb(0 0 0 / 0.9) var(--tw-gradient-to-position);
}

.to-transparent\/95 {
  --tw-gradient-to: rgb(0 0 0 / 0.95) var(--tw-gradient-to-position);
}

.to-white {
  --tw-gradient-to: var(--sc-color-white) var(--tw-gradient-to-position);
}

.to-0\% {
  --tw-gradient-to-position: 0%;
}

.to-10\% {
  --tw-gradient-to-position: 10%;
}

.to-100\% {
  --tw-gradient-to-position: 100%;
}

.to-15\% {
  --tw-gradient-to-position: 15%;
}

.to-20\% {
  --tw-gradient-to-position: 20%;
}

.to-25\% {
  --tw-gradient-to-position: 25%;
}

.to-30\% {
  --tw-gradient-to-position: 30%;
}

.to-35\% {
  --tw-gradient-to-position: 35%;
}

.to-40\% {
  --tw-gradient-to-position: 40%;
}

.to-45\% {
  --tw-gradient-to-position: 45%;
}

.to-5\% {
  --tw-gradient-to-position: 5%;
}

.to-50\% {
  --tw-gradient-to-position: 50%;
}

.to-55\% {
  --tw-gradient-to-position: 55%;
}

.to-60\% {
  --tw-gradient-to-position: 60%;
}

.to-65\% {
  --tw-gradient-to-position: 65%;
}

.to-70\% {
  --tw-gradient-to-position: 70%;
}

.to-75\% {
  --tw-gradient-to-position: 75%;
}

.to-80\% {
  --tw-gradient-to-position: 80%;
}

.to-85\% {
  --tw-gradient-to-position: 85%;
}

.to-90\% {
  --tw-gradient-to-position: 90%;
}

.to-95\% {
  --tw-gradient-to-position: 95%;
}

.bg-auto {
  background-size: auto;
}

.bg-contain {
  background-size: contain;
}

.bg-cover {
  background-size: cover;
}

.bg-bottom {
  background-position: bottom;
}

.bg-center {
  background-position: center;
}

.bg-left {
  background-position: left;
}

.bg-left-bottom {
  background-position: left bottom;
}

.bg-left-top {
  background-position: left top;
}

.bg-right {
  background-position: right;
}

.bg-right-bottom {
  background-position: right bottom;
}

.bg-right-top {
  background-position: right top;
}

.bg-top {
  background-position: top;
}

.fill-amber-100 {
  fill: var(--sc-color-amber-100);
}

.fill-amber-100-dark {
  fill: var(--sc-color-amber-100-dark);
}

.fill-amber-150 {
  fill: var(--sc-color-amber-150);
}

.fill-amber-150-dark {
  fill: var(--sc-color-amber-150-dark);
}

.fill-amber-200 {
  fill: var(--sc-color-amber-200);
}

.fill-amber-200-dark {
  fill: var(--sc-color-amber-200-dark);
}

.fill-amber-250 {
  fill: var(--sc-color-amber-250);
}

.fill-amber-250-dark {
  fill: var(--sc-color-amber-250-dark);
}

.fill-amber-300 {
  fill: var(--sc-color-amber-300);
}

.fill-amber-300-dark {
  fill: var(--sc-color-amber-300-dark);
}

.fill-amber-350 {
  fill: var(--sc-color-amber-350);
}

.fill-amber-350-dark {
  fill: var(--sc-color-amber-350-dark);
}

.fill-amber-400 {
  fill: var(--sc-color-amber-400);
}

.fill-amber-400-dark {
  fill: var(--sc-color-amber-400-dark);
}

.fill-amber-450 {
  fill: var(--sc-color-amber-450);
}

.fill-amber-450-dark {
  fill: var(--sc-color-amber-450-dark);
}

.fill-amber-50 {
  fill: var(--sc-color-amber-50);
}

.fill-amber-50-dark {
  fill: var(--sc-color-amber-50-dark);
}

.fill-amber-500 {
  fill: var(--sc-color-amber-500);
}

.fill-amber-500-dark {
  fill: var(--sc-color-amber-500-dark);
}

.fill-amber-550 {
  fill: var(--sc-color-amber-550);
}

.fill-amber-550-dark {
  fill: var(--sc-color-amber-550-dark);
}

.fill-amber-600 {
  fill: var(--sc-color-amber-600);
}

.fill-amber-600-dark {
  fill: var(--sc-color-amber-600-dark);
}

.fill-amber-650 {
  fill: var(--sc-color-amber-650);
}

.fill-amber-650-dark {
  fill: var(--sc-color-amber-650-dark);
}

.fill-amber-700 {
  fill: var(--sc-color-amber-700);
}

.fill-amber-700-dark {
  fill: var(--sc-color-amber-700-dark);
}

.fill-amber-750 {
  fill: var(--sc-color-amber-750);
}

.fill-amber-750-dark {
  fill: var(--sc-color-amber-750-dark);
}

.fill-amber-800 {
  fill: var(--sc-color-amber-800);
}

.fill-amber-800-dark {
  fill: var(--sc-color-amber-800-dark);
}

.fill-amber-850 {
  fill: var(--sc-color-amber-850);
}

.fill-amber-850-dark {
  fill: var(--sc-color-amber-850-dark);
}

.fill-amber-900 {
  fill: var(--sc-color-amber-900);
}

.fill-amber-900-dark {
  fill: var(--sc-color-amber-900-dark);
}

.fill-amber-950 {
  fill: var(--sc-color-amber-950);
}

.fill-amber-950-dark {
  fill: var(--sc-color-amber-950-dark);
}

.fill-blue-100 {
  fill: var(--sc-color-blue-100);
}

.fill-blue-100-dark {
  fill: var(--sc-color-blue-100-dark);
}

.fill-blue-150 {
  fill: var(--sc-color-blue-150);
}

.fill-blue-150-dark {
  fill: var(--sc-color-blue-150-dark);
}

.fill-blue-200 {
  fill: var(--sc-color-blue-200);
}

.fill-blue-200-dark {
  fill: var(--sc-color-blue-200-dark);
}

.fill-blue-250 {
  fill: var(--sc-color-blue-250);
}

.fill-blue-250-dark {
  fill: var(--sc-color-blue-250-dark);
}

.fill-blue-300 {
  fill: var(--sc-color-blue-300);
}

.fill-blue-300-dark {
  fill: var(--sc-color-blue-300-dark);
}

.fill-blue-350 {
  fill: var(--sc-color-blue-350);
}

.fill-blue-350-dark {
  fill: var(--sc-color-blue-350-dark);
}

.fill-blue-400 {
  fill: var(--sc-color-blue-400);
}

.fill-blue-400-dark {
  fill: var(--sc-color-blue-400-dark);
}

.fill-blue-450 {
  fill: var(--sc-color-blue-450);
}

.fill-blue-450-dark {
  fill: var(--sc-color-blue-450-dark);
}

.fill-blue-50 {
  fill: var(--sc-color-blue-50);
}

.fill-blue-50-dark {
  fill: var(--sc-color-blue-50-dark);
}

.fill-blue-500 {
  fill: var(--sc-color-blue-500);
}

.fill-blue-500-dark {
  fill: var(--sc-color-blue-500-dark);
}

.fill-blue-550 {
  fill: var(--sc-color-blue-550);
}

.fill-blue-550-dark {
  fill: var(--sc-color-blue-550-dark);
}

.fill-blue-600 {
  fill: var(--sc-color-blue-600);
}

.fill-blue-600-dark {
  fill: var(--sc-color-blue-600-dark);
}

.fill-blue-650 {
  fill: var(--sc-color-blue-650);
}

.fill-blue-650-dark {
  fill: var(--sc-color-blue-650-dark);
}

.fill-blue-700 {
  fill: var(--sc-color-blue-700);
}

.fill-blue-700-dark {
  fill: var(--sc-color-blue-700-dark);
}

.fill-blue-750 {
  fill: var(--sc-color-blue-750);
}

.fill-blue-750-dark {
  fill: var(--sc-color-blue-750-dark);
}

.fill-blue-800 {
  fill: var(--sc-color-blue-800);
}

.fill-blue-800-dark {
  fill: var(--sc-color-blue-800-dark);
}

.fill-blue-850 {
  fill: var(--sc-color-blue-850);
}

.fill-blue-850-dark {
  fill: var(--sc-color-blue-850-dark);
}

.fill-blue-900 {
  fill: var(--sc-color-blue-900);
}

.fill-blue-900-dark {
  fill: var(--sc-color-blue-900-dark);
}

.fill-blue-950 {
  fill: var(--sc-color-blue-950);
}

.fill-blue-950-dark {
  fill: var(--sc-color-blue-950-dark);
}

.fill-current {
  fill: currentColor;
}

.fill-green-100 {
  fill: var(--sc-color-green-100);
}

.fill-green-100-dark {
  fill: var(--sc-color-green-100-dark);
}

.fill-green-150 {
  fill: var(--sc-color-green-150);
}

.fill-green-150-dark {
  fill: var(--sc-color-green-150-dark);
}

.fill-green-200 {
  fill: var(--sc-color-green-200);
}

.fill-green-200-dark {
  fill: var(--sc-color-green-200-dark);
}

.fill-green-250 {
  fill: var(--sc-color-green-250);
}

.fill-green-250-dark {
  fill: var(--sc-color-green-250-dark);
}

.fill-green-300 {
  fill: var(--sc-color-green-300);
}

.fill-green-300-dark {
  fill: var(--sc-color-green-300-dark);
}

.fill-green-350 {
  fill: var(--sc-color-green-350);
}

.fill-green-350-dark {
  fill: var(--sc-color-green-350-dark);
}

.fill-green-400 {
  fill: var(--sc-color-green-400);
}

.fill-green-400-dark {
  fill: var(--sc-color-green-400-dark);
}

.fill-green-450 {
  fill: var(--sc-color-green-450);
}

.fill-green-450-dark {
  fill: var(--sc-color-green-450-dark);
}

.fill-green-50 {
  fill: var(--sc-color-green-50);
}

.fill-green-50-dark {
  fill: var(--sc-color-green-50-dark);
}

.fill-green-500 {
  fill: var(--sc-color-green-500);
}

.fill-green-500-dark {
  fill: var(--sc-color-green-500-dark);
}

.fill-green-550 {
  fill: var(--sc-color-green-550);
}

.fill-green-550-dark {
  fill: var(--sc-color-green-550-dark);
}

.fill-green-600 {
  fill: var(--sc-color-green-600);
}

.fill-green-600-dark {
  fill: var(--sc-color-green-600-dark);
}

.fill-green-650 {
  fill: var(--sc-color-green-650);
}

.fill-green-650-dark {
  fill: var(--sc-color-green-650-dark);
}

.fill-green-700 {
  fill: var(--sc-color-green-700);
}

.fill-green-700-dark {
  fill: var(--sc-color-green-700-dark);
}

.fill-green-750 {
  fill: var(--sc-color-green-750);
}

.fill-green-750-dark {
  fill: var(--sc-color-green-750-dark);
}

.fill-green-800 {
  fill: var(--sc-color-green-800);
}

.fill-green-800-dark {
  fill: var(--sc-color-green-800-dark);
}

.fill-green-850 {
  fill: var(--sc-color-green-850);
}

.fill-green-850-dark {
  fill: var(--sc-color-green-850-dark);
}

.fill-green-900 {
  fill: var(--sc-color-green-900);
}

.fill-green-900-dark {
  fill: var(--sc-color-green-900-dark);
}

.fill-green-950 {
  fill: var(--sc-color-green-950);
}

.fill-green-950-dark {
  fill: var(--sc-color-green-950-dark);
}

.fill-grey-100 {
  fill: var(--sc-color-grey-100);
}

.fill-grey-100-dark {
  fill: var(--sc-color-grey-100-dark);
}

.fill-grey-150 {
  fill: var(--sc-color-grey-150);
}

.fill-grey-150-dark {
  fill: var(--sc-color-grey-150-dark);
}

.fill-grey-200 {
  fill: var(--sc-color-grey-200);
}

.fill-grey-200-dark {
  fill: var(--sc-color-grey-200-dark);
}

.fill-grey-250 {
  fill: var(--sc-color-grey-250);
}

.fill-grey-250-dark {
  fill: var(--sc-color-grey-250-dark);
}

.fill-grey-300 {
  fill: var(--sc-color-grey-300);
}

.fill-grey-300-dark {
  fill: var(--sc-color-grey-300-dark);
}

.fill-grey-350 {
  fill: var(--sc-color-grey-350);
}

.fill-grey-350-dark {
  fill: var(--sc-color-grey-350-dark);
}

.fill-grey-400 {
  fill: var(--sc-color-grey-400);
}

.fill-grey-400-dark {
  fill: var(--sc-color-grey-400-dark);
}

.fill-grey-450 {
  fill: var(--sc-color-grey-450);
}

.fill-grey-450-dark {
  fill: var(--sc-color-grey-450-dark);
}

.fill-grey-50 {
  fill: var(--sc-color-grey-50);
}

.fill-grey-50-dark {
  fill: var(--sc-color-grey-50-dark);
}

.fill-grey-500 {
  fill: var(--sc-color-grey-500);
}

.fill-grey-500-dark {
  fill: var(--sc-color-grey-500-dark);
}

.fill-grey-550 {
  fill: var(--sc-color-grey-550);
}

.fill-grey-550-dark {
  fill: var(--sc-color-grey-550-dark);
}

.fill-grey-600 {
  fill: var(--sc-color-grey-600);
}

.fill-grey-600-dark {
  fill: var(--sc-color-grey-600-dark);
}

.fill-grey-650 {
  fill: var(--sc-color-grey-650);
}

.fill-grey-650-dark {
  fill: var(--sc-color-grey-650-dark);
}

.fill-grey-700 {
  fill: var(--sc-color-grey-700);
}

.fill-grey-700-dark {
  fill: var(--sc-color-grey-700-dark);
}

.fill-grey-750 {
  fill: var(--sc-color-grey-750);
}

.fill-grey-750-dark {
  fill: var(--sc-color-grey-750-dark);
}

.fill-grey-800 {
  fill: var(--sc-color-grey-800);
}

.fill-grey-800-dark {
  fill: var(--sc-color-grey-800-dark);
}

.fill-grey-850 {
  fill: var(--sc-color-grey-850);
}

.fill-grey-850-dark {
  fill: var(--sc-color-grey-850-dark);
}

.fill-grey-900 {
  fill: var(--sc-color-grey-900);
}

.fill-grey-900-dark {
  fill: var(--sc-color-grey-900-dark);
}

.fill-grey-950 {
  fill: var(--sc-color-grey-950);
}

.fill-grey-950-dark {
  fill: var(--sc-color-grey-950-dark);
}

.fill-grey-black {
  fill: var(--sc-color-black);
}

.fill-muted {
  fill: var(--sc-color-blue-900);
}

.fill-none {
  fill: none;
}

.fill-orange-500 {
  fill: var(--sc-color-orange-500);
}

.fill-primary {
  fill: var(--sc-color-blue);
}

.fill-purple-100 {
  fill: var(--sc-color-purple-100);
}

.fill-purple-100-dark {
  fill: var(--sc-color-purple-100-dark);
}

.fill-purple-150 {
  fill: var(--sc-color-purple-150);
}

.fill-purple-150-dark {
  fill: var(--sc-color-purple-150-dark);
}

.fill-purple-200 {
  fill: var(--sc-color-purple-200);
}

.fill-purple-200-dark {
  fill: var(--sc-color-purple-200-dark);
}

.fill-purple-250 {
  fill: var(--sc-color-purple-250);
}

.fill-purple-250-dark {
  fill: var(--sc-color-purple-250-dark);
}

.fill-purple-300 {
  fill: var(--sc-color-purple-300);
}

.fill-purple-300-dark {
  fill: var(--sc-color-purple-300-dark);
}

.fill-purple-350 {
  fill: var(--sc-color-purple-350);
}

.fill-purple-350-dark {
  fill: var(--sc-color-purple-350-dark);
}

.fill-purple-400 {
  fill: var(--sc-color-purple-400);
}

.fill-purple-400-dark {
  fill: var(--sc-color-purple-400-dark);
}

.fill-purple-450 {
  fill: var(--sc-color-purple-450);
}

.fill-purple-450-dark {
  fill: var(--sc-color-purple-450-dark);
}

.fill-purple-50 {
  fill: var(--sc-color-purple-50);
}

.fill-purple-50-dark {
  fill: var(--sc-color-purple-50-dark);
}

.fill-purple-500 {
  fill: var(--sc-color-purple-500);
}

.fill-purple-500-dark {
  fill: var(--sc-color-purple-500-dark);
}

.fill-purple-550 {
  fill: var(--sc-color-purple-550);
}

.fill-purple-550-dark {
  fill: var(--sc-color-purple-550-dark);
}

.fill-purple-600 {
  fill: var(--sc-color-purple-600);
}

.fill-purple-600-dark {
  fill: var(--sc-color-purple-600-dark);
}

.fill-purple-650 {
  fill: var(--sc-color-purple-650);
}

.fill-purple-650-dark {
  fill: var(--sc-color-purple-650-dark);
}

.fill-purple-700 {
  fill: var(--sc-color-purple-700);
}

.fill-purple-700-dark {
  fill: var(--sc-color-purple-700-dark);
}

.fill-purple-750 {
  fill: var(--sc-color-purple-750);
}

.fill-purple-750-dark {
  fill: var(--sc-color-purple-750-dark);
}

.fill-purple-800 {
  fill: var(--sc-color-purple-800);
}

.fill-purple-800-dark {
  fill: var(--sc-color-purple-800-dark);
}

.fill-purple-850 {
  fill: var(--sc-color-purple-850);
}

.fill-purple-850-dark {
  fill: var(--sc-color-purple-850-dark);
}

.fill-purple-900 {
  fill: var(--sc-color-purple-900);
}

.fill-purple-900-dark {
  fill: var(--sc-color-purple-900-dark);
}

.fill-purple-950 {
  fill: var(--sc-color-purple-950);
}

.fill-purple-950-dark {
  fill: var(--sc-color-purple-950-dark);
}

.fill-red-100 {
  fill: var(--sc-color-red-100);
}

.fill-red-100-dark {
  fill: var(--sc-color-red-100-dark);
}

.fill-red-150 {
  fill: var(--sc-color-red-150);
}

.fill-red-150-dark {
  fill: var(--sc-color-red-150-dark);
}

.fill-red-200 {
  fill: var(--sc-color-red-200);
}

.fill-red-200-dark {
  fill: var(--sc-color-red-200-dark);
}

.fill-red-250 {
  fill: var(--sc-color-red-250);
}

.fill-red-250-dark {
  fill: var(--sc-color-red-250-dark);
}

.fill-red-300 {
  fill: var(--sc-color-red-300);
}

.fill-red-300-dark {
  fill: var(--sc-color-red-300-dark);
}

.fill-red-350 {
  fill: var(--sc-color-red-350);
}

.fill-red-350-dark {
  fill: var(--sc-color-red-350-dark);
}

.fill-red-400 {
  fill: var(--sc-color-red-400);
}

.fill-red-400-dark {
  fill: var(--sc-color-red-400-dark);
}

.fill-red-450 {
  fill: var(--sc-color-red-450);
}

.fill-red-450-dark {
  fill: var(--sc-color-red-450-dark);
}

.fill-red-50 {
  fill: var(--sc-color-red-50);
}

.fill-red-50-dark {
  fill: var(--sc-color-red-50-dark);
}

.fill-red-500 {
  fill: var(--sc-color-red-500);
}

.fill-red-500-dark {
  fill: var(--sc-color-red-500-dark);
}

.fill-red-550 {
  fill: var(--sc-color-red-550);
}

.fill-red-550-dark {
  fill: var(--sc-color-red-550-dark);
}

.fill-red-600 {
  fill: var(--sc-color-red-600);
}

.fill-red-600-dark {
  fill: var(--sc-color-red-600-dark);
}

.fill-red-650 {
  fill: var(--sc-color-red-650);
}

.fill-red-650-dark {
  fill: var(--sc-color-red-650-dark);
}

.fill-red-700 {
  fill: var(--sc-color-red-700);
}

.fill-red-700-dark {
  fill: var(--sc-color-red-700-dark);
}

.fill-red-750 {
  fill: var(--sc-color-red-750);
}

.fill-red-750-dark {
  fill: var(--sc-color-red-750-dark);
}

.fill-red-800 {
  fill: var(--sc-color-red-800);
}

.fill-red-800-dark {
  fill: var(--sc-color-red-800-dark);
}

.fill-red-850 {
  fill: var(--sc-color-red-850);
}

.fill-red-850-dark {
  fill: var(--sc-color-red-850-dark);
}

.fill-red-900 {
  fill: var(--sc-color-red-900);
}

.fill-red-900-dark {
  fill: var(--sc-color-red-900-dark);
}

.fill-red-950 {
  fill: var(--sc-color-red-950);
}

.fill-red-950-dark {
  fill: var(--sc-color-red-950-dark);
}

.fill-teal-100 {
  fill: var(--sc-color-teal-100);
}

.fill-teal-500 {
  fill: var(--sc-color-teal-500);
}

.fill-transparent {
  fill: transparent;
}

.fill-transparent\/0 {
  fill: rgb(0 0 0 / 0);
}

.fill-transparent\/10 {
  fill: rgb(0 0 0 / 0.1);
}

.fill-transparent\/100 {
  fill: rgb(0 0 0 / 1);
}

.fill-transparent\/15 {
  fill: rgb(0 0 0 / 0.15);
}

.fill-transparent\/20 {
  fill: rgb(0 0 0 / 0.2);
}

.fill-transparent\/25 {
  fill: rgb(0 0 0 / 0.25);
}

.fill-transparent\/30 {
  fill: rgb(0 0 0 / 0.3);
}

.fill-transparent\/35 {
  fill: rgb(0 0 0 / 0.35);
}

.fill-transparent\/40 {
  fill: rgb(0 0 0 / 0.4);
}

.fill-transparent\/45 {
  fill: rgb(0 0 0 / 0.45);
}

.fill-transparent\/5 {
  fill: rgb(0 0 0 / 0.05);
}

.fill-transparent\/50 {
  fill: rgb(0 0 0 / 0.5);
}

.fill-transparent\/55 {
  fill: rgb(0 0 0 / 0.55);
}

.fill-transparent\/60 {
  fill: rgb(0 0 0 / 0.6);
}

.fill-transparent\/65 {
  fill: rgb(0 0 0 / 0.65);
}

.fill-transparent\/70 {
  fill: rgb(0 0 0 / 0.7);
}

.fill-transparent\/75 {
  fill: rgb(0 0 0 / 0.75);
}

.fill-transparent\/80 {
  fill: rgb(0 0 0 / 0.8);
}

.fill-transparent\/85 {
  fill: rgb(0 0 0 / 0.85);
}

.fill-transparent\/90 {
  fill: rgb(0 0 0 / 0.9);
}

.fill-transparent\/95 {
  fill: rgb(0 0 0 / 0.95);
}

.fill-white {
  fill: var(--sc-color-white);
}

.stroke-amber-100 {
  stroke: var(--sc-color-amber-100);
}

.stroke-amber-100-dark {
  stroke: var(--sc-color-amber-100-dark);
}

.stroke-amber-150 {
  stroke: var(--sc-color-amber-150);
}

.stroke-amber-150-dark {
  stroke: var(--sc-color-amber-150-dark);
}

.stroke-amber-200 {
  stroke: var(--sc-color-amber-200);
}

.stroke-amber-200-dark {
  stroke: var(--sc-color-amber-200-dark);
}

.stroke-amber-250 {
  stroke: var(--sc-color-amber-250);
}

.stroke-amber-250-dark {
  stroke: var(--sc-color-amber-250-dark);
}

.stroke-amber-300 {
  stroke: var(--sc-color-amber-300);
}

.stroke-amber-300-dark {
  stroke: var(--sc-color-amber-300-dark);
}

.stroke-amber-350 {
  stroke: var(--sc-color-amber-350);
}

.stroke-amber-350-dark {
  stroke: var(--sc-color-amber-350-dark);
}

.stroke-amber-400 {
  stroke: var(--sc-color-amber-400);
}

.stroke-amber-400-dark {
  stroke: var(--sc-color-amber-400-dark);
}

.stroke-amber-450 {
  stroke: var(--sc-color-amber-450);
}

.stroke-amber-450-dark {
  stroke: var(--sc-color-amber-450-dark);
}

.stroke-amber-50 {
  stroke: var(--sc-color-amber-50);
}

.stroke-amber-50-dark {
  stroke: var(--sc-color-amber-50-dark);
}

.stroke-amber-500 {
  stroke: var(--sc-color-amber-500);
}

.stroke-amber-500-dark {
  stroke: var(--sc-color-amber-500-dark);
}

.stroke-amber-550 {
  stroke: var(--sc-color-amber-550);
}

.stroke-amber-550-dark {
  stroke: var(--sc-color-amber-550-dark);
}

.stroke-amber-600 {
  stroke: var(--sc-color-amber-600);
}

.stroke-amber-600-dark {
  stroke: var(--sc-color-amber-600-dark);
}

.stroke-amber-650 {
  stroke: var(--sc-color-amber-650);
}

.stroke-amber-650-dark {
  stroke: var(--sc-color-amber-650-dark);
}

.stroke-amber-700 {
  stroke: var(--sc-color-amber-700);
}

.stroke-amber-700-dark {
  stroke: var(--sc-color-amber-700-dark);
}

.stroke-amber-750 {
  stroke: var(--sc-color-amber-750);
}

.stroke-amber-750-dark {
  stroke: var(--sc-color-amber-750-dark);
}

.stroke-amber-800 {
  stroke: var(--sc-color-amber-800);
}

.stroke-amber-800-dark {
  stroke: var(--sc-color-amber-800-dark);
}

.stroke-amber-850 {
  stroke: var(--sc-color-amber-850);
}

.stroke-amber-850-dark {
  stroke: var(--sc-color-amber-850-dark);
}

.stroke-amber-900 {
  stroke: var(--sc-color-amber-900);
}

.stroke-amber-900-dark {
  stroke: var(--sc-color-amber-900-dark);
}

.stroke-amber-950 {
  stroke: var(--sc-color-amber-950);
}

.stroke-amber-950-dark {
  stroke: var(--sc-color-amber-950-dark);
}

.stroke-blue-100 {
  stroke: var(--sc-color-blue-100);
}

.stroke-blue-100-dark {
  stroke: var(--sc-color-blue-100-dark);
}

.stroke-blue-150 {
  stroke: var(--sc-color-blue-150);
}

.stroke-blue-150-dark {
  stroke: var(--sc-color-blue-150-dark);
}

.stroke-blue-200 {
  stroke: var(--sc-color-blue-200);
}

.stroke-blue-200-dark {
  stroke: var(--sc-color-blue-200-dark);
}

.stroke-blue-250 {
  stroke: var(--sc-color-blue-250);
}

.stroke-blue-250-dark {
  stroke: var(--sc-color-blue-250-dark);
}

.stroke-blue-300 {
  stroke: var(--sc-color-blue-300);
}

.stroke-blue-300-dark {
  stroke: var(--sc-color-blue-300-dark);
}

.stroke-blue-350 {
  stroke: var(--sc-color-blue-350);
}

.stroke-blue-350-dark {
  stroke: var(--sc-color-blue-350-dark);
}

.stroke-blue-400 {
  stroke: var(--sc-color-blue-400);
}

.stroke-blue-400-dark {
  stroke: var(--sc-color-blue-400-dark);
}

.stroke-blue-450 {
  stroke: var(--sc-color-blue-450);
}

.stroke-blue-450-dark {
  stroke: var(--sc-color-blue-450-dark);
}

.stroke-blue-50 {
  stroke: var(--sc-color-blue-50);
}

.stroke-blue-50-dark {
  stroke: var(--sc-color-blue-50-dark);
}

.stroke-blue-500 {
  stroke: var(--sc-color-blue-500);
}

.stroke-blue-500-dark {
  stroke: var(--sc-color-blue-500-dark);
}

.stroke-blue-550 {
  stroke: var(--sc-color-blue-550);
}

.stroke-blue-550-dark {
  stroke: var(--sc-color-blue-550-dark);
}

.stroke-blue-600 {
  stroke: var(--sc-color-blue-600);
}

.stroke-blue-600-dark {
  stroke: var(--sc-color-blue-600-dark);
}

.stroke-blue-650 {
  stroke: var(--sc-color-blue-650);
}

.stroke-blue-650-dark {
  stroke: var(--sc-color-blue-650-dark);
}

.stroke-blue-700 {
  stroke: var(--sc-color-blue-700);
}

.stroke-blue-700-dark {
  stroke: var(--sc-color-blue-700-dark);
}

.stroke-blue-750 {
  stroke: var(--sc-color-blue-750);
}

.stroke-blue-750-dark {
  stroke: var(--sc-color-blue-750-dark);
}

.stroke-blue-800 {
  stroke: var(--sc-color-blue-800);
}

.stroke-blue-800-dark {
  stroke: var(--sc-color-blue-800-dark);
}

.stroke-blue-850 {
  stroke: var(--sc-color-blue-850);
}

.stroke-blue-850-dark {
  stroke: var(--sc-color-blue-850-dark);
}

.stroke-blue-900 {
  stroke: var(--sc-color-blue-900);
}

.stroke-blue-900-dark {
  stroke: var(--sc-color-blue-900-dark);
}

.stroke-blue-950 {
  stroke: var(--sc-color-blue-950);
}

.stroke-blue-950-dark {
  stroke: var(--sc-color-blue-950-dark);
}

.stroke-current {
  stroke: currentColor;
}

.stroke-green-100 {
  stroke: var(--sc-color-green-100);
}

.stroke-green-100-dark {
  stroke: var(--sc-color-green-100-dark);
}

.stroke-green-150 {
  stroke: var(--sc-color-green-150);
}

.stroke-green-150-dark {
  stroke: var(--sc-color-green-150-dark);
}

.stroke-green-200 {
  stroke: var(--sc-color-green-200);
}

.stroke-green-200-dark {
  stroke: var(--sc-color-green-200-dark);
}

.stroke-green-250 {
  stroke: var(--sc-color-green-250);
}

.stroke-green-250-dark {
  stroke: var(--sc-color-green-250-dark);
}

.stroke-green-300 {
  stroke: var(--sc-color-green-300);
}

.stroke-green-300-dark {
  stroke: var(--sc-color-green-300-dark);
}

.stroke-green-350 {
  stroke: var(--sc-color-green-350);
}

.stroke-green-350-dark {
  stroke: var(--sc-color-green-350-dark);
}

.stroke-green-400 {
  stroke: var(--sc-color-green-400);
}

.stroke-green-400-dark {
  stroke: var(--sc-color-green-400-dark);
}

.stroke-green-450 {
  stroke: var(--sc-color-green-450);
}

.stroke-green-450-dark {
  stroke: var(--sc-color-green-450-dark);
}

.stroke-green-50 {
  stroke: var(--sc-color-green-50);
}

.stroke-green-50-dark {
  stroke: var(--sc-color-green-50-dark);
}

.stroke-green-500 {
  stroke: var(--sc-color-green-500);
}

.stroke-green-500-dark {
  stroke: var(--sc-color-green-500-dark);
}

.stroke-green-550 {
  stroke: var(--sc-color-green-550);
}

.stroke-green-550-dark {
  stroke: var(--sc-color-green-550-dark);
}

.stroke-green-600 {
  stroke: var(--sc-color-green-600);
}

.stroke-green-600-dark {
  stroke: var(--sc-color-green-600-dark);
}

.stroke-green-650 {
  stroke: var(--sc-color-green-650);
}

.stroke-green-650-dark {
  stroke: var(--sc-color-green-650-dark);
}

.stroke-green-700 {
  stroke: var(--sc-color-green-700);
}

.stroke-green-700-dark {
  stroke: var(--sc-color-green-700-dark);
}

.stroke-green-750 {
  stroke: var(--sc-color-green-750);
}

.stroke-green-750-dark {
  stroke: var(--sc-color-green-750-dark);
}

.stroke-green-800 {
  stroke: var(--sc-color-green-800);
}

.stroke-green-800-dark {
  stroke: var(--sc-color-green-800-dark);
}

.stroke-green-850 {
  stroke: var(--sc-color-green-850);
}

.stroke-green-850-dark {
  stroke: var(--sc-color-green-850-dark);
}

.stroke-green-900 {
  stroke: var(--sc-color-green-900);
}

.stroke-green-900-dark {
  stroke: var(--sc-color-green-900-dark);
}

.stroke-green-950 {
  stroke: var(--sc-color-green-950);
}

.stroke-green-950-dark {
  stroke: var(--sc-color-green-950-dark);
}

.stroke-grey-100 {
  stroke: var(--sc-color-grey-100);
}

.stroke-grey-100-dark {
  stroke: var(--sc-color-grey-100-dark);
}

.stroke-grey-150 {
  stroke: var(--sc-color-grey-150);
}

.stroke-grey-150-dark {
  stroke: var(--sc-color-grey-150-dark);
}

.stroke-grey-200 {
  stroke: var(--sc-color-grey-200);
}

.stroke-grey-200-dark {
  stroke: var(--sc-color-grey-200-dark);
}

.stroke-grey-250 {
  stroke: var(--sc-color-grey-250);
}

.stroke-grey-250-dark {
  stroke: var(--sc-color-grey-250-dark);
}

.stroke-grey-300 {
  stroke: var(--sc-color-grey-300);
}

.stroke-grey-300-dark {
  stroke: var(--sc-color-grey-300-dark);
}

.stroke-grey-350 {
  stroke: var(--sc-color-grey-350);
}

.stroke-grey-350-dark {
  stroke: var(--sc-color-grey-350-dark);
}

.stroke-grey-400 {
  stroke: var(--sc-color-grey-400);
}

.stroke-grey-400-dark {
  stroke: var(--sc-color-grey-400-dark);
}

.stroke-grey-450 {
  stroke: var(--sc-color-grey-450);
}

.stroke-grey-450-dark {
  stroke: var(--sc-color-grey-450-dark);
}

.stroke-grey-50 {
  stroke: var(--sc-color-grey-50);
}

.stroke-grey-50-dark {
  stroke: var(--sc-color-grey-50-dark);
}

.stroke-grey-500 {
  stroke: var(--sc-color-grey-500);
}

.stroke-grey-500-dark {
  stroke: var(--sc-color-grey-500-dark);
}

.stroke-grey-550 {
  stroke: var(--sc-color-grey-550);
}

.stroke-grey-550-dark {
  stroke: var(--sc-color-grey-550-dark);
}

.stroke-grey-600 {
  stroke: var(--sc-color-grey-600);
}

.stroke-grey-600-dark {
  stroke: var(--sc-color-grey-600-dark);
}

.stroke-grey-650 {
  stroke: var(--sc-color-grey-650);
}

.stroke-grey-650-dark {
  stroke: var(--sc-color-grey-650-dark);
}

.stroke-grey-700 {
  stroke: var(--sc-color-grey-700);
}

.stroke-grey-700-dark {
  stroke: var(--sc-color-grey-700-dark);
}

.stroke-grey-750 {
  stroke: var(--sc-color-grey-750);
}

.stroke-grey-750-dark {
  stroke: var(--sc-color-grey-750-dark);
}

.stroke-grey-800 {
  stroke: var(--sc-color-grey-800);
}

.stroke-grey-800-dark {
  stroke: var(--sc-color-grey-800-dark);
}

.stroke-grey-850 {
  stroke: var(--sc-color-grey-850);
}

.stroke-grey-850-dark {
  stroke: var(--sc-color-grey-850-dark);
}

.stroke-grey-900 {
  stroke: var(--sc-color-grey-900);
}

.stroke-grey-900-dark {
  stroke: var(--sc-color-grey-900-dark);
}

.stroke-grey-950 {
  stroke: var(--sc-color-grey-950);
}

.stroke-grey-950-dark {
  stroke: var(--sc-color-grey-950-dark);
}

.stroke-grey-black {
  stroke: var(--sc-color-black);
}

.stroke-muted {
  stroke: var(--sc-color-blue-900);
}

.stroke-none {
  stroke: none;
}

.stroke-orange-500 {
  stroke: var(--sc-color-orange-500);
}

.stroke-primary {
  stroke: var(--sc-color-blue);
}

.stroke-purple-100 {
  stroke: var(--sc-color-purple-100);
}

.stroke-purple-100-dark {
  stroke: var(--sc-color-purple-100-dark);
}

.stroke-purple-150 {
  stroke: var(--sc-color-purple-150);
}

.stroke-purple-150-dark {
  stroke: var(--sc-color-purple-150-dark);
}

.stroke-purple-200 {
  stroke: var(--sc-color-purple-200);
}

.stroke-purple-200-dark {
  stroke: var(--sc-color-purple-200-dark);
}

.stroke-purple-250 {
  stroke: var(--sc-color-purple-250);
}

.stroke-purple-250-dark {
  stroke: var(--sc-color-purple-250-dark);
}

.stroke-purple-300 {
  stroke: var(--sc-color-purple-300);
}

.stroke-purple-300-dark {
  stroke: var(--sc-color-purple-300-dark);
}

.stroke-purple-350 {
  stroke: var(--sc-color-purple-350);
}

.stroke-purple-350-dark {
  stroke: var(--sc-color-purple-350-dark);
}

.stroke-purple-400 {
  stroke: var(--sc-color-purple-400);
}

.stroke-purple-400-dark {
  stroke: var(--sc-color-purple-400-dark);
}

.stroke-purple-450 {
  stroke: var(--sc-color-purple-450);
}

.stroke-purple-450-dark {
  stroke: var(--sc-color-purple-450-dark);
}

.stroke-purple-50 {
  stroke: var(--sc-color-purple-50);
}

.stroke-purple-50-dark {
  stroke: var(--sc-color-purple-50-dark);
}

.stroke-purple-500 {
  stroke: var(--sc-color-purple-500);
}

.stroke-purple-500-dark {
  stroke: var(--sc-color-purple-500-dark);
}

.stroke-purple-550 {
  stroke: var(--sc-color-purple-550);
}

.stroke-purple-550-dark {
  stroke: var(--sc-color-purple-550-dark);
}

.stroke-purple-600 {
  stroke: var(--sc-color-purple-600);
}

.stroke-purple-600-dark {
  stroke: var(--sc-color-purple-600-dark);
}

.stroke-purple-650 {
  stroke: var(--sc-color-purple-650);
}

.stroke-purple-650-dark {
  stroke: var(--sc-color-purple-650-dark);
}

.stroke-purple-700 {
  stroke: var(--sc-color-purple-700);
}

.stroke-purple-700-dark {
  stroke: var(--sc-color-purple-700-dark);
}

.stroke-purple-750 {
  stroke: var(--sc-color-purple-750);
}

.stroke-purple-750-dark {
  stroke: var(--sc-color-purple-750-dark);
}

.stroke-purple-800 {
  stroke: var(--sc-color-purple-800);
}

.stroke-purple-800-dark {
  stroke: var(--sc-color-purple-800-dark);
}

.stroke-purple-850 {
  stroke: var(--sc-color-purple-850);
}

.stroke-purple-850-dark {
  stroke: var(--sc-color-purple-850-dark);
}

.stroke-purple-900 {
  stroke: var(--sc-color-purple-900);
}

.stroke-purple-900-dark {
  stroke: var(--sc-color-purple-900-dark);
}

.stroke-purple-950 {
  stroke: var(--sc-color-purple-950);
}

.stroke-purple-950-dark {
  stroke: var(--sc-color-purple-950-dark);
}

.stroke-red-100 {
  stroke: var(--sc-color-red-100);
}

.stroke-red-100-dark {
  stroke: var(--sc-color-red-100-dark);
}

.stroke-red-150 {
  stroke: var(--sc-color-red-150);
}

.stroke-red-150-dark {
  stroke: var(--sc-color-red-150-dark);
}

.stroke-red-200 {
  stroke: var(--sc-color-red-200);
}

.stroke-red-200-dark {
  stroke: var(--sc-color-red-200-dark);
}

.stroke-red-250 {
  stroke: var(--sc-color-red-250);
}

.stroke-red-250-dark {
  stroke: var(--sc-color-red-250-dark);
}

.stroke-red-300 {
  stroke: var(--sc-color-red-300);
}

.stroke-red-300-dark {
  stroke: var(--sc-color-red-300-dark);
}

.stroke-red-350 {
  stroke: var(--sc-color-red-350);
}

.stroke-red-350-dark {
  stroke: var(--sc-color-red-350-dark);
}

.stroke-red-400 {
  stroke: var(--sc-color-red-400);
}

.stroke-red-400-dark {
  stroke: var(--sc-color-red-400-dark);
}

.stroke-red-450 {
  stroke: var(--sc-color-red-450);
}

.stroke-red-450-dark {
  stroke: var(--sc-color-red-450-dark);
}

.stroke-red-50 {
  stroke: var(--sc-color-red-50);
}

.stroke-red-50-dark {
  stroke: var(--sc-color-red-50-dark);
}

.stroke-red-500 {
  stroke: var(--sc-color-red-500);
}

.stroke-red-500-dark {
  stroke: var(--sc-color-red-500-dark);
}

.stroke-red-550 {
  stroke: var(--sc-color-red-550);
}

.stroke-red-550-dark {
  stroke: var(--sc-color-red-550-dark);
}

.stroke-red-600 {
  stroke: var(--sc-color-red-600);
}

.stroke-red-600-dark {
  stroke: var(--sc-color-red-600-dark);
}

.stroke-red-650 {
  stroke: var(--sc-color-red-650);
}

.stroke-red-650-dark {
  stroke: var(--sc-color-red-650-dark);
}

.stroke-red-700 {
  stroke: var(--sc-color-red-700);
}

.stroke-red-700-dark {
  stroke: var(--sc-color-red-700-dark);
}

.stroke-red-750 {
  stroke: var(--sc-color-red-750);
}

.stroke-red-750-dark {
  stroke: var(--sc-color-red-750-dark);
}

.stroke-red-800 {
  stroke: var(--sc-color-red-800);
}

.stroke-red-800-dark {
  stroke: var(--sc-color-red-800-dark);
}

.stroke-red-850 {
  stroke: var(--sc-color-red-850);
}

.stroke-red-850-dark {
  stroke: var(--sc-color-red-850-dark);
}

.stroke-red-900 {
  stroke: var(--sc-color-red-900);
}

.stroke-red-900-dark {
  stroke: var(--sc-color-red-900-dark);
}

.stroke-red-950 {
  stroke: var(--sc-color-red-950);
}

.stroke-red-950-dark {
  stroke: var(--sc-color-red-950-dark);
}

.stroke-teal-100 {
  stroke: var(--sc-color-teal-100);
}

.stroke-teal-500 {
  stroke: var(--sc-color-teal-500);
}

.stroke-transparent {
  stroke: transparent;
}

.stroke-transparent\/0 {
  stroke: rgb(0 0 0 / 0);
}

.stroke-transparent\/10 {
  stroke: rgb(0 0 0 / 0.1);
}

.stroke-transparent\/100 {
  stroke: rgb(0 0 0 / 1);
}

.stroke-transparent\/15 {
  stroke: rgb(0 0 0 / 0.15);
}

.stroke-transparent\/20 {
  stroke: rgb(0 0 0 / 0.2);
}

.stroke-transparent\/25 {
  stroke: rgb(0 0 0 / 0.25);
}

.stroke-transparent\/30 {
  stroke: rgb(0 0 0 / 0.3);
}

.stroke-transparent\/35 {
  stroke: rgb(0 0 0 / 0.35);
}

.stroke-transparent\/40 {
  stroke: rgb(0 0 0 / 0.4);
}

.stroke-transparent\/45 {
  stroke: rgb(0 0 0 / 0.45);
}

.stroke-transparent\/5 {
  stroke: rgb(0 0 0 / 0.05);
}

.stroke-transparent\/50 {
  stroke: rgb(0 0 0 / 0.5);
}

.stroke-transparent\/55 {
  stroke: rgb(0 0 0 / 0.55);
}

.stroke-transparent\/60 {
  stroke: rgb(0 0 0 / 0.6);
}

.stroke-transparent\/65 {
  stroke: rgb(0 0 0 / 0.65);
}

.stroke-transparent\/70 {
  stroke: rgb(0 0 0 / 0.7);
}

.stroke-transparent\/75 {
  stroke: rgb(0 0 0 / 0.75);
}

.stroke-transparent\/80 {
  stroke: rgb(0 0 0 / 0.8);
}

.stroke-transparent\/85 {
  stroke: rgb(0 0 0 / 0.85);
}

.stroke-transparent\/90 {
  stroke: rgb(0 0 0 / 0.9);
}

.stroke-transparent\/95 {
  stroke: rgb(0 0 0 / 0.95);
}

.stroke-white {
  stroke: var(--sc-color-white);
}

.stroke-0 {
  stroke-width: 0;
}

.stroke-1 {
  stroke-width: 1;
}

.stroke-2 {
  stroke-width: 2;
}

.object-bottom {
  -o-object-position: bottom;
     object-position: bottom;
}

.object-center {
  -o-object-position: center;
     object-position: center;
}

.object-left {
  -o-object-position: left;
     object-position: left;
}

.object-left-bottom {
  -o-object-position: left bottom;
     object-position: left bottom;
}

.object-left-top {
  -o-object-position: left top;
     object-position: left top;
}

.object-right {
  -o-object-position: right;
     object-position: right;
}

.object-right-bottom {
  -o-object-position: right bottom;
     object-position: right bottom;
}

.object-right-top {
  -o-object-position: right top;
     object-position: right top;
}

.object-top {
  -o-object-position: top;
     object-position: top;
}

.p-0 {
  padding: var(--sc-spacing-0);
}

.p-12 {
  padding: var(--sc-spacing-12);
}

.p-16 {
  padding: var(--sc-spacing-16);
}

.p-20 {
  padding: var(--sc-spacing-20);
}

.p-24 {
  padding: var(--sc-spacing-24);
}

.p-32 {
  padding: var(--sc-spacing-32);
}

.p-4 {
  padding: var(--sc-spacing-4);
}

.p-40 {
  padding: var(--sc-spacing-40);
}

.p-48 {
  padding: var(--sc-spacing-48);
}

.p-56 {
  padding: var(--sc-spacing-56);
}

.p-64 {
  padding: var(--sc-spacing-64);
}

.p-8 {
  padding: var(--sc-spacing-8);
}

.px-0 {
  padding-left: var(--sc-spacing-0);
  padding-right: var(--sc-spacing-0);
}

.px-12 {
  padding-left: var(--sc-spacing-12);
  padding-right: var(--sc-spacing-12);
}

.px-16 {
  padding-left: var(--sc-spacing-16);
  padding-right: var(--sc-spacing-16);
}

.px-20 {
  padding-left: var(--sc-spacing-20);
  padding-right: var(--sc-spacing-20);
}

.px-24 {
  padding-left: var(--sc-spacing-24);
  padding-right: var(--sc-spacing-24);
}

.px-32 {
  padding-left: var(--sc-spacing-32);
  padding-right: var(--sc-spacing-32);
}

.px-4 {
  padding-left: var(--sc-spacing-4);
  padding-right: var(--sc-spacing-4);
}

.px-40 {
  padding-left: var(--sc-spacing-40);
  padding-right: var(--sc-spacing-40);
}

.px-48 {
  padding-left: var(--sc-spacing-48);
  padding-right: var(--sc-spacing-48);
}

.px-56 {
  padding-left: var(--sc-spacing-56);
  padding-right: var(--sc-spacing-56);
}

.px-64 {
  padding-left: var(--sc-spacing-64);
  padding-right: var(--sc-spacing-64);
}

.px-8 {
  padding-left: var(--sc-spacing-8);
  padding-right: var(--sc-spacing-8);
}

.py-0 {
  padding-top: var(--sc-spacing-0);
  padding-bottom: var(--sc-spacing-0);
}

.py-12 {
  padding-top: var(--sc-spacing-12);
  padding-bottom: var(--sc-spacing-12);
}

.py-16 {
  padding-top: var(--sc-spacing-16);
  padding-bottom: var(--sc-spacing-16);
}

.py-20 {
  padding-top: var(--sc-spacing-20);
  padding-bottom: var(--sc-spacing-20);
}

.py-24 {
  padding-top: var(--sc-spacing-24);
  padding-bottom: var(--sc-spacing-24);
}

.py-32 {
  padding-top: var(--sc-spacing-32);
  padding-bottom: var(--sc-spacing-32);
}

.py-4 {
  padding-top: var(--sc-spacing-4);
  padding-bottom: var(--sc-spacing-4);
}

.py-40 {
  padding-top: var(--sc-spacing-40);
  padding-bottom: var(--sc-spacing-40);
}

.py-48 {
  padding-top: var(--sc-spacing-48);
  padding-bottom: var(--sc-spacing-48);
}

.py-56 {
  padding-top: var(--sc-spacing-56);
  padding-bottom: var(--sc-spacing-56);
}

.py-64 {
  padding-top: var(--sc-spacing-64);
  padding-bottom: var(--sc-spacing-64);
}

.py-8 {
  padding-top: var(--sc-spacing-8);
  padding-bottom: var(--sc-spacing-8);
}

.pb-0 {
  padding-bottom: var(--sc-spacing-0);
}

.pb-12 {
  padding-bottom: var(--sc-spacing-12);
}

.pb-16 {
  padding-bottom: var(--sc-spacing-16);
}

.pb-20 {
  padding-bottom: var(--sc-spacing-20);
}

.pb-24 {
  padding-bottom: var(--sc-spacing-24);
}

.pb-32 {
  padding-bottom: var(--sc-spacing-32);
}

.pb-4 {
  padding-bottom: var(--sc-spacing-4);
}

.pb-40 {
  padding-bottom: var(--sc-spacing-40);
}

.pb-48 {
  padding-bottom: var(--sc-spacing-48);
}

.pb-56 {
  padding-bottom: var(--sc-spacing-56);
}

.pb-64 {
  padding-bottom: var(--sc-spacing-64);
}

.pb-8 {
  padding-bottom: var(--sc-spacing-8);
}

.pe-0 {
  padding-inline-end: var(--sc-spacing-0);
}

.pe-12 {
  padding-inline-end: var(--sc-spacing-12);
}

.pe-16 {
  padding-inline-end: var(--sc-spacing-16);
}

.pe-20 {
  padding-inline-end: var(--sc-spacing-20);
}

.pe-24 {
  padding-inline-end: var(--sc-spacing-24);
}

.pe-32 {
  padding-inline-end: var(--sc-spacing-32);
}

.pe-4 {
  padding-inline-end: var(--sc-spacing-4);
}

.pe-40 {
  padding-inline-end: var(--sc-spacing-40);
}

.pe-48 {
  padding-inline-end: var(--sc-spacing-48);
}

.pe-56 {
  padding-inline-end: var(--sc-spacing-56);
}

.pe-64 {
  padding-inline-end: var(--sc-spacing-64);
}

.pe-8 {
  padding-inline-end: var(--sc-spacing-8);
}

.pl-0 {
  padding-left: var(--sc-spacing-0);
}

.pl-12 {
  padding-left: var(--sc-spacing-12);
}

.pl-16 {
  padding-left: var(--sc-spacing-16);
}

.pl-20 {
  padding-left: var(--sc-spacing-20);
}

.pl-24 {
  padding-left: var(--sc-spacing-24);
}

.pl-32 {
  padding-left: var(--sc-spacing-32);
}

.pl-4 {
  padding-left: var(--sc-spacing-4);
}

.pl-40 {
  padding-left: var(--sc-spacing-40);
}

.pl-48 {
  padding-left: var(--sc-spacing-48);
}

.pl-56 {
  padding-left: var(--sc-spacing-56);
}

.pl-64 {
  padding-left: var(--sc-spacing-64);
}

.pl-8 {
  padding-left: var(--sc-spacing-8);
}

.pr-0 {
  padding-right: var(--sc-spacing-0);
}

.pr-12 {
  padding-right: var(--sc-spacing-12);
}

.pr-16 {
  padding-right: var(--sc-spacing-16);
}

.pr-20 {
  padding-right: var(--sc-spacing-20);
}

.pr-24 {
  padding-right: var(--sc-spacing-24);
}

.pr-32 {
  padding-right: var(--sc-spacing-32);
}

.pr-4 {
  padding-right: var(--sc-spacing-4);
}

.pr-40 {
  padding-right: var(--sc-spacing-40);
}

.pr-48 {
  padding-right: var(--sc-spacing-48);
}

.pr-56 {
  padding-right: var(--sc-spacing-56);
}

.pr-64 {
  padding-right: var(--sc-spacing-64);
}

.pr-8 {
  padding-right: var(--sc-spacing-8);
}

.ps-0 {
  padding-inline-start: var(--sc-spacing-0);
}

.ps-12 {
  padding-inline-start: var(--sc-spacing-12);
}

.ps-16 {
  padding-inline-start: var(--sc-spacing-16);
}

.ps-20 {
  padding-inline-start: var(--sc-spacing-20);
}

.ps-24 {
  padding-inline-start: var(--sc-spacing-24);
}

.ps-32 {
  padding-inline-start: var(--sc-spacing-32);
}

.ps-4 {
  padding-inline-start: var(--sc-spacing-4);
}

.ps-40 {
  padding-inline-start: var(--sc-spacing-40);
}

.ps-48 {
  padding-inline-start: var(--sc-spacing-48);
}

.ps-56 {
  padding-inline-start: var(--sc-spacing-56);
}

.ps-64 {
  padding-inline-start: var(--sc-spacing-64);
}

.ps-8 {
  padding-inline-start: var(--sc-spacing-8);
}

.pt-0 {
  padding-top: var(--sc-spacing-0);
}

.pt-12 {
  padding-top: var(--sc-spacing-12);
}

.pt-16 {
  padding-top: var(--sc-spacing-16);
}

.pt-20 {
  padding-top: var(--sc-spacing-20);
}

.pt-24 {
  padding-top: var(--sc-spacing-24);
}

.pt-32 {
  padding-top: var(--sc-spacing-32);
}

.pt-4 {
  padding-top: var(--sc-spacing-4);
}

.pt-40 {
  padding-top: var(--sc-spacing-40);
}

.pt-48 {
  padding-top: var(--sc-spacing-48);
}

.pt-56 {
  padding-top: var(--sc-spacing-56);
}

.pt-64 {
  padding-top: var(--sc-spacing-64);
}

.pt-8 {
  padding-top: var(--sc-spacing-8);
}

.-indent-0 {
  text-indent: calc(var(--sc-spacing-0) * -1);
}

.-indent-12 {
  text-indent: calc(var(--sc-spacing-12) * -1);
}

.-indent-16 {
  text-indent: calc(var(--sc-spacing-16) * -1);
}

.-indent-20 {
  text-indent: calc(var(--sc-spacing-20) * -1);
}

.-indent-24 {
  text-indent: calc(var(--sc-spacing-24) * -1);
}

.-indent-32 {
  text-indent: calc(var(--sc-spacing-32) * -1);
}

.-indent-4 {
  text-indent: calc(var(--sc-spacing-4) * -1);
}

.-indent-40 {
  text-indent: calc(var(--sc-spacing-40) * -1);
}

.-indent-48 {
  text-indent: calc(var(--sc-spacing-48) * -1);
}

.-indent-56 {
  text-indent: calc(var(--sc-spacing-56) * -1);
}

.-indent-64 {
  text-indent: calc(var(--sc-spacing-64) * -1);
}

.-indent-8 {
  text-indent: calc(var(--sc-spacing-8) * -1);
}

.indent-0 {
  text-indent: var(--sc-spacing-0);
}

.indent-12 {
  text-indent: var(--sc-spacing-12);
}

.indent-16 {
  text-indent: var(--sc-spacing-16);
}

.indent-20 {
  text-indent: var(--sc-spacing-20);
}

.indent-24 {
  text-indent: var(--sc-spacing-24);
}

.indent-32 {
  text-indent: var(--sc-spacing-32);
}

.indent-4 {
  text-indent: var(--sc-spacing-4);
}

.indent-40 {
  text-indent: var(--sc-spacing-40);
}

.indent-48 {
  text-indent: var(--sc-spacing-48);
}

.indent-56 {
  text-indent: var(--sc-spacing-56);
}

.indent-64 {
  text-indent: var(--sc-spacing-64);
}

.indent-8 {
  text-indent: var(--sc-spacing-8);
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.font-sans {
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.font-serif {
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}

.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.text-5xl {
  font-size: 3rem;
  line-height: 1;
}

.text-6xl {
  font-size: 3.75rem;
  line-height: 1;
}

.text-7xl {
  font-size: 4.5rem;
  line-height: 1;
}

.text-8xl {
  font-size: 6rem;
  line-height: 1;
}

.text-9xl {
  font-size: 8rem;
  line-height: 1;
}

.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.font-black {
  font-weight: 900;
}

.font-bold {
  font-weight: 700;
}

.font-extrabold {
  font-weight: 800;
}

.font-extralight {
  font-weight: 200;
}

.font-light {
  font-weight: 300;
}

.font-medium {
  font-weight: 500;
}

.font-normal {
  font-weight: 400;
}

.font-semibold {
  font-weight: 600;
}

.font-thin {
  font-weight: 100;
}

.leading-10 {
  line-height: 2.5rem;
}

.leading-3 {
  line-height: .75rem;
}

.leading-4 {
  line-height: 1rem;
}

.leading-5 {
  line-height: 1.25rem;
}

.leading-6 {
  line-height: 1.5rem;
}

.leading-7 {
  line-height: 1.75rem;
}

.leading-8 {
  line-height: 2rem;
}

.leading-9 {
  line-height: 2.25rem;
}

.leading-loose {
  line-height: 2;
}

.leading-none {
  line-height: 1;
}

.leading-normal {
  line-height: 1.5;
}

.leading-relaxed {
  line-height: 1.625;
}

.leading-snug {
  line-height: 1.375;
}

.leading-tight {
  line-height: 1.25;
}

.-tracking-normal {
  letter-spacing: -0em;
}

.-tracking-tight {
  letter-spacing: 0.025em;
}

.-tracking-tighter {
  letter-spacing: 0.05em;
}

.-tracking-wide {
  letter-spacing: -0.025em;
}

.-tracking-wider {
  letter-spacing: -0.05em;
}

.-tracking-widest {
  letter-spacing: -0.1em;
}

.tracking-normal {
  letter-spacing: 0em;
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.tracking-tighter {
  letter-spacing: -0.05em;
}

.tracking-wide {
  letter-spacing: 0.025em;
}

.tracking-wider {
  letter-spacing: 0.05em;
}

.tracking-widest {
  letter-spacing: 0.1em;
}

.text-amber-100 {
  color: var(--sc-color-amber-100);
}

.text-amber-100-dark {
  color: var(--sc-color-amber-100-dark);
}

.text-amber-150 {
  color: var(--sc-color-amber-150);
}

.text-amber-150-dark {
  color: var(--sc-color-amber-150-dark);
}

.text-amber-200 {
  color: var(--sc-color-amber-200);
}

.text-amber-200-dark {
  color: var(--sc-color-amber-200-dark);
}

.text-amber-250 {
  color: var(--sc-color-amber-250);
}

.text-amber-250-dark {
  color: var(--sc-color-amber-250-dark);
}

.text-amber-300 {
  color: var(--sc-color-amber-300);
}

.text-amber-300-dark {
  color: var(--sc-color-amber-300-dark);
}

.text-amber-350 {
  color: var(--sc-color-amber-350);
}

.text-amber-350-dark {
  color: var(--sc-color-amber-350-dark);
}

.text-amber-400 {
  color: var(--sc-color-amber-400);
}

.text-amber-400-dark {
  color: var(--sc-color-amber-400-dark);
}

.text-amber-450 {
  color: var(--sc-color-amber-450);
}

.text-amber-450-dark {
  color: var(--sc-color-amber-450-dark);
}

.text-amber-50 {
  color: var(--sc-color-amber-50);
}

.text-amber-50-dark {
  color: var(--sc-color-amber-50-dark);
}

.text-amber-500 {
  color: var(--sc-color-amber-500);
}

.text-amber-500-dark {
  color: var(--sc-color-amber-500-dark);
}

.text-amber-550 {
  color: var(--sc-color-amber-550);
}

.text-amber-550-dark {
  color: var(--sc-color-amber-550-dark);
}

.text-amber-600 {
  color: var(--sc-color-amber-600);
}

.text-amber-600-dark {
  color: var(--sc-color-amber-600-dark);
}

.text-amber-650 {
  color: var(--sc-color-amber-650);
}

.text-amber-650-dark {
  color: var(--sc-color-amber-650-dark);
}

.text-amber-700 {
  color: var(--sc-color-amber-700);
}

.text-amber-700-dark {
  color: var(--sc-color-amber-700-dark);
}

.text-amber-750 {
  color: var(--sc-color-amber-750);
}

.text-amber-750-dark {
  color: var(--sc-color-amber-750-dark);
}

.text-amber-800 {
  color: var(--sc-color-amber-800);
}

.text-amber-800-dark {
  color: var(--sc-color-amber-800-dark);
}

.text-amber-850 {
  color: var(--sc-color-amber-850);
}

.text-amber-850-dark {
  color: var(--sc-color-amber-850-dark);
}

.text-amber-900 {
  color: var(--sc-color-amber-900);
}

.text-amber-900-dark {
  color: var(--sc-color-amber-900-dark);
}

.text-amber-950 {
  color: var(--sc-color-amber-950);
}

.text-amber-950-dark {
  color: var(--sc-color-amber-950-dark);
}

.text-blue-100 {
  color: var(--sc-color-blue-100);
}

.text-blue-100-dark {
  color: var(--sc-color-blue-100-dark);
}

.text-blue-150 {
  color: var(--sc-color-blue-150);
}

.text-blue-150-dark {
  color: var(--sc-color-blue-150-dark);
}

.text-blue-200 {
  color: var(--sc-color-blue-200);
}

.text-blue-200-dark {
  color: var(--sc-color-blue-200-dark);
}

.text-blue-250 {
  color: var(--sc-color-blue-250);
}

.text-blue-250-dark {
  color: var(--sc-color-blue-250-dark);
}

.text-blue-300 {
  color: var(--sc-color-blue-300);
}

.text-blue-300-dark {
  color: var(--sc-color-blue-300-dark);
}

.text-blue-350 {
  color: var(--sc-color-blue-350);
}

.text-blue-350-dark {
  color: var(--sc-color-blue-350-dark);
}

.text-blue-400 {
  color: var(--sc-color-blue-400);
}

.text-blue-400-dark {
  color: var(--sc-color-blue-400-dark);
}

.text-blue-450 {
  color: var(--sc-color-blue-450);
}

.text-blue-450-dark {
  color: var(--sc-color-blue-450-dark);
}

.text-blue-50 {
  color: var(--sc-color-blue-50);
}

.text-blue-50-dark {
  color: var(--sc-color-blue-50-dark);
}

.text-blue-500 {
  color: var(--sc-color-blue-500);
}

.text-blue-500-dark {
  color: var(--sc-color-blue-500-dark);
}

.text-blue-550 {
  color: var(--sc-color-blue-550);
}

.text-blue-550-dark {
  color: var(--sc-color-blue-550-dark);
}

.text-blue-600 {
  color: var(--sc-color-blue-600);
}

.text-blue-600-dark {
  color: var(--sc-color-blue-600-dark);
}

.text-blue-650 {
  color: var(--sc-color-blue-650);
}

.text-blue-650-dark {
  color: var(--sc-color-blue-650-dark);
}

.text-blue-700 {
  color: var(--sc-color-blue-700);
}

.text-blue-700-dark {
  color: var(--sc-color-blue-700-dark);
}

.text-blue-750 {
  color: var(--sc-color-blue-750);
}

.text-blue-750-dark {
  color: var(--sc-color-blue-750-dark);
}

.text-blue-800 {
  color: var(--sc-color-blue-800);
}

.text-blue-800-dark {
  color: var(--sc-color-blue-800-dark);
}

.text-blue-850 {
  color: var(--sc-color-blue-850);
}

.text-blue-850-dark {
  color: var(--sc-color-blue-850-dark);
}

.text-blue-900 {
  color: var(--sc-color-blue-900);
}

.text-blue-900-dark {
  color: var(--sc-color-blue-900-dark);
}

.text-blue-950 {
  color: var(--sc-color-blue-950);
}

.text-blue-950-dark {
  color: var(--sc-color-blue-950-dark);
}

.text-current {
  color: currentColor;
}

.text-green-100 {
  color: var(--sc-color-green-100);
}

.text-green-100-dark {
  color: var(--sc-color-green-100-dark);
}

.text-green-150 {
  color: var(--sc-color-green-150);
}

.text-green-150-dark {
  color: var(--sc-color-green-150-dark);
}

.text-green-200 {
  color: var(--sc-color-green-200);
}

.text-green-200-dark {
  color: var(--sc-color-green-200-dark);
}

.text-green-250 {
  color: var(--sc-color-green-250);
}

.text-green-250-dark {
  color: var(--sc-color-green-250-dark);
}

.text-green-300 {
  color: var(--sc-color-green-300);
}

.text-green-300-dark {
  color: var(--sc-color-green-300-dark);
}

.text-green-350 {
  color: var(--sc-color-green-350);
}

.text-green-350-dark {
  color: var(--sc-color-green-350-dark);
}

.text-green-400 {
  color: var(--sc-color-green-400);
}

.text-green-400-dark {
  color: var(--sc-color-green-400-dark);
}

.text-green-450 {
  color: var(--sc-color-green-450);
}

.text-green-450-dark {
  color: var(--sc-color-green-450-dark);
}

.text-green-50 {
  color: var(--sc-color-green-50);
}

.text-green-50-dark {
  color: var(--sc-color-green-50-dark);
}

.text-green-500 {
  color: var(--sc-color-green-500);
}

.text-green-500-dark {
  color: var(--sc-color-green-500-dark);
}

.text-green-550 {
  color: var(--sc-color-green-550);
}

.text-green-550-dark {
  color: var(--sc-color-green-550-dark);
}

.text-green-600 {
  color: var(--sc-color-green-600);
}

.text-green-600-dark {
  color: var(--sc-color-green-600-dark);
}

.text-green-650 {
  color: var(--sc-color-green-650);
}

.text-green-650-dark {
  color: var(--sc-color-green-650-dark);
}

.text-green-700 {
  color: var(--sc-color-green-700);
}

.text-green-700-dark {
  color: var(--sc-color-green-700-dark);
}

.text-green-750 {
  color: var(--sc-color-green-750);
}

.text-green-750-dark {
  color: var(--sc-color-green-750-dark);
}

.text-green-800 {
  color: var(--sc-color-green-800);
}

.text-green-800-dark {
  color: var(--sc-color-green-800-dark);
}

.text-green-850 {
  color: var(--sc-color-green-850);
}

.text-green-850-dark {
  color: var(--sc-color-green-850-dark);
}

.text-green-900 {
  color: var(--sc-color-green-900);
}

.text-green-900-dark {
  color: var(--sc-color-green-900-dark);
}

.text-green-950 {
  color: var(--sc-color-green-950);
}

.text-green-950-dark {
  color: var(--sc-color-green-950-dark);
}

.text-grey-100 {
  color: var(--sc-color-grey-100);
}

.text-grey-100-dark {
  color: var(--sc-color-grey-100-dark);
}

.text-grey-150 {
  color: var(--sc-color-grey-150);
}

.text-grey-150-dark {
  color: var(--sc-color-grey-150-dark);
}

.text-grey-200 {
  color: var(--sc-color-grey-200);
}

.text-grey-200-dark {
  color: var(--sc-color-grey-200-dark);
}

.text-grey-250 {
  color: var(--sc-color-grey-250);
}

.text-grey-250-dark {
  color: var(--sc-color-grey-250-dark);
}

.text-grey-300 {
  color: var(--sc-color-grey-300);
}

.text-grey-300-dark {
  color: var(--sc-color-grey-300-dark);
}

.text-grey-350 {
  color: var(--sc-color-grey-350);
}

.text-grey-350-dark {
  color: var(--sc-color-grey-350-dark);
}

.text-grey-400 {
  color: var(--sc-color-grey-400);
}

.text-grey-400-dark {
  color: var(--sc-color-grey-400-dark);
}

.text-grey-450 {
  color: var(--sc-color-grey-450);
}

.text-grey-450-dark {
  color: var(--sc-color-grey-450-dark);
}

.text-grey-50 {
  color: var(--sc-color-grey-50);
}

.text-grey-50-dark {
  color: var(--sc-color-grey-50-dark);
}

.text-grey-500 {
  color: var(--sc-color-grey-500);
}

.text-grey-500-dark {
  color: var(--sc-color-grey-500-dark);
}

.text-grey-550 {
  color: var(--sc-color-grey-550);
}

.text-grey-550-dark {
  color: var(--sc-color-grey-550-dark);
}

.text-grey-600 {
  color: var(--sc-color-grey-600);
}

.text-grey-600-dark {
  color: var(--sc-color-grey-600-dark);
}

.text-grey-650 {
  color: var(--sc-color-grey-650);
}

.text-grey-650-dark {
  color: var(--sc-color-grey-650-dark);
}

.text-grey-700 {
  color: var(--sc-color-grey-700);
}

.text-grey-700-dark {
  color: var(--sc-color-grey-700-dark);
}

.text-grey-750 {
  color: var(--sc-color-grey-750);
}

.text-grey-750-dark {
  color: var(--sc-color-grey-750-dark);
}

.text-grey-800 {
  color: var(--sc-color-grey-800);
}

.text-grey-800-dark {
  color: var(--sc-color-grey-800-dark);
}

.text-grey-850 {
  color: var(--sc-color-grey-850);
}

.text-grey-850-dark {
  color: var(--sc-color-grey-850-dark);
}

.text-grey-900 {
  color: var(--sc-color-grey-900);
}

.text-grey-900-dark {
  color: var(--sc-color-grey-900-dark);
}

.text-grey-950 {
  color: var(--sc-color-grey-950);
}

.text-grey-950-dark {
  color: var(--sc-color-grey-950-dark);
}

.text-grey-black {
  color: var(--sc-color-black);
}

.text-muted {
  color: var(--sc-color-blue-900);
}

.text-orange-500 {
  color: var(--sc-color-orange-500);
}

.text-primary {
  color: var(--sc-color-blue);
}

.text-purple-100 {
  color: var(--sc-color-purple-100);
}

.text-purple-100-dark {
  color: var(--sc-color-purple-100-dark);
}

.text-purple-150 {
  color: var(--sc-color-purple-150);
}

.text-purple-150-dark {
  color: var(--sc-color-purple-150-dark);
}

.text-purple-200 {
  color: var(--sc-color-purple-200);
}

.text-purple-200-dark {
  color: var(--sc-color-purple-200-dark);
}

.text-purple-250 {
  color: var(--sc-color-purple-250);
}

.text-purple-250-dark {
  color: var(--sc-color-purple-250-dark);
}

.text-purple-300 {
  color: var(--sc-color-purple-300);
}

.text-purple-300-dark {
  color: var(--sc-color-purple-300-dark);
}

.text-purple-350 {
  color: var(--sc-color-purple-350);
}

.text-purple-350-dark {
  color: var(--sc-color-purple-350-dark);
}

.text-purple-400 {
  color: var(--sc-color-purple-400);
}

.text-purple-400-dark {
  color: var(--sc-color-purple-400-dark);
}

.text-purple-450 {
  color: var(--sc-color-purple-450);
}

.text-purple-450-dark {
  color: var(--sc-color-purple-450-dark);
}

.text-purple-50 {
  color: var(--sc-color-purple-50);
}

.text-purple-50-dark {
  color: var(--sc-color-purple-50-dark);
}

.text-purple-500 {
  color: var(--sc-color-purple-500);
}

.text-purple-500-dark {
  color: var(--sc-color-purple-500-dark);
}

.text-purple-550 {
  color: var(--sc-color-purple-550);
}

.text-purple-550-dark {
  color: var(--sc-color-purple-550-dark);
}

.text-purple-600 {
  color: var(--sc-color-purple-600);
}

.text-purple-600-dark {
  color: var(--sc-color-purple-600-dark);
}

.text-purple-650 {
  color: var(--sc-color-purple-650);
}

.text-purple-650-dark {
  color: var(--sc-color-purple-650-dark);
}

.text-purple-700 {
  color: var(--sc-color-purple-700);
}

.text-purple-700-dark {
  color: var(--sc-color-purple-700-dark);
}

.text-purple-750 {
  color: var(--sc-color-purple-750);
}

.text-purple-750-dark {
  color: var(--sc-color-purple-750-dark);
}

.text-purple-800 {
  color: var(--sc-color-purple-800);
}

.text-purple-800-dark {
  color: var(--sc-color-purple-800-dark);
}

.text-purple-850 {
  color: var(--sc-color-purple-850);
}

.text-purple-850-dark {
  color: var(--sc-color-purple-850-dark);
}

.text-purple-900 {
  color: var(--sc-color-purple-900);
}

.text-purple-900-dark {
  color: var(--sc-color-purple-900-dark);
}

.text-purple-950 {
  color: var(--sc-color-purple-950);
}

.text-purple-950-dark {
  color: var(--sc-color-purple-950-dark);
}

.text-red-100 {
  color: var(--sc-color-red-100);
}

.text-red-100-dark {
  color: var(--sc-color-red-100-dark);
}

.text-red-150 {
  color: var(--sc-color-red-150);
}

.text-red-150-dark {
  color: var(--sc-color-red-150-dark);
}

.text-red-200 {
  color: var(--sc-color-red-200);
}

.text-red-200-dark {
  color: var(--sc-color-red-200-dark);
}

.text-red-250 {
  color: var(--sc-color-red-250);
}

.text-red-250-dark {
  color: var(--sc-color-red-250-dark);
}

.text-red-300 {
  color: var(--sc-color-red-300);
}

.text-red-300-dark {
  color: var(--sc-color-red-300-dark);
}

.text-red-350 {
  color: var(--sc-color-red-350);
}

.text-red-350-dark {
  color: var(--sc-color-red-350-dark);
}

.text-red-400 {
  color: var(--sc-color-red-400);
}

.text-red-400-dark {
  color: var(--sc-color-red-400-dark);
}

.text-red-450 {
  color: var(--sc-color-red-450);
}

.text-red-450-dark {
  color: var(--sc-color-red-450-dark);
}

.text-red-50 {
  color: var(--sc-color-red-50);
}

.text-red-50-dark {
  color: var(--sc-color-red-50-dark);
}

.text-red-500 {
  color: var(--sc-color-red-500);
}

.text-red-500-dark {
  color: var(--sc-color-red-500-dark);
}

.text-red-550 {
  color: var(--sc-color-red-550);
}

.text-red-550-dark {
  color: var(--sc-color-red-550-dark);
}

.text-red-600 {
  color: var(--sc-color-red-600);
}

.text-red-600-dark {
  color: var(--sc-color-red-600-dark);
}

.text-red-650 {
  color: var(--sc-color-red-650);
}

.text-red-650-dark {
  color: var(--sc-color-red-650-dark);
}

.text-red-700 {
  color: var(--sc-color-red-700);
}

.text-red-700-dark {
  color: var(--sc-color-red-700-dark);
}

.text-red-750 {
  color: var(--sc-color-red-750);
}

.text-red-750-dark {
  color: var(--sc-color-red-750-dark);
}

.text-red-800 {
  color: var(--sc-color-red-800);
}

.text-red-800-dark {
  color: var(--sc-color-red-800-dark);
}

.text-red-850 {
  color: var(--sc-color-red-850);
}

.text-red-850-dark {
  color: var(--sc-color-red-850-dark);
}

.text-red-900 {
  color: var(--sc-color-red-900);
}

.text-red-900-dark {
  color: var(--sc-color-red-900-dark);
}

.text-red-950 {
  color: var(--sc-color-red-950);
}

.text-red-950-dark {
  color: var(--sc-color-red-950-dark);
}

.text-teal-100 {
  color: var(--sc-color-teal-100);
}

.text-teal-500 {
  color: var(--sc-color-teal-500);
}

.text-transparent {
  color: transparent;
}

.text-transparent\/0 {
  color: rgb(0 0 0 / 0);
}

.text-transparent\/10 {
  color: rgb(0 0 0 / 0.1);
}

.text-transparent\/100 {
  color: rgb(0 0 0 / 1);
}

.text-transparent\/15 {
  color: rgb(0 0 0 / 0.15);
}

.text-transparent\/20 {
  color: rgb(0 0 0 / 0.2);
}

.text-transparent\/25 {
  color: rgb(0 0 0 / 0.25);
}

.text-transparent\/30 {
  color: rgb(0 0 0 / 0.3);
}

.text-transparent\/35 {
  color: rgb(0 0 0 / 0.35);
}

.text-transparent\/40 {
  color: rgb(0 0 0 / 0.4);
}

.text-transparent\/45 {
  color: rgb(0 0 0 / 0.45);
}

.text-transparent\/5 {
  color: rgb(0 0 0 / 0.05);
}

.text-transparent\/50 {
  color: rgb(0 0 0 / 0.5);
}

.text-transparent\/55 {
  color: rgb(0 0 0 / 0.55);
}

.text-transparent\/60 {
  color: rgb(0 0 0 / 0.6);
}

.text-transparent\/65 {
  color: rgb(0 0 0 / 0.65);
}

.text-transparent\/70 {
  color: rgb(0 0 0 / 0.7);
}

.text-transparent\/75 {
  color: rgb(0 0 0 / 0.75);
}

.text-transparent\/80 {
  color: rgb(0 0 0 / 0.8);
}

.text-transparent\/85 {
  color: rgb(0 0 0 / 0.85);
}

.text-transparent\/90 {
  color: rgb(0 0 0 / 0.9);
}

.text-transparent\/95 {
  color: rgb(0 0 0 / 0.95);
}

.text-white {
  color: var(--sc-color-white);
}

.text-opacity-0 {
  --tw-text-opacity: 0;
}

.text-opacity-10 {
  --tw-text-opacity: 0.1;
}

.text-opacity-100 {
  --tw-text-opacity: 1;
}

.text-opacity-15 {
  --tw-text-opacity: 0.15;
}

.text-opacity-20 {
  --tw-text-opacity: 0.2;
}

.text-opacity-25 {
  --tw-text-opacity: 0.25;
}

.text-opacity-30 {
  --tw-text-opacity: 0.3;
}

.text-opacity-35 {
  --tw-text-opacity: 0.35;
}

.text-opacity-40 {
  --tw-text-opacity: 0.4;
}

.text-opacity-45 {
  --tw-text-opacity: 0.45;
}

.text-opacity-5 {
  --tw-text-opacity: 0.05;
}

.text-opacity-50 {
  --tw-text-opacity: 0.5;
}

.text-opacity-55 {
  --tw-text-opacity: 0.55;
}

.text-opacity-60 {
  --tw-text-opacity: 0.6;
}

.text-opacity-65 {
  --tw-text-opacity: 0.65;
}

.text-opacity-70 {
  --tw-text-opacity: 0.7;
}

.text-opacity-75 {
  --tw-text-opacity: 0.75;
}

.text-opacity-80 {
  --tw-text-opacity: 0.8;
}

.text-opacity-85 {
  --tw-text-opacity: 0.85;
}

.text-opacity-90 {
  --tw-text-opacity: 0.9;
}

.text-opacity-95 {
  --tw-text-opacity: 0.95;
}

.decoration-amber-100 {
  text-decoration-color: var(--sc-color-amber-100);
}

.decoration-amber-100-dark {
  text-decoration-color: var(--sc-color-amber-100-dark);
}

.decoration-amber-150 {
  text-decoration-color: var(--sc-color-amber-150);
}

.decoration-amber-150-dark {
  text-decoration-color: var(--sc-color-amber-150-dark);
}

.decoration-amber-200 {
  text-decoration-color: var(--sc-color-amber-200);
}

.decoration-amber-200-dark {
  text-decoration-color: var(--sc-color-amber-200-dark);
}

.decoration-amber-250 {
  text-decoration-color: var(--sc-color-amber-250);
}

.decoration-amber-250-dark {
  text-decoration-color: var(--sc-color-amber-250-dark);
}

.decoration-amber-300 {
  text-decoration-color: var(--sc-color-amber-300);
}

.decoration-amber-300-dark {
  text-decoration-color: var(--sc-color-amber-300-dark);
}

.decoration-amber-350 {
  text-decoration-color: var(--sc-color-amber-350);
}

.decoration-amber-350-dark {
  text-decoration-color: var(--sc-color-amber-350-dark);
}

.decoration-amber-400 {
  text-decoration-color: var(--sc-color-amber-400);
}

.decoration-amber-400-dark {
  text-decoration-color: var(--sc-color-amber-400-dark);
}

.decoration-amber-450 {
  text-decoration-color: var(--sc-color-amber-450);
}

.decoration-amber-450-dark {
  text-decoration-color: var(--sc-color-amber-450-dark);
}

.decoration-amber-50 {
  text-decoration-color: var(--sc-color-amber-50);
}

.decoration-amber-50-dark {
  text-decoration-color: var(--sc-color-amber-50-dark);
}

.decoration-amber-500 {
  text-decoration-color: var(--sc-color-amber-500);
}

.decoration-amber-500-dark {
  text-decoration-color: var(--sc-color-amber-500-dark);
}

.decoration-amber-550 {
  text-decoration-color: var(--sc-color-amber-550);
}

.decoration-amber-550-dark {
  text-decoration-color: var(--sc-color-amber-550-dark);
}

.decoration-amber-600 {
  text-decoration-color: var(--sc-color-amber-600);
}

.decoration-amber-600-dark {
  text-decoration-color: var(--sc-color-amber-600-dark);
}

.decoration-amber-650 {
  text-decoration-color: var(--sc-color-amber-650);
}

.decoration-amber-650-dark {
  text-decoration-color: var(--sc-color-amber-650-dark);
}

.decoration-amber-700 {
  text-decoration-color: var(--sc-color-amber-700);
}

.decoration-amber-700-dark {
  text-decoration-color: var(--sc-color-amber-700-dark);
}

.decoration-amber-750 {
  text-decoration-color: var(--sc-color-amber-750);
}

.decoration-amber-750-dark {
  text-decoration-color: var(--sc-color-amber-750-dark);
}

.decoration-amber-800 {
  text-decoration-color: var(--sc-color-amber-800);
}

.decoration-amber-800-dark {
  text-decoration-color: var(--sc-color-amber-800-dark);
}

.decoration-amber-850 {
  text-decoration-color: var(--sc-color-amber-850);
}

.decoration-amber-850-dark {
  text-decoration-color: var(--sc-color-amber-850-dark);
}

.decoration-amber-900 {
  text-decoration-color: var(--sc-color-amber-900);
}

.decoration-amber-900-dark {
  text-decoration-color: var(--sc-color-amber-900-dark);
}

.decoration-amber-950 {
  text-decoration-color: var(--sc-color-amber-950);
}

.decoration-amber-950-dark {
  text-decoration-color: var(--sc-color-amber-950-dark);
}

.decoration-blue-100 {
  text-decoration-color: var(--sc-color-blue-100);
}

.decoration-blue-100-dark {
  text-decoration-color: var(--sc-color-blue-100-dark);
}

.decoration-blue-150 {
  text-decoration-color: var(--sc-color-blue-150);
}

.decoration-blue-150-dark {
  text-decoration-color: var(--sc-color-blue-150-dark);
}

.decoration-blue-200 {
  text-decoration-color: var(--sc-color-blue-200);
}

.decoration-blue-200-dark {
  text-decoration-color: var(--sc-color-blue-200-dark);
}

.decoration-blue-250 {
  text-decoration-color: var(--sc-color-blue-250);
}

.decoration-blue-250-dark {
  text-decoration-color: var(--sc-color-blue-250-dark);
}

.decoration-blue-300 {
  text-decoration-color: var(--sc-color-blue-300);
}

.decoration-blue-300-dark {
  text-decoration-color: var(--sc-color-blue-300-dark);
}

.decoration-blue-350 {
  text-decoration-color: var(--sc-color-blue-350);
}

.decoration-blue-350-dark {
  text-decoration-color: var(--sc-color-blue-350-dark);
}

.decoration-blue-400 {
  text-decoration-color: var(--sc-color-blue-400);
}

.decoration-blue-400-dark {
  text-decoration-color: var(--sc-color-blue-400-dark);
}

.decoration-blue-450 {
  text-decoration-color: var(--sc-color-blue-450);
}

.decoration-blue-450-dark {
  text-decoration-color: var(--sc-color-blue-450-dark);
}

.decoration-blue-50 {
  text-decoration-color: var(--sc-color-blue-50);
}

.decoration-blue-50-dark {
  text-decoration-color: var(--sc-color-blue-50-dark);
}

.decoration-blue-500 {
  text-decoration-color: var(--sc-color-blue-500);
}

.decoration-blue-500-dark {
  text-decoration-color: var(--sc-color-blue-500-dark);
}

.decoration-blue-550 {
  text-decoration-color: var(--sc-color-blue-550);
}

.decoration-blue-550-dark {
  text-decoration-color: var(--sc-color-blue-550-dark);
}

.decoration-blue-600 {
  text-decoration-color: var(--sc-color-blue-600);
}

.decoration-blue-600-dark {
  text-decoration-color: var(--sc-color-blue-600-dark);
}

.decoration-blue-650 {
  text-decoration-color: var(--sc-color-blue-650);
}

.decoration-blue-650-dark {
  text-decoration-color: var(--sc-color-blue-650-dark);
}

.decoration-blue-700 {
  text-decoration-color: var(--sc-color-blue-700);
}

.decoration-blue-700-dark {
  text-decoration-color: var(--sc-color-blue-700-dark);
}

.decoration-blue-750 {
  text-decoration-color: var(--sc-color-blue-750);
}

.decoration-blue-750-dark {
  text-decoration-color: var(--sc-color-blue-750-dark);
}

.decoration-blue-800 {
  text-decoration-color: var(--sc-color-blue-800);
}

.decoration-blue-800-dark {
  text-decoration-color: var(--sc-color-blue-800-dark);
}

.decoration-blue-850 {
  text-decoration-color: var(--sc-color-blue-850);
}

.decoration-blue-850-dark {
  text-decoration-color: var(--sc-color-blue-850-dark);
}

.decoration-blue-900 {
  text-decoration-color: var(--sc-color-blue-900);
}

.decoration-blue-900-dark {
  text-decoration-color: var(--sc-color-blue-900-dark);
}

.decoration-blue-950 {
  text-decoration-color: var(--sc-color-blue-950);
}

.decoration-blue-950-dark {
  text-decoration-color: var(--sc-color-blue-950-dark);
}

.decoration-current {
  text-decoration-color: currentColor;
}

.decoration-green-100 {
  text-decoration-color: var(--sc-color-green-100);
}

.decoration-green-100-dark {
  text-decoration-color: var(--sc-color-green-100-dark);
}

.decoration-green-150 {
  text-decoration-color: var(--sc-color-green-150);
}

.decoration-green-150-dark {
  text-decoration-color: var(--sc-color-green-150-dark);
}

.decoration-green-200 {
  text-decoration-color: var(--sc-color-green-200);
}

.decoration-green-200-dark {
  text-decoration-color: var(--sc-color-green-200-dark);
}

.decoration-green-250 {
  text-decoration-color: var(--sc-color-green-250);
}

.decoration-green-250-dark {
  text-decoration-color: var(--sc-color-green-250-dark);
}

.decoration-green-300 {
  text-decoration-color: var(--sc-color-green-300);
}

.decoration-green-300-dark {
  text-decoration-color: var(--sc-color-green-300-dark);
}

.decoration-green-350 {
  text-decoration-color: var(--sc-color-green-350);
}

.decoration-green-350-dark {
  text-decoration-color: var(--sc-color-green-350-dark);
}

.decoration-green-400 {
  text-decoration-color: var(--sc-color-green-400);
}

.decoration-green-400-dark {
  text-decoration-color: var(--sc-color-green-400-dark);
}

.decoration-green-450 {
  text-decoration-color: var(--sc-color-green-450);
}

.decoration-green-450-dark {
  text-decoration-color: var(--sc-color-green-450-dark);
}

.decoration-green-50 {
  text-decoration-color: var(--sc-color-green-50);
}

.decoration-green-50-dark {
  text-decoration-color: var(--sc-color-green-50-dark);
}

.decoration-green-500 {
  text-decoration-color: var(--sc-color-green-500);
}

.decoration-green-500-dark {
  text-decoration-color: var(--sc-color-green-500-dark);
}

.decoration-green-550 {
  text-decoration-color: var(--sc-color-green-550);
}

.decoration-green-550-dark {
  text-decoration-color: var(--sc-color-green-550-dark);
}

.decoration-green-600 {
  text-decoration-color: var(--sc-color-green-600);
}

.decoration-green-600-dark {
  text-decoration-color: var(--sc-color-green-600-dark);
}

.decoration-green-650 {
  text-decoration-color: var(--sc-color-green-650);
}

.decoration-green-650-dark {
  text-decoration-color: var(--sc-color-green-650-dark);
}

.decoration-green-700 {
  text-decoration-color: var(--sc-color-green-700);
}

.decoration-green-700-dark {
  text-decoration-color: var(--sc-color-green-700-dark);
}

.decoration-green-750 {
  text-decoration-color: var(--sc-color-green-750);
}

.decoration-green-750-dark {
  text-decoration-color: var(--sc-color-green-750-dark);
}

.decoration-green-800 {
  text-decoration-color: var(--sc-color-green-800);
}

.decoration-green-800-dark {
  text-decoration-color: var(--sc-color-green-800-dark);
}

.decoration-green-850 {
  text-decoration-color: var(--sc-color-green-850);
}

.decoration-green-850-dark {
  text-decoration-color: var(--sc-color-green-850-dark);
}

.decoration-green-900 {
  text-decoration-color: var(--sc-color-green-900);
}

.decoration-green-900-dark {
  text-decoration-color: var(--sc-color-green-900-dark);
}

.decoration-green-950 {
  text-decoration-color: var(--sc-color-green-950);
}

.decoration-green-950-dark {
  text-decoration-color: var(--sc-color-green-950-dark);
}

.decoration-grey-100 {
  text-decoration-color: var(--sc-color-grey-100);
}

.decoration-grey-100-dark {
  text-decoration-color: var(--sc-color-grey-100-dark);
}

.decoration-grey-150 {
  text-decoration-color: var(--sc-color-grey-150);
}

.decoration-grey-150-dark {
  text-decoration-color: var(--sc-color-grey-150-dark);
}

.decoration-grey-200 {
  text-decoration-color: var(--sc-color-grey-200);
}

.decoration-grey-200-dark {
  text-decoration-color: var(--sc-color-grey-200-dark);
}

.decoration-grey-250 {
  text-decoration-color: var(--sc-color-grey-250);
}

.decoration-grey-250-dark {
  text-decoration-color: var(--sc-color-grey-250-dark);
}

.decoration-grey-300 {
  text-decoration-color: var(--sc-color-grey-300);
}

.decoration-grey-300-dark {
  text-decoration-color: var(--sc-color-grey-300-dark);
}

.decoration-grey-350 {
  text-decoration-color: var(--sc-color-grey-350);
}

.decoration-grey-350-dark {
  text-decoration-color: var(--sc-color-grey-350-dark);
}

.decoration-grey-400 {
  text-decoration-color: var(--sc-color-grey-400);
}

.decoration-grey-400-dark {
  text-decoration-color: var(--sc-color-grey-400-dark);
}

.decoration-grey-450 {
  text-decoration-color: var(--sc-color-grey-450);
}

.decoration-grey-450-dark {
  text-decoration-color: var(--sc-color-grey-450-dark);
}

.decoration-grey-50 {
  text-decoration-color: var(--sc-color-grey-50);
}

.decoration-grey-50-dark {
  text-decoration-color: var(--sc-color-grey-50-dark);
}

.decoration-grey-500 {
  text-decoration-color: var(--sc-color-grey-500);
}

.decoration-grey-500-dark {
  text-decoration-color: var(--sc-color-grey-500-dark);
}

.decoration-grey-550 {
  text-decoration-color: var(--sc-color-grey-550);
}

.decoration-grey-550-dark {
  text-decoration-color: var(--sc-color-grey-550-dark);
}

.decoration-grey-600 {
  text-decoration-color: var(--sc-color-grey-600);
}

.decoration-grey-600-dark {
  text-decoration-color: var(--sc-color-grey-600-dark);
}

.decoration-grey-650 {
  text-decoration-color: var(--sc-color-grey-650);
}

.decoration-grey-650-dark {
  text-decoration-color: var(--sc-color-grey-650-dark);
}

.decoration-grey-700 {
  text-decoration-color: var(--sc-color-grey-700);
}

.decoration-grey-700-dark {
  text-decoration-color: var(--sc-color-grey-700-dark);
}

.decoration-grey-750 {
  text-decoration-color: var(--sc-color-grey-750);
}

.decoration-grey-750-dark {
  text-decoration-color: var(--sc-color-grey-750-dark);
}

.decoration-grey-800 {
  text-decoration-color: var(--sc-color-grey-800);
}

.decoration-grey-800-dark {
  text-decoration-color: var(--sc-color-grey-800-dark);
}

.decoration-grey-850 {
  text-decoration-color: var(--sc-color-grey-850);
}

.decoration-grey-850-dark {
  text-decoration-color: var(--sc-color-grey-850-dark);
}

.decoration-grey-900 {
  text-decoration-color: var(--sc-color-grey-900);
}

.decoration-grey-900-dark {
  text-decoration-color: var(--sc-color-grey-900-dark);
}

.decoration-grey-950 {
  text-decoration-color: var(--sc-color-grey-950);
}

.decoration-grey-950-dark {
  text-decoration-color: var(--sc-color-grey-950-dark);
}

.decoration-grey-black {
  text-decoration-color: var(--sc-color-black);
}

.decoration-muted {
  text-decoration-color: var(--sc-color-blue-900);
}

.decoration-orange-500 {
  text-decoration-color: var(--sc-color-orange-500);
}

.decoration-primary {
  text-decoration-color: var(--sc-color-blue);
}

.decoration-purple-100 {
  text-decoration-color: var(--sc-color-purple-100);
}

.decoration-purple-100-dark {
  text-decoration-color: var(--sc-color-purple-100-dark);
}

.decoration-purple-150 {
  text-decoration-color: var(--sc-color-purple-150);
}

.decoration-purple-150-dark {
  text-decoration-color: var(--sc-color-purple-150-dark);
}

.decoration-purple-200 {
  text-decoration-color: var(--sc-color-purple-200);
}

.decoration-purple-200-dark {
  text-decoration-color: var(--sc-color-purple-200-dark);
}

.decoration-purple-250 {
  text-decoration-color: var(--sc-color-purple-250);
}

.decoration-purple-250-dark {
  text-decoration-color: var(--sc-color-purple-250-dark);
}

.decoration-purple-300 {
  text-decoration-color: var(--sc-color-purple-300);
}

.decoration-purple-300-dark {
  text-decoration-color: var(--sc-color-purple-300-dark);
}

.decoration-purple-350 {
  text-decoration-color: var(--sc-color-purple-350);
}

.decoration-purple-350-dark {
  text-decoration-color: var(--sc-color-purple-350-dark);
}

.decoration-purple-400 {
  text-decoration-color: var(--sc-color-purple-400);
}

.decoration-purple-400-dark {
  text-decoration-color: var(--sc-color-purple-400-dark);
}

.decoration-purple-450 {
  text-decoration-color: var(--sc-color-purple-450);
}

.decoration-purple-450-dark {
  text-decoration-color: var(--sc-color-purple-450-dark);
}

.decoration-purple-50 {
  text-decoration-color: var(--sc-color-purple-50);
}

.decoration-purple-50-dark {
  text-decoration-color: var(--sc-color-purple-50-dark);
}

.decoration-purple-500 {
  text-decoration-color: var(--sc-color-purple-500);
}

.decoration-purple-500-dark {
  text-decoration-color: var(--sc-color-purple-500-dark);
}

.decoration-purple-550 {
  text-decoration-color: var(--sc-color-purple-550);
}

.decoration-purple-550-dark {
  text-decoration-color: var(--sc-color-purple-550-dark);
}

.decoration-purple-600 {
  text-decoration-color: var(--sc-color-purple-600);
}

.decoration-purple-600-dark {
  text-decoration-color: var(--sc-color-purple-600-dark);
}

.decoration-purple-650 {
  text-decoration-color: var(--sc-color-purple-650);
}

.decoration-purple-650-dark {
  text-decoration-color: var(--sc-color-purple-650-dark);
}

.decoration-purple-700 {
  text-decoration-color: var(--sc-color-purple-700);
}

.decoration-purple-700-dark {
  text-decoration-color: var(--sc-color-purple-700-dark);
}

.decoration-purple-750 {
  text-decoration-color: var(--sc-color-purple-750);
}

.decoration-purple-750-dark {
  text-decoration-color: var(--sc-color-purple-750-dark);
}

.decoration-purple-800 {
  text-decoration-color: var(--sc-color-purple-800);
}

.decoration-purple-800-dark {
  text-decoration-color: var(--sc-color-purple-800-dark);
}

.decoration-purple-850 {
  text-decoration-color: var(--sc-color-purple-850);
}

.decoration-purple-850-dark {
  text-decoration-color: var(--sc-color-purple-850-dark);
}

.decoration-purple-900 {
  text-decoration-color: var(--sc-color-purple-900);
}

.decoration-purple-900-dark {
  text-decoration-color: var(--sc-color-purple-900-dark);
}

.decoration-purple-950 {
  text-decoration-color: var(--sc-color-purple-950);
}

.decoration-purple-950-dark {
  text-decoration-color: var(--sc-color-purple-950-dark);
}

.decoration-red-100 {
  text-decoration-color: var(--sc-color-red-100);
}

.decoration-red-100-dark {
  text-decoration-color: var(--sc-color-red-100-dark);
}

.decoration-red-150 {
  text-decoration-color: var(--sc-color-red-150);
}

.decoration-red-150-dark {
  text-decoration-color: var(--sc-color-red-150-dark);
}

.decoration-red-200 {
  text-decoration-color: var(--sc-color-red-200);
}

.decoration-red-200-dark {
  text-decoration-color: var(--sc-color-red-200-dark);
}

.decoration-red-250 {
  text-decoration-color: var(--sc-color-red-250);
}

.decoration-red-250-dark {
  text-decoration-color: var(--sc-color-red-250-dark);
}

.decoration-red-300 {
  text-decoration-color: var(--sc-color-red-300);
}

.decoration-red-300-dark {
  text-decoration-color: var(--sc-color-red-300-dark);
}

.decoration-red-350 {
  text-decoration-color: var(--sc-color-red-350);
}

.decoration-red-350-dark {
  text-decoration-color: var(--sc-color-red-350-dark);
}

.decoration-red-400 {
  text-decoration-color: var(--sc-color-red-400);
}

.decoration-red-400-dark {
  text-decoration-color: var(--sc-color-red-400-dark);
}

.decoration-red-450 {
  text-decoration-color: var(--sc-color-red-450);
}

.decoration-red-450-dark {
  text-decoration-color: var(--sc-color-red-450-dark);
}

.decoration-red-50 {
  text-decoration-color: var(--sc-color-red-50);
}

.decoration-red-50-dark {
  text-decoration-color: var(--sc-color-red-50-dark);
}

.decoration-red-500 {
  text-decoration-color: var(--sc-color-red-500);
}

.decoration-red-500-dark {
  text-decoration-color: var(--sc-color-red-500-dark);
}

.decoration-red-550 {
  text-decoration-color: var(--sc-color-red-550);
}

.decoration-red-550-dark {
  text-decoration-color: var(--sc-color-red-550-dark);
}

.decoration-red-600 {
  text-decoration-color: var(--sc-color-red-600);
}

.decoration-red-600-dark {
  text-decoration-color: var(--sc-color-red-600-dark);
}

.decoration-red-650 {
  text-decoration-color: var(--sc-color-red-650);
}

.decoration-red-650-dark {
  text-decoration-color: var(--sc-color-red-650-dark);
}

.decoration-red-700 {
  text-decoration-color: var(--sc-color-red-700);
}

.decoration-red-700-dark {
  text-decoration-color: var(--sc-color-red-700-dark);
}

.decoration-red-750 {
  text-decoration-color: var(--sc-color-red-750);
}

.decoration-red-750-dark {
  text-decoration-color: var(--sc-color-red-750-dark);
}

.decoration-red-800 {
  text-decoration-color: var(--sc-color-red-800);
}

.decoration-red-800-dark {
  text-decoration-color: var(--sc-color-red-800-dark);
}

.decoration-red-850 {
  text-decoration-color: var(--sc-color-red-850);
}

.decoration-red-850-dark {
  text-decoration-color: var(--sc-color-red-850-dark);
}

.decoration-red-900 {
  text-decoration-color: var(--sc-color-red-900);
}

.decoration-red-900-dark {
  text-decoration-color: var(--sc-color-red-900-dark);
}

.decoration-red-950 {
  text-decoration-color: var(--sc-color-red-950);
}

.decoration-red-950-dark {
  text-decoration-color: var(--sc-color-red-950-dark);
}

.decoration-teal-100 {
  text-decoration-color: var(--sc-color-teal-100);
}

.decoration-teal-500 {
  text-decoration-color: var(--sc-color-teal-500);
}

.decoration-transparent {
  text-decoration-color: transparent;
}

.decoration-transparent\/0 {
  text-decoration-color: rgb(0 0 0 / 0);
}

.decoration-transparent\/10 {
  text-decoration-color: rgb(0 0 0 / 0.1);
}

.decoration-transparent\/100 {
  text-decoration-color: rgb(0 0 0 / 1);
}

.decoration-transparent\/15 {
  text-decoration-color: rgb(0 0 0 / 0.15);
}

.decoration-transparent\/20 {
  text-decoration-color: rgb(0 0 0 / 0.2);
}

.decoration-transparent\/25 {
  text-decoration-color: rgb(0 0 0 / 0.25);
}

.decoration-transparent\/30 {
  text-decoration-color: rgb(0 0 0 / 0.3);
}

.decoration-transparent\/35 {
  text-decoration-color: rgb(0 0 0 / 0.35);
}

.decoration-transparent\/40 {
  text-decoration-color: rgb(0 0 0 / 0.4);
}

.decoration-transparent\/45 {
  text-decoration-color: rgb(0 0 0 / 0.45);
}

.decoration-transparent\/5 {
  text-decoration-color: rgb(0 0 0 / 0.05);
}

.decoration-transparent\/50 {
  text-decoration-color: rgb(0 0 0 / 0.5);
}

.decoration-transparent\/55 {
  text-decoration-color: rgb(0 0 0 / 0.55);
}

.decoration-transparent\/60 {
  text-decoration-color: rgb(0 0 0 / 0.6);
}

.decoration-transparent\/65 {
  text-decoration-color: rgb(0 0 0 / 0.65);
}

.decoration-transparent\/70 {
  text-decoration-color: rgb(0 0 0 / 0.7);
}

.decoration-transparent\/75 {
  text-decoration-color: rgb(0 0 0 / 0.75);
}

.decoration-transparent\/80 {
  text-decoration-color: rgb(0 0 0 / 0.8);
}

.decoration-transparent\/85 {
  text-decoration-color: rgb(0 0 0 / 0.85);
}

.decoration-transparent\/90 {
  text-decoration-color: rgb(0 0 0 / 0.9);
}

.decoration-transparent\/95 {
  text-decoration-color: rgb(0 0 0 / 0.95);
}

.decoration-white {
  text-decoration-color: var(--sc-color-white);
}

.decoration-0 {
  text-decoration-thickness: 0px;
}

.decoration-1 {
  text-decoration-thickness: 1px;
}

.decoration-2 {
  text-decoration-thickness: 2px;
}

.decoration-4 {
  text-decoration-thickness: 4px;
}

.decoration-8 {
  text-decoration-thickness: 8px;
}

.decoration-auto {
  text-decoration-thickness: auto;
}

.decoration-from-font {
  text-decoration-thickness: from-font;
}

.underline-offset-0 {
  text-underline-offset: 0px;
}

.underline-offset-1 {
  text-underline-offset: 1px;
}

.underline-offset-2 {
  text-underline-offset: 2px;
}

.underline-offset-4 {
  text-underline-offset: 4px;
}

.underline-offset-8 {
  text-underline-offset: 8px;
}

.underline-offset-auto {
  text-underline-offset: auto;
}

.placeholder-amber-100::-moz-placeholder {
  color: var(--sc-color-amber-100);
}

.placeholder-amber-100::placeholder {
  color: var(--sc-color-amber-100);
}

.placeholder-amber-100-dark::-moz-placeholder {
  color: var(--sc-color-amber-100-dark);
}

.placeholder-amber-100-dark::placeholder {
  color: var(--sc-color-amber-100-dark);
}

.placeholder-amber-150::-moz-placeholder {
  color: var(--sc-color-amber-150);
}

.placeholder-amber-150::placeholder {
  color: var(--sc-color-amber-150);
}

.placeholder-amber-150-dark::-moz-placeholder {
  color: var(--sc-color-amber-150-dark);
}

.placeholder-amber-150-dark::placeholder {
  color: var(--sc-color-amber-150-dark);
}

.placeholder-amber-200::-moz-placeholder {
  color: var(--sc-color-amber-200);
}

.placeholder-amber-200::placeholder {
  color: var(--sc-color-amber-200);
}

.placeholder-amber-200-dark::-moz-placeholder {
  color: var(--sc-color-amber-200-dark);
}

.placeholder-amber-200-dark::placeholder {
  color: var(--sc-color-amber-200-dark);
}

.placeholder-amber-250::-moz-placeholder {
  color: var(--sc-color-amber-250);
}

.placeholder-amber-250::placeholder {
  color: var(--sc-color-amber-250);
}

.placeholder-amber-250-dark::-moz-placeholder {
  color: var(--sc-color-amber-250-dark);
}

.placeholder-amber-250-dark::placeholder {
  color: var(--sc-color-amber-250-dark);
}

.placeholder-amber-300::-moz-placeholder {
  color: var(--sc-color-amber-300);
}

.placeholder-amber-300::placeholder {
  color: var(--sc-color-amber-300);
}

.placeholder-amber-300-dark::-moz-placeholder {
  color: var(--sc-color-amber-300-dark);
}

.placeholder-amber-300-dark::placeholder {
  color: var(--sc-color-amber-300-dark);
}

.placeholder-amber-350::-moz-placeholder {
  color: var(--sc-color-amber-350);
}

.placeholder-amber-350::placeholder {
  color: var(--sc-color-amber-350);
}

.placeholder-amber-350-dark::-moz-placeholder {
  color: var(--sc-color-amber-350-dark);
}

.placeholder-amber-350-dark::placeholder {
  color: var(--sc-color-amber-350-dark);
}

.placeholder-amber-400::-moz-placeholder {
  color: var(--sc-color-amber-400);
}

.placeholder-amber-400::placeholder {
  color: var(--sc-color-amber-400);
}

.placeholder-amber-400-dark::-moz-placeholder {
  color: var(--sc-color-amber-400-dark);
}

.placeholder-amber-400-dark::placeholder {
  color: var(--sc-color-amber-400-dark);
}

.placeholder-amber-450::-moz-placeholder {
  color: var(--sc-color-amber-450);
}

.placeholder-amber-450::placeholder {
  color: var(--sc-color-amber-450);
}

.placeholder-amber-450-dark::-moz-placeholder {
  color: var(--sc-color-amber-450-dark);
}

.placeholder-amber-450-dark::placeholder {
  color: var(--sc-color-amber-450-dark);
}

.placeholder-amber-50::-moz-placeholder {
  color: var(--sc-color-amber-50);
}

.placeholder-amber-50::placeholder {
  color: var(--sc-color-amber-50);
}

.placeholder-amber-50-dark::-moz-placeholder {
  color: var(--sc-color-amber-50-dark);
}

.placeholder-amber-50-dark::placeholder {
  color: var(--sc-color-amber-50-dark);
}

.placeholder-amber-500::-moz-placeholder {
  color: var(--sc-color-amber-500);
}

.placeholder-amber-500::placeholder {
  color: var(--sc-color-amber-500);
}

.placeholder-amber-500-dark::-moz-placeholder {
  color: var(--sc-color-amber-500-dark);
}

.placeholder-amber-500-dark::placeholder {
  color: var(--sc-color-amber-500-dark);
}

.placeholder-amber-550::-moz-placeholder {
  color: var(--sc-color-amber-550);
}

.placeholder-amber-550::placeholder {
  color: var(--sc-color-amber-550);
}

.placeholder-amber-550-dark::-moz-placeholder {
  color: var(--sc-color-amber-550-dark);
}

.placeholder-amber-550-dark::placeholder {
  color: var(--sc-color-amber-550-dark);
}

.placeholder-amber-600::-moz-placeholder {
  color: var(--sc-color-amber-600);
}

.placeholder-amber-600::placeholder {
  color: var(--sc-color-amber-600);
}

.placeholder-amber-600-dark::-moz-placeholder {
  color: var(--sc-color-amber-600-dark);
}

.placeholder-amber-600-dark::placeholder {
  color: var(--sc-color-amber-600-dark);
}

.placeholder-amber-650::-moz-placeholder {
  color: var(--sc-color-amber-650);
}

.placeholder-amber-650::placeholder {
  color: var(--sc-color-amber-650);
}

.placeholder-amber-650-dark::-moz-placeholder {
  color: var(--sc-color-amber-650-dark);
}

.placeholder-amber-650-dark::placeholder {
  color: var(--sc-color-amber-650-dark);
}

.placeholder-amber-700::-moz-placeholder {
  color: var(--sc-color-amber-700);
}

.placeholder-amber-700::placeholder {
  color: var(--sc-color-amber-700);
}

.placeholder-amber-700-dark::-moz-placeholder {
  color: var(--sc-color-amber-700-dark);
}

.placeholder-amber-700-dark::placeholder {
  color: var(--sc-color-amber-700-dark);
}

.placeholder-amber-750::-moz-placeholder {
  color: var(--sc-color-amber-750);
}

.placeholder-amber-750::placeholder {
  color: var(--sc-color-amber-750);
}

.placeholder-amber-750-dark::-moz-placeholder {
  color: var(--sc-color-amber-750-dark);
}

.placeholder-amber-750-dark::placeholder {
  color: var(--sc-color-amber-750-dark);
}

.placeholder-amber-800::-moz-placeholder {
  color: var(--sc-color-amber-800);
}

.placeholder-amber-800::placeholder {
  color: var(--sc-color-amber-800);
}

.placeholder-amber-800-dark::-moz-placeholder {
  color: var(--sc-color-amber-800-dark);
}

.placeholder-amber-800-dark::placeholder {
  color: var(--sc-color-amber-800-dark);
}

.placeholder-amber-850::-moz-placeholder {
  color: var(--sc-color-amber-850);
}

.placeholder-amber-850::placeholder {
  color: var(--sc-color-amber-850);
}

.placeholder-amber-850-dark::-moz-placeholder {
  color: var(--sc-color-amber-850-dark);
}

.placeholder-amber-850-dark::placeholder {
  color: var(--sc-color-amber-850-dark);
}

.placeholder-amber-900::-moz-placeholder {
  color: var(--sc-color-amber-900);
}

.placeholder-amber-900::placeholder {
  color: var(--sc-color-amber-900);
}

.placeholder-amber-900-dark::-moz-placeholder {
  color: var(--sc-color-amber-900-dark);
}

.placeholder-amber-900-dark::placeholder {
  color: var(--sc-color-amber-900-dark);
}

.placeholder-amber-950::-moz-placeholder {
  color: var(--sc-color-amber-950);
}

.placeholder-amber-950::placeholder {
  color: var(--sc-color-amber-950);
}

.placeholder-amber-950-dark::-moz-placeholder {
  color: var(--sc-color-amber-950-dark);
}

.placeholder-amber-950-dark::placeholder {
  color: var(--sc-color-amber-950-dark);
}

.placeholder-blue-100::-moz-placeholder {
  color: var(--sc-color-blue-100);
}

.placeholder-blue-100::placeholder {
  color: var(--sc-color-blue-100);
}

.placeholder-blue-100-dark::-moz-placeholder {
  color: var(--sc-color-blue-100-dark);
}

.placeholder-blue-100-dark::placeholder {
  color: var(--sc-color-blue-100-dark);
}

.placeholder-blue-150::-moz-placeholder {
  color: var(--sc-color-blue-150);
}

.placeholder-blue-150::placeholder {
  color: var(--sc-color-blue-150);
}

.placeholder-blue-150-dark::-moz-placeholder {
  color: var(--sc-color-blue-150-dark);
}

.placeholder-blue-150-dark::placeholder {
  color: var(--sc-color-blue-150-dark);
}

.placeholder-blue-200::-moz-placeholder {
  color: var(--sc-color-blue-200);
}

.placeholder-blue-200::placeholder {
  color: var(--sc-color-blue-200);
}

.placeholder-blue-200-dark::-moz-placeholder {
  color: var(--sc-color-blue-200-dark);
}

.placeholder-blue-200-dark::placeholder {
  color: var(--sc-color-blue-200-dark);
}

.placeholder-blue-250::-moz-placeholder {
  color: var(--sc-color-blue-250);
}

.placeholder-blue-250::placeholder {
  color: var(--sc-color-blue-250);
}

.placeholder-blue-250-dark::-moz-placeholder {
  color: var(--sc-color-blue-250-dark);
}

.placeholder-blue-250-dark::placeholder {
  color: var(--sc-color-blue-250-dark);
}

.placeholder-blue-300::-moz-placeholder {
  color: var(--sc-color-blue-300);
}

.placeholder-blue-300::placeholder {
  color: var(--sc-color-blue-300);
}

.placeholder-blue-300-dark::-moz-placeholder {
  color: var(--sc-color-blue-300-dark);
}

.placeholder-blue-300-dark::placeholder {
  color: var(--sc-color-blue-300-dark);
}

.placeholder-blue-350::-moz-placeholder {
  color: var(--sc-color-blue-350);
}

.placeholder-blue-350::placeholder {
  color: var(--sc-color-blue-350);
}

.placeholder-blue-350-dark::-moz-placeholder {
  color: var(--sc-color-blue-350-dark);
}

.placeholder-blue-350-dark::placeholder {
  color: var(--sc-color-blue-350-dark);
}

.placeholder-blue-400::-moz-placeholder {
  color: var(--sc-color-blue-400);
}

.placeholder-blue-400::placeholder {
  color: var(--sc-color-blue-400);
}

.placeholder-blue-400-dark::-moz-placeholder {
  color: var(--sc-color-blue-400-dark);
}

.placeholder-blue-400-dark::placeholder {
  color: var(--sc-color-blue-400-dark);
}

.placeholder-blue-450::-moz-placeholder {
  color: var(--sc-color-blue-450);
}

.placeholder-blue-450::placeholder {
  color: var(--sc-color-blue-450);
}

.placeholder-blue-450-dark::-moz-placeholder {
  color: var(--sc-color-blue-450-dark);
}

.placeholder-blue-450-dark::placeholder {
  color: var(--sc-color-blue-450-dark);
}

.placeholder-blue-50::-moz-placeholder {
  color: var(--sc-color-blue-50);
}

.placeholder-blue-50::placeholder {
  color: var(--sc-color-blue-50);
}

.placeholder-blue-50-dark::-moz-placeholder {
  color: var(--sc-color-blue-50-dark);
}

.placeholder-blue-50-dark::placeholder {
  color: var(--sc-color-blue-50-dark);
}

.placeholder-blue-500::-moz-placeholder {
  color: var(--sc-color-blue-500);
}

.placeholder-blue-500::placeholder {
  color: var(--sc-color-blue-500);
}

.placeholder-blue-500-dark::-moz-placeholder {
  color: var(--sc-color-blue-500-dark);
}

.placeholder-blue-500-dark::placeholder {
  color: var(--sc-color-blue-500-dark);
}

.placeholder-blue-550::-moz-placeholder {
  color: var(--sc-color-blue-550);
}

.placeholder-blue-550::placeholder {
  color: var(--sc-color-blue-550);
}

.placeholder-blue-550-dark::-moz-placeholder {
  color: var(--sc-color-blue-550-dark);
}

.placeholder-blue-550-dark::placeholder {
  color: var(--sc-color-blue-550-dark);
}

.placeholder-blue-600::-moz-placeholder {
  color: var(--sc-color-blue-600);
}

.placeholder-blue-600::placeholder {
  color: var(--sc-color-blue-600);
}

.placeholder-blue-600-dark::-moz-placeholder {
  color: var(--sc-color-blue-600-dark);
}

.placeholder-blue-600-dark::placeholder {
  color: var(--sc-color-blue-600-dark);
}

.placeholder-blue-650::-moz-placeholder {
  color: var(--sc-color-blue-650);
}

.placeholder-blue-650::placeholder {
  color: var(--sc-color-blue-650);
}

.placeholder-blue-650-dark::-moz-placeholder {
  color: var(--sc-color-blue-650-dark);
}

.placeholder-blue-650-dark::placeholder {
  color: var(--sc-color-blue-650-dark);
}

.placeholder-blue-700::-moz-placeholder {
  color: var(--sc-color-blue-700);
}

.placeholder-blue-700::placeholder {
  color: var(--sc-color-blue-700);
}

.placeholder-blue-700-dark::-moz-placeholder {
  color: var(--sc-color-blue-700-dark);
}

.placeholder-blue-700-dark::placeholder {
  color: var(--sc-color-blue-700-dark);
}

.placeholder-blue-750::-moz-placeholder {
  color: var(--sc-color-blue-750);
}

.placeholder-blue-750::placeholder {
  color: var(--sc-color-blue-750);
}

.placeholder-blue-750-dark::-moz-placeholder {
  color: var(--sc-color-blue-750-dark);
}

.placeholder-blue-750-dark::placeholder {
  color: var(--sc-color-blue-750-dark);
}

.placeholder-blue-800::-moz-placeholder {
  color: var(--sc-color-blue-800);
}

.placeholder-blue-800::placeholder {
  color: var(--sc-color-blue-800);
}

.placeholder-blue-800-dark::-moz-placeholder {
  color: var(--sc-color-blue-800-dark);
}

.placeholder-blue-800-dark::placeholder {
  color: var(--sc-color-blue-800-dark);
}

.placeholder-blue-850::-moz-placeholder {
  color: var(--sc-color-blue-850);
}

.placeholder-blue-850::placeholder {
  color: var(--sc-color-blue-850);
}

.placeholder-blue-850-dark::-moz-placeholder {
  color: var(--sc-color-blue-850-dark);
}

.placeholder-blue-850-dark::placeholder {
  color: var(--sc-color-blue-850-dark);
}

.placeholder-blue-900::-moz-placeholder {
  color: var(--sc-color-blue-900);
}

.placeholder-blue-900::placeholder {
  color: var(--sc-color-blue-900);
}

.placeholder-blue-900-dark::-moz-placeholder {
  color: var(--sc-color-blue-900-dark);
}

.placeholder-blue-900-dark::placeholder {
  color: var(--sc-color-blue-900-dark);
}

.placeholder-blue-950::-moz-placeholder {
  color: var(--sc-color-blue-950);
}

.placeholder-blue-950::placeholder {
  color: var(--sc-color-blue-950);
}

.placeholder-blue-950-dark::-moz-placeholder {
  color: var(--sc-color-blue-950-dark);
}

.placeholder-blue-950-dark::placeholder {
  color: var(--sc-color-blue-950-dark);
}

.placeholder-current::-moz-placeholder {
  color: currentColor;
}

.placeholder-current::placeholder {
  color: currentColor;
}

.placeholder-green-100::-moz-placeholder {
  color: var(--sc-color-green-100);
}

.placeholder-green-100::placeholder {
  color: var(--sc-color-green-100);
}

.placeholder-green-100-dark::-moz-placeholder {
  color: var(--sc-color-green-100-dark);
}

.placeholder-green-100-dark::placeholder {
  color: var(--sc-color-green-100-dark);
}

.placeholder-green-150::-moz-placeholder {
  color: var(--sc-color-green-150);
}

.placeholder-green-150::placeholder {
  color: var(--sc-color-green-150);
}

.placeholder-green-150-dark::-moz-placeholder {
  color: var(--sc-color-green-150-dark);
}

.placeholder-green-150-dark::placeholder {
  color: var(--sc-color-green-150-dark);
}

.placeholder-green-200::-moz-placeholder {
  color: var(--sc-color-green-200);
}

.placeholder-green-200::placeholder {
  color: var(--sc-color-green-200);
}

.placeholder-green-200-dark::-moz-placeholder {
  color: var(--sc-color-green-200-dark);
}

.placeholder-green-200-dark::placeholder {
  color: var(--sc-color-green-200-dark);
}

.placeholder-green-250::-moz-placeholder {
  color: var(--sc-color-green-250);
}

.placeholder-green-250::placeholder {
  color: var(--sc-color-green-250);
}

.placeholder-green-250-dark::-moz-placeholder {
  color: var(--sc-color-green-250-dark);
}

.placeholder-green-250-dark::placeholder {
  color: var(--sc-color-green-250-dark);
}

.placeholder-green-300::-moz-placeholder {
  color: var(--sc-color-green-300);
}

.placeholder-green-300::placeholder {
  color: var(--sc-color-green-300);
}

.placeholder-green-300-dark::-moz-placeholder {
  color: var(--sc-color-green-300-dark);
}

.placeholder-green-300-dark::placeholder {
  color: var(--sc-color-green-300-dark);
}

.placeholder-green-350::-moz-placeholder {
  color: var(--sc-color-green-350);
}

.placeholder-green-350::placeholder {
  color: var(--sc-color-green-350);
}

.placeholder-green-350-dark::-moz-placeholder {
  color: var(--sc-color-green-350-dark);
}

.placeholder-green-350-dark::placeholder {
  color: var(--sc-color-green-350-dark);
}

.placeholder-green-400::-moz-placeholder {
  color: var(--sc-color-green-400);
}

.placeholder-green-400::placeholder {
  color: var(--sc-color-green-400);
}

.placeholder-green-400-dark::-moz-placeholder {
  color: var(--sc-color-green-400-dark);
}

.placeholder-green-400-dark::placeholder {
  color: var(--sc-color-green-400-dark);
}

.placeholder-green-450::-moz-placeholder {
  color: var(--sc-color-green-450);
}

.placeholder-green-450::placeholder {
  color: var(--sc-color-green-450);
}

.placeholder-green-450-dark::-moz-placeholder {
  color: var(--sc-color-green-450-dark);
}

.placeholder-green-450-dark::placeholder {
  color: var(--sc-color-green-450-dark);
}

.placeholder-green-50::-moz-placeholder {
  color: var(--sc-color-green-50);
}

.placeholder-green-50::placeholder {
  color: var(--sc-color-green-50);
}

.placeholder-green-50-dark::-moz-placeholder {
  color: var(--sc-color-green-50-dark);
}

.placeholder-green-50-dark::placeholder {
  color: var(--sc-color-green-50-dark);
}

.placeholder-green-500::-moz-placeholder {
  color: var(--sc-color-green-500);
}

.placeholder-green-500::placeholder {
  color: var(--sc-color-green-500);
}

.placeholder-green-500-dark::-moz-placeholder {
  color: var(--sc-color-green-500-dark);
}

.placeholder-green-500-dark::placeholder {
  color: var(--sc-color-green-500-dark);
}

.placeholder-green-550::-moz-placeholder {
  color: var(--sc-color-green-550);
}

.placeholder-green-550::placeholder {
  color: var(--sc-color-green-550);
}

.placeholder-green-550-dark::-moz-placeholder {
  color: var(--sc-color-green-550-dark);
}

.placeholder-green-550-dark::placeholder {
  color: var(--sc-color-green-550-dark);
}

.placeholder-green-600::-moz-placeholder {
  color: var(--sc-color-green-600);
}

.placeholder-green-600::placeholder {
  color: var(--sc-color-green-600);
}

.placeholder-green-600-dark::-moz-placeholder {
  color: var(--sc-color-green-600-dark);
}

.placeholder-green-600-dark::placeholder {
  color: var(--sc-color-green-600-dark);
}

.placeholder-green-650::-moz-placeholder {
  color: var(--sc-color-green-650);
}

.placeholder-green-650::placeholder {
  color: var(--sc-color-green-650);
}

.placeholder-green-650-dark::-moz-placeholder {
  color: var(--sc-color-green-650-dark);
}

.placeholder-green-650-dark::placeholder {
  color: var(--sc-color-green-650-dark);
}

.placeholder-green-700::-moz-placeholder {
  color: var(--sc-color-green-700);
}

.placeholder-green-700::placeholder {
  color: var(--sc-color-green-700);
}

.placeholder-green-700-dark::-moz-placeholder {
  color: var(--sc-color-green-700-dark);
}

.placeholder-green-700-dark::placeholder {
  color: var(--sc-color-green-700-dark);
}

.placeholder-green-750::-moz-placeholder {
  color: var(--sc-color-green-750);
}

.placeholder-green-750::placeholder {
  color: var(--sc-color-green-750);
}

.placeholder-green-750-dark::-moz-placeholder {
  color: var(--sc-color-green-750-dark);
}

.placeholder-green-750-dark::placeholder {
  color: var(--sc-color-green-750-dark);
}

.placeholder-green-800::-moz-placeholder {
  color: var(--sc-color-green-800);
}

.placeholder-green-800::placeholder {
  color: var(--sc-color-green-800);
}

.placeholder-green-800-dark::-moz-placeholder {
  color: var(--sc-color-green-800-dark);
}

.placeholder-green-800-dark::placeholder {
  color: var(--sc-color-green-800-dark);
}

.placeholder-green-850::-moz-placeholder {
  color: var(--sc-color-green-850);
}

.placeholder-green-850::placeholder {
  color: var(--sc-color-green-850);
}

.placeholder-green-850-dark::-moz-placeholder {
  color: var(--sc-color-green-850-dark);
}

.placeholder-green-850-dark::placeholder {
  color: var(--sc-color-green-850-dark);
}

.placeholder-green-900::-moz-placeholder {
  color: var(--sc-color-green-900);
}

.placeholder-green-900::placeholder {
  color: var(--sc-color-green-900);
}

.placeholder-green-900-dark::-moz-placeholder {
  color: var(--sc-color-green-900-dark);
}

.placeholder-green-900-dark::placeholder {
  color: var(--sc-color-green-900-dark);
}

.placeholder-green-950::-moz-placeholder {
  color: var(--sc-color-green-950);
}

.placeholder-green-950::placeholder {
  color: var(--sc-color-green-950);
}

.placeholder-green-950-dark::-moz-placeholder {
  color: var(--sc-color-green-950-dark);
}

.placeholder-green-950-dark::placeholder {
  color: var(--sc-color-green-950-dark);
}

.placeholder-grey-100::-moz-placeholder {
  color: var(--sc-color-grey-100);
}

.placeholder-grey-100::placeholder {
  color: var(--sc-color-grey-100);
}

.placeholder-grey-100-dark::-moz-placeholder {
  color: var(--sc-color-grey-100-dark);
}

.placeholder-grey-100-dark::placeholder {
  color: var(--sc-color-grey-100-dark);
}

.placeholder-grey-150::-moz-placeholder {
  color: var(--sc-color-grey-150);
}

.placeholder-grey-150::placeholder {
  color: var(--sc-color-grey-150);
}

.placeholder-grey-150-dark::-moz-placeholder {
  color: var(--sc-color-grey-150-dark);
}

.placeholder-grey-150-dark::placeholder {
  color: var(--sc-color-grey-150-dark);
}

.placeholder-grey-200::-moz-placeholder {
  color: var(--sc-color-grey-200);
}

.placeholder-grey-200::placeholder {
  color: var(--sc-color-grey-200);
}

.placeholder-grey-200-dark::-moz-placeholder {
  color: var(--sc-color-grey-200-dark);
}

.placeholder-grey-200-dark::placeholder {
  color: var(--sc-color-grey-200-dark);
}

.placeholder-grey-250::-moz-placeholder {
  color: var(--sc-color-grey-250);
}

.placeholder-grey-250::placeholder {
  color: var(--sc-color-grey-250);
}

.placeholder-grey-250-dark::-moz-placeholder {
  color: var(--sc-color-grey-250-dark);
}

.placeholder-grey-250-dark::placeholder {
  color: var(--sc-color-grey-250-dark);
}

.placeholder-grey-300::-moz-placeholder {
  color: var(--sc-color-grey-300);
}

.placeholder-grey-300::placeholder {
  color: var(--sc-color-grey-300);
}

.placeholder-grey-300-dark::-moz-placeholder {
  color: var(--sc-color-grey-300-dark);
}

.placeholder-grey-300-dark::placeholder {
  color: var(--sc-color-grey-300-dark);
}

.placeholder-grey-350::-moz-placeholder {
  color: var(--sc-color-grey-350);
}

.placeholder-grey-350::placeholder {
  color: var(--sc-color-grey-350);
}

.placeholder-grey-350-dark::-moz-placeholder {
  color: var(--sc-color-grey-350-dark);
}

.placeholder-grey-350-dark::placeholder {
  color: var(--sc-color-grey-350-dark);
}

.placeholder-grey-400::-moz-placeholder {
  color: var(--sc-color-grey-400);
}

.placeholder-grey-400::placeholder {
  color: var(--sc-color-grey-400);
}

.placeholder-grey-400-dark::-moz-placeholder {
  color: var(--sc-color-grey-400-dark);
}

.placeholder-grey-400-dark::placeholder {
  color: var(--sc-color-grey-400-dark);
}

.placeholder-grey-450::-moz-placeholder {
  color: var(--sc-color-grey-450);
}

.placeholder-grey-450::placeholder {
  color: var(--sc-color-grey-450);
}

.placeholder-grey-450-dark::-moz-placeholder {
  color: var(--sc-color-grey-450-dark);
}

.placeholder-grey-450-dark::placeholder {
  color: var(--sc-color-grey-450-dark);
}

.placeholder-grey-50::-moz-placeholder {
  color: var(--sc-color-grey-50);
}

.placeholder-grey-50::placeholder {
  color: var(--sc-color-grey-50);
}

.placeholder-grey-50-dark::-moz-placeholder {
  color: var(--sc-color-grey-50-dark);
}

.placeholder-grey-50-dark::placeholder {
  color: var(--sc-color-grey-50-dark);
}

.placeholder-grey-500::-moz-placeholder {
  color: var(--sc-color-grey-500);
}

.placeholder-grey-500::placeholder {
  color: var(--sc-color-grey-500);
}

.placeholder-grey-500-dark::-moz-placeholder {
  color: var(--sc-color-grey-500-dark);
}

.placeholder-grey-500-dark::placeholder {
  color: var(--sc-color-grey-500-dark);
}

.placeholder-grey-550::-moz-placeholder {
  color: var(--sc-color-grey-550);
}

.placeholder-grey-550::placeholder {
  color: var(--sc-color-grey-550);
}

.placeholder-grey-550-dark::-moz-placeholder {
  color: var(--sc-color-grey-550-dark);
}

.placeholder-grey-550-dark::placeholder {
  color: var(--sc-color-grey-550-dark);
}

.placeholder-grey-600::-moz-placeholder {
  color: var(--sc-color-grey-600);
}

.placeholder-grey-600::placeholder {
  color: var(--sc-color-grey-600);
}

.placeholder-grey-600-dark::-moz-placeholder {
  color: var(--sc-color-grey-600-dark);
}

.placeholder-grey-600-dark::placeholder {
  color: var(--sc-color-grey-600-dark);
}

.placeholder-grey-650::-moz-placeholder {
  color: var(--sc-color-grey-650);
}

.placeholder-grey-650::placeholder {
  color: var(--sc-color-grey-650);
}

.placeholder-grey-650-dark::-moz-placeholder {
  color: var(--sc-color-grey-650-dark);
}

.placeholder-grey-650-dark::placeholder {
  color: var(--sc-color-grey-650-dark);
}

.placeholder-grey-700::-moz-placeholder {
  color: var(--sc-color-grey-700);
}

.placeholder-grey-700::placeholder {
  color: var(--sc-color-grey-700);
}

.placeholder-grey-700-dark::-moz-placeholder {
  color: var(--sc-color-grey-700-dark);
}

.placeholder-grey-700-dark::placeholder {
  color: var(--sc-color-grey-700-dark);
}

.placeholder-grey-750::-moz-placeholder {
  color: var(--sc-color-grey-750);
}

.placeholder-grey-750::placeholder {
  color: var(--sc-color-grey-750);
}

.placeholder-grey-750-dark::-moz-placeholder {
  color: var(--sc-color-grey-750-dark);
}

.placeholder-grey-750-dark::placeholder {
  color: var(--sc-color-grey-750-dark);
}

.placeholder-grey-800::-moz-placeholder {
  color: var(--sc-color-grey-800);
}

.placeholder-grey-800::placeholder {
  color: var(--sc-color-grey-800);
}

.placeholder-grey-800-dark::-moz-placeholder {
  color: var(--sc-color-grey-800-dark);
}

.placeholder-grey-800-dark::placeholder {
  color: var(--sc-color-grey-800-dark);
}

.placeholder-grey-850::-moz-placeholder {
  color: var(--sc-color-grey-850);
}

.placeholder-grey-850::placeholder {
  color: var(--sc-color-grey-850);
}

.placeholder-grey-850-dark::-moz-placeholder {
  color: var(--sc-color-grey-850-dark);
}

.placeholder-grey-850-dark::placeholder {
  color: var(--sc-color-grey-850-dark);
}

.placeholder-grey-900::-moz-placeholder {
  color: var(--sc-color-grey-900);
}

.placeholder-grey-900::placeholder {
  color: var(--sc-color-grey-900);
}

.placeholder-grey-900-dark::-moz-placeholder {
  color: var(--sc-color-grey-900-dark);
}

.placeholder-grey-900-dark::placeholder {
  color: var(--sc-color-grey-900-dark);
}

.placeholder-grey-950::-moz-placeholder {
  color: var(--sc-color-grey-950);
}

.placeholder-grey-950::placeholder {
  color: var(--sc-color-grey-950);
}

.placeholder-grey-950-dark::-moz-placeholder {
  color: var(--sc-color-grey-950-dark);
}

.placeholder-grey-950-dark::placeholder {
  color: var(--sc-color-grey-950-dark);
}

.placeholder-grey-black::-moz-placeholder {
  color: var(--sc-color-black);
}

.placeholder-grey-black::placeholder {
  color: var(--sc-color-black);
}

.placeholder-muted::-moz-placeholder {
  color: var(--sc-color-blue-900);
}

.placeholder-muted::placeholder {
  color: var(--sc-color-blue-900);
}

.placeholder-orange-500::-moz-placeholder {
  color: var(--sc-color-orange-500);
}

.placeholder-orange-500::placeholder {
  color: var(--sc-color-orange-500);
}

.placeholder-primary::-moz-placeholder {
  color: var(--sc-color-blue);
}

.placeholder-primary::placeholder {
  color: var(--sc-color-blue);
}

.placeholder-purple-100::-moz-placeholder {
  color: var(--sc-color-purple-100);
}

.placeholder-purple-100::placeholder {
  color: var(--sc-color-purple-100);
}

.placeholder-purple-100-dark::-moz-placeholder {
  color: var(--sc-color-purple-100-dark);
}

.placeholder-purple-100-dark::placeholder {
  color: var(--sc-color-purple-100-dark);
}

.placeholder-purple-150::-moz-placeholder {
  color: var(--sc-color-purple-150);
}

.placeholder-purple-150::placeholder {
  color: var(--sc-color-purple-150);
}

.placeholder-purple-150-dark::-moz-placeholder {
  color: var(--sc-color-purple-150-dark);
}

.placeholder-purple-150-dark::placeholder {
  color: var(--sc-color-purple-150-dark);
}

.placeholder-purple-200::-moz-placeholder {
  color: var(--sc-color-purple-200);
}

.placeholder-purple-200::placeholder {
  color: var(--sc-color-purple-200);
}

.placeholder-purple-200-dark::-moz-placeholder {
  color: var(--sc-color-purple-200-dark);
}

.placeholder-purple-200-dark::placeholder {
  color: var(--sc-color-purple-200-dark);
}

.placeholder-purple-250::-moz-placeholder {
  color: var(--sc-color-purple-250);
}

.placeholder-purple-250::placeholder {
  color: var(--sc-color-purple-250);
}

.placeholder-purple-250-dark::-moz-placeholder {
  color: var(--sc-color-purple-250-dark);
}

.placeholder-purple-250-dark::placeholder {
  color: var(--sc-color-purple-250-dark);
}

.placeholder-purple-300::-moz-placeholder {
  color: var(--sc-color-purple-300);
}

.placeholder-purple-300::placeholder {
  color: var(--sc-color-purple-300);
}

.placeholder-purple-300-dark::-moz-placeholder {
  color: var(--sc-color-purple-300-dark);
}

.placeholder-purple-300-dark::placeholder {
  color: var(--sc-color-purple-300-dark);
}

.placeholder-purple-350::-moz-placeholder {
  color: var(--sc-color-purple-350);
}

.placeholder-purple-350::placeholder {
  color: var(--sc-color-purple-350);
}

.placeholder-purple-350-dark::-moz-placeholder {
  color: var(--sc-color-purple-350-dark);
}

.placeholder-purple-350-dark::placeholder {
  color: var(--sc-color-purple-350-dark);
}

.placeholder-purple-400::-moz-placeholder {
  color: var(--sc-color-purple-400);
}

.placeholder-purple-400::placeholder {
  color: var(--sc-color-purple-400);
}

.placeholder-purple-400-dark::-moz-placeholder {
  color: var(--sc-color-purple-400-dark);
}

.placeholder-purple-400-dark::placeholder {
  color: var(--sc-color-purple-400-dark);
}

.placeholder-purple-450::-moz-placeholder {
  color: var(--sc-color-purple-450);
}

.placeholder-purple-450::placeholder {
  color: var(--sc-color-purple-450);
}

.placeholder-purple-450-dark::-moz-placeholder {
  color: var(--sc-color-purple-450-dark);
}

.placeholder-purple-450-dark::placeholder {
  color: var(--sc-color-purple-450-dark);
}

.placeholder-purple-50::-moz-placeholder {
  color: var(--sc-color-purple-50);
}

.placeholder-purple-50::placeholder {
  color: var(--sc-color-purple-50);
}

.placeholder-purple-50-dark::-moz-placeholder {
  color: var(--sc-color-purple-50-dark);
}

.placeholder-purple-50-dark::placeholder {
  color: var(--sc-color-purple-50-dark);
}

.placeholder-purple-500::-moz-placeholder {
  color: var(--sc-color-purple-500);
}

.placeholder-purple-500::placeholder {
  color: var(--sc-color-purple-500);
}

.placeholder-purple-500-dark::-moz-placeholder {
  color: var(--sc-color-purple-500-dark);
}

.placeholder-purple-500-dark::placeholder {
  color: var(--sc-color-purple-500-dark);
}

.placeholder-purple-550::-moz-placeholder {
  color: var(--sc-color-purple-550);
}

.placeholder-purple-550::placeholder {
  color: var(--sc-color-purple-550);
}

.placeholder-purple-550-dark::-moz-placeholder {
  color: var(--sc-color-purple-550-dark);
}

.placeholder-purple-550-dark::placeholder {
  color: var(--sc-color-purple-550-dark);
}

.placeholder-purple-600::-moz-placeholder {
  color: var(--sc-color-purple-600);
}

.placeholder-purple-600::placeholder {
  color: var(--sc-color-purple-600);
}

.placeholder-purple-600-dark::-moz-placeholder {
  color: var(--sc-color-purple-600-dark);
}

.placeholder-purple-600-dark::placeholder {
  color: var(--sc-color-purple-600-dark);
}

.placeholder-purple-650::-moz-placeholder {
  color: var(--sc-color-purple-650);
}

.placeholder-purple-650::placeholder {
  color: var(--sc-color-purple-650);
}

.placeholder-purple-650-dark::-moz-placeholder {
  color: var(--sc-color-purple-650-dark);
}

.placeholder-purple-650-dark::placeholder {
  color: var(--sc-color-purple-650-dark);
}

.placeholder-purple-700::-moz-placeholder {
  color: var(--sc-color-purple-700);
}

.placeholder-purple-700::placeholder {
  color: var(--sc-color-purple-700);
}

.placeholder-purple-700-dark::-moz-placeholder {
  color: var(--sc-color-purple-700-dark);
}

.placeholder-purple-700-dark::placeholder {
  color: var(--sc-color-purple-700-dark);
}

.placeholder-purple-750::-moz-placeholder {
  color: var(--sc-color-purple-750);
}

.placeholder-purple-750::placeholder {
  color: var(--sc-color-purple-750);
}

.placeholder-purple-750-dark::-moz-placeholder {
  color: var(--sc-color-purple-750-dark);
}

.placeholder-purple-750-dark::placeholder {
  color: var(--sc-color-purple-750-dark);
}

.placeholder-purple-800::-moz-placeholder {
  color: var(--sc-color-purple-800);
}

.placeholder-purple-800::placeholder {
  color: var(--sc-color-purple-800);
}

.placeholder-purple-800-dark::-moz-placeholder {
  color: var(--sc-color-purple-800-dark);
}

.placeholder-purple-800-dark::placeholder {
  color: var(--sc-color-purple-800-dark);
}

.placeholder-purple-850::-moz-placeholder {
  color: var(--sc-color-purple-850);
}

.placeholder-purple-850::placeholder {
  color: var(--sc-color-purple-850);
}

.placeholder-purple-850-dark::-moz-placeholder {
  color: var(--sc-color-purple-850-dark);
}

.placeholder-purple-850-dark::placeholder {
  color: var(--sc-color-purple-850-dark);
}

.placeholder-purple-900::-moz-placeholder {
  color: var(--sc-color-purple-900);
}

.placeholder-purple-900::placeholder {
  color: var(--sc-color-purple-900);
}

.placeholder-purple-900-dark::-moz-placeholder {
  color: var(--sc-color-purple-900-dark);
}

.placeholder-purple-900-dark::placeholder {
  color: var(--sc-color-purple-900-dark);
}

.placeholder-purple-950::-moz-placeholder {
  color: var(--sc-color-purple-950);
}

.placeholder-purple-950::placeholder {
  color: var(--sc-color-purple-950);
}

.placeholder-purple-950-dark::-moz-placeholder {
  color: var(--sc-color-purple-950-dark);
}

.placeholder-purple-950-dark::placeholder {
  color: var(--sc-color-purple-950-dark);
}

.placeholder-red-100::-moz-placeholder {
  color: var(--sc-color-red-100);
}

.placeholder-red-100::placeholder {
  color: var(--sc-color-red-100);
}

.placeholder-red-100-dark::-moz-placeholder {
  color: var(--sc-color-red-100-dark);
}

.placeholder-red-100-dark::placeholder {
  color: var(--sc-color-red-100-dark);
}

.placeholder-red-150::-moz-placeholder {
  color: var(--sc-color-red-150);
}

.placeholder-red-150::placeholder {
  color: var(--sc-color-red-150);
}

.placeholder-red-150-dark::-moz-placeholder {
  color: var(--sc-color-red-150-dark);
}

.placeholder-red-150-dark::placeholder {
  color: var(--sc-color-red-150-dark);
}

.placeholder-red-200::-moz-placeholder {
  color: var(--sc-color-red-200);
}

.placeholder-red-200::placeholder {
  color: var(--sc-color-red-200);
}

.placeholder-red-200-dark::-moz-placeholder {
  color: var(--sc-color-red-200-dark);
}

.placeholder-red-200-dark::placeholder {
  color: var(--sc-color-red-200-dark);
}

.placeholder-red-250::-moz-placeholder {
  color: var(--sc-color-red-250);
}

.placeholder-red-250::placeholder {
  color: var(--sc-color-red-250);
}

.placeholder-red-250-dark::-moz-placeholder {
  color: var(--sc-color-red-250-dark);
}

.placeholder-red-250-dark::placeholder {
  color: var(--sc-color-red-250-dark);
}

.placeholder-red-300::-moz-placeholder {
  color: var(--sc-color-red-300);
}

.placeholder-red-300::placeholder {
  color: var(--sc-color-red-300);
}

.placeholder-red-300-dark::-moz-placeholder {
  color: var(--sc-color-red-300-dark);
}

.placeholder-red-300-dark::placeholder {
  color: var(--sc-color-red-300-dark);
}

.placeholder-red-350::-moz-placeholder {
  color: var(--sc-color-red-350);
}

.placeholder-red-350::placeholder {
  color: var(--sc-color-red-350);
}

.placeholder-red-350-dark::-moz-placeholder {
  color: var(--sc-color-red-350-dark);
}

.placeholder-red-350-dark::placeholder {
  color: var(--sc-color-red-350-dark);
}

.placeholder-red-400::-moz-placeholder {
  color: var(--sc-color-red-400);
}

.placeholder-red-400::placeholder {
  color: var(--sc-color-red-400);
}

.placeholder-red-400-dark::-moz-placeholder {
  color: var(--sc-color-red-400-dark);
}

.placeholder-red-400-dark::placeholder {
  color: var(--sc-color-red-400-dark);
}

.placeholder-red-450::-moz-placeholder {
  color: var(--sc-color-red-450);
}

.placeholder-red-450::placeholder {
  color: var(--sc-color-red-450);
}

.placeholder-red-450-dark::-moz-placeholder {
  color: var(--sc-color-red-450-dark);
}

.placeholder-red-450-dark::placeholder {
  color: var(--sc-color-red-450-dark);
}

.placeholder-red-50::-moz-placeholder {
  color: var(--sc-color-red-50);
}

.placeholder-red-50::placeholder {
  color: var(--sc-color-red-50);
}

.placeholder-red-50-dark::-moz-placeholder {
  color: var(--sc-color-red-50-dark);
}

.placeholder-red-50-dark::placeholder {
  color: var(--sc-color-red-50-dark);
}

.placeholder-red-500::-moz-placeholder {
  color: var(--sc-color-red-500);
}

.placeholder-red-500::placeholder {
  color: var(--sc-color-red-500);
}

.placeholder-red-500-dark::-moz-placeholder {
  color: var(--sc-color-red-500-dark);
}

.placeholder-red-500-dark::placeholder {
  color: var(--sc-color-red-500-dark);
}

.placeholder-red-550::-moz-placeholder {
  color: var(--sc-color-red-550);
}

.placeholder-red-550::placeholder {
  color: var(--sc-color-red-550);
}

.placeholder-red-550-dark::-moz-placeholder {
  color: var(--sc-color-red-550-dark);
}

.placeholder-red-550-dark::placeholder {
  color: var(--sc-color-red-550-dark);
}

.placeholder-red-600::-moz-placeholder {
  color: var(--sc-color-red-600);
}

.placeholder-red-600::placeholder {
  color: var(--sc-color-red-600);
}

.placeholder-red-600-dark::-moz-placeholder {
  color: var(--sc-color-red-600-dark);
}

.placeholder-red-600-dark::placeholder {
  color: var(--sc-color-red-600-dark);
}

.placeholder-red-650::-moz-placeholder {
  color: var(--sc-color-red-650);
}

.placeholder-red-650::placeholder {
  color: var(--sc-color-red-650);
}

.placeholder-red-650-dark::-moz-placeholder {
  color: var(--sc-color-red-650-dark);
}

.placeholder-red-650-dark::placeholder {
  color: var(--sc-color-red-650-dark);
}

.placeholder-red-700::-moz-placeholder {
  color: var(--sc-color-red-700);
}

.placeholder-red-700::placeholder {
  color: var(--sc-color-red-700);
}

.placeholder-red-700-dark::-moz-placeholder {
  color: var(--sc-color-red-700-dark);
}

.placeholder-red-700-dark::placeholder {
  color: var(--sc-color-red-700-dark);
}

.placeholder-red-750::-moz-placeholder {
  color: var(--sc-color-red-750);
}

.placeholder-red-750::placeholder {
  color: var(--sc-color-red-750);
}

.placeholder-red-750-dark::-moz-placeholder {
  color: var(--sc-color-red-750-dark);
}

.placeholder-red-750-dark::placeholder {
  color: var(--sc-color-red-750-dark);
}

.placeholder-red-800::-moz-placeholder {
  color: var(--sc-color-red-800);
}

.placeholder-red-800::placeholder {
  color: var(--sc-color-red-800);
}

.placeholder-red-800-dark::-moz-placeholder {
  color: var(--sc-color-red-800-dark);
}

.placeholder-red-800-dark::placeholder {
  color: var(--sc-color-red-800-dark);
}

.placeholder-red-850::-moz-placeholder {
  color: var(--sc-color-red-850);
}

.placeholder-red-850::placeholder {
  color: var(--sc-color-red-850);
}

.placeholder-red-850-dark::-moz-placeholder {
  color: var(--sc-color-red-850-dark);
}

.placeholder-red-850-dark::placeholder {
  color: var(--sc-color-red-850-dark);
}

.placeholder-red-900::-moz-placeholder {
  color: var(--sc-color-red-900);
}

.placeholder-red-900::placeholder {
  color: var(--sc-color-red-900);
}

.placeholder-red-900-dark::-moz-placeholder {
  color: var(--sc-color-red-900-dark);
}

.placeholder-red-900-dark::placeholder {
  color: var(--sc-color-red-900-dark);
}

.placeholder-red-950::-moz-placeholder {
  color: var(--sc-color-red-950);
}

.placeholder-red-950::placeholder {
  color: var(--sc-color-red-950);
}

.placeholder-red-950-dark::-moz-placeholder {
  color: var(--sc-color-red-950-dark);
}

.placeholder-red-950-dark::placeholder {
  color: var(--sc-color-red-950-dark);
}

.placeholder-teal-100::-moz-placeholder {
  color: var(--sc-color-teal-100);
}

.placeholder-teal-100::placeholder {
  color: var(--sc-color-teal-100);
}

.placeholder-teal-500::-moz-placeholder {
  color: var(--sc-color-teal-500);
}

.placeholder-teal-500::placeholder {
  color: var(--sc-color-teal-500);
}

.placeholder-transparent::-moz-placeholder {
  color: transparent;
}

.placeholder-transparent::placeholder {
  color: transparent;
}

.placeholder-transparent\/0::-moz-placeholder {
  color: rgb(0 0 0 / 0);
}

.placeholder-transparent\/0::placeholder {
  color: rgb(0 0 0 / 0);
}

.placeholder-transparent\/10::-moz-placeholder {
  color: rgb(0 0 0 / 0.1);
}

.placeholder-transparent\/10::placeholder {
  color: rgb(0 0 0 / 0.1);
}

.placeholder-transparent\/100::-moz-placeholder {
  color: rgb(0 0 0 / 1);
}

.placeholder-transparent\/100::placeholder {
  color: rgb(0 0 0 / 1);
}

.placeholder-transparent\/15::-moz-placeholder {
  color: rgb(0 0 0 / 0.15);
}

.placeholder-transparent\/15::placeholder {
  color: rgb(0 0 0 / 0.15);
}

.placeholder-transparent\/20::-moz-placeholder {
  color: rgb(0 0 0 / 0.2);
}

.placeholder-transparent\/20::placeholder {
  color: rgb(0 0 0 / 0.2);
}

.placeholder-transparent\/25::-moz-placeholder {
  color: rgb(0 0 0 / 0.25);
}

.placeholder-transparent\/25::placeholder {
  color: rgb(0 0 0 / 0.25);
}

.placeholder-transparent\/30::-moz-placeholder {
  color: rgb(0 0 0 / 0.3);
}

.placeholder-transparent\/30::placeholder {
  color: rgb(0 0 0 / 0.3);
}

.placeholder-transparent\/35::-moz-placeholder {
  color: rgb(0 0 0 / 0.35);
}

.placeholder-transparent\/35::placeholder {
  color: rgb(0 0 0 / 0.35);
}

.placeholder-transparent\/40::-moz-placeholder {
  color: rgb(0 0 0 / 0.4);
}

.placeholder-transparent\/40::placeholder {
  color: rgb(0 0 0 / 0.4);
}

.placeholder-transparent\/45::-moz-placeholder {
  color: rgb(0 0 0 / 0.45);
}

.placeholder-transparent\/45::placeholder {
  color: rgb(0 0 0 / 0.45);
}

.placeholder-transparent\/5::-moz-placeholder {
  color: rgb(0 0 0 / 0.05);
}

.placeholder-transparent\/5::placeholder {
  color: rgb(0 0 0 / 0.05);
}

.placeholder-transparent\/50::-moz-placeholder {
  color: rgb(0 0 0 / 0.5);
}

.placeholder-transparent\/50::placeholder {
  color: rgb(0 0 0 / 0.5);
}

.placeholder-transparent\/55::-moz-placeholder {
  color: rgb(0 0 0 / 0.55);
}

.placeholder-transparent\/55::placeholder {
  color: rgb(0 0 0 / 0.55);
}

.placeholder-transparent\/60::-moz-placeholder {
  color: rgb(0 0 0 / 0.6);
}

.placeholder-transparent\/60::placeholder {
  color: rgb(0 0 0 / 0.6);
}

.placeholder-transparent\/65::-moz-placeholder {
  color: rgb(0 0 0 / 0.65);
}

.placeholder-transparent\/65::placeholder {
  color: rgb(0 0 0 / 0.65);
}

.placeholder-transparent\/70::-moz-placeholder {
  color: rgb(0 0 0 / 0.7);
}

.placeholder-transparent\/70::placeholder {
  color: rgb(0 0 0 / 0.7);
}

.placeholder-transparent\/75::-moz-placeholder {
  color: rgb(0 0 0 / 0.75);
}

.placeholder-transparent\/75::placeholder {
  color: rgb(0 0 0 / 0.75);
}

.placeholder-transparent\/80::-moz-placeholder {
  color: rgb(0 0 0 / 0.8);
}

.placeholder-transparent\/80::placeholder {
  color: rgb(0 0 0 / 0.8);
}

.placeholder-transparent\/85::-moz-placeholder {
  color: rgb(0 0 0 / 0.85);
}

.placeholder-transparent\/85::placeholder {
  color: rgb(0 0 0 / 0.85);
}

.placeholder-transparent\/90::-moz-placeholder {
  color: rgb(0 0 0 / 0.9);
}

.placeholder-transparent\/90::placeholder {
  color: rgb(0 0 0 / 0.9);
}

.placeholder-transparent\/95::-moz-placeholder {
  color: rgb(0 0 0 / 0.95);
}

.placeholder-transparent\/95::placeholder {
  color: rgb(0 0 0 / 0.95);
}

.placeholder-white::-moz-placeholder {
  color: var(--sc-color-white);
}

.placeholder-white::placeholder {
  color: var(--sc-color-white);
}

.placeholder-opacity-0::-moz-placeholder {
  --tw-placeholder-opacity: 0;
}

.placeholder-opacity-0::placeholder {
  --tw-placeholder-opacity: 0;
}

.placeholder-opacity-10::-moz-placeholder {
  --tw-placeholder-opacity: 0.1;
}

.placeholder-opacity-10::placeholder {
  --tw-placeholder-opacity: 0.1;
}

.placeholder-opacity-100::-moz-placeholder {
  --tw-placeholder-opacity: 1;
}

.placeholder-opacity-100::placeholder {
  --tw-placeholder-opacity: 1;
}

.placeholder-opacity-15::-moz-placeholder {
  --tw-placeholder-opacity: 0.15;
}

.placeholder-opacity-15::placeholder {
  --tw-placeholder-opacity: 0.15;
}

.placeholder-opacity-20::-moz-placeholder {
  --tw-placeholder-opacity: 0.2;
}

.placeholder-opacity-20::placeholder {
  --tw-placeholder-opacity: 0.2;
}

.placeholder-opacity-25::-moz-placeholder {
  --tw-placeholder-opacity: 0.25;
}

.placeholder-opacity-25::placeholder {
  --tw-placeholder-opacity: 0.25;
}

.placeholder-opacity-30::-moz-placeholder {
  --tw-placeholder-opacity: 0.3;
}

.placeholder-opacity-30::placeholder {
  --tw-placeholder-opacity: 0.3;
}

.placeholder-opacity-35::-moz-placeholder {
  --tw-placeholder-opacity: 0.35;
}

.placeholder-opacity-35::placeholder {
  --tw-placeholder-opacity: 0.35;
}

.placeholder-opacity-40::-moz-placeholder {
  --tw-placeholder-opacity: 0.4;
}

.placeholder-opacity-40::placeholder {
  --tw-placeholder-opacity: 0.4;
}

.placeholder-opacity-45::-moz-placeholder {
  --tw-placeholder-opacity: 0.45;
}

.placeholder-opacity-45::placeholder {
  --tw-placeholder-opacity: 0.45;
}

.placeholder-opacity-5::-moz-placeholder {
  --tw-placeholder-opacity: 0.05;
}

.placeholder-opacity-5::placeholder {
  --tw-placeholder-opacity: 0.05;
}

.placeholder-opacity-50::-moz-placeholder {
  --tw-placeholder-opacity: 0.5;
}

.placeholder-opacity-50::placeholder {
  --tw-placeholder-opacity: 0.5;
}

.placeholder-opacity-55::-moz-placeholder {
  --tw-placeholder-opacity: 0.55;
}

.placeholder-opacity-55::placeholder {
  --tw-placeholder-opacity: 0.55;
}

.placeholder-opacity-60::-moz-placeholder {
  --tw-placeholder-opacity: 0.6;
}

.placeholder-opacity-60::placeholder {
  --tw-placeholder-opacity: 0.6;
}

.placeholder-opacity-65::-moz-placeholder {
  --tw-placeholder-opacity: 0.65;
}

.placeholder-opacity-65::placeholder {
  --tw-placeholder-opacity: 0.65;
}

.placeholder-opacity-70::-moz-placeholder {
  --tw-placeholder-opacity: 0.7;
}

.placeholder-opacity-70::placeholder {
  --tw-placeholder-opacity: 0.7;
}

.placeholder-opacity-75::-moz-placeholder {
  --tw-placeholder-opacity: 0.75;
}

.placeholder-opacity-75::placeholder {
  --tw-placeholder-opacity: 0.75;
}

.placeholder-opacity-80::-moz-placeholder {
  --tw-placeholder-opacity: 0.8;
}

.placeholder-opacity-80::placeholder {
  --tw-placeholder-opacity: 0.8;
}

.placeholder-opacity-85::-moz-placeholder {
  --tw-placeholder-opacity: 0.85;
}

.placeholder-opacity-85::placeholder {
  --tw-placeholder-opacity: 0.85;
}

.placeholder-opacity-90::-moz-placeholder {
  --tw-placeholder-opacity: 0.9;
}

.placeholder-opacity-90::placeholder {
  --tw-placeholder-opacity: 0.9;
}

.placeholder-opacity-95::-moz-placeholder {
  --tw-placeholder-opacity: 0.95;
}

.placeholder-opacity-95::placeholder {
  --tw-placeholder-opacity: 0.95;
}

.caret-amber-100 {
  caret-color: var(--sc-color-amber-100);
}

.caret-amber-100-dark {
  caret-color: var(--sc-color-amber-100-dark);
}

.caret-amber-150 {
  caret-color: var(--sc-color-amber-150);
}

.caret-amber-150-dark {
  caret-color: var(--sc-color-amber-150-dark);
}

.caret-amber-200 {
  caret-color: var(--sc-color-amber-200);
}

.caret-amber-200-dark {
  caret-color: var(--sc-color-amber-200-dark);
}

.caret-amber-250 {
  caret-color: var(--sc-color-amber-250);
}

.caret-amber-250-dark {
  caret-color: var(--sc-color-amber-250-dark);
}

.caret-amber-300 {
  caret-color: var(--sc-color-amber-300);
}

.caret-amber-300-dark {
  caret-color: var(--sc-color-amber-300-dark);
}

.caret-amber-350 {
  caret-color: var(--sc-color-amber-350);
}

.caret-amber-350-dark {
  caret-color: var(--sc-color-amber-350-dark);
}

.caret-amber-400 {
  caret-color: var(--sc-color-amber-400);
}

.caret-amber-400-dark {
  caret-color: var(--sc-color-amber-400-dark);
}

.caret-amber-450 {
  caret-color: var(--sc-color-amber-450);
}

.caret-amber-450-dark {
  caret-color: var(--sc-color-amber-450-dark);
}

.caret-amber-50 {
  caret-color: var(--sc-color-amber-50);
}

.caret-amber-50-dark {
  caret-color: var(--sc-color-amber-50-dark);
}

.caret-amber-500 {
  caret-color: var(--sc-color-amber-500);
}

.caret-amber-500-dark {
  caret-color: var(--sc-color-amber-500-dark);
}

.caret-amber-550 {
  caret-color: var(--sc-color-amber-550);
}

.caret-amber-550-dark {
  caret-color: var(--sc-color-amber-550-dark);
}

.caret-amber-600 {
  caret-color: var(--sc-color-amber-600);
}

.caret-amber-600-dark {
  caret-color: var(--sc-color-amber-600-dark);
}

.caret-amber-650 {
  caret-color: var(--sc-color-amber-650);
}

.caret-amber-650-dark {
  caret-color: var(--sc-color-amber-650-dark);
}

.caret-amber-700 {
  caret-color: var(--sc-color-amber-700);
}

.caret-amber-700-dark {
  caret-color: var(--sc-color-amber-700-dark);
}

.caret-amber-750 {
  caret-color: var(--sc-color-amber-750);
}

.caret-amber-750-dark {
  caret-color: var(--sc-color-amber-750-dark);
}

.caret-amber-800 {
  caret-color: var(--sc-color-amber-800);
}

.caret-amber-800-dark {
  caret-color: var(--sc-color-amber-800-dark);
}

.caret-amber-850 {
  caret-color: var(--sc-color-amber-850);
}

.caret-amber-850-dark {
  caret-color: var(--sc-color-amber-850-dark);
}

.caret-amber-900 {
  caret-color: var(--sc-color-amber-900);
}

.caret-amber-900-dark {
  caret-color: var(--sc-color-amber-900-dark);
}

.caret-amber-950 {
  caret-color: var(--sc-color-amber-950);
}

.caret-amber-950-dark {
  caret-color: var(--sc-color-amber-950-dark);
}

.caret-blue-100 {
  caret-color: var(--sc-color-blue-100);
}

.caret-blue-100-dark {
  caret-color: var(--sc-color-blue-100-dark);
}

.caret-blue-150 {
  caret-color: var(--sc-color-blue-150);
}

.caret-blue-150-dark {
  caret-color: var(--sc-color-blue-150-dark);
}

.caret-blue-200 {
  caret-color: var(--sc-color-blue-200);
}

.caret-blue-200-dark {
  caret-color: var(--sc-color-blue-200-dark);
}

.caret-blue-250 {
  caret-color: var(--sc-color-blue-250);
}

.caret-blue-250-dark {
  caret-color: var(--sc-color-blue-250-dark);
}

.caret-blue-300 {
  caret-color: var(--sc-color-blue-300);
}

.caret-blue-300-dark {
  caret-color: var(--sc-color-blue-300-dark);
}

.caret-blue-350 {
  caret-color: var(--sc-color-blue-350);
}

.caret-blue-350-dark {
  caret-color: var(--sc-color-blue-350-dark);
}

.caret-blue-400 {
  caret-color: var(--sc-color-blue-400);
}

.caret-blue-400-dark {
  caret-color: var(--sc-color-blue-400-dark);
}

.caret-blue-450 {
  caret-color: var(--sc-color-blue-450);
}

.caret-blue-450-dark {
  caret-color: var(--sc-color-blue-450-dark);
}

.caret-blue-50 {
  caret-color: var(--sc-color-blue-50);
}

.caret-blue-50-dark {
  caret-color: var(--sc-color-blue-50-dark);
}

.caret-blue-500 {
  caret-color: var(--sc-color-blue-500);
}

.caret-blue-500-dark {
  caret-color: var(--sc-color-blue-500-dark);
}

.caret-blue-550 {
  caret-color: var(--sc-color-blue-550);
}

.caret-blue-550-dark {
  caret-color: var(--sc-color-blue-550-dark);
}

.caret-blue-600 {
  caret-color: var(--sc-color-blue-600);
}

.caret-blue-600-dark {
  caret-color: var(--sc-color-blue-600-dark);
}

.caret-blue-650 {
  caret-color: var(--sc-color-blue-650);
}

.caret-blue-650-dark {
  caret-color: var(--sc-color-blue-650-dark);
}

.caret-blue-700 {
  caret-color: var(--sc-color-blue-700);
}

.caret-blue-700-dark {
  caret-color: var(--sc-color-blue-700-dark);
}

.caret-blue-750 {
  caret-color: var(--sc-color-blue-750);
}

.caret-blue-750-dark {
  caret-color: var(--sc-color-blue-750-dark);
}

.caret-blue-800 {
  caret-color: var(--sc-color-blue-800);
}

.caret-blue-800-dark {
  caret-color: var(--sc-color-blue-800-dark);
}

.caret-blue-850 {
  caret-color: var(--sc-color-blue-850);
}

.caret-blue-850-dark {
  caret-color: var(--sc-color-blue-850-dark);
}

.caret-blue-900 {
  caret-color: var(--sc-color-blue-900);
}

.caret-blue-900-dark {
  caret-color: var(--sc-color-blue-900-dark);
}

.caret-blue-950 {
  caret-color: var(--sc-color-blue-950);
}

.caret-blue-950-dark {
  caret-color: var(--sc-color-blue-950-dark);
}

.caret-current {
  caret-color: currentColor;
}

.caret-green-100 {
  caret-color: var(--sc-color-green-100);
}

.caret-green-100-dark {
  caret-color: var(--sc-color-green-100-dark);
}

.caret-green-150 {
  caret-color: var(--sc-color-green-150);
}

.caret-green-150-dark {
  caret-color: var(--sc-color-green-150-dark);
}

.caret-green-200 {
  caret-color: var(--sc-color-green-200);
}

.caret-green-200-dark {
  caret-color: var(--sc-color-green-200-dark);
}

.caret-green-250 {
  caret-color: var(--sc-color-green-250);
}

.caret-green-250-dark {
  caret-color: var(--sc-color-green-250-dark);
}

.caret-green-300 {
  caret-color: var(--sc-color-green-300);
}

.caret-green-300-dark {
  caret-color: var(--sc-color-green-300-dark);
}

.caret-green-350 {
  caret-color: var(--sc-color-green-350);
}

.caret-green-350-dark {
  caret-color: var(--sc-color-green-350-dark);
}

.caret-green-400 {
  caret-color: var(--sc-color-green-400);
}

.caret-green-400-dark {
  caret-color: var(--sc-color-green-400-dark);
}

.caret-green-450 {
  caret-color: var(--sc-color-green-450);
}

.caret-green-450-dark {
  caret-color: var(--sc-color-green-450-dark);
}

.caret-green-50 {
  caret-color: var(--sc-color-green-50);
}

.caret-green-50-dark {
  caret-color: var(--sc-color-green-50-dark);
}

.caret-green-500 {
  caret-color: var(--sc-color-green-500);
}

.caret-green-500-dark {
  caret-color: var(--sc-color-green-500-dark);
}

.caret-green-550 {
  caret-color: var(--sc-color-green-550);
}

.caret-green-550-dark {
  caret-color: var(--sc-color-green-550-dark);
}

.caret-green-600 {
  caret-color: var(--sc-color-green-600);
}

.caret-green-600-dark {
  caret-color: var(--sc-color-green-600-dark);
}

.caret-green-650 {
  caret-color: var(--sc-color-green-650);
}

.caret-green-650-dark {
  caret-color: var(--sc-color-green-650-dark);
}

.caret-green-700 {
  caret-color: var(--sc-color-green-700);
}

.caret-green-700-dark {
  caret-color: var(--sc-color-green-700-dark);
}

.caret-green-750 {
  caret-color: var(--sc-color-green-750);
}

.caret-green-750-dark {
  caret-color: var(--sc-color-green-750-dark);
}

.caret-green-800 {
  caret-color: var(--sc-color-green-800);
}

.caret-green-800-dark {
  caret-color: var(--sc-color-green-800-dark);
}

.caret-green-850 {
  caret-color: var(--sc-color-green-850);
}

.caret-green-850-dark {
  caret-color: var(--sc-color-green-850-dark);
}

.caret-green-900 {
  caret-color: var(--sc-color-green-900);
}

.caret-green-900-dark {
  caret-color: var(--sc-color-green-900-dark);
}

.caret-green-950 {
  caret-color: var(--sc-color-green-950);
}

.caret-green-950-dark {
  caret-color: var(--sc-color-green-950-dark);
}

.caret-grey-100 {
  caret-color: var(--sc-color-grey-100);
}

.caret-grey-100-dark {
  caret-color: var(--sc-color-grey-100-dark);
}

.caret-grey-150 {
  caret-color: var(--sc-color-grey-150);
}

.caret-grey-150-dark {
  caret-color: var(--sc-color-grey-150-dark);
}

.caret-grey-200 {
  caret-color: var(--sc-color-grey-200);
}

.caret-grey-200-dark {
  caret-color: var(--sc-color-grey-200-dark);
}

.caret-grey-250 {
  caret-color: var(--sc-color-grey-250);
}

.caret-grey-250-dark {
  caret-color: var(--sc-color-grey-250-dark);
}

.caret-grey-300 {
  caret-color: var(--sc-color-grey-300);
}

.caret-grey-300-dark {
  caret-color: var(--sc-color-grey-300-dark);
}

.caret-grey-350 {
  caret-color: var(--sc-color-grey-350);
}

.caret-grey-350-dark {
  caret-color: var(--sc-color-grey-350-dark);
}

.caret-grey-400 {
  caret-color: var(--sc-color-grey-400);
}

.caret-grey-400-dark {
  caret-color: var(--sc-color-grey-400-dark);
}

.caret-grey-450 {
  caret-color: var(--sc-color-grey-450);
}

.caret-grey-450-dark {
  caret-color: var(--sc-color-grey-450-dark);
}

.caret-grey-50 {
  caret-color: var(--sc-color-grey-50);
}

.caret-grey-50-dark {
  caret-color: var(--sc-color-grey-50-dark);
}

.caret-grey-500 {
  caret-color: var(--sc-color-grey-500);
}

.caret-grey-500-dark {
  caret-color: var(--sc-color-grey-500-dark);
}

.caret-grey-550 {
  caret-color: var(--sc-color-grey-550);
}

.caret-grey-550-dark {
  caret-color: var(--sc-color-grey-550-dark);
}

.caret-grey-600 {
  caret-color: var(--sc-color-grey-600);
}

.caret-grey-600-dark {
  caret-color: var(--sc-color-grey-600-dark);
}

.caret-grey-650 {
  caret-color: var(--sc-color-grey-650);
}

.caret-grey-650-dark {
  caret-color: var(--sc-color-grey-650-dark);
}

.caret-grey-700 {
  caret-color: var(--sc-color-grey-700);
}

.caret-grey-700-dark {
  caret-color: var(--sc-color-grey-700-dark);
}

.caret-grey-750 {
  caret-color: var(--sc-color-grey-750);
}

.caret-grey-750-dark {
  caret-color: var(--sc-color-grey-750-dark);
}

.caret-grey-800 {
  caret-color: var(--sc-color-grey-800);
}

.caret-grey-800-dark {
  caret-color: var(--sc-color-grey-800-dark);
}

.caret-grey-850 {
  caret-color: var(--sc-color-grey-850);
}

.caret-grey-850-dark {
  caret-color: var(--sc-color-grey-850-dark);
}

.caret-grey-900 {
  caret-color: var(--sc-color-grey-900);
}

.caret-grey-900-dark {
  caret-color: var(--sc-color-grey-900-dark);
}

.caret-grey-950 {
  caret-color: var(--sc-color-grey-950);
}

.caret-grey-950-dark {
  caret-color: var(--sc-color-grey-950-dark);
}

.caret-grey-black {
  caret-color: var(--sc-color-black);
}

.caret-muted {
  caret-color: var(--sc-color-blue-900);
}

.caret-orange-500 {
  caret-color: var(--sc-color-orange-500);
}

.caret-primary {
  caret-color: var(--sc-color-blue);
}

.caret-purple-100 {
  caret-color: var(--sc-color-purple-100);
}

.caret-purple-100-dark {
  caret-color: var(--sc-color-purple-100-dark);
}

.caret-purple-150 {
  caret-color: var(--sc-color-purple-150);
}

.caret-purple-150-dark {
  caret-color: var(--sc-color-purple-150-dark);
}

.caret-purple-200 {
  caret-color: var(--sc-color-purple-200);
}

.caret-purple-200-dark {
  caret-color: var(--sc-color-purple-200-dark);
}

.caret-purple-250 {
  caret-color: var(--sc-color-purple-250);
}

.caret-purple-250-dark {
  caret-color: var(--sc-color-purple-250-dark);
}

.caret-purple-300 {
  caret-color: var(--sc-color-purple-300);
}

.caret-purple-300-dark {
  caret-color: var(--sc-color-purple-300-dark);
}

.caret-purple-350 {
  caret-color: var(--sc-color-purple-350);
}

.caret-purple-350-dark {
  caret-color: var(--sc-color-purple-350-dark);
}

.caret-purple-400 {
  caret-color: var(--sc-color-purple-400);
}

.caret-purple-400-dark {
  caret-color: var(--sc-color-purple-400-dark);
}

.caret-purple-450 {
  caret-color: var(--sc-color-purple-450);
}

.caret-purple-450-dark {
  caret-color: var(--sc-color-purple-450-dark);
}

.caret-purple-50 {
  caret-color: var(--sc-color-purple-50);
}

.caret-purple-50-dark {
  caret-color: var(--sc-color-purple-50-dark);
}

.caret-purple-500 {
  caret-color: var(--sc-color-purple-500);
}

.caret-purple-500-dark {
  caret-color: var(--sc-color-purple-500-dark);
}

.caret-purple-550 {
  caret-color: var(--sc-color-purple-550);
}

.caret-purple-550-dark {
  caret-color: var(--sc-color-purple-550-dark);
}

.caret-purple-600 {
  caret-color: var(--sc-color-purple-600);
}

.caret-purple-600-dark {
  caret-color: var(--sc-color-purple-600-dark);
}

.caret-purple-650 {
  caret-color: var(--sc-color-purple-650);
}

.caret-purple-650-dark {
  caret-color: var(--sc-color-purple-650-dark);
}

.caret-purple-700 {
  caret-color: var(--sc-color-purple-700);
}

.caret-purple-700-dark {
  caret-color: var(--sc-color-purple-700-dark);
}

.caret-purple-750 {
  caret-color: var(--sc-color-purple-750);
}

.caret-purple-750-dark {
  caret-color: var(--sc-color-purple-750-dark);
}

.caret-purple-800 {
  caret-color: var(--sc-color-purple-800);
}

.caret-purple-800-dark {
  caret-color: var(--sc-color-purple-800-dark);
}

.caret-purple-850 {
  caret-color: var(--sc-color-purple-850);
}

.caret-purple-850-dark {
  caret-color: var(--sc-color-purple-850-dark);
}

.caret-purple-900 {
  caret-color: var(--sc-color-purple-900);
}

.caret-purple-900-dark {
  caret-color: var(--sc-color-purple-900-dark);
}

.caret-purple-950 {
  caret-color: var(--sc-color-purple-950);
}

.caret-purple-950-dark {
  caret-color: var(--sc-color-purple-950-dark);
}

.caret-red-100 {
  caret-color: var(--sc-color-red-100);
}

.caret-red-100-dark {
  caret-color: var(--sc-color-red-100-dark);
}

.caret-red-150 {
  caret-color: var(--sc-color-red-150);
}

.caret-red-150-dark {
  caret-color: var(--sc-color-red-150-dark);
}

.caret-red-200 {
  caret-color: var(--sc-color-red-200);
}

.caret-red-200-dark {
  caret-color: var(--sc-color-red-200-dark);
}

.caret-red-250 {
  caret-color: var(--sc-color-red-250);
}

.caret-red-250-dark {
  caret-color: var(--sc-color-red-250-dark);
}

.caret-red-300 {
  caret-color: var(--sc-color-red-300);
}

.caret-red-300-dark {
  caret-color: var(--sc-color-red-300-dark);
}

.caret-red-350 {
  caret-color: var(--sc-color-red-350);
}

.caret-red-350-dark {
  caret-color: var(--sc-color-red-350-dark);
}

.caret-red-400 {
  caret-color: var(--sc-color-red-400);
}

.caret-red-400-dark {
  caret-color: var(--sc-color-red-400-dark);
}

.caret-red-450 {
  caret-color: var(--sc-color-red-450);
}

.caret-red-450-dark {
  caret-color: var(--sc-color-red-450-dark);
}

.caret-red-50 {
  caret-color: var(--sc-color-red-50);
}

.caret-red-50-dark {
  caret-color: var(--sc-color-red-50-dark);
}

.caret-red-500 {
  caret-color: var(--sc-color-red-500);
}

.caret-red-500-dark {
  caret-color: var(--sc-color-red-500-dark);
}

.caret-red-550 {
  caret-color: var(--sc-color-red-550);
}

.caret-red-550-dark {
  caret-color: var(--sc-color-red-550-dark);
}

.caret-red-600 {
  caret-color: var(--sc-color-red-600);
}

.caret-red-600-dark {
  caret-color: var(--sc-color-red-600-dark);
}

.caret-red-650 {
  caret-color: var(--sc-color-red-650);
}

.caret-red-650-dark {
  caret-color: var(--sc-color-red-650-dark);
}

.caret-red-700 {
  caret-color: var(--sc-color-red-700);
}

.caret-red-700-dark {
  caret-color: var(--sc-color-red-700-dark);
}

.caret-red-750 {
  caret-color: var(--sc-color-red-750);
}

.caret-red-750-dark {
  caret-color: var(--sc-color-red-750-dark);
}

.caret-red-800 {
  caret-color: var(--sc-color-red-800);
}

.caret-red-800-dark {
  caret-color: var(--sc-color-red-800-dark);
}

.caret-red-850 {
  caret-color: var(--sc-color-red-850);
}

.caret-red-850-dark {
  caret-color: var(--sc-color-red-850-dark);
}

.caret-red-900 {
  caret-color: var(--sc-color-red-900);
}

.caret-red-900-dark {
  caret-color: var(--sc-color-red-900-dark);
}

.caret-red-950 {
  caret-color: var(--sc-color-red-950);
}

.caret-red-950-dark {
  caret-color: var(--sc-color-red-950-dark);
}

.caret-teal-100 {
  caret-color: var(--sc-color-teal-100);
}

.caret-teal-500 {
  caret-color: var(--sc-color-teal-500);
}

.caret-transparent {
  caret-color: transparent;
}

.caret-transparent\/0 {
  caret-color: rgb(0 0 0 / 0);
}

.caret-transparent\/10 {
  caret-color: rgb(0 0 0 / 0.1);
}

.caret-transparent\/100 {
  caret-color: rgb(0 0 0 / 1);
}

.caret-transparent\/15 {
  caret-color: rgb(0 0 0 / 0.15);
}

.caret-transparent\/20 {
  caret-color: rgb(0 0 0 / 0.2);
}

.caret-transparent\/25 {
  caret-color: rgb(0 0 0 / 0.25);
}

.caret-transparent\/30 {
  caret-color: rgb(0 0 0 / 0.3);
}

.caret-transparent\/35 {
  caret-color: rgb(0 0 0 / 0.35);
}

.caret-transparent\/40 {
  caret-color: rgb(0 0 0 / 0.4);
}

.caret-transparent\/45 {
  caret-color: rgb(0 0 0 / 0.45);
}

.caret-transparent\/5 {
  caret-color: rgb(0 0 0 / 0.05);
}

.caret-transparent\/50 {
  caret-color: rgb(0 0 0 / 0.5);
}

.caret-transparent\/55 {
  caret-color: rgb(0 0 0 / 0.55);
}

.caret-transparent\/60 {
  caret-color: rgb(0 0 0 / 0.6);
}

.caret-transparent\/65 {
  caret-color: rgb(0 0 0 / 0.65);
}

.caret-transparent\/70 {
  caret-color: rgb(0 0 0 / 0.7);
}

.caret-transparent\/75 {
  caret-color: rgb(0 0 0 / 0.75);
}

.caret-transparent\/80 {
  caret-color: rgb(0 0 0 / 0.8);
}

.caret-transparent\/85 {
  caret-color: rgb(0 0 0 / 0.85);
}

.caret-transparent\/90 {
  caret-color: rgb(0 0 0 / 0.9);
}

.caret-transparent\/95 {
  caret-color: rgb(0 0 0 / 0.95);
}

.caret-white {
  caret-color: var(--sc-color-white);
}

.accent-amber-100 {
  accent-color: var(--sc-color-amber-100);
}

.accent-amber-100-dark {
  accent-color: var(--sc-color-amber-100-dark);
}

.accent-amber-150 {
  accent-color: var(--sc-color-amber-150);
}

.accent-amber-150-dark {
  accent-color: var(--sc-color-amber-150-dark);
}

.accent-amber-200 {
  accent-color: var(--sc-color-amber-200);
}

.accent-amber-200-dark {
  accent-color: var(--sc-color-amber-200-dark);
}

.accent-amber-250 {
  accent-color: var(--sc-color-amber-250);
}

.accent-amber-250-dark {
  accent-color: var(--sc-color-amber-250-dark);
}

.accent-amber-300 {
  accent-color: var(--sc-color-amber-300);
}

.accent-amber-300-dark {
  accent-color: var(--sc-color-amber-300-dark);
}

.accent-amber-350 {
  accent-color: var(--sc-color-amber-350);
}

.accent-amber-350-dark {
  accent-color: var(--sc-color-amber-350-dark);
}

.accent-amber-400 {
  accent-color: var(--sc-color-amber-400);
}

.accent-amber-400-dark {
  accent-color: var(--sc-color-amber-400-dark);
}

.accent-amber-450 {
  accent-color: var(--sc-color-amber-450);
}

.accent-amber-450-dark {
  accent-color: var(--sc-color-amber-450-dark);
}

.accent-amber-50 {
  accent-color: var(--sc-color-amber-50);
}

.accent-amber-50-dark {
  accent-color: var(--sc-color-amber-50-dark);
}

.accent-amber-500 {
  accent-color: var(--sc-color-amber-500);
}

.accent-amber-500-dark {
  accent-color: var(--sc-color-amber-500-dark);
}

.accent-amber-550 {
  accent-color: var(--sc-color-amber-550);
}

.accent-amber-550-dark {
  accent-color: var(--sc-color-amber-550-dark);
}

.accent-amber-600 {
  accent-color: var(--sc-color-amber-600);
}

.accent-amber-600-dark {
  accent-color: var(--sc-color-amber-600-dark);
}

.accent-amber-650 {
  accent-color: var(--sc-color-amber-650);
}

.accent-amber-650-dark {
  accent-color: var(--sc-color-amber-650-dark);
}

.accent-amber-700 {
  accent-color: var(--sc-color-amber-700);
}

.accent-amber-700-dark {
  accent-color: var(--sc-color-amber-700-dark);
}

.accent-amber-750 {
  accent-color: var(--sc-color-amber-750);
}

.accent-amber-750-dark {
  accent-color: var(--sc-color-amber-750-dark);
}

.accent-amber-800 {
  accent-color: var(--sc-color-amber-800);
}

.accent-amber-800-dark {
  accent-color: var(--sc-color-amber-800-dark);
}

.accent-amber-850 {
  accent-color: var(--sc-color-amber-850);
}

.accent-amber-850-dark {
  accent-color: var(--sc-color-amber-850-dark);
}

.accent-amber-900 {
  accent-color: var(--sc-color-amber-900);
}

.accent-amber-900-dark {
  accent-color: var(--sc-color-amber-900-dark);
}

.accent-amber-950 {
  accent-color: var(--sc-color-amber-950);
}

.accent-amber-950-dark {
  accent-color: var(--sc-color-amber-950-dark);
}

.accent-auto {
  accent-color: auto;
}

.accent-blue-100 {
  accent-color: var(--sc-color-blue-100);
}

.accent-blue-100-dark {
  accent-color: var(--sc-color-blue-100-dark);
}

.accent-blue-150 {
  accent-color: var(--sc-color-blue-150);
}

.accent-blue-150-dark {
  accent-color: var(--sc-color-blue-150-dark);
}

.accent-blue-200 {
  accent-color: var(--sc-color-blue-200);
}

.accent-blue-200-dark {
  accent-color: var(--sc-color-blue-200-dark);
}

.accent-blue-250 {
  accent-color: var(--sc-color-blue-250);
}

.accent-blue-250-dark {
  accent-color: var(--sc-color-blue-250-dark);
}

.accent-blue-300 {
  accent-color: var(--sc-color-blue-300);
}

.accent-blue-300-dark {
  accent-color: var(--sc-color-blue-300-dark);
}

.accent-blue-350 {
  accent-color: var(--sc-color-blue-350);
}

.accent-blue-350-dark {
  accent-color: var(--sc-color-blue-350-dark);
}

.accent-blue-400 {
  accent-color: var(--sc-color-blue-400);
}

.accent-blue-400-dark {
  accent-color: var(--sc-color-blue-400-dark);
}

.accent-blue-450 {
  accent-color: var(--sc-color-blue-450);
}

.accent-blue-450-dark {
  accent-color: var(--sc-color-blue-450-dark);
}

.accent-blue-50 {
  accent-color: var(--sc-color-blue-50);
}

.accent-blue-50-dark {
  accent-color: var(--sc-color-blue-50-dark);
}

.accent-blue-500 {
  accent-color: var(--sc-color-blue-500);
}

.accent-blue-500-dark {
  accent-color: var(--sc-color-blue-500-dark);
}

.accent-blue-550 {
  accent-color: var(--sc-color-blue-550);
}

.accent-blue-550-dark {
  accent-color: var(--sc-color-blue-550-dark);
}

.accent-blue-600 {
  accent-color: var(--sc-color-blue-600);
}

.accent-blue-600-dark {
  accent-color: var(--sc-color-blue-600-dark);
}

.accent-blue-650 {
  accent-color: var(--sc-color-blue-650);
}

.accent-blue-650-dark {
  accent-color: var(--sc-color-blue-650-dark);
}

.accent-blue-700 {
  accent-color: var(--sc-color-blue-700);
}

.accent-blue-700-dark {
  accent-color: var(--sc-color-blue-700-dark);
}

.accent-blue-750 {
  accent-color: var(--sc-color-blue-750);
}

.accent-blue-750-dark {
  accent-color: var(--sc-color-blue-750-dark);
}

.accent-blue-800 {
  accent-color: var(--sc-color-blue-800);
}

.accent-blue-800-dark {
  accent-color: var(--sc-color-blue-800-dark);
}

.accent-blue-850 {
  accent-color: var(--sc-color-blue-850);
}

.accent-blue-850-dark {
  accent-color: var(--sc-color-blue-850-dark);
}

.accent-blue-900 {
  accent-color: var(--sc-color-blue-900);
}

.accent-blue-900-dark {
  accent-color: var(--sc-color-blue-900-dark);
}

.accent-blue-950 {
  accent-color: var(--sc-color-blue-950);
}

.accent-blue-950-dark {
  accent-color: var(--sc-color-blue-950-dark);
}

.accent-current {
  accent-color: currentColor;
}

.accent-green-100 {
  accent-color: var(--sc-color-green-100);
}

.accent-green-100-dark {
  accent-color: var(--sc-color-green-100-dark);
}

.accent-green-150 {
  accent-color: var(--sc-color-green-150);
}

.accent-green-150-dark {
  accent-color: var(--sc-color-green-150-dark);
}

.accent-green-200 {
  accent-color: var(--sc-color-green-200);
}

.accent-green-200-dark {
  accent-color: var(--sc-color-green-200-dark);
}

.accent-green-250 {
  accent-color: var(--sc-color-green-250);
}

.accent-green-250-dark {
  accent-color: var(--sc-color-green-250-dark);
}

.accent-green-300 {
  accent-color: var(--sc-color-green-300);
}

.accent-green-300-dark {
  accent-color: var(--sc-color-green-300-dark);
}

.accent-green-350 {
  accent-color: var(--sc-color-green-350);
}

.accent-green-350-dark {
  accent-color: var(--sc-color-green-350-dark);
}

.accent-green-400 {
  accent-color: var(--sc-color-green-400);
}

.accent-green-400-dark {
  accent-color: var(--sc-color-green-400-dark);
}

.accent-green-450 {
  accent-color: var(--sc-color-green-450);
}

.accent-green-450-dark {
  accent-color: var(--sc-color-green-450-dark);
}

.accent-green-50 {
  accent-color: var(--sc-color-green-50);
}

.accent-green-50-dark {
  accent-color: var(--sc-color-green-50-dark);
}

.accent-green-500 {
  accent-color: var(--sc-color-green-500);
}

.accent-green-500-dark {
  accent-color: var(--sc-color-green-500-dark);
}

.accent-green-550 {
  accent-color: var(--sc-color-green-550);
}

.accent-green-550-dark {
  accent-color: var(--sc-color-green-550-dark);
}

.accent-green-600 {
  accent-color: var(--sc-color-green-600);
}

.accent-green-600-dark {
  accent-color: var(--sc-color-green-600-dark);
}

.accent-green-650 {
  accent-color: var(--sc-color-green-650);
}

.accent-green-650-dark {
  accent-color: var(--sc-color-green-650-dark);
}

.accent-green-700 {
  accent-color: var(--sc-color-green-700);
}

.accent-green-700-dark {
  accent-color: var(--sc-color-green-700-dark);
}

.accent-green-750 {
  accent-color: var(--sc-color-green-750);
}

.accent-green-750-dark {
  accent-color: var(--sc-color-green-750-dark);
}

.accent-green-800 {
  accent-color: var(--sc-color-green-800);
}

.accent-green-800-dark {
  accent-color: var(--sc-color-green-800-dark);
}

.accent-green-850 {
  accent-color: var(--sc-color-green-850);
}

.accent-green-850-dark {
  accent-color: var(--sc-color-green-850-dark);
}

.accent-green-900 {
  accent-color: var(--sc-color-green-900);
}

.accent-green-900-dark {
  accent-color: var(--sc-color-green-900-dark);
}

.accent-green-950 {
  accent-color: var(--sc-color-green-950);
}

.accent-green-950-dark {
  accent-color: var(--sc-color-green-950-dark);
}

.accent-grey-100 {
  accent-color: var(--sc-color-grey-100);
}

.accent-grey-100-dark {
  accent-color: var(--sc-color-grey-100-dark);
}

.accent-grey-150 {
  accent-color: var(--sc-color-grey-150);
}

.accent-grey-150-dark {
  accent-color: var(--sc-color-grey-150-dark);
}

.accent-grey-200 {
  accent-color: var(--sc-color-grey-200);
}

.accent-grey-200-dark {
  accent-color: var(--sc-color-grey-200-dark);
}

.accent-grey-250 {
  accent-color: var(--sc-color-grey-250);
}

.accent-grey-250-dark {
  accent-color: var(--sc-color-grey-250-dark);
}

.accent-grey-300 {
  accent-color: var(--sc-color-grey-300);
}

.accent-grey-300-dark {
  accent-color: var(--sc-color-grey-300-dark);
}

.accent-grey-350 {
  accent-color: var(--sc-color-grey-350);
}

.accent-grey-350-dark {
  accent-color: var(--sc-color-grey-350-dark);
}

.accent-grey-400 {
  accent-color: var(--sc-color-grey-400);
}

.accent-grey-400-dark {
  accent-color: var(--sc-color-grey-400-dark);
}

.accent-grey-450 {
  accent-color: var(--sc-color-grey-450);
}

.accent-grey-450-dark {
  accent-color: var(--sc-color-grey-450-dark);
}

.accent-grey-50 {
  accent-color: var(--sc-color-grey-50);
}

.accent-grey-50-dark {
  accent-color: var(--sc-color-grey-50-dark);
}

.accent-grey-500 {
  accent-color: var(--sc-color-grey-500);
}

.accent-grey-500-dark {
  accent-color: var(--sc-color-grey-500-dark);
}

.accent-grey-550 {
  accent-color: var(--sc-color-grey-550);
}

.accent-grey-550-dark {
  accent-color: var(--sc-color-grey-550-dark);
}

.accent-grey-600 {
  accent-color: var(--sc-color-grey-600);
}

.accent-grey-600-dark {
  accent-color: var(--sc-color-grey-600-dark);
}

.accent-grey-650 {
  accent-color: var(--sc-color-grey-650);
}

.accent-grey-650-dark {
  accent-color: var(--sc-color-grey-650-dark);
}

.accent-grey-700 {
  accent-color: var(--sc-color-grey-700);
}

.accent-grey-700-dark {
  accent-color: var(--sc-color-grey-700-dark);
}

.accent-grey-750 {
  accent-color: var(--sc-color-grey-750);
}

.accent-grey-750-dark {
  accent-color: var(--sc-color-grey-750-dark);
}

.accent-grey-800 {
  accent-color: var(--sc-color-grey-800);
}

.accent-grey-800-dark {
  accent-color: var(--sc-color-grey-800-dark);
}

.accent-grey-850 {
  accent-color: var(--sc-color-grey-850);
}

.accent-grey-850-dark {
  accent-color: var(--sc-color-grey-850-dark);
}

.accent-grey-900 {
  accent-color: var(--sc-color-grey-900);
}

.accent-grey-900-dark {
  accent-color: var(--sc-color-grey-900-dark);
}

.accent-grey-950 {
  accent-color: var(--sc-color-grey-950);
}

.accent-grey-950-dark {
  accent-color: var(--sc-color-grey-950-dark);
}

.accent-grey-black {
  accent-color: var(--sc-color-black);
}

.accent-muted {
  accent-color: var(--sc-color-blue-900);
}

.accent-orange-500 {
  accent-color: var(--sc-color-orange-500);
}

.accent-primary {
  accent-color: var(--sc-color-blue);
}

.accent-purple-100 {
  accent-color: var(--sc-color-purple-100);
}

.accent-purple-100-dark {
  accent-color: var(--sc-color-purple-100-dark);
}

.accent-purple-150 {
  accent-color: var(--sc-color-purple-150);
}

.accent-purple-150-dark {
  accent-color: var(--sc-color-purple-150-dark);
}

.accent-purple-200 {
  accent-color: var(--sc-color-purple-200);
}

.accent-purple-200-dark {
  accent-color: var(--sc-color-purple-200-dark);
}

.accent-purple-250 {
  accent-color: var(--sc-color-purple-250);
}

.accent-purple-250-dark {
  accent-color: var(--sc-color-purple-250-dark);
}

.accent-purple-300 {
  accent-color: var(--sc-color-purple-300);
}

.accent-purple-300-dark {
  accent-color: var(--sc-color-purple-300-dark);
}

.accent-purple-350 {
  accent-color: var(--sc-color-purple-350);
}

.accent-purple-350-dark {
  accent-color: var(--sc-color-purple-350-dark);
}

.accent-purple-400 {
  accent-color: var(--sc-color-purple-400);
}

.accent-purple-400-dark {
  accent-color: var(--sc-color-purple-400-dark);
}

.accent-purple-450 {
  accent-color: var(--sc-color-purple-450);
}

.accent-purple-450-dark {
  accent-color: var(--sc-color-purple-450-dark);
}

.accent-purple-50 {
  accent-color: var(--sc-color-purple-50);
}

.accent-purple-50-dark {
  accent-color: var(--sc-color-purple-50-dark);
}

.accent-purple-500 {
  accent-color: var(--sc-color-purple-500);
}

.accent-purple-500-dark {
  accent-color: var(--sc-color-purple-500-dark);
}

.accent-purple-550 {
  accent-color: var(--sc-color-purple-550);
}

.accent-purple-550-dark {
  accent-color: var(--sc-color-purple-550-dark);
}

.accent-purple-600 {
  accent-color: var(--sc-color-purple-600);
}

.accent-purple-600-dark {
  accent-color: var(--sc-color-purple-600-dark);
}

.accent-purple-650 {
  accent-color: var(--sc-color-purple-650);
}

.accent-purple-650-dark {
  accent-color: var(--sc-color-purple-650-dark);
}

.accent-purple-700 {
  accent-color: var(--sc-color-purple-700);
}

.accent-purple-700-dark {
  accent-color: var(--sc-color-purple-700-dark);
}

.accent-purple-750 {
  accent-color: var(--sc-color-purple-750);
}

.accent-purple-750-dark {
  accent-color: var(--sc-color-purple-750-dark);
}

.accent-purple-800 {
  accent-color: var(--sc-color-purple-800);
}

.accent-purple-800-dark {
  accent-color: var(--sc-color-purple-800-dark);
}

.accent-purple-850 {
  accent-color: var(--sc-color-purple-850);
}

.accent-purple-850-dark {
  accent-color: var(--sc-color-purple-850-dark);
}

.accent-purple-900 {
  accent-color: var(--sc-color-purple-900);
}

.accent-purple-900-dark {
  accent-color: var(--sc-color-purple-900-dark);
}

.accent-purple-950 {
  accent-color: var(--sc-color-purple-950);
}

.accent-purple-950-dark {
  accent-color: var(--sc-color-purple-950-dark);
}

.accent-red-100 {
  accent-color: var(--sc-color-red-100);
}

.accent-red-100-dark {
  accent-color: var(--sc-color-red-100-dark);
}

.accent-red-150 {
  accent-color: var(--sc-color-red-150);
}

.accent-red-150-dark {
  accent-color: var(--sc-color-red-150-dark);
}

.accent-red-200 {
  accent-color: var(--sc-color-red-200);
}

.accent-red-200-dark {
  accent-color: var(--sc-color-red-200-dark);
}

.accent-red-250 {
  accent-color: var(--sc-color-red-250);
}

.accent-red-250-dark {
  accent-color: var(--sc-color-red-250-dark);
}

.accent-red-300 {
  accent-color: var(--sc-color-red-300);
}

.accent-red-300-dark {
  accent-color: var(--sc-color-red-300-dark);
}

.accent-red-350 {
  accent-color: var(--sc-color-red-350);
}

.accent-red-350-dark {
  accent-color: var(--sc-color-red-350-dark);
}

.accent-red-400 {
  accent-color: var(--sc-color-red-400);
}

.accent-red-400-dark {
  accent-color: var(--sc-color-red-400-dark);
}

.accent-red-450 {
  accent-color: var(--sc-color-red-450);
}

.accent-red-450-dark {
  accent-color: var(--sc-color-red-450-dark);
}

.accent-red-50 {
  accent-color: var(--sc-color-red-50);
}

.accent-red-50-dark {
  accent-color: var(--sc-color-red-50-dark);
}

.accent-red-500 {
  accent-color: var(--sc-color-red-500);
}

.accent-red-500-dark {
  accent-color: var(--sc-color-red-500-dark);
}

.accent-red-550 {
  accent-color: var(--sc-color-red-550);
}

.accent-red-550-dark {
  accent-color: var(--sc-color-red-550-dark);
}

.accent-red-600 {
  accent-color: var(--sc-color-red-600);
}

.accent-red-600-dark {
  accent-color: var(--sc-color-red-600-dark);
}

.accent-red-650 {
  accent-color: var(--sc-color-red-650);
}

.accent-red-650-dark {
  accent-color: var(--sc-color-red-650-dark);
}

.accent-red-700 {
  accent-color: var(--sc-color-red-700);
}

.accent-red-700-dark {
  accent-color: var(--sc-color-red-700-dark);
}

.accent-red-750 {
  accent-color: var(--sc-color-red-750);
}

.accent-red-750-dark {
  accent-color: var(--sc-color-red-750-dark);
}

.accent-red-800 {
  accent-color: var(--sc-color-red-800);
}

.accent-red-800-dark {
  accent-color: var(--sc-color-red-800-dark);
}

.accent-red-850 {
  accent-color: var(--sc-color-red-850);
}

.accent-red-850-dark {
  accent-color: var(--sc-color-red-850-dark);
}

.accent-red-900 {
  accent-color: var(--sc-color-red-900);
}

.accent-red-900-dark {
  accent-color: var(--sc-color-red-900-dark);
}

.accent-red-950 {
  accent-color: var(--sc-color-red-950);
}

.accent-red-950-dark {
  accent-color: var(--sc-color-red-950-dark);
}

.accent-teal-100 {
  accent-color: var(--sc-color-teal-100);
}

.accent-teal-500 {
  accent-color: var(--sc-color-teal-500);
}

.accent-transparent {
  accent-color: transparent;
}

.accent-transparent\/0 {
  accent-color: rgb(0 0 0 / 0);
}

.accent-transparent\/10 {
  accent-color: rgb(0 0 0 / 0.1);
}

.accent-transparent\/100 {
  accent-color: rgb(0 0 0 / 1);
}

.accent-transparent\/15 {
  accent-color: rgb(0 0 0 / 0.15);
}

.accent-transparent\/20 {
  accent-color: rgb(0 0 0 / 0.2);
}

.accent-transparent\/25 {
  accent-color: rgb(0 0 0 / 0.25);
}

.accent-transparent\/30 {
  accent-color: rgb(0 0 0 / 0.3);
}

.accent-transparent\/35 {
  accent-color: rgb(0 0 0 / 0.35);
}

.accent-transparent\/40 {
  accent-color: rgb(0 0 0 / 0.4);
}

.accent-transparent\/45 {
  accent-color: rgb(0 0 0 / 0.45);
}

.accent-transparent\/5 {
  accent-color: rgb(0 0 0 / 0.05);
}

.accent-transparent\/50 {
  accent-color: rgb(0 0 0 / 0.5);
}

.accent-transparent\/55 {
  accent-color: rgb(0 0 0 / 0.55);
}

.accent-transparent\/60 {
  accent-color: rgb(0 0 0 / 0.6);
}

.accent-transparent\/65 {
  accent-color: rgb(0 0 0 / 0.65);
}

.accent-transparent\/70 {
  accent-color: rgb(0 0 0 / 0.7);
}

.accent-transparent\/75 {
  accent-color: rgb(0 0 0 / 0.75);
}

.accent-transparent\/80 {
  accent-color: rgb(0 0 0 / 0.8);
}

.accent-transparent\/85 {
  accent-color: rgb(0 0 0 / 0.85);
}

.accent-transparent\/90 {
  accent-color: rgb(0 0 0 / 0.9);
}

.accent-transparent\/95 {
  accent-color: rgb(0 0 0 / 0.95);
}

.accent-white {
  accent-color: var(--sc-color-white);
}

.opacity-0 {
  opacity: 0;
}

.opacity-10 {
  opacity: 0.1;
}

.opacity-100 {
  opacity: 1;
}

.opacity-15 {
  opacity: 0.15;
}

.opacity-20 {
  opacity: 0.2;
}

.opacity-25 {
  opacity: 0.25;
}

.opacity-30 {
  opacity: 0.3;
}

.opacity-35 {
  opacity: 0.35;
}

.opacity-40 {
  opacity: 0.4;
}

.opacity-45 {
  opacity: 0.45;
}

.opacity-5 {
  opacity: 0.05;
}

.opacity-50 {
  opacity: 0.5;
}

.opacity-55 {
  opacity: 0.55;
}

.opacity-60 {
  opacity: 0.6;
}

.opacity-65 {
  opacity: 0.65;
}

.opacity-70 {
  opacity: 0.7;
}

.opacity-75 {
  opacity: 0.75;
}

.opacity-80 {
  opacity: 0.8;
}

.opacity-85 {
  opacity: 0.85;
}

.opacity-90 {
  opacity: 0.9;
}

.opacity-95 {
  opacity: 0.95;
}

.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-2xl {
  --tw-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-inner {
  --tw-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: inset 0 2px 4px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-md {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-none {
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-xl {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-amber-100 {
  --tw-shadow-color: var(--sc-color-amber-100);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-100-dark {
  --tw-shadow-color: var(--sc-color-amber-100-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-150 {
  --tw-shadow-color: var(--sc-color-amber-150);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-150-dark {
  --tw-shadow-color: var(--sc-color-amber-150-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-200 {
  --tw-shadow-color: var(--sc-color-amber-200);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-200-dark {
  --tw-shadow-color: var(--sc-color-amber-200-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-250 {
  --tw-shadow-color: var(--sc-color-amber-250);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-250-dark {
  --tw-shadow-color: var(--sc-color-amber-250-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-300 {
  --tw-shadow-color: var(--sc-color-amber-300);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-300-dark {
  --tw-shadow-color: var(--sc-color-amber-300-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-350 {
  --tw-shadow-color: var(--sc-color-amber-350);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-350-dark {
  --tw-shadow-color: var(--sc-color-amber-350-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-400 {
  --tw-shadow-color: var(--sc-color-amber-400);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-400-dark {
  --tw-shadow-color: var(--sc-color-amber-400-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-450 {
  --tw-shadow-color: var(--sc-color-amber-450);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-450-dark {
  --tw-shadow-color: var(--sc-color-amber-450-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-50 {
  --tw-shadow-color: var(--sc-color-amber-50);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-50-dark {
  --tw-shadow-color: var(--sc-color-amber-50-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-500 {
  --tw-shadow-color: var(--sc-color-amber-500);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-500-dark {
  --tw-shadow-color: var(--sc-color-amber-500-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-550 {
  --tw-shadow-color: var(--sc-color-amber-550);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-550-dark {
  --tw-shadow-color: var(--sc-color-amber-550-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-600 {
  --tw-shadow-color: var(--sc-color-amber-600);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-600-dark {
  --tw-shadow-color: var(--sc-color-amber-600-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-650 {
  --tw-shadow-color: var(--sc-color-amber-650);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-650-dark {
  --tw-shadow-color: var(--sc-color-amber-650-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-700 {
  --tw-shadow-color: var(--sc-color-amber-700);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-700-dark {
  --tw-shadow-color: var(--sc-color-amber-700-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-750 {
  --tw-shadow-color: var(--sc-color-amber-750);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-750-dark {
  --tw-shadow-color: var(--sc-color-amber-750-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-800 {
  --tw-shadow-color: var(--sc-color-amber-800);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-800-dark {
  --tw-shadow-color: var(--sc-color-amber-800-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-850 {
  --tw-shadow-color: var(--sc-color-amber-850);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-850-dark {
  --tw-shadow-color: var(--sc-color-amber-850-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-900 {
  --tw-shadow-color: var(--sc-color-amber-900);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-900-dark {
  --tw-shadow-color: var(--sc-color-amber-900-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-950 {
  --tw-shadow-color: var(--sc-color-amber-950);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-amber-950-dark {
  --tw-shadow-color: var(--sc-color-amber-950-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-100 {
  --tw-shadow-color: var(--sc-color-blue-100);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-100-dark {
  --tw-shadow-color: var(--sc-color-blue-100-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-150 {
  --tw-shadow-color: var(--sc-color-blue-150);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-150-dark {
  --tw-shadow-color: var(--sc-color-blue-150-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-200 {
  --tw-shadow-color: var(--sc-color-blue-200);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-200-dark {
  --tw-shadow-color: var(--sc-color-blue-200-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-250 {
  --tw-shadow-color: var(--sc-color-blue-250);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-250-dark {
  --tw-shadow-color: var(--sc-color-blue-250-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-300 {
  --tw-shadow-color: var(--sc-color-blue-300);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-300-dark {
  --tw-shadow-color: var(--sc-color-blue-300-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-350 {
  --tw-shadow-color: var(--sc-color-blue-350);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-350-dark {
  --tw-shadow-color: var(--sc-color-blue-350-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-400 {
  --tw-shadow-color: var(--sc-color-blue-400);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-400-dark {
  --tw-shadow-color: var(--sc-color-blue-400-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-450 {
  --tw-shadow-color: var(--sc-color-blue-450);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-450-dark {
  --tw-shadow-color: var(--sc-color-blue-450-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-50 {
  --tw-shadow-color: var(--sc-color-blue-50);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-50-dark {
  --tw-shadow-color: var(--sc-color-blue-50-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-500 {
  --tw-shadow-color: var(--sc-color-blue-500);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-500-dark {
  --tw-shadow-color: var(--sc-color-blue-500-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-550 {
  --tw-shadow-color: var(--sc-color-blue-550);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-550-dark {
  --tw-shadow-color: var(--sc-color-blue-550-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-600 {
  --tw-shadow-color: var(--sc-color-blue-600);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-600-dark {
  --tw-shadow-color: var(--sc-color-blue-600-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-650 {
  --tw-shadow-color: var(--sc-color-blue-650);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-650-dark {
  --tw-shadow-color: var(--sc-color-blue-650-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-700 {
  --tw-shadow-color: var(--sc-color-blue-700);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-700-dark {
  --tw-shadow-color: var(--sc-color-blue-700-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-750 {
  --tw-shadow-color: var(--sc-color-blue-750);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-750-dark {
  --tw-shadow-color: var(--sc-color-blue-750-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-800 {
  --tw-shadow-color: var(--sc-color-blue-800);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-800-dark {
  --tw-shadow-color: var(--sc-color-blue-800-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-850 {
  --tw-shadow-color: var(--sc-color-blue-850);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-850-dark {
  --tw-shadow-color: var(--sc-color-blue-850-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-900 {
  --tw-shadow-color: var(--sc-color-blue-900);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-900-dark {
  --tw-shadow-color: var(--sc-color-blue-900-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-950 {
  --tw-shadow-color: var(--sc-color-blue-950);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-blue-950-dark {
  --tw-shadow-color: var(--sc-color-blue-950-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-current {
  --tw-shadow-color: currentColor;
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-100 {
  --tw-shadow-color: var(--sc-color-green-100);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-100-dark {
  --tw-shadow-color: var(--sc-color-green-100-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-150 {
  --tw-shadow-color: var(--sc-color-green-150);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-150-dark {
  --tw-shadow-color: var(--sc-color-green-150-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-200 {
  --tw-shadow-color: var(--sc-color-green-200);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-200-dark {
  --tw-shadow-color: var(--sc-color-green-200-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-250 {
  --tw-shadow-color: var(--sc-color-green-250);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-250-dark {
  --tw-shadow-color: var(--sc-color-green-250-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-300 {
  --tw-shadow-color: var(--sc-color-green-300);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-300-dark {
  --tw-shadow-color: var(--sc-color-green-300-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-350 {
  --tw-shadow-color: var(--sc-color-green-350);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-350-dark {
  --tw-shadow-color: var(--sc-color-green-350-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-400 {
  --tw-shadow-color: var(--sc-color-green-400);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-400-dark {
  --tw-shadow-color: var(--sc-color-green-400-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-450 {
  --tw-shadow-color: var(--sc-color-green-450);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-450-dark {
  --tw-shadow-color: var(--sc-color-green-450-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-50 {
  --tw-shadow-color: var(--sc-color-green-50);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-50-dark {
  --tw-shadow-color: var(--sc-color-green-50-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-500 {
  --tw-shadow-color: var(--sc-color-green-500);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-500-dark {
  --tw-shadow-color: var(--sc-color-green-500-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-550 {
  --tw-shadow-color: var(--sc-color-green-550);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-550-dark {
  --tw-shadow-color: var(--sc-color-green-550-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-600 {
  --tw-shadow-color: var(--sc-color-green-600);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-600-dark {
  --tw-shadow-color: var(--sc-color-green-600-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-650 {
  --tw-shadow-color: var(--sc-color-green-650);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-650-dark {
  --tw-shadow-color: var(--sc-color-green-650-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-700 {
  --tw-shadow-color: var(--sc-color-green-700);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-700-dark {
  --tw-shadow-color: var(--sc-color-green-700-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-750 {
  --tw-shadow-color: var(--sc-color-green-750);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-750-dark {
  --tw-shadow-color: var(--sc-color-green-750-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-800 {
  --tw-shadow-color: var(--sc-color-green-800);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-800-dark {
  --tw-shadow-color: var(--sc-color-green-800-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-850 {
  --tw-shadow-color: var(--sc-color-green-850);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-850-dark {
  --tw-shadow-color: var(--sc-color-green-850-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-900 {
  --tw-shadow-color: var(--sc-color-green-900);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-900-dark {
  --tw-shadow-color: var(--sc-color-green-900-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-950 {
  --tw-shadow-color: var(--sc-color-green-950);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-green-950-dark {
  --tw-shadow-color: var(--sc-color-green-950-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-100 {
  --tw-shadow-color: var(--sc-color-grey-100);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-100-dark {
  --tw-shadow-color: var(--sc-color-grey-100-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-150 {
  --tw-shadow-color: var(--sc-color-grey-150);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-150-dark {
  --tw-shadow-color: var(--sc-color-grey-150-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-200 {
  --tw-shadow-color: var(--sc-color-grey-200);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-200-dark {
  --tw-shadow-color: var(--sc-color-grey-200-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-250 {
  --tw-shadow-color: var(--sc-color-grey-250);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-250-dark {
  --tw-shadow-color: var(--sc-color-grey-250-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-300 {
  --tw-shadow-color: var(--sc-color-grey-300);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-300-dark {
  --tw-shadow-color: var(--sc-color-grey-300-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-350 {
  --tw-shadow-color: var(--sc-color-grey-350);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-350-dark {
  --tw-shadow-color: var(--sc-color-grey-350-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-400 {
  --tw-shadow-color: var(--sc-color-grey-400);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-400-dark {
  --tw-shadow-color: var(--sc-color-grey-400-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-450 {
  --tw-shadow-color: var(--sc-color-grey-450);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-450-dark {
  --tw-shadow-color: var(--sc-color-grey-450-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-50 {
  --tw-shadow-color: var(--sc-color-grey-50);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-50-dark {
  --tw-shadow-color: var(--sc-color-grey-50-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-500 {
  --tw-shadow-color: var(--sc-color-grey-500);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-500-dark {
  --tw-shadow-color: var(--sc-color-grey-500-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-550 {
  --tw-shadow-color: var(--sc-color-grey-550);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-550-dark {
  --tw-shadow-color: var(--sc-color-grey-550-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-600 {
  --tw-shadow-color: var(--sc-color-grey-600);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-600-dark {
  --tw-shadow-color: var(--sc-color-grey-600-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-650 {
  --tw-shadow-color: var(--sc-color-grey-650);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-650-dark {
  --tw-shadow-color: var(--sc-color-grey-650-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-700 {
  --tw-shadow-color: var(--sc-color-grey-700);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-700-dark {
  --tw-shadow-color: var(--sc-color-grey-700-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-750 {
  --tw-shadow-color: var(--sc-color-grey-750);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-750-dark {
  --tw-shadow-color: var(--sc-color-grey-750-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-800 {
  --tw-shadow-color: var(--sc-color-grey-800);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-800-dark {
  --tw-shadow-color: var(--sc-color-grey-800-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-850 {
  --tw-shadow-color: var(--sc-color-grey-850);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-850-dark {
  --tw-shadow-color: var(--sc-color-grey-850-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-900 {
  --tw-shadow-color: var(--sc-color-grey-900);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-900-dark {
  --tw-shadow-color: var(--sc-color-grey-900-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-950 {
  --tw-shadow-color: var(--sc-color-grey-950);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-950-dark {
  --tw-shadow-color: var(--sc-color-grey-950-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-grey-black {
  --tw-shadow-color: var(--sc-color-black);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-muted {
  --tw-shadow-color: var(--sc-color-blue-900);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-orange-500 {
  --tw-shadow-color: var(--sc-color-orange-500);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-primary {
  --tw-shadow-color: var(--sc-color-blue);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-100 {
  --tw-shadow-color: var(--sc-color-purple-100);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-100-dark {
  --tw-shadow-color: var(--sc-color-purple-100-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-150 {
  --tw-shadow-color: var(--sc-color-purple-150);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-150-dark {
  --tw-shadow-color: var(--sc-color-purple-150-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-200 {
  --tw-shadow-color: var(--sc-color-purple-200);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-200-dark {
  --tw-shadow-color: var(--sc-color-purple-200-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-250 {
  --tw-shadow-color: var(--sc-color-purple-250);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-250-dark {
  --tw-shadow-color: var(--sc-color-purple-250-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-300 {
  --tw-shadow-color: var(--sc-color-purple-300);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-300-dark {
  --tw-shadow-color: var(--sc-color-purple-300-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-350 {
  --tw-shadow-color: var(--sc-color-purple-350);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-350-dark {
  --tw-shadow-color: var(--sc-color-purple-350-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-400 {
  --tw-shadow-color: var(--sc-color-purple-400);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-400-dark {
  --tw-shadow-color: var(--sc-color-purple-400-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-450 {
  --tw-shadow-color: var(--sc-color-purple-450);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-450-dark {
  --tw-shadow-color: var(--sc-color-purple-450-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-50 {
  --tw-shadow-color: var(--sc-color-purple-50);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-50-dark {
  --tw-shadow-color: var(--sc-color-purple-50-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-500 {
  --tw-shadow-color: var(--sc-color-purple-500);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-500-dark {
  --tw-shadow-color: var(--sc-color-purple-500-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-550 {
  --tw-shadow-color: var(--sc-color-purple-550);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-550-dark {
  --tw-shadow-color: var(--sc-color-purple-550-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-600 {
  --tw-shadow-color: var(--sc-color-purple-600);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-600-dark {
  --tw-shadow-color: var(--sc-color-purple-600-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-650 {
  --tw-shadow-color: var(--sc-color-purple-650);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-650-dark {
  --tw-shadow-color: var(--sc-color-purple-650-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-700 {
  --tw-shadow-color: var(--sc-color-purple-700);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-700-dark {
  --tw-shadow-color: var(--sc-color-purple-700-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-750 {
  --tw-shadow-color: var(--sc-color-purple-750);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-750-dark {
  --tw-shadow-color: var(--sc-color-purple-750-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-800 {
  --tw-shadow-color: var(--sc-color-purple-800);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-800-dark {
  --tw-shadow-color: var(--sc-color-purple-800-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-850 {
  --tw-shadow-color: var(--sc-color-purple-850);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-850-dark {
  --tw-shadow-color: var(--sc-color-purple-850-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-900 {
  --tw-shadow-color: var(--sc-color-purple-900);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-900-dark {
  --tw-shadow-color: var(--sc-color-purple-900-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-950 {
  --tw-shadow-color: var(--sc-color-purple-950);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-purple-950-dark {
  --tw-shadow-color: var(--sc-color-purple-950-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-100 {
  --tw-shadow-color: var(--sc-color-red-100);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-100-dark {
  --tw-shadow-color: var(--sc-color-red-100-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-150 {
  --tw-shadow-color: var(--sc-color-red-150);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-150-dark {
  --tw-shadow-color: var(--sc-color-red-150-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-200 {
  --tw-shadow-color: var(--sc-color-red-200);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-200-dark {
  --tw-shadow-color: var(--sc-color-red-200-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-250 {
  --tw-shadow-color: var(--sc-color-red-250);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-250-dark {
  --tw-shadow-color: var(--sc-color-red-250-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-300 {
  --tw-shadow-color: var(--sc-color-red-300);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-300-dark {
  --tw-shadow-color: var(--sc-color-red-300-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-350 {
  --tw-shadow-color: var(--sc-color-red-350);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-350-dark {
  --tw-shadow-color: var(--sc-color-red-350-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-400 {
  --tw-shadow-color: var(--sc-color-red-400);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-400-dark {
  --tw-shadow-color: var(--sc-color-red-400-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-450 {
  --tw-shadow-color: var(--sc-color-red-450);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-450-dark {
  --tw-shadow-color: var(--sc-color-red-450-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-50 {
  --tw-shadow-color: var(--sc-color-red-50);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-50-dark {
  --tw-shadow-color: var(--sc-color-red-50-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-500 {
  --tw-shadow-color: var(--sc-color-red-500);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-500-dark {
  --tw-shadow-color: var(--sc-color-red-500-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-550 {
  --tw-shadow-color: var(--sc-color-red-550);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-550-dark {
  --tw-shadow-color: var(--sc-color-red-550-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-600 {
  --tw-shadow-color: var(--sc-color-red-600);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-600-dark {
  --tw-shadow-color: var(--sc-color-red-600-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-650 {
  --tw-shadow-color: var(--sc-color-red-650);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-650-dark {
  --tw-shadow-color: var(--sc-color-red-650-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-700 {
  --tw-shadow-color: var(--sc-color-red-700);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-700-dark {
  --tw-shadow-color: var(--sc-color-red-700-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-750 {
  --tw-shadow-color: var(--sc-color-red-750);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-750-dark {
  --tw-shadow-color: var(--sc-color-red-750-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-800 {
  --tw-shadow-color: var(--sc-color-red-800);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-800-dark {
  --tw-shadow-color: var(--sc-color-red-800-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-850 {
  --tw-shadow-color: var(--sc-color-red-850);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-850-dark {
  --tw-shadow-color: var(--sc-color-red-850-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-900 {
  --tw-shadow-color: var(--sc-color-red-900);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-900-dark {
  --tw-shadow-color: var(--sc-color-red-900-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-950 {
  --tw-shadow-color: var(--sc-color-red-950);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-red-950-dark {
  --tw-shadow-color: var(--sc-color-red-950-dark);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-teal-100 {
  --tw-shadow-color: var(--sc-color-teal-100);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-teal-500 {
  --tw-shadow-color: var(--sc-color-teal-500);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent {
  --tw-shadow-color: transparent;
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/0 {
  --tw-shadow-color: rgb(0 0 0 / 0);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/10 {
  --tw-shadow-color: rgb(0 0 0 / 0.1);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/100 {
  --tw-shadow-color: rgb(0 0 0 / 1);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/15 {
  --tw-shadow-color: rgb(0 0 0 / 0.15);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/20 {
  --tw-shadow-color: rgb(0 0 0 / 0.2);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/25 {
  --tw-shadow-color: rgb(0 0 0 / 0.25);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/30 {
  --tw-shadow-color: rgb(0 0 0 / 0.3);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/35 {
  --tw-shadow-color: rgb(0 0 0 / 0.35);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/40 {
  --tw-shadow-color: rgb(0 0 0 / 0.4);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/45 {
  --tw-shadow-color: rgb(0 0 0 / 0.45);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/5 {
  --tw-shadow-color: rgb(0 0 0 / 0.05);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/50 {
  --tw-shadow-color: rgb(0 0 0 / 0.5);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/55 {
  --tw-shadow-color: rgb(0 0 0 / 0.55);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/60 {
  --tw-shadow-color: rgb(0 0 0 / 0.6);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/65 {
  --tw-shadow-color: rgb(0 0 0 / 0.65);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/70 {
  --tw-shadow-color: rgb(0 0 0 / 0.7);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/75 {
  --tw-shadow-color: rgb(0 0 0 / 0.75);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/80 {
  --tw-shadow-color: rgb(0 0 0 / 0.8);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/85 {
  --tw-shadow-color: rgb(0 0 0 / 0.85);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/90 {
  --tw-shadow-color: rgb(0 0 0 / 0.9);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-transparent\/95 {
  --tw-shadow-color: rgb(0 0 0 / 0.95);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-white {
  --tw-shadow-color: var(--sc-color-white);
  --tw-shadow: var(--tw-shadow-colored);
}

.outline-0 {
  outline-width: 0px;
}

.outline-1 {
  outline-width: 1px;
}

.outline-2 {
  outline-width: 2px;
}

.outline-4 {
  outline-width: 4px;
}

.outline-8 {
  outline-width: 8px;
}

.-outline-offset-0 {
  outline-offset: -0px;
}

.-outline-offset-1 {
  outline-offset: -1px;
}

.-outline-offset-2 {
  outline-offset: -2px;
}

.-outline-offset-4 {
  outline-offset: -4px;
}

.-outline-offset-8 {
  outline-offset: -8px;
}

.outline-offset-0 {
  outline-offset: 0px;
}

.outline-offset-1 {
  outline-offset: 1px;
}

.outline-offset-2 {
  outline-offset: 2px;
}

.outline-offset-4 {
  outline-offset: 4px;
}

.outline-offset-8 {
  outline-offset: 8px;
}

.outline-amber-100 {
  outline-color: var(--sc-color-amber-100);
}

.outline-amber-100-dark {
  outline-color: var(--sc-color-amber-100-dark);
}

.outline-amber-150 {
  outline-color: var(--sc-color-amber-150);
}

.outline-amber-150-dark {
  outline-color: var(--sc-color-amber-150-dark);
}

.outline-amber-200 {
  outline-color: var(--sc-color-amber-200);
}

.outline-amber-200-dark {
  outline-color: var(--sc-color-amber-200-dark);
}

.outline-amber-250 {
  outline-color: var(--sc-color-amber-250);
}

.outline-amber-250-dark {
  outline-color: var(--sc-color-amber-250-dark);
}

.outline-amber-300 {
  outline-color: var(--sc-color-amber-300);
}

.outline-amber-300-dark {
  outline-color: var(--sc-color-amber-300-dark);
}

.outline-amber-350 {
  outline-color: var(--sc-color-amber-350);
}

.outline-amber-350-dark {
  outline-color: var(--sc-color-amber-350-dark);
}

.outline-amber-400 {
  outline-color: var(--sc-color-amber-400);
}

.outline-amber-400-dark {
  outline-color: var(--sc-color-amber-400-dark);
}

.outline-amber-450 {
  outline-color: var(--sc-color-amber-450);
}

.outline-amber-450-dark {
  outline-color: var(--sc-color-amber-450-dark);
}

.outline-amber-50 {
  outline-color: var(--sc-color-amber-50);
}

.outline-amber-50-dark {
  outline-color: var(--sc-color-amber-50-dark);
}

.outline-amber-500 {
  outline-color: var(--sc-color-amber-500);
}

.outline-amber-500-dark {
  outline-color: var(--sc-color-amber-500-dark);
}

.outline-amber-550 {
  outline-color: var(--sc-color-amber-550);
}

.outline-amber-550-dark {
  outline-color: var(--sc-color-amber-550-dark);
}

.outline-amber-600 {
  outline-color: var(--sc-color-amber-600);
}

.outline-amber-600-dark {
  outline-color: var(--sc-color-amber-600-dark);
}

.outline-amber-650 {
  outline-color: var(--sc-color-amber-650);
}

.outline-amber-650-dark {
  outline-color: var(--sc-color-amber-650-dark);
}

.outline-amber-700 {
  outline-color: var(--sc-color-amber-700);
}

.outline-amber-700-dark {
  outline-color: var(--sc-color-amber-700-dark);
}

.outline-amber-750 {
  outline-color: var(--sc-color-amber-750);
}

.outline-amber-750-dark {
  outline-color: var(--sc-color-amber-750-dark);
}

.outline-amber-800 {
  outline-color: var(--sc-color-amber-800);
}

.outline-amber-800-dark {
  outline-color: var(--sc-color-amber-800-dark);
}

.outline-amber-850 {
  outline-color: var(--sc-color-amber-850);
}

.outline-amber-850-dark {
  outline-color: var(--sc-color-amber-850-dark);
}

.outline-amber-900 {
  outline-color: var(--sc-color-amber-900);
}

.outline-amber-900-dark {
  outline-color: var(--sc-color-amber-900-dark);
}

.outline-amber-950 {
  outline-color: var(--sc-color-amber-950);
}

.outline-amber-950-dark {
  outline-color: var(--sc-color-amber-950-dark);
}

.outline-blue-100 {
  outline-color: var(--sc-color-blue-100);
}

.outline-blue-100-dark {
  outline-color: var(--sc-color-blue-100-dark);
}

.outline-blue-150 {
  outline-color: var(--sc-color-blue-150);
}

.outline-blue-150-dark {
  outline-color: var(--sc-color-blue-150-dark);
}

.outline-blue-200 {
  outline-color: var(--sc-color-blue-200);
}

.outline-blue-200-dark {
  outline-color: var(--sc-color-blue-200-dark);
}

.outline-blue-250 {
  outline-color: var(--sc-color-blue-250);
}

.outline-blue-250-dark {
  outline-color: var(--sc-color-blue-250-dark);
}

.outline-blue-300 {
  outline-color: var(--sc-color-blue-300);
}

.outline-blue-300-dark {
  outline-color: var(--sc-color-blue-300-dark);
}

.outline-blue-350 {
  outline-color: var(--sc-color-blue-350);
}

.outline-blue-350-dark {
  outline-color: var(--sc-color-blue-350-dark);
}

.outline-blue-400 {
  outline-color: var(--sc-color-blue-400);
}

.outline-blue-400-dark {
  outline-color: var(--sc-color-blue-400-dark);
}

.outline-blue-450 {
  outline-color: var(--sc-color-blue-450);
}

.outline-blue-450-dark {
  outline-color: var(--sc-color-blue-450-dark);
}

.outline-blue-50 {
  outline-color: var(--sc-color-blue-50);
}

.outline-blue-50-dark {
  outline-color: var(--sc-color-blue-50-dark);
}

.outline-blue-500 {
  outline-color: var(--sc-color-blue-500);
}

.outline-blue-500-dark {
  outline-color: var(--sc-color-blue-500-dark);
}

.outline-blue-550 {
  outline-color: var(--sc-color-blue-550);
}

.outline-blue-550-dark {
  outline-color: var(--sc-color-blue-550-dark);
}

.outline-blue-600 {
  outline-color: var(--sc-color-blue-600);
}

.outline-blue-600-dark {
  outline-color: var(--sc-color-blue-600-dark);
}

.outline-blue-650 {
  outline-color: var(--sc-color-blue-650);
}

.outline-blue-650-dark {
  outline-color: var(--sc-color-blue-650-dark);
}

.outline-blue-700 {
  outline-color: var(--sc-color-blue-700);
}

.outline-blue-700-dark {
  outline-color: var(--sc-color-blue-700-dark);
}

.outline-blue-750 {
  outline-color: var(--sc-color-blue-750);
}

.outline-blue-750-dark {
  outline-color: var(--sc-color-blue-750-dark);
}

.outline-blue-800 {
  outline-color: var(--sc-color-blue-800);
}

.outline-blue-800-dark {
  outline-color: var(--sc-color-blue-800-dark);
}

.outline-blue-850 {
  outline-color: var(--sc-color-blue-850);
}

.outline-blue-850-dark {
  outline-color: var(--sc-color-blue-850-dark);
}

.outline-blue-900 {
  outline-color: var(--sc-color-blue-900);
}

.outline-blue-900-dark {
  outline-color: var(--sc-color-blue-900-dark);
}

.outline-blue-950 {
  outline-color: var(--sc-color-blue-950);
}

.outline-blue-950-dark {
  outline-color: var(--sc-color-blue-950-dark);
}

.outline-current {
  outline-color: currentColor;
}

.outline-green-100 {
  outline-color: var(--sc-color-green-100);
}

.outline-green-100-dark {
  outline-color: var(--sc-color-green-100-dark);
}

.outline-green-150 {
  outline-color: var(--sc-color-green-150);
}

.outline-green-150-dark {
  outline-color: var(--sc-color-green-150-dark);
}

.outline-green-200 {
  outline-color: var(--sc-color-green-200);
}

.outline-green-200-dark {
  outline-color: var(--sc-color-green-200-dark);
}

.outline-green-250 {
  outline-color: var(--sc-color-green-250);
}

.outline-green-250-dark {
  outline-color: var(--sc-color-green-250-dark);
}

.outline-green-300 {
  outline-color: var(--sc-color-green-300);
}

.outline-green-300-dark {
  outline-color: var(--sc-color-green-300-dark);
}

.outline-green-350 {
  outline-color: var(--sc-color-green-350);
}

.outline-green-350-dark {
  outline-color: var(--sc-color-green-350-dark);
}

.outline-green-400 {
  outline-color: var(--sc-color-green-400);
}

.outline-green-400-dark {
  outline-color: var(--sc-color-green-400-dark);
}

.outline-green-450 {
  outline-color: var(--sc-color-green-450);
}

.outline-green-450-dark {
  outline-color: var(--sc-color-green-450-dark);
}

.outline-green-50 {
  outline-color: var(--sc-color-green-50);
}

.outline-green-50-dark {
  outline-color: var(--sc-color-green-50-dark);
}

.outline-green-500 {
  outline-color: var(--sc-color-green-500);
}

.outline-green-500-dark {
  outline-color: var(--sc-color-green-500-dark);
}

.outline-green-550 {
  outline-color: var(--sc-color-green-550);
}

.outline-green-550-dark {
  outline-color: var(--sc-color-green-550-dark);
}

.outline-green-600 {
  outline-color: var(--sc-color-green-600);
}

.outline-green-600-dark {
  outline-color: var(--sc-color-green-600-dark);
}

.outline-green-650 {
  outline-color: var(--sc-color-green-650);
}

.outline-green-650-dark {
  outline-color: var(--sc-color-green-650-dark);
}

.outline-green-700 {
  outline-color: var(--sc-color-green-700);
}

.outline-green-700-dark {
  outline-color: var(--sc-color-green-700-dark);
}

.outline-green-750 {
  outline-color: var(--sc-color-green-750);
}

.outline-green-750-dark {
  outline-color: var(--sc-color-green-750-dark);
}

.outline-green-800 {
  outline-color: var(--sc-color-green-800);
}

.outline-green-800-dark {
  outline-color: var(--sc-color-green-800-dark);
}

.outline-green-850 {
  outline-color: var(--sc-color-green-850);
}

.outline-green-850-dark {
  outline-color: var(--sc-color-green-850-dark);
}

.outline-green-900 {
  outline-color: var(--sc-color-green-900);
}

.outline-green-900-dark {
  outline-color: var(--sc-color-green-900-dark);
}

.outline-green-950 {
  outline-color: var(--sc-color-green-950);
}

.outline-green-950-dark {
  outline-color: var(--sc-color-green-950-dark);
}

.outline-grey-100 {
  outline-color: var(--sc-color-grey-100);
}

.outline-grey-100-dark {
  outline-color: var(--sc-color-grey-100-dark);
}

.outline-grey-150 {
  outline-color: var(--sc-color-grey-150);
}

.outline-grey-150-dark {
  outline-color: var(--sc-color-grey-150-dark);
}

.outline-grey-200 {
  outline-color: var(--sc-color-grey-200);
}

.outline-grey-200-dark {
  outline-color: var(--sc-color-grey-200-dark);
}

.outline-grey-250 {
  outline-color: var(--sc-color-grey-250);
}

.outline-grey-250-dark {
  outline-color: var(--sc-color-grey-250-dark);
}

.outline-grey-300 {
  outline-color: var(--sc-color-grey-300);
}

.outline-grey-300-dark {
  outline-color: var(--sc-color-grey-300-dark);
}

.outline-grey-350 {
  outline-color: var(--sc-color-grey-350);
}

.outline-grey-350-dark {
  outline-color: var(--sc-color-grey-350-dark);
}

.outline-grey-400 {
  outline-color: var(--sc-color-grey-400);
}

.outline-grey-400-dark {
  outline-color: var(--sc-color-grey-400-dark);
}

.outline-grey-450 {
  outline-color: var(--sc-color-grey-450);
}

.outline-grey-450-dark {
  outline-color: var(--sc-color-grey-450-dark);
}

.outline-grey-50 {
  outline-color: var(--sc-color-grey-50);
}

.outline-grey-50-dark {
  outline-color: var(--sc-color-grey-50-dark);
}

.outline-grey-500 {
  outline-color: var(--sc-color-grey-500);
}

.outline-grey-500-dark {
  outline-color: var(--sc-color-grey-500-dark);
}

.outline-grey-550 {
  outline-color: var(--sc-color-grey-550);
}

.outline-grey-550-dark {
  outline-color: var(--sc-color-grey-550-dark);
}

.outline-grey-600 {
  outline-color: var(--sc-color-grey-600);
}

.outline-grey-600-dark {
  outline-color: var(--sc-color-grey-600-dark);
}

.outline-grey-650 {
  outline-color: var(--sc-color-grey-650);
}

.outline-grey-650-dark {
  outline-color: var(--sc-color-grey-650-dark);
}

.outline-grey-700 {
  outline-color: var(--sc-color-grey-700);
}

.outline-grey-700-dark {
  outline-color: var(--sc-color-grey-700-dark);
}

.outline-grey-750 {
  outline-color: var(--sc-color-grey-750);
}

.outline-grey-750-dark {
  outline-color: var(--sc-color-grey-750-dark);
}

.outline-grey-800 {
  outline-color: var(--sc-color-grey-800);
}

.outline-grey-800-dark {
  outline-color: var(--sc-color-grey-800-dark);
}

.outline-grey-850 {
  outline-color: var(--sc-color-grey-850);
}

.outline-grey-850-dark {
  outline-color: var(--sc-color-grey-850-dark);
}

.outline-grey-900 {
  outline-color: var(--sc-color-grey-900);
}

.outline-grey-900-dark {
  outline-color: var(--sc-color-grey-900-dark);
}

.outline-grey-950 {
  outline-color: var(--sc-color-grey-950);
}

.outline-grey-950-dark {
  outline-color: var(--sc-color-grey-950-dark);
}

.outline-grey-black {
  outline-color: var(--sc-color-black);
}

.outline-muted {
  outline-color: var(--sc-color-blue-900);
}

.outline-orange-500 {
  outline-color: var(--sc-color-orange-500);
}

.outline-primary {
  outline-color: var(--sc-color-blue);
}

.outline-purple-100 {
  outline-color: var(--sc-color-purple-100);
}

.outline-purple-100-dark {
  outline-color: var(--sc-color-purple-100-dark);
}

.outline-purple-150 {
  outline-color: var(--sc-color-purple-150);
}

.outline-purple-150-dark {
  outline-color: var(--sc-color-purple-150-dark);
}

.outline-purple-200 {
  outline-color: var(--sc-color-purple-200);
}

.outline-purple-200-dark {
  outline-color: var(--sc-color-purple-200-dark);
}

.outline-purple-250 {
  outline-color: var(--sc-color-purple-250);
}

.outline-purple-250-dark {
  outline-color: var(--sc-color-purple-250-dark);
}

.outline-purple-300 {
  outline-color: var(--sc-color-purple-300);
}

.outline-purple-300-dark {
  outline-color: var(--sc-color-purple-300-dark);
}

.outline-purple-350 {
  outline-color: var(--sc-color-purple-350);
}

.outline-purple-350-dark {
  outline-color: var(--sc-color-purple-350-dark);
}

.outline-purple-400 {
  outline-color: var(--sc-color-purple-400);
}

.outline-purple-400-dark {
  outline-color: var(--sc-color-purple-400-dark);
}

.outline-purple-450 {
  outline-color: var(--sc-color-purple-450);
}

.outline-purple-450-dark {
  outline-color: var(--sc-color-purple-450-dark);
}

.outline-purple-50 {
  outline-color: var(--sc-color-purple-50);
}

.outline-purple-50-dark {
  outline-color: var(--sc-color-purple-50-dark);
}

.outline-purple-500 {
  outline-color: var(--sc-color-purple-500);
}

.outline-purple-500-dark {
  outline-color: var(--sc-color-purple-500-dark);
}

.outline-purple-550 {
  outline-color: var(--sc-color-purple-550);
}

.outline-purple-550-dark {
  outline-color: var(--sc-color-purple-550-dark);
}

.outline-purple-600 {
  outline-color: var(--sc-color-purple-600);
}

.outline-purple-600-dark {
  outline-color: var(--sc-color-purple-600-dark);
}

.outline-purple-650 {
  outline-color: var(--sc-color-purple-650);
}

.outline-purple-650-dark {
  outline-color: var(--sc-color-purple-650-dark);
}

.outline-purple-700 {
  outline-color: var(--sc-color-purple-700);
}

.outline-purple-700-dark {
  outline-color: var(--sc-color-purple-700-dark);
}

.outline-purple-750 {
  outline-color: var(--sc-color-purple-750);
}

.outline-purple-750-dark {
  outline-color: var(--sc-color-purple-750-dark);
}

.outline-purple-800 {
  outline-color: var(--sc-color-purple-800);
}

.outline-purple-800-dark {
  outline-color: var(--sc-color-purple-800-dark);
}

.outline-purple-850 {
  outline-color: var(--sc-color-purple-850);
}

.outline-purple-850-dark {
  outline-color: var(--sc-color-purple-850-dark);
}

.outline-purple-900 {
  outline-color: var(--sc-color-purple-900);
}

.outline-purple-900-dark {
  outline-color: var(--sc-color-purple-900-dark);
}

.outline-purple-950 {
  outline-color: var(--sc-color-purple-950);
}

.outline-purple-950-dark {
  outline-color: var(--sc-color-purple-950-dark);
}

.outline-red-100 {
  outline-color: var(--sc-color-red-100);
}

.outline-red-100-dark {
  outline-color: var(--sc-color-red-100-dark);
}

.outline-red-150 {
  outline-color: var(--sc-color-red-150);
}

.outline-red-150-dark {
  outline-color: var(--sc-color-red-150-dark);
}

.outline-red-200 {
  outline-color: var(--sc-color-red-200);
}

.outline-red-200-dark {
  outline-color: var(--sc-color-red-200-dark);
}

.outline-red-250 {
  outline-color: var(--sc-color-red-250);
}

.outline-red-250-dark {
  outline-color: var(--sc-color-red-250-dark);
}

.outline-red-300 {
  outline-color: var(--sc-color-red-300);
}

.outline-red-300-dark {
  outline-color: var(--sc-color-red-300-dark);
}

.outline-red-350 {
  outline-color: var(--sc-color-red-350);
}

.outline-red-350-dark {
  outline-color: var(--sc-color-red-350-dark);
}

.outline-red-400 {
  outline-color: var(--sc-color-red-400);
}

.outline-red-400-dark {
  outline-color: var(--sc-color-red-400-dark);
}

.outline-red-450 {
  outline-color: var(--sc-color-red-450);
}

.outline-red-450-dark {
  outline-color: var(--sc-color-red-450-dark);
}

.outline-red-50 {
  outline-color: var(--sc-color-red-50);
}

.outline-red-50-dark {
  outline-color: var(--sc-color-red-50-dark);
}

.outline-red-500 {
  outline-color: var(--sc-color-red-500);
}

.outline-red-500-dark {
  outline-color: var(--sc-color-red-500-dark);
}

.outline-red-550 {
  outline-color: var(--sc-color-red-550);
}

.outline-red-550-dark {
  outline-color: var(--sc-color-red-550-dark);
}

.outline-red-600 {
  outline-color: var(--sc-color-red-600);
}

.outline-red-600-dark {
  outline-color: var(--sc-color-red-600-dark);
}

.outline-red-650 {
  outline-color: var(--sc-color-red-650);
}

.outline-red-650-dark {
  outline-color: var(--sc-color-red-650-dark);
}

.outline-red-700 {
  outline-color: var(--sc-color-red-700);
}

.outline-red-700-dark {
  outline-color: var(--sc-color-red-700-dark);
}

.outline-red-750 {
  outline-color: var(--sc-color-red-750);
}

.outline-red-750-dark {
  outline-color: var(--sc-color-red-750-dark);
}

.outline-red-800 {
  outline-color: var(--sc-color-red-800);
}

.outline-red-800-dark {
  outline-color: var(--sc-color-red-800-dark);
}

.outline-red-850 {
  outline-color: var(--sc-color-red-850);
}

.outline-red-850-dark {
  outline-color: var(--sc-color-red-850-dark);
}

.outline-red-900 {
  outline-color: var(--sc-color-red-900);
}

.outline-red-900-dark {
  outline-color: var(--sc-color-red-900-dark);
}

.outline-red-950 {
  outline-color: var(--sc-color-red-950);
}

.outline-red-950-dark {
  outline-color: var(--sc-color-red-950-dark);
}

.outline-teal-100 {
  outline-color: var(--sc-color-teal-100);
}

.outline-teal-500 {
  outline-color: var(--sc-color-teal-500);
}

.outline-transparent {
  outline-color: transparent;
}

.outline-transparent\/0 {
  outline-color: rgb(0 0 0 / 0);
}

.outline-transparent\/10 {
  outline-color: rgb(0 0 0 / 0.1);
}

.outline-transparent\/100 {
  outline-color: rgb(0 0 0 / 1);
}

.outline-transparent\/15 {
  outline-color: rgb(0 0 0 / 0.15);
}

.outline-transparent\/20 {
  outline-color: rgb(0 0 0 / 0.2);
}

.outline-transparent\/25 {
  outline-color: rgb(0 0 0 / 0.25);
}

.outline-transparent\/30 {
  outline-color: rgb(0 0 0 / 0.3);
}

.outline-transparent\/35 {
  outline-color: rgb(0 0 0 / 0.35);
}

.outline-transparent\/40 {
  outline-color: rgb(0 0 0 / 0.4);
}

.outline-transparent\/45 {
  outline-color: rgb(0 0 0 / 0.45);
}

.outline-transparent\/5 {
  outline-color: rgb(0 0 0 / 0.05);
}

.outline-transparent\/50 {
  outline-color: rgb(0 0 0 / 0.5);
}

.outline-transparent\/55 {
  outline-color: rgb(0 0 0 / 0.55);
}

.outline-transparent\/60 {
  outline-color: rgb(0 0 0 / 0.6);
}

.outline-transparent\/65 {
  outline-color: rgb(0 0 0 / 0.65);
}

.outline-transparent\/70 {
  outline-color: rgb(0 0 0 / 0.7);
}

.outline-transparent\/75 {
  outline-color: rgb(0 0 0 / 0.75);
}

.outline-transparent\/80 {
  outline-color: rgb(0 0 0 / 0.8);
}

.outline-transparent\/85 {
  outline-color: rgb(0 0 0 / 0.85);
}

.outline-transparent\/90 {
  outline-color: rgb(0 0 0 / 0.9);
}

.outline-transparent\/95 {
  outline-color: rgb(0 0 0 / 0.95);
}

.outline-white {
  outline-color: var(--sc-color-white);
}

.ring {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ring-0 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ring-1 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ring-2 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ring-4 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ring-8 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(8px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ring-inset {
  --tw-ring-inset: inset;
}

.ring-amber-100 {
  --tw-ring-color: var(--sc-color-amber-100);
}

.ring-amber-100-dark {
  --tw-ring-color: var(--sc-color-amber-100-dark);
}

.ring-amber-150 {
  --tw-ring-color: var(--sc-color-amber-150);
}

.ring-amber-150-dark {
  --tw-ring-color: var(--sc-color-amber-150-dark);
}

.ring-amber-200 {
  --tw-ring-color: var(--sc-color-amber-200);
}

.ring-amber-200-dark {
  --tw-ring-color: var(--sc-color-amber-200-dark);
}

.ring-amber-250 {
  --tw-ring-color: var(--sc-color-amber-250);
}

.ring-amber-250-dark {
  --tw-ring-color: var(--sc-color-amber-250-dark);
}

.ring-amber-300 {
  --tw-ring-color: var(--sc-color-amber-300);
}

.ring-amber-300-dark {
  --tw-ring-color: var(--sc-color-amber-300-dark);
}

.ring-amber-350 {
  --tw-ring-color: var(--sc-color-amber-350);
}

.ring-amber-350-dark {
  --tw-ring-color: var(--sc-color-amber-350-dark);
}

.ring-amber-400 {
  --tw-ring-color: var(--sc-color-amber-400);
}

.ring-amber-400-dark {
  --tw-ring-color: var(--sc-color-amber-400-dark);
}

.ring-amber-450 {
  --tw-ring-color: var(--sc-color-amber-450);
}

.ring-amber-450-dark {
  --tw-ring-color: var(--sc-color-amber-450-dark);
}

.ring-amber-50 {
  --tw-ring-color: var(--sc-color-amber-50);
}

.ring-amber-50-dark {
  --tw-ring-color: var(--sc-color-amber-50-dark);
}

.ring-amber-500 {
  --tw-ring-color: var(--sc-color-amber-500);
}

.ring-amber-500-dark {
  --tw-ring-color: var(--sc-color-amber-500-dark);
}

.ring-amber-550 {
  --tw-ring-color: var(--sc-color-amber-550);
}

.ring-amber-550-dark {
  --tw-ring-color: var(--sc-color-amber-550-dark);
}

.ring-amber-600 {
  --tw-ring-color: var(--sc-color-amber-600);
}

.ring-amber-600-dark {
  --tw-ring-color: var(--sc-color-amber-600-dark);
}

.ring-amber-650 {
  --tw-ring-color: var(--sc-color-amber-650);
}

.ring-amber-650-dark {
  --tw-ring-color: var(--sc-color-amber-650-dark);
}

.ring-amber-700 {
  --tw-ring-color: var(--sc-color-amber-700);
}

.ring-amber-700-dark {
  --tw-ring-color: var(--sc-color-amber-700-dark);
}

.ring-amber-750 {
  --tw-ring-color: var(--sc-color-amber-750);
}

.ring-amber-750-dark {
  --tw-ring-color: var(--sc-color-amber-750-dark);
}

.ring-amber-800 {
  --tw-ring-color: var(--sc-color-amber-800);
}

.ring-amber-800-dark {
  --tw-ring-color: var(--sc-color-amber-800-dark);
}

.ring-amber-850 {
  --tw-ring-color: var(--sc-color-amber-850);
}

.ring-amber-850-dark {
  --tw-ring-color: var(--sc-color-amber-850-dark);
}

.ring-amber-900 {
  --tw-ring-color: var(--sc-color-amber-900);
}

.ring-amber-900-dark {
  --tw-ring-color: var(--sc-color-amber-900-dark);
}

.ring-amber-950 {
  --tw-ring-color: var(--sc-color-amber-950);
}

.ring-amber-950-dark {
  --tw-ring-color: var(--sc-color-amber-950-dark);
}

.ring-blue-100 {
  --tw-ring-color: var(--sc-color-blue-100);
}

.ring-blue-100-dark {
  --tw-ring-color: var(--sc-color-blue-100-dark);
}

.ring-blue-150 {
  --tw-ring-color: var(--sc-color-blue-150);
}

.ring-blue-150-dark {
  --tw-ring-color: var(--sc-color-blue-150-dark);
}

.ring-blue-200 {
  --tw-ring-color: var(--sc-color-blue-200);
}

.ring-blue-200-dark {
  --tw-ring-color: var(--sc-color-blue-200-dark);
}

.ring-blue-250 {
  --tw-ring-color: var(--sc-color-blue-250);
}

.ring-blue-250-dark {
  --tw-ring-color: var(--sc-color-blue-250-dark);
}

.ring-blue-300 {
  --tw-ring-color: var(--sc-color-blue-300);
}

.ring-blue-300-dark {
  --tw-ring-color: var(--sc-color-blue-300-dark);
}

.ring-blue-350 {
  --tw-ring-color: var(--sc-color-blue-350);
}

.ring-blue-350-dark {
  --tw-ring-color: var(--sc-color-blue-350-dark);
}

.ring-blue-400 {
  --tw-ring-color: var(--sc-color-blue-400);
}

.ring-blue-400-dark {
  --tw-ring-color: var(--sc-color-blue-400-dark);
}

.ring-blue-450 {
  --tw-ring-color: var(--sc-color-blue-450);
}

.ring-blue-450-dark {
  --tw-ring-color: var(--sc-color-blue-450-dark);
}

.ring-blue-50 {
  --tw-ring-color: var(--sc-color-blue-50);
}

.ring-blue-50-dark {
  --tw-ring-color: var(--sc-color-blue-50-dark);
}

.ring-blue-500 {
  --tw-ring-color: var(--sc-color-blue-500);
}

.ring-blue-500-dark {
  --tw-ring-color: var(--sc-color-blue-500-dark);
}

.ring-blue-550 {
  --tw-ring-color: var(--sc-color-blue-550);
}

.ring-blue-550-dark {
  --tw-ring-color: var(--sc-color-blue-550-dark);
}

.ring-blue-600 {
  --tw-ring-color: var(--sc-color-blue-600);
}

.ring-blue-600-dark {
  --tw-ring-color: var(--sc-color-blue-600-dark);
}

.ring-blue-650 {
  --tw-ring-color: var(--sc-color-blue-650);
}

.ring-blue-650-dark {
  --tw-ring-color: var(--sc-color-blue-650-dark);
}

.ring-blue-700 {
  --tw-ring-color: var(--sc-color-blue-700);
}

.ring-blue-700-dark {
  --tw-ring-color: var(--sc-color-blue-700-dark);
}

.ring-blue-750 {
  --tw-ring-color: var(--sc-color-blue-750);
}

.ring-blue-750-dark {
  --tw-ring-color: var(--sc-color-blue-750-dark);
}

.ring-blue-800 {
  --tw-ring-color: var(--sc-color-blue-800);
}

.ring-blue-800-dark {
  --tw-ring-color: var(--sc-color-blue-800-dark);
}

.ring-blue-850 {
  --tw-ring-color: var(--sc-color-blue-850);
}

.ring-blue-850-dark {
  --tw-ring-color: var(--sc-color-blue-850-dark);
}

.ring-blue-900 {
  --tw-ring-color: var(--sc-color-blue-900);
}

.ring-blue-900-dark {
  --tw-ring-color: var(--sc-color-blue-900-dark);
}

.ring-blue-950 {
  --tw-ring-color: var(--sc-color-blue-950);
}

.ring-blue-950-dark {
  --tw-ring-color: var(--sc-color-blue-950-dark);
}

.ring-current {
  --tw-ring-color: currentColor;
}

.ring-green-100 {
  --tw-ring-color: var(--sc-color-green-100);
}

.ring-green-100-dark {
  --tw-ring-color: var(--sc-color-green-100-dark);
}

.ring-green-150 {
  --tw-ring-color: var(--sc-color-green-150);
}

.ring-green-150-dark {
  --tw-ring-color: var(--sc-color-green-150-dark);
}

.ring-green-200 {
  --tw-ring-color: var(--sc-color-green-200);
}

.ring-green-200-dark {
  --tw-ring-color: var(--sc-color-green-200-dark);
}

.ring-green-250 {
  --tw-ring-color: var(--sc-color-green-250);
}

.ring-green-250-dark {
  --tw-ring-color: var(--sc-color-green-250-dark);
}

.ring-green-300 {
  --tw-ring-color: var(--sc-color-green-300);
}

.ring-green-300-dark {
  --tw-ring-color: var(--sc-color-green-300-dark);
}

.ring-green-350 {
  --tw-ring-color: var(--sc-color-green-350);
}

.ring-green-350-dark {
  --tw-ring-color: var(--sc-color-green-350-dark);
}

.ring-green-400 {
  --tw-ring-color: var(--sc-color-green-400);
}

.ring-green-400-dark {
  --tw-ring-color: var(--sc-color-green-400-dark);
}

.ring-green-450 {
  --tw-ring-color: var(--sc-color-green-450);
}

.ring-green-450-dark {
  --tw-ring-color: var(--sc-color-green-450-dark);
}

.ring-green-50 {
  --tw-ring-color: var(--sc-color-green-50);
}

.ring-green-50-dark {
  --tw-ring-color: var(--sc-color-green-50-dark);
}

.ring-green-500 {
  --tw-ring-color: var(--sc-color-green-500);
}

.ring-green-500-dark {
  --tw-ring-color: var(--sc-color-green-500-dark);
}

.ring-green-550 {
  --tw-ring-color: var(--sc-color-green-550);
}

.ring-green-550-dark {
  --tw-ring-color: var(--sc-color-green-550-dark);
}

.ring-green-600 {
  --tw-ring-color: var(--sc-color-green-600);
}

.ring-green-600-dark {
  --tw-ring-color: var(--sc-color-green-600-dark);
}

.ring-green-650 {
  --tw-ring-color: var(--sc-color-green-650);
}

.ring-green-650-dark {
  --tw-ring-color: var(--sc-color-green-650-dark);
}

.ring-green-700 {
  --tw-ring-color: var(--sc-color-green-700);
}

.ring-green-700-dark {
  --tw-ring-color: var(--sc-color-green-700-dark);
}

.ring-green-750 {
  --tw-ring-color: var(--sc-color-green-750);
}

.ring-green-750-dark {
  --tw-ring-color: var(--sc-color-green-750-dark);
}

.ring-green-800 {
  --tw-ring-color: var(--sc-color-green-800);
}

.ring-green-800-dark {
  --tw-ring-color: var(--sc-color-green-800-dark);
}

.ring-green-850 {
  --tw-ring-color: var(--sc-color-green-850);
}

.ring-green-850-dark {
  --tw-ring-color: var(--sc-color-green-850-dark);
}

.ring-green-900 {
  --tw-ring-color: var(--sc-color-green-900);
}

.ring-green-900-dark {
  --tw-ring-color: var(--sc-color-green-900-dark);
}

.ring-green-950 {
  --tw-ring-color: var(--sc-color-green-950);
}

.ring-green-950-dark {
  --tw-ring-color: var(--sc-color-green-950-dark);
}

.ring-grey-100 {
  --tw-ring-color: var(--sc-color-grey-100);
}

.ring-grey-100-dark {
  --tw-ring-color: var(--sc-color-grey-100-dark);
}

.ring-grey-150 {
  --tw-ring-color: var(--sc-color-grey-150);
}

.ring-grey-150-dark {
  --tw-ring-color: var(--sc-color-grey-150-dark);
}

.ring-grey-200 {
  --tw-ring-color: var(--sc-color-grey-200);
}

.ring-grey-200-dark {
  --tw-ring-color: var(--sc-color-grey-200-dark);
}

.ring-grey-250 {
  --tw-ring-color: var(--sc-color-grey-250);
}

.ring-grey-250-dark {
  --tw-ring-color: var(--sc-color-grey-250-dark);
}

.ring-grey-300 {
  --tw-ring-color: var(--sc-color-grey-300);
}

.ring-grey-300-dark {
  --tw-ring-color: var(--sc-color-grey-300-dark);
}

.ring-grey-350 {
  --tw-ring-color: var(--sc-color-grey-350);
}

.ring-grey-350-dark {
  --tw-ring-color: var(--sc-color-grey-350-dark);
}

.ring-grey-400 {
  --tw-ring-color: var(--sc-color-grey-400);
}

.ring-grey-400-dark {
  --tw-ring-color: var(--sc-color-grey-400-dark);
}

.ring-grey-450 {
  --tw-ring-color: var(--sc-color-grey-450);
}

.ring-grey-450-dark {
  --tw-ring-color: var(--sc-color-grey-450-dark);
}

.ring-grey-50 {
  --tw-ring-color: var(--sc-color-grey-50);
}

.ring-grey-50-dark {
  --tw-ring-color: var(--sc-color-grey-50-dark);
}

.ring-grey-500 {
  --tw-ring-color: var(--sc-color-grey-500);
}

.ring-grey-500-dark {
  --tw-ring-color: var(--sc-color-grey-500-dark);
}

.ring-grey-550 {
  --tw-ring-color: var(--sc-color-grey-550);
}

.ring-grey-550-dark {
  --tw-ring-color: var(--sc-color-grey-550-dark);
}

.ring-grey-600 {
  --tw-ring-color: var(--sc-color-grey-600);
}

.ring-grey-600-dark {
  --tw-ring-color: var(--sc-color-grey-600-dark);
}

.ring-grey-650 {
  --tw-ring-color: var(--sc-color-grey-650);
}

.ring-grey-650-dark {
  --tw-ring-color: var(--sc-color-grey-650-dark);
}

.ring-grey-700 {
  --tw-ring-color: var(--sc-color-grey-700);
}

.ring-grey-700-dark {
  --tw-ring-color: var(--sc-color-grey-700-dark);
}

.ring-grey-750 {
  --tw-ring-color: var(--sc-color-grey-750);
}

.ring-grey-750-dark {
  --tw-ring-color: var(--sc-color-grey-750-dark);
}

.ring-grey-800 {
  --tw-ring-color: var(--sc-color-grey-800);
}

.ring-grey-800-dark {
  --tw-ring-color: var(--sc-color-grey-800-dark);
}

.ring-grey-850 {
  --tw-ring-color: var(--sc-color-grey-850);
}

.ring-grey-850-dark {
  --tw-ring-color: var(--sc-color-grey-850-dark);
}

.ring-grey-900 {
  --tw-ring-color: var(--sc-color-grey-900);
}

.ring-grey-900-dark {
  --tw-ring-color: var(--sc-color-grey-900-dark);
}

.ring-grey-950 {
  --tw-ring-color: var(--sc-color-grey-950);
}

.ring-grey-950-dark {
  --tw-ring-color: var(--sc-color-grey-950-dark);
}

.ring-grey-black {
  --tw-ring-color: var(--sc-color-black);
}

.ring-muted {
  --tw-ring-color: var(--sc-color-blue-900);
}

.ring-orange-500 {
  --tw-ring-color: var(--sc-color-orange-500);
}

.ring-primary {
  --tw-ring-color: var(--sc-color-blue);
}

.ring-purple-100 {
  --tw-ring-color: var(--sc-color-purple-100);
}

.ring-purple-100-dark {
  --tw-ring-color: var(--sc-color-purple-100-dark);
}

.ring-purple-150 {
  --tw-ring-color: var(--sc-color-purple-150);
}

.ring-purple-150-dark {
  --tw-ring-color: var(--sc-color-purple-150-dark);
}

.ring-purple-200 {
  --tw-ring-color: var(--sc-color-purple-200);
}

.ring-purple-200-dark {
  --tw-ring-color: var(--sc-color-purple-200-dark);
}

.ring-purple-250 {
  --tw-ring-color: var(--sc-color-purple-250);
}

.ring-purple-250-dark {
  --tw-ring-color: var(--sc-color-purple-250-dark);
}

.ring-purple-300 {
  --tw-ring-color: var(--sc-color-purple-300);
}

.ring-purple-300-dark {
  --tw-ring-color: var(--sc-color-purple-300-dark);
}

.ring-purple-350 {
  --tw-ring-color: var(--sc-color-purple-350);
}

.ring-purple-350-dark {
  --tw-ring-color: var(--sc-color-purple-350-dark);
}

.ring-purple-400 {
  --tw-ring-color: var(--sc-color-purple-400);
}

.ring-purple-400-dark {
  --tw-ring-color: var(--sc-color-purple-400-dark);
}

.ring-purple-450 {
  --tw-ring-color: var(--sc-color-purple-450);
}

.ring-purple-450-dark {
  --tw-ring-color: var(--sc-color-purple-450-dark);
}

.ring-purple-50 {
  --tw-ring-color: var(--sc-color-purple-50);
}

.ring-purple-50-dark {
  --tw-ring-color: var(--sc-color-purple-50-dark);
}

.ring-purple-500 {
  --tw-ring-color: var(--sc-color-purple-500);
}

.ring-purple-500-dark {
  --tw-ring-color: var(--sc-color-purple-500-dark);
}

.ring-purple-550 {
  --tw-ring-color: var(--sc-color-purple-550);
}

.ring-purple-550-dark {
  --tw-ring-color: var(--sc-color-purple-550-dark);
}

.ring-purple-600 {
  --tw-ring-color: var(--sc-color-purple-600);
}

.ring-purple-600-dark {
  --tw-ring-color: var(--sc-color-purple-600-dark);
}

.ring-purple-650 {
  --tw-ring-color: var(--sc-color-purple-650);
}

.ring-purple-650-dark {
  --tw-ring-color: var(--sc-color-purple-650-dark);
}

.ring-purple-700 {
  --tw-ring-color: var(--sc-color-purple-700);
}

.ring-purple-700-dark {
  --tw-ring-color: var(--sc-color-purple-700-dark);
}

.ring-purple-750 {
  --tw-ring-color: var(--sc-color-purple-750);
}

.ring-purple-750-dark {
  --tw-ring-color: var(--sc-color-purple-750-dark);
}

.ring-purple-800 {
  --tw-ring-color: var(--sc-color-purple-800);
}

.ring-purple-800-dark {
  --tw-ring-color: var(--sc-color-purple-800-dark);
}

.ring-purple-850 {
  --tw-ring-color: var(--sc-color-purple-850);
}

.ring-purple-850-dark {
  --tw-ring-color: var(--sc-color-purple-850-dark);
}

.ring-purple-900 {
  --tw-ring-color: var(--sc-color-purple-900);
}

.ring-purple-900-dark {
  --tw-ring-color: var(--sc-color-purple-900-dark);
}

.ring-purple-950 {
  --tw-ring-color: var(--sc-color-purple-950);
}

.ring-purple-950-dark {
  --tw-ring-color: var(--sc-color-purple-950-dark);
}

.ring-red-100 {
  --tw-ring-color: var(--sc-color-red-100);
}

.ring-red-100-dark {
  --tw-ring-color: var(--sc-color-red-100-dark);
}

.ring-red-150 {
  --tw-ring-color: var(--sc-color-red-150);
}

.ring-red-150-dark {
  --tw-ring-color: var(--sc-color-red-150-dark);
}

.ring-red-200 {
  --tw-ring-color: var(--sc-color-red-200);
}

.ring-red-200-dark {
  --tw-ring-color: var(--sc-color-red-200-dark);
}

.ring-red-250 {
  --tw-ring-color: var(--sc-color-red-250);
}

.ring-red-250-dark {
  --tw-ring-color: var(--sc-color-red-250-dark);
}

.ring-red-300 {
  --tw-ring-color: var(--sc-color-red-300);
}

.ring-red-300-dark {
  --tw-ring-color: var(--sc-color-red-300-dark);
}

.ring-red-350 {
  --tw-ring-color: var(--sc-color-red-350);
}

.ring-red-350-dark {
  --tw-ring-color: var(--sc-color-red-350-dark);
}

.ring-red-400 {
  --tw-ring-color: var(--sc-color-red-400);
}

.ring-red-400-dark {
  --tw-ring-color: var(--sc-color-red-400-dark);
}

.ring-red-450 {
  --tw-ring-color: var(--sc-color-red-450);
}

.ring-red-450-dark {
  --tw-ring-color: var(--sc-color-red-450-dark);
}

.ring-red-50 {
  --tw-ring-color: var(--sc-color-red-50);
}

.ring-red-50-dark {
  --tw-ring-color: var(--sc-color-red-50-dark);
}

.ring-red-500 {
  --tw-ring-color: var(--sc-color-red-500);
}

.ring-red-500-dark {
  --tw-ring-color: var(--sc-color-red-500-dark);
}

.ring-red-550 {
  --tw-ring-color: var(--sc-color-red-550);
}

.ring-red-550-dark {
  --tw-ring-color: var(--sc-color-red-550-dark);
}

.ring-red-600 {
  --tw-ring-color: var(--sc-color-red-600);
}

.ring-red-600-dark {
  --tw-ring-color: var(--sc-color-red-600-dark);
}

.ring-red-650 {
  --tw-ring-color: var(--sc-color-red-650);
}

.ring-red-650-dark {
  --tw-ring-color: var(--sc-color-red-650-dark);
}

.ring-red-700 {
  --tw-ring-color: var(--sc-color-red-700);
}

.ring-red-700-dark {
  --tw-ring-color: var(--sc-color-red-700-dark);
}

.ring-red-750 {
  --tw-ring-color: var(--sc-color-red-750);
}

.ring-red-750-dark {
  --tw-ring-color: var(--sc-color-red-750-dark);
}

.ring-red-800 {
  --tw-ring-color: var(--sc-color-red-800);
}

.ring-red-800-dark {
  --tw-ring-color: var(--sc-color-red-800-dark);
}

.ring-red-850 {
  --tw-ring-color: var(--sc-color-red-850);
}

.ring-red-850-dark {
  --tw-ring-color: var(--sc-color-red-850-dark);
}

.ring-red-900 {
  --tw-ring-color: var(--sc-color-red-900);
}

.ring-red-900-dark {
  --tw-ring-color: var(--sc-color-red-900-dark);
}

.ring-red-950 {
  --tw-ring-color: var(--sc-color-red-950);
}

.ring-red-950-dark {
  --tw-ring-color: var(--sc-color-red-950-dark);
}

.ring-teal-100 {
  --tw-ring-color: var(--sc-color-teal-100);
}

.ring-teal-500 {
  --tw-ring-color: var(--sc-color-teal-500);
}

.ring-transparent {
  --tw-ring-color: transparent;
}

.ring-transparent\/0 {
  --tw-ring-color: rgb(0 0 0 / 0);
}

.ring-transparent\/10 {
  --tw-ring-color: rgb(0 0 0 / 0.1);
}

.ring-transparent\/100 {
  --tw-ring-color: rgb(0 0 0 / 1);
}

.ring-transparent\/15 {
  --tw-ring-color: rgb(0 0 0 / 0.15);
}

.ring-transparent\/20 {
  --tw-ring-color: rgb(0 0 0 / 0.2);
}

.ring-transparent\/25 {
  --tw-ring-color: rgb(0 0 0 / 0.25);
}

.ring-transparent\/30 {
  --tw-ring-color: rgb(0 0 0 / 0.3);
}

.ring-transparent\/35 {
  --tw-ring-color: rgb(0 0 0 / 0.35);
}

.ring-transparent\/40 {
  --tw-ring-color: rgb(0 0 0 / 0.4);
}

.ring-transparent\/45 {
  --tw-ring-color: rgb(0 0 0 / 0.45);
}

.ring-transparent\/5 {
  --tw-ring-color: rgb(0 0 0 / 0.05);
}

.ring-transparent\/50 {
  --tw-ring-color: rgb(0 0 0 / 0.5);
}

.ring-transparent\/55 {
  --tw-ring-color: rgb(0 0 0 / 0.55);
}

.ring-transparent\/60 {
  --tw-ring-color: rgb(0 0 0 / 0.6);
}

.ring-transparent\/65 {
  --tw-ring-color: rgb(0 0 0 / 0.65);
}

.ring-transparent\/70 {
  --tw-ring-color: rgb(0 0 0 / 0.7);
}

.ring-transparent\/75 {
  --tw-ring-color: rgb(0 0 0 / 0.75);
}

.ring-transparent\/80 {
  --tw-ring-color: rgb(0 0 0 / 0.8);
}

.ring-transparent\/85 {
  --tw-ring-color: rgb(0 0 0 / 0.85);
}

.ring-transparent\/90 {
  --tw-ring-color: rgb(0 0 0 / 0.9);
}

.ring-transparent\/95 {
  --tw-ring-color: rgb(0 0 0 / 0.95);
}

.ring-white {
  --tw-ring-color: var(--sc-color-white);
}

.ring-opacity-0 {
  --tw-ring-opacity: 0;
}

.ring-opacity-10 {
  --tw-ring-opacity: 0.1;
}

.ring-opacity-100 {
  --tw-ring-opacity: 1;
}

.ring-opacity-15 {
  --tw-ring-opacity: 0.15;
}

.ring-opacity-20 {
  --tw-ring-opacity: 0.2;
}

.ring-opacity-25 {
  --tw-ring-opacity: 0.25;
}

.ring-opacity-30 {
  --tw-ring-opacity: 0.3;
}

.ring-opacity-35 {
  --tw-ring-opacity: 0.35;
}

.ring-opacity-40 {
  --tw-ring-opacity: 0.4;
}

.ring-opacity-45 {
  --tw-ring-opacity: 0.45;
}

.ring-opacity-5 {
  --tw-ring-opacity: 0.05;
}

.ring-opacity-50 {
  --tw-ring-opacity: 0.5;
}

.ring-opacity-55 {
  --tw-ring-opacity: 0.55;
}

.ring-opacity-60 {
  --tw-ring-opacity: 0.6;
}

.ring-opacity-65 {
  --tw-ring-opacity: 0.65;
}

.ring-opacity-70 {
  --tw-ring-opacity: 0.7;
}

.ring-opacity-75 {
  --tw-ring-opacity: 0.75;
}

.ring-opacity-80 {
  --tw-ring-opacity: 0.8;
}

.ring-opacity-85 {
  --tw-ring-opacity: 0.85;
}

.ring-opacity-90 {
  --tw-ring-opacity: 0.9;
}

.ring-opacity-95 {
  --tw-ring-opacity: 0.95;
}

.ring-offset-0 {
  --tw-ring-offset-width: 0px;
}

.ring-offset-1 {
  --tw-ring-offset-width: 1px;
}

.ring-offset-2 {
  --tw-ring-offset-width: 2px;
}

.ring-offset-4 {
  --tw-ring-offset-width: 4px;
}

.ring-offset-8 {
  --tw-ring-offset-width: 8px;
}

.ring-offset-amber-100 {
  --tw-ring-offset-color: var(--sc-color-amber-100);
}

.ring-offset-amber-100-dark {
  --tw-ring-offset-color: var(--sc-color-amber-100-dark);
}

.ring-offset-amber-150 {
  --tw-ring-offset-color: var(--sc-color-amber-150);
}

.ring-offset-amber-150-dark {
  --tw-ring-offset-color: var(--sc-color-amber-150-dark);
}

.ring-offset-amber-200 {
  --tw-ring-offset-color: var(--sc-color-amber-200);
}

.ring-offset-amber-200-dark {
  --tw-ring-offset-color: var(--sc-color-amber-200-dark);
}

.ring-offset-amber-250 {
  --tw-ring-offset-color: var(--sc-color-amber-250);
}

.ring-offset-amber-250-dark {
  --tw-ring-offset-color: var(--sc-color-amber-250-dark);
}

.ring-offset-amber-300 {
  --tw-ring-offset-color: var(--sc-color-amber-300);
}

.ring-offset-amber-300-dark {
  --tw-ring-offset-color: var(--sc-color-amber-300-dark);
}

.ring-offset-amber-350 {
  --tw-ring-offset-color: var(--sc-color-amber-350);
}

.ring-offset-amber-350-dark {
  --tw-ring-offset-color: var(--sc-color-amber-350-dark);
}

.ring-offset-amber-400 {
  --tw-ring-offset-color: var(--sc-color-amber-400);
}

.ring-offset-amber-400-dark {
  --tw-ring-offset-color: var(--sc-color-amber-400-dark);
}

.ring-offset-amber-450 {
  --tw-ring-offset-color: var(--sc-color-amber-450);
}

.ring-offset-amber-450-dark {
  --tw-ring-offset-color: var(--sc-color-amber-450-dark);
}

.ring-offset-amber-50 {
  --tw-ring-offset-color: var(--sc-color-amber-50);
}

.ring-offset-amber-50-dark {
  --tw-ring-offset-color: var(--sc-color-amber-50-dark);
}

.ring-offset-amber-500 {
  --tw-ring-offset-color: var(--sc-color-amber-500);
}

.ring-offset-amber-500-dark {
  --tw-ring-offset-color: var(--sc-color-amber-500-dark);
}

.ring-offset-amber-550 {
  --tw-ring-offset-color: var(--sc-color-amber-550);
}

.ring-offset-amber-550-dark {
  --tw-ring-offset-color: var(--sc-color-amber-550-dark);
}

.ring-offset-amber-600 {
  --tw-ring-offset-color: var(--sc-color-amber-600);
}

.ring-offset-amber-600-dark {
  --tw-ring-offset-color: var(--sc-color-amber-600-dark);
}

.ring-offset-amber-650 {
  --tw-ring-offset-color: var(--sc-color-amber-650);
}

.ring-offset-amber-650-dark {
  --tw-ring-offset-color: var(--sc-color-amber-650-dark);
}

.ring-offset-amber-700 {
  --tw-ring-offset-color: var(--sc-color-amber-700);
}

.ring-offset-amber-700-dark {
  --tw-ring-offset-color: var(--sc-color-amber-700-dark);
}

.ring-offset-amber-750 {
  --tw-ring-offset-color: var(--sc-color-amber-750);
}

.ring-offset-amber-750-dark {
  --tw-ring-offset-color: var(--sc-color-amber-750-dark);
}

.ring-offset-amber-800 {
  --tw-ring-offset-color: var(--sc-color-amber-800);
}

.ring-offset-amber-800-dark {
  --tw-ring-offset-color: var(--sc-color-amber-800-dark);
}

.ring-offset-amber-850 {
  --tw-ring-offset-color: var(--sc-color-amber-850);
}

.ring-offset-amber-850-dark {
  --tw-ring-offset-color: var(--sc-color-amber-850-dark);
}

.ring-offset-amber-900 {
  --tw-ring-offset-color: var(--sc-color-amber-900);
}

.ring-offset-amber-900-dark {
  --tw-ring-offset-color: var(--sc-color-amber-900-dark);
}

.ring-offset-amber-950 {
  --tw-ring-offset-color: var(--sc-color-amber-950);
}

.ring-offset-amber-950-dark {
  --tw-ring-offset-color: var(--sc-color-amber-950-dark);
}

.ring-offset-blue-100 {
  --tw-ring-offset-color: var(--sc-color-blue-100);
}

.ring-offset-blue-100-dark {
  --tw-ring-offset-color: var(--sc-color-blue-100-dark);
}

.ring-offset-blue-150 {
  --tw-ring-offset-color: var(--sc-color-blue-150);
}

.ring-offset-blue-150-dark {
  --tw-ring-offset-color: var(--sc-color-blue-150-dark);
}

.ring-offset-blue-200 {
  --tw-ring-offset-color: var(--sc-color-blue-200);
}

.ring-offset-blue-200-dark {
  --tw-ring-offset-color: var(--sc-color-blue-200-dark);
}

.ring-offset-blue-250 {
  --tw-ring-offset-color: var(--sc-color-blue-250);
}

.ring-offset-blue-250-dark {
  --tw-ring-offset-color: var(--sc-color-blue-250-dark);
}

.ring-offset-blue-300 {
  --tw-ring-offset-color: var(--sc-color-blue-300);
}

.ring-offset-blue-300-dark {
  --tw-ring-offset-color: var(--sc-color-blue-300-dark);
}

.ring-offset-blue-350 {
  --tw-ring-offset-color: var(--sc-color-blue-350);
}

.ring-offset-blue-350-dark {
  --tw-ring-offset-color: var(--sc-color-blue-350-dark);
}

.ring-offset-blue-400 {
  --tw-ring-offset-color: var(--sc-color-blue-400);
}

.ring-offset-blue-400-dark {
  --tw-ring-offset-color: var(--sc-color-blue-400-dark);
}

.ring-offset-blue-450 {
  --tw-ring-offset-color: var(--sc-color-blue-450);
}

.ring-offset-blue-450-dark {
  --tw-ring-offset-color: var(--sc-color-blue-450-dark);
}

.ring-offset-blue-50 {
  --tw-ring-offset-color: var(--sc-color-blue-50);
}

.ring-offset-blue-50-dark {
  --tw-ring-offset-color: var(--sc-color-blue-50-dark);
}

.ring-offset-blue-500 {
  --tw-ring-offset-color: var(--sc-color-blue-500);
}

.ring-offset-blue-500-dark {
  --tw-ring-offset-color: var(--sc-color-blue-500-dark);
}

.ring-offset-blue-550 {
  --tw-ring-offset-color: var(--sc-color-blue-550);
}

.ring-offset-blue-550-dark {
  --tw-ring-offset-color: var(--sc-color-blue-550-dark);
}

.ring-offset-blue-600 {
  --tw-ring-offset-color: var(--sc-color-blue-600);
}

.ring-offset-blue-600-dark {
  --tw-ring-offset-color: var(--sc-color-blue-600-dark);
}

.ring-offset-blue-650 {
  --tw-ring-offset-color: var(--sc-color-blue-650);
}

.ring-offset-blue-650-dark {
  --tw-ring-offset-color: var(--sc-color-blue-650-dark);
}

.ring-offset-blue-700 {
  --tw-ring-offset-color: var(--sc-color-blue-700);
}

.ring-offset-blue-700-dark {
  --tw-ring-offset-color: var(--sc-color-blue-700-dark);
}

.ring-offset-blue-750 {
  --tw-ring-offset-color: var(--sc-color-blue-750);
}

.ring-offset-blue-750-dark {
  --tw-ring-offset-color: var(--sc-color-blue-750-dark);
}

.ring-offset-blue-800 {
  --tw-ring-offset-color: var(--sc-color-blue-800);
}

.ring-offset-blue-800-dark {
  --tw-ring-offset-color: var(--sc-color-blue-800-dark);
}

.ring-offset-blue-850 {
  --tw-ring-offset-color: var(--sc-color-blue-850);
}

.ring-offset-blue-850-dark {
  --tw-ring-offset-color: var(--sc-color-blue-850-dark);
}

.ring-offset-blue-900 {
  --tw-ring-offset-color: var(--sc-color-blue-900);
}

.ring-offset-blue-900-dark {
  --tw-ring-offset-color: var(--sc-color-blue-900-dark);
}

.ring-offset-blue-950 {
  --tw-ring-offset-color: var(--sc-color-blue-950);
}

.ring-offset-blue-950-dark {
  --tw-ring-offset-color: var(--sc-color-blue-950-dark);
}

.ring-offset-current {
  --tw-ring-offset-color: currentColor;
}

.ring-offset-green-100 {
  --tw-ring-offset-color: var(--sc-color-green-100);
}

.ring-offset-green-100-dark {
  --tw-ring-offset-color: var(--sc-color-green-100-dark);
}

.ring-offset-green-150 {
  --tw-ring-offset-color: var(--sc-color-green-150);
}

.ring-offset-green-150-dark {
  --tw-ring-offset-color: var(--sc-color-green-150-dark);
}

.ring-offset-green-200 {
  --tw-ring-offset-color: var(--sc-color-green-200);
}

.ring-offset-green-200-dark {
  --tw-ring-offset-color: var(--sc-color-green-200-dark);
}

.ring-offset-green-250 {
  --tw-ring-offset-color: var(--sc-color-green-250);
}

.ring-offset-green-250-dark {
  --tw-ring-offset-color: var(--sc-color-green-250-dark);
}

.ring-offset-green-300 {
  --tw-ring-offset-color: var(--sc-color-green-300);
}

.ring-offset-green-300-dark {
  --tw-ring-offset-color: var(--sc-color-green-300-dark);
}

.ring-offset-green-350 {
  --tw-ring-offset-color: var(--sc-color-green-350);
}

.ring-offset-green-350-dark {
  --tw-ring-offset-color: var(--sc-color-green-350-dark);
}

.ring-offset-green-400 {
  --tw-ring-offset-color: var(--sc-color-green-400);
}

.ring-offset-green-400-dark {
  --tw-ring-offset-color: var(--sc-color-green-400-dark);
}

.ring-offset-green-450 {
  --tw-ring-offset-color: var(--sc-color-green-450);
}

.ring-offset-green-450-dark {
  --tw-ring-offset-color: var(--sc-color-green-450-dark);
}

.ring-offset-green-50 {
  --tw-ring-offset-color: var(--sc-color-green-50);
}

.ring-offset-green-50-dark {
  --tw-ring-offset-color: var(--sc-color-green-50-dark);
}

.ring-offset-green-500 {
  --tw-ring-offset-color: var(--sc-color-green-500);
}

.ring-offset-green-500-dark {
  --tw-ring-offset-color: var(--sc-color-green-500-dark);
}

.ring-offset-green-550 {
  --tw-ring-offset-color: var(--sc-color-green-550);
}

.ring-offset-green-550-dark {
  --tw-ring-offset-color: var(--sc-color-green-550-dark);
}

.ring-offset-green-600 {
  --tw-ring-offset-color: var(--sc-color-green-600);
}

.ring-offset-green-600-dark {
  --tw-ring-offset-color: var(--sc-color-green-600-dark);
}

.ring-offset-green-650 {
  --tw-ring-offset-color: var(--sc-color-green-650);
}

.ring-offset-green-650-dark {
  --tw-ring-offset-color: var(--sc-color-green-650-dark);
}

.ring-offset-green-700 {
  --tw-ring-offset-color: var(--sc-color-green-700);
}

.ring-offset-green-700-dark {
  --tw-ring-offset-color: var(--sc-color-green-700-dark);
}

.ring-offset-green-750 {
  --tw-ring-offset-color: var(--sc-color-green-750);
}

.ring-offset-green-750-dark {
  --tw-ring-offset-color: var(--sc-color-green-750-dark);
}

.ring-offset-green-800 {
  --tw-ring-offset-color: var(--sc-color-green-800);
}

.ring-offset-green-800-dark {
  --tw-ring-offset-color: var(--sc-color-green-800-dark);
}

.ring-offset-green-850 {
  --tw-ring-offset-color: var(--sc-color-green-850);
}

.ring-offset-green-850-dark {
  --tw-ring-offset-color: var(--sc-color-green-850-dark);
}

.ring-offset-green-900 {
  --tw-ring-offset-color: var(--sc-color-green-900);
}

.ring-offset-green-900-dark {
  --tw-ring-offset-color: var(--sc-color-green-900-dark);
}

.ring-offset-green-950 {
  --tw-ring-offset-color: var(--sc-color-green-950);
}

.ring-offset-green-950-dark {
  --tw-ring-offset-color: var(--sc-color-green-950-dark);
}

.ring-offset-grey-100 {
  --tw-ring-offset-color: var(--sc-color-grey-100);
}

.ring-offset-grey-100-dark {
  --tw-ring-offset-color: var(--sc-color-grey-100-dark);
}

.ring-offset-grey-150 {
  --tw-ring-offset-color: var(--sc-color-grey-150);
}

.ring-offset-grey-150-dark {
  --tw-ring-offset-color: var(--sc-color-grey-150-dark);
}

.ring-offset-grey-200 {
  --tw-ring-offset-color: var(--sc-color-grey-200);
}

.ring-offset-grey-200-dark {
  --tw-ring-offset-color: var(--sc-color-grey-200-dark);
}

.ring-offset-grey-250 {
  --tw-ring-offset-color: var(--sc-color-grey-250);
}

.ring-offset-grey-250-dark {
  --tw-ring-offset-color: var(--sc-color-grey-250-dark);
}

.ring-offset-grey-300 {
  --tw-ring-offset-color: var(--sc-color-grey-300);
}

.ring-offset-grey-300-dark {
  --tw-ring-offset-color: var(--sc-color-grey-300-dark);
}

.ring-offset-grey-350 {
  --tw-ring-offset-color: var(--sc-color-grey-350);
}

.ring-offset-grey-350-dark {
  --tw-ring-offset-color: var(--sc-color-grey-350-dark);
}

.ring-offset-grey-400 {
  --tw-ring-offset-color: var(--sc-color-grey-400);
}

.ring-offset-grey-400-dark {
  --tw-ring-offset-color: var(--sc-color-grey-400-dark);
}

.ring-offset-grey-450 {
  --tw-ring-offset-color: var(--sc-color-grey-450);
}

.ring-offset-grey-450-dark {
  --tw-ring-offset-color: var(--sc-color-grey-450-dark);
}

.ring-offset-grey-50 {
  --tw-ring-offset-color: var(--sc-color-grey-50);
}

.ring-offset-grey-50-dark {
  --tw-ring-offset-color: var(--sc-color-grey-50-dark);
}

.ring-offset-grey-500 {
  --tw-ring-offset-color: var(--sc-color-grey-500);
}

.ring-offset-grey-500-dark {
  --tw-ring-offset-color: var(--sc-color-grey-500-dark);
}

.ring-offset-grey-550 {
  --tw-ring-offset-color: var(--sc-color-grey-550);
}

.ring-offset-grey-550-dark {
  --tw-ring-offset-color: var(--sc-color-grey-550-dark);
}

.ring-offset-grey-600 {
  --tw-ring-offset-color: var(--sc-color-grey-600);
}

.ring-offset-grey-600-dark {
  --tw-ring-offset-color: var(--sc-color-grey-600-dark);
}

.ring-offset-grey-650 {
  --tw-ring-offset-color: var(--sc-color-grey-650);
}

.ring-offset-grey-650-dark {
  --tw-ring-offset-color: var(--sc-color-grey-650-dark);
}

.ring-offset-grey-700 {
  --tw-ring-offset-color: var(--sc-color-grey-700);
}

.ring-offset-grey-700-dark {
  --tw-ring-offset-color: var(--sc-color-grey-700-dark);
}

.ring-offset-grey-750 {
  --tw-ring-offset-color: var(--sc-color-grey-750);
}

.ring-offset-grey-750-dark {
  --tw-ring-offset-color: var(--sc-color-grey-750-dark);
}

.ring-offset-grey-800 {
  --tw-ring-offset-color: var(--sc-color-grey-800);
}

.ring-offset-grey-800-dark {
  --tw-ring-offset-color: var(--sc-color-grey-800-dark);
}

.ring-offset-grey-850 {
  --tw-ring-offset-color: var(--sc-color-grey-850);
}

.ring-offset-grey-850-dark {
  --tw-ring-offset-color: var(--sc-color-grey-850-dark);
}

.ring-offset-grey-900 {
  --tw-ring-offset-color: var(--sc-color-grey-900);
}

.ring-offset-grey-900-dark {
  --tw-ring-offset-color: var(--sc-color-grey-900-dark);
}

.ring-offset-grey-950 {
  --tw-ring-offset-color: var(--sc-color-grey-950);
}

.ring-offset-grey-950-dark {
  --tw-ring-offset-color: var(--sc-color-grey-950-dark);
}

.ring-offset-grey-black {
  --tw-ring-offset-color: var(--sc-color-black);
}

.ring-offset-muted {
  --tw-ring-offset-color: var(--sc-color-blue-900);
}

.ring-offset-orange-500 {
  --tw-ring-offset-color: var(--sc-color-orange-500);
}

.ring-offset-primary {
  --tw-ring-offset-color: var(--sc-color-blue);
}

.ring-offset-purple-100 {
  --tw-ring-offset-color: var(--sc-color-purple-100);
}

.ring-offset-purple-100-dark {
  --tw-ring-offset-color: var(--sc-color-purple-100-dark);
}

.ring-offset-purple-150 {
  --tw-ring-offset-color: var(--sc-color-purple-150);
}

.ring-offset-purple-150-dark {
  --tw-ring-offset-color: var(--sc-color-purple-150-dark);
}

.ring-offset-purple-200 {
  --tw-ring-offset-color: var(--sc-color-purple-200);
}

.ring-offset-purple-200-dark {
  --tw-ring-offset-color: var(--sc-color-purple-200-dark);
}

.ring-offset-purple-250 {
  --tw-ring-offset-color: var(--sc-color-purple-250);
}

.ring-offset-purple-250-dark {
  --tw-ring-offset-color: var(--sc-color-purple-250-dark);
}

.ring-offset-purple-300 {
  --tw-ring-offset-color: var(--sc-color-purple-300);
}

.ring-offset-purple-300-dark {
  --tw-ring-offset-color: var(--sc-color-purple-300-dark);
}

.ring-offset-purple-350 {
  --tw-ring-offset-color: var(--sc-color-purple-350);
}

.ring-offset-purple-350-dark {
  --tw-ring-offset-color: var(--sc-color-purple-350-dark);
}

.ring-offset-purple-400 {
  --tw-ring-offset-color: var(--sc-color-purple-400);
}

.ring-offset-purple-400-dark {
  --tw-ring-offset-color: var(--sc-color-purple-400-dark);
}

.ring-offset-purple-450 {
  --tw-ring-offset-color: var(--sc-color-purple-450);
}

.ring-offset-purple-450-dark {
  --tw-ring-offset-color: var(--sc-color-purple-450-dark);
}

.ring-offset-purple-50 {
  --tw-ring-offset-color: var(--sc-color-purple-50);
}

.ring-offset-purple-50-dark {
  --tw-ring-offset-color: var(--sc-color-purple-50-dark);
}

.ring-offset-purple-500 {
  --tw-ring-offset-color: var(--sc-color-purple-500);
}

.ring-offset-purple-500-dark {
  --tw-ring-offset-color: var(--sc-color-purple-500-dark);
}

.ring-offset-purple-550 {
  --tw-ring-offset-color: var(--sc-color-purple-550);
}

.ring-offset-purple-550-dark {
  --tw-ring-offset-color: var(--sc-color-purple-550-dark);
}

.ring-offset-purple-600 {
  --tw-ring-offset-color: var(--sc-color-purple-600);
}

.ring-offset-purple-600-dark {
  --tw-ring-offset-color: var(--sc-color-purple-600-dark);
}

.ring-offset-purple-650 {
  --tw-ring-offset-color: var(--sc-color-purple-650);
}

.ring-offset-purple-650-dark {
  --tw-ring-offset-color: var(--sc-color-purple-650-dark);
}

.ring-offset-purple-700 {
  --tw-ring-offset-color: var(--sc-color-purple-700);
}

.ring-offset-purple-700-dark {
  --tw-ring-offset-color: var(--sc-color-purple-700-dark);
}

.ring-offset-purple-750 {
  --tw-ring-offset-color: var(--sc-color-purple-750);
}

.ring-offset-purple-750-dark {
  --tw-ring-offset-color: var(--sc-color-purple-750-dark);
}

.ring-offset-purple-800 {
  --tw-ring-offset-color: var(--sc-color-purple-800);
}

.ring-offset-purple-800-dark {
  --tw-ring-offset-color: var(--sc-color-purple-800-dark);
}

.ring-offset-purple-850 {
  --tw-ring-offset-color: var(--sc-color-purple-850);
}

.ring-offset-purple-850-dark {
  --tw-ring-offset-color: var(--sc-color-purple-850-dark);
}

.ring-offset-purple-900 {
  --tw-ring-offset-color: var(--sc-color-purple-900);
}

.ring-offset-purple-900-dark {
  --tw-ring-offset-color: var(--sc-color-purple-900-dark);
}

.ring-offset-purple-950 {
  --tw-ring-offset-color: var(--sc-color-purple-950);
}

.ring-offset-purple-950-dark {
  --tw-ring-offset-color: var(--sc-color-purple-950-dark);
}

.ring-offset-red-100 {
  --tw-ring-offset-color: var(--sc-color-red-100);
}

.ring-offset-red-100-dark {
  --tw-ring-offset-color: var(--sc-color-red-100-dark);
}

.ring-offset-red-150 {
  --tw-ring-offset-color: var(--sc-color-red-150);
}

.ring-offset-red-150-dark {
  --tw-ring-offset-color: var(--sc-color-red-150-dark);
}

.ring-offset-red-200 {
  --tw-ring-offset-color: var(--sc-color-red-200);
}

.ring-offset-red-200-dark {
  --tw-ring-offset-color: var(--sc-color-red-200-dark);
}

.ring-offset-red-250 {
  --tw-ring-offset-color: var(--sc-color-red-250);
}

.ring-offset-red-250-dark {
  --tw-ring-offset-color: var(--sc-color-red-250-dark);
}

.ring-offset-red-300 {
  --tw-ring-offset-color: var(--sc-color-red-300);
}

.ring-offset-red-300-dark {
  --tw-ring-offset-color: var(--sc-color-red-300-dark);
}

.ring-offset-red-350 {
  --tw-ring-offset-color: var(--sc-color-red-350);
}

.ring-offset-red-350-dark {
  --tw-ring-offset-color: var(--sc-color-red-350-dark);
}

.ring-offset-red-400 {
  --tw-ring-offset-color: var(--sc-color-red-400);
}

.ring-offset-red-400-dark {
  --tw-ring-offset-color: var(--sc-color-red-400-dark);
}

.ring-offset-red-450 {
  --tw-ring-offset-color: var(--sc-color-red-450);
}

.ring-offset-red-450-dark {
  --tw-ring-offset-color: var(--sc-color-red-450-dark);
}

.ring-offset-red-50 {
  --tw-ring-offset-color: var(--sc-color-red-50);
}

.ring-offset-red-50-dark {
  --tw-ring-offset-color: var(--sc-color-red-50-dark);
}

.ring-offset-red-500 {
  --tw-ring-offset-color: var(--sc-color-red-500);
}

.ring-offset-red-500-dark {
  --tw-ring-offset-color: var(--sc-color-red-500-dark);
}

.ring-offset-red-550 {
  --tw-ring-offset-color: var(--sc-color-red-550);
}

.ring-offset-red-550-dark {
  --tw-ring-offset-color: var(--sc-color-red-550-dark);
}

.ring-offset-red-600 {
  --tw-ring-offset-color: var(--sc-color-red-600);
}

.ring-offset-red-600-dark {
  --tw-ring-offset-color: var(--sc-color-red-600-dark);
}

.ring-offset-red-650 {
  --tw-ring-offset-color: var(--sc-color-red-650);
}

.ring-offset-red-650-dark {
  --tw-ring-offset-color: var(--sc-color-red-650-dark);
}

.ring-offset-red-700 {
  --tw-ring-offset-color: var(--sc-color-red-700);
}

.ring-offset-red-700-dark {
  --tw-ring-offset-color: var(--sc-color-red-700-dark);
}

.ring-offset-red-750 {
  --tw-ring-offset-color: var(--sc-color-red-750);
}

.ring-offset-red-750-dark {
  --tw-ring-offset-color: var(--sc-color-red-750-dark);
}

.ring-offset-red-800 {
  --tw-ring-offset-color: var(--sc-color-red-800);
}

.ring-offset-red-800-dark {
  --tw-ring-offset-color: var(--sc-color-red-800-dark);
}

.ring-offset-red-850 {
  --tw-ring-offset-color: var(--sc-color-red-850);
}

.ring-offset-red-850-dark {
  --tw-ring-offset-color: var(--sc-color-red-850-dark);
}

.ring-offset-red-900 {
  --tw-ring-offset-color: var(--sc-color-red-900);
}

.ring-offset-red-900-dark {
  --tw-ring-offset-color: var(--sc-color-red-900-dark);
}

.ring-offset-red-950 {
  --tw-ring-offset-color: var(--sc-color-red-950);
}

.ring-offset-red-950-dark {
  --tw-ring-offset-color: var(--sc-color-red-950-dark);
}

.ring-offset-teal-100 {
  --tw-ring-offset-color: var(--sc-color-teal-100);
}

.ring-offset-teal-500 {
  --tw-ring-offset-color: var(--sc-color-teal-500);
}

.ring-offset-transparent {
  --tw-ring-offset-color: transparent;
}

.ring-offset-transparent\/0 {
  --tw-ring-offset-color: rgb(0 0 0 / 0);
}

.ring-offset-transparent\/10 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.1);
}

.ring-offset-transparent\/100 {
  --tw-ring-offset-color: rgb(0 0 0 / 1);
}

.ring-offset-transparent\/15 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.15);
}

.ring-offset-transparent\/20 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.2);
}

.ring-offset-transparent\/25 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.25);
}

.ring-offset-transparent\/30 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.3);
}

.ring-offset-transparent\/35 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.35);
}

.ring-offset-transparent\/40 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.4);
}

.ring-offset-transparent\/45 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.45);
}

.ring-offset-transparent\/5 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.05);
}

.ring-offset-transparent\/50 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.5);
}

.ring-offset-transparent\/55 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.55);
}

.ring-offset-transparent\/60 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.6);
}

.ring-offset-transparent\/65 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.65);
}

.ring-offset-transparent\/70 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.7);
}

.ring-offset-transparent\/75 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.75);
}

.ring-offset-transparent\/80 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.8);
}

.ring-offset-transparent\/85 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.85);
}

.ring-offset-transparent\/90 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.9);
}

.ring-offset-transparent\/95 {
  --tw-ring-offset-color: rgb(0 0 0 / 0.95);
}

.ring-offset-white {
  --tw-ring-offset-color: var(--sc-color-white);
}

.blur {
  --tw-blur: blur(8px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.blur-0 {
  --tw-blur: blur(0);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.blur-2xl {
  --tw-blur: blur(40px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.blur-3xl {
  --tw-blur: blur(64px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.blur-lg {
  --tw-blur: blur(16px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.blur-md {
  --tw-blur: blur(12px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.blur-none {
  --tw-blur: blur(0);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.blur-sm {
  --tw-blur: blur(4px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.blur-xl {
  --tw-blur: blur(24px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.brightness-0 {
  --tw-brightness: brightness(0);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.brightness-100 {
  --tw-brightness: brightness(1);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.brightness-105 {
  --tw-brightness: brightness(1.05);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.brightness-110 {
  --tw-brightness: brightness(1.1);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.brightness-125 {
  --tw-brightness: brightness(1.25);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.brightness-150 {
  --tw-brightness: brightness(1.5);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.brightness-200 {
  --tw-brightness: brightness(2);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.brightness-50 {
  --tw-brightness: brightness(.5);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.brightness-75 {
  --tw-brightness: brightness(.75);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.brightness-90 {
  --tw-brightness: brightness(.9);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.brightness-95 {
  --tw-brightness: brightness(.95);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.contrast-0 {
  --tw-contrast: contrast(0);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.contrast-100 {
  --tw-contrast: contrast(1);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.contrast-125 {
  --tw-contrast: contrast(1.25);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.contrast-150 {
  --tw-contrast: contrast(1.5);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.contrast-200 {
  --tw-contrast: contrast(2);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.contrast-50 {
  --tw-contrast: contrast(.5);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.contrast-75 {
  --tw-contrast: contrast(.75);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.drop-shadow {
  --tw-drop-shadow: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.drop-shadow-2xl {
  --tw-drop-shadow: drop-shadow(0 25px 25px rgb(0 0 0 / 0.15));
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.drop-shadow-lg {
  --tw-drop-shadow: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.drop-shadow-md {
  --tw-drop-shadow: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.drop-shadow-none {
  --tw-drop-shadow: drop-shadow(0 0 #0000);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.drop-shadow-sm {
  --tw-drop-shadow: drop-shadow(0 1px 1px rgb(0 0 0 / 0.05));
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.drop-shadow-xl {
  --tw-drop-shadow: drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08));
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.grayscale {
  --tw-grayscale: grayscale(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.grayscale-0 {
  --tw-grayscale: grayscale(0);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.-hue-rotate-0 {
  --tw-hue-rotate: hue-rotate(-0deg);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.-hue-rotate-15 {
  --tw-hue-rotate: hue-rotate(-15deg);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.-hue-rotate-180 {
  --tw-hue-rotate: hue-rotate(-180deg);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.-hue-rotate-30 {
  --tw-hue-rotate: hue-rotate(-30deg);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.-hue-rotate-60 {
  --tw-hue-rotate: hue-rotate(-60deg);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.-hue-rotate-90 {
  --tw-hue-rotate: hue-rotate(-90deg);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.hue-rotate-0 {
  --tw-hue-rotate: hue-rotate(0deg);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.hue-rotate-15 {
  --tw-hue-rotate: hue-rotate(15deg);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.hue-rotate-180 {
  --tw-hue-rotate: hue-rotate(180deg);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.hue-rotate-30 {
  --tw-hue-rotate: hue-rotate(30deg);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.hue-rotate-60 {
  --tw-hue-rotate: hue-rotate(60deg);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.hue-rotate-90 {
  --tw-hue-rotate: hue-rotate(90deg);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.invert {
  --tw-invert: invert(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.invert-0 {
  --tw-invert: invert(0);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.saturate-0 {
  --tw-saturate: saturate(0);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.saturate-100 {
  --tw-saturate: saturate(1);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.saturate-150 {
  --tw-saturate: saturate(1.5);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.saturate-200 {
  --tw-saturate: saturate(2);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.saturate-50 {
  --tw-saturate: saturate(.5);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.sepia {
  --tw-sepia: sepia(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.sepia-0 {
  --tw-sepia: sepia(0);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.backdrop-blur {
  --tw-backdrop-blur: blur(8px);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-blur-0 {
  --tw-backdrop-blur: blur(0);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-blur-2xl {
  --tw-backdrop-blur: blur(40px);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-blur-3xl {
  --tw-backdrop-blur: blur(64px);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-blur-lg {
  --tw-backdrop-blur: blur(16px);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-blur-md {
  --tw-backdrop-blur: blur(12px);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-blur-none {
  --tw-backdrop-blur: blur(0);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-blur-sm {
  --tw-backdrop-blur: blur(4px);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-blur-xl {
  --tw-backdrop-blur: blur(24px);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-brightness-0 {
  --tw-backdrop-brightness: brightness(0);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-brightness-100 {
  --tw-backdrop-brightness: brightness(1);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-brightness-105 {
  --tw-backdrop-brightness: brightness(1.05);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-brightness-110 {
  --tw-backdrop-brightness: brightness(1.1);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-brightness-125 {
  --tw-backdrop-brightness: brightness(1.25);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-brightness-150 {
  --tw-backdrop-brightness: brightness(1.5);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-brightness-200 {
  --tw-backdrop-brightness: brightness(2);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-brightness-50 {
  --tw-backdrop-brightness: brightness(.5);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-brightness-75 {
  --tw-backdrop-brightness: brightness(.75);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-brightness-90 {
  --tw-backdrop-brightness: brightness(.9);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-brightness-95 {
  --tw-backdrop-brightness: brightness(.95);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-contrast-0 {
  --tw-backdrop-contrast: contrast(0);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-contrast-100 {
  --tw-backdrop-contrast: contrast(1);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-contrast-125 {
  --tw-backdrop-contrast: contrast(1.25);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-contrast-150 {
  --tw-backdrop-contrast: contrast(1.5);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-contrast-200 {
  --tw-backdrop-contrast: contrast(2);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-contrast-50 {
  --tw-backdrop-contrast: contrast(.5);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-contrast-75 {
  --tw-backdrop-contrast: contrast(.75);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-grayscale {
  --tw-backdrop-grayscale: grayscale(100%);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-grayscale-0 {
  --tw-backdrop-grayscale: grayscale(0);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.-backdrop-hue-rotate-0 {
  --tw-backdrop-hue-rotate: hue-rotate(-0deg);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.-backdrop-hue-rotate-15 {
  --tw-backdrop-hue-rotate: hue-rotate(-15deg);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.-backdrop-hue-rotate-180 {
  --tw-backdrop-hue-rotate: hue-rotate(-180deg);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.-backdrop-hue-rotate-30 {
  --tw-backdrop-hue-rotate: hue-rotate(-30deg);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.-backdrop-hue-rotate-60 {
  --tw-backdrop-hue-rotate: hue-rotate(-60deg);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.-backdrop-hue-rotate-90 {
  --tw-backdrop-hue-rotate: hue-rotate(-90deg);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-hue-rotate-0 {
  --tw-backdrop-hue-rotate: hue-rotate(0deg);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-hue-rotate-15 {
  --tw-backdrop-hue-rotate: hue-rotate(15deg);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-hue-rotate-180 {
  --tw-backdrop-hue-rotate: hue-rotate(180deg);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-hue-rotate-30 {
  --tw-backdrop-hue-rotate: hue-rotate(30deg);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-hue-rotate-60 {
  --tw-backdrop-hue-rotate: hue-rotate(60deg);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-hue-rotate-90 {
  --tw-backdrop-hue-rotate: hue-rotate(90deg);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-invert {
  --tw-backdrop-invert: invert(100%);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-invert-0 {
  --tw-backdrop-invert: invert(0);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-0 {
  --tw-backdrop-opacity: opacity(0);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-10 {
  --tw-backdrop-opacity: opacity(0.1);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-100 {
  --tw-backdrop-opacity: opacity(1);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-15 {
  --tw-backdrop-opacity: opacity(0.15);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-20 {
  --tw-backdrop-opacity: opacity(0.2);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-25 {
  --tw-backdrop-opacity: opacity(0.25);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-30 {
  --tw-backdrop-opacity: opacity(0.3);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-35 {
  --tw-backdrop-opacity: opacity(0.35);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-40 {
  --tw-backdrop-opacity: opacity(0.4);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-45 {
  --tw-backdrop-opacity: opacity(0.45);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-5 {
  --tw-backdrop-opacity: opacity(0.05);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-50 {
  --tw-backdrop-opacity: opacity(0.5);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-55 {
  --tw-backdrop-opacity: opacity(0.55);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-60 {
  --tw-backdrop-opacity: opacity(0.6);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-65 {
  --tw-backdrop-opacity: opacity(0.65);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-70 {
  --tw-backdrop-opacity: opacity(0.7);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-75 {
  --tw-backdrop-opacity: opacity(0.75);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-80 {
  --tw-backdrop-opacity: opacity(0.8);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-85 {
  --tw-backdrop-opacity: opacity(0.85);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-90 {
  --tw-backdrop-opacity: opacity(0.9);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-opacity-95 {
  --tw-backdrop-opacity: opacity(0.95);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-saturate-0 {
  --tw-backdrop-saturate: saturate(0);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-saturate-100 {
  --tw-backdrop-saturate: saturate(1);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-saturate-150 {
  --tw-backdrop-saturate: saturate(1.5);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-saturate-200 {
  --tw-backdrop-saturate: saturate(2);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-saturate-50 {
  --tw-backdrop-saturate: saturate(.5);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-sepia {
  --tw-backdrop-sepia: sepia(100%);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-sepia-0 {
  --tw-backdrop-sepia: sepia(0);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-none {
  transition-property: none;
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.delay-0 {
  transition-delay: 0s;
}

.delay-100 {
  transition-delay: 100ms;
}

.delay-1000 {
  transition-delay: 1000ms;
}

.delay-150 {
  transition-delay: 150ms;
}

.delay-200 {
  transition-delay: 200ms;
}

.delay-300 {
  transition-delay: 300ms;
}

.delay-500 {
  transition-delay: 500ms;
}

.delay-700 {
  transition-delay: 700ms;
}

.delay-75 {
  transition-delay: 75ms;
}

.duration-0 {
  transition-duration: 0s;
}

.duration-100 {
  transition-duration: 100ms;
}

.duration-1000 {
  transition-duration: 1000ms;
}

.duration-150 {
  transition-duration: 150ms;
}

.duration-200 {
  transition-duration: 200ms;
}

.duration-300 {
  transition-duration: 300ms;
}

.duration-500 {
  transition-duration: 500ms;
}

.duration-700 {
  transition-duration: 700ms;
}

.duration-75 {
  transition-duration: 75ms;
}

.ease-in {
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}

.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.ease-linear {
  transition-timing-function: linear;
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.will-change-auto {
  will-change: auto;
}

.will-change-contents {
  will-change: contents;
}

.will-change-scroll {
  will-change: scroll-position;
}

.will-change-transform {
  will-change: transform;
}

.content-none {
  --tw-content: none;
  content: var(--tw-content);
}
`;
  