import React from 'react';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import FormInput from '../../../../components/particial/FormInput';
import DatePicker from 'react-datepicker';
import FormTextArea from '../../../../components/particial/FormTextArea';
import Divider from '@material-ui/core/Divider';
import moment from 'moment-timezone';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

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

class ProjectExperience extends React.Component {
  constructor(props) {
    super(props);
    const paserBasicInfo = props.basicInfo ? props.basicInfo.toJS() : {};
    this.state = {
      projectList: paserBasicInfo.projects || [],
      copyProject: paserBasicInfo.projects || [],
    };
  }

  addprojectList = () => {
    let arr = [...this.state.projectList];
    let add = [...this.state.copyProject];
    arr.push({
      id: new Date().getTime(),
      startDate: null,
      endDate: null,
      projectName: '',
      title: '',
      description: '',
    });
    add.push({
      id: new Date().getTime(),
      startDate: null,
      endDate: null,
      projectName: '',
      title: '',
      description: '',
    });
    this.setState({
      projectList: arr,
      copyProject: add,
    });
  };

  deleteExperList = (index) => {
    let arr = [...this.state.projectList];
    let add = [...this.state.copyProject];
    arr.splice(index, 1);
    add.splice(index, 1);
    this.setState({
      projectList: arr,
      copyProject: add,
    });
    this.props.removeErrorMessage('projects');
  };

  changeListName = (e, index) => {
    let arr = [...this.state.projectList];
    let add = [...this.state.copyProject];
    arr[index].projectName = e.target.value;
    add[index].projectName = e.target.value;
    this.setState({
      projectList: arr,
      copyProject: add,
    });
    this.props.removeErrorMessage('projects');
  };

  changeListTitle = (e, index) => {
    let arr = [...this.state.projectList];
    let add = [...this.state.copyProject];
    arr[index].title = e.target.value;
    add[index].title = e.target.value;
    this.setState({
      projectList: arr,
      copyProject: add,
    });
    this.props.removeErrorMessage('projects');
  };
  changeListOne = (date, index) => {
    let arr = [...this.state.projectList];
    let add = [...this.state.copyProject];
    arr[index].startDate = date;
    add[index].startDate = new Date(moment(date).format('YYYY-MM-DD')).toJSON();
    this.setState({
      projectList: arr,
      copyProject: add,
    });
    this.props.removeErrorMessage('projects');
    this.props.removeErrorMessage('projectnewInfor');
  };
  changeListTwo = (date, index) => {
    let arr = [...this.state.projectList];
    let add = [...this.state.copyProject];
    arr[index].endDate = date;
    add[index].endDate = new Date(moment(date).format('YYYY-MM-DD')).toJSON();
    this.setState({
      projectList: arr,
      copyProject: add,
    });
    this.props.removeErrorMessage('projects');
    this.props.removeErrorMessage('projectnewInfor');
  };

  changeListDes = (e, index) => {
    let arr = [...this.state.projectList];
    let add = [...this.state.copyProject];
    arr[index].description = e.target.value;
    add[index].description = e.target.value;
    this.setState({
      projectList: arr,
      copyProject: add,
    });
    this.props.removeErrorMessage('projects');
  };

