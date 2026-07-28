import {
  Button,
  Card,
  DescriptionList,
  DesignSystemProvider,
  Divider,
  FieldGroup,
  Form,
  InlineAlert,
  Link,
  PasswordField,
  Tabs,
  TextField,
} from '@fm/ratan-design';
import {
  useState,
  type FormEvent,
} from 'react';
import type {
  AuthenticationAdapter,
  Credentials,
} from './authentication';

interface LoginScreenProps {
  readonly authentication: AuthenticationAdapter;
  readonly onAuthenticated: (credentials: Credentials) => Promise<void>;
}

export function LoginScreen({
  authentication,
  onAuthenticated,
}: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || !password) return;
    setError(null);
    setPending(true);
    try {
      await onAuthenticated({ username: username.trim(), password });
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Sign in failed. Try again.',
      );
    } finally {
      setPending(false);
    }
  };

  const credentialsPanel = (
    <Form className="login-form" onSubmit={submit}>
      {error ? (
        <InlineAlert
          title="Unable to sign in"
          message={error}
          tone="error"
        />
      ) : null}
      <FieldGroup
        title="Portal credentials"
        description="Use the credentials assigned to your operations account."
      >
        <TextField
          id="login-username"
          label="Username"
          name="username"
          value={username}
          onChange={setUsername}
          autoComplete="username"
          placeholder="Enter username"
          required
          disabled={pending}
        />
        <PasswordField
          id="login-password"
          label="Password"
          name="password"
          value={password}
          onChange={setPassword}
          placeholder="Enter password"
          required
          disabled={pending}
        />
      </FieldGroup>
      <Button
        className="login-submit"
        type="submit"
        pending={pending}
        disabled={pending || !username.trim() || !password}
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </Form>
  );

  const ssoPanel = (
    <section className="login-sso" aria-labelledby="login-sso-title">
      <h2 id="login-sso-title">Single sign-on</h2>
      <p>Continue through your organisation&apos;s identity provider.</p>
      <Link href={authentication.ssoHref} variant="button">
        Sign in with SSO
      </Link>
    </section>
  );

  return (
    <DesignSystemProvider
      appearance={{ scheme: 'dark', density: 'comfortable', direction: 'ltr' }}
      scope="host"
    >
      <main className="login-page">
        <Card className="login-card" aria-labelledby="login-title">
          <div className="login-brand">
            <span className="login-eyebrow">FMO NEXT</span>
            <h1 id="login-title">Sign in</h1>
            <p>Secure access to the post-trade operations workspace.</p>
          </div>
          <Divider />
          <Tabs
            ariaLabel="Sign-in methods"
            tabs={[
              {
                id: 'credentials',
                label: 'Credentials',
                content: credentialsPanel,
              },
              {
                id: 'sso',
                label: 'Single sign-on',
                content: ssoPanel,
              },
            ]}
          />
          <p className="login-demo-note">
            POC account: <code>test</code> / <code>test</code>
          </p>
        </Card>
        <aside className="login-context" aria-label="Portal overview">
          <span className="login-context-index">01 / OPERATIONS</span>
          <div>
            <h2>FMO Post Trade Portal</h2>
            <p>
              One workspace for affirmation, confirmation, settlements,
              reporting, and operational control.
            </p>
          </div>
          <DescriptionList
            className="login-context-metrics"
            items={[
              { id: 'runtime', term: 'Runtime', description: '2 layers' },
              { id: 'interop', term: 'Interop', description: 'FDC3 ready' },
              { id: 'access', term: 'Access', description: 'Role scoped' },
            ]}
          />
        </aside>
      </main>
    </DesignSystemProvider>
  );
}
