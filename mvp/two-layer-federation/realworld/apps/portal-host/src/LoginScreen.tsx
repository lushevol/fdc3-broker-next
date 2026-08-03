import { useState, type FormEvent } from 'react';
import type { AuthenticationAdapter, Credentials } from './authentication';
import {
  ScAlert,
  ScButton,
  ScCard,
  ScDivider,
  ScLink,
  ScPasswordInput,
  ScParagraph,
  ScTab,
  ScTabGroup,
  ScTabPanel,
  ScTextInput,
  ScTitle,
} from './webkit';

interface LoginScreenProps {
  readonly authentication: AuthenticationAdapter;
  readonly onAuthenticated: (credentials: Credentials) => Promise<void>;
}

export function LoginScreen({ authentication, onAuthenticated }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState('credentials');

  const submit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!username.trim() || !password) return;
    setError(null);
    setPending(true);
    try {
      await onAuthenticated({ username: username.trim(), password });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Sign in failed. Try again.');
    } finally {
      setPending(false);
    }
  };

  const credentialsPanel = (
    <form className="login-form" onSubmit={submit}>
      {error ? (
        <ScAlert role="alert" title="Unable to sign in" type="error" icon>
          {error}
        </ScAlert>
      ) : null}
      <fieldset className="login-field-group">
        <legend>Portal credentials</legend>
        <ScParagraph>Use the credentials assigned to your operations account.</ScParagraph>
        <ScTextInput
          id="login-username"
          label="Username"
          name="username"
          value={username}
          onScInput={(event: CustomEvent<{ value: string }>) => setUsername(event.detail.value)}
          role="textbox"
          aria-label="Username"
          placeholder="Enter username"
          required
          disabled={pending}
        />
        <ScPasswordInput
          id="login-password"
          label="Password"
          name="password"
          value={password}
          onScInput={(event: CustomEvent<{ value: string }>) => setPassword(event.detail.value)}
          role="textbox"
          aria-label="Password"
          placeholder="Enter password"
          required
          disabled={pending}
        />
      </fieldset>
      <ScButton
        className="login-submit"
        type="primary"
        role="button"
        disabled={pending || !username.trim() || !password}
        loading={pending}
        aria-label={pending ? 'Signing in…' : 'Sign in'}
        onClick={() => void submit()}
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </ScButton>
    </form>
  );

  const ssoPanel = (
    <section className="login-sso" aria-labelledby="login-sso-title">
      <ScTitle level={2} id="login-sso-title">
        Single sign-on
      </ScTitle>
      <ScParagraph>Continue through your organisation&apos;s identity provider.</ScParagraph>
      <ScLink href={authentication.ssoHref} role="link" aria-label="Sign in with SSO">
        Sign in with SSO
      </ScLink>
    </section>
  );

  return (
    <div
      className="ratan-webkit-root"
      data-ratan-scope="host"
      data-ratan-theme="dark"
      data-ratan-density="comfortable"
      data-design-system="ratan-webkit"
      dir="ltr"
    >
      <main className="login-page">
        <ScCard className="login-card" aria-labelledby="login-title">
          <div className="login-card-content">
            <div className="login-brand">
              <ScParagraph className="login-eyebrow" size="sm">
                FMO NEXT
              </ScParagraph>
              <ScTitle level={1} id="login-title">
                Sign in
              </ScTitle>
              <ScParagraph>Secure access to the post-trade operations workspace.</ScParagraph>
            </div>
            <ScDivider role="separator" aria-orientation="horizontal" vertical compact />
            <ScTabGroup
              aria-label="Sign-in methods"
              onScTabSelect={(event: CustomEvent<{ name: string }>) => setMethod(event.detail.name)}
            >
              <ScTab slot="nav" panel="credentials" active={method === 'credentials'}>
                Credentials
              </ScTab>
              <ScTab slot="nav" panel="sso" active={method === 'sso'}>
                Single sign-on
              </ScTab>
              <ScTabPanel name="credentials" active={method === 'credentials'}>
                {credentialsPanel}
              </ScTabPanel>
              <ScTabPanel name="sso" active={method === 'sso'}>
                {ssoPanel}
              </ScTabPanel>
            </ScTabGroup>
            <ScParagraph className="login-demo-note">
              POC account: <code>test</code> / <code>test</code>
            </ScParagraph>
          </div>
        </ScCard>
        <aside className="login-context" aria-label="Portal overview">
          <ScParagraph className="login-context-index" size="sm">
            01 / OPERATIONS
          </ScParagraph>
          <div>
            <ScTitle level={2}>FMO Post Trade Portal</ScTitle>
            <ScParagraph>
              One workspace for affirmation, confirmation, settlements, reporting, and operational
              control.
            </ScParagraph>
          </div>
          <dl className="login-context-metrics">
            <div>
              <dt>Runtime</dt>
              <dd>2 layers</dd>
            </div>
            <div>
              <dt>Interop</dt>
              <dd>FDC3 ready</dd>
            </div>
            <div>
              <dt>Access</dt>
              <dd>Role scoped</dd>
            </div>
          </dl>
        </aside>
      </main>
    </div>
  );
}
