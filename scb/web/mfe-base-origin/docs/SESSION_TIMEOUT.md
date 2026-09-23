# Session Timeout

The authenticated session uses two related expiry windows:

- When the 15-minute access token expires, the session-control prompt is shown.
- Home acquires a refresh token once while the access token is valid. Access
  token rotation preserves it and does not trigger another request.
- The refresh token keeps the prompt actionable and its encoded expiry is the
  session cutoff. The current backend configuration issues a token valid for
  225 minutes plus 24 seconds from the request, so this is earlier than four
  hours when Home requests it immediately after login.
- On return to a suspended page, Home checks both token expiries immediately.
  The existing prompt appears when the access token has expired, and the
  existing Timeout flow logs out when the refresh token expires. The refresh
  expiry is also checked by a timer during continuous use.

The prompt must not interpret a missing refresh token as a logout instruction.
The refresh request can still be in flight when the prompt opens. If the token
arrives after the prompt is mounted, the prompt must schedule forced logout from
the refresh token's expiry. Until then, it remains visible and lets the user
choose whether to log out.
