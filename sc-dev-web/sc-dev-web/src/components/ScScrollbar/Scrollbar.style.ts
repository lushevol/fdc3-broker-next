import { css } from 'lit';

const baseSize = 0.75;

export const styles = css`
  :host {
    display: contents;
    --base-size: var(--sc-scrollbar-size, ${baseSize}rem);
    --base-thumb-size: calc(var(--base-size) / 3);
    --size: var(--base-size);
    --thumb-size: var(--base-thumb-size);
  }
  :host([block]) {
    display: block;
    position: relative !important;
  }

  .container {
    display: contents;

    &.size-xs {
      --size: calc(var(--base-size) * 0.75);
      --thumb-size: calc(var(--base-thumb-size) * 0.8333333);
    }
    &.size-sm {
      --size: calc(var(--base-size) * 0.833333);
      --thumb-size: calc(var(--base-thumb-size) * 1);
    }
    &.size-lg {
      --size: calc(var(--base-size) * 1.166667);
      --thumb-size: calc(var(--base-thumb-size) * 1.3333333);
    }
    &.size-xl {
      --size: calc(var(--base-size) * 1.25);
      --thumb-size: calc(var(--base-thumb-size) * 1.5);
    }

    &.hide {
      display: none;
    }

    &:not(.opaque) {
      --sc-scrollbar-track-color: transparent;
    }
  }

  .track {
    display: none;
    position: absolute;
    box-sizing: border-box;
    opacity: var(--sc-scrollbar-opacity-active, 1);
    transition: opacity 0.25s ease-in, box-shadow 0.25s ease-in,
      outline-color 0.25s ease-in;
    transition-delay: 0s, 0s, 0s;

    &[part="y"],
    &[part="x"] {
      overflow: hidden;

      .scroller, .fake-scroller {
        width: 100%;
        height: 100%;
        overflow: clip;
        position: relative;

        .spacer {
          width: 1px;
          height: 1px;
          visibility: hidden;
          pointer-events: none;
        }
        
        &::-webkit-scrollbar {
          background-color: var(--sc-scrollbar-track-color, var(--sc-color-grey-50));
          width: var(--size);
          height: var(--size);
        }

        &::-webkit-scrollbar-thumb {
          background-color: var(--sc-scrollbar-thumb-color, var(--sc-color-grey-500));
          border-radius: calc(var(--size) / 2);
          border-width: calc((var(--size) - var(--thumb-size)) / 2);
          border-style: solid;
          border-color: var(--sc-scrollbar-track-color, var(--sc-color-grey-50));
        }
        &::-webkit-scrollbar-corner {
          display: none;
          background-color: transparent;
        }

        .container:not(.opaque) &.scroller {
          --size-diff: calc(var(--size) - var(--thumb-size));
          width: calc(100% - var(--size-diff));
          height: calc(100% - var(--size-diff));
          margin: calc(var(--size-diff) / 2);

          &::-webkit-scrollbar {
            border-radius: calc(var(--thumb-size) / 2);
            width: var(--thumb-size);
            height: var(--thumb-size);
          }
          &::-webkit-scrollbar-thumb {
            border: none;
            border-radius: calc(var(--thumb-size) / 2);
          }
        }
      }
      .fake-scroller {
        position: absolute;
        &::-webkit-scrollbar {
          background-color: transparent;
        }

        &::-webkit-scrollbar-thumb {
          background-color: transparent;
          border: none;
          border-radius: 0;
        }
      }

      .border.opaque & .scroller {
        outline: 1px solid var(--sc-scrollbar-border-color, var(--sc-color-grey-200));
        outline-offset: -1px;
        &:hover {
          outline-color: var(--sc-scrollbar-border-hover-color, var(--sc-color-blue-450));
          &:active {
            outline-color: var(--sc-scrollbar-border-active-color, var(--sc-color-blue-650));
          }
        }
      }
      .round.opaque & {
        &, .scroller {
          border-radius: calc(var(--size) / 2);
        }
      }

      &:hover {
        --thumb-size: calc(var(--size) - 4px);
        --sc-scrollbar-thumb-color: var(--sc-scrollbar-thumb-hover-color, var(--sc-color-blue-450));
        /* .container.opaque & {
          box-shadow: 0px 1px 3px 1px rgb(from var(--sc-scrollbar-shadow-color, var(--sc-color-grey-900)) r g b / 15%), 
            0px 1px 2px 0px rgb(from var(--sc-scrollbar-shadow-color, var(--sc-color-grey-900)) r g b / 30%);
        } */
      }
      &:active {
        --sc-scrollbar-thumb-color: var(--sc-scrollbar-thumb-active-color, var(--sc-color-blue-650));
        box-shadow: none;
        transition-duration: 0s, 0s, 0s;
      }
    }
    &[part="y"].has-y {
      display: block;
      width: var(--size);
      max-width: var(--size);
      top: var(--offset-top, 0px);
      height: var(--offset-height, 0px);
      
      .scroller, .fake-scroller {
        overflow-y: scroll;
      }
      &.has-x, .container.resizer & {
        height: calc(var(--offset-height, 0px) - var(--size) + 1px);

        &, .scroller {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
    }
    &[part="x"].has-x {
      display: block;
      height: var(--size);
      max-height: var(--size);
      top: calc(var(--offset-top, 0px) + var(--offset-height, 100%) - var(--size));
      left: var(--offset-left, 0px);
      width: var(--offset-width, 100%);
      
      .scroller, .fake-scroller {
        overflow-x: scroll;
      }
      &.has-y, .container.resizer & {
        width: calc(var(--offset-width, 100%) - var(--size) + 1px);

        &, .scroller {
          &:dir(ltr) {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
          }
          &:dir(rtl) {
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
          }
        }
        &:dir(rtl) {
          left: calc(var(--offset-left, 0px) + var(--size) - 1px);
        }
      }
    }
    &[part="corner"] {
      &.has-y.has-x {
        display: block;
        width: var(--size);
        height: var(--size);
        top: calc(var(--offset-top, 0px) + var(--offset-height, 100%) - var(--size));
        pointer-events: none;
        background-color: var(--sc-scrollbar-track-color, var(--sc-color-grey-50));
        
        .border.opaque & {
          border: 0px solid var(--sc-scrollbar-border-color, var(--sc-color-grey-200));
          border-bottom-width: 1px;
          &:dir(ltr) {
            border-right-width: 1px;
          }
          &:dir(rtl) {
            border-left-width: 1px;
          }
        }
      }
      .container.resizer & {
        display: none;
      }
    }
    &[part="y"], &[part="corner"] {
      &:dir(ltr) {
        left: calc(var(--offset-left, 0px) + var(--offset-width, 100%) - var(--size));
      }
      &:dir(rtl) {
        left: var(--offset-left, 0);
      }
    }
  }
  
  .container:not(.always-visible) {
    .track {
      /* transition-delay: 2.5s, 0s, 0s; */
      opacity: var(--sc-scrollbar-opacity-inactive, 0); 
    }

    &.show,
    &.keep,
    &:hover, 
    &:active {
      .track {
        opacity: var(--sc-scrollbar-opacity-active, 1);
        transition-duration: 0s, 0.25s, 0.25s;
        transition-delay: 0s, 0s, 0s;
      }
    }
  }
`;

