import { styled } from '@mui/material/styles';
import MuiTabs from '@mui/material/Tabs';

export const builderEmptyStyle = () => ({});

// Preserve MUI's polymorphic props/refs without leaking nested styled types.
export const BuilderTabs = /*#__PURE__*/ styled(MuiTabs)(builderEmptyStyle) as typeof MuiTabs;
