import { createComponent } from '../../src/wrapper/ReactWrapper';
import { expect } from '@open-wc/testing';

jest.mock("@lit/react", () => {
  return {
    createComponent: () => true
  }
});


describe('React Wrapper', () => {
  it('call createComponent', () => {
    const component = createComponent('sc-button');
    expect(component).to.equal(true);
  })
})