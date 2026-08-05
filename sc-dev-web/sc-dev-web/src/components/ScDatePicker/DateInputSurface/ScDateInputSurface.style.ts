import { css } from 'lit';

export const DateInputSurfaceStyling = css`
:host {
  display: block;
  position: absolute; /* NOTE(motss): Set this so that surface can be placed on top of its anchor element */
  top: 0; /** NOTE(motss): This ensures inputSurface renders downwards on top of input */
  bottom: 0; /** NOTE(motss): This ensures inputSurface renders upwards on top of input */
  margin-top: 2.5rem;
}
.surface-container {
  position: relative;
  z-index: 10;
}
`;
