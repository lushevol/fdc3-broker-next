# User And Tile Record Appendix

This appendix answers which tile records each test role would see when the complete supplied exports are replayed. It includes all 129 tile rows, not just the eight production examples used by the earlier POC.

**Evidence status:** the independent parser predictions now match execution through the actual PostgreSQL candidate query, application-provider router and Java drawer filter. The harness checked 113 candidate rows, 1,044 requested entity names, 1,048 backfilled application mappings, 40 role/provider cases, and all 50 single-role cases. Provider responses are normalized test fixtures built from the supplied grants. These are synthetic users; production user-to-role assignments, live EMS3 and rendered browser screens are not proved by this replay.

The [sanitized replay input](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/docs/evidence/ems3-scenario-input.json) contains the complete entity lists, grant records and source locations. Support emails and created/updated-by values are excluded. Long entity lists are kept in that input rather than in table cells.

The [execution results](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/docs/evidence/ems3-scenario-results.json) record the actual Java/PostgreSQL checks. The 40 role/provider cases cover eight role subsets and five provider selections through the database router and filter. The 50 individual exported roles are separate data/filter checks using the same SQL-selected rows; they do not each exercise provider routing.

## 1. What The Exports Contain

| Input or result | Count |
| --- | --- |
| Tile records | 129 |
| Category records | 25 |
| Import-map records | 74 |
| Tiles selected by the active category/tile/import SQL join | 113 |
| Tiles excluded by that join | 16 |
| Selected templates | 14 |
| Selected non-template tiles | 99 |
| XML entity catalogs | 5 |
| XML role combinations | 50 |
| XML grant records | 1355 |
| Distinct entity names referenced by selected tiles | 1044 |
| Application mapping rows backfilled from all tile records | 1048 |

The five supplied XML catalogs cover 59 of the 99 selected non-template tiles. The other 40 reference entity names absent from these five XML catalogs. Their exact visible users cannot be calculated from the supplied role catalogs. A hidden result for one of the synthetic users does not prove that nobody in production can see that tile.

## 2. The Rules Behind Every Result

1. A tile must have an existing active category, an active tile row, and an existing active import map. This is the SQL in [ApplicationCategoryRepo:24](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/repository/ApplicationCategoryRepo.java:24).
2. The selected rows are ordered by category `order_no`, then tile `order_no`.
3. An active selected template is visible without checking its entity or subject: [AdminModuleUtil:103](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/util/AdminModuleUtil.java:103).
4. A non-template needs an exact entity-name match: [AdminModuleUtil:109](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/util/AdminModuleUtil.java:109).
5. If its subject is blank, a matching entity is enough: [AdminModuleUtil:111](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/util/AdminModuleUtil.java:111).
6. Otherwise either subject `name` or `longName` must match, ignoring case: [AdminModuleUtil:115](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/util/AdminModuleUtil.java:115).
7. A tile granted by several roles appears once, and empty drawer categories are removed: [AdminModuleUtil:125](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/util/AdminModuleUtil.java:125).

Actions are carried in permission claims, but this tile-visibility filter does not require a particular action name. The category/tile/import `ems2_role` fields do not determine drawer visibility. `filter_rule` and `entry_name` are exported fields that this `getDrawer` method does not consume. An import-map entry tells the browser where the application code is; it is not proof that that code loaded or that a business API allowed an operation.

```sql
SELECT c.application_category_id, c.label, m.key_name, t.*  FROM application_category c, application_tile t, import_map m WHERE c.application_category_id=t.application_category_id and t.import_map_id=m.import_map_id and c.is_active = true and t.is_active = true and m.is_active = true order by c.order_no, t.order_no
```

## 3. Five Test Users Against The Complete Dump

These are the same synthetic role assignments used by the POC. Each result includes the common 14 templates listed in section 5.

| Synthetic user | Roles | Non-template tile IDs | Total visible |
| --- | --- | --- | --- |
| poc-ratan | X_RATANONE / FMO_COO_SUP | 54, 104, 105, 156, 193 | 19 |
| poc-admin | FMO PORTAL ADMIN / FMO_ADMIN | 1, 2, 3, 4 | 18 |
| poc-both | X_RATANONE / FMO_COO_SUP; FMO PORTAL ADMIN / FMO_ADMIN | 1, 2, 3, 4, 54, 104, 105, 156, 193 | 23 |
| poc-two-roles | X_RATANONE / FMO_COO_SUP; X_RATANONE / FMO_KR_OPS | 18, 54, 104, 105, 156, 193 | 20 |
| poc-none | No roles | None | 14 |

The previous three-tile Ratan result was limited to the selected POC examples. The complete dump also contains `RATAN Rule Engine` (156) and the blank-subject `Exception Auto Recover` (193). A no-role user therefore has 14 visible templates in this full-dump replay; no protected tiles.

### Combining Roles

For this filter, a user with several supplied roles sees the union of their individual tile sets. Duplicates appear once. The result does not depend on whether the matching subject came from their first or second role. Section 7 gives the result for every single role in the supplied catalogs, so any combination of those roles can be read as a union of those rows. A role with an entity but explicitly empty subject grants is a separate case: it can still expose matching blank-subject tiles. An account with no entities exposes only templates. A failed API response is an error, not a valid no-role result.

## 4. Every Tile Record

`T/C/I` gives whether the tile, category and import map are active. `SQL` means the row survives their join. `COO` means `X_RATANONE / FMO_COO_SUP`; `KR` means `X_RATANONE / FMO_KR_OPS`; `Admin` means `FMO PORTAL ADMIN / FMO_ADMIN`; `All 3` combines those three roles. Entity counts are counts of distinct trimmed names, not user counts. Each CSV link identifies the original record. Inactive rows cannot become visible through a template or a permission match.

