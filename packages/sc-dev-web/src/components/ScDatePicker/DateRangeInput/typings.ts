import type { FormInputBase } from '../../ScFormInput/FormInputBase.js';

import type { DatePickerProperties } from '../typings.js';

export interface DateInputProperties extends DatePickerProperties, Omit<FormInputBase, keyof DatePickerProperties> {}
