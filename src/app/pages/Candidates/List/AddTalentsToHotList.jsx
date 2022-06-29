import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import hotListSelector from '../../../selectors/hotListSelector';
import { addTalentsToHotList } from '../../../../apn-sdk';

import { Prompt } from 'react-router-dom';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Divider from '@material-ui/core/Divider';

import PrimaryButton from '../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../components/particial/SecondaryButton';
import HotListsTable from '../../../components/Tables/HotListsTable';
import { getIndexList, sortList } from '../../../../utils';
import { getMyHotListList } from '../../../actions/hotlistAction';
import { showErrorMessage } from '../../../actions';
import * as ActionTypes from '../../../constants/actionTypes';
import { Trans } from 'react-i18next';

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

class AddTalentsToHotList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: Immutable.Set(),
      indexList: props.hotListList.map((value, index) => index),
      filters: Immutable.Map(),
      colSortDirs: {},
      processing: false,
    };
  }

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

  componentDidMount = () => {
    this.fetchHotListList();
  };

  fetchHotListList = () => {
    this.props.dispatch(getMyHotListList());
  };

  onSelect = (id) => {
    let selected = this.state.selected;
    if (!selected.includes(id)) {
      this.setState({ selected: Immutable.Set([id]) });
    }
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

  handleClose = () => {
    this.props.onClose();
  };

  handleSubmit = (e) => {
    const { dispatch, talentIds, hotListList, onClose } = this.props;
    const { selected, indexList } = this.state;
    const filteredHotListList = indexList.map((index) =>
      hotListList.get(index)
    );
    const filteredSelected = selected.intersect(
      filteredHotListList.map((list) => list.get('id'))
    );
    const hotlistId = filteredSelected.first();
    this.setState({ processing: true });
    addTalentsToHotList(hotlistId, talentIds)
      .then(({ response }) => {
        console.log(response);
        const hotlist = hotListList.find((hl) => hl.get('id') === hotlistId);
        console.log(hotlist.toJS(), response);
        onClose();

        dispatch({
          type: ActionTypes.ADD_MESSAGE,
          message: {
            type: 'hint',
            message: (
              <Trans i18nKey="message:addTalentToHotlistSuccess">
                <strong>
                  {{ number: response.length.toLocaleString() || '3232' }}
                </strong>
                Candidates has been added to Email Blast Group
                <strong>{{ name: hotlist.get('title') }}</strong>
              </Trans>
            ),
          },
        });
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        this.setState({ processing: false });
      });
  };

  render() {
    const { t, hotListList } = this.props;
    const { selected, indexList, filters, colSortDirs, processing } =
      this.state;
    const filteredHotListList = indexList.map((index) =>
      hotListList.get(index)
    );
    const filteredSelected = selected.intersect(
      filteredHotListList.map((list) => list.get('id'))
    );
    return (
      <>
        <Prompt
          message={(location) =>
            t('message:prompt') + location.pathname + location.search
          }
        />
        <DialogTitle>{t('common:selectHotlist')}</DialogTitle>
        <Divider />
        <div
          className="flex-child-auto"
          style={{ height: 900, overflow: 'hidden' }}
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
        <DialogActions className="container-padding horizontal-layout">
          <SecondaryButton onClick={this.handleClose}>
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton
            disabled={filteredSelected.size === 0}
            onClick={this.handleSubmit}
            processing={processing}
          >
            {t('action:save')}
          </PrimaryButton>
        </DialogActions>
      </>
    );
  }
}

function mapStoreStateToProps(state) {
  return {
    hotListList: hotListSelector(state),
  };
}

export default connect(mapStoreStateToProps)(AddTalentsToHotList);