| ID | Title | Category | Import map | T/C/I | SQL | Template | Entity count | Subject | COO | KR | Admin | All 3 | CSV source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Module Map | 1 / Admin Module | 5 / base | Y/Y/Y | Yes | No | 1 | /importmap | No | No | Yes | Yes | [line 2](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:2) |
| 2 | Drawer Category | 1 / Admin Module | 5 / base | Y/Y/Y | Yes | No | 1 | /category | No | No | Yes | Yes | [line 3](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:3) |
| 3 | Tile Configuration | 1 / Admin Module | 5 / base | Y/Y/Y | Yes | No | 1 | /tile | No | No | Yes | Yes | [line 4](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:4) |
| 4 | FDC3 | 1 / Admin Module | 5 / base | Y/Y/Y | Yes | No | 1 | /tile | No | No | Yes | Yes | [line 5](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:5) |
| 15 | Validation Exceptions | 4 / Exception Management | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_VALIDATION_EXCEPTION | No | No | No | No | [line 6](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:6) |
| 16 | Settlement Exceptions | 4 / Exception Management | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_SETTLEMENT_EXCEPTION | No | No | No | No | [line 7](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:7) |
| 17 | MO Exceptions | 4 / Exception Management | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_MO_EXCEPTION | No | No | No | No | [line 8](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:8) |
| 18 | Korea MX Exceptions | 4 / Exception Management | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_KR_EXCEPTION | No | Yes | No | Yes | [line 9](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:9) |
| 19 | Payment Processing | 5 / FSS SERVICES | 18 / mfe_fssservices_container | Y/Y/Y | Yes | No | 2 | FSS Payments Services | No | No | No | No | [line 10](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:10) |
| 20 | Payments - Transaction | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 4 | FSS Services Payments Core | No | No | No | No | [line 11](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:11) |
| 21 | Payments - Reference | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 5 | FSS Services Payments Reference | No | No | No | No | [line 12](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:12) |
| 22 | FSS Services – DAC | 5 / FSS SERVICES | 20 / mfe_fssservices_peregrine_container | Y/Y/Y | Yes | No | 27 | FSS Services Peregrine | No | No | No | No | [line 13](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:13) |
| 23 | BAP Digitization | 5 / FSS SERVICES | 22 / mfe_fssservices_bap_container | Y/Y/Y | Yes | No | 243 | FSS Business Acceptance Portal | No | No | No | No | [line 14](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:14) |
| 24 | FA - Reference | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 11 | FSS Fee Accrual Reference | No | No | No | No | [line 15](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:15) |
| 25 | FA - Transaction | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 7 | FSS Fee Accrual Core | No | No | No | No | [line 16](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:16) |
| 26 | FSS Rules Management | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 6 | FSS Services Payments COE | No | No | No | No | [line 17](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:17) |
| 28 | Security Threats | 7 / M7 Platform | 10 / ratan_container | N/Y/Y | No | No | 1 | RATAN_MO_EXCEPTION | No | No | No | No | [line 18](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:18) |
| 29 | Authorization Limits | 8 / Business Rule | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_PROFILE_LIMITS | No | No | No | No | [line 19](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:19) |
| 30 | Settlement NSTP Rules | 8 / Business Rule | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_SETTLEMENT_STP_RULE | No | No | No | No | [line 20](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:20) |
| 31 | Settlement NSTP Rules | 8 / Business Rule | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_SETTLEMENT_STP_RULE | No | No | No | No | [line 21](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:21) |
| 32 | Suppression Rules | 8 / Business Rule | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_SUPPRESSION_RULE | No | No | No | No | [line 22](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:22) |
| 33 | Suppression Rules | 8 / Business Rule | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_SUPPRESSION_RULE | No | No | No | No | [line 23](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:23) |
| 34 | Suppression Rules | 8 / Business Rule | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_SUPPRESSION_RULE | No | No | No | No | [line 24](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:24) |
| 35 | MO Rules | 8 / Business Rule | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_MO_RULE | No | No | No | No | [line 25](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:25) |
| 36 | Cashflow Blotter | 9 / Settlement | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_CASHFLOW_BLOTTER | No | No | No | No | [line 26](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:26) |
| 37 | Cashflow Blotter | 9 / Settlement | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_STRATEGIC_CASHFLOW_BLOTTER | No | No | No | No | [line 27](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:27) |
| 38 | Grouping Blotter | 9 / Settlement | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_CASHFLOW_GROUP_BLOTTER | No | No | No | No | [line 28](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:28) |
| 39 | Cashflow Dashboard | 9 / Settlement | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_STRATEGIC_CASHFLOW_BLOTTER | No | No | No | No | [line 29](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:29) |
| 43 | SSI | 11 / SSI plus | 30 / ssi_container | Y/Y/Y | Yes | No | 1 | SEARCH | No | No | No | No | [line 30](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:30) |
| 44 | Static | 11 / SSI plus | 30 / ssi_container | Y/Y/Y | Yes | No | 1 | STATIC | No | No | No | No | [line 31](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:31) |
| 45 | Validation rules and Market filter set | 11 / SSI plus | 30 / ssi_container | Y/Y/Y | Yes | No | 1 | VALIDATIONRULES | No | No | No | No | [line 32](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:32) |
| 46 | Work Queues | 11 / SSI plus | 30 / ssi_container | Y/Y/Y | Yes | No | 1 | WORKQUEUE | No | No | No | No | [line 33](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:33) |
| 47 | Import/Export | 11 / SSI plus | 30 / ssi_container | Y/Y/Y | Yes | No | 1 | IMPORTEXPORT | No | No | No | No | [line 34](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:34) |
| 48 | Mapping Query | 12 / Static Data Mapping | 32 / stamp_container | Y/Y/Y | Yes | No | 1 | Mapping Query | No | No | No | No | [line 35](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:35) |
| 49 | Audit | 12 / Static Data Mapping | 32 / stamp_container | Y/Y/Y | Yes | No | 1 | Audit | No | No | No | No | [line 36](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:36) |
| 50 | Netting Static | 13 / Static | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_NETTING_RULE | No | No | No | No | [line 37](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:37) |
| 51 | Nostro Static | 13 / Static | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_NOSTRO_BLOTTER | No | No | No | No | [line 38](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:38) |
| 52 | BIC Netting Static | 13 / Static | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_NETTING_RULE | No | No | No | No | [line 39](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:39) |
| 53 | Ratan Config Management | 13 / Static | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_NETTING_RULE | No | No | No | No | [line 40](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:40) |
| 54 | Trade Blotter | 15 / Trade Processing | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_TRADE_BLOTTER | Yes | No | No | Yes | [line 41](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:41) |
| 65 | Date Range Picker Example | 2 / Template | 7 / template_container | Y/Y/Y | Yes | Yes | 0 | (blank) | Yes | Yes | Yes | Yes | [line 42](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:42) |
| 66 | Modal Example | 2 / Template | 7 / template_container | Y/Y/Y | Yes | Yes | 0 | (blank) | Yes | Yes | Yes | Yes | [line 43](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:43) |
| 67 | Search Block | 2 / Template | 7 / template_container | Y/Y/Y | Yes | Yes | 0 | (blank) | Yes | Yes | Yes | Yes | [line 44](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:44) |
| 68 | Search Block | 2 / Template | 7 / template_container | Y/Y/Y | Yes | Yes | 0 | (blank) | Yes | Yes | Yes | Yes | [line 45](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:45) |
| 69 | Simple Table | 2 / Template | 7 / template_container | Y/Y/Y | Yes | Yes | 0 | (blank) | Yes | Yes | Yes | Yes | [line 46](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:46) |
| 70 | Grid Tool Table | 2 / Template | 7 / template_container | Y/Y/Y | Yes | Yes | 0 | (blank) | Yes | Yes | Yes | Yes | [line 47](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:47) |
| 71 | Routing Tile | 2 / Template | 7 / template_container | Y/Y/Y | Yes | Yes | 0 | (blank) | Yes | Yes | Yes | Yes | [line 48](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:48) |
| 72 | Inbound Blotter | 2 / Template | 7 / template_container | Y/Y/Y | Yes | Yes | 0 | (blank) | Yes | Yes | Yes | Yes | [line 49](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:49) |
| 73 | Analytics | 2 / Template | 7 / template_container | Y/Y/Y | Yes | Yes | 0 | (blank) | Yes | Yes | Yes | Yes | [line 50](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:50) |
| 74 | LoanIQ UI | 6 / LoanIQ | 27 / loanIq_container | Y/Y/Y | Yes | No | 1 | /LoanIQIL_UI | No | No | No | No | [line 51](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:51) |
| 79 | FDC3 Consumer | 2 / Template | 7 / template_container | Y/Y/Y | Yes | Yes | 0 | (blank) | Yes | Yes | Yes | Yes | [line 52](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:52) |
| 80 | FDC3 Provider | 2 / Template | 7 / template_container | Y/Y/Y | Yes | Yes | 0 | (blank) | Yes | Yes | Yes | Yes | [line 53](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:53) |
| 94 | Outbound Blotter | 3 / Confirmations | 52 / cdups_container | Y/Y/Y | Yes | No | 1 | trade.tradedetails.view | No | No | No | No | [line 54](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:54) |
| 95 | Inbound Blotter | 3 / Confirmations | 52 / cdups_container | Y/Y/Y | Yes | No | 1 | inbounddocs.view | No | No | No | No | [line 55](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:55) |
| 96 | FMCES | 30 / FMCES | 55 / mfe_ems3_container | Y/Y/Y | Yes | No | 1 | fmces_tiles | No | No | No | No | [line 56](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:56) |
| 98 | Billing - EVAT | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 2 | FSS Billing EVAT | No | No | No | No | [line 57](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:57) |
| 100 | FSS Mosaic | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 5 | FSS Services Mosaic | No | No | No | No | [line 58](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:58) |
| 101 | Interop Navigation | 2 / Template | 7 / template_container | Y/Y/Y | Yes | Yes | 0 | (blank) | Yes | Yes | Yes | Yes | [line 59](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:59) |
| 102 | test | 2 / Template | 6 / template | N/Y/Y | No | Yes | 1 | test | No | No | No | No | [line 60](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:60) |
| 104 | FM COO Rules | 8 / Business Rule | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_FM_COO_RULE | Yes | No | No | Yes | [line 61](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:61) |
| 105 | FM COO Exceptions | 4 / Exception Management | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_FM_COO_EXCEPTION | Yes | No | No | Yes | [line 62](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:62) |
| 106 | Exception Management | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 34 | FSS EXCEPTION DASHBOARD | No | No | No | No | [line 63](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:63) |
| 108 | Flowzero | 32 / Flowzero | 66 / flowzero | Y/Y/Y | Yes | No | 1 | FLOW_ZERO_RAISE REQUEST | No | No | No | No | [line 64](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:64) |
| 109 | Verification Sample Tile1 | 33 / Verification Sample | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_VALIDATION_EXCEPTION | No | No | No | No | [line 65](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:65) |
| 112 | Reporting Framework | 36 / FSS Data Store | 68 / fssdatastore_container | N/Y/N | No | No | 8 | FSS Datastore Reporting Framework | No | No | No | No | [line 66](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:66) |
| 114 | C&A Rules | 8 / Business Rule | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_MO_RULE | No | No | No | No | [line 67](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:67) |
| 115 | C&A Exceptions | 4 / Exception Management | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_MO_EXCEPTION | No | No | No | No | [line 68](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:68) |
| 117 | RATAN Test Portal | 38 / RATAN Tools | 64 / tech_testing | Y/Y/N | No | Yes | 1 | RATAN_TEST_PORTAL_RATAN | No | No | No | No | [line 69](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:69) |
| 118 | VPA Test Cases | 38 / RATAN Tools | 64 / tech_testing | Y/Y/N | No | Yes | 1 | RATAN_TEST_PORTAL_VPA | No | No | No | No | [line 70](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:70) |
| 119 | FSS Business Rules | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 1 | FSS Services Payments COE | No | No | No | No | [line 71](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:71) |
| 122 | FSS Billing | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 25 | FSS Billing Reference | No | No | No | No | [line 72](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:72) |
| 123 | Nostro Threshold Static | 13 / Static | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_NETTING_RULE | No | No | No | No | [line 73](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:73) |
| 124 | CA Domestic | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 8 | FSS_CA_DOMESTIC_DISBURSEMENT | No | No | No | No | [line 74](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:74) |
| 125 | FSS DA Billing | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 1 | FSS Billing Reference | No | No | No | No | [line 75](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:75) |
| 130 | Report Download | 20 / SSDR | 80 / ssdr_container | Y/Y/Y | Yes | No | 267 | (blank) | No | No | No | No | [line 76](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:76) |
| 131 | Report Scheduler | 20 / SSDR | 80 / ssdr_container | Y/Y/Y | Yes | Yes | 267 | ReportScheduler | Yes | Yes | Yes | Yes | [line 77](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:77) |
| 132 | Query Builder | 20 / SSDR | 80 / ssdr_container | N/Y/Y | No | No | 6 | QueryBuilder | No | No | No | No | [line 78](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:78) |
| 134 | FSS Rebalancing | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 1 | FSS Services Rebalancing | No | No | No | No | [line 79](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:79) |
| 136 | Access Management | 20 / SSDR | 80 / ssdr_container | Y/Y/Y | Yes | Yes | 0 | (blank) | Yes | Yes | Yes | Yes | [line 80](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:80) |
| 137 | Utilization Static | 13 / Static | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_NETTING_RULE | No | No | No | No | [line 81](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:81) |
| 139 | FX True Up & RIK | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 1 | FSS Services TrueUp | No | No | No | No | [line 82](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:82) |
| 140 | FSS Swing Price Metrics | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 2 | FSS Services Swing Price Metrics | No | No | No | No | [line 83](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:83) |
| 141 | FSS Funds Reference | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 8 | FSS Services Price Metrics Reference | No | No | No | No | [line 84](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:84) |
| 143 | SSI | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 1 | FSS SSI | No | No | No | No | [line 85](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:85) |
| 144 | Cashflow Blotter | 9 / Settlement | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_STRATEGIC_CASHFLOW_BLOTTER | No | No | No | No | [line 86](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:86) |
| 145 | test | 9 / Settlement | 10 / ratan_container | Y/Y/Y | Yes | No | 261 | (blank) | No | No | No | No | [line 87](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:87) |
| 147 | CA Dashboard | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 32 | FSS EXCEPTION DASHBOARD CA | No | No | No | No | [line 88](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:88) |
| 149 | FSS Fair Price Metrics | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 1 | FSS Services Fair Price Metrics | No | No | No | No | [line 89](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:89) |
| 150 | Cash Projection | 46 / FSS DATA STORE | 24 / fssservices_container | Y/Y/Y | Yes | No | 2 | FSS Datastore Cash Projection | No | No | No | No | [line 90](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:90) |
| 152 | Cashflow Blotter | 9 / Settlement | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_STRATEGIC_CASHFLOW_BLOTTER | No | No | No | No | [line 91](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:91) |
| 154 | DDR | 36 / FSS Data Store | 68 / fssdatastore_container | N/Y/N | No | No | 8 | FSS Datastore Reporting Framework | No | No | No | No | [line 92](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:92) |
| 156 | RATAN Rule Engine | 8 / Business Rule | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_RULE_ENGINE | Yes | No | No | Yes | [line 93](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:93) |
| 157 | Trade Details | 3 / Confirmations | 52 / cdups_container | Y/Y/Y | Yes | No | 1 | trade.tradedetails.view | No | No | No | No | [line 94](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:94) |
| 158 | Fix Link | 44 / VPA | 96 / vpa_container | Y/Y/Y | Yes | No | 1 | Fix Link | No | No | No | No | [line 95](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:95) |
| 159 | Exception Handle | 44 / VPA | 96 / vpa_container | Y/Y/Y | Yes | No | 1 | Exception Handle | No | No | No | No | [line 96](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:96) |
| 160 | Audit Log | 44 / VPA | 96 / vpa_container | Y/Y/Y | Yes | No | 1 | Audit Log | No | No | No | No | [line 97](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:97) |
| 161 | Cashflow Blotter | 9 / Settlement | 101 / idns_container | Y/Y/Y | Yes | No | 1 | RATAN_STRATEGIC_CASHFLOW_BLOTTER | No | No | No | No | [line 98](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:98) |
| 162 | Test Compliance Rules | 8 / Business Rule | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_NETTING_RULE | No | No | No | No | [line 99](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:99) |
| 164 | Grouping Blotter | 9 / Settlement | 101 / idns_container | Y/Y/Y | Yes | No | 1 | RATAN_CASHFLOW_GROUP_BLOTTER | No | No | No | No | [line 100](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:100) |
| 165 | Cashflow Dashboard | 9 / Settlement | 101 / idns_container | Y/Y/Y | Yes | No | 1 | RATAN_STRATEGIC_CASHFLOW_BLOTTER | No | No | No | No | [line 101](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:101) |
| 166 | Nostro Threshold Static | 13 / Static | 101 / idns_container | Y/Y/Y | Yes | No | 1 | RATAN_NETTING_RULE | No | No | No | No | [line 102](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:102) |
| 167 | BIC Netting Static | 13 / Static | 101 / idns_container | Y/Y/Y | Yes | No | 1 | RATAN_NETTING_RULE | No | No | No | No | [line 103](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:103) |
| 168 | Netting Static | 13 / Static | 101 / idns_container | Y/Y/Y | Yes | No | 1 | RATAN_NETTING_RULE | No | No | No | No | [line 104](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:104) |
| 169 | Utilization Static | 13 / Static | 101 / idns_container | Y/Y/Y | Yes | No | 1 | RATAN_NETTING_RULE | No | No | No | No | [line 105](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:105) |
| 170 | Nostro Static | 13 / Static | 101 / idns_container | Y/Y/Y | Yes | No | 1 | RATAN_NOSTRO_BLOTTER | No | No | No | No | [line 106](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:106) |
| 171 | Authorization Limits | 8 / Business Rule | 101 / idns_container | Y/Y/Y | Yes | No | 1 | RATAN_PROFILE_LIMITS | No | No | No | No | [line 107](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:107) |
| 172 | Settlement NSTP Rules | 8 / Business Rule | 101 / idns_container | Y/Y/Y | Yes | No | 1 | RATAN_SETTLEMENT_STP_RULE | No | No | No | No | [line 108](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:108) |
| 173 | Suppression Rules | 8 / Business Rule | 101 / idns_container | Y/Y/Y | Yes | No | 1 | RATAN_SUPPRESSION_RULE | No | No | No | No | [line 109](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:109) |
| 174 | Suppression Rules | 8 / Business Rule | 101 / idns_container | Y/Y/Y | Yes | No | 1 | RATAN_SUPPRESSION_RULE | No | No | No | No | [line 110](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:110) |
| 175 | Trade Monitor | 44 / VPA | 96 / vpa_container | Y/Y/Y | Yes | No | 1 | Trade Monitor | No | No | No | No | [line 111](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:111) |
| 177 | Gold Custody | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 1 | FSS GOLD CUSTODY IN | No | No | No | No | [line 112](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:112) |
| 179 | Reporting Framework | 46 / FSS DATA STORE | 24 / fssservices_container | Y/Y/Y | Yes | No | 338 | FSS Datastore Reporting Framework | No | No | No | No | [line 113](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:113) |
| 181 | Release Cutoff Static | 13 / Static | 10 / ratan_container | N/Y/Y | No | No | 1 | RATAN_NOSTRO_BLOTTER | No | No | No | No | [line 114](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:114) |
| 182 | FSS Gating | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 1 | FSS Services Funds Gating | No | No | No | No | [line 115](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:115) |
| 183 | Currency Mapping | 13 / Static | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_NOSTRO_BLOTTER | No | No | No | No | [line 116](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:116) |
| 184 | Accounting Static | 13 / Static | 10 / ratan_container | N/Y/Y | No | No | 1 | RATAN_NOSTRO_BLOTTER | No | No | No | No | [line 117](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:117) |
| 185 | Swift Static | 13 / Static | 10 / ratan_container | N/Y/Y | No | No | 1 | RATAN_NOSTRO_BLOTTER | No | No | No | No | [line 118](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:118) |
| 187 | PLACEHOLDER | 5 / FSS SERVICES | 24 / fssservices_container | Y/Y/Y | Yes | No | 1 | PLACEHOLDER | No | No | No | No | [line 119](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:119) |
| 189 | DA - Col. Management | 5 / FSS SERVICES | 20 / mfe_fssservices_peregrine_container | Y/Y/Y | Yes | No | 1 | Digital Asset Collateral Management | No | No | No | No | [line 120](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:120) |
| 191 | Option Expiry Blotter | 15 / Trade Processing | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_OPTION_EXPIRY_BLOTTER | No | No | No | No | [line 121](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:121) |
| 192 | 1mo | 42 / TEST Catergory | 102 / idns_cashflow_blotter | N/Y/Y | No | Yes | 1 | 14 | No | No | No | No | [line 122](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:122) |
| 193 | Exception Auto Recover | 4 / Exception Management | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | (blank) | Yes | Yes | No | Yes | [line 123](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:123) |
| 194 | FSS DS Query | 46 / FSS DATA STORE | 60 / fss_mosaic | N/Y/Y | No | Yes | 1 | data | No | No | No | No | [line 124](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:124) |
| 195 | FSS DS Query | 46 / FSS DATA STORE | 60 / fss_mosaic | N/Y/Y | No | Yes | 1 | sgs | No | No | No | No | [line 125](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:125) |
| 196 | New Entity Onboarding | 13 / Static | 10 / ratan_container | Y/Y/Y | Yes | No | 1 | RATAN_NOSTRO_BLOTTER | No | No | No | No | [line 126](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:126) |
| 202 | 11haha | 9 / Settlement | 102 / idns_cashflow_blotter | Y/Y/Y | Yes | No | 1 | 1 | No | No | No | No | [line 127](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:127) |
| 212 | 11 | 9 / Settlement | 102 / idns_cashflow_blotter | N/Y/Y | No | No | 1 | 1 | No | No | No | No | [line 128](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:128) |
| 214 | 123 | 9 / Settlement | 102 / idns_cashflow_blotter | N/Y/Y | No | No | 1 | 1 | No | No | No | No | [line 129](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:129) |
| 215 | 11 | 9 / Settlement | 102 / idns_cashflow_blotter | N/Y/Y | No | No | 1 | 1 | No | No | No | No | [line 130](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:130) |

