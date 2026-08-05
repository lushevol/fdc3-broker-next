import { css } from 'lit';

export default css`
  .detail-container {
    display: flex;
    color: var(--sc-employee-color, var(--sc-color-grey-650)) !important;
    line-height: 1rem;
  }

  .detail-container.vertical {
    display: block;
    padding: 0 0.5rem;
  }

  .detail-container.vertical .title {
    margin-left: 0;
    margin-top: 0.75rem;
  }

  .employee-tooltip.vertical {
    flex: 1;
  }

  .actions {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    color: var(--sc-employee-more-actions-color, var(--sc-color-blue-850));
  }

  .disabled .actions {
    cursor: not-allowed;
  }

  .center-aligned .avatar-container {
    display: flex;
    justify-content: center;
  }

  .center-aligned .detail-container.vertical .avatar {
    width: 100%;
  }

  .center-aligned .detail-container.vertical {
    display: flex; 
    flex-direction: column;
    align-items: center;
    padding: 0 0.5rem;
  }

  .center-aligned .employee-avatar.vertical {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .center-aligned .employee-tooltip.vertical {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .center-aligned .detail-container.vertical .title {
    margin-left: 0;
    margin-top: 0.75rem;
    text-align: center;
  }

  .center-aligned .footer-container {
    align-items: center;
  }

  .detail-container.tag {
    height: 1.25rem;
    color: var(--sc-employee-color, var(--sc-color-grey-650)) !important;
    line-height: 1rem;
  }

  .detail-container.vertical {
    display: block;
    padding: 0 0.5rem;
  }

  .detail-container.vertical .title {
    margin-left: 0;
    margin-top: 0.75rem;
  }

  .employee-tooltip.vertical {
    flex: 1;
  }

  .actions {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    color: var(--sc-employee-more-actions-color, var(--sc-color-blue-850));
  }

  .disabled .actions {
    cursor: not-allowed;
  }

  .center-aligned .avatar-container {
    display: flex;
    justify-content: center;
  }

  .center-aligned .detail-container.vertical .avatar {
    width: 100%;
  }

  .center-aligned .detail-container.vertical {
    display: flex; 
    flex-direction: column;
    align-items: center;
    padding: 0 0.5rem;
  }

  .center-aligned .employee-avatar.vertical {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .center-aligned .employee-tooltip.vertical {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .center-aligned .detail-container.vertical .title {
    margin-left: 0;
    margin-top: 0.75rem;
    text-align: center;
  }

  .center-aligned .footer-container {
    align-items: center;
  }

  .detail-container.tag {
    height: 1.25rem;
  }

  .detail-container .title {
    margin-left: 0.75rem;
    font-size: 0.875rem;
    margin-left: 0.75rem;
    font-size: 0.875rem;
    text-align: left;
    width: 100%;
  }

  .detail-container.tag .title {
    margin-left: 0.5rem;
  }

  .detail-container .name {
    display: flex;
    line-height: 1.375rem;
    font-weight: 500;
    line-height: 1.375rem;
    font-weight: 500;
  }

  .detail-container .name sc-link {
    flex: 1;
    line-height: 1.25rem;
  }

  .detail-container .name .name-span {
    flex: 1;
    color: var(--sc-employee-name-color, var(--sc-color-blue-900));
    line-height: 1.25rem;
  }

  .disabled .detail-container .name .name-span {
    --sc-employee-name-color: var(--sc-employee-name-disabled-color, var(--sc-color-grey-500));
    line-height: 1.25rem;
  }

  .detail-container .name .name-span {
    flex: 1;
    color: var(--sc-employee-name-color, var(--sc-color-blue-900));
    line-height: 1.25rem;
  }

  .disabled .detail-container .name .name-span {
    --sc-employee-name-color: var(--sc-employee-name-disabled-color, var(--sc-color-grey-500));
  }

  .detail-container .business {
    font-size: 0.75rem;
    margin-top: -0.125rem;
    font-size: 0.75rem;
    margin-top: -0.125rem;
  }

  .detail-container .department {
    font-weight: 500;
    font-size: 0.625rem;
    font-weight: 500;
    font-size: 0.625rem;
    color: var(--sc-employee-department-color, var(--sc-color-grey-500));
  }

  .detail-container.no-tooltip {
    display: flex;
    align-items: flex-start;
    padding: 0.5rem;
    --sc-tooltip-background-color: var(--sc-employee-background-color, var(--sc-color-white));
  }

  .detail-container.no-tooltip .title {
    margin-left: 0.75rem; 
    margin-top: 0;
    text-align: left;
  }

  .center-aligned .detail-container.no-tooltip {
    display: flex;
    align-items: flex-start;
    padding: 0.5rem;
  }

  .center-aligned .detail-container.no-tooltip .title {
    margin-left: 0.75rem; 
    margin-top: 0;
    text-align: left;
  }

  .center-aligned .detail-container.no-tooltip .footer-container {
    align-items: flex-start; 
  }

  .center-aligned .detail-container.no-tooltip .avatar {
    width: auto;
  }

  .footer-container {
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;
  }

  .avatar-container {
    display: flex;
  }

  .detail-container.tag .avatar {
    display: flex;
    align-self: center;
  }

  .tag-card .detail-container.no-tooltip .avatar {
    align-self: auto;
  }

  a {
    display: flex;
    align-items: center;
  }

  .detail-container.no-tooltip {
    display: flex;
    align-items: flex-start;
    padding: 0.5rem;
    --sc-tooltip-background-color: var(--sc-employee-background-color, var(--sc-color-white));
  }

  .detail-container.no-tooltip .title {
    margin-left: 0.75rem; 
    margin-top: 0;
    text-align: left;
  }

  .center-aligned .detail-container.no-tooltip {
    display: flex;
    align-items: flex-start;
    padding: 0.5rem;
  }

  .center-aligned .detail-container.no-tooltip .title {
    margin-left: 0.75rem; 
    margin-top: 0;
    text-align: left;
  }

  .center-aligned .detail-container.no-tooltip .footer-container {
    align-items: flex-start; 
  }

  .center-aligned .detail-container.no-tooltip .avatar {
    width: auto;
  }

  .footer-container {
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;
  }

  .avatar-container {
    display: flex;
  }

  .detail-container.tag .avatar {
    display: flex;
    align-self: center;
  }

  .tag-card .detail-container.no-tooltip .avatar {
    align-self: auto;
  }

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
  }

  .field-item {
    display: flex;
    align-items: center;
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1rem;
    color: var(--sc-employee-field-color, var(--sc-color-grey-650));
    position: relative;
    justify-content: flex-start;
    height: 1rem;
  }

  .field-item.additional-info-link:not(.disabled) {
    --sc-employee-field-color: var(--sc-employee-field-link-color, var(--sc-color-blue-500));
  }

  .field-item sc-icon {
    margin-right: 0.25rem;
  }

  .detail-container:not(.no-tooltip) .field-item sc-icon {
    color: var(--sc-employee-icon-color, var(--sc-color-blue-300));
  }
  
  .detail-container.no-tooltip .field-item sc-icon {
    color: var(--sc-employee-icon-tooltip-color, var(--sc-color-blue-300));
  }

  .field-item .copy {
    margin-left: -0.25rem;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .field-item.disabled .copy {
    opacity: 0;
  }

  .field-item:not(.disabled):hover .copy {
    opacity: 1;
  }

  .field-item span {
    transition: color 200ms ease-in-out;
  }

  .field-item.type-email:not(.disabled):hover span,
  .field-item.type-phone:not(.disabled):hover span {
    color: var(--sc-employee-card-field-item-hover-color, var(--sc-color-blue-400));
  }

  .center-aligned .field-item {
    justify-content: center;
    position: relative;
  }

  .center-aligned .field-item .copy {
    position: absolute;
    right: -1.75rem;
  }

  .center-aligned .field-item.single-line .copy {
    position: unset;
  }

  .center-aligned .field-item.single-line {
    padding-left: 1.75rem;
    max-width: calc(100% - 0.5rem);
  }

  .tooltip-container {
    cursor: auto;
  }

  .copy {
    --sc-tooltip-background-color: var(--sc-employee-copy-tooltip-background-color, var(--sc-color-blue-900));
  }

  .detail-container-single-line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .name.field-single-line,
  .name-span.field-single-line,
  .business.field-single-line,
  .department.field-single-line {
    display: block;
  }

  .field-single-line, 
  .field-item.single-line {
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .field-single-line span, 
  .field-item.single-line span {
    flex-shrink: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .field-item.single-line {
    height: auto;
  }

  .field-item.single-line .copy, 
  .field-item.single-line sc-icon {
    display: inline-flex;
    align-items: center;
  }

  .field-item.single-line sc-icon {
    margin-right: 0.25rem;
  }

  .detail-container-not-single-line {
    display: flex;
    flex-direction: column;
  }

  .detail-container-not-single-line > .name,
  .detail-container-not-single-line > .business,
  .detail-container-not-single-line > .department {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }

  .detail-container.dc-not-single-line:not(.vertical):not(.input):not(.tag) {
    max-width: calc(100% - 2.8rem);
  }

  .detail-container-not-single-line > .footer-container {
    display: flex;
    flex-wrap: wrap;
    margin-right: 0.25rem;
  }

  .detail-container:not(.no-tooltip) .field-item sc-icon {
    color: var(--sc-employee-icon-color, var(--sc-color-blue-300));
  }
  
  .detail-container.no-tooltip .field-item sc-icon {
    color: var(--sc-employee-icon-tooltip-color, var(--sc-color-blue-300));
  }

  .field-item .copy {
    margin-left: -0.25rem;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .field-item.disabled .copy {
    opacity: 0;
  }

  .field-item:not(.disabled):hover .copy {
    opacity: 1;
  }

  .field-item span {
    transition: color 200ms ease-in-out;
  }

  .field-item.type-email:not(.disabled):hover span,
  .field-item.type-phone:not(.disabled):hover span {
    color: var(--sc-employee-card-field-item-hover-color, var(--sc-color-blue-400));
  }

  .center-aligned .field-item {
    justify-content: center;
    position: relative;
  }

  .center-aligned .field-item .copy {
    position: absolute;
    right: -1.75rem;
  }

  .center-aligned .field-item.single-line .copy {
    position: unset;
  }

  .center-aligned .field-item.single-line {
    padding-left: 1.75rem;
    max-width: calc(100% - 0.5rem);
  }

  .tooltip-container {
    cursor: auto;
  }

  .copy {
    --sc-tooltip-background-color: var(--sc-employee-copy-tooltip-background-color, var(--sc-color-blue-900));
  }

  .detail-container-single-line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .name.field-single-line,
  .name-span.field-single-line,
  .business.field-single-line,
  .department.field-single-line {
    display: block;
  }

  .field-single-line, 
  .field-item.single-line {
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .field-single-line span, 
  .field-item.single-line span {
    flex-shrink: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .field-item.single-line {
    height: auto;
  }

  .field-item.single-line .copy, 
  .field-item.single-line sc-icon {
    display: inline-flex;
    align-items: center;
  }

  .field-item.single-line sc-icon {
    margin-right: 0.25rem;
  }

  .detail-container-not-single-line {
    display: flex;
    flex-direction: column;
  }

  .detail-container-not-single-line > .name,
  .detail-container-not-single-line > .business,
  .detail-container-not-single-line > .department {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }

  .detail-container.dc-not-single-line:not(.vertical):not(.input):not(.tag) {
    max-width: calc(100% - 2.8rem);
  }

  .detail-container-not-single-line > .footer-container {
    display: flex;
    flex-wrap: wrap;
  }
`;

