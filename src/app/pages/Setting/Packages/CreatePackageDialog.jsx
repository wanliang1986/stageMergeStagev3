import React, { useEffect, useState, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import Immutable from 'immutable';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';

import SecondaryButton from '../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import FormInput from '../../../components/particial/FormInput';
import FormTextArea from '../../../components/particial/FormTextArea';
import FormItem from '../components/FormItem';

import { addPackages, editPackages } from '../../../actions/onBoardingActions';
import { showErrorMessage } from '../../../actions';

const useStyles = makeStyles({
  submit: {
    width: 128,
    height: 31,
    margin: '0 auto',
    display: 'flex',
  },
});

const CreatePackageDialog = (props) => {
  const {
    onClose,
    t,
    fetchData,
    isEdit,
    editData,
    editAfterData,
    onOktext = 'Save',
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(Immutable.Map());

  useEffect(() => {
    if (editData) {
      formRef.current.packageName.value = editAfterData.name
        ? editAfterData.name
        : editData.name;
      if (editData.description || editAfterData.description) {
        formRef.current.description.value =
          editAfterData.description !== undefined
            ? editAfterData.description
            : editData.description;
      }
    }
  }, [editData]);

  const removeErrorMessage = (key) => {
    const newKey = errorMessage.delete(key);
    return setErrorMessage(newKey);
  };

  const validateForm = (userForm) => {
    let errorMessage = Immutable.Map();

    if (!userForm.packageName.value) {
      errorMessage = errorMessage.set(
        'packageName',
        t('message:PackageNameIsRequired')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  };

  //提交表单
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const userForm = e.target;
    let errorMessage = validateForm(userForm);
    if (errorMessage) {
      setErrorMessage(errorMessage);
      setLoading(false);
      return;
    }

    const params = {
      name: userForm.packageName.value,
    };

    if (userForm.description.value) {
      params.description = userForm.description.value;
    }

    //为空或全部为空格
    if (userForm.packageName.value.match(/^[ ]*$/)) {
      dispatch(showErrorMessage('All space or empty, Please enter again'));
      return setLoading(false);
    }

    if (isEdit) {
      dispatch(editPackages(params, editData.id))
        .then((response) => {
          if (response) {
            onClose(params.name, userForm.description.value);
          }
        })
        .catch((err) => {
          setLoading(false);
          dispatch(showErrorMessage(err));
        });
    } else {
      dispatch(addPackages(params))
        .then((response) => {
          if (response) {
            onClose('ok', response);
            fetchData();
          }
        })
        .catch((err) => {
          setLoading(false);
          dispatch(showErrorMessage(err));
        });
    }
  };

  return (
    <>
      <DialogTitle>
        {isEdit ? 'Edit Package' : 'Create New Hire Package'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="row" ref={formRef}>
          <FormItem label="Package Name" required>
            <FormInput
              name="packageName"
              errorMessage={errorMessage.get('packageName')}
              onBlur={() => removeErrorMessage('packageName')}
              maxLength={260}
            />
          </FormItem>

          <FormItem label="description">
            <FormTextArea name="description" rows="10" maxLength={2000} />
          </FormItem>
          <input type="submit" id="submit-button" style={{ display: 'none' }} />
        </form>
      </DialogContent>
      <DialogActions>
        <div className={classes.submit}>
          <SecondaryButton
            onClick={onClose}
            size="small"
            style={{ marginRight: 10 }}
            variant="outlined"
          >
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton
            component="label"
            processing={loading}
            size="small"
            htmlFor="submit-button"
          >
            {onOktext}
          </PrimaryButton>
        </div>
      </DialogActions>
    </>
  );
};

export default connect()(CreatePackageDialog);
