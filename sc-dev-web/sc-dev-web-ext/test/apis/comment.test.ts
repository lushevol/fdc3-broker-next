import { expect } from '@open-wc/testing';
import {
  getComments,
  getComment,
  createComment,
  updateComment,
  likeComment,
  unlikeComment,
  deleteComment,
} from '../../src/apis/comment.js';

const NAME_SPACE = '_55313_128_webkit_exp_api';

// ─── Helpers ───────────────────────────────────────────────────────────────

const mockResponse = (data: any) =>
  jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ data }),
  });

const mockError = (message: string) =>
  jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ errors: [{ message }] }),
  });

const mockNetworkError = () =>
  jest.fn().mockRejectedValue(new Error('Network Error'));

// ─── Fixtures ──────────────────────────────────────────────────────────────

const commentItem = {
  content: '我是内容',
  createdDate: '2026-04-29T10:11:59.069125Z',
  id: '8e49463f-8bc8-4cbe-8e5a-6a7dd3025417',
  likedByCurrentUser: false,
  likes: 0,
  mentions: ['111'],
  parentId: '222',
  referenceId: '123',
  reminderTimeList: [],
  reported: false,
  saved: false,
  status: null,
  updatedDate: '2026-04-29T10:11:59.069125Z',
  userId: '1234567',
};

const commentListResponse = {
  [NAME_SPACE]: {
    get_comments: {
      page: 0,
      size: 20,
      sort: '',
      total: 1,
      view: 'ALL',
      items: [commentItem],
    },
  },
};

// ─── getComments ────────────────────────────────────────────────────────────

describe('getComments', () => {
  it('should resolve with comment list on success', async () => {
    const request = mockResponse(commentListResponse);
    const result: any = await getComments(request, { referenceId: '123' });
    expect(result.items).to.have.length(1);
    expect(result.items[0].id).to.equal(commentItem.id);
  });

  it('should use default params when not provided', async () => {
    const request = mockResponse(commentListResponse);
    await getComments(request, { referenceId: '123' });
    const query: string = request.mock.calls[0][0];
    expect(query).to.include('page: 0');
    expect(query).to.include('size: 20');
    expect(query).to.include('view: "All"');
  });

  it('should use provided params in the query', async () => {
    const request = mockResponse(commentListResponse);
    await getComments(request, { referenceId: 'ref-1', page: 2, size: 5, sort: 'newest', view: 'Mine' });
    const query: string = request.mock.calls[0][0];
    expect(query).to.include('page: 2');
    expect(query).to.include('size: 5');
    expect(query).to.include('sort: "newest"');
    expect(query).to.include('view: "Mine"');
    expect(query).to.include('referenceId: "ref-1"');
  });

  it('should reject with error message from GraphQL errors', async () => {
    const request = mockError('Unauthorized');
    try {
      await getComments(request, { referenceId: '123' });
      expect.fail('should have thrown');
    } catch (e: any) {
      expect(e.message).to.equal('Unauthorized');
    }
  });

  it('should reject on network error', async () => {
    const request = mockNetworkError();
    try {
      await getComments(request, { referenceId: '123' });
      expect.fail('should have thrown');
    } catch (e: any) {
      expect(e.message).to.equal('Network Error');
    }
  });
});

// ─── getComment ─────────────────────────────────────────────────────────────

