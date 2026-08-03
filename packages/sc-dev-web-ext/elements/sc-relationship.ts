import { ScRelationship } from '../src/components/ScRelationship/ScRelationship.js';
import { ScRelationshipDepthDropdown } from '../src/components/ScRelationship/ScRelationshipDepthDropdown.js';
import { ScRelationshipDiagram } from '../src/components/ScRelationship/ScRelationshipDiagram.js';
import { ScRelationshipMiniMap } from '../src/components/ScRelationship/ScRelationshipMiniMap.js';
export * from '../src/components/ScRelationship/ScRelationship.js';
export * from '../src/components/ScRelationship/ScRelationshipDepthDropdown.js';
export * from '../src/components/ScRelationship/ScRelationshipDiagram.js';
export * from '../src/components/ScRelationship/ScRelationshipMiniMap.js';

window.customElements.define('sc-relationship', ScRelationship);
window.customElements.define('sc-relationship-diagram', ScRelationshipDiagram);
window.customElements.define('sc-relationship-depth-dropdown', ScRelationshipDepthDropdown);
window.customElements.define('sc-relationship-mini-map', ScRelationshipMiniMap);

declare global {
  interface HTMLElementTagNameMap {
    'sc-relationship': ScRelationship,
    'sc-relationship-diagram': ScRelationshipDiagram,
    'sc-relationship-depth-dropdown': ScRelationshipDepthDropdown,
    'sc-relationship-mini-map': ScRelationshipMiniMap,
  }
}