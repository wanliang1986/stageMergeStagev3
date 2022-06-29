import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import Immutable from 'immutable';
import { connect } from 'react-redux';
import { makeCancelable } from '../../../../utils';

import { createContract } from '../../../actions/clientActions';
import { showErrorMessage } from '../../../actions';
import {
  getContractById,
  getContractsListByCompany,
} from '../../../selectors/contractSelector';
import { getActiveTenantUserList } from '../../../selectors/userSelector';
import { withStyles } from '@material-ui/core/styles';
import { getUploadContractUrl } from '../../../../apn-sdk/client';
import Select from 'react-select';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import SecondaryButton from '../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import FormTextArea from '../../../components/particial/FormTextArea';
import FormInput from '../../../components/particial/FormInput';
import Attachment from './Attachment';
import DatePicker from 'react-datepicker';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import '../Form/PotentialServiceTypeSelect/index.css';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const styles = {
  signee: {
    marginBottom: '8px',
    '& fieldset': {
      borderRadius: '0px',
    },
    '& div.MuiOutlinedInput-root': {
      paddingTop: '0px',
      paddingBottom: '0px',
    },
    '& input': {
      fontSize: '15px',
      color: '#505050',
    },
  },
  uploadingFile: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
};

const contractTypeList = [
  { type: '', value: '' },
  { type: 'General Recruiting (FTE)', value: 'GENERAL_RECRUITING' },
  { type: 'General Staffing (Contract)', value: 'GENERAL_STAFFING' },
  { type: 'Payroll', value: 'PAYROLL' },
  { type: 'Campus Recruiting', value: 'CAMPUS_RECRUITING' },
  {
    type: 'Recruitment Process Outsourcing (RPO)',
    value: 'RECRUITMENT_PROCESS_OUTSOURCING',
  },
  { type: 'Internship', value: 'INTERNSHIP' },
  { type: 'Others', value: 'OTHERS' },
];

