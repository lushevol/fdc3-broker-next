/* eslint-disable no-duplicate-imports */
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { CountryIconLibrary, MainIconLibrary } from '@scdevkit/icons';
import { Provider } from './utils/Provider.js';

// Dummy user and comment data for demonstration
const demoUser = {
  bankid: '123456',
  name: 'Alice Lee',
  avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
};

const demoComments = [
  {
    id: 'c1',
    text: 'This is a top-level comment.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    user: demoUser,
    likes: 2,
    likedByCurrentUser: false,
    status: 'resolved',
    replies: [],
  },
  {
    id: 'c1r1',
    text: 'A reply to the top-level comment.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    user: {
      bankid: '654321',
      name: 'Bob Chan',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    parentID: 'c1',
    likes: 1,
    likedByCurrentUser: true,
    mentions: [{ id: 'e-1001', name: 'Alice Lee' }],
    replies: [],
  },
  {
    id: 'c2',
    text: 'Another top-level comment with a reminder set.',
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    user: {
      bankid: '789012',
      name: 'Carol Ng',
      avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    reminderAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
    likes: 0,
    likedByCurrentUser: false,
    replies: [],
  },
];

// Demo actions for the actions prop
interface DemoAction {
  icon: string;
  label: string;
  handler: (comment: { text: string }) => void;
}

const demoActions: DemoAction[] = [
  {
    icon: 'copy--line',
    label: 'Copy text',
    handler: (comment: { text: string }) => {
      navigator.clipboard.writeText(comment.text);
    },
  },
];

const demoMoreActions = [
  {
    id: 'flag',
    label: 'Flag',
    icon: 'flag--line',
    handler: (_comment: { text: string }) => {
      alert('you triggered flag action');
    },
  },
];

const demoViewOptions = [
  { label: 'Assigned to me', value: 'assigned' },
  { label: 'Mentions', value: 'mentions' },
];

const demoSortOptions = [
  { label: 'Most liked', value: 'liked' },
  { label: 'Most replies', value: 'replies' },
];

const demoReminderConfig = {
  options: [
    { label: 'Completed', value: 'completed' },
    { label: 'Closed', value: 'closed' },
  ],
  defaultStatus: 'completed',
};

export default {
  title: 'Business Components/Comment',
  component: 'sc-comment',
  parameters: {
    docs: {
      description: {
        component:
          'Comment component for discussion threads, supporting replies, likes, and more.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    userInfo: {
      control: 'object',
      description: `Current user info


  {

      bankid: string;

      name: string;

      avatarUrl?: string;

  }

      `,
      table: { type: { summary: 'UserInfo' }, category: 'Attributes' },
    },
    comments: {
      control: 'object',
      description: `Array of comments

  {
      
      id: string;

      text: string;

      createdAt: Date;

      updatedAt?: Date;

      user: UserInfo;

      parentID?: string;

      likes?: number;

      likedByCurrentUser?: boolean;

      saved?: boolean;

      reported?: boolean;

  }

      `,
      table: { type: { summary: 'Comment[]' }, category: 'Attributes' },
    },
    'enable-like': {
      control: 'boolean',
      description: 'Enable like button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'enable-edit': {
      control: 'boolean',
      description: 'Enable edit button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'enable-api': {
      control: 'boolean',
      description: 'Enable backend API requests',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'enable-delete': {
      control: 'boolean',
      description: 'Enable Delete option in the more-actions dropdown',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'enable-share': {
      control: 'boolean',
      description: 'Enable share button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'enable-report': {
      control: 'boolean',
      description: 'Enable report button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'enable-upload': {
      control: 'boolean',
      description: 'Enable file attachments upload (total switch)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'enable-file-delete': {
      control: 'boolean',
      description: 'Allow deleting uploaded attachments in edit mode',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'single-file-upload': {
      control: 'boolean',
      description:
        'Restrict to single file upload per comment. ' +
        'false (default) = allow multiple files; true = single file only',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'max-files-per-comment': {
      control: 'number',
      description: 'Maximum number of files per comment',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'Infinity' },
        category: 'Attributes',
      },
    },
    'accepted-file-types': {
      control: 'text',
      description: 'Accepted file types (e.g., ".pdf,.jpg,.png")',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'disable-file-download': {
      control: 'boolean',
      description: 'Disable file download button. false (default) = download allowed; true = download hidden/disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    compact: {
      control: 'boolean',
      description: 'Use compact mode with smaller width space or smaller screen size',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'compact-reply-mode': {
      control: 'boolean',
      description:
        'Use compact inline rich-text-editor (sc-rich-text-editor-v2) ' +
        'for reply/edit instead of plain text input',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'manual-sorting': {
      control: 'boolean',
      description:
        'Manual sorting mode. false (default) = component handles filter/sort ' +
        'internally; true = host handles via sc-view-sort-change event',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    readonly: {
      control: 'boolean',
      description: 'Set comment section to read-only mode',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'hide-view-condition': {
      control: 'boolean',
      description: 'Hide the view condition filter',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'hide-sort-by': {
      control: 'boolean',
      description: 'Hide the sort by filter',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'enable-reminder': {
      control: 'boolean',
      description: 'Enable Reminder action in the more-actions dropdown',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'enable-mark': {
      control: 'boolean',
      description: 'Enable marking the status in the more-actions dropdown',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'hide-avatar': {
      control: 'boolean',
      description: 'Hide the avatar displayed alongside each comment.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    maxRepliesdepth: {
      control: 'number',
      description: 'Max reply nesting depth',
      table: { type: { summary: 'number' }, defaultValue: { summary: 3 }, category: 'Properties' },
    },
    maxVisibleReplies: {
      control: 'number',
      description: 'Max visible replies before collapse',
      table: { type: { summary: 'number' }, defaultValue: { summary: 2 }, category: 'Properties' },
    },
    viewOptions: {
      control: 'object',
      description: 'Extra View options appended after built-in All/Mine. Set via JS property only',
      table: { type: { summary: 'ToolbarOption[]' }, defaultValue: { summary: '[]' }, category: 'Properties' },
    },
    sortOptions: {
      control: 'object',
      description:
        'Extra Sort By options appended after built-in Newest/Oldest. Set via JS property only',
      table: { type: { summary: 'ToolbarOption[]' }, defaultValue: { summary: '[]' }, category: 'Properties' },
    },
    toolbar: {
      control: 'object',
      description: 'Rich text toolbar config forwarded to sc-rich-text-editor-v2. Set via JS property only',
      table: { type: { summary: 'Array<any>' }, defaultValue: { summary: '[]' }, category: 'Properties' },
    },
    moreActions: {
      control: 'object',
      description: 'Custom actions in the per-comment dropdown',
      table: { type: { summary: 'CommentAction[]' }, defaultValue: { summary: '[]' }, category: 'Properties' },
    },
    reminderConfig: {
      control: 'object',
      description: 'Reminder modal configuration (options + default status)',
      table: { type: { summary: 'ReminderConfig' }, category: 'Properties' },
    },
    actions: {
      control: 'object',
      description: 'Custom actions for each comment',
      table: { type: { summary: 'Action[]' }, defaultValue: { summary: '[]' }, category: 'Properties' },
    },
    // --- Custom Events ---
    'sc-change': {
      description:
        'Emitted when comments are added or changed. detail: { allComments }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-view-sort-change': {
      description:
        'Emitted when View or Sort By changes. detail: { poster, sorter }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-filter-change': {
      description: 'Emitted when View changes. detail: { poster }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-sort-change': {
      description: 'Emitted when Sort By changes. detail: { sorter }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-toggle-replies': {
      description:
        'Emitted when replies are expanded/collapsed. detail: { commentId, expanded }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-action-trigger': {
      description:
        'Emitted when a more-actions item is selected. detail: { value, comment }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-comment-like': {
      description:
        'Emitted when a comment is liked/unliked. detail: { comment }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-comment-share': {
      description:
        'Emitted when share is clicked on a comment. detail: { comment }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-comment-report': {
      description:
        'Emitted when report is clicked on a comment. detail: { comment }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-reminder-trigger': {
      description:
        'Emitted when reminder triggers. detail: { commentId, scheduledAt, targetStatus }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-comment-file-error': {
      description:
        'Emitted when file upload fails. ' +
        'detail: { errorType, errorMessage, commentId, fileCount, fileNames, timestamp }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-comment-file-upload': {
      description:
        'Emitted when file upload succeeds. detail: { files, attachments, comment, uploadCount, totalAttachments }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-comment-file-download': {
      description:
        'Emitted when file download is clicked. detail: { attachment }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-attachment-preview': {
      description:
        'Emitted when an image attachment thumbnail is clicked. detail: { commentId, attachment }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-comment-file-delete': {
      description:
        'Emitted when attachments are deleted during edit. ' +
        'detail: { deletedAttachments, comment, deleteCount, remainingAttachments }',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },

  args: {
    'enable-like': false,
    'enable-edit': false,
    'enable-api': false,
    'enable-delete': false,
    'enable-share': false,
    'enable-report': false,
    'enable-upload': false,
    'enable-file-delete': false,
    'single-file-upload': false,
    'max-files-per-comment': Infinity,
    'accepted-file-types': undefined,
    'disable-file-download': false,
    compact: false,
    'compact-reply-mode': false,
    'manual-sorting': false,
    'hide-view-condition': false,
    'hide-sort-by': false,
    readonly: false,
    maxRepliesdepth: 3,
    maxVisibleReplies: 2,
    viewOptions: [],
    sortOptions: [],
    toolbar: [],
    actions: [],
    moreActions: [],
    'enable-reminder': false,
    'enable-mark': false,
    'hide-avatar': false,
    reminderConfig: undefined,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  userInfo?: any;
  comments?: any[];
  'enable-like'?: boolean;
  'enable-edit'?: boolean;
  'enable-api'?: boolean;
  'enable-delete'?: boolean;
  'enable-share'?: boolean;
  'enable-report'?: boolean;
  'enable-upload'?: boolean;
  'enable-file-delete'?: boolean;
  'single-file-upload'?: boolean;
  'max-files-per-comment'?: number;
  'accepted-file-types'?: string;
  'disable-file-download'?: boolean;
  'compact'?: boolean;
  'compact-reply-mode'?: boolean;
  'manual-sorting'?: boolean;
  readonly?: boolean;
  'hide-view-condition'?: boolean;
  'hide-sort-by'?: boolean;
  maxRepliesdepth?: number;
  maxVisibleReplies?: number;
  actions?: any[];
  moreActions?: any[];
  viewOptions?: any[];
  sortOptions?: any[];
  toolbar?: any[];
  'enable-reminder'?: boolean;
  'enable-mark'?: boolean;
  'hide-avatar'?: boolean;
  reminderConfig?: any;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  const handleChange = (event: CustomEvent) => {
    const target = event.currentTarget as { comments?: unknown } | null;
    if (target) {
      target.comments = event.detail?.allComments ?? [];
    }
  };

  return Provider(html`
    <sc-icon-provider .iconLibraries=${[CountryIconLibrary, MainIconLibrary]}>
      <sc-comment
        style=${props.compact ? 'width:404px;margin:auto;' : 'width:100%;'}
        .userInfo=${props.userInfo}
        .comments=${props.comments}
        @sc-change=${handleChange}
        ?enable-like=${props['enable-like']}
        ?enable-edit=${props['enable-edit']}
        ?enable-api=${props['enable-api']}
        ?enable-delete=${props['enable-delete']}
        ?enable-share=${props['enable-share']}
        ?enable-report=${props['enable-report']}
        ?enable-upload=${props['enable-upload']}
        ?enable-file-delete=${props['enable-file-delete']}
        ?single-file-upload=${props['single-file-upload']}
        .maxFilesPerComment=${Number(props['max-files-per-comment'])}
        accepted-file-types=${ifDefined(props['accepted-file-types'])}
        ?disable-file-download=${props['disable-file-download']}
        ?compact=${props['compact']}
        ?compact-reply-mode=${props['compact-reply-mode']}
        ?manual-sorting=${props['manual-sorting']}
        ?readonly=${props['readonly']}
        ?hide-view-condition=${props['hide-view-condition']}
        ?hide-sort-by=${props['hide-sort-by']}
        .maxRepliesdepth=${props.maxRepliesdepth}
        .maxVisibleReplies=${props.maxVisibleReplies}
        .actions=${props.actions ?? []}
        .moreActions=${props.moreActions ?? []}
        .viewOptions=${props.viewOptions ?? []}
        .sortOptions=${props.sortOptions ?? []}
        .toolbar=${props.toolbar ?? []}
        ?enable-reminder=${props['enable-reminder']}
        ?enable-mark=${props['enable-mark']}
        ?hide-avatar=${props['hide-avatar']}
        .reminderConfig=${props.reminderConfig}
        style="max-width: 800px; margin: 2rem auto;"
      ></sc-comment>
    </sc-icon-provider>
  `);
};

export const Default = Template.bind({});
Default.args = {
  userInfo: demoUser,
  comments: demoComments,
  actions: demoActions,
};
export const WithAttachment = Template.bind({});
WithAttachment.args = {
  userInfo: demoUser,
  comments: demoComments,
  'enable-upload': true,
  'enable-edit': true,
  'enable-file-delete': true,
  'single-file-upload': false, // false = allow multiple files (default)
  'disable-file-download': false, // false = download allowed (default)
};

export const ManualSorting = Template.bind({});
ManualSorting.args = {
  userInfo: demoUser,
  comments: demoComments,
  'manual-sorting': true,
  viewOptions: demoViewOptions,
  sortOptions: demoSortOptions,
};

export const Compact = Template.bind({});
Compact.args = {
  userInfo: demoUser,
  comments: demoComments,
  'enable-edit': true,
  compact: true,
};

export const RequestAPI = Template.bind({});
RequestAPI.args = {
  userInfo: demoUser,
  comments: demoComments,
  'enable-api': true,
  'enable-edit': true,
  'enable-delete': true,
  'enable-like': true,
};

export const ReminderAndMoreActions = Template.bind({});
ReminderAndMoreActions.args = {
  userInfo: demoUser,
  comments: demoComments,
  'enable-reminder': true,
  reminderConfig: demoReminderConfig,
  'enable-delete': true,
  moreActions: demoMoreActions,
};
