import { expect } from '@open-wc/testing';
import { DateDisplayTemplate } from '../../../src/models/Components/DateDisplayTemplate.js';

describe('DateDisplayTemplate model', () => {
  it('render the default properties', () => {
    const dateDisplayTemplate = DateDisplayTemplate.from();

    expect(dateDisplayTemplate.label).to.equal('Date display');
    expect(dateDisplayTemplate.dateType).to.equal('full-date');
    expect(dateDisplayTemplate.showTime).to.equal(false);
    expect(dateDisplayTemplate.timeOnly).to.equal(false);
    expect(dateDisplayTemplate.hideSeconds).to.equal(false);
    expect(dateDisplayTemplate.showTimezone).to.equal(false);
    expect(dateDisplayTemplate.size).to.equal('md');
  });

  it('duplicate the configured properties', () => {
    const template = DateDisplayTemplate.from({
      dateType: 'month-year',
      showTime: true,
      timeOnly: true,
      hideSeconds: true,
      showTimezone: true,
      size: 'lg',
      defaultValue: '2025-01-02T12:23:00+08:00',
      value: '2025-02-03T08:00:00+08:00',
    });

    const duplicated = DateDisplayTemplate.duplicate(template);

    expect(duplicated).to.not.equal(template);
    expect(duplicated.dateType).to.equal('month-year');
    expect(duplicated.showTime).to.equal(true);
    expect(duplicated.timeOnly).to.equal(true);
    expect(duplicated.hideSeconds).to.equal(true);
    expect(duplicated.showTimezone).to.equal(true);
    expect(duplicated.size).to.equal('lg');
    expect(duplicated.defaultValue).to.equal('2025-01-02T12:23:00+08:00');
    expect(duplicated.value).to.equal('2025-02-03T08:00:00+08:00');
  });
});