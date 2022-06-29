import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import {
  getMyHotListList,
  addHotListTalent,
} from '../../../actions/hotlistAction';
import { sortList, getIndexList } from '../../../../utils/index';
import { Prompt } from 'react-router-dom';
import hotListSelector from '../../../selectors/hotListSelector';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
//todo: replace by dialog
import SecondaryButton from '../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import HotListsTable from '../../../components/Tables/HotListsTable';

const columns = [
  {
    colName: 'hotlistName',
    colWidth: 160,
    flexGrow: 1,
    col: 'title',
    type: 'link',
    sortable: true,
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
    colWidth: 140,
    col: 'createdDate',
    type: 'date',
    sortable: true,
  },
];

class AddHotList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: Immutable.Set(),
      indexList: props.hotListList.map((value, index) => index),
      filters: Immutable.Map(),
      colSortDirs: {},
    };
  }

  componentDidMount = () => {
    this.fetchHotListList();
  };

  static getDerivedStateFromProps(props, state) {
    const indexList = getIndexList(
      props.hotListList,
      state.filters,
      state.colSortDirs
    );

    if (!indexList.equals(state.indexList)) {
      return { indexList };
    }
    return null;
  }

  fetchHotListList = () => {
    this.props.dispatch(getMyHotListList());
  };

  onSelect = (id) => {
    let selected = this.state.selected;
    if (!selected.includes(id)) {
      this.setState({ selected: Immutable.Set([id]) });
    }
  };

  handleAddHotlist = () => {
    const { dispatch, talentId, hotListList, handleRequestClose } = this.props;
    const { selected, indexList } = this.state;
    const filteredHotListList = indexList.map((index) =>
      hotListList.get(index)
    );
    const filteredSelected = selected.intersect(
      filteredHotListList.map((list) => list.get('id'))
    );
    dispatch(addHotListTalent(filteredSelected.first(), talentId)).then(
      handleRequestClose
    );
  };

  onFilter = (input) => {
    let filters = this.state.filters;

    const col = input.name;
    const query = input.value;
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

  render() {
    const { handleRequestClose, hotListList, t } = this.props;
    const { selected, indexList, filters, colSortDirs } = this.state;
    const filteredHotListList = indexList.map((index) =>
      hotListList.get(index)
    );
    const filteredSelected = selected.intersect(
      filteredHotListList.map((list) => list.get('id'))
    );

    return (
      <div
        className="flex-child-auto flex-container flex-dir-column vertical-layout"
        style={{ overflow: 'hidden', padding: 24 }}
      >
        <Prompt
          message={(location) => t('message:prompt') + location.pathname}
        />

        <div>
          <Typography variant="h5">{t('common:selectHotlist')}</Typography>
        </div>

        <div style={{ marginLeft: -24, marginRight: -24, marginBottom: 0 }}>
          <Divider />
        </div>

        <div
          className="flex-child-auto"
          style={{
            marginLeft: -24,
            marginRight: -24,
            height: 900,

            overflow: 'hidden',
          }}
        >
          <HotListsTable
            columns={columns}
            hotListList={filteredHotListList}
            selected={filteredSelected}
            onSelect={this.onSelect}
            filters={filters}
            filterOpen={true}
            onFilter={this.onFilter}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
          />
        </div>

        <div>
          <div className="horizontal-layout">
            <SecondaryButton onClick={handleRequestClose}>
              {t('action:cancel')}
            </SecondaryButton>

            <PrimaryButton
              disabled={filteredSelected.size === 0}
              onClick={this.handleAddHotlist}
            >
              {t('action:save')}
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }
}

AddHotList.propTypes = {
  talentId: PropTypes.number.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
};

function mapStoreStateToProps(state) {
  return {
    hotListList: hotListSelector(state),
  };
}

export default withTranslation(['action', 'message'], { wait: false })(
  connect(mapStoreStateToProps)(AddHotList)
);
