## 1. Endpoint and decoding contract

- [ ] 1.1 Add failing tests for all methods, paths, encoded segments, and request bodies
- [ ] 1.2 Add failing tests for complete list/record decoding and malformed status/currency/numeric/audit/list payloads
- [ ] 1.3 Implement the transport-injected adapter and pure runtime record decoder

## 2. Failure and dependency boundaries

- [ ] 2.1 Add failing tests for 400/401/403/409/422/5xx/other status mapping, transport throws, retryability, and preserved categorized errors
- [ ] 2.2 Implement deterministic failure mapping without swallowed or fabricated results
- [ ] 2.3 Extend boundary tests for concrete client, browser global, UI, legacy, and federation exclusions

## 3. Documentation and verification

- [ ] 3.1 Document endpoint mapping, payload assumptions, transport responsibilities, dormant bootstrap, and activation blockers
- [ ] 3.2 Run focused/full coverage, lint/build, production pilot/package regression, runtime boundaries, browser rollback, and strict OpenSpec validation
- [ ] 3.3 Record test/bundle evidence and remaining authenticated activation/cutover criteria
