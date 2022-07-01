import React from 'react';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import FormInput from '../../../../components/particial/FormInput';
import DatePicker from 'react-datepicker';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import moment from 'moment-timezone';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import loadsh from 'lodash';

const styles = {
  fullWidth: {
    width: '100%',
    '&>div': {
      width: '100%',
    },
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginRight: 10,
  },
};

class ExperienceInfor extends React.Component {
  constructor(props) {
    super(props);
    const paserBasicInfo = props.basicInfo ? props.basicInfo.toJS() : {};
    console.log(paserBasicInfo);
    this.state = {
      experienceList: paserBasicInfo.experiences
        ? loadsh.cloneDeep(paserBasicInfo.experiences)
        : [],
      copyExperience: paserBasicInfo.experiences
        ? loadsh.cloneDeep(paserBasicInfo.experiences)
        : [],
    };
  }

  addExperienceList = () => {
    let arr = [...this.state.experienceList];
    let add = [...this.state.copyExperience];
    arr.push({
      experId: new Date().getTime(),
      current: false,
      startDate: null,
      endDate: null,
      title: '',
      company: '',
    });
    add.push({
      experId: new Date().getTime(),
      current: false,
      startDate: null,
      endDate: null,
      title: '',
      company: '',
    });
    this.setState({
      experienceList: arr,
      copyExperience: add,
    });
  };

  deleteExperList = (index) => {
    let arr = [...this.state.experienceList];
    let add = [...this.state.copyExperience];
    arr.splice(index, 1);
    add.splice(index, 1);
    this.setState({
      experienceList: arr,
      copyExperience: add,
    });
    this.props.removeErrorMessage('experienceInfor');
  };

  changeListFlag = (index) => {
    let arr = [...this.state.experienceList];
    let add = [...this.state.copyExperience];
    arr[index].current = !arr[index].current;
    arr[index].current && (arr[index].endDate = null);
    add[index].current = !add[index].current;
    add[index].current && (add[index].endDate = null);
    this.setState({
      experienceList: arr,
      copyExperience: add,
    });
    this.props.removeErrorMessage('experienceInfor');
  };

  changeListTitle = (e, index) => {
    let arr = [...this.state.experienceList];
    let add = [...this.state.copyExperience];
    arr[index].title = e.target.value;
    add[index].title = e.target.value;
    this.setState({
      experienceList: arr,
      copyExperience: add,
    });
    this.props.removeErrorMessage('experienceInfor');
  };

  changeListCompany = (e, index) => {
    let arr = [...this.state.experienceList];
    let add = [...this.state.copyExperience];
    arr[index].company = e.target.value;
    add[index].company = e.target.value;
    this.setState({
      experienceList: arr,
      copyExperience: add,
    });
    this.props.removeErrorMessage('experienceInfor');
  };

  handleStartDateChange = (date, index) => {
    let arr = [...this.state.experienceList];
    let add = [...this.state.copyExperience];
    arr[index].startDate = date;
    add[index].startDate = new Date(moment(date).format('YYYY-MM-DD')).toJSON();
    this.setState({
      experienceList: arr,
      copyExperience: add,
    });
    this.props.removeErrorMessage('experienceInfor');
  };

  handleEndDateChange = (date, index) => {
    let arr = [...this.state.experienceList];
    let add = [...this.state.copyExperience];
    arr[index].endDate = date;
    add[index].endDate = new Date(moment(date).format('YYYY-MM-DD')).toJSON();
    this.setState({
      experienceList: arr,
      copyExperience: add,
    });
    this.props.removeErrorMessage('experienceInfor');
  };

