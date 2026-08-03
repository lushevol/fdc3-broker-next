import { css } from 'lit';

export default css`
  .alert.sc-toast {
    flex-shrink: 0;
    align-self: stretch;
    color: var(--sc-toast-text-color, var(--sc-color-blue-900));
    width: 21.25rem;
    min-height: 4.5rem;
    
    display: flex;
    padding-right: var(--sc-spacing-12, 12px);
    align-items: flex-start;
    gap: 12px;
    
    border-radius: 8px;
    background-color: var(--sc-toast-background-color, var(--sc-color-white));
    box-shadow: 0px 3px 6px 0px rgba(82, 83, 85, 0.15);
  }
  
  .alert-icon {
    padding: var(--sc-spacing-12, 12px) var(--sc-spacing-8, 8px);
    border-radius: 8px var(--sc-radius-none, 0px) var(--sc-radius-none, 0px) 8px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    align-self: stretch;
    color: var(--sc-toast-icon-color, var(--sc-color-white));
    -webkit-animation: background-change var(--sc-animation-duration, 0ms) linear 0s 1 normal both;
    animation: background-change var(--sc-animation-duration, 0ms) linear 0s 1 normal both;
    animation-play-state: var(--sc-animation-state, running);
  }
  
  .close-icon {
    padding: var(--sc-spacing-12, 12px) 0;
    border-radius: var(--sc-radius-none, 0px) 8px 8px var(--sc-radius-none, 0px);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .alert.sc-toast .alert-icon {
    // background-color: var(--sc-toast-success-icon-from-background-color, var(--sc-color-green-500));
    --from-background-color: var(--sc-toast-success-icon-from-background-color, var(--sc-color-green-500));
    --to-background-color: var(--sc-toast-success-icon-to-background-color, var(--sc-color-green-500));
  }
  
  .alert.sc-toast.alert--error .alert-icon {
    // background-color: var(--sc-toast-error-icon-from-background-color, var(--sc-color-red-500));
    --from-background-color: var(--sc-toast-error-icon-from-background-color, var(--sc-color-red-500));
    --to-background-color: var(--sc-toast-error-icon-to-background-color, var(--sc-color-red-50));
  }
  
  .alert.sc-toast.alert--warning .alert-icon {
    // background-color: var(--sc-toast-warning-icon-from-background-color, var(--sc-color-amber-400));
    --from-background-color: var(--sc-toast-warning-icon-from-background-color, var(--sc-color-amber-400));
    --to-background-color: var(--sc-toast-warning-icon-to-background-color, var(--sc-color-amber-50));
  }
  
  .alert.sc-toast.alert--info .alert-icon {
    // background-color: var(--sc-toast-info-icon-from-background-color, var(--sc-color-blue-500));
    --from-background-color: var(--sc-toast-info-icon-from-background-color, var(--sc-color-blue-500));
    --to-background-color: var(--sc-toast-info-icon-to-background-color, var(--sc-color-blue-50));
  }
  
  .alert.sc-toast.alert--disabled .alert-icon {
    // background-color: var(--sc-toast-disabled-icon-from-background-color, var(--sc-color-grey-500));
    --from-background-color: var(--sc-toast-disabled-icon-from-background-color, var(--sc-color-grey-500));
    --to-background-color: var(--sc-toast-disabled-icon-to-background-color, var(--sc-color-grey-100));
  }
  
  .alert.sc-toast .alert-icon {
    background: linear-gradient(
      to bottom, 
      var(--to-background-color), 
      var(--to-background-color) 50%, 
      var(--from-background-color) 50%
    );
    background-size: 100% 200%;
  }
  
  .alert-message {
    padding: var(--sc-spacing-12, 12px) 0;
  }
  
  .alert.sc-toast .sc-toast-title {
    color: var(--sc-toast-title-color, var(--sc-color-blue-900));
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5rem;
    align-self: stretch;
  }
  
  .alert.sc-toast .sc-toast-body {
    max-width: 21.25rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: var(--sc-toast-description-color, var(--sc-color-grey-600));
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    align-self: stretch;
  }
  
  @-webkit-keyframes background-change {
    0% {
      background-position: 50% 100%;
    }
    100% {
      background-position: 50% 0%;
    }
  }
  
  @keyframes background-change {
    0% {
      background-position: 50% 100%;
    }
    100% {
      background-position: 50% var(--sc-animation-to, 0%);
    }
  }
`;