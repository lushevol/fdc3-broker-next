import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { AuthorizationLimitRecord } from './authorization-limits-repository';
import { ScAlert, ScButton, ScDialog, ScParagraph, ScTextInput } from './webkit';

const MIN_LIMIT = 0;
const MAX_LIMIT = 99_999_999_999;

interface Props {
  readonly mode: 'create' | 'edit';
  readonly record?: AuthorizationLimitRecord;
  readonly onSubmit: (profile: string, limitation: number) => Promise<void>;
  readonly onClose: () => void;
}

export function AuthorizationLimitEditor({ mode, record, onSubmit, onClose }: Props) {
  const [profile, setProfile] = useState(record?.profile ?? '');
  const [limitation, setLimitation] = useState<number | null>(record?.limitation ?? 0);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [limitationError, setLimitationError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const title = mode === 'create' ? 'Create Authorization Limit' : 'Edit Authorization Limit';

  const submit = async () => {
    const normalizedProfile = profile.trim();
    const nextProfileError = normalizedProfile ? null : 'Profile is required.';
    const nextLimitationError =
      limitation === null
        ? 'Limitation is required.'
        : limitation < MIN_LIMIT || limitation > MAX_LIMIT
          ? `Limitation must be between ${MIN_LIMIT} and ${MAX_LIMIT}.`
          : null;
    setProfileError(nextProfileError);
    setLimitationError(nextLimitationError);
    setRequestError(null);
    if (nextProfileError || nextLimitationError || limitation === null) return;

    setLoading(true);
    try {
      await onSubmit(normalizedProfile, limitation);
      onClose();
    } catch (reason) {
      setRequestError(
        reason instanceof Error ? reason.message : 'Authorization Limit mutation failed.',
      );
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <ScDialog open label={title} role="dialog" aria-label={title} onScHide={onClose}>
      <ScParagraph>Profile limits use fixed USD currency.</ScParagraph>
      <div className="authorization-limit-editor-form">
        {requestError ? (
          <ScAlert role="alert" type="error" title={`Unable to ${mode} Authorization Limit`}>
            {requestError}
          </ScAlert>
        ) : null}
        <ScTextInput
          id="authorization-limit-profile"
          label="Profile"
          role="textbox"
          aria-label="Profile"
          value={profile}
          onScInput={(event: CustomEvent<{ value: string }>) => setProfile(event.detail.value)}
          disabled={mode === 'edit'}
          required
          error={Boolean(profileError)}
          errorMessage={profileError ?? ''}
        />
        <ScTextInput
          id="authorization-limit-currency"
          label="Currency"
          role="textbox"
          aria-label="Currency"
          value="USD"
          disabled
          required
        />
        <ScTextInput
          id="authorization-limit-value"
          label="Limitation"
          type="number"
          role="spinbutton"
          aria-label="Limitation"
          value={limitation}
          onScInput={(event: CustomEvent<{ value: string }>) => {
            const value = event.detail.value;
            setLimitation(value === '' ? null : Number(value));
          }}
          required
          error={Boolean(limitationError)}
          errorMessage={limitationError ?? ''}
        />
      </div>
      <div slot="footer" className="dialog-actions">
        <ScButton type="tertiary" role="button" disabled={loading} onClick={onClose}>
          Cancel
        </ScButton>
        <ScButton
          type="primary"
          role="button"
          disabled={loading}
          aria-busy={loading || undefined}
          aria-label={loading ? 'Submit in progress' : 'Submit'}
          onClick={submit}
        >
          {loading ? 'Submitting…' : 'Submit'}
        </ScButton>
      </div>
    </ScDialog>,
    document.body,
  );
}
