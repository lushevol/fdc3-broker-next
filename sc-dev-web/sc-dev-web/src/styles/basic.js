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
  /* purple end */
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
`;
  