  render() {
    const { t, basicInfo, classes, errorMessage, removeErrorMessage } =
      this.props;
    const { projectList, copyProject } = this.state;
    return (
      <div>
        {projectList.length === 0 ? (
          <div className="flex-container align-justify align-middle">
            <Typography variant="h6"> {t('tab:Project Experience')}</Typography>
            <div className={classes.flex} onClick={this.addprojectList}>
              <AddIcon style={{ color: '#3398dc', fontSize: '21px' }} />
              <p style={{ color: '#3398dc', marginTop: 0 }}> {t('tab:Add')}</p>
            </div>
          </div>
        ) : null}

        {projectList &&
          projectList.map((item, index) => {
            return (
              <>
                <div id={`projects_${index}`}></div>
                <div
                  key={item.id}
                  style={{ marginBottom: 40, position: 'relative' }}
                >
                  <div className="flex-container align-justify align-middle">
                    {index === 0 ? (
                      <Typography variant="h6">
                        {t('tab:Project Experience')}
                        {errorMessage.get('projectnewDate') ? (
                          <div
                            style={{
                              color: '#CC4B37',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              marginBottom: '1rem',
                            }}
                          >
                            {errorMessage.get('projectnewInfor')}
                          </div>
                        ) : null}
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
                    {index === 0 ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {index === 0 ? (
                            <div
                              className={classes.flex}
                              onClick={() => {
                                this.deleteExperList(index);
                              }}
                            >
                              <DeleteOutlineIcon
                                style={{ color: '#e85919', fontSize: '21px' }}
                              />
                              <p style={{ color: '#e85919' }}>
                                {t('tab:Delete')}
                              </p>
                            </div>
                          ) : null}

                          <div
                            className={classes.flex}
                            onClick={this.addprojectList}
                          >
                            <AddIcon
                              style={{ color: '#3398dc', fontSize: '21px' }}
                            />
                            <p style={{ color: '#3398dc', marginTop: 0 }}>
                              {t('tab:Add')}
                            </p>
                          </div>
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
                        <p style={{ color: '#e85919' }}>{t('tab:Delete')}</p>
                      </div>
                    )}
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
                    <div className="small-3 columns">
                      <DatePicker
                        customInput={
                          <FormInput label="&nbsp;" name="endDate" />
                        }
                        minDate={item.startDate ? moment(item.startDate) : null}
                        maxDate={moment(this.state.endDate)}
                        className={classes.fullWidth}
                        selected={item.endDate ? moment(item.endDate) : null}
                        onChange={(date) => {
                          this.changeListTwo(date, index);
                        }}
                        placeholderText="mm/dd/yyyy"
                      />
                      {errorMessage.get('projectDate') &&
                      errorMessage.get('projectDate').includes(index) ? (
                        <div
                          style={{
                            color: '#CC4B37',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            marginBottom: '1rem',
                          }}
                        >
                          {errorMessage.get('projectInfor')}
                        </div>
                      ) : null}
                    </div>

                    <div className="small-5 columns"></div>
                  </div>

                  <div className="row expanded small-12">
                    <div className="small-6 columns">
                      <FormInput
                        name="projectName"
                        label={t('tab:Project name')}
                        value={item.projectName}
                        maxlength={200}
                        onChange={(e) => {
                          this.changeListName(e, index);
                        }}
                      />
                    </div>
                    <div className="small-6 columns">
                      <FormInput
                        name="projectTitle"
                        label={t('tab:Title')}
                        value={item.title}
                        maxlength={200}
                        onChange={(e) => {
                          this.changeListTitle(e, index);
                        }}
                      />
                    </div>
                  </div>

                  <div className="row expanded small-12">
                    <div className="small-12 columns">
                      <FormTextArea
                        label={t('tab:Project description')}
                        name="description"
                        rows={4}
                        value={item.description}
                        maxlength={16380}
                        onChange={(e) => {
                          this.changeListDes(e, index);
                        }}
                      />
                    </div>
                  </div>
                  {errorMessage.get('projectsArr') &&
                  errorMessage.get('projectsArr').includes(index) ? (
                    <div
                      style={{
                        color: '#CC4B37',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        marginBottom: '1rem',
                      }}
                    >
                      {errorMessage.get('projects')}
                    </div>
                  ) : null}
                </div>
              </>
            );
          })}
        <input
          type="hidden"
          name="projects"
          value={JSON.stringify(copyProject)}
          form="candidateBasic"
        />
        <Divider style={{ marginTop: 30, marginBottom: 30 }} />
      </div>
    );
  }
}

const mapStateToProps = (state, { basicInfo }) => {
  return {};
};

export default connect(mapStateToProps)(withStyles(styles)(ProjectExperience));
