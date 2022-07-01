import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import {
  getMyHotListList,
  deleteHotList,
} from '../../../actions/hotlistAction';
import { getIndexList, sortList } from '../../../../utils';
import hotListSelector from '../../../selectors/hotListSelector';
import memoizeOne from 'memoize-one';

import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import FilterIcon from '@material-ui/icons/FilterList';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import PrimaryButton from '../../../components/particial/PrimaryButton';
import HotListsTable from '../../../components/Tables/HotListsTable';
import AddHotlistFormDialog from './AddHotlistFormDialog';
import AlertDialog from '../../../components/particial/AlertDialog';
import AddEmailBlastButton2 from './../List/AddEmailBlastButton2';
import ExportHotlist from './ExportHotlist';

let status = {};
const columns = [
  {
    colName: 'hotlistName',
    colWidth: 160,
    flexGrow: 1,
    col: 'title',
    sortable: true,
    type: 'link',
  },
  {
    colName: 'note',
    colWidth: 160,
    flexGrow: 1,
    col: 'notes',
    sortable: true,
  },

  {
    colName: 'createdAt',
    colWidth: 120,
    col: 'createdDate',
    type: 'date',
    sortable: true,
  },
];

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

class HotLists extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      indexList: getIndexList(
        props.hotListList,
        status.filters,
        status.colSortDirs
      ),
      filters: status.filters || Immutable.Map(),
      chinese: status.chinese || false,
      filterOpen: status.filterOpen || false,
      colSortDirs: status.colSortDirs || {},
      selected: null, // selected contact

      selected2: Immutable.Set(),

      handleDeleteHotlist: null,
    };
  }

  componentWillUnmount(): void {
    status.filters = this.state.filters;
    status.filterOpen = this.state.filterOpen;
    status.colSortDirs = this.state.colSortDirs;
    status.chinese = this.state.chinese;
  }

  componentDidMount() {
    this.fetchData();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.hotListList &&
      !nextProps.hotListList.equals(this.props.hotListList)
    ) {
      this.setState({
        indexList: getIndexList(
          nextProps.hotListList,
          this.state.filters,
          this.state.colSortDirs
        ),
      });
    }
  }

  fetchData() {
    this.props.dispatch(getMyHotListList());
  }

  onSelect = (id) => {
    let { selected2 } = this.state;
    if (selected2.includes(id)) {
      selected2 = selected2.delete(id);
    } else {
      selected2 = selected2.add(id);
    }
    this.setState({ selected2 });
  };

  checkAllBoxOnCheckHandler = () => {
    const { selected2 } = this.state;
    const { hotListList } = this.props;
    const hotlistIds = hotListList.map((hl) => hl.get('id'));
    const filteredSelected = selected2.intersect(hotlistIds);

    if (filteredSelected.size > 0) {
      this.setState({ selected2: selected2.subtract(filteredSelected) });
    } else {
      this.setState({ selected2: selected2.union(hotlistIds) });
    }
  };

  onFilter = (input) => {
    let filters = this.state.filters;

    let col = input.name;
    let query = input.value;
    if (filters.get(col) === query) {
      return;
    }
    if (!query) {
      filters = filters.remove(col);
    } else {
      filters = filters.set(col, query);
    }

    this.setState({
      filters,
      indexList: getIndexList(
        this.props.hotListList,
        filters,
        this.state.colSortDirs
      ),
    });
  };

  onSortChange = (columnKey, sortDir) => {
    let filteredIndex;

    filteredIndex = sortDir
      ? sortList(
          this.state.indexList,
          this.props.hotListList,
          columnKey,
          sortDir
        )
      : getIndexList(this.props.hotListList, this.state.filters);

    this.setState({
      indexList: filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleOpenHotListUpsert = (selected) => {
    this.setState({ selected });
  };

  handleDeleteHotList = (toDelete) => {
    const { dispatch } = this.props;
    this.setState({
      handleDeleteHotlist: () =>
        dispatch(deleteHotList(toDelete)).then(this.handleCancelDeleteHotlist),
    });
  };

  handleCancelDeleteHotlist = () => {
    this.setState({
      handleDeleteHotlist: null,
    });
  };

  render() {
    const { hotListList, tReady, reportNS, defaultNS, i18nOptions, ...props } =
      this.props;
    const {
      chinese,
      filterOpen,
      filters,
      colSortDirs,
      selected,
      selected2,
      indexList,
      handleDeleteHotlist,
    } = this.state;
    const filteredHotListList = indexList.map((index) =>
      hotListList.get(index)
    );

    const filteredSelected = getFilteredSelected(
      selected2,
      filteredHotListList
    );

    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <div>
          <div
            className="flex-container align-middle"
            style={{ padding: '4px 10px' }}
          >
            <div>
              <PrimaryButton
                onClick={() =>
                  this.handleOpenHotListUpsert(filteredHotListList.size)
                }
                style={{ minWidth: 140 }}
              >
                {props.t('action:createHotlist')}
              </PrimaryButton>
            </div>
            <AddEmailBlastButton2
              hotlistIds={filteredSelected}
              {...props}
              chinese={chinese}
            />
            <IconButton
              onClick={() => this.setState({ filterOpen: !filterOpen })}
              color={filterOpen ? 'primary' : 'default'}
            >
              <FilterIcon />
            </IconButton>
            <div className="flex-child-auto" />
            <div className="horizontal-layout">
              <div>
                <FormControlLabel
                  control={
                    <Switch
                      color="primary"
                      checked={chinese}
                      onChange={(e) =>
                        this.setState({ chinese: e.target.checked })
                      }
                    />
                  }
                  label={props.t('Mandarin Speaking')}
                  labelPlacement="start"
                />
              </div>
              <ExportHotlist
                chinese={chinese}
                hotlistIds={filteredSelected}
                {...props}
              />
            </div>
          </div>
          <Divider component="div" />
        </div>
        <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
          <HotListsTable
            columns={columns}
            hotListList={filteredHotListList}
            selected={filteredSelected}
            onSelect={this.onSelect}
            onSelectAll={this.checkAllBoxOnCheckHandler}
            filters={filters}
            onFilter={this.onFilter}
            filterOpen={filterOpen}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
            onScrollEnd={onScrollEnd}
            scrollLeft={status.scrollLeft}
            scrollTop={status.scrollTop}
            onEdit={this.handleOpenHotListUpsert}
            onDelete={this.handleDeleteHotList}
            t={props.t}
          />
        </div>

        <AddHotlistFormDialog
          open={selected !== null}
          onClose={() => this.handleOpenHotListUpsert(null)}
          hotList={filteredHotListList.get(selected)}
          {...props}
        />

        <AlertDialog
          onOK={handleDeleteHotlist}
          onCancel={this.handleCancelDeleteHotlist}
          content={props.t('message:confirmDeleteHotlist')}
          okLabel={props.t('action:delete')}
          cancelLabel={props.t('action:cancel')}
        />
      </Paper>
    );
  }
}

HotLists.propTypes = {
  hotListList: PropTypes.instanceOf(Immutable.List),
};

function mapStoreStateToProps(state) {
  return {
    hotListList: hotListSelector(state),
  };
}

export default withTranslation(['action', 'message', 'field'])(
  connect(mapStoreStateToProps)(HotLists)
);
const getFilteredSelected = memoizeOne((selected, list) => {
  return selected.intersect(list.map((v) => v.get('id')));
});
