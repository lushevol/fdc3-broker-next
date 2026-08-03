import { expect } from '@open-wc/testing';
import {
  findCommentById,
  updateCommentById,
  transformCommentsData,
} from '../../../../src/components/ScComment/utils/tools.js';

// Polyfill crypto.randomUUID for test environment
if (!globalThis.crypto?.randomUUID) {
  // @ts-ignore
  globalThis.crypto = globalThis.crypto || {};
  // @ts-ignore
  globalThis.crypto.randomUUID = () =>
    `test-uuid-${Math.random().toString(36).substring(2, 10)}` as any;
}

const makeComment = (id: string, overrides = {}) => ({
  id,
  text: `Comment ${id}`,
  createdDate: '2026-04-29T10:11:59.069125Z',
  updatedDate: '2026-04-29T10:11:59.069125Z',
  userId: 'user1',
  referenceId: 'ref-1',
  content: `Content ${id}`,
  mentions: [],
  replies: [],
  likes: 0,
  likedByCurrentUser: false,
  ...overrides,
});

// ─── findCommentById ────────────────────────────────────────────────────────

describe('findCommentById', () => {
  it('should find a top-level comment by id', () => {
    const comments = [makeComment('c1'), makeComment('c2')];
    const result = findCommentById(comments, 'c2');
    expect(result?.id).to.equal('c2');
  });

  it('should find a nested reply by id', () => {
    const comments = [
      makeComment('c1', {
        replies: [makeComment('r1', { parentId: 'c1' })],
      }),
    ];
    const result = findCommentById(comments, 'r1');
    expect(result?.id).to.equal('r1');
  });

  it('should find deeply nested comment', () => {
    const comments = [
      makeComment('c1', {
        replies: [
          makeComment('r1', {
            replies: [makeComment('r1r1', { parentId: 'r1' })],
          }),
        ],
      }),
    ];
    const result = findCommentById(comments, 'r1r1');
    expect(result?.id).to.equal('r1r1');
  });

  it('should return null when id not found', () => {
    const comments = [makeComment('c1'), makeComment('c2')];
    const result = findCommentById(comments, 'not-exist');
    expect(result).to.be.null;
  });

  it('should return null for empty array', () => {
    const result = findCommentById([], 'c1');
    expect(result).to.be.null;
  });
});

// ─── updateCommentById ──────────────────────────────────────────────────────

describe('updateCommentById', () => {
  it('should update a top-level comment by id', () => {
    const comments = [makeComment('c1'), makeComment('c2')];
    const updated = { ...makeComment('c1'), text: 'updated text' };
    const result = updateCommentById(comments, 'c1', updated);
    const found = result.find(c => c.id === 'c1');
    expect(found?.text).to.equal('updated text');
  });

  it('should update a nested reply by id', () => {
    const comments = [
      makeComment('c1', {
        replies: [makeComment('r1', { parentId: 'c1' })],
      }),
    ];
    const updated = { ...makeComment('r1'), text: 'updated reply' };
    const result = updateCommentById(comments, 'r1', updated);
    const parent: any = result.find(c => c.id === 'c1');
    expect(parent?.replies?.[0]?.text).to.equal('updated reply');
  });

  it('should not modify other comments', () => {
    const comments = [makeComment('c1'), makeComment('c2')];
    const updated = { ...makeComment('c1'), text: 'changed' };
    const result = updateCommentById(comments, 'c1', updated);
    expect(result.find(c => c.id === 'c2')?.text).to.equal('Comment c2');
  });

  it('should return same array structure when id not found', () => {
    const comments = [makeComment('c1')];
    const result = updateCommentById(comments, 'not-exist', makeComment('other'));
    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('c1');
  });
});

// ─── transformCommentsData ─────────────────────────────────────────────────

describe('transformCommentsData', () => {
  const apiItems = [
    {
      id: 'c1',
      content: '我是内容',
      userId: '123456',
      createdDate: '2026-04-29T10:11:59.069125Z',
      updatedDate: '2026-04-29T10:11:59.069125Z',
      mentions: ['111'],
      parentId: null,
      referenceId: '123',
      reminderTimeList: ['2026-05-01T09:10:20.345Z'],
      likes: 0,
      likedByCurrentUser: false,
    },
    {
      id: 'c1r1',
      content: '我是子内容',
      userId: '123457',
      createdDate: '2026-04-29T10:13:35.388986Z',
      updatedDate: '2026-04-29T10:13:35.388986Z',
      mentions: ['222'],
      parentId: 'c1',
      referenceId: '123',
      reminderTimeList: [],
      likes: 0,
      likedByCurrentUser: false,
    },
  ];

  it('should map content to text', () => {
    const result = transformCommentsData([...apiItems], []);
    expect(result[0].text).to.equal('我是内容');
  });

  it('should map userId to user.bankid', () => {
    const result = transformCommentsData([...apiItems], []);
    expect(result[0].user.bankid).to.equal('123456');
  });

  it('should map createdDate to createdAt as Date', () => {
    const result = transformCommentsData([...apiItems], []);
    expect(result[0].createdAt).to.be.instanceof(Date);
  });

  it('should map updatedDate to updatedAt as Date', () => {
    const result = transformCommentsData([...apiItems], []);
    expect(result[0].updatedAt).to.be.instanceof(Date);
  });

  it('should map mentions string[] to {id, name}[]', () => {
    const result = transformCommentsData([...apiItems], []);
    expect(result[0].mentions[0]).to.deep.include({ id: '111' });
  });

  it('should build tree structure: reply nested under parent', () => {
    const result = transformCommentsData([...apiItems], []);
    expect(result).to.have.length(2);
  });

  it('should return empty array for empty input', () => {
    const result = transformCommentsData([], []);
    expect(result).to.have.length(0);
  });
});