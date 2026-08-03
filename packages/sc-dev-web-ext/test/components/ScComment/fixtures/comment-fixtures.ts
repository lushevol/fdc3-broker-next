import type { Comment, UserInfo } from '../../../../src/components/ScComment/ScComment.types.js';
import type { CommentAttachment } from '../../../../src/components/ScComment/types/comment-attachment.js';

export const baseUser: UserInfo = {
  bankid: 'user-1',
  name: 'Test User',
  avatarUrl: '',
};

export const otherUser: UserInfo = {
  bankid: 'user-2',
  name: 'Other User',
  avatarUrl: '',
};

export const imageAttachment: CommentAttachment = {
  id: 'att-1',
  commentId: 'c-1',
  fileName: 'preview.png',
  fileSize: 1024,
  fileType: 'image/png',
  fileUrl: 'https://example.com/preview.png',
  uploadedBy: baseUser.bankid,
  uploadedAt: new Date('2026-03-01T10:00:00.000Z'),
};

export const sampleComments: Comment[] = [
  {
    id: 'c-1',
    text: '<p>Hello</p>',
    createdAt: new Date('2026-03-01T10:00:00.000Z'),
    user: baseUser,
    attachments: [imageAttachment],
  },
  {
    id: 'c-2',
    parentID: 'c-1',
    text: '<p>Reply</p>',
    createdAt: new Date('2026-03-01T11:00:00.000Z'),
    user: otherUser,
  },
];
