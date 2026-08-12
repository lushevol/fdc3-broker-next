import { styled } from '@mui/material/styles';
import LegacyTabRoot, { classes } from '../../../components/TabItem/common/style';

const NewLayoutWorkspaceTabRoot = styled(LegacyTabRoot)(() => ({
  [`.light & svg`]: { color: '#0473ea' },
  [`.light & .${classes.textBox} .MuiInput-input`]: { color: '#b3d5f8' },
  [`&:hover .${classes.textBox} .MuiInput-input`]: { color: '#4f9df0 !important' },
  [`.dark &:hover svg`]: { color: '#9ac7f6 !important' },
  [`.light [aria-selected='true'] & svg`]: { color: '#0250a3' },
  [`.light [aria-selected='true'] & .${classes.textBox} .MuiInput-input`]: {
    color: '#0473ea !important',
  },
  [`.dark & svg, .dark & .${classes.textBox} .MuiInput-input`]: { color: '#012246' },
  [`.dark [aria-selected='true'] & svg, .dark [aria-selected='true'] & .${classes.textBox} .MuiInput-input`]:
    {
      color: '#e5f1fc !important',
    },
}));

export default NewLayoutWorkspaceTabRoot;