  render() {
    const { t, basicInfo, classes, removeErrorMessage, errorMessage } =
      this.props;
    const { experienceList, copyExperience } = this.state;
    return (
      <div>
        {experienceList.length === 0 ? (
          <div className="flex-container align-justify align-middle">
            <Typography variant="h6">{'Experience Information'}</Typography>
            <div className={classes.flex} onClick={this.addExperienceList}>
              <AddIcon style={{ color: '#3398dc', fontSize: '21px' }} />
              <p style={{ color: '#3398dc', marginTop: 0 }}>{'Add'}</p>
            </div>
          </div>
        ) : null}

        {experienceList &&
          experienceList.map((item, index) => {
            return (
              <>
                <div id={`experienceInfor_${index}`}></div>
                <div
                  key={item.experId}
                  style={{ marginBottom: 40, position: 'relative' }}
                >
                  <div className="flex-container align-justify align-middle">
                    {index === 0 ? (
                      <Typography variant="h6">
                        {'Experience Information'}
                      </Typography>
                    ) : (
                      <Typography variant="h6">{''}</Typography>
                    )}
                  </div>
                  <div
                    style={
                      index === 0
                        ? { position: 'absolute', right: '0px', top: '40px' }
                        : { position: 'absolute', right: '0px', top: '10px' }
                    }
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {index === 0 ? (
                        <>
                          <div
                            className={classes.flex}
                            onClick={() => {
                              this.deleteExperList(index);
                            }}
                          >
                            <DeleteOutlineIcon
                              style={{ color: '#e85919', fontSize: '21px' }}
                            />
                            <p style={{ color: '#e85919' }}>{'Delete'}</p>
                          </div>
                          <div
                            className={classes.flex}
                            onClick={this.addExperienceList}
                          >
                            <AddIcon
                              style={{ color: '#3398dc', fontSize: '21px' }}
                            />
                            <p style={{ color: '#3398dc', marginTop: 0 }}>
                              {'Add'}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div
                          className={classes.flex}
                          onClick={() => {
                            this.deleteExperList(index);
                          }}
                        >
                          <DeleteOutlineIcon
                            style={{ color: '#e85919', fontSize: '21px' }}
                          />
                          <p style={{ color: '#e85919' }}>{'Delete'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="row expanded small-12"
                    style={{ marginTop: 15 }}
                  >
                    <div className="small-3 columns">
                      <DatePicker
                        customInput={
                          <FormInput
                            label={t('field:Duration')}
                            name="Duration"
                          />
                        }
                        className={classes.fullWidth}
                        selected={
                          item.startDate ? moment(item.startDate) : null
                        }
                        onChange={(date) => {
                          this.handleStartDateChange(date, index);
                        }}
                        maxDate={item.endDate && moment(item.endDate)}
                        placeholderText="mm/dd/yyyy"
                      />
                    </div>
                    <div>
                      <div style={{ paddingTop: 21, lineHeight: '32px' }}>
                        -
                      </div>
                    </div>
                    {item.current ? (
                      <div
                        className="small-3 columns"
                        style={{ paddingTop: '26px' }}
                      >
                        {'Until Now'}
                      </div>
                    ) : (
                      <div className="small-3 columns">
                        <DatePicker
                          customInput={
                            <FormInput label="&nbsp;" name="endDate" />
                          }
                          minDate={
                            item.startDate ? moment(item.startDate) : null
                          }
                          className={classes.fullWidth}
                          selected={item.endDate ? moment(item.endDate) : null}
                          onChange={(date) => {
                            this.handleEndDateChange(date, index);
                          }}
                          placeholderText="mm/dd/yyyy"
                        />
                      </div>
                    )}

                    <div
                      className="small-5 columns"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 8,
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="experienceFlag"
                            checked={item.current}
                            onChange={() => {
                              this.changeListFlag(index);
                            }}
                            color="primary"
                          />
                        }
                        label={t('field:Currently working here')}
                      />
                    </div>
                  </div>

                  <div className="row expanded small-12">
                    <div className="small-6 columns">
                      <FormInput
                        name="experTitle"
                        label="Title"
                        value={item.title}
                        onChange={(e) => {
                          this.changeListTitle(e, index);
                        }}
                        maxlength={255}
                        isRequired={true}
                        errorMessage={errorMessage.get('experTitle')}
                        onBlur={() => removeErrorMessage('experTitle')}
                      />
                    </div>
                    <div className="small-6 columns">
                      <FormInput
                        name="experCompany"
                        label="Company"
                        value={item.company}
                        onChange={(e) => {
                          this.changeListCompany(e, index);
                        }}
                        maxlength={255}
                        isRequired={true}
                        errorMessage={errorMessage.get('experCompany')}
                        onBlur={() => removeErrorMessage('experCompany')}
                      />
                    </div>
                  </div>
                  {errorMessage.get('experienceInforArr') &&
                  errorMessage.get('experienceInforArr').includes(index) ? (
                    <div
                      style={{
                        color: '#CC4B37',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        marginBottom: '1rem',
                      }}
                    >
                      {errorMessage.get('experienceInfor')}
                    </div>
                  ) : null}
                </div>
              </>
            );
          })}
        <Divider style={{ marginTop: 30, marginBottom: 30 }} />
        <input
          type="hidden"
          name="experienceInfor"
          value={JSON.stringify(copyExperience)}
          form="candidateBasic"
        />
      </div>
    );
  }
}

const mapStateToProps = (state, { basicInfo }) => {
  return {};
};

export default connect(mapStateToProps)(withStyles(styles)(ExperienceInfor));
