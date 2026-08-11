import { css } from 'lit';

export const OrgHierarchyStyle = css`
  .org-hierarchy-container {
    display: flex;
    flex-direction: column;
  }
  .connector-container {
    display: flex;
    justify-content: center;
  }
  .connector {
    background-color: var(--sc-org-connector-background-color, var(--sc-color-grey-150));
    margin-top: -0.75rem;
    margin-bottom: -1.5rem;
    height: 4.125rem;
    width: 1px;
  }

`;

export const OrgRoleStyle = css`
  :host {
    position: relative;
    display: flex;
    justify-content: center;
    text-align: center;
  }
  :host::part(avatar) {
    position: relative;
    top: -55px;
    height: 40px;
    display: block;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  sc-box .box-body {
    width: var(--sc-org-role-width, 168px);
  }
  sc-box.with-avatar {
    margin-top: 2.45rem;
    display: block;
  }
  .sub-title, .field-item {
    font-size: 0.75rem;
    font-weight: 600;
  }
  .field-item {
    display: flex;
    margin-top: 5px;
    justify-content: center;
  }

  .field-item sc-icon {
    color: var(--sc-org-role-icon-color, var(--sc-color-blue-500));
    margin-right: 0.2rem;
  }
  .department {
    color: var(--sc-org-role-department-color, var(--sc-color-grey-650));
  }
  .badge-container {
    display: flex;
    justify-content: center;
  }
  .badge {
    position: absolute;
    font-size: 0.75rem;
    background-color: var(--sc-box-default-background-color);
    border: 1px solid var(--sc-org-badge-border-color, var(--sc-color-grey-150));
    border-radius: 12px;
    font-weight: 400;
    line-height: 14px;
    min-width: 50px;
    margin-top: 8px;
  }
`;

export const OrgTeamStyle = css`
  .sc-org-team-container {
    display: flex;
    justify-content: center;
    flex-flow: row wrap;
  }
  sc-organisation-role {
    margin: 7.5px;
  }
`;

export const OrgPlaceholderStyle = css`
  :host {
    position: relative;
    display: flex;
    justify-content: center;
  }
  .org-placeholder-container {
    width: var(--sc-org-role-width, 168px);
  }
`;