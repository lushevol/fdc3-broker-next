import { useEffect, useState, type ComponentType } from 'react';
import { CoexistenceScenario } from './scenarios/coexistence.js';
import { CompatibilityScenario } from './scenarios/compatibility.js';
import { DataGridScenario } from './scenarios/data-grid.js';
import { FormsScenario } from './scenarios/forms.js';
import { MfeLifecycleScenario } from './scenarios/mfe-lifecycle.js';
import { OverlaysScenario } from './scenarios/overlays.js';
import { ThemeModesScenario } from './scenarios/theme-modes.js';

export interface PlaygroundRoute {
  readonly path: string;
  readonly label: string;
  readonly component: ComponentType;
}

export const playgroundRoutes: readonly PlaygroundRoute[] = [
  { path: '/compatibility', label: 'React 18.2 / 19', component: CompatibilityScenario },
  { path: '/forms', label: 'Forms', component: FormsScenario },
  { path: '/overlays', label: 'Overlays', component: OverlaysScenario },
  { path: '/theme-modes', label: 'Theme and modes', component: ThemeModesScenario },
  { path: '/data-grid', label: 'Large DataGrid', component: DataGridScenario },
  { path: '/mfe-lifecycle', label: 'MFE lifecycle', component: MfeLifecycleScenario },
  { path: '/coexistence', label: 'WebKit coexistence', component: CoexistenceScenario },
] as const;

function currentPath() {
  return window.location.hash.slice(1) || playgroundRoutes[0]?.path || '/compatibility';
}

export function PlaygroundApp() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const onHashChange = () => setPath(currentPath());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  const route = playgroundRoutes.find((candidate) => candidate.path === path) ?? playgroundRoutes[0];
  const Scenario = route?.component ?? CompatibilityScenario;

  return (
    <div className="playground-shell" data-package-consumption="public-export-map">
      <header><h1>Ratan Design playground</h1><p>Private workbench consuming the built public package.</p></header>
      <nav aria-label="Playground scenarios">
        {playgroundRoutes.map((item) => <a key={item.path} href={`#${item.path}`} aria-current={item.path === route?.path ? 'page' : undefined}>{item.label}</a>)}
      </nav>
      <main><Scenario /></main>
    </div>
  );
}
