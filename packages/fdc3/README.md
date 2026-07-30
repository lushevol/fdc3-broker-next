# ratan-fdc3

Single distribution package for the complete Ratan FDC3 platform.

Applications install only `ratan-fdc3`. The implementation remains separated
into duty-focused internal packages and is exposed through stable subpaths:

```ts
import { FDC3ChildProvider, FDC3RootProvider, useFDC3 } from 'ratan-fdc3';
import { AppDirectoryClientImpl } from 'ratan-fdc3/app-directory';
import { Broker } from 'ratan-fdc3/broker';
import * as FinosFDC3 from 'ratan-fdc3/finos';
import * as OpenFinFDC3 from 'ratan-fdc3/openfin';
import { ResolverDialog } from 'ratan-fdc3/resolver-ui';
import { WorkflowOrchestrator } from 'ratan-fdc3/workflow-orchestrator';
```

The root export is the normal application API: React providers and agent hooks.
Subpaths expose advanced or platform-owned capabilities without additional
package installations.
