import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_Dialog`;
export const classes = {
  resize: `${PREFIX}-root`,
  static: `${PREFIX}-static`,
  max: `${PREFIX}-max`,
  hideBackdrop: `${PREFIX}-hideBackdrop`,
};

export const Root = styled(Dialog)(({ theme }) => ({
  [`& .${classes.resize}`]: {
    position: 'absolute',
    right: '-5px',
    bottom: '-5px',
    transform: 'rotate(45deg)',
    padding: 0,
    margin: 0,
    cursor: 'nwse-resize',
    color: theme.palette.mode === 'dark' ? '#3d4d66' : '#2c3f5eb3',
    borderRadius: '0px',
    '&:hover': {
      backgroundColor: 'transparent!important',
    },
  },
  '& .MuiDialog-paper': {
    overflow: 'hidden',
  },
  '& .MuiDialogTitle-root': {
    margin: 0,
    padding: theme.spacing(0.5, 2),
    paddingRight: theme.spacing(1),
    '& .MuiGrid-item': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  '& .MuiDialogContent-root': {
    margin: 0,
    padding: theme.spacing(0.5, 2),
  },
  '& .MuiDialogActions-root': {
    margin: 0,
    padding: theme.spacing(0.5, 2),
  },
  [`&.${classes.static}`]: {
    position: 'absolute',
    minHeight: 'calc(100vh - 114px)',
    zIndex: 1199,
    '& .MuiBackdrop-root': {
      position: 'absolute',
      minHeight: 'calc(100vh - 114px)',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  [`&.${classes.max}`]: {
    '&.MicroWebUI_Base_Dialog-static': {
      zIndex: 1200,
      width: '100vw',
    },
    '& .MuiDialog-paper': {
      minHeight: '100%',
      minWidth: '100%',
      transform: 'none!important',
      width: '100vw',
      left: 0,
      top: 0,
      margin: 0,
      zIndex: 1200,
    },
  },
  [`&.${classes.hideBackdrop}`]: {
    '&.MicroWebUI_Base_Dialog-static': {
      width: 0,
      height: 0,
      margin: 0,
    },
    '& .MuiDialog-container': {
      width: 0,
      height: 0,
      margin: 0,
    },
    '& .MuiPaper-root': {
      position: 'absolute',
      margin: 0,
    },
  },
}));
export default Root;
