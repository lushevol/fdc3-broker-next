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
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.background.default,
  },
  [`& .${classes.editorContainer}`]: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
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
