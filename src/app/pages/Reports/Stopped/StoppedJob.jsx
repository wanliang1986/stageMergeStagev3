import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import {
  makeCancelable,
  sortList,
  getIndexList,
} from '../../../../utils/index';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  getAllDivisionListByTenantId,
  getStoppedJobReportCount,
  getTeamList,
} from '../../../../apn-sdk/index';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import StoppedJobDetail from './StoppedJobDetail';
import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import Loading from '../../../components/particial/Loading';
import { styles, StoppedJobColumns as columns } from '../params';

class StoppedJob extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dataList: Immutable.List(),
      loading: true,
      filteredIndex: Immutable.List(),
      colSortDirs: {},

      selectedDivision: '',
      divisionOptions: [{ value: '', label: 'All' }],
      selectedTeam: '',
      teamOptions: [{ value: '', label: 'All' }],

      selectedUser: '',
      userOptions: [{ id: '', fullName: 'All' }],
      filteredUserOptions: [{ id: '', fullName: 'All' }],
    };

    this.filteredList = Immutable.List();
  }

  componentDidMount() {
    this.fetchGroupOptions();
    this.fetchData();
  }

  componentWillUnmount() {
    this.task.cancel();
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
    this.task = makeCancelable(getStoppedJobReportCount(searchParams));
    this.task.promise
      .then((res) => {
        const dataList = Immutable.fromJS(res);
        let filteredIndex = getIndexList(dataList);
        blockTimerPromise.then(() =>
          this.setState({
            loading: false,
            dataList,
            filteredIndex,
          })
        );
      })
      .catch((reason) => {
        if (!reason.isCanceled) {
          this.setState({ loading: false });
        }
      });
  };

  onSortChange = (columnKey, sortDir) => {
    const { filteredIndex, dataList } = this.state;
    const preIndex = filteredIndex;

    let indexList;
    indexList = sortDir
      ? sortList(preIndex, dataList, columnKey, sortDir)
      : getIndexList(dataList);

    this.setState({
      filteredIndex: indexList,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleCloseDialog = () => {
    this.setState({
      openDetail: null,
    });
  };

  handleClickStoppedJobCount = ({ amId, am }) => {
    this.setState({ openDetail: { amId, am } });
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
      dataList,
      loading,
      filteredIndex,
      colSortDirs,
      openDetail,
      selectedTeam,
      teamOptions,
      selectedDivision,
      divisionOptions,
      selectedUser,
      filteredUserOptions,
      userOptions,
    } = this.state;

    const filteredList = filteredIndex.map((index) => dataList.get(index));
    if (!this.filteredList.equals(filteredList)) {
      this.filteredList = filteredList;
    }

    if (!dataList) {
      return <Loading />;
    }
    return (
      <Paper
        className={clsx(
          'flex-child-auto flex-container flex-dir-column',
          classes.root
        )}
      >
        <div>
          <Typography variant="h6" style={{ margin: '10px' }}>
            Inactive Job Status Monitor
          </Typography>
          <Typography variant="subtitle1" style={{ margin: '10px' }}>
            No activities during the past three months.
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

        <div className={clsx('flex-child-auto', classes.contentContainer)}>
          <ReportTableSummary
            dataList={this.filteredList}
            columns={columns}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
            handleClickStoppedJobCount={this.handleClickStoppedJobCount}
          />
          {loading && (
            <div
              className={clsx(
                'flex-container flex-dir-column',
                classes.contentMask
              )}
            >
              <Loading />
            </div>
          )}
        </div>

        <Dialog
          open={!!openDetail}
          onClose={this.handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogContent>
            <StoppedJobDetail t={t} {...openDetail} />
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
            >
              {t('action:close')}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

StoppedJob.propTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    briefUsers: state.controller.newCandidateJob.toJS().dialogAllUser,
  };
};

export default withTranslation()(
  connect(mapStateToProps)(withStyles(styles)(StoppedJob))
);
