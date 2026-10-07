# Session timeout TODO

Updated: 2026-10-07

Reviewed release: `fba07be9dd60e6b3a2c04afc8bd7ab56e15cf79d`.
This list describes that release snapshot, including the earlier refresh
preservation commit. It does not describe every later fix on the working branch.
Keep the original issue numbers so they match the review conversation.

The user considers most issues unlikely, low impact, or inherited. They are
recorded for later tracking. No. 3 remains the recommended fix before PROD.
Recording a TODO does not resolve an issue or approve deployment. No numeric
production encounter rates are known.

## Tracking

| ID  | Priority            | Status                        | Encounter likelihood                                                          |
| --- | ------------------- | ----------------------------- | ----------------------------------------------------------------------------- |
| 1   | Low                 | Deferred                      | Needs token renewal during a pending mouse timer                              |
| 2   | Medium              | Deferred                      | Plausibly uncommon; Home must start hidden and remain hidden long enough      |
| 3   | High                | Open; recommended before PROD | Narrow timing window; ordinary tab switching plus a short delay is sufficient |
| 4   | Medium              | Deferred                      | Needs an unfinished request during logout or a later login in the same page   |
| 5   | Medium              | Deferred; inherited           | Occurs when manual Extend is slow or fails temporarily                        |
| 6   | Low                 | Deferred; inherited           | Needs sustained activity without five quiet seconds                           |
| 7   | Policy              | Pending policy decision       | Expected in long sessions with repeated successful replacement                |
| 8   | Security/operations | Investigate                   | More credential exposure opportunities; leakage not demonstrated              |

## 1. Cancel obsolete mouse activity

- [ ] Cancel pending activity when access changes or logout starts. Recheck the
      current login and token before sending a delivered callback.
- [ ] Test overlapping renewals with real issuance-plus-15-minute expiries.

Reproduce with controlled replies: schedule mouse activity, accept newer access
before its five-second timer fires, then release the obsolete activity reply.
The old request can overwrite current credentials. The earlier test used
artificial expiry gaps; it did not establish significant real session shortening.
An extra request generated later normally yields a later expiry. Out-of-order
generation and delivery still need investigation; there is no proven one-minute
maximum impact.

Business impact: extra authentication requests and possible unexpected warnings.
Token-change cleanup is a regression; the logout-start variant is inherited.

## 2. Obtain missing refresh on hidden or late startup

- [ ] Acquire missing refresh when Home starts hidden or becomes ready after
      the acquisition deadline, provided access is still valid.
- [ ] Add bounded recovery for temporary network and 5xx failures. Stop at
      access expiry, logout, unmount, or a terminal authentication rejection.
- [ ] Specify the fallback when no refresh can be obtained.

Reproduce: let Home start in a background tab and leave it hidden for 16 minutes.
Return: the prompt has no refresh token and Extend is disabled. Returning before
the acquisition deadline normally restores scheduling. A brief SSO redirect
reduces the opportunity, but does not establish a measured encounter rate.

Alternative: fail the first refresh acquisition, then leave the page hidden until
access expires. There is no automatic retry in this release.

Business impact: another sign-in is required. Without refresh expiry the client
also has no refresh-based forced logout deadline. Expired access does not become
valid at the server. Running-background-timer startup is a regression; the lack
of retry is inherited.

## 3. Preserve recoverable credentials after ordinary expiry

- [ ] Avoid optional hide-triggered replacement in the final 25 seconds when
      usable refresh already exists.
- [ ] Prevent an obsolete access-expiry error from clearing newer valid access
      within the same login. Keep real authentication rejection handling.
- [ ] If the client distinguishes ordinary expiry, require a verified server
      classification. Do not ignore all 401 responses. Test invalid signatures
      and revoked sessions, and plan compatible server/client deployment.

Reproduce with delayed processing: obtain refresh at 14m35s, hide the page at
14m59s, and deliver the new request to the server two seconds later. Its access
credential is expired. The rejection clears both credentials despite existing
usable refresh. The 25-second lead applies to the scheduled visible request;
it is not a minimum lead for the additional hide request.

Also test: activity renews access while initial acquisition is pending; a late
expiry rejection for old access must not remove the newer valid access.

Business impact: unexpected sign-in and possible loss of unsaved page state.
No damage to completed transactions was demonstrated. The broad error rule is
inherited, but the new hide acquisition path increases exposure.

## 4. Isolate replies across login sessions

- [ ] Reject successes, errors, and queued credential updates owned by an
      earlier login after logout or a new login. Cancellation alone is not
      sufficient. Preserve normal token rotation within one login.
- [ ] Test late Extend success after expiry-driven logout.

Reproduce with controlled replies: hold an authentication reply, clear the
session, sign in again without reloading, then release it. Old refresh can enter
the new state, or an old expiry error can clear the new login. Separately, hold
Extend until logout completes; its late success can restore client credentials.

Business impact: confusing login state and repeated sign-in. Unauthorized server
access was not demonstrated. A full SSO redirect starts a new page and reduces
the later-login variant. This is an inherited risk.

## 5. Close Extend only after confirmed renewal

- [ ] Return and await the renewal result. Close the prompt only on success.
- [ ] Keep temporary-failure retry available and keep logout enforcement active
      while waiting. Ensure late callbacks cannot update an unmounted prompt.

Reproduce: wait for the warning, set the browser offline, then select Extend.
The prompt closes before renewal succeeds. Repeat with a delayed response.

Business impact: expired access remains while the immediate retry control is
gone; users cannot resume reliably. This is an inherited issue.

