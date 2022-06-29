import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { getActiveTenantUserList } from '../../../selectors/userSelector';
import {
  getProgramTeamList,
  deleteProgramTeam,
} from '../../../actions/clientActions';
import { getProgramTeamList as selectProgramTeamList } from '../../../selectors/teamSelector';
import { getIndexList, sortList } from '../../../../utils';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import GroupTable from '../../../components/Tables/GroupTable';
import Loading from '../../../components/particial/Loading';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import AddProjectTeamForm from './AddProjectTeamForm';
import Dialog from '@material-ui/core/Dialog';
import AlertDialog from '../../../components/particial/AlertDialog';
import DeleteMsg from '../../../components/DeleteMsg';

const columns = [
  {
    colName: 'teamName',
    colWidth: 100,
    col: 'name',
    type: 'nameButton',
    // disableSearch: true,
    flexGrow: 1,
    sortable: true,
  },
  {
    colName: 'teamLeader',
    colWidth: 100,
    col: 'users',
    type: 'leader',
    disableSearch: true,
    flexGrow: 3,
  },
  {
    colName: 'teamMembers',
    colWidth: 100,
    col: 'users',
    type: 'list',
    disableSearch: true,
    flexGrow: 3,
  },
  {
    colName: 'createdAt',
    colWidth: 120,
    col: 'createdDate',
    type: 'date',
    disableSearch: true,
    sortable: true,
  },
];
const status = { filterOpen: true };

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

