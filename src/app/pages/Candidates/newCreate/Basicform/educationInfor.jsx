import React from 'react';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Select from 'react-select';

// import PotentialButton from '../../components/particial/PotentialButton';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
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

class EducationInfor extends React.Component {
  constructor(props) {
    const paserBasicInfo = props.basicInfo ? props.basicInfo.toJS() : {};
    console.log(paserBasicInfo);
    super(props);
    this.state = {
      educationList: paserBasicInfo.educations
        ? loadsh.cloneDeep(paserBasicInfo.educations)
        : [],
      copyEduList: paserBasicInfo.educations
        ? loadsh.cloneDeep(paserBasicInfo.educations)
        : [],
    };
  }

  addeducationList = () => {
    let arr = [...this.state.educationList];
    let add = [...this.state.copyEduList];
    arr.push({
      eduId: new Date().getTime(),
      current: false,
      startDate: null,
      endDate: null,
      majorName: '',
      degreeLevel: null,
      collegeName: '',
    });
    add.push({
      eduId: new Date().getTime(),
      current: false,
      startDate: null,
      endDate: null,
      majorName: '',
      degreeLevel: null,
      collegeName: '',
    });
    this.setState({
      educationList: arr,
      copyEduList: add,
    });
  };

  deleteExperList = (index) => {
    let arr = [...this.state.educationList];
    let add = [...this.state.copyEduList];
    arr.splice(index, 1);
    add.splice(index, 1);
    this.setState({
      educationList: arr,
      copyEduList: add,
    });
    this.props.removeErrorMessage('educations');
  };

  changeListFlag = (index) => {
    let arr = [...this.state.educationList];
    let add = [...this.state.copyEduList];
    arr[index].current = !arr[index].current;
    // arr[index].current && (arr[index].endDate = null);
    add[index].current = !add[index].current;
    // add[index].current && (add[index].endDate = null);
    this.setState({
      educationList: arr,
      copyEduList: add,
    });
    this.props.removeErrorMessage('educations');
  };

  changeListMajor = (e, index) => {
    let arr = [...this.state.educationList];
    let add = [...this.state.copyEduList];
    arr[index].majorName = e.target.value;
    add[index].majorName = e.target.value;
    this.setState({
      educationList: arr,
      copyEduList: add,
    });
    this.props.removeErrorMessage('educations');
  };

  changeListDegree = (degree, index) => {
    let arr = [...this.state.educationList];
    let add = [...this.state.copyEduList];
    arr[index].degreeLevel = degree;
    add[index].degreeLevel = degree;
    this.setState({
      educationList: arr,
      copyEduList: add,
    });
    this.props.removeErrorMessage('educations');
  };
  changeListOne = (date, index) => {
    let arr = [...this.state.educationList];
    let add = [...this.state.copyEduList];
    arr[index].startDate = date;
    add[index].startDate = new Date(moment(date).format('YYYY-MM-DD')).toJSON();
    this.setState({
      educationList: arr,
      copyEduList: add,
    });
    this.props.removeErrorMessage('educations');
  };
  changeListTwo = (date, index) => {
    let arr = [...this.state.educationList];
    let add = [...this.state.copyEduList];
    arr[index].endDate = date;
    add[index].endDate = new Date(moment(date).format('YYYY-MM-DD')).toJSON();
    this.setState({
      educationList: arr,
      copyEduList: add,
    });
    this.props.removeErrorMessage('educations');
  };

  changeListSchool = (e, index) => {
    let arr = [...this.state.educationList];
    let add = [...this.state.copyEduList];
    arr[index].collegeName = e.target.value;
    add[index].collegeName = e.target.value;
    this.setState({
      educationList: arr,
      copyEduList: add,
    });
    this.props.removeErrorMessage('educations');
  };

