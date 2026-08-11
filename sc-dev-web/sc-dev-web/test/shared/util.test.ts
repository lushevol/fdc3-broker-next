import { expect } from '@open-wc/testing';
import { detectDeviceType, isMobileDevice, isTabletDevice, sizeDown, sizeUp } from '../../src/shared/util.js';


describe('util', () => {
  it('sizeUp', () => {
    expect(sizeUp('xs')).to.equal('sm');
  });

  it('sizeDown', () => {
    expect(sizeDown('sm')).to.equal('xs');
  });

  it('isMobileDevice', () => {
    expect(isMobileDevice()).to.be.false;
  });
  
  it('isTabletDevice', () => {
    expect(isTabletDevice()).to.be.false;
  });

  it('detectDeviceType', () => {
    expect(detectDeviceType()).to.equal('desktop');
  });

});