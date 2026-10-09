import { stringCss } from 'ratan-design-origin/compatibility-css';
const className: string = stringCss`color: red;`;
if (!/^css-/.test(className)) throw new Error('String class facade changed its contract');
console.log('Packed legacy string class facade verified.');
