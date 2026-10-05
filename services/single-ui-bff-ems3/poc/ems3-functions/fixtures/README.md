# Function entitlement POC fixtures

These fixtures model a proposed migration pattern with synthetic accounts and
identifiers. They are not production EMS3 registrations or user assignments.

The user confirmed that the supplied DB and EMS2 exports in `scb-next/data/`
represent production. The export date has not been established. The generator
reads only function grants, selected tile configuration and category labels:

- `entitlements.xml`: all grants for `FMO_COO_SUP` and `FMO_KR_OPS` under `X_RATANONE`.
- `entitlements_fmo_portal_admin.xml`: all `FMO_ADMIN` grants under `FMO PORTAL ADMIN`.
- `application_tile.csv`: tile IDs 1, 2, 3, 4, 18, 54, 104 and 105.
- `application_category.csv`: labels for the selected tiles' categories.

Existing role, subject, subject longName and action names are preserved exactly.
CSV creator, updater, email, timestamps, URLs and data filtering rules are omitted.
No production user IDs or user assignments are copied.

## Proposed application mapping

The transitional demo selects a provider per BFF entitlement entity:

| EMS2 entity | Selected provider | EMS3 application mapping |
| --- | --- | --- |
| `X_RATANONE` | EMS2 | not used by the EMS2 route |
| `FMO PORTAL ADMIN` | EMS3 | `FMO_PORTAL_ADMIN` |

This route table is in-memory in the POC. Production will load the same fields
from the BFF database after the mapping migration is implemented.

| EMS2 entity | POC EMS3 application | appId | Synthetic appUID |
| --- | --- | --- | --- |
| `X_RATANONE` | `RATAN_ENTITLEMENT_RULE` | `51358` | 10 |
| `FMO PORTAL ADMIN` | `FMO_PORTAL_ADMIN` | `51358` | 11 |

This mapping is a POC proposal. The names and `appId` follow the supplied EMS3
integration examples; production registrations must be confirmed during rollout.
Entity IDs 1 and 2 and every role, subject, action and entitlement ID are synthetic.
The generator assigns role, subject, action and entitlement IDs deterministically
from sorted names, using one identifier range starting at 10001. A repeated
subject or action keeps its identifier across roles; each role's grant keeps a
distinct entitlement ID.

## Synthetic accounts and edge cases

`accounts.json` supplies five local identities: Ratan only, portal admin only,
both applications, two roles within Ratan, and no grants. `poc-two-roles` receives
both `FMO_COO_SUP` and `FMO_KR_OPS` to demonstrate that grants within the same
application are combined while actions remain attached to the role that grants
them. Tile 18 is denied to the COO-only account and granted by the KR role.

Tiles 9001-9004 are synthetic: a template, a blank subject, a correct subject
under the wrong entity, and a case-insensitive subject longName match. All four
use synthetic category ID 9001. They exercise authorization edge cases without
altering the supplied configuration.

## Regenerate

Run from the repository root with Python 3.9 or newer:

```sh
python3 services/single-ui-bff-ems3/poc/ems3-functions/prepare-fixtures.py
```

The script uses Python's standard CSV and XML parsers and regenerates only
`catalog.json`, `tiles.json` and `accounts.json`. The committed fixtures are
sufficient to run the POC without access to the original dumps.

The supplied exports are staged in the original checkout and are not included
in this worktree. To regenerate using those exports, pass their directory:

```sh
python3 services/single-ui-bff-ems3/poc/ems3-functions/prepare-fixtures.py \
  --data-dir /Users/lushevol/code/github/fdc3-broker-next/scb-next/data
```
