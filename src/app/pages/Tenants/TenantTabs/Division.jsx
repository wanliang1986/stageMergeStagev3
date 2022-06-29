import React from 'react';
import { connect } from 'react-redux';
import {
  getAllDivisionList,
  deleteDivision,
} from '../../../actions/divisionActions';
import getDivisionList from '../../../selectors/divisionSelector';
import Immutable from 'immutable';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';

import DivisionTable from '../../../components/Tables/GroupTable';
import AlertDialog from '../../../components/particial/AlertDialog';
import AddDivisionForm from '../AddDivisionForm';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import Loading from '../../../components/particial/Loading';
import { getIndexList, sortList } from '../../../../utils';

const columns = [
  {
    colName: 'officeName',
    colWidth: 80,
    col: 'name',
    type: 'nameButton',
    flexGrow: 1,
    sortable: true,
  },
  {
    colName: 'createdAt',
    colWidth: 160,
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

class Division extends React.Component {
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

      filteredIndex: getIndexList(
        props.divisionList,
        status.filters,
        status.colSortDirs
      ),
      filters: status.filters || Immutable.Map(),
      colSortDirs: status.colSortDirs,
      filterOpen: status.filterOpen || true,
    };
    this.filteredDivisionList = Immutable.List();
  }

  componentDidMount() {
    this.fetchData();
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.divisionList &&
      !nextProps.divisionList.equals(this.props.divisionList)
    ) {
      this.setState({
        filteredIndex: getIndexList(
          nextProps.divisionList,
          this.state.filters,
          this.state.colSortDirs
        ),
      });
    }
  }
  fetchData = () => {
    this.props.dispatch(getAllDivisionList());
  };

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
        this.props.divisionList,
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
          this.props.divisionList,
          columnKey,
          sortDir
        )
      : getIndexList(this.props.divisionList, this.state.filters);

    this.setState({
      filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleOpenEdit = (selected) => {
    this.setState({ selected, upsertOpen: true });
  };

  handleClose = () => {
    this.setState({ upsertOpen: false });
  };

  handleOpenDelete = (selected) => {
    const { dispatch, divisionList } = this.props;
    this.setState({
      handleDelete: () =>
        dispatch(
          deleteDivision(this.filteredDivisionList.getIn([selected, 'id']))
        ).then(this.handleCancelDelete),
    });
  };

  handleCancelDelete = (e) => {
    this.setState({ handleDelete: null });
  };

  render() {
    const { t, divisionList, isAdmin, ...props } = this.props;
    const {
      selected,
      upsertOpen,
      handleDelete,
      filters,
      filterOpen,
      colSortDirs,
      filteredIndex,
    } = this.state;
    const filteredDivisionList = filteredIndex.map((index) =>
      divisionList.get(index)
    );
    if (!this.filteredDivisionList.equals(filteredDivisionList)) {
      this.filteredDivisionList = filteredDivisionList;
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
                  onClick={() => this.handleOpenEdit(divisionList.size)}
                  style={{ minWidth: 120 }}
                >
                  {t('action:create')}
                </PrimaryButton>
              </div>
            )}

            <Typography variant="subtitle1" className={'item-padding'}>
              {divisionList.size} {t('common:Entries')}
            </Typography>
          </div>
          <Divider />
        </div>
        {this.state.show ? (
          <div
            className="flex-child-auto"
            style={{ overflow: 'hidden', position: 'relative' }}
          >
            <DivisionTable
              groupList={filteredDivisionList}
              onScrollEnd={onScrollEnd}
              scrollLeft={status.scrollLeft}
              scrollTop={status.scrollTop}
              columns={columns}
              filters={filters}
              onFilter={this.onFilter}
              filterOpen={filterOpen}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
              onEdit={this.handleOpenEdit}
              // onDelete={isAdmin && this.handleOpenDelete}
              t={t}
            />
          </div>
        ) : (
          <Loading />
        )}

        <Dialog
          open={upsertOpen}
          fullWidth
          maxWidth="sm"
          // onExit={() => this.setState({ selected: null })}
          PaperProps={{ style: { overflow: 'visible' } }}
        >
          <AddDivisionForm
            division={this.filteredDivisionList.get(selected)}
            onClose={this.handleClose}
            isAdmin={isAdmin}
            t={t}
            {...props}
          />
        </Dialog>

        <AlertDialog
          onOK={handleDelete}
          onCancel={this.handleCancelDelete}
          title={t('common:deleteDivision')}
          content={
            'Deleting this division will unassign its users. Are you sure you want to delete it?'
          }
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const authorities = state.controller.currentUser.get('authorities');
  const isAdmin =
    !!authorities &&
    (authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' })) ||
      authorities.includes(Immutable.Map({ name: 'ROLE_HR' })) ||
      authorities.includes(Immutable.Map({ name: 'ROLE_PRIMARY_RECRUITER' })));

  return {
    divisionList: getDivisionList(state),
    isAdmin,
  };
};

export default connect(mapStateToProps)(Division);
