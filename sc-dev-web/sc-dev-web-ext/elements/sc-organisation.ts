import { ScOrgRole } from '../src/components/ScOrganisation/ScOrgRole.js';
import { ScOrgPlaceholder } from '../src/components/ScOrganisation/ScOrgPlaceholder.js';
import { ScOrgTeam } from '../src/components/ScOrganisation/ScOrgTeam.js';
import { ScOrgHierarchy } from '../src/components/ScOrganisation/ScOrgHierarchy.js';
export * from '../src/components/ScOrganisation/ScOrgRole.js';
export * from '../src/components/ScOrganisation/ScOrgPlaceholder.js';
export * from '../src/components/ScOrganisation/ScOrgTeam.js';
export * from '../src/components/ScOrganisation/ScOrgHierarchy.js';

window.customElements.define('sc-organisation-role', ScOrgRole);
window.customElements.define('sc-organisation-placeholder', ScOrgPlaceholder);
window.customElements.define('sc-organisation-team', ScOrgTeam);
window.customElements.define('sc-organisation-hierarchy', ScOrgHierarchy);

declare global {
  interface HTMLElementTagNameMap {
    'sc-organisation-role': ScOrgRole,
    'sc-organisation-placeholder': ScOrgPlaceholder,
    'sc-organisation-team': ScOrgTeam,
    'sc-organisation-hierarchy': ScOrgHierarchy,
  }
}