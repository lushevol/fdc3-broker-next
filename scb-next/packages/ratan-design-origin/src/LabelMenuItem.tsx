import React from 'react';
import MuiMenuItem, { type MenuItemProps } from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';

const LabelMenuItemRoot = /*#__PURE__*/ styled(MuiMenuItem)({ minWidth: '263px' });

export const LabelMenuItem = /*#__PURE__*/ React.forwardRef<HTMLLIElement, MenuItemProps>(
  function LabelMenuItem(props, ref) {
    return <LabelMenuItemRoot {...props} ref={ref} />;
  },
);
