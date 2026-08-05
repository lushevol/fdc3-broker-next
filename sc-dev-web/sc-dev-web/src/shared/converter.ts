import { ComplexAttributeConverter } from 'lit';
import { BUTTON_STATE, BUTTON_TYPE, ICON_ALIGN, SIZE } from './util.js';

export const widthConverter: ComplexAttributeConverter<string | number> = {
  fromAttribute(value) {
    switch (typeof value) {
      case 'string':
        return value;
      case 'number':
        return Number(value);
      default:
        throw new Error(`Unknown value: ${value}`);
    }
  },
  toAttribute(value) {
    return value;
  },
};
export const iconPosConverter: ComplexAttributeConverter<ICON_ALIGN> = {
  fromAttribute(value) {
    switch (value) {
      case ICON_ALIGN.left:
      case ICON_ALIGN.right:
        return value as ICON_ALIGN;
      default:
        throw new Error(`Unknown value: ${value}`);
    }
  },
  toAttribute(value) {
    return value;
  },
};

export const btnTypeConverter: ComplexAttributeConverter<BUTTON_TYPE> = {
  fromAttribute(value) {
    switch (value) {
      case BUTTON_TYPE.default:
      case BUTTON_TYPE.secondary:
      case BUTTON_TYPE.text:
      case BUTTON_TYPE.link:
        return value as BUTTON_TYPE;
      default:
        return BUTTON_TYPE.default;
    }
  },
  toAttribute(value) {
    return value;
  },
};

export const stateConverter: ComplexAttributeConverter<BUTTON_STATE> = {
  fromAttribute(value) {
    switch (value) {
      case BUTTON_STATE.default:
      case BUTTON_STATE.error:
      case BUTTON_STATE.alert:
      case BUTTON_STATE.success:
        return value as BUTTON_STATE;
      default:
        throw new Error(`Unknown state value: ${value}`);
    }
  },
  toAttribute(value) {
    return value;
  },
};
export const sizeConverter: ComplexAttributeConverter<SIZE> = {
  fromAttribute(value) {
    switch (value) {
      case SIZE.lg:
      case SIZE.md:
      case SIZE.none:
      case SIZE.sm:
      case SIZE.xs:
      case SIZE.xxs:
        return value as SIZE;
      default:
        throw new Error(`Unknown value: ${value}`);
    }
  },
  toAttribute(value) {
    return value;
  },
};
