# Session Timeout

The authenticated session uses two related expiry windows:

- When the 15-minute access token expires, the session-control prompt is shown.
- A refresh token received around that boundary keeps the prompt actionable and
  defines the absolute session cutoff, which is at most four hours from login.

The prompt must not interpret a missing refresh token as a logout instruction.
The refresh request can still be in flight when the prompt opens. If the token
arrives after the prompt is mounted, the prompt must schedule forced logout from
the refresh token's expiry. Until then, it remains visible and lets the user
choose whether to log out.
