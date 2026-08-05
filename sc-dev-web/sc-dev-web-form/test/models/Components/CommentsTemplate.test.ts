import { expect } from '@open-wc/testing';
import { CommentsTemplate } from '../../../src/models/Components/CommentsTemplate.js';

describe('CommentsTemplate', () => {
  it('from() returns default instance when obj is undefined', () => {
    const instance = CommentsTemplate.from();
    expect(instance).to.be.instanceOf(CommentsTemplate);
    expect(instance.maxRepliesdepth).to.equal(3);
    expect(instance.maxVisibleReplies).to.equal(2);
    expect(instance.labelSize).to.equal('md');
  });

  it('from() copies properties from obj', () => {
    const obj = { maxRepliesdepth: 5, labelSize: 'lg' };
    const instance = CommentsTemplate.from(obj);
    expect(instance.maxRepliesdepth).to.equal(5);
    expect(instance.labelSize).to.equal('lg');
    expect(instance.maxVisibleReplies).to.equal(2);
  });

  it('duplicate() returns a new instance with copied properties', () => {
    const obj = { maxRepliesdepth: 7, maxVisibleReplies: 4 };
    const instance = CommentsTemplate.duplicate(obj);
    expect(instance.maxRepliesdepth).to.equal(7);
    expect(instance.maxVisibleReplies).to.equal(4);
    expect(instance.labelSize).to.equal('md');
  });
});