describe('getComment', () => {
  const singleCommentResponse = {
    [NAME_SPACE]: {
      get_comment: { comment: commentItem },
    },
  };

  it('should resolve with comment object on success', async () => {
    const request = mockResponse(singleCommentResponse);
    const result: any = await getComment(request, commentItem.id);
    expect(result.comment.id).to.equal(commentItem.id);
  });

  it('should pass id and includeReplies to the query', async () => {
    const request = mockResponse(singleCommentResponse);
    await getComment(request, commentItem.id, true);
    const query: string = request.mock.calls[0][0];
    expect(query).to.include(`id: "${commentItem.id}"`);
    expect(query).to.include('includeReplies: true');
  });

  it('should default includeReplies to false', async () => {
    const request = mockResponse(singleCommentResponse);
    await getComment(request, commentItem.id);
    const query: string = request.mock.calls[0][0];
    expect(query).to.include('includeReplies: false');
  });

  it('should reject with GraphQL error message', async () => {
    const request = mockError('Comment not found');
    try {
      await getComment(request, 'invalid-id');
      expect.fail('should have thrown');
    } catch (e: any) {
      expect(e.message).to.equal('Comment not found');
    }
  });
});

// ─── createComment ──────────────────────────────────────────────────────────

describe('createComment', () => {
  const createResponse = {
    [NAME_SPACE]: {
      post_createComment: commentItem,
    },
  };

  it('should resolve with created comment on success', async () => {
    const request = mockResponse(createResponse);
    const result: any = await createComment(request, {
      mentions: ['111'],
      referenceId: '123',
      text: '<p>Hello</p>',
    });
    expect(result.id).to.equal(commentItem.id);
  });

  it('should pass text as variable (not inline) to handle rich text', async () => {
    const request = mockResponse(createResponse);
    const richText = '<p><span class="sc-mention" data-mention-id="123">@User</span></p>';
    await createComment(request, { mentions: [], referenceId: '123', text: richText });
    const variables = request.mock.calls[0][1];
    expect(variables.text).to.equal(richText);
    const query: string = request.mock.calls[0][0];
    expect(query).to.include('$text');
    expect(query).not.to.include(richText);
  });

  it('should include mentions in query', async () => {
    const request = mockResponse(createResponse);
    await createComment(request, { mentions: ['u1', 'u2'], referenceId: '123', text: 'hi' });
    const query: string = request.mock.calls[0][0];
    expect(query).to.include('"u1"');
    expect(query).to.include('"u2"');
  });

  it('should include parentId when provided', async () => {
    const request = mockResponse(createResponse);
    await createComment(request, { mentions: [], parentId: 'parent-1', referenceId: '123', text: 'reply' });
    const query: string = request.mock.calls[0][0];
    expect(query).to.include('parentId: "parent-1"');
  });

  it('should include reminderTimeList when provided', async () => {
    const request = mockResponse(createResponse);
    await createComment(request, {
      mentions: [],
      referenceId: '123',
      text: 'hi',
      reminderTimeList: ['2026-05-01T10:00:00'],
    });
    const query: string = request.mock.calls[0][0];
    expect(query).to.include('"2026-05-01T10:00:00"');
  });

  it('should reject with GraphQL error message', async () => {
    const request = mockError('Forbidden');
    try {
      await createComment(request, { mentions: [], referenceId: '123', text: 'hi' });
      expect.fail('should have thrown');
    } catch (e: any) {
      expect(e.message).to.equal('Forbidden');
    }
  });
});

// ─── updateComment ──────────────────────────────────────────────────────────

describe('updateComment', () => {
  const updateResponse = {
    [NAME_SPACE]: {
      put_updateComment: { ...commentItem, content: 'updated text' },
    },
  };

  it('should resolve with updated comment on success', async () => {
    const request = mockResponse(updateResponse);
    const result: any = await updateComment(request, {
      id: commentItem.id,
      mentions: ['111'],
      text: 'updated text',
    });
    expect(result.content).to.equal('updated text');
  });

  it('should pass text as variable to handle rich text', async () => {
    const request = mockResponse(updateResponse);
    const richText = '<p>updated <b>bold</b></p>';
    await updateComment(request, { id: commentItem.id, mentions: [], text: richText });
    const variables = request.mock.calls[0][1];
    expect(variables.text).to.equal(richText);
  });

  it('should include id and mentions in query', async () => {
    const request = mockResponse(updateResponse);
    await updateComment(request, { id: 'cmt-1', mentions: ['u1'], text: 'hi' });
    const query: string = request.mock.calls[0][0];
    expect(query).to.include('id: "cmt-1"');
    expect(query).to.include('"u1"');
  });

  it('should reject with GraphQL error message', async () => {
    const request = mockError('Not found');
    try {
      await updateComment(request, { id: 'invalid', mentions: [], text: 'hi' });
      expect.fail('should have thrown');
    } catch (e: any) {
      expect(e.message).to.equal('Not found');
    }
  });
});

