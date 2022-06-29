import React, { useState, useRef, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import FormTextArea from '../../../components/particial/FormTextArea';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import { showErrorMessage } from '../../../actions';

import {
  getEsignatureData,
  saveEsignatureData,
} from '../../../actions/onBoardingActions';

const useStyles = makeStyles({
  pageTop: {
    height: 70,
    width: '100%',
    padding: 24,
  },
  pageContent: {
    height: 60,
    width: '100%',
  },
  title: {
    marginTop: 15,
    textAlign: 'center',
  },
  submitButton: {
    width: 64,
    margin: '0 auto',
  },
  textArea: {
    width: '95%',
    margin: '0 auto',
  },
});

const Esignature = (props) => {
  const { location, t } = props;
  const classes = useStyles();
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const fetchData = () => {
    dispatch(getEsignatureData()).then((response) => {
      formRef.current.text.value = response?.text ? response?.text : '';
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const userForm = e.target;

    if (!userForm.text.value) {
      dispatch(showErrorMessage('Please Fill in'));
      setLoading(false);
      return;
    }

    const params = {
      text: userForm.text.value,
    };
    dispatch(saveEsignatureData(params))
      .then(() => {
        setSuccessOpen(true);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        dispatch(showErrorMessage(err));
      });
  };

  return (
    <Paper className="flex-child-auto flex-container flex-dir-column">
      <div className={classes.pageTop}>
        <div style={{ float: 'left' }}>
          <Typography variant="h5">E-Signature</Typography>
        </div>
      </div>
      <Divider />
      <div className={classes.pageContent}>
        <div className={classes.title}>
          On-Boarding E-Signature Certification
        </div>
      </div>
      <div className={classes.pageContent}>
        <form
          onSubmit={onSubmit}
          id="activityForm"
          style={{ marginBottom: 15 }}
          ref={formRef}
        >
          <div className={classes.textArea}>
            <FormTextArea name="text" rows="5" maxLength={3000} />
          </div>
          <input type="submit" id="activityForm" style={{ display: 'none' }} />
        </form>
        <div className={classes.submitButton}>
          <PrimaryButton
            type="submit"
            processing={loading}
            size="small"
            form="activityForm"
          >
            {t('save')}
          </PrimaryButton>
        </div>
        <Snackbar
          open={successOpen}
          autoHideDuration={1000}
          onClose={() => setSuccessOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert severity="success">Submit successfully!</MuiAlert>
        </Snackbar>
      </div>
    </Paper>
  );
};

export default withTranslation()(connect()(Esignature));
