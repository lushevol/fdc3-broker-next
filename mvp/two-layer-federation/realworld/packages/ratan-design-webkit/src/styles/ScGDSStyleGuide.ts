import { css } from 'lit';

export default css`
  :root,
  :host {
    --sc-color-white: #ffffff;
    --sc-color-black: #000000;
    --sc-color-white-rgb: 255, 255, 255;
    --sc-color-black-rgb: 0, 0, 0;
    --sc-color-prosper-blue: #020b43;
    --sc-color-brand-blue: #0473ea;

    /* grey start */
    --sc-color-grey-25: #f9f9f9;
    --sc-color-grey-50: #f2f2f2;
    --sc-color-grey-100: #e5e5e5;
    --sc-color-grey-150: #d9d9d9;
    --sc-color-grey-200: #cccccc;
    --sc-color-grey-250: #bfbfbf;
    --sc-color-grey-300: #b2b2b2;
    --sc-color-grey-350: #a6a6a6;
    --sc-color-grey-400: #999999;
    --sc-color-grey-450: #8c8c8c;
    --sc-color-grey-500: #808080;
    --sc-color-grey-550: #737373;
    --sc-color-grey-600: #666666;
    --sc-color-grey-650: #595959;
    --sc-color-grey-700: #4d4d4d;
    --sc-color-grey-750: #404040;
    --sc-color-grey-800: #333333;
    --sc-color-grey-850: #262626;
    --sc-color-grey-900: #1a1a1a;
    --sc-color-grey-950: #0d0d0d;
    --sc-color-grey-975: #070707;
    --sc-color-grey-50-dark: #0d0d0d;
    --sc-color-grey-100-dark: #1a1a1a;
    --sc-color-grey-150-dark: #262626;
    --sc-color-grey-200-dark: #333333;
    --sc-color-grey-250-dark: #404040;
    --sc-color-grey-300-dark: #4d4d4d;
    --sc-color-grey-350-dark: #595959;
    --sc-color-grey-400-dark: #666666;
    --sc-color-grey-450-dark: #737373;
    --sc-color-grey-500-dark: #808080;
    --sc-color-grey-550-dark: #8c8c8c;
    --sc-color-grey-600-dark: #999999;
    --sc-color-grey-650-dark: #a6a6a6;
    --sc-color-grey-700-dark: #b2b2b2;
    --sc-color-grey-750-dark: #bfbfbf;
    --sc-color-grey-800-dark: #cccccc;
    --sc-color-grey-850-dark: #d9d9d9;
    --sc-color-grey-900-dark: #e5e5e5;
    --sc-color-grey-950-dark: #f2f2f2;
    /* grey rgb version with same HEX value */
    --sc-color-grey-50-rgb: 242, 242, 242;
    /* grey end */

    /* blue start */
    --sc-color-blue-50: #e5f1fc;
    --sc-color-blue-100: #cce3fa;
    --sc-color-blue-150: #b3d5f8;
    --sc-color-blue-200: #9ac7f6;
    --sc-color-blue-250: #81b9f4;
    --sc-color-blue-300: #68abf2;
    --sc-color-blue-350: #4f9df0;
    --sc-color-blue-400: #368fee;
    --sc-color-blue-450: #1d81ec;
    --sc-color-blue-460: #007aff;
    --sc-color-blue-500: #0473ea;
    --sc-color-blue-550: #0367d2;
    --sc-color-blue-600: #035cbb;
    --sc-color-blue-650: #0250a3;
    --sc-color-blue-700: #02458c;
    --sc-color-blue-750: #023975;
    --sc-color-blue-800: #012e5d;
    --sc-color-blue-850: #012246;
    --sc-color-blue-900: #00172e;
    --sc-color-blue-950: #000b17;
    --sc-color-blue-50-dark: #000b17;
    --sc-color-blue-100-dark: #00172e;
    --sc-color-blue-150-dark: #012246;
    --sc-color-blue-200-dark: #012e5d;
    --sc-color-blue-250-dark: #023975;
    --sc-color-blue-300-dark: #02458c;
    --sc-color-blue-350-dark: #0250a3;
    --sc-color-blue-400-dark: #035cbb;
    --sc-color-blue-450-dark: #0367d2;
    --sc-color-blue-500-dark: #0473ea;
    --sc-color-blue-550-dark: #1d81ec;
    --sc-color-blue-600-dark: #368fee;
    --sc-color-blue-650-dark: #4f9df0;
    --sc-color-blue-700-dark: #68abf2;
    --sc-color-blue-750-dark: #81b9f4;
    --sc-color-blue-800-dark: #9ac7f6;
    --sc-color-blue-850-dark: #b3d5f8;
    --sc-color-blue-900-dark: #cce3fa;
    --sc-color-blue-950-dark: #e5f1fc;
    /* blue rgb version with same HEX value */
    --sc-color-blue-900-rgb: 0, 23, 46;
    --sc-color-blue-gradient-alt: #254498;
    /* blue end */

    /* green start */
    --sc-color-green-50: #ebfbe6;
    --sc-color-green-100: #d7f7cd;
    --sc-color-green-150: #c3f3b4;
    --sc-color-green-200: #afef9b;
    --sc-color-green-250: #9beb82;
    --sc-color-green-300: #87e769;
    --sc-color-green-350: #73e350;
    --sc-color-green-400: #5fdf37;
    --sc-color-green-450: #4bdb1e;
    --sc-color-green-500: #38d200;
    --sc-color-green-550: #32bd00;
    --sc-color-green-600: #2ca800;
    --sc-color-green-650: #269300;
    --sc-color-green-700: #207e00;
    --sc-color-green-750: #1a6900;
    --sc-color-green-800: #145400;
    --sc-color-green-850: #0e3f00;
    --sc-color-green-900: #082a00;
    --sc-color-green-950: #021500;
    --sc-color-green-50-dark: #021500;
    --sc-color-green-100-dark: #082a00;
    --sc-color-green-150-dark: #0e3f00;
    --sc-color-green-200-dark: #145400;
    --sc-color-green-250-dark: #1a6900;
    --sc-color-green-300-dark: #207e00;
    --sc-color-green-350-dark: #269300;
    --sc-color-green-400-dark: #2ca800;
    --sc-color-green-450-dark: #32bd00;
    --sc-color-green-500-dark: #38d200;
    --sc-color-green-550-dark: #4bdb1e;
    --sc-color-green-600-dark: #5fdf37;
    --sc-color-green-650-dark: #73e350;
    --sc-color-green-700-dark: #87e769;
    --sc-color-green-750-dark: #9beb82;
    --sc-color-green-800-dark: #afef9b;
    --sc-color-green-850-dark: #c3f3b4;
    --sc-color-green-900-dark: #d7f7cd;
    --sc-color-green-950-dark: #ebfbe6;
    /* green end */

    /* amber start */
    --sc-color-amber-50: #fef6e7;
    --sc-color-amber-100: #feefd0;
    --sc-color-amber-150: #fde6b8;
    --sc-color-amber-200: #fddea1;
    --sc-color-amber-250: #fdd689;
    --sc-color-amber-300: #fcce72;
    --sc-color-amber-350: #fcc65b;
    --sc-color-amber-400: #fbbd43;
    --sc-color-amber-450: #fab52c;
    --sc-color-amber-500: #faad14;
    --sc-color-amber-550: #e19c12;
    --sc-color-amber-600: #c88a10;
    --sc-color-amber-650: #af790e;
    --sc-color-amber-700: #96680c;
    --sc-color-amber-750: #7d570a;
    --sc-color-amber-800: #644508;
    --sc-color-amber-850: #4b3406;
    --sc-color-amber-900: #322304;
    --sc-color-amber-950: #191102;
    --sc-color-amber-50-dark: #191102;
    --sc-color-amber-100-dark: #322304;
    --sc-color-amber-150-dark: #4b3406;
    --sc-color-amber-200-dark: #644508;
    --sc-color-amber-250-dark: #7d570a;
    --sc-color-amber-300-dark: #96680c;
    --sc-color-amber-350-dark: #af790e;
    --sc-color-amber-400-dark: #c88a10;
    --sc-color-amber-450-dark: #e19c12;
    --sc-color-amber-500-dark: #faad14;
    --sc-color-amber-550-dark: #fab52c;
    --sc-color-amber-600-dark: #fbbd43;
    --sc-color-amber-650-dark: #fcc65b;
    --sc-color-amber-700-dark: #fcce72;
    --sc-color-amber-750-dark: #fdd689;
    --sc-color-amber-800-dark: #fddea1;
    --sc-color-amber-850-dark: #fde6b8;
    --sc-color-amber-900-dark: #feefd0;
    --sc-color-amber-950-dark: #fef6e7;
    /* amber end */

    /* orange start */
    --sc-color-orange-50: #fff0e8;
    --sc-color-orange-100: #ffefe6;
    --sc-color-orange-150: #ffdecd;
    --sc-color-orange-200: #ffceb4;
    --sc-color-orange-250: #ffbe9c;
    --sc-color-orange-300: #ffad84;
    --sc-color-orange-350: #fd9d6c;
    --sc-color-orange-400: #f98c55;
    --sc-color-orange-450: #f47b3d;
    --sc-color-orange-500: #ef6923;
    --sc-color-orange-550: #d65e1f;
    --sc-color-orange-600: #b9511b;
    --sc-color-orange-650: #974216;
    --sc-color-orange-700: #6b2f10;
    --sc-color-orange-750: #7d330d;
    --sc-color-orange-800: #64290a;
    --sc-color-orange-850: #4b1f08;
    --sc-color-orange-900: #321405;
    --sc-color-orange-950: #190a03;
    /* orange end */

    /* teal start */
    --sc-color-teal-50: #e8fafc;
    --sc-color-teal-100: #d1f6fa;
    --sc-color-teal-150: #baf2f7;
    --sc-color-teal-200: #a3edf5;
    --sc-color-teal-250: #8ce9f2;
    --sc-color-teal-300: #75e4ef;
    --sc-color-teal-350: #5fe0ed;
    --sc-color-teal-400: #48dcea;
    --sc-color-teal-450: #31d7e8;
    --sc-color-teal-500: #1ad3e5;
    --sc-color-teal-550: #17bdce;
    --sc-color-teal-600: #15a9b7;
    --sc-color-teal-650: #1294a0;
    --sc-color-teal-700: #107f89;
    --sc-color-teal-750: #0d6a73;
    --sc-color-teal-800: #0a545c;
    --sc-color-teal-850: #083f45;
    --sc-color-teal-900: #052a2e;
    --sc-color-teal-950: #031517;
    /* teal end */

    /* red start */
    --sc-color-red-50: #fce6e7;
    --sc-color-red-100: #f9ced0;
    --sc-color-red-150: #f6b5b8;
    --sc-color-red-200: #f39da1;
    --sc-color-red-250: #ef848a;
    --sc-color-red-300: #ec6c73;
    --sc-color-red-350: #e9545b;
    --sc-color-red-400: #e63b44;
    --sc-color-red-450: #e3232c;
    --sc-color-red-500: #e00a15;
    --sc-color-red-550: #ca0913;
    --sc-color-red-600: #b30811;
    --sc-color-red-650: #9d070f;
    --sc-color-red-700: #86060d;
    --sc-color-red-750: #70050b;
    --sc-color-red-800: #5a0408;
    --sc-color-red-850: #430306;
    --sc-color-red-900: #2d0204;
    --sc-color-red-950: #160102;
    --sc-color-red-50-dark: #160102;
    --sc-color-red-100-dark: #2d0204;
    --sc-color-red-150-dark: #430306;
    --sc-color-red-200-dark: #5a0408;
    --sc-color-red-250-dark: #70050b;
    --sc-color-red-300-dark: #86060d;
    --sc-color-red-350-dark: #9d070f;
    --sc-color-red-400-dark: #b30811;
    --sc-color-red-450-dark: #ca0913;
    --sc-color-red-500-dark: #e00a15;
    --sc-color-red-550-dark: #e3232c;
    --sc-color-red-600-dark: #e63b44;
    --sc-color-red-650-dark: #e9545b;
    --sc-color-red-700-dark: #ec6c73;
    --sc-color-red-750-dark: #ef848a;
    --sc-color-red-800-dark: #f39da1;
    --sc-color-red-850-dark: #f6b5b8;
    --sc-color-red-900-dark: #f9ced0;
    --sc-color-red-950-dark: #fce6e7;
    /* red end */

    /* maroon start */
    --sc-color-maroon-50: #f7e9ee;
    --sc-color-maroon-100: #efd3de;
    --sc-color-maroon-150: #e6bdcd;
    --sc-color-maroon-200: #dea7bd;
    --sc-color-maroon-250: #d690ac;
    --sc-color-maroon-300: #ce7a9c;
    --sc-color-maroon-350: #c5648b;
    --sc-color-maroon-400: #bd4e7b;
    --sc-color-maroon-450: #b5386b;
    --sc-color-maroon-500: #ad225a;
    --sc-color-maroon-550: #9c1f51;
    --sc-color-maroon-600: #8a1b48;
    --sc-color-maroon-650: #79183f;
    --sc-color-maroon-700: #681436;
    --sc-color-maroon-750: #57112d;
    --sc-color-maroon-800: #450e24;
    --sc-color-maroon-850: #340a1b;
    --sc-color-maroon-900: #230712;
    --sc-color-maroon-950: #110309;
    --sc-color-maroon-50-dark: #110309;
    --sc-color-maroon-100-dark: #230712;
    --sc-color-maroon-150-dark: #340a1b;
    --sc-color-maroon-200-dark: #450e24;
    --sc-color-maroon-250-dark: #57112d;
    --sc-color-maroon-300-dark: #681436;
    --sc-color-maroon-350-dark: #79183f;
    --sc-color-maroon-400-dark: #8a1b48;
    --sc-color-maroon-450-dark: #9c1f51;
    --sc-color-maroon-500-dark: #ad225a;
    --sc-color-maroon-550-dark: #b5386b;
    --sc-color-maroon-600-dark: #bd4e7b;
    --sc-color-maroon-650-dark: #c5648b;
    --sc-color-maroon-700-dark: #ce7a9c;
    --sc-color-maroon-750-dark: #d690ac;
    --sc-color-maroon-800-dark: #dea7bd;
    --sc-color-maroon-850-dark: #e6bdcd;
    --sc-color-maroon-900-dark: #efd3de;
    --sc-color-maroon-950-dark: #f7e9ee;
    /* maroon end */

    /* purple start */
    --sc-color-purple-50: #f2e8fe;
    --sc-color-purple-100: #e5d2fe;
    --sc-color-purple-150: #d8bbfe;
    --sc-color-purple-200: #cba5fd;
    --sc-color-purple-250: #be8efd;
    --sc-color-purple-300: #b277fd;
    --sc-color-purple-350: #a561fc;
    --sc-color-purple-400: #984afc;
    --sc-color-purple-450: #8b34fb;
    --sc-color-purple-500: #7e1dfb;
    --sc-color-purple-550: #711ae2;
    --sc-color-purple-600: #6517c9;
    --sc-color-purple-650: #5814b0;
    --sc-color-purple-700: #4c1197;
    --sc-color-purple-750: #3f0f7e;
    --sc-color-purple-800: #320c64;
    --sc-color-purple-850: #26094b;
    --sc-color-purple-900: #190632;
    --sc-color-purple-950: #0d0319;
    --sc-color-purple-50-dark: #0d0319;
    --sc-color-purple-100-dark: #190632;
    --sc-color-purple-150-dark: #26094b;
    --sc-color-purple-200-dark: #320c64;
    --sc-color-purple-250-dark: #3f0f7e;
    --sc-color-purple-300-dark: #4c1197;
    --sc-color-purple-350-dark: #5814b0;
    --sc-color-purple-400-dark: #6517c9;
    --sc-color-purple-450-dark: #711ae2;
    --sc-color-purple-550-dark: #8b34fb;
    --sc-color-purple-600-dark: #984afc;
    --sc-color-purple-650-dark: #a561fc;
    --sc-color-purple-700-dark: #b277fd;
    --sc-color-purple-750-dark: #be8efd;
    --sc-color-purple-800-dark: #cba5fd;
    --sc-color-purple-850-dark: #d8bbfe;
    --sc-color-purple-900-dark: #e5d2fe;
    --sc-color-purple-950-dark: #f2e8fe;
    /* purple end */

    /* violet start */
    --sc-color-violet-50: #ededf8;
    --sc-color-violet-100: #dadaf2;
    --sc-color-violet-150: #c8c8eb;
    --sc-color-violet-200: #b6b6e5;
    --sc-color-violet-250: #a3a3de;
    --sc-color-violet-300: #9191d7;
    --sc-color-violet-350: #7f7fd1;
    --sc-color-violet-400: #6d6dca;
    --sc-color-violet-450: #5a5ac4;
    --sc-color-violet-500: #4848bd;
    --sc-color-violet-550: #4141aa;
    --sc-color-violet-600: #3a3a97;
    --sc-color-violet-650: #323284;
    --sc-color-violet-700: #2b2b71;
    --sc-color-violet-750: #24245f;
    --sc-color-violet-800: #1d1d4c;
    --sc-color-violet-850: #161639;
    --sc-color-violet-900: #0e0e26;
    --sc-color-violet-950: #070713;
    /* violet end */

    /* magenta start */
    --sc-color-magenta-50: #fde7f2;
    --sc-color-magenta-100: #fccfe5;
    --sc-color-magenta-150: #fab8d7;
    --sc-color-magenta-200: #f8a0ca;
    --sc-color-magenta-250: #f788bd;
    --sc-color-magenta-300: #f570b0;
    --sc-color-magenta-350: #f358a3;
    --sc-color-magenta-400: #f14195;
    --sc-color-magenta-450: #f02988;
    --sc-color-magenta-500: #ee117b;
    --sc-color-magenta-550: #d60f6f;
    --sc-color-magenta-600: #be0e62;
    --sc-color-magenta-650: #a70c56;
    --sc-color-magenta-700: #8f0a4a;
    --sc-color-magenta-750: #77093e;
    --sc-color-magenta-800: #5f0731;
    --sc-color-magenta-850: #470525;
    --sc-color-magenta-900: #300319;
    --sc-color-magenta-950: #18020c;
    /* magenta end */

    /* olive start */
    --sc-color-olive-50: #f7f9eb;
    --sc-color-olive-100: #f0f3d7;
    --sc-color-olive-150: #e8eec3;
    --sc-color-olive-200: #e1e8af;
    --sc-color-olive-250: #dae39b;
    --sc-color-olive-300: #d2dd87;
    --sc-color-olive-350: #cbd773;
    --sc-color-olive-400: #c3d25f;
    --sc-color-olive-450: #bccc4b;
    --sc-color-olive-500: #b5c738;
    --sc-color-olive-550: #a2b332;
    --sc-color-olive-600: #909f2c;
    --sc-color-olive-650: #7e8b27;
    --sc-color-olive-700: #6c7721;
    --sc-color-olive-750: #5a631c;
    --sc-color-olive-800: #484f16;
    --sc-color-olive-850: #363b10;
    --sc-color-olive-900: #24270b;
    --sc-color-olive-950: #121305;
    /* olive end */

    /* brand colour start */
    --sc-brand-gradient: linear-gradient(90deg, #2c3a88 0%, #0061c8 99.74%);
    --sc-brand-grey: #525355;
    /* brand colour end */

    /* system test shades start */
    --sc-shades-orange-500: #ef6923;
    --sc-shades-teal-500: #0f7e89;
    --sc-shades-purple-500: #4848bd;
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
  }
`;