export const externalStyles = css`
  .-sc-scroll-target {
    position: static !important;
    box-sizing: border-box;
    border: 0px solid transparent;
    --sc-scrollbar-gutter: var(--sc-scrollbar-size, ${baseSize}rem);

    &.-sc-scroll-xs {
      --sc-scrollbar-gutter: calc(var(--sc-scrollbar-size, ${baseSize}rem) * 0.75);
    }
    &.-sc-scroll-sm {
      --sc-scrollbar-gutter: calc(var(--sc-scrollbar-size, ${baseSize}rem) * 0.833333);
    }
    &.-sc-scroll-lg {
      --sc-scrollbar-gutter: calc(var(--sc-scrollbar-size, ${baseSize}rem) * 1.166667);
    }
    &.-sc-scroll-xl {
      --sc-scrollbar-gutter: calc(var(--sc-scrollbar-size, ${baseSize}rem) * 1.25);
    }

    &::-webkit-scrollbar {
      width: var(--sc-scrollbar-gutter) !important;
      height: var(--sc-scrollbar-gutter) !important;
    }
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-thumb,
    &::-webkit-scrollbar-corner {
      visibility: hidden;
      pointer-events: none;
    }
    
    &.-sc-scroll-no-y {
      overflow-y: hidden !important;
    }
    &.-sc-scroll-no-x {
      overflow-x: hidden !important;
    }

    &.-sc-scroll-gutter-none {
      --sc-scrollbar-gutter: 0px;
    }
    &.-sc-scroll-gutter-auto {  
      scrollbar-gutter: auto;
    }
    &.-sc-scroll-gutter-stable {
      scrollbar-gutter: stable;
    }
    &.-sc-scroll-gutter-stable-both {
      scrollbar-gutter: stable both-edges;
    }
  }
`;