  render() {
    const {
      t,
      basicInfo,
      classes,
      degreeList,
      errorMessage,
      removeErrorMessage,
    } = this.props;
    const { educationList, copyEduList } = this.state;
    return (
      <div>
        {educationList.length === 0 ? (
          <div className="flex-container align-justify align-middle">
            <Typography variant="h6">{'Education Information'}</Typography>
            <div className={classes.flex} onClick={this.addeducationList}>
              <AddIcon style={{ color: '#3398dc', fontSize: '21px' }} />
              <p style={{ color: '#3398dc', marginTop: 0 }}>{'Add'}</p>
            </div>
          </div>
        ) : null}

        {educationList &&
          educationList.map((item, index) => {
            return (
              <>
                <div id={`educations_${index}`}></div>
                <div
                  key={item.eduId}
                  style={{ marginBottom: 40, position: 'relative' }}
                >
                  <div className="flex-container align-justify align-middle">
                    {index === 0 ? (
                      <Typography variant="h6">
                        {'Education Information'}
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
                            onClick={this.addeducationList}
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
                        maxDate={item.endDate && moment(item.endDate)}
                        onChange={(date) => {
                          this.changeListOne(date, index);
                        }}
                        placeholderText="mm/dd/yyyy"
                      />
                    </div>
                    <div>
                      <div style={{ paddingTop: 21, lineHeight: '32px' }}>
                        -
                      </div>
                    </div>
                    {/* {item.current ? (
                    <div
                      className="small-3 columns"
                      style={{ paddingTop: '26px' }}
                    >
                      {'Until Now'}
                    </div>
                  ) : ( */}
                    <div className="small-3 columns">
                      <DatePicker
                        customInput={
                          <FormInput label="&nbsp;" name="endDate" />
                        }
                        minDate={item.startDate ? moment(item.startDate) : null}
                        className={classes.fullWidth}
                        selected={item.endDate ? moment(item.endDate) : null}
                        onChange={(date) => {
                          this.changeListTwo(date, index);
                        }}
                        placeholderText="mm/dd/yyyy"
                      />
                    </div>
                    {/* )} */}

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
                        label={t('field:Currently studying here')}
                      />
                    </div>
                  </div>

                  <div className="row expanded small-12">
                    <div className="small-12 columns">
                      <FormInput
                        name="major"
                        label="Major"
                        value={item.majorName}
                        maxlength={255}
                        onChange={(e) => {
                          this.changeListMajor(e, index);
                        }}
                      />
                    </div>
                  </div>

                  <div className="row expanded small-12">
                    <div className="small-6 columns">
                      <FormReactSelectContainer label={t('field:Degree')}>
                        <Select
                          options={degreeList}
                          value={item.degreeLevel}
                          simpleValue
                          onChange={(degree) => {
                            this.changeListDegree(degree, index);
                          }}
                          noResultsText={''}
                          autoBlur={true}
                          clearable={true}
                          openOnFocus={true}
                        />
                      </FormReactSelectContainer>
                    </div>
                    <div className="small-6 columns">
                      <FormInput
                        name="eduSchool"
                        label="School"
                        maxlength={255}
                        value={item.collegeName}
                        onChange={(e) => {
                          this.changeListSchool(e, index);
                        }}
                      />
                    </div>
                  </div>
                  {errorMessage.get('educationsArr') &&
                  errorMessage.get('educationsArr').includes(index) ? (
                    <div
                      style={{
                        color: '#CC4B37',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        marginBottom: '1rem',
                      }}
                    >
                      {errorMessage.get('educations')}
                    </div>
                  ) : null}
                </div>
              </>
            );
          })}
        <input
          type="hidden"
          name="educations"
          value={JSON.stringify(copyEduList)}
          form="candidateBasic"
        />
        <Divider style={{ marginTop: 30, marginBottom: 30 }} />
      </div>
    );
  }
}

const mapStateToProps = (state, { basicInfo }) => {
  return {
    degreeList: state.controller.candidateSelect.toJS().degreeList,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(EducationInfor));