export const EmployeeCardStyle = css`
  .tag-card::part(base) {
    width: fit-content !important;
    padding: 0 !important;
    padding: 0 !important;
    border-radius: 0.5rem;
    border: 1px solid var(--sc-employee-tag-border-color, var(--sc-color-grey-150));
  }

  .tag-card:not(.disabled)::part(base):hover {
    --sc-employee-tag-border-color: var(--sc-employee-tag-hover-border-color, var(--sc-color-blue-400));
  }

  .tag-card:not(.disabled)::part(base):active {
    --sc-employee-tag-border-color: var(--sc-employee-tag-pressed-border-color, var(--sc-color-blue-600));
    border: 1px solid var(--sc-employee-tag-border-color, var(--sc-color-grey-150));
  }

  .tag-card:not(.disabled)::part(base):hover {
    --sc-employee-tag-border-color: var(--sc-employee-tag-hover-border-color, var(--sc-color-blue-400));
  }

  .tag-card:not(.disabled)::part(base):active {
    --sc-employee-tag-border-color: var(--sc-employee-tag-pressed-border-color, var(--sc-color-blue-600));
  }

  .tag-card.no-border::part(base) {
    border: none;
  }

  .tag-card.no-avatar .detail-container.tag .title {
    margin-left: 0;
  }

  .tag-card::part(text) {
    padding: 0.5rem !important;
  }
`;

