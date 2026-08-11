import { styled } from '@mui/material/styles';

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_tab`;
export const classes = {
  root: `${PREFIX}-root`,
  textBox: `${PREFIX}-textBox`,
  textBoxOutter: `${PREFIX}-textBoxOutter`,
  button: `${PREFIX}-button`,
};

const Root = styled('section')(({ theme }) => ({
  padding: 0,
  margin: 0,
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  [`& .${classes.textBoxOutter}`]: {
    flex: '1 1 0%',
  },
  [`& .${classes.textBox}`]: {
    margin: 0,
    verticalAlign: 'middle',
    ...theme.theme['TabItem']['TextBox'],
  },
  [`& .${classes.button}`]: {
    padding: 0,
    margin: 0,
    ...theme.theme['TabItem']['Button'],
  },
  [`.light &.tab-item-wrapper`]: {
    background: 'transparent',
  },
  [`.light &.tab-item-wrapper svg`]: {
    color: '#0473EA',
  },
  [`.light &.tab-item-wrapper .MuiInput-input`]: {
    color: '#B3D5F8',
  },
  [`&.tab-item-wrapper:hover .MuiInput-input`]: {
    color: '#4F9DF0 !important',
  },
  [`.dark &.tab-item-wrapper:hover svg`]: {
    color: '#9AC7F6 !important',
  },
  [`.light [aria-selected='true'] &.tab-item-wrapper svg`]: {
    color: '#0250A3',
  },
  [`.light [aria-selected='true'] &.tab-item-wrapper .MuiInput-input`]: {
    color: '#0473EA !important',
  },
  [`.dark &.tab-item-wrapper svg, .dark &.tab-item-wrapper .MuiInput-input`]: {
    color: '#012246',
  },
  [`.dark [aria-selected='true'] &.tab-item-wrapper svg, .dark [aria-selected='true'] &.tab-item-wrapper .MuiInput-input`]:
    {
      color: '#E5F1FC !important',
    },
}));

export default Root;
