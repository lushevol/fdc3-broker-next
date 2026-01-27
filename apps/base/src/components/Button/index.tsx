/**
 * @fileoverview Button Component
 *
 * A wrapper around Material-UI's Button component that provides a
 * consistent button interface throughout the application.
 *
 * @module components/Button
 */

import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button';
import type React from 'react';
import type { ReactElement } from 'react';

/**
 * Extended button props interface.
 * Extends MUI ButtonProps with additional application-specific properties.
 */
interface ButtonProps extends MuiButtonProps {
  /** Optional child elements to render inside the button */
  children?: React.ReactNode;
}

/**
 * Button Component
 *
 * A styled button component that wraps Material-UI's Button.
 * Inherits all MUI Button props and behaviors.
 *
 * @param props - Button properties extending MUI ButtonProps
 * @param props.children - Content to display inside the button
 * @returns A Material-UI Button element
 *
 * @example
 * <Button variant="contained" color="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 */
const Button: React.FC<ButtonProps> = ({ children, ...rest }: ButtonProps): ReactElement => {
  return <MuiButton {...rest}>{children}</MuiButton>;
};

export default Button;