## 5. All 14 Templates That Everyone Sees After Successful Login

These pass the active join and then bypass the entity/subject check because `is_template = true`. They are still unavailable when the whole login/authorization attempt fails.

| ID | Title | Category | CSV source |
| --- | --- | --- | --- |
| 65 | Date Range Picker Example | Template | [line 42](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:42) |
| 66 | Modal Example | Template | [line 43](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:43) |
| 67 | Search Block | Template | [line 44](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:44) |
| 68 | Search Block | Template | [line 45](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:45) |
| 69 | Simple Table | Template | [line 46](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:46) |
| 70 | Grid Tool Table | Template | [line 47](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:47) |
| 71 | Routing Tile | Template | [line 48](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:48) |
| 72 | Inbound Blotter | Template | [line 49](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:49) |
| 73 | Analytics | Template | [line 50](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:50) |
| 101 | Interop Navigation | Template | [line 59](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:59) |
| 79 | FDC3 Consumer | Template | [line 52](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:52) |
| 80 | FDC3 Provider | Template | [line 53](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:53) |
| 131 | Report Scheduler | SSDR | [line 77](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:77) |
| 136 | Access Management | SSDR | [line 80](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:80) |

**Report Scheduler (131)** is a template even though its row contains entitlement entity names and subject `ReportScheduler`. Those names do not restrict this filter when the template flag is true. **Access Management (136)** is also a template. These are existing export values.

