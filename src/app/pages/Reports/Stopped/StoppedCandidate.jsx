import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core';
import Immutable from 'immutable';
import { getActiveTenantUserIdList } from '../../../selectors/userSelector';
import {
  getAllDivisionListByTenantId,
  getStoppedCandidateReportCount,
  getTeamList,
} from '../../../../apn-sdk';

import Select from 'react-select';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import SwipeableViews from '../../../components/particial/SwipeableViews';
import Loading from '../../../components/particial/Loading';
import StoppedCandidateTable from './StoppedCandidateTable';
import StoppedCandidateDetail from './StoppedCandidateDetail';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';

import { styles } from '../params';

class StoppedCandidate extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      submittedToAM: Immutable.List(),
      qualifiedByAM: Immutable.List(),
      submittedToClient: Immutable.List(),
      interview: Immutable.List(),
      fetching: true,

      selectedDivision: '',
      divisionOptions: [{ value: '', label: 'All' }],
      selectedTeam: '',
      teamOptions: [{ value: '', label: 'All' }],

      selectedUser: '',
      userOptions: [{ id: '', fullName: 'All' }],
      filteredUserOptions: [{ id: '', fullName: 'All' }],
    };
  }

  componentDidMount() {
    this.fetchGroupOptions();
    this.fetchData();
  }

  fetchGroupOptions = () => {
    Promise.all([
      getTeamList().catch((err) => ({ response: [] })),
      getAllDivisionListByTenantId().catch((err) => ({ response: [] })),
    ]).then(([{ response: teams }, { response: divisions }]) => {
      // console.log(teams, divisions);
      let users = this.props.briefUsers;
      this.setState({
        teamOptions: [{ value: '', label: 'All' }].concat(
          teams.map((team) => {
            team.users = team.users.map((user) => user.id);
            team.value = `${team.id}`;
            team.label = `${team.name}`;
            return team;
          })
        ),
        divisionOptions: [{ value: '', label: 'All' }].concat(
          divisions.map((division) => {
            division.value = `${division.id}`;
            division.label = division.name;
            return division;
          })
        ),
        userOptions: [{ id: '', fullName: 'All' }].concat(
          users
            .filter((u) => u.activated)
            .map((u) => {
              u.fullName =
                u.firstName && u.lastName
                  ? `${u.firstName} ${u.lastName}`
                  : u.username;
              return u;
            })
            .sort((a, b) => {
              a = a.fullName.toLowerCase().trim();
              b = b.fullName.toLowerCase().trim();
              if (a > b) {
                return 1;
              }
              if (a < b) {
                return -1;
              }
              if (a === b) {
                return 0;
              }
            })
        ),
      });
    });
  };

  _blockTimer = (time = 400) => {
    clearTimeout(this.bTimer);
    this.setState({ loading: true });
    return new Promise((resolve) => {
      this.bTimer = setTimeout(resolve, time);
    });
  };

  fetchData = (blockTimerPromise = Promise.resolve()) => {
    console.log('fetchData');
    const { selectedTeam, selectedDivision, selectedUser } = this.state;
    if (this.task) {
      this.task.cancel();
    }
    let searchParams = '';

    if (selectedTeam) {
      searchParams += `&teamId=${selectedTeam.id || ''}`;
    }
    if (selectedDivision) {
      searchParams += `&divisionId=${selectedDivision.id || ''}`;
    }
    if (selectedUser) {
      searchParams += `&userId=${selectedUser}`;
    }

    Promise.all([
      getStoppedCandidateReportCount('Applied', searchParams).catch((err) => {
        console.log(err);
      }),

      getStoppedCandidateReportCount('Qualified', searchParams).catch((err) => {
        console.log(err);
      }),

      getStoppedCandidateReportCount('Submitted', searchParams).catch((err) => {
        console.log(err);
      }),

      getStoppedCandidateReportCount('Interview', searchParams).catch((err) => {
        console.log(err);
      }),
    ])
      .then(([submittedToAM, qualifiedByAM, submittedToClient, interview]) => {
        console.log(submittedToAM, qualifiedByAM, submittedToClient, interview);
        const { activeUsers } = this.props;
        submittedToAM = submittedToAM
          ? Immutable.fromJS(submittedToAM).filter((d) =>
              activeUsers.includes(d.get('id'))
            )
          : Immutable.List();
        qualifiedByAM = qualifiedByAM
          ? Immutable.fromJS(qualifiedByAM).filter((d) =>
              activeUsers.includes(d.get('id'))
            )
          : Immutable.List();
        submittedToClient = submittedToClient
          ? Immutable.fromJS(submittedToClient).filter((d) =>
              activeUsers.includes(d.get('id'))
            )
          : Immutable.List();
        interview = interview
          ? Immutable.fromJS(interview).filter((d) =>
              activeUsers.includes(d.get('id'))
            )
          : Immutable.List();
        blockTimerPromise.then(() => {
          this.setState({
            fetching: false,
            submittedToAM,
            submittedToAMCount: submittedToAM.reduce((count, d) => {
              count += d.get('count');
              return count;
            }, 0),
            qualifiedByAM,
            qualifiedByAMCount: qualifiedByAM.reduce((count, d) => {
              count += d.get('count');
              return count;
            }, 0),
            submittedToClient,
            submittedToClientCount: submittedToClient.reduce((count, d) => {
              count += d.get('count');
              return count;
            }, 0),
            interview,
            interviewCount: interview.reduce((count, d) => {
              count += d.get('count');
              return count;
            }, 0),
          });
        });
      })
      .catch((err) => console.log(err));
  };

  tabsClickHandler = (e, selectedTab) => {
    this.setState({ selectedTab });
  };

  handleCloseDialog = () => {
    this.setState({
      openDetail: null,
    });
  };

  handleClickStoppedCandidateCount = (status) => (recruiterId, recruiter) => {
    this.setState({ openDetail: { recruiterId, recruiter, status } });
  };

  handleTeamChange = (selectedTeam) => {
    selectedTeam = selectedTeam || '';
    if (selectedTeam !== this.state.selectedTeam) {
      let filteredUserOptions = [{ id: '', fullName: 'All' }];
      if (selectedTeam && selectedTeam.value) {
        filteredUserOptions = filteredUserOptions.concat(
          this.state.userOptions.filter((user) =>
            selectedTeam.users.includes(user.id)
          )
        );
      }

      this.setState(
        {
          selectedTeam,
          selectedDivision: '',
          filteredUserOptions,
          selectedUser: '',
        },
        () => {
          this.fetchData(this._blockTimer());
        }
      );
    }
  };

  handleDivisionChange = (selectedDivision) => {
    selectedDivision = selectedDivision || '';
    if (selectedDivision !== this.state.selectedDivision) {
      let filteredUserOptions = [{ id: '', fullName: 'All' }];
      if (selectedDivision && selectedDivision.value) {
        filteredUserOptions = filteredUserOptions.concat(
          this.state.userOptions.filter(
            (user) => user.divisionId === selectedDivision.id
          )
        );
      }

      this.setState(
        {
          selectedDivision,
          selectedTeam: '',
          filteredUserOptions,
          selectedUser: '',
        },
        () => {
          this.fetchData(this._blockTimer());
        }
      );
    }
  };

  handleUserChange = (selectedUser) => {
    this.setState(
      {
        selectedUser: selectedUser || '',
      },
      () => {
        this.fetchData(this._blockTimer());
      }
    );
  };

  render() {
    const { t, classes } = this.props;
    const {
      selectedTab,
      submittedToAM,
      submittedToAMCount,
      qualifiedByAM,
      qualifiedByAMCount,
      submittedToClient,
      submittedToClientCount,
      interview,
      interviewCount,
      fetching,
      openDetail,

      selectedTeam,
      teamOptions,
      selectedDivision,
      divisionOptions,
      selectedUser,
      filteredUserOptions,
      userOptions,
    } = this.state;

    console.log('[company]', openDetail);

    if (fetching) {
      return (
        <div className="flex-child-auto flex-container flex-dir-column">
          <Loading />
        </div>
      );
    }

    const swipeableViews = [
      selectedTab === 0 ? (
        <StoppedCandidateTable
          t={t}
          title={'Submitted to AM'}
          timeRange={'72 hours'}
          dataList={submittedToAM}
          handleClickStoppedCandidateCount={this.handleClickStoppedCandidateCount(
            'Applied'
          )}
        />
      ) : (
        <br />
      ),
      selectedTab === 1 ? (
        <StoppedCandidateTable
          t={t}
          title={'Qualified by AM'}
          timeRange={'72 hours'}
          dataList={qualifiedByAM}
          handleClickStoppedCandidateCount={this.handleClickStoppedCandidateCount(
            'Qualified'
          )}
        />
      ) : (
        <br />
      ),
      selectedTab === 2 ? (
        <StoppedCandidateTable
          t={t}
          title={'Submitted to Client'}
          timeRange={'30 days'}
          dataList={submittedToClient}
          handleClickStoppedCandidateCount={this.handleClickStoppedCandidateCount(
            'Submitted'
          )}
        />
      ) : (
        <br />
      ),
      selectedTab === 3 ? (
        <StoppedCandidateTable
          t={t}
          title={'Interview'}
          timeRange={'30 days'}
          dataList={interview}
          handleClickStoppedCandidateCount={this.handleClickStoppedCandidateCount(
            'Interview'
          )}
        />
      ) : (
        <br />
      ),
    ];

    return (
      <Paper
        className="flex-child-auto flex-container flex-dir-column"
        style={{ position: 'relative' }}
      >
        <div>
          <Typography variant="h6" style={{ margin: '10px' }}>
            Inactive Candidate Status Monitor
          </Typography>
        </div>
        <Divider />
        <div
          className={clsx('horizontal-layout align-bottom', classes.actions)}
        >
          <div>
            <div style={{ minWidth: 228, height: 53 }}>
              <FormReactSelectContainer label={'Division'}>
                {/* t('field:Office') */}
                <Select
                  value={selectedDivision}
                  options={divisionOptions}
                  // simpleValue
                  onChange={this.handleDivisionChange}
                  autoBlur
                  clearable={false}
                />
              </FormReactSelectContainer>
            </div>
          </div>

          <div>
            <div style={{ minWidth: 168, height: 53 }}>
              <FormReactSelectContainer label={t('field:Team')}>
                <Select
                  value={selectedTeam}
                  options={teamOptions}
                  onChange={this.handleTeamChange}
                  // simpleValue
                  autoBlur
                  clearable={false}
                />
              </FormReactSelectContainer>
            </div>
          </div>

          <div>
            <div style={{ minWidth: 168, height: 53 }}>
              <FormReactSelectContainer label={t('field:User')}>
                <Select
                  valueKey="id"
                  labelKey="fullName"
                  value={selectedUser}
                  options={
                    (selectedTeam && selectedTeam.value) ||
                    (selectedDivision && selectedDivision.value)
                      ? filteredUserOptions
                      : userOptions
                  }
                  onChange={this.handleUserChange}
                  autoBlur={true}
                  simpleValue
                  clearable={false}
                />
              </FormReactSelectContainer>
            </div>
          </div>
        </div>
        <Divider style={{ marginTop: 8 }} />

        <Tabs
          value={selectedTab}
          onChange={this.tabsClickHandler}
          variant="scrollable"
          scrollButtons="off"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`Submitted to AM (${submittedToAMCount})`} />
          <Tab label={`Qualified by AM (${qualifiedByAMCount})`} />
          <Tab label={`Submitted to Client (${submittedToClientCount})`} />
          <Tab label={`Interview (${interviewCount})`} />
        </Tabs>

        <SwipeableViews
          index={selectedTab}
          // onChangeIndex={this.handleChangeIndex}
          children={swipeableViews}
        />

        <Dialog
          open={!!openDetail}
          onClose={this.handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogContent>
            <StoppedCandidateDetail
              t={t}
              {...openDetail}
              onRequestClose={this.handleCloseDialog}
            />
          </DialogContent>
          <DialogActions
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
            }}
          >
            <Divider style={{ width: '100%' }} />
            <Button
              style={{ margin: '20px' }}
              onClick={this.handleCloseDialog}
              color="primary"
              variant="contained"
              disableElevation
            >
              {t('action:close')}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activeUsers: getActiveTenantUserIdList(state),
    briefUsers: state.controller.newCandidateJob.toJS().dialogAllUser,
  };
};

export default withTranslation()(
  connect(mapStateToProps)(withStyles(styles)(StoppedCandidate))
);