## 6. Define continuous activity behavior

- [ ] Decide whether continuous mouse activity must renew the session.
- [ ] If required, report activity at bounded intervals without letting each
      event postpone renewal indefinitely. Retain expiry and logout guards.

Reproduce: move the mouse over the application at least every four seconds for
15 minutes. Each event resets the five-second timer; renewal never runs.

Business impact: an active user receives the warning. The user considers this
unlikely in real use. This behavior is inherited.

## 7. Decide the four-hour policy

- [ ] Confirm whether the policy is four hours from first login or the current
      refresh token's expiry. The user says a strict four-hour limit probably
      is not required; obtain the authoritative decision before claiming it.
- [ ] Update the specification, which incorrectly describes acquisition as
      once per session for this release.
- [ ] If an absolute limit is required, enforce it in the server session and
      reconcile the same deadline in the client.

Reproduce: renew through activity and switch away/return repeatedly for more
than four hours. Replacement refresh expiry moves, so the session can continue.

Business impact: policy violation only if a fixed limit is mandatory; otherwise
longer usable sessions. Early acquisition can also make an idle cutoff earlier.

## 8. Review credential exposure and authentication load

- [ ] Measure refresh issuance rate, endpoint latency, server signing/validation
      cost, and session-store load under realistic tab-switch frequency.
- [ ] Check redaction of `Single-UI-Refresh`, `Single-UI-Authorization`, and
      `singleUIAuthorization` in proxy/APM logs, browser error reporting, and
      network captures. Avoid logging complete Axios errors with credentials.
- [ ] Verify HTTPS, credential-response cache policy, and the deployed CORS and
      header-exposure configuration. These were not validated in this audit.
- [ ] Decide whether repeated issuance is needed when usable refresh exists.
      Reuse or deduplication requires explicit cutoff and recovery semantics.
- [ ] Review old-refresh validity and stolen-token replay. Issuing replacement
      does not revoke earlier tokens in the reviewed code. Changing to single-use
      rotation requires separate planning for concurrent requests and tabs.

More responses carry refresh credentials and the client retains refresh across
access changes. Neither proves leakage. Existing JavaScript-accessible storage
means malicious frontend code could obtain credentials. Repeated issuance does
not add an HttpOnly boundary or revoke previously issued refresh credentials.

## Main business impact of the release

Before: access renewal cleared refresh. Background timer suspension could also
leave the user without a recovery credential or a timely expiry check.

After: refresh survives access renewal, the page requests it when hiding, and
checks expiry when returning. This helps users resume after switching away or
leaving the page idle, with fewer avoidable sign-ins when acquisition succeeds.
The 15-minute access warning and manual Extend remain. It does not keep every
session alive automatically or solve the TODO failures above.

## Performance and security tradeoffs

The visible idle path still requests refresh 25 seconds before access expiry.
The main added traffic is up to one request per eligible transition to hidden,
alongside visible deadlines. Some hides cancel scheduled requests; this is not
a fixed additive request count. Frequent switching can also cancel and replace
unfinished requests; cancellation does not guarantee that server work stops.

For scale only: 1,000 users each making 20 hide-triggered requests per hour means
20,000 such requests/hour, approximately 5.6 requests/second on average. This is
an illustrative workload, not a measured increase; visible requests and bursts
are additional. Each issuance validates access, checks session status and signs
a refresh JWT. Benchmark the backend before assigning a CPU or latency number.

Browser work is small in algorithmic scope: event handling, a fixed number of
timers, JWT decoding and state updates. CPU, memory and latency were not measured.
The client keeps one current refresh token in state rather than a growing list.
The existing request interceptor can show a global loader while refresh is
pending, which may be visible if the user returns before it finishes.

Credential flow in the reviewed release:

| Operation                 | Credential sent                                     | Credential received                                  |
| ------------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| Acquire/replace refresh   | Access token in request body                        | Refresh token in `Single-UI-Refresh` response header |
| Manual Extend (`relogin`) | Refresh token in `Single-UI-Refresh` request header | Access token                                         |
| Ordinary business API     | Access token                                        | Endpoint-specific result                             |

Refresh is held in JavaScript memory, not written to localStorage/sessionStorage
by the reviewed refresh handler. It remains available across access rotation.
More issuance increases opportunities for accidental header capture and supplies
more potentially usable credentials if captured; it does not mean refresh is
sent on every mouse movement or business request. There is no evidence here of
an actual leak. The deployed transport, logging and replay protections need
verification. Access tokens are also credentials that require redaction.

If only the proposed No. 3 final-window guard is applied, its main benefit is
avoiding unnecessary logout from a failed optional replacement. It reduces
requests and refresh responses in that window, rather than increasing them.

## Evidence and completion criteria

Exact release: 123 existing suites / 421 tests passed, with 97.54% line and 93.03%
branch coverage. Additional edge probes: 25 passed and 21 failed across 46 checks.
Repeated failures can describe one issue; these counts are not a failure rate.
Tests used synthetic tokens, fake time and controlled adapters, not live PROD.

Temporary reproducible audit: `/private/tmp/scb-prod-fba07be9.BYSc6A/`.
The temporary directory may be removed; keep regression cases in the repository
when implementing each fix. Do not treat later HEAD results as release results.

For each resolved item: define expected policy, reproduce it with a focused
regression test, implement only that item, verify real token lifetimes and
failure handling, and commit it separately. Run live authentication UAT for the
final release, including actual browser suspension, full reload, and multiple
tabs. Keep production tokens out of tests, TODOs, logs and issue attachments.
