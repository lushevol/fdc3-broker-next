# EMS3 migration: rough monthly timeline

Updated 9 October 2026. Targets are provisional; see the
[approval plan](ems3-approval-plan.md) for estimates and detailed checks.

Assume one BFF developer, frontend/QA support and available CES/application owners.

| Month | Essential work | Milestone |
| --- | --- | --- |
| **October 2026** | Confirm FMAA/CES access, app mappings and users. Build tile provider fields and routing; test login and failures. | FlowZero works in UAT; existing EMS2 applications still work. |
| **November 2026** | Finish FlowZero tests and rollback. Launch by **13 November**. Test RATAN settlements and Stamp in UAT. | FlowZero runs in production; RATAN/Stamp checks finish or remaining fixes are listed. |
| **December 2026** | Finish switch instructions by **4 December**. Launch Strategic Cashflow Blotter/Dashboard and agreed NSTP tiles. | **End-December target:** selected RATAN tiles use EMS3; other RATAN permissions and Stamp remain EMS2. |
| **January 2027** | Refresh Stamp tests, confirm launch users, switch and monitor. | **End-January target:** Stamp runs on EMS3. |
| **February 2027 onward** | Migrate remaining RATAN subjects and applications in agreed groups. | Set monthly targets and the final completion month once scope and capacity are known. |

Before each launch, confirm CES permissions/users in PROD and app mappings.
FMAA/CES access, large-response checks and user tests must pass. Require owner
approval and tested rollback.
Agree a temporary CES access-request process; OneCert self-service can follow
later. Delay the switch if these checks are incomplete.

RATAN moves by selected permission groups. Tiles sharing an entity/subject move together.
EMS3 failures block authorization; there is no automatic EMS2 fallback.
