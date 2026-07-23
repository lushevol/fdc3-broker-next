import { useState } from 'react';
import {
  Button,
  Dialog,
  InlineAlert,
  NumberField,
  TextField,
} from '@fm/ratan-design';
import type { AuthorizationLimitRecord } from './authorization-limits-repository';

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
    const nextLimitationError = limitation === null
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
      setRequestError(reason instanceof Error ? reason.message : 'Authorization Limit mutation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open
      title={title}
      description="Profile limits use fixed USD currency."
      onClose={onClose}
      dismissible={!loading}
      actions={
        <>
          <Button variant="ghost" disabled={loading} onClick={onClose}>Cancel</Button>
          <Button
            disabled={loading}
            aria-busy={loading || undefined}
            aria-label={loading ? 'Submit in progress' : undefined}
            onClick={submit}
          >
            {loading ? 'Submitting…' : 'Submit'}
          </Button>
        </>
      }
    >
      <div className="authorization-limit-editor-form">
        {requestError ? (
          <InlineAlert tone="error" title={`Unable to ${mode} Authorization Limit`} message={requestError} />
        ) : null}
        <TextField
          id="authorization-limit-profile"
          label="Profile"
          value={profile}
          onChange={setProfile}
          disabled={mode === 'edit'}
          required
          error={Boolean(profileError)}
          helperText={profileError}
        />
        <TextField
          id="authorization-limit-currency"
          label="Currency"
          value="USD"
          onChange={() => undefined}
          disabled
          required
        />
        <NumberField
          id="authorization-limit-value"
          label="Limitation"
          value={limitation}
          onChange={setLimitation}
          min={MIN_LIMIT}
          max={MAX_LIMIT}
          required
          error={Boolean(limitationError)}
          helperText={limitationError}
        />
      </div>
    </Dialog>
  );
}
