import { css } from 'lit';

export default css`
  [part~='title'], [part~='time'], [part~='description'] {
    font-size: 0.875rem;
  }

  [part~='title'] {
    color: var(--sc-step-title-color, var(--sc-color-blue-900));
    font-weight: 600;
  }

  [part~='time'] {
    color: var(--sc-step-time-color, var(--sc-color-blue-900));
    margin-top: 0.125rem;
  }

  [part~='description'] {
    color: var(--sc-step-description-color, var(--sc-color-blue-900));
    margin: 0.25rem 0;
  }

  [part~='header'] {
    background: var(--step-background);
  }

  /*Indicator*/
  [part~='indicator'] {
    background: var(--sc-step-indicator-background, transparent);
    border: 1px solid
      var(--sc-step-indicator-border-color, var(--sc-color-grey-50));
    color: var(--sc-step-indicator-color, var(--sc-color-grey-50));
    width: 1.625rem;
    height: 1.625rem;
    line-height: 1.625rem;
    text-align: center;
    border-radius: 1.625rem;
    font-size: 0.875rem;
    transition: background-color 0.3s, border-color 0.3s;
  }

  :host([status='error']) [part~='indicator'] {
    background-color: var(
      --sc-step-error-indicator-background,
      var(--sc-color-red-500)
    );
    border: 1px solid
      var(--sc-step-error-indicator-border-color, var(--sc-color-red-500));
    color: var(--sc-step-error-indicator-color, var(--sc-color-white));
  }

  :host([status='finish']) [part~='indicator'] {
    background-color: var(
      --sc-step-finish-indicator-background,
      var(--sc-color-green-500)
    );
    border: 1px solid
      var(--sc-step-finish-indicator-border-color, var(--sc-color-green-500));
    color: var(--sc-step-finish-indicator-color, var(--sc-color-white));
  }

  :host([status='process']) [part~='indicator'] {
    background-color: var(
      --sc-step-process-indicator-background,
      var(--sc-color-blue-light)
    );
    color: var(--sc-step-process-indicator-color, var(--sc-color-white));
    border: 1px solid
      var(--sc-step-process-indicator-border-color, var(--sc-color-blue-light));
  }

  :host(
      [active]:not([status='finish']):not([status='process']):not(
          [status='error']
        )
    )
    [part~='indicator'] {
    background-color: var(
      --sc-step-current-indicator-background,
      var(--sc-color-blue-500)
    );
    color: var(--sc-step-current-indicator-color, var(--sc-color-white));
    border: 1px solid
      var(--sc-step-current-indicator-border-color, var(--sc-color-blue-500));
  }

  :host(
    :not([active]):not([status='finish']):not([status='process']):not([status='error']):not([part~='hovered']):not([part~='disabled'])
  )
  [part~='indicator'] {
    background-color: var(
      --sc-step-incomplete-indicator-background,
      var(--sc-color-grey-250)
    );
    color: var(--sc-step-incomplete-indicator-color, var(--sc-color-white));
    border: 1px solid
      var(--sc-step-incomplete-indicator-border-color, var(--sc-color-grey-250));
  }
  
  :host(
    :not([active]):not([status='finish']):not([status='process']):not([status='error']):not([part~='hovered']):not([part~='disabled'])
  ) [part~='header'], :host(
    :not([active]):not([status='finish']):not([status='process']):not([status='error']):not([part~='hovered']):not([part~='disabled'])
  ) [part~='header-container'] {
    &::after {
      border-block-start-style: dashed;
      border-block-start-color: var(
        --sc-step-incomplete-step-separator-color,
        var(--sc-color-grey-250)
      );
    }
  }

  :host(sc-step[active]) [part~='header'], :host(sc-step[active]) [part~='header-container'] {
    &::after {
      border-block-start-style: dashed;
      border-block-start-color: var(
        --sc-step-current-step-separator-color,
        var(--sc-color-blue-500)
      );
    }
    &::before {
      border-block-start-color: transparent;
    }
  }

  /*Title, time and description*/
  :host(
      [active]:not([status='finish']):not([status='process']):not(
          [status='error']
        )
    )
    [part~='title'] {
    color: var(--sc-step-current-title-color, var(--sc-color-blue-900));
  }

  :host(
      [active]:not([status='finish']):not([status='process']):not(
          [status='error']
        )
    )
    [part~='time'] {
    color: var(--sc-step-current-time-color, var(--sc-color-blue-900));
  }

  :host(
      [active]:not([status='finish']):not([status='process']):not(
          [status='error']
        )
    )
    [part~='description'] {
    color: var(--sc-step-current-description-color, var(--sc-color-blue-900));
  }

  :host([status='error']) [part~='description'] {
    color: var(--sc-step-error-description-color, var(--sc-color-blue-900));
  }

  :host([status='finish']) [part~='description'] {
    color: var(--sc-step-finish-description-color, var(--sc-color-blue-900));
  }

  :host([status='process']) [part~='description'] {
    color: var(--sc-step-process-description-color, var(--sc-color-blue-900));
  }
  
  :host([status='error']) [part~='time'] {
    color: var(--sc-step-error-time-color, var(--sc-color-blue-900));
  }

  :host([status='finish']) [part~='time'] {
    color: var(--sc-step-finish-time-color, var(--sc-color-blue-900));
  }

  :host([status='process']) [part~='time'] {
    color: var(--sc-step-process-time-color, var(--sc-color-blue-900));
  }

  :host([status='error']) [part~='title'] {
    color: var(--sc-step-error-title-color, var(--sc-color-blue-900));
  }

  :host([status='finish']) [part~='title'] {
    color: var(--sc-step-finish-title-color, var(--sc-color-blue-900));
  }

  :host([status='process']) [part~='title'] {
    color: var(--sc-step-process-title-color, var(--sc-color-blue-900));
  }

  :host(
    :not([active]):not([status='finish']):not([status='process']):not([status='error']):not([part~='hovered']):not([part~='disabled'])
  )
  [part~='title'] {
    color: var(--sc-step-incomplete-title-color, var(--sc-color-grey-250));
  }

  :host(
    :not([active]):not([status='finish']):not([status='process']):not([status='error']):not([part~='hovered']):not([part~='disabled'])
  )
  [part~='time'] {
    color: var(--sc-step-incomplete-time-color, var(--sc-color-grey-250));
  }

  :host(
    :not([active]):not([status='finish']):not([status='process']):not([status='error']):not([part~='hovered']):not([part~='disabled'])
  )
  [part~='description'] {
    color: var(--sc-step-incomplete-description-color, var(--sc-color-grey-250));
  }

  :host(
    :not([active]):not([status='finish']):not([status='process']):not([status='error']):not([part~='hovered']):not([part~='disabled'])
  )
  [part~='view'] a {
    color: var(--sc-step-incomplete-view-color, var(--sc-color-grey-250));
  }

  /*Vertical Separator*/
  [part~='separator']:after {
    content: '';
    display: inline-block;
    background-color: var(
      --sc-step-step-separator-color,
      var(--sc-color-grey-50)
    );
    height: 100%;
    width: var(--separator-size);
    border-radius: 1px;
    transition: background 0.3s;
  }

  [part~='separator'] {
    position: absolute;
    height: var(--vertical-separator-height, 100%);
    width: var(--separator-size);
    left: var(--step-separator-left-position);
    padding: var(--step-separator-padding);
  }

  :host([status='finish']) [part~='separator']:after {
    background-color: var(
      --sc-step-finish-step-separator-color,
      var(--sc-color-green-500)
    );
  }

  :host([status='error']) [part~='separator']:after {
    background-color: var(
      --sc-step-error-step-separator-color,
      var(--sc-color-red-500)
    );
  }

  :host([active]) [part~='separator']:after {
    border-left: 1px dashed;
    border-left-color: var(
      --sc-step-current-step-separator-color,
      var(--sc-color-blue-500)
    );
    background: none;
  }

  :host(
    :not([active]):not([status='finish']):not([status='process']):not([status='error']):not([part~='hovered']):not([part~='disabled'])
  ) [part~='separator']:after {
    border-left: 1px dashed;
    border-left-color: var(
      --sc-step-incomplete-step-separator-color,
      var(--sc-color-grey-250)
    );
    background: none;
  }

  .sc-step-container {
    display: var(--step-indicator-container-display, block);
  }

  .sc-step-container [part~='indicator'] {
    display: var(--step-indicator-display, flex);
    z-index: 1;
  }

  [part~='disabled'] [part~='indicator'] {
    color: var(--sc-step-disabled-indicator-color, var(--sc-color-grey-40));
    background: var(
      --sc-step-disabled-indicator-background,
      var(--sc-color-grey-150)
    );
    border: 1px solid
      var(--sc-step-disabled-indicator-border-color, var(--sc-color-grey-50));
  }

  [part~='disabled'] [part~='title'] {
    color: var(--sc-step-disabled-title-color, var(--sc-color-grey-150));
  }

  [part~='disabled'] [part~='time'] {
    color: var(--sc-step-disabled-time-color, var(--sc-color-grey-150));
  }

  [part~='disabled'] [part~='description'] {
    color: var(--sc-step-disabled-description-color, var(--sc-color-grey-150));
  }

  [part~='disabled'] [part~='view'] a {
    color: var(--sc-step-disabled-view-color, var(--sc-color-grey-150));
  }

  /*Step text and separator*/
  :host {
    align-items: flex-start;
  }

  [part~='header'] {
    width: var(--header-width-vertical, auto);

    &::before,
    &::after {
      border-block-start-color: var(
        --sc-step-separator-color,
        var(--sc-color-grey-50)
      );
      border-block-start-style: var(--sc-step-separator-style, solid);
      content: '';
      width: auto;
      flex: 1;
      border-block-start-width: var(--separator-size);
      height: var(--separator-size);
      position: relative;
    }
  }

  [part~='header-container'] {
    display: flex;
    pointer-events: none;
    position: relative;
    width: var(--header-width-vertical, auto);

    &::after {
      border-block-start-color: var(
        --sc-step-separator-color,
        var(--sc-color-grey-50)
      );
      border-block-start-style: var(--sc-step-separator-style, solid);
      content: '';
      width: auto;
      flex: 1;
      border-block-start-width: var(--separator-size);
      height: var(--separator-size);
      position: relative;
      min-width: var(--separator-min-width);
      display: var(
        --hide-horizontal-separator,
        var(--horizontal-separator-display--last-of-type)
      );
    }
  }

  :host(sc-step[status='finish']) [part~='header'], :host(sc-step[status='finish']) [part~='header-container'] {
    &::after {
      border-block-start-color: var(
        --sc-step-finish-step-separator-color,
        var(--sc-color-green-500)
      );
    }
  }

  :host(sc-step[status='error']) [part~='header'], :host(sc-step[status='error']) [part~='header-container'] {
    &::after {
      border-block-start-color: var(
        --sc-step-error-step-separator-color,
        var(--sc-color-red-500)
      );
    }
  }

  /*Step text and separator*/
  [part~='header-container'] [part~='header'] {
    pointer-events: all;
    align-items: var(--step-header-align-items, center);
  }

  :host([disabled]) {
    & [part='indicator'], & [part='title'], & [part='time'], & [part='description'], & [part='view'] {
      pointer-events: none;
    }
  }

  [part~='header-container']:not([part~='disabled']) [part='indicator'],
  [part~='header-container']:not([part~='disabled']) [part='title'],
  [part~='header-container']:not([part~='disabled']) [part='time'],
  [part~='header-container']:not([part~='disabled']) [part='description'],
  [part~='header-container']:not([part~='disabled']) [part='view'] {
    pointer-events: all;
  }

  [part~='header'] {
    display: flex;
    align-items: var(--align-items, flex-start);
    position: relative;
    overflow: hidden;
    padding: var(--step-header-padding);
    justify-content: flex-start;
    gap: var(--header-gap, 0);

    &::before,
    &::after {
      content: '';
      flex: 1;
      border-block-start-width: var(--separator-size);
      height: var(--separator-size);
      min-width: var(--separator-min-width--header);
      width: calc(100% - (var(--indicator-size) / 2) - var(--header-padding));
      position: absolute;
    }

    &::before {
      inset-inline-start: 0;
      /* stylelint-disable */
      display: var(
        --hide-horizontal-separator,
        var(
          --separator-display-not-full,
          var(--horizontal-separator-display--first-of-type)
        )
      );
      /* stylelint-enable */
    }

    &::after {
      inset-inline-end: 0;
      /* stylelint-disable */
      display: var(
        --hide-horizontal-separator,
        var(
          --separator-display-not-full,
          var(--horizontal-separator-display--last-of-type)
        )
      );
      /* stylelint-enable */
    }
  }

  :host([direction='horizontal']) [part~='header-container'] {
    flex: 1;
    min-width: var(--min-horizontal-item-width, auto);
    max-width: 100%;
    scroll-snap-align: center;

    &[part~='left'], &[part~='right'] {
      [part~='header'] {
        padding: var(--step-header-padding) 0;

        [part~='text'] {
          padding: 0 var(--header-text-gap, 0.5rem);
        }
      }
    }
  }
  :host([direction='horizontal']:last-of-type) [part~='header-container'] {
    flex-grow: 0;
    scroll-snap-align: end;
    min-width: auto;
  }

  [part~='header-container']:not([part~='disabled']) .sc-step-container,
  [part~='header-container']:not([part~='disabled']) [part~='text'] {
    &:hover {
      cursor: pointer;
      outline: none;
    }
  }

  :host(
      :not([active]):not([status='finish']):not([status='process']):not(
          [status='error']
        )
    )
    [part~='hovered']:not([part~='disabled'])
    [part~='title'] {
    color: var(--sc-step-title-hover-color, var(--sc-color-blue-500));
  }

  :host(
      :not([active]):not([status='finish']):not([status='process']):not(
          [status='error']
        )
    )
    [part~='hovered']:not([part~='disabled'])
    [part~='time'] {
    color: var(--sc-step-time-hover-color, var(--sc-color-blue-500));
  }

  :host(
      :not([active]):not([status='finish']):not([status='process']):not(
          [status='error']
        )
    )
    [part~='hovered']:not([part~='disabled'])
    [part~='description'] {
    color: var(--sc-step-description-hover-color, var(--sc-color-blue-500));
  }

  :host(
      :not([active]):not([status='finish']):not([status='process']):not(
          [status='error']
        )
    )
    [part~='hovered']:not([part~='disabled'])
    [part~='view'] a {
    color: var(--sc-step-view-hover-color, var(--sc-color-blue-650));
  }

  :host(
      :not([active]):not([status='finish']):not([status='process']):not(
          [status='error']
        )
    )
    [part~='hovered']:not([part~='disabled'])
    [part~='indicator'] {
    color: var(--sc-step-indicator-hover-color, var(--sc-color-blue-500));
    background: var(--sc-step-indicator-hover-background, transparent);
    border: 1px solid
      var(--sc-step-indicator-hover-border-color, var(--sc-color-blue-500));
  }

  [part~='top'] {
    align-items: var(--step-not-full-header-alignment, flex-end);

    &::before,
    &::after {
      inset-block-end: var(--step-separator-position);
    }
  }

  [part~='top'] [part~='header'] {
    align-items: var(--align-items-start, flex-start);
    flex-direction: column-reverse;

    &::before,
    &::after {
      inset-block-end: var(--step-separator-position);
    }
  }

  [part~='bottom'] {
    align-items: var(--step-not-full-header-alignment, start);

    &::before,
    &::after {
      inset-block-start: var(--step-separator-position);
    }
  }

  [part~='bottom'] [part~='header'] {
    align-items: var(--align-items-start, flex-start);
    flex-direction: column;

    &::before,
    &::after {
      inset-block-start: var(--step-separator-position);
    }
  }

  [part~='top'],
  [part~='bottom'] [part~='text'] {
    width: 100%;
  }

  [part~='left'] [part='text'] {
    order: -1;
  }

  [part~='left'],
  [part~='right'] {
    align-items: center;
  }

  [part~='left'] [part~='text'],
  [part~='right'] [part~='text'] {
    overflow: hidden;
  }

  [part~='right'] [part~='text'] {
    padding-left: var(--header-text-gap, 0.5rem);
    width: 100%;
  }

  [part~='top'] [part~='text'] {
    padding-bottom: var(--header-text-gap, 0.5rem);
  }

  [part~='left'] [part~='header'],
  [part~='right'] [part~='header'] {
    &::before,
    &::after {
      display: none;
    }
  }

  [part~='indicator'] {
    width: var(--indicator-size);
    min-width: var(--indicator-size);
    height: var(--indicator-size);
    position: relative;
  }

  [part~='indicator'],
  ::slotted([slot='indicator']) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  [part~='text'] {
    text-align: var(--align-text-left, initial);
    min-width: var(--indicator-size);
  }

  [part~='description'],
  [part~='time'],
  [part~='title'] {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  [part~='empty'] {
    display: none;
  }

  [part~='disabled'] [part='header'] {
    cursor: default;
  }

  [part~='description'] {
    display: var(--step-description-display, block);
  }

  :host(sc-step[flex-column='true']) [part~='header-container'] {
    width: 100%;
  }

  :host(sc-step[flex-column='true']) [part~='header-container'][part~='right'] {
    & + .optional-contents {
      margin-left: 2.125rem;
      max-width: calc(100% - 2.125rem);
    }

    [part~='header'] {
      padding-left: 0;
    }
  }

  :host(sc-step[flex-column='true'][compact]) [part~='header-container'] {
    &[part~='right'] + .optional-contents {
      margin-left: 1.25rem;
      max-width: calc(100% - 1.25rem);
    }
    [part~='text'] {
      top: 0;
    }
  }

  :host(sc-step[flex-column='true']) [part~='header-container'][part~='left'] {
    & + .optional-contents {
      margin-left: 0.5rem;
      max-width: calc(100% - 0.5rem);
    }

    [part~='header'] {
      padding-right: 0;
    }
  }
  
  :host([flex-column='false']) [part~='header-container'][part~='bottom'] [part~='header'] [part~='text'] {
    margin-top: 0.5rem;
  }

  [part~='view'] a {
    cursor: pointer;
    text-decoration: none;
    color: var(--sc-color-blue-500);
    font-size: 0.875rem;
    font-weight: 600;

    &:hover {
      color: var(--sc-color-blue-650);
    }
  }

  :host(sc-step:last-of-type) [part~='header']::before {
    border-block: none;
  }

  :host(:not([direction='horizontal'])[compact]) [part~='text'] {
    position: relative;
    top: -0.25rem;
  }

  :host(:not([direction='horizontal']):not([compact])) [part~='text'] {
    padding-top: 0.125rem;
  }
`;
