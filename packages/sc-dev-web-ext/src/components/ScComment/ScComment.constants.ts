import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { msg } from '../../i18n/localization.js';

/**
 * Common style constants
 */
export const none = {
  display: 'none',
};

export const moreActionsStyle = {
  display: ' flex',
  gap: '0.5rem',
  'align-items': 'center',
};

export const errorColorStyle = {
  color: 'var(--sc-button-primary-error-background-color)',
};

export const deleteStyle = {
  ...moreActionsStyle,
  ...errorColorStyle,
};

export const commentHeight = {
  height: '100px',
};

/**
 * Delete action label template
 */
export const deleteActionLabel = () => html` <div
  style=${styleMap(deleteStyle)}
  class="more-actions-item"
>
  <sc-icon name="trash--line" size="sm"></sc-icon>
  <span>${msg('Delete', { id: 'sc-comment-delete' })}</span>
</div>`;

/**
 * Reminder action label template
 */
export const reminderActionLabel = () => html` <div
  style=${styleMap(moreActionsStyle)}
  class="more-actions-item"
>
  <sc-icon name="timer-clock--line" size="sm"></sc-icon>
  <span>${msg('Set reminder', { id: 'sc-comment-set-reminder' })}</span>
</div>`;

/**
 * Mark action label template
 */
export const markActionLabel = () => html` <div
  style=${styleMap(moreActionsStyle)}
  class="more-actions-item"
>
  <sc-icon name="checkmark-circle--line" size="sm"></sc-icon>
  <span>${msg('Mark status', { id: 'sc-comment-mark-status' })}</span>
</div>`;

/**
 * Built-in default poster (view) options
 */
export const DEFAULT_POSTER_OPTIONS = (): Array<{
  label: string;
  value: string;
}> => [
  { label: msg('All', { id: 'sc-comment-poster-all' }), value: 'all' },
  { label: msg('Mine', { id: 'sc-comment-poster-mine' }), value: 'mine' },
];

/**
 * Built-in default sorter options
 */
export const DEFAULT_SORTER_OPTIONS = (): Array<{
  label: string;
  value: string;
}> => [
  { label: msg('Newest', { id: 'sc-comment-sorter-newest' }), value: 'newest' },
  { label: msg('Oldest', { id: 'sc-comment-sorter-oldest' }), value: 'oldest' },
];

/**
 * Filter options for poster
 */
export const poster: Array<{ label: string; value: string }> = [];

/**
 * Sort options for comments
 */
export const sorter: Array<{ label: string; value: string }> = [];
