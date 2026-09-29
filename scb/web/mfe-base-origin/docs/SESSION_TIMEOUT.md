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

If Home starts hidden, it must acquire a missing refresh token immediately
while access is valid. The same applies if Home first becomes ready in the
final 25 seconds of access validity. Initial acquisition must not depend on a
future visibility change or an already-missed timer deadline.

Refresh acquisition belongs to the session that started the request. Logging
out invalidates pending refresh replies, including failures; an old reply
must not restore credentials or clear a later login. Access rotation within
the same session must still accept its pending refresh reply. Fresh login
clears any leftover refresh credential.

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
(scheduling), and `hooks/reducer/session.test.ts` (session ownership). The
integration cases cover hidden startup with running or suspended timers,
late mounting, near-expiry hiding, manual Extend, and late replies before or
after another login.