class ProgramTeam extends React.PureComponent {
  constructor(props) {
    super(props);
    this.fTimer = setTimeout(() => {
      this.setState({ show: true });
    }, 850);

    this.state = {
      selected: null,
      upsertOpen: false,
      deleteOpen: false,
      handleDelete: null,
      deleteSelect: null,
      deleteMsgShow: false,
      filteredIndex: getIndexList(
        props.teamList,
        status.filters,
        status.colSortDirs
      ),
      filters: status.filters || Immutable.Map(),
      colSortDirs: status.colSortDirs,
      filterOpen: status.filterOpen || true,
    };
    this.filteredTeamList = Immutable.List();
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    clearTimeout(this.fTimer);
    status.filters = this.state.filters;
    status.filterOpen = this.state.filterOpen;
    status.colSortDirs = this.state.colSortDirs;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.teamList && !nextProps.teamList.equals(this.props.teamList)) {
      this.setState({
        filteredIndex: getIndexList(
          nextProps.teamList,
          this.state.filters,
          this.state.colSortDirs
        ),
      });
    }
  }

  fetchData() {
    const { dispatch, companyId } = this.props;
    dispatch(getProgramTeamList(companyId));
  }

  onFilter = (input) => {
    let filters = this.state.filters;

    let col = input.name;
    let query = input.value;
    if ((filters.get(col) || '') === query) {
      return;
    }
    if (!query) {
      filters = filters.remove(col);
    } else {
      filters = filters.set(col, query);
    }

    this.setState({
      filters,
      filteredIndex: getIndexList(
        this.props.teamList,
        filters,
        this.state.colSortDirs
      ),
    });
  };

  onSortChange = (columnKey, sortDir) => {
    let filteredIndex;

    filteredIndex = sortDir
      ? sortList(
          this.state.filteredIndex,
          this.props.teamList,
          columnKey,
          sortDir
        )
      : getIndexList(this.props.teamList, this.state.filters);

    this.setState({
      filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleOpenEditGroup = (selected) => {
    this.setState({ selected, upsertOpen: true });
  };

  handleClose = () => {
    this.fetchData();
    this.setState({ upsertOpen: false });
  };

  handleOpenDeleteGroup = (selected) => {
    this.setState({
      deleteSelect: this.filteredTeamList.getIn([selected, 'name']),
    });
    const { dispatch } = this.props;
    this.setState({
      handleDelete: () =>
        dispatch(
          deleteProgramTeam(this.filteredTeamList.getIn([selected, 'id']))
        ).then(() => {
          this.setState({ handleDelete: null }, () => {
            this.setState({ deleteMsgShow: true }, () => {
              setTimeout(() => {
                this.setState({ deleteMsgShow: false });
              }, 2000);
            });
          });
        }),
    });
  };
  handleCancelDelete = (e) => {
    this.setState({ handleDelete: null });
  };

  closedDeleteMsg = () => {
    this.setState({
      deleteMsgShow: false,
    });
  };

  render() {
    const { userList, teamList, isAdmin, currentUserId, ...props } = this.props;
    const {
      filters,
      filterOpen,
      colSortDirs,
      selected,
      handleDelete,
      filteredIndex,
      deleteMsgShow,
      deleteSelect,
    } = this.state;
    console.log('render team');

    const filteredTeamList = filteredIndex.map((index) => teamList.get(index));
    if (!this.filteredTeamList.equals(filteredTeamList)) {
      this.filteredTeamList = filteredTeamList;
    }
    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <div>
          <div
            className="flex-container align-middle item-padding"
            style={{ height: 56 }}
          >
            {isAdmin && (
              <div className="item-padding">
                <PrimaryButton
                  onClick={() =>
                    this.setState({ selected: teamList.size, upsertOpen: true })
                  }
                  style={{ minWidth: 120 }}
                >
                  {props.t('action:create')}
                </PrimaryButton>
              </div>
            )}

            <Typography variant="subtitle1" className={'item-padding'}>
              {teamList.size} {props.t('common:Entries')}
            </Typography>
          </div>
          <Divider />
        </div>

        {this.state.show ? (
          <div
            className="flex-child-auto"
            style={{ overflow: 'hidden', position: 'relative' }}
          >
            <GroupTable
              groupList={this.filteredTeamList}
              onScrollEnd={onScrollEnd}
              scrollLeft={status.scrollLeft}
              scrollTop={status.scrollTop}
              columns={columns}
              filters={filters}
              onFilter={this.onFilter}
              filterOpen={filterOpen}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
              onEdit={this.handleOpenEditGroup}
              onDelete={isAdmin && this.handleOpenDeleteGroup}
              t={props.t}
            />
          </div>
        ) : (
          <Loading />
        )}
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="upsert-team-title"
          maxWidth="lg"
          open={this.state.upsertOpen}
          // fullWidth
        >
          <AddProjectTeamForm
            // team={
            //   this.filteredTeamList.get(selected) ||
            //   Immutable.fromJS({
            //     leaderUserId: currentUserId,
            //     users: [],
            //   })
            // }
            team={this.filteredTeamList.get(selected)}
            userList={userList}
            leaderList={userList}
            onClose={this.handleClose}
            isAdmin={isAdmin}
            {...props}
          />
        </Dialog>
        <AlertDialog
          onOK={handleDelete}
          onCancel={this.handleCancelDelete}
          title={props.t('common:deleteGroup')}
          content={'Are you sure you want to delete this Program Team?'}
          okLabel={props.t('action:delete')}
        />
        {deleteMsgShow ? (
          <DeleteMsg
            onClose={this.closedDeleteMsg}
            deleteSelect={deleteSelect}
          />
        ) : null}
      </div>
    );
  }
}

ProgramTeam.propTypes = {
  t: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  userList: PropTypes.instanceOf(Immutable.List).isRequired,
  teamList: PropTypes.instanceOf(Immutable.List).isRequired,
};

function mapStoreStateToProps(state, { companyId }) {
  const authorities = state.controller.currentUser.get('authorities');
  const currentUserId = state.controller.currentUser.get('id');
  const isAdmin =
    !!authorities &&
    (authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' })) ||
      authorities.includes(Immutable.Map({ name: 'ROLE_PRIMARY_RECRUITER' })) ||
      authorities.includes(Immutable.Map({ name: 'ROLE_USER' })));
  return {
    teamList: selectProgramTeamList(state, companyId),
    userList: getActiveTenantUserList(state),
    isAdmin,
    currentUserId,
  };
}

export default connect(mapStoreStateToProps)(ProgramTeam);
