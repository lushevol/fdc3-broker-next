import { ScCustomerDetail } from '../src/components/ScCustomer/ScCustomerDetail/ScCustomerDetail.js';
export * from '../src/components/ScCustomer/ScCustomerDetail/ScCustomerDetail.js';

window.customElements.define('sc-customer-detail', ScCustomerDetail);

declare global {
  interface HTMLElementTagNameMap {
    'sc-customer-detail': ScCustomerDetail,
  }
}