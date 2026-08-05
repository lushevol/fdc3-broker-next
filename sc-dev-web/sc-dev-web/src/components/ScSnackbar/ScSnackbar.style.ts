import { css } from 'lit';

export default css`
  .alert.sc-snackbar {
    display: inline-flex;
    gap: 10px;
    align-items: center;
    max-width: 80%;
    height: var(--sc-spacing-40, 2.5rem);
    padding: 0 var(--sc-spacing-12, 1rem);
    border-radius: 6px;
    background: var(--sc-snackbar-background-color, var(--sc-color-blue-900));
    color: var(--sc-snackbar-text-color, var(--sc-color-grey-100));
  }
  
  .alert.sc-snackbar.alert--error .alert-icon {
    color: var(--sc-snackbar-error-icon-color, var(--sc-color-red-dm));
  }
  
  .alert.sc-snackbar.alert--warning .alert-icon {
    color: var(--sc-snackbar-warning-icon-color, var(--sc-color-amber-400));
  }
  
  .alert.sc-snackbar.alert--info .alert-icon {
    color: var(--sc-snackbar-info-icon-color, var(--sc-color-blue-500));
  }
  
  .alert.sc-snackbar.alert--disabled .alert-icon {
    color: var(--sc-snackbar-disabled-icon-color, var(--sc-color-grey-500));
  }
  
  .alert.sc-snackbar .alert-icon {
    color: var(--sc-snackbar-success-icon-color, var(--sc-color-green-500));
  }

  .alert.sc-snackbar .close-icon {
    color: var(--sc-color-blue-250);
  }

  .alert.sc-snackbar.sc-truncate .alert-message {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;