## 6. All 16 Excluded Rows

These are removed before permission comparison. Permissions and template status cannot rescue them.

| ID | Title | Reason | CSV source |
| --- | --- | --- | --- |
| 28 | Security Threats | inactive tile | [line 18](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:18) |
| 102 | test | inactive tile | [line 60](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:60) |
| 112 | Reporting Framework | inactive tile, inactive import map | [line 66](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:66) |
| 117 | RATAN Test Portal | inactive import map | [line 69](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:69) |
| 118 | VPA Test Cases | inactive import map | [line 70](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:70) |
| 132 | Query Builder | inactive tile | [line 78](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:78) |
| 154 | DDR | inactive tile, inactive import map | [line 92](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:92) |
| 181 | Release Cutoff Static | inactive tile | [line 114](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:114) |
| 184 | Accounting Static | inactive tile | [line 117](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:117) |
| 185 | Swift Static | inactive tile | [line 118](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:118) |
| 192 | 1mo | inactive tile | [line 122](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:122) |
| 194 | FSS DS Query | inactive tile | [line 124](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:124) |
| 195 | FSS DS Query | inactive tile | [line 125](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:125) |
| 212 | 11 | inactive tile | [line 128](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:128) |
| 214 | 123 | inactive tile | [line 129](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:129) |
| 215 | 11 | inactive tile | [line 130](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:130) |

