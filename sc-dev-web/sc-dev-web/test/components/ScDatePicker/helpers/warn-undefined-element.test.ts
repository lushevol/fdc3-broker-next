import { expect, jest } from '@jest/globals';

import { warnUndefinedElement } from '../../../../src/components/ScDatePicker/helpers/warn-undefined-element.js';
import { RootElement } from '../../../../src/components/ScDatePicker/root-element/root-element.js';

const warn = jest.spyOn(window.console, 'warn');

describe(warnUndefinedElement.name, () => {
  const elementName = 'test-element' as const;
  const elementName2 = 'test-element-2' as const;

  it('does not warn defined element', () => {
    globalThis.customElements.define(elementName, class A extends RootElement {});

    warnUndefinedElement(elementName);

    expect(warn).not.toBeCalled();
  });

  it('warns undefined element', () => {
    warnUndefinedElement(elementName2);

    expect(warn).toBeCalledWith(`${elementName2} is required`);
  });
});
