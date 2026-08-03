import { ScEmployeeCard } from '../src/components/ScEmployee/ScEmployeeCard.js';
import { ScEmployeeName } from '../src/components/ScEmployee/ScEmployeeName.js';
import { ScEmployeeAvatar } from '../src/components/ScEmployee/ScEmployeeAvatar.js';
import { ScEmployeeInput } from '../src/components/ScEmployee/ScEmployeeInput.js';
import { ScEmployeeMultiInput } from '../src/components/ScEmployee/ScEmployeeMultiInput.js';
import { ScEmployeeGroupedAvatar } from '../src/components/ScEmployee/ScEmployeeGroupedAvatar.js';
export * from '../src/components/ScEmployee/ScEmployeeCard.js';
export * from '../src/components/ScEmployee/ScEmployeeName.js';
export * from '../src/components/ScEmployee/ScEmployeeAvatar.js';
export * from '../src/components/ScEmployee/ScEmployeeInput.js';
export * from '../src/components/ScEmployee/ScEmployeeMultiInput.js';

window.customElements.define('sc-employee-card', ScEmployeeCard);
window.customElements.define('sc-employee-name', ScEmployeeName);
window.customElements.define('sc-employee-avatar', ScEmployeeAvatar);
window.customElements.define('sc-employee-grouped-avatar', ScEmployeeGroupedAvatar);
window.customElements.define('sc-employee-input', ScEmployeeInput);
window.customElements.define('sc-employee-multi-input', ScEmployeeMultiInput);

declare global {
  interface HTMLElementTagNameMap {
    'sc-employee-card': ScEmployeeCard,
    'sc-employee-name': ScEmployeeName,
    'sc-employee-avatar': ScEmployeeAvatar,
    'sc-employee-grouped-avatar': ScEmployeeGroupedAvatar,
    'sc-employee-input': ScEmployeeInput,
    'sc-employee-multi-input': ScEmployeeMultiInput,
  }
}