export const EmployeeCardTagTransparent = css`
  :host {
    --sc-card-background-color: var(--sc-employee-card-transparent-background-color, transparent);
    --sc-employee-tag-border-color: var(--sc-employee-card-transparent-border-color, transparent);
    --sc-card-box-shadow-color: var(--sc-employee-card-transparent-box-shadow-color, transparent);
    --sc-employee-tag-hover-border-color: var(--sc-employee-card-transparent-hover-border-color, transparent);
    --sc-employee-tag-pressed-border-color: var(--sc-employee-card-transparent-pressed-border-color, transparent);
  }

  .transparent-tag-card:not(.disabled)::part(base):hover {
    background-color: var(--sc-employee-tag-transparent-hover-background-color, var(--sc-color-blue-50));
  }

  .transparent-tag-card:not(.disabled)::part(base):active {
    --sc-employee-name-color: var(--sc-employee-tag-transparent-pressed-color, var(--sc-color-blue-600));
  }

  .link-tag-card:not(.disabled)::part(base):hover {
    background-color: transparent;
  }

  .link-tag-card:not(.disabled):hover sc-link::part(base) {
    color: var(--sc-employee-tag-link-hover-color, var(--sc-color-blue-400));
  }

  .link-tag-card:not(.disabled).active sc-link::part(base) {
    color: var(--sc-employee-tag-link-pressed-color, var(--sc-color-blue-600));
  }

  .compact-card.link-tag-card::part(text) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .transparent-tag-card.disabled::part(base),
  .link-tag-card.disabled::part(base) {
    --sc-card-border-color: transparent;
    background: transparent;
  }

  .detail-container.no-tooltip.active {
    --sc-employee-name-color: var(--sc-employee-name-default-color, var(--sc-color-blue-900));
  }
  .tag-card::part(text) {
    padding: 0.5rem !important;
  }
`;

