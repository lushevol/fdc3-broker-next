import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

export const PREFIX = 'FDC3Declaration';

export const classes = {
  root: `${PREFIX}-root`,
  editorContainer: `${PREFIX}-editor-container`,
  section: `${PREFIX}-section`,
  jsonEditor: `${PREFIX}-json-editor`,
};

const Root = styled(Stack)(({ theme }) => ({
  [`&.${classes.root}`]: {
    flex: 1,
    height: '100% !important',
    minHeight: 0,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default,
  },
  [`& .${classes.editorContainer}`]: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
  },
  [`& .${classes.section}`]: {
    marginBottom: theme.spacing(3),
  },
  [`& .${classes.jsonEditor}`]: {
    fontFamily: 'monospace',
    fontSize: '0.875rem',
  },
}));

export default Root;
