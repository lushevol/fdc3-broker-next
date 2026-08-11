import { expect } from '@open-wc/testing';
import {
  none,
  moreActionsStyle,
  deleteStyle,
  commentHeight,
  deleteActionLabel,
  reminderActionLabel,
  markActionLabel,
  DEFAULT_POSTER_OPTIONS,
  DEFAULT_SORTER_OPTIONS,
} from '../../../src/components/ScComment/ScComment.constants.js';

describe('ScComment.constants', () => {
  it('should export none with display:none', () => {
    expect(none.display).to.equal('none');
  });

  it('should export moreActionsStyle with flex display', () => {
    expect(moreActionsStyle.display).to.include('flex');
  });

  it('should export deleteStyle merging moreActionsStyle and errorColorStyle', () => {
    expect(deleteStyle['align-items']).to.equal('center');
    expect(deleteStyle.color).to.include('sc-button');
  });

  it('should export commentHeight', () => {
    expect(commentHeight.height).to.equal('100px');
  });

  it('deleteActionLabel should return a TemplateResult', () => {
    const result = deleteActionLabel();
    expect(result).to.exist;
  });

  it('reminderActionLabel should return a TemplateResult', () => {
    const result = reminderActionLabel();
    expect(result).to.exist;
  });

  // markActionLabel - previously uncovered
  it('markActionLabel should return a TemplateResult', () => {
    const result = markActionLabel();
    expect(result).to.exist;
  });

  it('DEFAULT_POSTER_OPTIONS should return all and mine options', () => {
    const options = DEFAULT_POSTER_OPTIONS();
    expect(options).to.have.lengthOf(2);
    expect(options.map((o: any) => o.value)).to.include.members(['all', 'mine']);
  });

  it('DEFAULT_SORTER_OPTIONS should return newest and oldest options', () => {
    const options = DEFAULT_SORTER_OPTIONS();
    expect(options).to.have.lengthOf(2);
    expect(options.map((o: any) => o.value)).to.include.members(['newest', 'oldest']);
  });
});