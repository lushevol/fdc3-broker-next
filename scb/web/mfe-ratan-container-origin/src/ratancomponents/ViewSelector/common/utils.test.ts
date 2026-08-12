import { generateViewSelectorOptions, generateViewSelectorOptionsForRole } from './utils';
import { getUser } from '../../../ratanutils/authenticator';

jest.mock('../../../ratanutils/authenticator');

describe('generateViewSelectorOptions', () => {
  it('should return empty array when list is empty', () => {
    const result = generateViewSelectorOptions({}, 'type');
    expect(result).toEqual([]);
  });

  it('should return public options when items are public', () => {
    const list = {
      type: [
        { type: 'type', isPublic: true, name: 'Public Item', rowKey: '1' }
      ]
    };
    const result = generateViewSelectorOptions(list, 'type');
    expect(result).toEqual([
      { label: 'Public', options: [{ label: 'Public Item', value: '1' }] }
    ]);
  });

  it('should return private options when items are private', () => {
    const list = {
      type: [
        { type: 'type', isPublic: false, name: 'Private Item', rowKey: '1' }
      ]
    };
    const result = generateViewSelectorOptions(list, 'type');
    expect(result).toEqual([
      { label: 'Private', options: [{ label: 'Private Item', value: '1' }] }
    ]);
  });

  it('should return both public and private options when both exist', () => {
    const list = {
      type: [
        { type: 'type', isPublic: true, name: 'Public Item', rowKey: '1' },
        { type: 'type', isPublic: false, name: 'Private Item', rowKey: '2' }
      ]
    };
    const result = generateViewSelectorOptions(list, 'type');
    expect(result).toEqual([
      { label: 'Private', options: [{ label: 'Private Item', value: '2' }] },
      { label: 'Public', options: [{ label: 'Public Item', value: '1' }] }
    ]);
  });
});

describe('generateViewSelectorOptionsForRole', () => {
  beforeEach(() => {
    (getUser as jest.Mock).mockReturnValue({ role: 'admin' });
  });

  it('should return empty array when list is empty', () => {
    const result = generateViewSelectorOptionsForRole({}, 'type');
    expect(result).toEqual([]);
  });

  it('should return public options when items are public', () => {
    const list = {
      type: [
        { type: 'type', isPublic: true, name: 'Public Item', rowKey: '1' }
      ]
    };
    const result = generateViewSelectorOptionsForRole(list, 'type');
    expect(result).toEqual([
      { label: 'Public', options: [{ label: 'Public Item', value: '1' }] }
    ]);
  });

  it('should return private options when items are private', () => {
    const list = {
      type: [
        { type: 'type', isPublic: false, name: 'Private Item', rowKey: '1' }
      ]
    };
    const result = generateViewSelectorOptionsForRole(list, 'type');
    expect(result).toEqual([
      { label: 'Private', options: [{ label: 'Private Item', value: '1' }] }
    ]);
  });

  it('should return my role options when assigneeList equals moduleOwner', () => {
    const list = {
      type: [
        { type: 'type', isPublic: false, name: 'My Role Item', rowKey: '1', assigneeList: 'owner', moduleOwner: 'owner' }
      ]
    };
    const result = generateViewSelectorOptionsForRole(list, 'type');
    expect(result).toEqual([
      { label: 'My Role', options: [{ label: 'My Role Item', value: '1' }] }
    ]);
  });

  it('should return assign to options when moduleOwner equals current role', () => {
    const list = {
      type: [
        { type: 'type', isPublic: false, name: 'Assign To Item', rowKey: '1', assigneeList: 'assignee', moduleOwner: 'admin' }
      ]
    };
    const result = generateViewSelectorOptionsForRole(list, 'type');
    expect(result).toEqual([
      { label: 'Assigned To', options: [{ label: 'Assign To Item - assignee', value: '1' }] }
    ]);
  });

  it('should return assign by options when moduleOwner does not equal current role', () => {
    const list = {
      type: [
        { type: 'type', isPublic: false, name: 'Assign By Item', rowKey: '1', assigneeList: 'assignee', moduleOwner: 'other' }
      ]
    };
    const result = generateViewSelectorOptionsForRole(list, 'type');
    expect(result).toEqual([
      { label: 'Assigned By', options: [{ label: 'Assign By Item - other', value: '1' }] }
    ]);
  });

  it('should return all options when multiple conditions are met', () => {
    const list = {
      type: [
        { type: 'type', isPublic: true, name: 'Public Item', rowKey: '1' },
        { type: 'type', isPublic: false, name: 'Private Item', rowKey: '2' },
        { type: 'type', isPublic: false, name: 'My Role Item', rowKey: '3', assigneeList: 'owner', moduleOwner: 'owner' },
        { type: 'type', isPublic: false, name: 'Assign To Item', rowKey: '4', assigneeList: 'assignee', moduleOwner: 'admin' },
        { type: 'type', isPublic: false, name: 'Assign By Item', rowKey: '5', assigneeList: 'assignee', moduleOwner: 'other' }
      ]
    };
    const result = generateViewSelectorOptionsForRole(list, 'type');
    expect(result).toEqual([
      { label: 'Private', options: [{ label: 'Private Item', value: '2' }] },
      { label: 'Public', options: [{ label: 'Public Item', value: '1' }] },
      { label: 'My Role', options: [{ label: 'My Role Item', value: '3' }] },
      { label: 'Assigned By', options: [{ label: 'Assign By Item - other', value: '5' }] },
      { label: 'Assigned To', options: [{ label: 'Assign To Item - assignee', value: '4' }] },
    ]);
  });
});