## 7. Every Supplied Single-Role Result

Each row below also sees the same 14 templates in section 5. The listed IDs are the additional non-template tiles. These are 50 role-and-entity combinations, not 50 actual employees.

| Entity | Role | Additional non-template tile IDs | Total visible |
| --- | --- | --- | --- |
| FMO PORTAL ADMIN | CDUPS_ADMIN | 1, 2, 3, 4 | 18 |
| FMO PORTAL ADMIN | FMCES_ADMIN | 1, 2, 3, 4 | 18 |
| FMO PORTAL ADMIN | FMO_ADMIN | 1, 2, 3, 4 | 18 |
| FMO PORTAL ADMIN | FSS_PROD | 1, 2, 3, 4 | 18 |
| FMO PORTAL ADMIN | RATAN_PROD | 1, 2, 3, 4 | 18 |
| FMO PORTAL ADMIN | SSDR_ADMIN | 1, 2, 3, 4 | 18 |
| FMO PORTAL ADMIN | SSIPLUS_PROD | 1, 2, 3, 4 | 18 |
| FMO PORTAL ADMIN | STAMP_ADMIN | 1, 2, 3, 4 | 18 |
| FMO PORTAL ADMIN | srv.51507.ssdr.002 | 1, 2, 3, 4 | 18 |
| FMO PORTAL ADMIN | srv.54865.fssdatastore.001 | 1, 2, 3, 4 | 18 |
| FMO PORTAL ADMIN | srv.ems2.001 | 1, 2, 3, 4 | 18 |
| FMO PORTAL ADMIN | srv.liquser.001 | 1, 2, 3, 4 | 18 |
| SSDR_ANALYST | SSDR_ANALYST | 130 | 15 |
| SSDR_ANALYST | SSDR_USER | 130 | 15 |
| SSIPLUS | SSI_DATAOPS_READONLY_USER_GLOBAL | 43, 44, 45, 46, 47 | 19 |
| SSIPLUS | SSI_DATAOPS_READONLY_USER_RESTRICTEDCOUNTRY | 43, 44, 45, 46, 47 | 19 |
| SSIPLUS | SSI_DATAOPS_USER_GLOBAL | 43, 44, 45, 46, 47 | 19 |
| SSIPLUS | SSI_DATAOPS_USER_RESTRICTEDCOUNTRY | 43, 44, 45, 46, 47 | 19 |
| SSIPLUS | SSI_PSS_USER | 43, 44, 45, 46, 47 | 19 |
| SSIPLUS | SSI_READONLY | 43, 44, 45, 46, 47 | 19 |
| SSIPLUS | SSI_SUPER_USER | 43, 44, 45, 46, 47 | 19 |
| STAMP_STATIC | CHECKER | 48, 49 | 16 |
| STAMP_STATIC | MAKER | 48, 49 | 16 |
| STAMP_STATIC | STATIC_STAMP | 48, 49 | 16 |
| STAMP_STATIC | VIEW_ONLY | 48, 49 | 16 |
| X_RATANONE | FMO_COO | 54, 104, 105, 156, 193 | 19 |
| X_RATANONE | FMO_COO_SUP | 54, 104, 105, 156, 193 | 19 |
| X_RATANONE | FMO_ID_OPS_TEST | 15, 16, 17, 30, 31, 32, 33, 34, 36, 50, 51, 52, 53, 54, 109, 115, 123, 137, 162, 166, 167, 168, 169, 170, 172, 173, 174, 183, 193, 196 | 44 |
| X_RATANONE | FMO_KR_OPS | 18, 193 | 16 |
| X_RATANONE | FMO_MO | 193 | 15 |
| X_RATANONE | FMO_MO_RO | 16, 17, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 50, 51, 52, 53, 54, 114, 115, 123, 137, 144, 152, 156, 161, 162, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 191, 193, 196 | 54 |
| X_RATANONE | FMO_MO_TE | 16, 17, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 50, 51, 52, 53, 54, 114, 115, 123, 137, 144, 152, 156, 161, 162, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 191, 193, 196 | 54 |
| X_RATANONE | FMO_MO_TE_SUP | 16, 17, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 50, 51, 52, 53, 54, 114, 115, 123, 137, 144, 152, 156, 161, 162, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 191, 193, 196 | 54 |
| X_RATANONE | FMO_MO_TV | 16, 17, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 50, 51, 52, 53, 54, 114, 115, 123, 137, 144, 152, 156, 161, 162, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 191, 193, 196 | 54 |
| X_RATANONE | FMO_MO_TV_SUP | 16, 17, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 50, 51, 52, 53, 54, 114, 115, 123, 137, 144, 152, 156, 161, 162, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 191, 193, 196 | 54 |
| X_RATANONE | FMO_OPS_BO | 15, 16, 17, 29, 30, 31, 32, 33, 34, 36, 37, 38, 39, 50, 51, 52, 53, 54, 109, 115, 123, 137, 144, 152, 161, 162, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 193, 196 | 54 |
| X_RATANONE | FMO_OPS_BOC | 15, 16, 17, 29, 30, 31, 32, 33, 34, 36, 37, 38, 39, 50, 51, 52, 53, 54, 109, 115, 123, 137, 144, 152, 161, 162, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 193, 196 | 54 |
| X_RATANONE | FMO_OPS_BOL | 15, 16, 17, 29, 30, 31, 32, 33, 34, 36, 37, 38, 39, 50, 51, 52, 53, 54, 109, 115, 123, 137, 144, 152, 161, 162, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 193, 196 | 54 |
| X_RATANONE | FMO_OPS_BOM | 15, 16, 17, 29, 30, 31, 32, 33, 34, 36, 37, 38, 39, 50, 51, 52, 53, 54, 109, 115, 123, 137, 144, 152, 161, 162, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 193, 196 | 54 |
| X_RATANONE | FMO_OPS_BOS | 15, 16, 17, 29, 30, 31, 32, 33, 34, 36, 37, 38, 39, 50, 51, 52, 53, 54, 109, 115, 123, 137, 144, 152, 161, 162, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 193, 196 | 54 |
| X_RATANONE | FMO_OPS_INV | 15, 16, 17, 29, 30, 31, 32, 33, 34, 36, 37, 38, 39, 50, 51, 52, 53, 54, 109, 115, 123, 137, 144, 152, 161, 162, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 193, 196 | 54 |
| X_RATANONE | FMO_OPS_MKR | 15, 16, 17, 29, 30, 31, 32, 33, 34, 36, 37, 38, 39, 50, 51, 52, 53, 54, 109, 115, 123, 137, 144, 152, 161, 162, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 193, 196 | 54 |
| X_RATANONE | FMO_RATAN_TEST | 193 | 15 |
| X_RATANONE | FMO_RO | 15, 16, 17, 29, 30, 31, 32, 33, 34, 36, 37, 38, 39, 50, 51, 52, 53, 54, 109, 115, 123, 137, 144, 152, 161, 162, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 193, 196 | 54 |
| X_RATANONE | FMO_STA_CKR | 15, 16, 17, 29, 30, 31, 32, 33, 34, 36, 37, 39, 50, 51, 52, 53, 54, 109, 115, 123, 137, 144, 152, 161, 162, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 193, 196 | 52 |
| X_RATANONE | FMO_STA_MKR | 15, 16, 17, 29, 30, 31, 32, 33, 34, 36, 37, 39, 50, 51, 52, 53, 54, 109, 115, 123, 137, 144, 152, 161, 162, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 193, 196 | 52 |
| X_RATANONE | FMO_VPA_TEST | 193 | 15 |
| X_RATANONE | KR_PSS_RO | 18, 193 | 16 |
| X_RATANONE | NON_FMO_RO | 15, 16, 17, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 50, 51, 52, 53, 54, 109, 114, 115, 123, 137, 144, 152, 161, 162, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 193, 196 | 56 |
| X_RATANONE | PSS_RO | 15, 16, 17, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 50, 51, 52, 53, 54, 109, 114, 115, 123, 137, 144, 152, 161, 162, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 183, 193, 196 | 56 |

