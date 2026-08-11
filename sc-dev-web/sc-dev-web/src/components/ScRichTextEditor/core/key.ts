import { EKEY_MAP } from '../constant.js';
import { invertObject } from './utils.js';

export default {
  nameFromCode: invertObject(EKEY_MAP),
  code: EKEY_MAP,
};
