# EMS3 Migration Plan For Approval

8 October 2026. All dates below are in 2026.

See the [short data guide](ems3-data-driven-guide.md) for database rows,
RATAN/FlowZero/Stamp examples and routing code. Use this plan for estimates and
release dates; its first production launch moves FlowZero only.

## Approach

1. Add EMS3 to the forked Single UI BFF. Keep existing APIs, permission names and tile rules.
2. Add an EMS2/EMS3 setting to each tile. Start all tiles on EMS2 and check existing applications.
3. Move FlowZero first. Keep RATAN settlements, other RATAN screens and Stamp on EMS2 in production.
4. Record each owner's approved tile switch in the database. Switch tiles sharing a permission together. Apply changes at the next login/recheck, without redeploying applications or the BFF.
5. Block login/rechecks when a required permission service fails. Never fall back to EMS2. Stop offering old protected screens after a failed recheck.
6. Test returning FlowZero to EMS2 before launch. Confirm its old permissions and users; otherwise test restoring the previous BFF and gateway.

## Estimation & Timeline

One person-day is one person's working day. Estimates count work across the team.

| Work | Estimated person-days |
| --- | ---: |
| Build, test and launch the FlowZero pilot | **30-45** |
| Test RATAN settlements and Stamp together; finish checks and instructions | **13-29 additional** |
| Each later application/tile group, after permissions and users are ready | **5-12** |

The 13-29 days include both test groups. Later production switches need another 0.5-1.5 days each if tests remain current. Estimate bulk permission/user setup and application fixes separately. Approval/access waits add calendar time.

Assign one BFF developer, frontend and QA support at half to full availability during their work, and named EMS3/platform/application contacts. Confirm availability before accepting dates.

| Dates | Actions | Finish check |
| --- | --- | --- |
| **8-9 Oct** | Confirm people, EMS3 access, FlowZero IDs, selected tiles/functions and test users. | Owners and expected permissions recorded. |
| **12-16 Oct** | Build tile settings, change history and CSV support. Connect EMS3; fix browser permission handling. | Real FlowZero permissions returned; tile-selection tests pass. |
| **19-23 Oct** | Deploy in test. Check login/renewal, denied users, removed permissions, tokens and failures. Test RATAN screens split between EMS2/EMS3. | FlowZero and EMS2 apps work; EMS2 cannot grant access to EMS3-selected screens. |
| **26 Oct-6 Nov** | Complete FlowZero user tests and fixes. Assign launch users, set alerts and test deployment/rollback. Prepare RATAN/Stamp permissions and users. | Owner and operations approve launch and rollback. |
| **9-13 Nov** | Launch FlowZero on EMS3 and monitor users. | FlowZero runs in production; other applications stay EMS2. |
| **16-27 Nov** | Test RATAN settlements and Stamp together: access, failures, rollback and user load. Update instructions. | Both pass; permissions, users and IDs ready by 13 Nov. |
| **30 Nov-4 Dec** | Close failures; finish switch instructions and support contacts. | Other teams can follow the tested steps. |

Move dates if access, inputs or tests are late. Launch only after user testing and rollback pass.

## Each Milestone Means

**By 13 November:**

- FlowZero tile 108 and its agreed functions use real EMS3 permissions in production.
- RATAN settlements, other RATAN screens and Stamp remain on EMS2 and pass login/screen checks.
- Failed permission calls block login/rechecks without fallback. Alerts, support and tested rollback are available.

**By 4 December:**

- RATAN settlements and Stamp have passed testing together; their owners approve later production switches.
- Teams have permission-setup, test, switch and rollback instructions, plus support contacts.
- Teams can schedule switches after their checks pass. Tiles sharing a permission move together.

## What Each Application Needs

Before switching, the owner and platform team must:

1. Name the owner, EMS3 administrator and support contact. Choose application-team or Portal administration.
2. List tiles/functions moving and staying, including functions without tiles and tiles sharing permissions.
3. Create EMS3 roles/permissions. Supply EMS3 IDs/names and preserve existing permission names where possible.
4. Assign test users with access, without access and with multiple roles. Assign launch users before release.
5. Configure and test in the test environment. Check tiles/functions, login/renewal, removed access, failures and open screens. Test old tokens, which can last 12 hours.
6. Test switching and rollback without restoring removed users' access. Approve the date, record the change and check fresh logins after switching.

Check old numeric permission IDs before switching; fix application code if tests show a mismatch.
