import { webkitMuiTheme } from './webkit-theme.generated.js';

export const compactControlTokens = {
  typography: {
    fontFamily: webkitMuiTheme.typography.fontFamily.value,
    body: 14,
    compact: 12,
    gridHeader: 11,
    gridCell: 12,
  },
  control: {
    small: { fontSize: 12, minHeight: 28, paddingInline: 6, paddingBlock: 4, lineHeight: 1.375 },
    medium: { fontSize: 14, minHeight: 32, paddingInline: 8, paddingBlock: 4, lineHeight: 1.375 },
    large: { fontSize: 16, minHeight: 40, paddingInline: 12, paddingBlock: 6, lineHeight: 1.375 },
  },
  input: {
    small: { fontSize: 12, lineHeight: 18, paddingInline: 8, paddingBlock: 4 },
    medium: { fontSize: 14, lineHeight: 22, paddingInline: 12, paddingBlock: 4 },
  },
} as const;