export const EmployeeInputStyle = css`
  :host {
    overflow: visible;
  }
  .employee-card-container {
    margin-top: 1rem;
  }
  
  .detail-container .avatar {
    position: absolute;
    left: 0.75rem;
    top: 0.85rem;
    left: 0.75rem;
    top: 0.85rem;
  }
  .detail-container .title {
    margin-left: 2.7rem !important;
    margin-top: 0.25rem;
    padding-top: 0.25rem;
    padding-bottom: 0.5rem;
    width: 100%;
  }

  .detail-container.input .title {
    max-width: 100%;
    overflow: hidden;
  }

  .readonly-names {
    margin-left: 0.75rem;
    min-height: var(--sc-spacing-32, 2rem);
  }
  .suggested-people-flex {
    display: flex !important;
    flex-direction: row !important;
    align-items: center;
    width: 100%;
  }
  
  .suggested-people-flex .name-details-section {
    flex: 1 1 auto;
  }

  .suggested-people-row:has(.suggested-actions.is-pinned):not(:hover) .name-details-section {
    min-width: 0;
    max-width: calc(100% - 2rem);
    overflow: hidden;
  }

  .suggested-people-row:hover .name-details-section {
    min-width: 0;
    max-width: calc(100% - 4.5rem);
    overflow: hidden;
  }

  .suggested-people-row:hover .name-details-section .name,
  .suggested-people-row:hover .name-details-section .name-span,
  .suggested-people-row:hover .name-details-section .business,
  .suggested-people-row:hover .name-details-section .department {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    max-width: 100%;
  }

  .suggested-people-row:has(.suggested-actions.is-pinned):not(:hover) .name-details-section .name,
  .suggested-people-row:has(.suggested-actions.is-pinned):not(:hover) .name-details-section .name-span,
  .suggested-people-row:has(.suggested-actions.is-pinned):not(:hover) .name-details-section .business,
  .suggested-people-row:has(.suggested-actions.is-pinned):not(:hover) .name-details-section .department {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    max-width: 100%;
  }
  
  .suggested-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
    flex-shrink: 0;
    min-width: 2rem;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
  }

  .suggested-people-row:hover .suggested-actions {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.2s ease-in-out, visibility 0s;
  }

  .suggested-actions.is-pinned {
    opacity: 1;
    visibility: visible;
  }

  .suggested-actions.is-pinned .trash-action {
    display: none;
  }

  .suggested-people-row:hover .suggested-actions.is-pinned .trash-action {
    display: inline-flex;
  }

  .suggested-actions sc-spinner[type="component"] {
    align-self: center;
    margin-right: 0.5rem;
    opacity: 1;
    visibility: visible;
  }
`;
export const EmployeeMultiInputStyle = css`
  :host {
    --sc-checkbox-label-width: 100%;
  }

  .detail-container .avatar {
    position: absolute;
    left: 0;
    top: 0.5rem;
  }
  .detail-container .title {
    margin-left: 2.25rem !important;
    margin-top: 0.25rem;
    padding-bottom: 0.5rem;
  }

  .sc-employee-multi-input-readonly {
    display: flex;
    flex-wrap: wrap;
    margin-left: 0.75rem;
    min-height: var(--sc-spacing-32, 2rem);
  }
  .sc-employee-multi-input-readonly-comma {
    margin-right: 0.5rem;
  }
  .list-item sc-checkbox {
    max-width: 100% !important;
    min-width: 0;
    overflow: hidden;
  }
  .detail-container sc-checkbox::part(label) {
    width: 100% !important;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
  }
  .detail-container sc-checkbox::part(selection) {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
  }
  .suggested-actions {
    padding-right: 0.5rem;
    padding-left: 0.5rem;
    display: none;
  }

  .suggested-people-row:hover .suggested-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
    min-width: 4.02rem;
  }

  .suggested-actions.is-pinned {
    display: inline-flex;
    align-items: center;
    gap: 0;
    flex-shrink: 0;
    min-width: 0;
    width: fit-content;
  }

  .suggested-actions.is-pinned .trash-action {
    display: none;
  }

  .suggested-people-row:hover .suggested-actions.is-pinned .trash-action {
    display: inline-flex;
  }

  .suggested-people-row:hover .suggested-actions.is-pinned {
    gap: 0.25rem;
    min-width: 4.02rem;
    width: auto;
  }

  .sc-dropdown-input.multiple .dropdown-menu .suggested-people-row:has(.suggested-actions.is-pinned):not(:hover) .name-details-section {
    min-width: 0;
    max-width: calc(100% - 1.5rem);
    overflow: hidden;
  }

  .sc-dropdown-input.multiple .dropdown-menu .suggested-people-row:has(.suggested-actions.is-pinned):not(:hover) .name-details-section .name,
  .sc-dropdown-input.multiple .dropdown-menu .suggested-people-row:has(.suggested-actions.is-pinned):not(:hover) .name-details-section .name-span,
  .sc-dropdown-input.multiple .dropdown-menu .suggested-people-row:has(.suggested-actions.is-pinned):not(:hover) .name-details-section .business,
  .sc-dropdown-input.multiple .dropdown-menu .suggested-people-row:has(.suggested-actions.is-pinned):not(:hover) .name-details-section .department {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    max-width: 100%;
  }

  .sc-dropdown-input.multiple .dropdown-menu .scroll-element {
    min-width: 0 !important;
    width: 100%;
  }

  .sc-dropdown-input.multiple .dropdown-menu .list-item {
    min-width: 0 !important;
    width: 100%;
    max-width: 100%;
  }

  .sc-dropdown-input.multiple .dropdown-menu .detail-container {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
  }

  .sc-dropdown-input.multiple .dropdown-menu .detail-container.input {
    width: 100%;
    min-width: 0;
  }

  .sc-dropdown-input.multiple .dropdown-menu .detail-container .title {
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
  }

  .sc-dropdown-input.multiple .dropdown-menu .suggested-people-flex {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }

  .sc-dropdown-input.multiple .dropdown-menu .name-details-section {
    min-width: 0;
    overflow: hidden;
    flex: 1;
  }

  .sc-dropdown-input.multiple .dropdown-menu .suggested-people-row:hover .name-details-section {
    max-width: calc(100% - 4.5rem);
  }

  .sc-dropdown-input.multiple .dropdown-menu .suggested-people-row:hover .name-details-section .name,
  .sc-dropdown-input.multiple .dropdown-menu .suggested-people-row:hover .name-details-section .name-span,
  .sc-dropdown-input.multiple .dropdown-menu .suggested-people-row:hover .name-details-section .business,
  .sc-dropdown-input.multiple .dropdown-menu .suggested-people-row:hover .name-details-section .department {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    max-width: 100%;
  }

  .sc-dropdown-input.multiple .dropdown-menu .business.field-single-line {
    display: block !important;
    width: 96%;
    max-width: 96%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
  }

  .sc-dropdown-input.multiple .dropdown-menu .suggested-people-row:has(.suggested-actions.is-pinned) .business.field-single-line {
    width: 100%;
    max-width: 100%;
  }

  .sc-dropdown-input.multiple .dropdown-menu .name-details-section {
    width: 100% !important;
  }
`;

