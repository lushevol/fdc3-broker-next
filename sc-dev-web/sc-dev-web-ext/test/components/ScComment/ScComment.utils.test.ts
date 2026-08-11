import { expect } from '@open-wc/testing';
import { ScCommentUtils } from '../../../src/components/ScComment/ScComment.utils.js';
import type { Comment } from '../../../src/components/ScComment/ScComment.types.js';

type LooseComment = {
  id: string;
  text: string;
  user: { bankid: string; name: string };
  createdAt?: Date | string;
  createdDate?: string;
  parentID?: string;
};

const user = {
  bankid: 'u1',
  name: 'Tester',
};

describe('ScCommentUtils.finalizedComments date sorting', () => {
  it('sorts by newest when createdAt is a string', () => {
    const comments = [
      {
        id: 'old',
        text: 'old',
        user,
        createdAt: '2024-06-01T10:00:00Z',
      },
      {
        id: 'new',
        text: 'new',
        user,
        createdAt: '2024-06-01T12:00:00Z',
      },
    ] as unknown as Comment[];

    const result = ScCommentUtils.finalizedComments(
      comments,
      'all',
      'newest',
      user.bankid
    );

    expect(result.map(c => c.id)).to.deep.equal(['new', 'old']);
  });

  it('sorts by oldest when createdAt is Date', () => {
    const comments = [
      {
        id: 'new',
        text: 'new',
        user,
        createdAt: new Date('2024-06-01T12:00:00Z'),
      },
      {
        id: 'old',
        text: 'old',
        user,
        createdAt: new Date('2024-06-01T10:00:00Z'),
      },
    ] as unknown as Comment[];

    const result = ScCommentUtils.finalizedComments(
      comments,
      'all',
      'oldest',
      user.bankid
    );

    expect(result.map(c => c.id)).to.deep.equal(['old', 'new']);
  });

  it('falls back to createdDate when createdAt is missing', () => {
    const comments: LooseComment[] = [
      {
        id: 'a',
        text: 'a',
        user,
        createdDate: '2024-06-01T10:00:00Z',
      },
      {
        id: 'b',
        text: 'b',
        user,
        createdDate: '2024-06-01T11:00:00Z',
      },
    ];

    const result = ScCommentUtils.finalizedComments(
      comments as unknown as Comment[],
      'all',
      'newest',
      user.bankid
    );

    expect(result.map(c => c.id)).to.deep.equal(['b', 'a']);
  });

  it('does not throw for invalid date input and keeps output stable', () => {
    const comments: LooseComment[] = [
      {
        id: 'invalid',
        text: 'invalid',
        user,
        createdAt: 'not-a-date',
      },
      {
        id: 'valid',
        text: 'valid',
        user,
        createdAt: '2024-06-01T12:00:00Z',
      },
    ];

    expect(() =>
      ScCommentUtils.finalizedComments(
        comments as unknown as Comment[],
        'all',
        'newest',
        user.bankid
      )
    ).to.not.throw();

    const result = ScCommentUtils.finalizedComments(
      comments as unknown as Comment[],
      'all',
      'newest',
      user.bankid
    );

    expect(result[0].id).to.equal('valid');
  });
});
