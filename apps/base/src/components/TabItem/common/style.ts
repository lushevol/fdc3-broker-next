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
}));

export default Root;