## 8. Exact Record Traces For The POC Tiles

The CSV records below connect a drawer entry to the application module loaded when the tile is clicked. The Java response prefixes the import key with `@fm/` and module/tile with `/`. For example, Trade Blotter becomes container `@fm/ratan_container`, module `/trade_blotter`, tile `/trade`. All eight rows below have active category/tile/import and `is_template = false`.

| ID | Title | Tile record | Category record | Import record | Container | Script path | Module | Tile route | Entity | Subject |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Module Map | [tile 1, line 2](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:2) | [category 1, line 2](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_category.csv:2) | [import 5, line 6](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/import_map.csv:6) | @fm/base | /base/base.js | /importmap | /importmap | FMO PORTAL ADMIN | /importmap |
| 2 | Drawer Category | [tile 2, line 3](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:3) | [category 1, line 2](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_category.csv:2) | [import 5, line 6](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/import_map.csv:6) | @fm/base | /base/base.js | /category | /category | FMO PORTAL ADMIN | /category |
| 3 | Tile Configuration | [tile 3, line 4](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:4) | [category 1, line 2](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_category.csv:2) | [import 5, line 6](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/import_map.csv:6) | @fm/base | /base/base.js | /tile | /tile | FMO PORTAL ADMIN | /tile |
| 4 | FDC3 | [tile 4, line 5](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:5) | [category 1, line 2](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_category.csv:2) | [import 5, line 6](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/import_map.csv:6) | @fm/base | /base/base.js | /fdc3 | /fdc3 | FMO PORTAL ADMIN | /tile |
| 18 | Korea MX Exceptions | [tile 18, line 9](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:9) | [category 4, line 5](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_category.csv:5) | [import 10, line 9](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/import_map.csv:9) | @fm/ratan_container | /ratan_container/ratan_container.js | /exceptions_blotter | /iso_exception | X_RATANONE | RATAN_KR_EXCEPTION |
| 54 | Trade Blotter | [tile 54, line 41](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:41) | [category 15, line 15](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_category.csv:15) | [import 10, line 9](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/import_map.csv:9) | @fm/ratan_container | /ratan_container/ratan_container.js | /trade_blotter | /trade | X_RATANONE | RATAN_TRADE_BLOTTER |
| 104 | FM COO Rules | [tile 104, line 61](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:61) | [category 8, line 9](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_category.csv:9) | [import 10, line 9](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/import_map.csv:9) | @fm/ratan_container | /ratan_container/ratan_container.js | /rules_blotter | /fm_coo_rules | X_RATANONE | RATAN_FM_COO_RULE |
| 105 | FM COO Exceptions | [tile 105, line 62](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:62) | [category 4, line 5](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_category.csv:5) | [import 10, line 9](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/import_map.csv:9) | @fm/ratan_container | /ratan_container/ratan_container.js | /exceptions_blotter | /fm_coo_exceptions | X_RATANONE | RATAN_FM_COO_EXCEPTION |

