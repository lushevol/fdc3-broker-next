# MFE Performance Optimization Guide

## Current Performance Metrics

| Metric                | Current  | Target     | Priority |
| --------------------- | -------- | ---------- | -------- |
| LCP                   | 1,361 ms | < 1,000 ms | High     |
| Critical Path Latency | 729 ms   | < 300 ms   | High     |
| Bundle Size (base)    | 8.1 MiB  | < 2 MiB    | High     |

---

## 1. Optimize Bundle Size (High Priority)

### Problem

- `@fm/base` vendors chunk: **1.58 MiB**
- Total JS: **8.1 MiB** across 10+ chunks
- 801 orphan modules (unused code)

### Solution A: Add Bundle Analyzer

```bash
cd apps/base
npm install --save-dev webpack-bundle-analyzer
```

```javascript
// apps/base/webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
  const config = // ... existing config

  if (env.analyze) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
};
```

Run: `npm run build -- --env analyze`

### Solution B: Tree-Shake MUI Icons

Currently importing ALL icons. Change to import only used icons:

```typescript
// BEFORE (bad) - imports all icons
import { Add, Remove, Edit, Delete } from '@mui/icons-material';

// AFTER (good) - imports only what you need
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
```

Or use barrel exports in a dedicated file:

```typescript
// src/components/Icons/index.ts
export { default as AddIcon } from '@mui/icons-material/Add';
export { default as RemoveIcon } from '@mui/icons-material/Remove';
// ... only export icons you use
```

### Solution C: Code Splitting

Add dynamic imports for non-critical components:

```typescript
// Lazy load dialogs/modals
const SettingsDialog = React.lazy(() => import('./components/SettingsDialog'));
const HelpModal = React.lazy(() => import('./components/HelpModal'));

// Use with Suspense
<Suspense fallback={<Loader />}>
  <SettingsDialog />
</Suspense>
```

### Solution D: Split Vendor Chunks

```javascript
// apps/base/webpack.config.js
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
      mui: {
        test: /[\\/]node_modules[\\/]@mui[\\/]/,
        name: 'mui',
        chunks: 'all',
        priority: 10,
      },
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        name: 'react',
        chunks: 'all',
        priority: 20,
      },
    },
  },
},
```

---

## 2. Eliminate Render-Blocking Resources (High Priority)

### Problem

Multiple scripts block initial paint:

- runtime.min.js
- system.min.js
- amd.min.js
- import-map-overrides.js

### Solution: Defer Non-Critical Scripts

```html
<!-- apps/root-config/src/index.ejs -->

<!-- Defer non-critical scripts -->
<script src="<%=publicUrl%>/js/external/runtime.min.js" defer></script>
<script src="<%=publicUrl%>/js/external/system.min.js" defer></script>

<!-- Keep critical importmap inline for immediate resolution -->
<script type="systemjs-importmap">
  {
    "imports": {
      "@fm/root-config": "/config.js",
      "@fm/base": "//localhost:8002/base.js"
    }
  }
</script>

<!-- Async load amd and overrides -->
<script src="<%=publicUrl%>/js/external/amd.min.js" async></script>
<script src="<%=publicUrl%>/js/external/import-map-overrides.js" async></script>
```

### Alternative: Use Native ES Modules

Replace SystemJS with native ES modules (faster):

```html
<!-- index.ejs -->
<script type="importmap">
  {
    "imports": {
      "@fm/root-config": "/config.js",
      "@fm/base": "//localhost:8002/base.js"
    }
  }
</script>
<script type="module">
  import '@fm/root-config';
</script>
```

---

## 3. Optimize Font Loading (Medium Priority)

### Problem

- Google Fonts add 729ms to critical path
- No preconnect tags for fonts.gstatic.com

### Solution: Add Preconnect + Optimize Font Loading

```html
<!-- apps/root-config/src/index.ejs -->

<!-- Add preconnect (you already have this, verify it's working) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Use font-display: swap to prevent FOIT -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
  media="print"
  onload="this.media='all'"
/>

<!-- Fallback for no-JS -->
<noscript>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
  />
</noscript>
```

### Better Solution: Self-Host Fonts

```bash
# Download and host locally
npm install --save-dev @fontsource/poppins
```

```typescript
// apps/base/src/index.tsx
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
```

