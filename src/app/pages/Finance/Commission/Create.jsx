import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { makeCancelable, getStartSearchParams } from '../../../../utils';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import DialogTitle from '@material-ui/core/DialogTitle';
import getStartList from '../../../selectors/startSelector';
import Divider from '@material-ui/core/Divider';
import StartTable from '../../../components/Tables/StartTable';
import Loading from '../../../components/particial/Loading';
import {
  searchAllStart,
  loadMoreAllStart,
} from '../../../actions/startActions';

import DialogActions from '@material-ui/core/DialogActions';

import CommissionForm from './CommissionForm';
import SecondaryButton from '../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';

const COUNT_PER_PAGE = 30;
const columns = [
  {
    colName: 'employee',
    colWidth: 160,
    flexGrow: 1,
    col: 'talentName',
    type: 'first',
    fixed: true,
    sortable: true,
  },

  {
    colName: 'jobTitle',
    colWidth: 200,
    flexGrow: 1,
    col: 'jobTitle',
    sortable: true,
  },

  {
    colName: 'company',
    colWidth: 160,
    flexGrow: 1,
    col: 'company',
    sortable: true,
  },

  {
    colName: 'positionType',
    colWidth: 180,
    flexGrow: 1,
    type: 'enum',
    col: 'positionType',
    sortable: true,
  },
  {
    colName: 'startDate',
    colWidth: 120,
    flexGrow: 1,
    col: 'startDate',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },
];

const status = {};
const isLoading = {};
function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}
const styles = {
  loadingBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(240,240,240,.5)',
  },
};

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      stepIndex: 0,

      selected: Immutable.Set(),
      criteria: { filters: Immutable.Map(), sortCol: {} },
      searching: false,

      processing: false,
    };
  }

  componentDidMount(): void {
    this.fTimer = setTimeout(() => this.setState({ show: true }), 850);
    const { sort, query } = getStartSearchParams({}, true);
    this.fetchCandidateList(0, status.count || COUNT_PER_PAGE, sort, query);
  }

  onFilter = (input) => {
    let filters = this.state.criteria.filters;
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

    filters = filters.toJSON();
    this._onSearch({
      filters,
      sort: this.state.criteria.sort,
      size: status.count || COUNT_PER_PAGE,
    });
  };

  onSortChange = (columnKey, sortDir) => {
    const sort = sortDir ? { [columnKey]: sortDir } : {};
    const filters = this.state.criteria.filters.toJSON();
    this._onSearch({ filters, sort, size: this.props.startList.size });
  };

  fetchCandidateList = (
    from,
    size,
    sort,
    query,
    blockTimerPromise = Promise.resolve()
  ) => {
    this.candidateTask = makeCancelable(
      this.props.dispatch(searchAllStart(from, size, sort, query))
    );
    this.candidateTask.promise
      .then(() => {
        blockTimerPromise.then(() => this.setState({ searching: false }));
      })
      .catch((reason) => {
        if (reason.isCanceled) {
          console.log('isCanceled');
        } else {
          console.log(reason);
          this.setState({ searching: false });
        }
      });
  };

  _blockTimer = (time = 1000) => {
    clearTimeout(this.bTimer);
    this.setState({ searching: true });
    return new Promise((resolve) => {
      this.bTimer = setTimeout(resolve, time);
    });
  };

  _onSearch = (search) => {
    const { sort, query } = getStartSearchParams(search, true);

    this.setState({
      criteria: {
        sortCol: search.sort,
        filters: Immutable.Map(search.filters),
      },
    });

    this.fetchCandidateList(0, search.size, sort, query, this._blockTimer());
  };

  loadMore = (rowIndex) => {
    const page = Math.floor(rowIndex / COUNT_PER_PAGE);

    if (isLoading[page]) {
      return;
    }
    isLoading[page] = true;

    const { sort, query } = getStartSearchParams(
      {
        filters: this.state.criteria.filters.toJS(),
        sort: this.state.criteria.sortCol,
      },
      true
    );

    const blockTimerPromise = this._blockTimer();
    this.props
      .dispatch(loadMoreAllStart(rowIndex, COUNT_PER_PAGE, sort, query))
      .then(() => {
        isLoading[page] = false;
        blockTimerPromise.then(() => this.setState({ searching: false }));
      })
      .then(() => {
        status.count = this.props.startList.size;
      });
  };

  //single selection once and not cancellable
  onSelect = (id) => {
    let selected = this.state.selected;
    if (!selected.includes(id)) {
      this.setState({
        selected: Immutable.Set([id]),
      });
    }
  };

  beforeApply = () => {
    this.setState({ processing: true });
  };

  afterApply = (commission) => {
    console.log(commission);
    if (commission) {
      this.props.onClose(true);
    } else {
      this.setState({ processing: false });
    }
  };

  handleNext = () => {
    this.setState(({ stepIndex }) => ({ stepIndex: stepIndex + 1 }));
  };

  handlePrev = () => {
    this.setState(({ stepIndex }) => ({ stepIndex: stepIndex - 1 }));
  };

  render() {
    const {
      stepIndex,
      searching,
      criteria: { filters, sortCol },
      selected,
    } = this.state;
    const { t, classes, onClose, startIds, startList, total } = this.props;

    const count = total > startList.size ? startList.size + 1 : total;
    console.log(selected.toJS());

    return (
      <>
        {stepIndex === 0 ? (
          <>
            <DialogTitle>{t('common:selectEmployee')}</DialogTitle>
            <Divider />

            <div
              className="flex-child-auto"
              style={{
                height: 900,
                overflow: 'hidden',
              }}
            >
              {this.state.show && startIds ? (
                <StartTable
                  startList={startList}
                  columns={columns}
                  single={true}
                  count={count}
                  filterOpen={true}
                  onScrollEnd={onScrollEnd}
                  scrollLeft={status.scrollLeft}
                  scrollTop={status.scrollTop}
                  onSelect={this.onSelect}
                  selected={selected}
                  loadMore={this.loadMore}
                  onFilter={this.onFilter}
                  colSortDirs={sortCol}
                  onSortChange={this.onSortChange}
                  filters={filters}
                />
              ) : (
                <Loading />
              )}
              {searching && (
                <div
                  className={clsx(
                    'flex-container flex-dir-column',
                    classes.loadingBackground
                  )}
                >
                  <Loading />
                </div>
              )}
            </div>
            <Divider />
          </>
        ) : (
          <CommissionForm
            t={t}
            startId={selected.first()}
            onSubmit={this.beforeApply}
            onSubmitSuccess={this.afterApply}
          />
        )}

        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton onClick={onClose}>
              {t('action:cancel')}
            </SecondaryButton>
            {this.state.stepIndex === 0 ? (
              <PrimaryButton
                disabled={selected.size === 0}
                onClick={this.handleNext}
              >
                {t('action:next')}
              </PrimaryButton>
            ) : (
              <SecondaryButton
                onClick={this.handlePrev}
                disabled={this.state.processing}
              >
                {t('action:prev')}
              </SecondaryButton>
            )}

            {this.state.stepIndex === 1 && startIds && (
              <PrimaryButton
                disabled={selected.size === 0}
                processing={this.state.processing}
                type="submit"
                form="commissionForm"
              >
                {t('action:create')}
              </PrimaryButton>
            )}
          </div>
        </DialogActions>
      </>
    );
  }
}

function mapStoreStateToProps(state) {
  const startIds = state.controller.searchStarts.all.ids;
  const total = state.controller.searchStarts.all.total;

  return {
    startIds,
    startList: getStartList(state),
    total,
  };
}

export default connect(mapStoreStateToProps)(withStyles(styles)(Create));
