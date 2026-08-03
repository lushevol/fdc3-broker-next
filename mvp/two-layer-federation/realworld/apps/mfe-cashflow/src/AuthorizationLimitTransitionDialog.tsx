import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { AuthorizationLimitAction } from './authorization-limits-policy';
import type { AuthorizationLimitRecord } from './authorization-limits-repository';
import { ScAlert, ScButton, ScDialog, ScParagraph } from './webkit';

export type AuthorizationLimitTransitionAction = Exclude<
  AuthorizationLimitAction,
  'create' | 'edit'
>;

interface TransitionPresentation {
  readonly trigger: string;
  readonly title: string;
  readonly confirmLabel: string;
  readonly tone: 'default' | 'danger';
  readonly message: string;
  readonly success: string;
}

export const authorizationLimitTransitionPresentation: Readonly<
  Record<AuthorizationLimitTransitionAction, TransitionPresentation>
> = Object.freeze({
  delete: {
    trigger: 'Delete Authorization Limit',
    title: 'Delete Authorization Limit?',
    confirmLabel: 'Delete',
    tone: 'danger',
    message: 'Submit this confirmed record for deletion?',
    success: 'Authorization Limit deletion submitted.',
  },
  'approve-add': {
    trigger: 'Approve Add',
    title: 'Approve Add?',
    confirmLabel: 'Create',
    tone: 'default',
    message: 'Approve creation of this Authorization Limit?',
    success: 'Authorization Limit addition approved.',
  },
  'reject-add': {
    trigger: 'Reject Add',
    title: 'Reject Add?',
    confirmLabel: 'Reject Add',
    tone: 'danger',
    message: 'Reject creation of this Authorization Limit?',
    success: 'Authorization Limit addition rejected.',
  },
  'approve-edit': {
    trigger: 'Approve Edit',
    title: 'Approve Edit?',
    confirmLabel: 'Approve',
    tone: 'default',
    message: 'Approve the pending Authorization Limit modification?',
    success: 'Authorization Limit modification approved.',
  },
  'reject-edit': {
    trigger: 'Reject Edit',
    title: 'Reject Edit?',
    confirmLabel: 'Reject',
    tone: 'danger',
    message: 'Reject the pending Authorization Limit modification?',
    success: 'Authorization Limit modification rejected.',
  },
  'approve-delete': {
    trigger: 'Approve Delete',
    title: 'Approve Deletion?',
    confirmLabel: 'Delete',
    tone: 'danger',
    message: 'Approve permanent deletion of this Authorization Limit?',
    success: 'Authorization Limit deletion approved.',
  },
  'reject-delete': {
    trigger: 'Reject Delete',
    title: 'Reject Deletion?',
    confirmLabel: 'Reject Deletion',
    tone: 'default',
    message: 'Reject deletion and retain this Authorization Limit?',
    success: 'Authorization Limit deletion rejected.',
  },
});

interface Props {
  readonly action: AuthorizationLimitTransitionAction;
  readonly record: AuthorizationLimitRecord;
  readonly onExecute: () => Promise<void>;
  readonly onClose: () => void;
}

export function AuthorizationLimitTransitionDialog({ action, record, onExecute, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const presentation = authorizationLimitTransitionPresentation[action];

  const confirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onExecute();
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Authorization Limit transition failed.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <ScDialog
      open
      label={presentation.title}
      role="dialog"
      aria-label={presentation.title}
      onScHide={onClose}
    >
      <div className="authorization-limit-transition-message">
        <ScParagraph>{presentation.message}</ScParagraph>
        <ScParagraph>
          Profile: {record.profile} · Currency: {record.currency}
        </ScParagraph>
        {error ? (
          <ScAlert role="alert" type="error" title="Transition failed">
            {error}
          </ScAlert>
        ) : null}
      </div>
      <div slot="footer" className="dialog-actions">
        <ScButton type="tertiary" role="button" disabled={loading} onClick={onClose}>
          Cancel
        </ScButton>
        <ScButton
          type={presentation.tone === 'danger' ? 'secondary' : 'primary'}
          state={presentation.tone === 'danger' ? 'error' : undefined}
          role="button"
          loading={loading}
          disabled={loading}
          aria-label={
            loading ? `${presentation.confirmLabel} in progress` : presentation.confirmLabel
          }
          onClick={confirm}
        >
          {presentation.confirmLabel}
        </ScButton>
      </div>
    </ScDialog>,
    document.body,
  );
}