### Exact XML Grant Records

The XML files are minified onto one physical line. A line-1 link identifies the file, while `Record` identifies the 1-based `<entitlement>` element in that file. The complete grant identity is entity, role, subject and action. The first grant for each relevant subject is shown below; all actions for that subject/role are listed.

| Entity | Role | Subject name | Subject longName | Record | Action on that record | All actions for this role/subject | Source XML |
| --- | --- | --- | --- | --- | --- | --- | --- |
| X_RATANONE | FMO_COO_SUP | RATAN_FM_COO_EXCEPTION | /RATAN_FM_COO_EXCEPTION | 5 | ACCESS_FMO_POST_TRADE_PORTAL | ACCESS_FMO_POST_TRADE_PORTAL, F_Custom_Query_Builder, F_Custom_View_Builder_Private, F_Custom_View_Builder_Public, F_Exception_Addtional_Info_Update, F_Export_Data, F_Manually_Close_Exception | [entitlements.xml:1](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/entitlements.xml:1) |
| X_RATANONE | FMO_COO_SUP | RATAN_TRADE_BLOTTER | /RATAN_TRADE_BLOTTER | 49 | ACCESS_FMO_POST_TRADE_PORTAL | ACCESS_FMO_POST_TRADE_PORTAL, F_Custom_Query_Builder, F_Export_Data | [entitlements.xml:1](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/entitlements.xml:1) |
| X_RATANONE | FMO_COO_SUP | RATAN_FLOW_ZERO | /RATAN_FLOW_ZERO | 213 | ACCESS_FMO_POST_TRADE_PORTAL | ACCESS_FMO_POST_TRADE_PORTAL, F_WORKFLOW_BPMN_DESIGNER, F_WORKFLOW_INSTANCE_REQUEST, F_WORKFLOW_QUERY, F_WORKFLOW_STA_CKR, F_WORKFLOW_STA_MKR | [entitlements.xml:1](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/entitlements.xml:1) |
| X_RATANONE | FMO_KR_OPS | RATAN_KR_EXCEPTION | /RATAN_KR_EXCEPTION | 220 | ACCESS_FMO_POST_TRADE_PORTAL | ACCESS_FMO_POST_TRADE_PORTAL, F_Custom_View_Builder_Private, F_Custom_View_Builder_Public, F_Manually_Close_Exception, F_Replay_Exception | [entitlements.xml:1](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/entitlements.xml:1) |
| X_RATANONE | FMO_COO_SUP | RATAN_FM_COO_RULE | /RATAN_FM_COO_RULE | 226 | ACCESS_FMO_POST_TRADE_PORTAL | ACCESS_FMO_POST_TRADE_PORTAL, F_Input_Delete_Modify_Initiate, F_Input_Delete_Modify_Verify | [entitlements.xml:1](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/entitlements.xml:1) |
| X_RATANONE | FMO_COO_SUP | RATAN_RULE_ENGINE | /RATAN_RULE_ENGINE | 591 | F_Input_Delete_Modify_Initiate | F_Input_Delete_Modify_Initiate, F_Input_Delete_Modify_Verify | [entitlements.xml:1](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/entitlements.xml:1) |
| FMO PORTAL ADMIN | FMO_ADMIN | importmap | /importmap | 5 | READ-WRITE | READ-WRITE | [entitlements_fmo_portal_admin.xml:1](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/entitlements_fmo_portal_admin.xml:1) |
| FMO PORTAL ADMIN | FMO_ADMIN | category | /category | 16 | READ-WRITE | READ-WRITE | [entitlements_fmo_portal_admin.xml:1](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/entitlements_fmo_portal_admin.xml:1) |
| FMO PORTAL ADMIN | FMO_ADMIN | tile | /tile | 29 | READ-WRITE | READ-WRITE | [entitlements_fmo_portal_admin.xml:1](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/entitlements_fmo_portal_admin.xml:1) |