const initalState = {
  prevContractId: null,
  file: '',
  fileName: '',
  s3Key: '',
  name: '',
  endsOn: null,
  startsFrom: null,
  errorMessage: Immutable.Map(),
  creating: false,
  selectedSignees: [],
  contractType: { type: '', value: '' },
  status: 'VALID',
  note: '',
  uploadingFile: false,
  serviceTypeSelect: null,
  checked: false,
  renewalContract: null,
  renewalContractId: null,
};
class AddClientContactForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { ...initalState };
  }
  componentWillUnmount(): void {
    if (this.fileTask) {
      this.fileTask.cancel();
    }
  }

  static getDerivedStateFromProps(props, state) {
    // console.log(
    //   'derived',
    //   props.selectedContractId === null,
    //   props.selectedContractId === state.prevContractId
    // );

    if (props.selectedContractId !== state.prevContractId) {
      if (!props.selectedContractId) {
        return { ...initalState };
      }

      const toEdit = props.contract;
      // console.log('toedidt',toEdit&&toEdit.toJS());
      if (toEdit) {
        var toEditContractType = contractTypeList.filter(
          (ele) => ele.value === toEdit.get('contractType')
        )[0];
        const userList = props.userList;
        const nowSignees = toEdit
          .get('signees')
          .toJS()
          .map((ele) => ele.id);

        var toEditSelectedSignees = userList.filter((ele) => {
          return nowSignees.indexOf(ele.id) !== -1;
        });

        // console.log('eidt!!!',userList,nowSignees,toEditSelectedSignees);

        return {
          prevContractId: props.selectedContractId,
          file: new File(['foo'], toEdit.get('fileName'), {
            type: 'text/plain',
          }),
          name: toEdit.get('name'),
          fileName: toEdit.get('fileName'),
          s3Key: toEdit.get('s3Key'),
          endsOn: toEdit.get('endDate') ? moment(toEdit.get('endDate')) : null,
          startsFrom: moment(toEdit.get('startDate')),
          errorMessage: Immutable.Map(),
          creating: false,
          selectedSignees: toEditSelectedSignees,
          contractType: toEditContractType,
          status: toEdit.get('status'),
          note: toEdit.get('note'),
          uploadingFile: false,
          checked: toEdit.get('previousContractId'),
          renewalContractId: toEdit.get('previousContractId'),
          renewalContract:
            toEdit.get('previousContractId') &&
            props.contractList
              .filter((item, index) => {
                return item.get('id') === toEdit.get('previousContractId');
              })
              .toJS()[0].name,
        };
      } else {
        return { ...initalState };
      }
    }

    return null;
  }

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleClose = () => {
    // this.props.handleRequestClose();
    // this.setState({
    //   errorMessage: this.state.errorMessage.clear()
    // });
    this.setState(() => {
      return { ...initalState };
    }, this.props.handleRequestClose());
  };

  attachFileHandler = (e) => {
    const fileInput = e.target;
    // console.log(fileInput.value, fileInput.files[0]);
    this.setState({ file: fileInput.files[0], uploadingFile: true });

    if (this.fileTask) {
      //cancel pre upload
      this.fileTask.cancel();
    }
    const file = fileInput.files[0];
    this.fileTask = makeCancelable(
      getUploadContractUrl().then(({ message }) => {
        console.log(
          'message',
          message,
          file.name,
          encodeURIComponent(file.name)
        );
        return fetch(message, {
          method: 'PUT',
          headers: {
            'Content-Disposition': `filename="${encodeURIComponent(
              file.name
            )}"`,
          },
          body: file,
        }).then(() => {
          console.log('????', new URL(message).pathname.replace('/', ''));
          return new URL(message).pathname.replace('/', '');
        });
      })
    );
    this.fileTask.promise
      .then((s3Key) => {
        if (this.removeErrorMessage) {
          this.removeErrorMessage('attachement');
        }
        console.log('[contract]', s3Key);
        this.setState({ s3Key, uploadingFile: false });
      })
      .catch((err) => {
        this.setState(
          {
            file: '',
            uploadingFile: false,
          },
          () => {
            if (err.statusText) {
              this.props.dispatch(showErrorMessage(err.statusText));
            }
          }
        );
      });

    fileInput.value = '';
  };

  removeFileHandler = (file) => {
    this.setState({ file: '' });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const contractForm = e.target;
    const { t, dispatch, companyId } = this.props;
    let errorMessage = this._validateForm(contractForm, t);
    // console.log(errorMessage.toJS())
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    const contractData = {
      name: contractForm.name.value,
      fileName: this.state.file.name,
      s3Key: this.state.s3Key,
      signees: this.state.selectedSignees.map((ele) => ele.id),
      startDate: contractForm.startsFrom.value / 1000,
      endDate: contractForm.endsOn.value
        ? contractForm.endsOn.value / 1000
        : null,
      contractType: this.state.contractType.value,
      status: this.state.status,
      note: contractForm.note.value,
      companyId: Number(companyId),
      requiredFile: true,
      renewalContractId: this.state.renewalContractId,
    };
    // console.log('contract', contractData, this.props.contract);

    this.setState({ creating: true });
    if (this.props.contract) {
      const id = this.props.contract.get('id');
      contractData.id = id;
      // console.log('component', id);
      dispatch(createContract(contractData, id))
        .then((res) => {
          if (res) {
            this.setState({ creating: false, prevContractId: res.id });
            this.handleClose();
            this.props.fetchData();
          } else {
            this.setState({ creating: false });
          }
        })
        .catch(() => {
          this.setState({ creating: false });
        });
    } else {
      dispatch(createContract(contractData)).then((res) => {
        // console.log('!!!!!!!!!res', res);
        this.setState({ creating: false, prevContractId: res.id });
        this.props.onCreateSuccess();
        this.handleClose();
      });
    }
  };

  _validateForm = (contractForm, t) => {
    let errorMessage = Immutable.Map();

    if (!contractForm.name.value) {
      errorMessage = errorMessage.set(
        'name',
        t('message:contractNameIsRequired')
      );
    }

    if (!this.state.file) {
      errorMessage = errorMessage.set(
        'attachement',
        t('message:attachmentIsRequired')
      );
    }

    if (this.state.selectedSignees.length === 0) {
      errorMessage = errorMessage.set('signee', t('message:signeeIsRequired'));
    }

    if (!contractForm.contractType.value.trim()) {
      errorMessage = errorMessage.set(
        'contractType',
        t('message:contractTypeIsRequired')
      );
    }

    if (!contractForm.note.value.trim()) {
      errorMessage = errorMessage.set('note', t('message:noteIsRequired'));
    }

    if (!contractForm.startsFrom.value) {
      errorMessage = errorMessage.set(
        'startDate',
        t('message:startDateIsRequired')
      );
    }

    // if (!contractForm.endsOn.value) {
    //   errorMessage = errorMessage.set(
    //     'endDate',
    //     t('message:endDateIsRequired')
    //   );
    // }

    if (
      contractForm.endsOn.value &&
      contractForm.endsOn.value <= contractForm.startsFrom.value
    ) {
      errorMessage = errorMessage.set(
        'invalidDateRange',
        t('message:endDateShouldNotBeLaterThanStartDate')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  };

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  onchangeHandler = (value) => {
    console.log('!!!!!!', value);
    // const selectedSignees = value.map(ele => ele.id);
    this.setState({ selectedSignees: value });
  };

  handleChange = (event) => {
    this.setState({ status: event.target.value });
  };

  getServiceType = (checkedList) => {
    let serviceType = [];
    checkedList.forEach((item, index) => {
      serviceType.push(item.id);
    });
    this.setState({
      serviceType: serviceType,
    });
  };

  CheckedhandleChange = () => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  render() {
    const {
      errorMessage,
      startsFrom,
      endsOn,
      file,
      name,
      status,
      uploadingFile,
      checked,
    } = this.state;
    const {
      t,
      userList,
      selectedContractId,
      classes,
      open,
      contract,
      serviceTypeTree,
      contractList,
    } = this.props;
    console.log(contractList);
    // const contract = { id: selectedContractId, name: 'hahahsk.pdf' };
    return (
      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        style={{ zIndex: '1200', height: '100%' }}
      >
        <DialogTitle>
          {selectedContractId
            ? t('common:Create/Renew Service Contract')
            : t('common:Create/Renew Service Contract')}
        </DialogTitle>
        <DialogContent>
          {uploadingFile && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 2,
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <CircularProgress size={60} style={{ marginTop: '-40px' }} />
              Uploading Contract File
            </div>
          )}

          <form id="contractForm" onSubmit={this.handleSubmit}>
            <div className="row flex-child-auto">
              <div className="small-12 columns">
                <FormInput
                  name="name"
                  label={t('field:Service Contract Name')}
                  defaultValue={name}
                  isRequired={true}
                  onFocus={() => {
                    if (this.removeErrorMessage) {
                      this.removeErrorMessage('name');
                    }
                  }}
                  placeholder={t('field:Client Name_Service Type_Year')}
                  errorMessage={errorMessage ? errorMessage.get('name') : null}
                />
              </div>
            </div>

            <div className="row flex-child-auto">
              <div className="small-12 columns">
                <label style={{ fontSize: '12px' }}>
                  {t('common:Attach Service Contract')}
                </label>
                <Attachment
                  t={t}
                  file={file}
                  handleChange={this.attachFileHandler}
                  handleDelete={this.removeFileHandler}
                  uploading={uploadingFile}
                />
                <span
                  style={{
                    color: '#cc4b37',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {errorMessage ? errorMessage.get('attachement') : null}
                </span>
              </div>
            </div>

            <div
              className="row flex-child-auto"
              style={{ position: 'relative' }}
            >
              <span style={{ fontSize: '12px', paddingLeft: '5px' }}>
                {t('field:signee')}
              </span>
              <span
                style={{ color: 'red', paddingLeft: '4px', fontSize: '12px' }}
              >
                *
              </span>
              <div className="small-12 columns">
                <Autocomplete
                  multiple
                  options={userList}
                  disableCloseOnSelect
                  // defaultValue={this.state.selectedSignees}
                  value={this.state.selectedSignees}
                  onChange={(e, value) => {
                    this.onchangeHandler(value);
                  }}
                  onFocus={() => {
                    if (this.removeErrorMessage) {
                      this.removeErrorMessage('signee');
                    }
                  }}
                  getOptionLabel={(option) => option.fullName}
                  renderOption={(option, { selected }) => {
                    return (
                      <React.Fragment>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                          color="primary"
                        />
                        {option.fullName}
                      </React.Fragment>
                    );
                  }}
                  className={classes.signee}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label=""
                      placeholder=""
                      fullWidth
                    />
                  )}
                />
                <span
                  style={{
                    color: '#cc4b37',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {errorMessage ? errorMessage.get('signee') : null}
                </span>
              </div>
            </div>

            <div
              className="row flex-child-auto"
              style={{ position: 'relative' }}
            >
              <div className="small-6 columns">
                <DatePicker
                  customInput={
                    <FormInput
                      label={t('field:startsFrom')}
                      isRequired={true}
                      name="startsFrom"
                    />
                  }
                  selected={startsFrom}
                  maxDate={endsOn}
                  onChange={(startsFrom) => {
                    this.setState({ startsFrom });
                    if (this.removeErrorMessage) {
                      this.removeErrorMessage('startDate');
                    }
                  }}
                  // onFocus={() => {
                  //   this.setState({ noStartsFromError: '' });
                  // }}
                  placeholderText="mm/dd/yyyy"
                />
                <input
                  name="startsFrom"
                  type="hidden"
                  value={startsFrom ? startsFrom : ''}
                />
                <span
                  style={{
                    color: '#cc4b37',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {errorMessage ? errorMessage.get('startDate') : null}
                </span>
              </div>
              {/* <CalendarIcon
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '24px',
                  color: '#e0e0e0',
                }}
              /> */}

              {/* </div>

            <div
              className="row flex-child-auto"
              style={{ position: 'relative' }}
            > */}
              <div className="small-6 columns">
                <DatePicker
                  customInput={
                    <FormInput
                      label={t('field:endsOn')}
                      // isRequired={true}
                      name="endsOn"
                    />
                  }
                  minDate={startsFrom}
                  selected={endsOn}
                  onChange={(endsOn) => {
                    this.setState({ endsOn });
                    if (this.removeErrorMessage) {
                      this.removeErrorMessage('endDate');
                      this.removeErrorMessage('invalidDateRange');
                    }
                  }}
                  // onFocus={() => {
                  //   this.setState({ noEndsOnError: '' });
                  // }}
                  placeholderText="mm/dd/yyyy"
                />
                <input
                  name="endsOn"
                  type="hidden"
                  value={endsOn ? endsOn : ''}
                />
              </div>
              {/* <CalendarIcon
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '24px',
                  color: '#e0e0e0',
                }}
              /> */}
              <span
                style={{
                  color: '#cc4b37',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                {errorMessage
                  ? errorMessage.get('endDate') ||
                    errorMessage.get('invalidDateRange')
                  : null}
              </span>
            </div>

            <div
              className="row flex-child-auto"
              style={{ position: 'relative' }}
            >
              <span style={{ fontSize: '12px', paddingLeft: '5px' }}>
                {t('field:Service Type')}
              </span>
              <span
                style={{ color: 'red', paddingLeft: '4px', fontSize: '12px' }}
              >
                *
              </span>
              <div className="small-12 columns">
                <Autocomplete
                  options={contractTypeList}
                  value={this.state.contractType}
                  getOptionLabel={(option) => {
                    // console.log('option',option);
                    return option.type;
                  }}
                  onChange={(e, value) => {
                    this.setState({ contractType: value });
                  }}
                  onFocus={() => {
                    if (this.removeErrorMessage) {
                      this.removeErrorMessage('contractType');
                    }
                  }}
                  className={classes.signee}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="contractType"
                      label=""
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <span
                  style={{
                    color: '#cc4b37',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {errorMessage ? errorMessage.get('contractType') : null}
                </span>
                {/* <PotentialServiceTypeSelect
                  data={serviceTypeTree}
                  // value={value}
                  selected={this.state.serviceTypeSelect}
                  sendServiceType={(checkedList) => {
                    this.getServiceType(checkedList);
                  }}
                />
                <span
                  style={{
                    color: '#cc4b37',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {errorMessage ? errorMessage.get('serviceType') : null}
                </span> */}
              </div>
            </div>

            <div className="row flex-child-auto">
              <span style={{ fontSize: '12px', paddingLeft: '5px' }}>
                {t('field:feeTypeAndNotes')}
              </span>
              <span
                style={{ color: 'red', paddingLeft: '4px', fontSize: '12px' }}
              >
                *
              </span>
              <div className="small-12 columns">
                <FormTextArea
                  name="note"
                  // label={t('field:feeTypeAndNotes')}
                  defaultValue={this.state.note}
                  rows="6"
                  onFocus={() => {
                    if (this.removeErrorMessage) {
                      this.removeErrorMessage('note');
                    }
                  }}
                />
                <span
                  style={{
                    color: '#cc4b37',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {errorMessage ? errorMessage.get('note') : null}
                </span>
              </div>
            </div>
            {contract && contract.get('status') !== 'INVALID' ? (
              <div
                className="row flex-child-auto"
                style={{ position: 'relative' }}
              >
                <div className="small-5 columns">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={this.CheckedhandleChange}
                        size="small"
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label="Contract renewal"
                  />
                </div>
                {checked ? (
                  <div className="small-7 columns">
                    <Select
                      name="Lead Source"
                      value={this.state.renewalContract}
                      onChange={(val) => {
                        let newNote = `Contract renewal: “${val.name},”${this.state.note}`;
                        this.setState({
                          renewalContract: val.name,
                          renewalContractId: val.id,
                          note: newNote,
                        });
                      }}
                      options={contractList.toJS()}
                      valueKey={'name'}
                      labelKey={'name'}
                      placeholder={'Select a related contract'}
                      autoBlur={true}
                      searchable={true}
                      clearable={false}
                    />
                  </div>
                ) : null}

                {/* <span style={{ fontSize: '12px', paddingLeft: '5px' }}>
                {t('field:status')}
              </span>
              <span
                style={{ color: 'red', paddingLeft: '4px', fontSize: '12px' }}
              >
                *
              </span>
              <div className="small-12 columns">
                <RadioGroup
                  aria-label="status"
                  name="status"
                  value={status}
                  onChange={this.handleChange}
                  style={{ flexDirection: 'row' }}
                >
                  <FormControlLabel
                    value="VALID"
                    control={<Radio color="primary" />}
                    label="Valid"
                  />
                  <FormControlLabel
                    value="INVALID"
                    control={<Radio color="primary" />}
                    label="Invalid"
                  />
                </RadioGroup>
              </div> */}
              </div>
            ) : null}
          </form>
        </DialogContent>
        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton onClick={this.handleClose}>
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              form="contractForm"
              disabled={this.state.creating}
              style={{ position: 'relative' }}
            >
              {this.state.creating && (
                <CircularProgress
                  size={24}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: -12,
                    marginLeft: -12,
                  }}
                />
              )}
              {t('action:submit')}
            </PrimaryButton>
          </div>
        </DialogActions>
      </Dialog>
    );
  }
}

// AddClientContactForm.propTypes = {
//     client: PropTypes.instanceOf(Immutable.Map),
//     companyEntity: PropTypes.instanceOf(Immutable.Map),
//     handleRequestClose: PropTypes.func.isRequired,
//     t: PropTypes.func.isRequired,
// };

// AddClientContactForm.defaultProps = {
//     client: Immutable.Map(),
//     companyEntity: Immutable.Map()
// };

const mapStateToProps = (state, { selectedContractId, companyId }) => {
  // console.log('[[mapstate]]', selectedContractId);
  const serviceTypeTree = state.model.serviceTypeTree.tree;
  let contract = getContractById(state, selectedContractId);
  let contractList;
  if (contract) {
    contractList = getContractsListByCompany(state, companyId).filter(
      (item, index) => {
        return item.get('name') !== contract.get('name');
      }
    );
  }
  return {
    serviceTypeTree: serviceTypeTree,
    contract: contract,
    contractList: contractList && contractList,
    // .filter((item,index)=>{return item.get('name')!==contract.name}),
    userList: getActiveTenantUserList(state).toJS(),
  };
};

export default connect(mapStateToProps)(
  withStyles(styles)(AddClientContactForm)
);
