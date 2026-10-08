# EMS3 migration: rough monthly timeline

Prepared 8 October 2026. This is a monthly view of the
[estimation plan](ems3-approval-plan.md).

Assume one BFF developer, frontend and QA support, and available EMS3 and
application owners. October/November and the 4 December check follow the existing
plan. Later production dates below are new rough targets, subject to owner
testing and an available release date.

| Month | Main work | Milestone |
| --- | --- | --- |
| **October 2026** | Confirm EMS3 access, IDs and test users. Build tile-source routing, audit/CSV support and browser fixes. Connect real EMS3; test login, renewal and failures. Start FlowZero user testing. | **By end October:** FlowZero works in test; other applications still work through EMS2. User testing is underway. |
| **November 2026** | Finish FlowZero user testing and rollback rehearsal. Launch and monitor FlowZero. Test selected RATAN settlements and Stamp together in staging. | **By 13 November:** FlowZero is on EMS3 in production. **By end November:** RATAN/Stamp staging checks are complete, or remaining fixes are listed. |
| **December 2026** | Close staging issues and finish switch instructions by 4 December. Release the first selected RATAN settlement group: Strategic Cashflow Blotter/Dashboard and agreed NSTP tiles. List all remaining application groups and their owners. | **By 4 December:** onboarding steps are ready. **Rough end-December target:** selected RATAN tiles are on EMS3 in production; other RATAN subjects and Stamp stay EMS2. |
| **January 2027** | Check the RATAN release, refresh Stamp tests and confirm its launch users. Switch Stamp and monitor it. Prepare the next RATAN/application groups. | **Rough end-January target:** Stamp is on EMS3 in production. FlowZero and the selected RATAN group remain on EMS3. |
| **February 2027 onward** | Move remaining RATAN subjects and other applications in groups. For each group: prepare roles/users, test, approve, switch and monitor. | **Each month:** complete the groups agreed with their owners and record what remains on EMS2. Set the final completion month after the remaining list and team capacity are known. |

Before each production switch, require passing user tests, assigned launch users,
owner approval and a tested rollback. EMS3 failure blocks authorization with no
automatic EMS2 fallback. Move the launch month if those checks are incomplete.

The first RATAN group is a partial migration. Tiles sharing the same entity and
permission subject move together; this does not move all RATAN permissions.

## Effort behind these months

| Work | Rough total team effort |
| --- | ---: |
| Shared support and FlowZero production pilot, October-November | **30-45 person-days** |
| RATAN/Stamp staging tests and onboarding readiness, November-early December | **13-29 additional person-days**, including both test groups |
| Each later application/group, once permissions, users and IDs are ready | **5-12 person-days** |
| Production switch of an already-tested group, if tests remain current | **0.5-1.5 additional person-days** per switch |

These are the existing effort estimates grouped by month, not another budget to
add on top. The 5-12 days apply to new groups beyond the two already counted.
Bulk permission/user setup, application code fixes, and approval/access waiting
time need separate allowance.
