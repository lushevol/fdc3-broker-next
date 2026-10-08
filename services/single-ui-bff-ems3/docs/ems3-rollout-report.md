# EMS3 Support: Evidence And Maintenance

Updated: 8 October 2026.

The approach, estimates, timeline, milestones and application checklist have moved to the separate [plan for approval](ems3-approval-plan.md).

## Recorded Results

The existing POC selects one permission service per application entity. Selecting EMS2 or EMS3 per tile still needs implementation and testing.

| Saved result | What was tested |
| --- | --- |
| 747 BFF tests passed; no failures, errors or skips | Earlier BFF routing with isolated PostgreSQL and synthetic HTTP providers. |
| 244 standalone POC tests passed | Selected permission and tile checks with synthetic accounts. |
| Failure tests across six login/renewal APIs | Required provider failures reject the request without new permission tokens or EMS2 fallback. |
| Authorization coverage: 99.87% lines, 97.20% branches | Earlier adapters, router and JWT controller. |
| Full-dump replay: 113 candidate tiles, 40 role/provider combinations, 50 individual-role cases | Earlier routing with exported configuration and synthetic permissions. |

These are saved local results. They do not prove live EMS3 access, the new tile setting or deployed browser behavior. See [the full evidence and remaining checks](ems3-three-application-report.md#9-evidence-and-the-remaining-checks).

## Maintenance Responsibilities

| Task | Application manages EMS3 | Portal manages EMS3 |
| --- | --- | --- |
| Define and approve permissions | Application owner. | Application owner. |
| Edit roles/permissions and assign users | Application's EMS3 administrator. | Portal's EMS3 administrator, using the application's approved request. |
| Test changed permissions | Application owner and tester. | Application owner and tester. |
| Change BFF settings and tile sources | Platform team records and applies the approved change. | Platform team records and applies the approved change. |
| Maintain BFF, browser, database, gateway and alerts | Platform and operations. | Platform and operations. |

| Maintenance task | Rough total person-days |
| --- | ---: |
| Change permissions for an existing feature and test access | 0.5-1.5 |
| Add a permission for a new feature and test access | 1-3, excluding feature development |
| Execute an approved source switch or rollback and check access | 0.5-1.5, after full testing |

Name an EMS3 administrator for each application and agree when approved requests will be completed. Count actual user requests, permission changes and audit reviews before assigning monthly support capacity. See [the complete maintenance comparison](ems3-three-application-report.md#11-maintenance-effort-who-does-the-work).

## Technical References

- [Permission matrices, database examples and data flow](ems3-three-application-report.md)
- [Actual BFF code and recorded verification](ems3-bff-integration.md)
- [Database routing design](ems3-transition-design.md)
- [Original POC scope](ems3-migration-plan.md)
- [Standalone POC results](../poc/ems3-functions/README.md)
- [Verification build](../verification/README.md)
- [Browser behavior and required fixes](ems3-user-screen-flow.md)
- [Recorded replay results](evidence/ems3-scenario-results.json)