// ─── likeComment ────────────────────────────────────────────────────────────

describe('likeComment', () => {
  const likeResponse = {
    [NAME_SPACE]: {
      put_likeComment: { likedByCurrentUser: true, likes: 1 },
    },
  };

  it('should resolve with updated like state on success', async () => {
    const request = mockResponse(likeResponse);
    const result: any = await likeComment(request, commentItem.id);
    expect(result.likedByCurrentUser).to.be.true;
    expect(result.likes).to.equal(1);
  });

  it('should include comment id in query', async () => {
    const request = mockResponse(likeResponse);
    await likeComment(request, 'cmt-1');
    const query: string = request.mock.calls[0][0];
    expect(query).to.include('id: "cmt-1"');
  });

  it('should reject with GraphQL error message', async () => {
    const request = mockError('Unauthorized');
    try {
      await likeComment(request, commentItem.id);
      expect.fail('should have thrown');
    } catch (e: any) {
      expect(e.message).to.equal('Unauthorized');
    }
  });
});

// ─── unlikeComment ──────────────────────────────────────────────────────────

describe('unlikeComment', () => {
  const unlikeResponse = {
    [NAME_SPACE]: {
      put_unlikeComment: { likedByCurrentUser: false, likes: 0 },
    },
  };

  it('should resolve with updated unlike state on success', async () => {
    const request = mockResponse(unlikeResponse);
    const result: any = await unlikeComment(request, commentItem.id);
    expect(result.likedByCurrentUser).to.be.false;
    expect(result.likes).to.equal(0);
  });

  it('should include comment id in query', async () => {
    const request = mockResponse(unlikeResponse);
    await unlikeComment(request, 'cmt-1');
    const query: string = request.mock.calls[0][0];
    expect(query).to.include('id: "cmt-1"');
  });

  it('should reject with GraphQL error message', async () => {
    const request = mockError('Unauthorized');
    try {
      await unlikeComment(request, commentItem.id);
      expect.fail('should have thrown');
    } catch (e: any) {
      expect(e.message).to.equal('Unauthorized');
    }
  });
});

// ─── deleteComment ──────────────────────────────────────────────────────────

describe('deleteComment', () => {
  const deleteResponse = {
    [NAME_SPACE]: {
      delete_removeComment: { message: 'Comment removed successfully', success: true },
    },
  };

  it('should resolve with success true on successful deletion', async () => {
    const request = mockResponse(deleteResponse);
    const result: any = await deleteComment(request, commentItem.id);
    expect(result.success).to.be.true;
    expect(result.message).to.equal('Comment removed successfully');
  });

  it('should include comment id in query', async () => {
    const request = mockResponse(deleteResponse);
    await deleteComment(request, 'cmt-1');
    const query: string = request.mock.calls[0][0];
    expect(query).to.include('id: "cmt-1"');
  });

  it('should reject with GraphQL error message', async () => {
    const request = mockError('Permission denied');
    try {
      await deleteComment(request, commentItem.id);
      expect.fail('should have thrown');
    } catch (e: any) {
      expect(e.message).to.equal('Permission denied');
    }
  });

  it('should reject on network error', async () => {
    const request = mockNetworkError();
    try {
      await deleteComment(request, commentItem.id);
      expect.fail('should have thrown');
    } catch (e: any) {
      expect(e.message).to.equal('Network Error');
    }
  });
});