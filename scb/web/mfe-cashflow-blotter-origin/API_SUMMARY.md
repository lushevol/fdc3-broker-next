# Backend API Summary

This document tracks how front-end actions map to backend API calls. It summarizes the endpoints invoked by the GUI so teams can quickly see which features trigger which requests.

Author: @Feng,Judy. Last updated: 2026/4/10.

## Cashflow CN (REST)
- Cashflow status update (user move) - /api/ratan/v2/ratan/cashflow/move/status/user
- Swift suppression (maker) - /api/ratan/v1/ratan/lifecycle/suppress/maker
- Swift suppression (checker) - /api/ratan/v1/ratan/lifecycle/suppress/checker
- Bulk fail (camunda task) - /api/ratan/v1/camunda/task/bulk/fail
- Cashflow netting - /api/ratan/v1/cashSettlement/cashflows/netting
- Cashflow netting preview - /api/ratan/v1/cashSettlement/cashflows/preview
- Hold cashflow - /api/ratan/v1/ratan/lifecycle/hold
- Unhold cashflow - /api/ratan/v1/ratan/lifecycle/unhold
- Country info lookup - /api/ratan/v1/cashflow/country/countryInfo
- Accounting republish - /api/ratan/v1/accounting/job/republish
- Notification subscriptions - /api/ratan/notification/subscriptions
- Auth limit check - /api/ratan/v1/profileLimitation/checkLimitation
- Swift message by cashflow id - /api/ratan/v2/ratan/swift/
- EBBS accounting detail - /api/ratan/v1/accounting/fetch/
- CCIL netting - /api/ratan/v1/cashSettlement/cashflows/ccil/netting
- CCIL netting preview - /api/ratan/v1/cashSettlement/cashflows/ccil/preview
- Beneficiary BIC netting - /api/ratan/v1/cashSettlement/cashflows/bic/netting
- Beneficiary BIC netting preview - /api/ratan/v1/cashSettlement/cashflows/bic/preview
- Manual settle (maker) - /api/ratan/v1/ratan/lifecycle/settle/maker
- Manual settle (checker) - /api/ratan/v1/ratan/lifecycle/settle/checker
- Exception codes by status - /api/ratan/v1/rep/exceptions/nstpExceptionCodes/byStatus
- Counterparty details list - /api/ratan/da/v1/counterparty
- Manual split - /api/ratan/v1/cashSettlement/cashflows/manualSplit
- Amend split amount - /api/ratan/v1/cashSettlement/cashflows/amendSplitAmount
- Unsplit - /api/ratan/v1/cashSettlement/cashflows/unsplit
- Currency rounding config - /api/ratan/v2/roundingConfig