export const EmployeeAvatarStyle = css`
  .sc-employee-avatar {
    display: flex;
  }
`;

export const EmployeeGroupedAvatarStyle = css`
  .sc-employee-grouped-avatar {
    display: flex;
    padding-left: var(--sc-employee-grouped-avatar-offset);
    overflow: hidden;
  }
  .avatar {
    display: flex;
    position: relative;
    border-radius: 50%;
    margin-left: calc(var(--sc-employee-grouped-avatar-offset) * -1);
    border: var(--sc-employee-grouped-avatar-border-width)
        solid var(--sc-employee-grouped-avatar-border-color, var(--sc-color-white));
    background-color: var(--sc-employee-avatar-background-color, var(--sc-color-white));
  }
  .avatar > sc-employee-avatar::part(wrapper) {
    display: flex;
  }
  .avatar-overflow-count {
    cursor: pointer;
    cursor: pointer;
    color: var(--sc-color-blue-900);
    font-size: var(--sc-employee-grouped-avatar-font-size);
    line-height: 1.375rem;
    font-weight: 600;
    height: var(--sc-avatar-size);
    width: var(--sc-avatar-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sc-employee-grouped-avatar .circle {
    position: absolute;
    top: 50%; 
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 120%;
    border-radius: 50%;
    background-color: var(--sc-employee-avatar-background-color, var(--sc-color-white));
  }
`;