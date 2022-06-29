import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import Immutable from 'immutable';
import Select from 'react-select';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/core/styles';

import FormInput from '../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import SecondaryButton from '../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import FormItem from '../components/FormItem';

// import { uploadResumeOnly } from '../../../actions/talentActions';
import {
  addDocument,
  editDocument,
  UploadFile,
  getDocument,
} from '../../../actions/onBoardingActions';
import { showErrorMessage } from '../../../actions';

const DocumentOptions = [
  {
    value: 'BACKGROUND_CHECK',
    label: 'Background Check',
  },
  {
    value: 'DRUG_TEST',
    label: 'Drug Test',
  },
  {
    value: 'EMPLOYMENT_AGREEMENT',
    label: 'Employment Agreement',
  },
  {
    value: 'I_9_MATERIALS',
    label: 'I-9 Materials',
  },
  {
    value: 'OFFER_LETTER',
    label: 'Offer Letter',
  },
  {
    value: 'PERSONAL_INFORMATION_FORM',
    label: 'Personal Information Form',
  },
  {
    value: 'TAX_FORM',
    label: 'Tax Form',
  },
];

const useStyles = makeStyles({
  submit: {
    width: 128,
    height: 31,
    margin: '0 auto',
    display: 'flex',
  },
});

const CreateDocumentDialog = (props) => {
  const { onClose, t, isEdit, fetchData, dataSource, rowsIndex } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [actionRadioValue, setActionRadioValue] = useState(
    'MUST_BE_SIGNED_AND_RETURNED'
  );
  const [documentRadioValue, setDocumentRadioValue] = useState('NONE');
  const [documentType, setDocumentType] = useState('');
  const [errorMessage, setErrorMessage] = useState(Immutable.Map());
  const [s3Url, setS3Url] = useState('');
  const [warningOpen, setWarningOpen] = useState(false);

  useEffect(() => {
    if (isEdit) {
      dispatch(getDocument(dataSource[rowsIndex].id))
        .then((response) => {
          formRef.current.documentName.value = response.name;
          setS3Url(response.s3Link);
          setActionRadioValue(response.actionRequired);
          setDocumentRadioValue(response.specialDocument);
          setDocumentType(response.documentType);
        })
        .catch((err) => {
          dispatch(showErrorMessage(err));
        });
    }
  }, [isEdit]);

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

    if (!s3Url) {
      setWarningOpen(true);
      setLoading(false);

      setTimeout(() => {
        setWarningOpen(false);
      }, 2000);
      return;
    }

    //为空或全部为空格
    if (userForm.documentName.value.match(/^[ ]*$/)) {
      dispatch(showErrorMessage('All space or empty, Please enter again'));
      return setLoading(false);
    }

    const params = {
      name: userForm.documentName.value,
      s3Link: s3Url,
      actionRequired: userForm.actionRequired.value,
      specialDocument: userForm.specialDocument.value,
    };

    if (documentType) {
      params.documentType = documentType;
    }

    if (isEdit) {
      dispatch(editDocument(params, dataSource[rowsIndex].id))
        .then((response) => {
          if (response) {
            onClose();
            fetchData();
          }
        })
        .catch((err) => {
          setLoading(false);
          dispatch(showErrorMessage(err));
        });
    } else {
      dispatch(addDocument(params))
        .then((response) => {
          if (response) {
            onClose();
            fetchData();
          }
        })
        .catch((err) => {
          setLoading(false);
          dispatch(showErrorMessage(err));
        });
    }
  };

  const removeErrorMessage = (key) => {
    const newKey = errorMessage.delete(key);
    return setErrorMessage(newKey);
  };

  // 文件上传
  const handleResumeUpload = (e) => {
    if (!e.target.value) return
    setUploadLoading(true);
    const fileInput = e.target;
    const resumeFile = fileInput.files[0];
    const fileName = resumeFile.name;
    const suffix = fileName.substr(fileName.lastIndexOf('.'));
    if (resumeFile.size > 5 * 1024 * 1024) {
      dispatch(
        showErrorMessage({ message: 'The uploaded file cannot exceed 5MB' })
      );
      setUploadLoading(false);
      return;
    }
    if (!(suffix === '.pdf' || suffix === '.PDF')) {
      dispatch(
        showErrorMessage({ message: 'The uploaded file must be a PDF' })
      );
      setUploadLoading(false);
      return;
    }
    if (resumeFile) {
      dispatch(UploadFile(resumeFile))
        .then((response) => {
          formRef.current.documentName.value = fileName.substring(
            0,
            fileName.lastIndexOf('.')
          );
          removeErrorMessage('documentName');
          setS3Url(response.response.s3url);
          setUploadLoading(false);
        })
        .catch((err) => {
          dispatch(showErrorMessage(err));
          setUploadLoading(false);
        });
    }
  };

  // 表单校验
  const validateForm = (userForm) => {
    let errorMessage = Immutable.Map();
    const pattern = /^[A-Za-z0-9_ \-\u4e00-\u9fa5]+$/;
    if (!userForm.documentName.value) {
      errorMessage = errorMessage.set(
        'documentName',
        t('message:DocumentNameIsRequired')
      );
    }

    if (
      !pattern.test(userForm.documentName.value) &&
      userForm.documentName.value
    ) {
      errorMessage = errorMessage.set(
        'documentName',
        t(
          'The document name can contain only letters, Chinese characters, digits, _, and -'
        )
      );
    }

    return errorMessage.size > 0 && errorMessage;
  };

  return (
    <>
      <DialogTitle>{isEdit ? 'Edit Documents' : 'Add Documents'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} ref={formRef}>
          <FormItem label={'Document Name'} required>
            <FormInput
              name="documentName"
              errorMessage={errorMessage.get('documentName')}
              onBlur={() => removeErrorMessage('documentName')}
              maxLength={260}
            />
            <div style={{ display: 'flex' }}>
              <PrimaryButton
                component="label"
                onChange={handleResumeUpload}
                style={{ whiteSpace: 'nowrap' }}
                variant={'outlined'}
                color="default"
                processing={uploadLoading}
                startIcon={<img src={'/assets/upload.svg'} />}
              >
                Browse
                <input
                  key="resume"
                  type="file"
                  style={{ display: 'none' }}
                  accept=".pdf"
                />
              </PrimaryButton>
              {warningOpen && (
                <div
                  style={{
                    color: '#cc4b37',
                    marginLeft: 10,
                    flexDirection: 'column',
                    alignSelf: 'flex-end',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                  }}
                >
                  Please upload the file
                </div>
              )}
            </div>
          </FormItem>
          <FormItem label="Required Action" isRadio>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="gender"
                name="actionRequired"
                value={actionRadioValue}
                onChange={(e) => setActionRadioValue(e.target.value)}
              >
                <FormControlLabel
                  value={'MUST_BE_SIGNED_AND_RETURNED'}
                  control={<Radio color="primary" />}
                  label="Must be signed and returned"
                />
                <FormControlLabel
                  value={'READ_ONLY'}
                  control={<Radio color="primary" />}
                  label="Read Only"
                />
              </RadioGroup>
            </FormControl>
          </FormItem>
          <FormItem label={'Special Document'} isRadio>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="gender"
                name="specialDocument"
                value={documentRadioValue}
                onChange={(e) => setDocumentRadioValue(e.target.value)}
              >
                <FormControlLabel
                  value={'NONE'}
                  control={<Radio color="primary" />}
                  label="None"
                />
                <FormControlLabel
                  value={'I_9_RELATED_FORMS_AND_ADDITIONAL_SECURITY_REQUIRED'}
                  control={<Radio color="primary" />}
                  label="1-9 related Forms and requires additional security"
                />
              </RadioGroup>
            </FormControl>
          </FormItem>
          <FormItem label="Document Type">
            <FormReactSelectContainer>
              <Select
                valueKey={'value'}
                labelKey={'label'}
                options={DocumentOptions}
                value={documentType}
                onChange={(data) => {
                  if (data) {
                    setDocumentType(data.value);
                  } else {
                    setDocumentType('');
                  }
                }}
                autoBlur={true}
                searchable={true}
                clearable={true}
              />
            </FormReactSelectContainer>
          </FormItem>
          <input type="submit" id="submit-button" style={{ display: 'none' }} />
        </form>
      </DialogContent>
      <DialogActions>
        <div className={classes.submit}>
          <SecondaryButton
            onClick={onClose}
            size="small"
            variant="outlined"
            disabled={uploadLoading}
            style={{ marginRight: 10 }}
          >
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton
            component="label"
            processing={loading}
            disabled={uploadLoading}
            size="small"
            htmlFor="submit-button"
          >
            {t('save')}
          </PrimaryButton>
        </div>
      </DialogActions>
    </>
  );
};

export default connect()(CreateDocumentDialog);