## Import from Container
- Swift message detail (cashflow details) - /api/ratan/da/v1/swift/message
	- Used in [CashflowDetails/detailsBody.tsx](src/Cashflow_CN/components/CashflowDetails/detailsBody.tsx#L534-L559)
- Filter list (advanced/custom search) - /api/ratan/v2/customview/filters or /api/ratan/v3/customview/filters
	- Used in [Cashflow CN AdvancedSearch](src/Cashflow_CN/components/AdvancedSearch/index.tsx#L26-L67)
	- Used in [Dashboard CustomSearchView](src/Cashflow_Dashboard/components/CustomSearchView/index.tsx#L9-L49)
- Filter details (advanced/custom search) - /api/ratan/v2/customview/filters/{id} or /api/ratan/v3/customview/filters/{id}
	- Used in [Cashflow CN AdvancedSearch](src/Cashflow_CN/components/AdvancedSearch/index.tsx#L26-L67)
	- Used in [Dashboard CustomSearchView](src/Cashflow_Dashboard/components/CustomSearchView/index.tsx#L9-L73)
- Save filter (create) - /api/ratan/v2/customview/filters or /api/ratan/v3/customview/filters
	- Used in [Cashflow CN AdvancedSearch](src/Cashflow_CN/components/AdvancedSearch/index.tsx#L61-L117)
	- Used in [Dashboard CustomSearchView](src/Cashflow_Dashboard/components/CustomSearchView/index.tsx#L30-L72)
- Update filter - /api/ratan/v2/customview/filters/{id} or /api/ratan/v3/customview/filters/{id}
	- Used in [Cashflow CN AdvancedSearch](src/Cashflow_CN/components/AdvancedSearch/index.tsx#L88-L125)
	- Used in [Dashboard CustomSearchView](src/Cashflow_Dashboard/components/CustomSearchView/index.tsx#L33-L57)
- Delete filter - /api/ratan/v2/customview/filters/{rowKey} or /api/ratan/v3/customview/filters/{rowKey}
	- Used in [Cashflow CN AdvancedSearch](src/Cashflow_CN/components/AdvancedSearch/index.tsx#L69-L77)
	- Used in [Dashboard CustomSearchView](src/Cashflow_Dashboard/components/CustomSearchView/index.tsx#L36-L64)

## Cashflow CN (GraphQL)
- Cashflow settlement GraphQL (cashflows list/details/audit/split details) - /api/ratan/stmcn/v1/cashflows
- Counterparty details GraphQL (DA) - /api/ratan/da/graphql

## Cashflow Group Management
- Manual deliver group messages - /api/ratan/v1/message/deliver
- Manual resend group messages - /api/ratan/v1/message/resend
- Group messages GraphQL query - /api/ratan/stmcn/v1/cashflows

## Authorization Limits
- List profile limitations - /api/ratan/v1/profileLimitation
- Create limitation - /api/ratan/v1/profileLimitation/create
- Edit limitation - /api/ratan/v1/profileLimitation/edit
- Confirm limitation - /api/ratan/v1/profileLimitation/confirm/{profile}/{currency}/{status}
- Reject limitation - /api/ratan/v1/profileLimitation/reject/{profile}/{currency}/{status}
- Delete limitation - /api/ratan/v1/profileLimitation/{profile}/{currency}

## BIC Netting Static Table
- Query eligible rules - /api/ratan/v1/static/bicNettingEligibleRule
- Add eligible rule - /api/ratan/v1/static/bicNettingEligibleRule
- Update eligible rule - /api/ratan/v1/static/bicNettingEligibleRule
- Delete eligible rule - /api/ratan/v1/static/bicNettingEligibleRule/{id}
- Confirm eligible rule - /api/ratan/v1/static/bicNettingEligibleRule/{id}/confirm
- Cancel eligible rule - /api/ratan/v1/static/bicNettingEligibleRule/{id}/cancel
- Rule audit list - /api/ratan/v1/static/bicNettingEligibleRule/audit

## Splitting Static Table
- Query splitting rules - /api/ratan/v1/static/splittingRule/query
- Create splitting rule - /api/ratan/v1/static/splittingRule/create
- Update splitting rule - /api/ratan/v1/static/splittingRule/update
- Delete splitting rule - /api/ratan/v1/static/splittingRule/delete/{id}
- Confirm splitting rule - /api/ratan/v1/static/splittingRule/confirm
- Reject splitting rule - /api/ratan/v1/static/splittingRule/reject
- Rule audit list - /api/ratan/v1/static/splittingRule/audit

## Utilization Static Table
- Query utilization rules - /api/ratan/v1/static/utilizationEligibleRule
- Add utilization rule - /api/ratan/v1/static/utilizationEligibleRule
- Update utilization rule - /api/ratan/v1/static/utilizationEligibleRule
- Delete utilization rule - /api/ratan/v1/static/utilizationEligibleRule/{id}
- Confirm utilization rule - /api/ratan/v1/static/utilizationEligibleRule/{id}/confirm
- Cancel utilization rule - /api/ratan/v1/static/utilizationEligibleRule/{id}/cancel
- Rule audit list - /api/ratan/v1/static/utilizationEligibleRule/audit

## Shared GraphQL Base (RTK Query)
- GraphQL base URL - /api/ratan/stmcn/v1/cashflows
