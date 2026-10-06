# Session Timeout

The authenticated session uses two related expiry windows:

- When the 15-minute access token expires, the session-control prompt is shown.
- While visible, Home schedules refresh acquisition 25 seconds before access
  expiry (14 minutes 35 seconds after a normal 15-minute token is issued).
- Each transition to hidden can request refresh while access is valid, the
  prompt is closed, and logout has not started. A usable refresh token is
  preserved in the final 25 seconds instead of requesting a replacement.
- Access-token rotation preserves the current refresh token and schedules
  acquisition against the new access expiry. A later hide or visible deadline
  can replace the refresh token; acquisition is not limited to once per login.
- The refresh token keeps the prompt actionable and its encoded expiry is the
  session cutoff. The current backend configuration issues a token valid for
  225 minutes plus 24 seconds from issuance. For a page that stays visible and
  idle, acquisition at 14 minutes 35 seconds gives a cutoff approximately
  3 hours 59 minutes 59 seconds after login. An early hide produces an earlier
  cutoff. A successful replacement moves the cutoff to that new token's expiry;
  this client does not enforce an absolute four-hour limit from the first login.
- On return to a suspended page, Home checks both token expiries immediately.
  The existing prompt appears when the access token has expired, and the
  existing Timeout flow logs out when the refresh token expires. The refresh
  expiry is also checked by a timer during continuous use.

The prompt must not interpret a missing refresh token as a logout instruction.
The refresh request can still be in flight when the prompt opens. If the token
arrives after the prompt is mounted, the prompt must schedule forced logout from
the refresh token's expiry. Until then, it remains visible and lets the user
choose whether to log out.

When a usable refresh token is already available, Home must not request a
replacement in the final 25 seconds of access-token validity. A request sent
at that boundary can arrive after access expires and invalidate an otherwise
extendable session.

A failed optional replacement must preserve the current usable refresh token
only when the server returns ACCESS_TOKEN_EXPIRED for this login. The server
must verify the signature, issuer, session limit, and session status before it
returns that code. It must not issue a new token from expired access. Invalid
credentials, revoked sessions, missing/expired refresh, and unclassified legacy
errors keep the existing logout behavior. Deploy the server change first.

If Home starts hidden, it must acquire a missing refresh token immediately
while access is valid. The same applies if Home first becomes ready in the
final 25 seconds of access validity. Initial acquisition must not depend on a
future visibility change or an already-missed timer deadline.

Each request belongs to the login that started it. Logout start, credential
clear, and a new login invalidate older requests immediately. Old successes,
old errors, and queued state updates must not change the later login. Normal
access-token rotation does not change request ownership. Cancel pending
authentication requests as additional protection; keep logout requests running
so the server can revoke the session.

Returning to visible reconciles both expiries immediately. If the visible
acquisition deadline is still in the future, it is rescheduled; a missed
deadline is not replayed on return. Hiding cancels the visible acquisition
timer. Repeated notifications without an actual visibility change do nothing.
The existing service cancels an unfinished acquisition when a new one starts.

The Timeout dialog retains its existing two-second lead before refresh expiry
and one-second delay before logout. During continuous activity, Home opens
that flow at refresh expiry even if the access token is still valid. Logout
clears both credentials. Refresh credentials are held in memory, not persisted
across a page reload.

Regression coverage lives in `sessionLifecycle.test.tsx` (real Provider,
controllers, dialog and Axios interceptors), `sessionRefresh.test.tsx`
(scheduling), and `hooks/reducer/index.test.tsx` (refresh preservation). The
integration cases cover hidden startup with running or suspended timers,
late mounting, near-expiry hiding, manual Extend, and refresh replies arriving
after the timeout dialog opens. Cross-login reply isolation is not covered by
this change.