---

## 4. Fix FDC3 Broker Re-initialization (Medium Priority)

### Problem

Broker initialized **7 times** on page load (console shows 7 messages).

### Solution: Add useMemo to Prevent Re-renders

```typescript
// apps/base/src/fdc3/FDC3Integration.tsx
import { useMemo } from 'react';

const FDC3Integration = ({ children }) => {
  // Use memo to ensure broker only initializes once
  const brokerConfig = useMemo(() => ({
    brokerType: 'base',
    autoConnect: true,
  }), []); // Empty deps = run once

  // Only initialize broker if not already initialized
  useEffect(() => {
    if (!window.fdc3BrokerInitialized) {
      console.log('[FDC3] Initializing broker...');
      initializeBroker(brokerConfig);
      window.fdc3BrokerInitialized = true;
    }
  }, [brokerConfig]);

  return <>{children}</>;
};
```

---

## 5. Optimize Module Federation Loading (High Priority)

### Problem

Remote modules load sequentially, causing delays.

### Solution: Prefetch Critical Remotes

```html
<!-- index.ejs - Add prefetch hints -->
<link rel="modulepreload" href="//localhost:8002/base.js" />
<link rel="modulepreload" href="//localhost:3000/mf-manifest.json" as="fetch" />
```

### Solution: Use eager loading for critical MFEs

```javascript
// apps/base/module-federation.config.js
module.exports = {
  name: 'baseContainer',
  remotes: {
    mf_container: {
      type: 'module',
      id: 'mf_container',
      // Eagerly load critical remotes
      eager: true, // Add for critical MFEs
      exposes: {},
    },
    mf_tile: 'mf_tile@http://localhost:3001/mf-manifest.json',
  },
};
```

### Solution: Rsbuild with Manifest Caching

```typescript
// apps/mf_container/module-federation.config.ts
export default createModuleFederationConfig({
  name: 'mf_container',
  // Enable manifest caching
  manifest: {
    filename: 'mf-manifest.json',
    enabled: true,
  },
  // Preload critical chunks
  preload: true,
});
```

---

## 6. Add Cache Headers (Low Priority)

### Solution: Configure Webpack Dev Server

```javascript
// apps/base/webpack.config.js
devServer: {
  headers: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
  // Already configured, verify in network tab
},
```

For production, configure in your CDN/server:

```
# nginx.conf
location /static {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

---

## 7. Production Optimizations

### Enable Gzip/Brotli Compression

```javascript
// apps/base/webpack.config.js
const CompressionPlugin = require('compression-webpack-plugin');

plugins: [
  new CompressionPlugin({
    algorithm: 'gzip',
    test: /\.(js|css|html|svg)$/,
    threshold: 10240,
    minRatio: 0.8,
  }),
],
```

### Enable Terser Minification

```javascript
// apps/base/webpack.config.js
optimization: {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    }),
  ],
},
```

---

## Quick Wins Checklist

Run these first for immediate impact:

| Action                         | Impact | Effort |
| ------------------------------ | ------ | ------ |
| [ ] Add preconnect for fonts   | High   | Low    |
| [ ] Defer non-critical scripts | High   | Low    |
| [ ] Tree-shake MUI icons       | High   | Medium |
| [ ] Fix FDC3 broker init       | Medium | Low    |
| [ ] Add lazy loading           | Medium | Medium |
| [ ] Split vendor chunks        | Medium | Low    |
| [ ] Self-host fonts            | Medium | Medium |

---

## Measuring Improvements

Use Chrome DevTools:

1. **Network Tab**: Check "Disable cache" and reload
2. **Performance Tab**: Record load, check LCP
3. **Coverage Tab**: See % of unused code

```bash
# Run performance audit
npx lighthouse http://localhost:8001 \
  --chrome-flags="--headless" \
  --output json \
  --output-path ./performance-report.json
```

---

## Expected Results After Optimization

| Metric        | Before   | After    |
| ------------- | -------- | -------- |
| LCP           | 1,361 ms | < 800 ms |
| Critical Path | 729 ms   | < 300 ms |
| Bundle Size   | 8.1 MiB  | < 3 MiB  |
| FDC3 Init     | 7 times  | 1 time   |
| Font Load     | 729 ms   | < 100 ms |
