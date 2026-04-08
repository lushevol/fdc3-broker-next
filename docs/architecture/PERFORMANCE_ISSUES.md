Performance Analysis Summary

Key Metrics

┌─────────────────────────────────┬──────────┬──────────────────────┐
│ Metric │ Value │ Status │
├─────────────────────────────────┼──────────┼──────────────────────┤
│ LCP (Largest Contentful Paint) │ 1,361 ms │ ⚠️ Needs Improvement │
├─────────────────────────────────┼──────────┼──────────────────────┤
│ INP (Interaction to Next Paint) │ 117 ms │ ✅ Good │
├─────────────────────────────────┼──────────┼──────────────────────┤
│ CLS (Cumulative Layout Shift) │ 0.00 │ ✅ Good │
├─────────────────────────────────┼──────────┼──────────────────────┤
│ Max Critical Path Latency │ 729 ms │ ⚠️ Needs Improvement │
└─────────────────────────────────┴──────────┴──────────────────────┘

---

Performance Issues Identified

1. Large Bundle Sizes 🔴 Critical

The @fm/base MFE has very large JavaScript bundles:

- Main vendors chunk: 1.58 MiB (1.58 MB)
- Secondary vendors chunk: 307 KiB
- Total JS: 8.1 MiB across 10+ chunks
- Orphan modules: 1.24 MiB (801 modules)

2. Render-Blocking Resources 🔴 Critical

Multiple render-blocking scripts delay initial paint:

- runtime.min.js
- system.min.js
- amd.min.js
- import-map-overrides.js
- Google Fonts CSS

3. Font Loading Impact 🟡 Moderate

Google Fonts (Poppins) adds:

- 37.6 kB download size
- 729 ms critical path latency for fonts
- No preconnect tags configured for fonts.gstatic.com

4. React Warnings & Console Errors 🟡 Moderate

Multiple React prop warnings flooding the console:

- fullWidth prop issue
- indicator prop being passed as boolean
- selectionFollowsFocus prop issue
- textColor prop issue
- tabId prop issue

5. FDC3 Broker Multiple Initializations 🟡 Moderate

The FDC3 broker is being initialized 7 times on page load (console shows 7 "[FDC3] Initializing broker..." messages), suggesting unnecessary re-renders.

6. Missing Cache Headers 🟢 Low

Some static resources have TTL: 0 seconds:

- vendors-node_modules_mui_icons-material_Add_js...js
- src_pages_Home_index_tsx.base.js (23 kB)
- SVG assets

7. Network Errors 🟡 Moderate

- 404 for favicon.ico
- net::ERR_CONNECTION_REFUSED for https://axess.sc.net/scb-axess-cms/api/users/test/photo

---

Recommendations

High Priority

1. Bundle Size Reduction
   - Analyze bundle with webpack-bundle-analyzer
   - Tree-shake unused Material-UI icons
   - Consider code splitting for large vendor chunks
   - Lazy load non-critical components

2. Preconnect to Font Origins
Add to index.html:
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
3. Fix FDC3 Broker Re-initialization
   Check useMemo dependencies in FDC3Integration.tsx to prevent unnecessary broker re-initialization.

Medium Priority

4. Fix React Prop Warnings
   Review Material-UI component usage in Home/index.tsx:
   - Change fullWidth to fullwidth or remove from DOM elements
   - Fix indicator boolean prop
   - Fix Tabs component props

5. Add Cache Headers
   Configure webpack-dev-server or production server to add proper cache headers for static assets.
6. Fix Missing Resources
   - Add favicon.ico to public folder
   - Handle missing user photo gracefully with fallback

Low Priority

7. Optimize Module Federation
   - The TypeScript types download errors (Failed to download types archive) should be resolved
   - Consider disabling DTS plugin in development for faster builds
