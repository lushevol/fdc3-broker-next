import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import LoadingButton from '../../components/LoadingButton';
import type { SurveyProps } from './common/interface';
import useController from './common/useController';

const Survey: React.FC<SurveyProps> = (props: SurveyProps): React.ReactElement => {
  const { loading, continuLogout, stopLogout, openSurveyAndLogout, openSurveyAndHide } =
    useController(props);

  return (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Leave Now?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          To provide better service, please&nbsp;
          <Button
            variant="text"
            style={{
              minWidth: 'auto',
              paddingLeft: '2px',
              paddingRight: '2px',
              textDecoration: 'underline !important',
            }}
            id="surverLink"
            onClick={openSurveyAndHide}
            disabled={loading}
          >
            Share Feedback
          </Button>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={openSurveyAndLogout}
          autoFocus
          variant="contained"
          data-testid="Go_Btn"
          disabled={loading}
        >
          Share Feedback & Logout
        </Button>
        <LoadingButton
          onClick={() => {
            continuLogout().then(() => {
              console.info('continuLogout');
            });
          }}
          variant="outlined"
          data-testid="Logout_Btn"
          loading={loading}
        >
          Logout
        </LoadingButton>
        <Button
          onClick={stopLogout}
          color="error"
          variant="outlined"
          data-testid="Hide_Btn"
          disabled={loading}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(Survey);