### Why These Eight Tiles Match

- Admin tiles 1 and 2 match `/importmap` and `/category` through XML subject longName. Tiles 3 and 4 both match `/tile`, so one subject exposes both Tile Configuration and FDC3.
- Ratan COO tiles 54, 104 and 105 match subject names RATAN_TRADE_BLOTTER, RATAN_FM_COO_RULE and RATAN_FM_COO_EXCEPTION. That role has no RATAN_KR_EXCEPTION subject, so tile 18 stays hidden.
- The Korea role matches tile 18. It has none of the three COO subjects above, so those three stay hidden for a Korea-only user.
- Combining the COO and Korea roles exposes all four Ratan examples, once each.

### Extra Full-Dump Rows That Change The Earlier POC Result

| ID | Title | Subject | Template | Why it matters | CSV source |
| --- | --- | --- | --- | --- | --- |
| 156 | RATAN Rule Engine | RATAN_RULE_ENGINE | No | COO has RATAN_RULE_ENGINE; visible in full dump. | [line 93](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:93) |
| 193 | Exception Auto Recover | (blank) | No | Any returned X_RATANONE entity is enough; no subject check. | [line 123](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:123) |
| 130 | Report Download | (blank) | No | Requires any one of the listed reporting entities; no subject check. | [line 76](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:76) |
| 131 | Report Scheduler | ReportScheduler | Yes | Template bypasses its configured reporting entities/subject. | [line 77](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:77) |
| 136 | Access Management | (blank) | Yes | Template appears even for the no-role user. | [line 80](/Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:80) |

## 9. What This Data Cannot Say

- Which production employee has which roles: the production user-role assignment source was not supplied.
- The grant catalogs for the 40 active protected tiles whose entity names are absent from the five XML catalogs.
- Whether real EMS3 returns every effective role and grant, including paging/no-access behavior: these examples use synthetic EMS3 responses.
- Whether a clicked tile script loads or its business APIs return data: tile visibility and import-map records are only part of that browser flow.
- Immediate removal of already-open tiles or already-issued tokens after a permission change: the server needs a new authorization check, and existing browser/session behavior must be examined separately.

The tables describe successful, complete permission responses. Provider failures, missing application mappings, invalid sessions, token renewal and browser error screens are covered in the user walkthrough and execution evidence rather than represented as hidden tiles here.
